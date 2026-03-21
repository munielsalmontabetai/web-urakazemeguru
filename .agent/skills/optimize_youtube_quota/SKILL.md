---
name: optimize_youtube_quota
description: YouTube Data API v3 のクォータ消費を節約するため、高コストな search.list の利用を必要最小限に抑え、低コストな playlistItems を活用する最適化スキル
---

# `optimize_youtube_quota` スキル

## 概要

YouTube Data API v3 はエンドポイントに応じて消費する「クォータ（Quota）」が大きく異なります。
特に `search.list` は **1回で100ユニット** も消費するため、無闇に呼び出すと1日の無料枠（10,000ユニット）をすぐに使い切ってしまいます。
これに対し `playlistItems.list` や `videos.list`, `channels.list` は **1回につき1ユニット** しか消費しません。

このスキルは、**過去の動画・配信アーカイブ・ショート動画** は低コストな「読み取り（list）」で一括取得し、**未来の配信（予定）や現在の配信（ライブ）** のみ検索を使うハイブリッド手法によって、大量の情報を取得しつつクォータを極限まで節約する実装パターンです。

## 最適化のルール

1. **チャンネルの「アップロード済み」プレイリストを利用する**
   - チャンネル内の全動画は、自動的に生成される「アップロード済み（Uploads）」プレイリストに追加されています。
   - `channels.list` API (1ユニット) に `part=contentDetails` を指定して `relatedPlaylists.uploads` の ID を取得します。
2. **直近50件の情報を一括取得する**
   - 取得した Uploads プレイリスト ID に対して `playlistItems.list` API (1ユニット) を呼び出し、`maxResults=50` で最新の50件を取得します。これで過去のアーカイブやショート動画をカバーできます。
3. **動画の詳細情報を取得する**
   - `playlistItems` だけでは「動画の長さ（Shortsかの判定）」や「配信状態（アーカイブか否か）」が分かりません。
   - 取得した最大50件の `videoId` をカンマ区切りにして `videos.list` API (1ユニット) に渡し、`part=snippet,contentDetails,liveStreamingDetails` を取得します。
   - **ここまでたったの3ユニットで直近50件の詳細データをすべて取得できます。**
4. **配信中 (Live) と配信予定 (Upcoming) だけ Search API を許容**
   - 未来の配信枠や突発のライブ配信は、Uploads プレイリストの先頭50件から溢れる（※予定枠をかなり前に作成した場合など）可能性があるため、安全を期して `search.list` (100ユニット) を使用します。
   - `eventType=upcoming` と `eventType=live` で検索を行います。

5. **ローカルで配列をマージ＆ソートする**
   - 読み取り API (Playlist) で得た「過去のリスト」と、検索 API (Search) で得た「未来・現在のリスト」を JS の配列として結合し、重複を排除（IDで一意化）した上で、日付順にソート（`sort()`）し、UI層に返却します。

## 最新の最適化アプローチ（より堅牢・低燃費に）

1. **チャンネルIDからUploads IDを「計算」して1ユニット節約**
   - チャンネルID（例: `UC...`）の先頭2文字を `UU` に置き換えるだけで、アップロード済みプレイリストIDになります。
   - これにより最初の `channels.list` すら不要になり、**0ユニット**でIDが手に入ります。

2. **`Promise.all` による並列フェッチと `fields` による軽量化**
   - プレイリストの取得と、検索API（Live/Upcoming）の取得を並列化（`Promise.all`）して速度を稼ぎます。
   - `&fields=...` を付与し、APIからのレスポンスから不要な項目を除外して通信量とパース処理を軽量化します。

3. **IDを一意にして詳細を取得**
   - 取得したアイテム群からIDだけを取り出し、`Set` で一意にした上で `videos.list` (1ユニット) にかけて詳細（サムネイルやライブステータス）を一括取得します。

4. **Next.js の Data Cache と React Cache の二重がけ**
   - Next.js の `unstable_cache` (サーバー間でのキャッシュ) と、React の `cache` (1リクエスト内のコンポーネント間キャッシュ) を組み合わせてフェッチ関数全体をラップします。
   - これにより、`Index` ページや `Schedule` ページなど複数のサーバーコンポーネントから同時に呼ばれても、1時間に最大1回（最小限のユニット消費）しかAPIリクエストが飛ばないように強固な重複排除を行います。

## コード実装例

```typescript
import { unstable_cache } from "next/cache";
import { cache } from "react";

// React Cache と Next.js Data Cacheで関数全体を完全にメモ化
export const fetchYouTubeStreams = unstable_cache(
  cache(async () => {
    // 1. チャンネルIDからUploads IDを生成 (0 units)
    const uploadsPlaylistId = "UU" + channelId.substring(2);

    // 2. 並列で「最新50件」と「ライブ/予定枠」を取得
    const [playlistRes, liveRes, upcomingRes] = await Promise.all([
      fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&fields=items(snippet(resourceId(videoId)))&key=${apiKey}`,
      ),
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&fields=items(id(videoId))&key=${apiKey}`,
      ), // 100 units
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=upcoming&fields=items(id(videoId))&key=${apiKey}`,
      ), // 100 units
    ]);

    // ... レスポンスのJSON化処理

    // 3. IDを抽出して一意化 (Setを使用)
    const allVideoIds = new Set([
      ...(playlistData.items || []).map(
        (i: any) => i.snippet.resourceId.videoId,
      ),
      ...(liveData.items || []).map((i: any) => i.id.videoId),
      ...(upcomingData.items || []).map((i: any) => i.id.videoId),
    ]);

    // 4. videos.list で詳細を一括取得 (1 unit / 50件まで)
    const videosIdsString = Array.from(allVideoIds).slice(0, 50).join(",");
    const videosRes = await fetch(
      `.../videos?part=snippet,contentDetails,liveStreamingDetails&id=${videosIdsString}&fields=...`,
    );

    // (中略) 戻り値の返却
    return { live, upcoming, archives };
  }),
  ["youtube-streams-cache"],
  { revalidate: 3600, tags: ["youtube-streams"] },
);
```

これにより、すべての動画を `search.list` で探す従来の方法に比べ、大幅なコスト削減とレスポンスの高速化が見込めます。
