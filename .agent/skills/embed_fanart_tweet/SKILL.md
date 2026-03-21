---
name: embed_fanart_tweet
description: X APIを使わずに `react-tweet` を用いて、X (Twitter) のファンアート投稿などのポストをクライアントの設定から動的に埋め込み表示するスキル
---

# `embed_fanart_tweet` スキル

## 概要
Vercel製の `react-tweet` パッケージを使用し、公式のX API（有料）を一切使わずにX (Twitter) のポストを高品質・高速にサイトへ埋め込むためのスキルです。VTuberのサイトにおいて、リスナーからのファンアート（FA）紹介や、重要な告知ポストを表示する際などに活用します。

## 仕様とルール
1. **X APIの利用禁止**: 
   X APIを使わず、`react-tweet` の `<Tweet />` コンポーネントのみでデータをレンダリングします。これにより、クライアントにAPIキー取得の手間やコストの負担をかけません。

2. **設定ファイル駆動**:
   埋め込みたいポストのリストは `src/config/userConfig.ts`（または専用の静的ファイル）で配列として管理します。
   ```typescript
   export const userConfig = {
     // ...
     fanarts: {
       enabled: true,
       // ポストのURLをそのまま、あるいはステータスIDのみを格納する
       // 例: "https://x.com/username/status/1234567890" または "1234567890"
       tweets: [
         "https://x.com/vercel/status/1673812833075027969",
         "1673812833075027969"
       ]
     }
   }
   ```

3. **URLからのID抽出**:
   `<Tweet />` コンポーネントは投稿の `id`（文字列）を引数に取るため、クライアントが設定ファイルにフルURLを記述した場合でも、正規表現等を用いて自動的にステータスID部分のみを抽出するヘルパー関数を実装します。
   例:
   ```typescript
   export function extractTweetId(urlOrId: string): string {
     const match = urlOrId.match(/(?:x\.com|twitter\.com)\/(?:.*?)\/status\/(\d+)/);
     return match ? match[1] : urlOrId;
   }
   ```

4. **コンポーネントの実装例**:
   - サーバーコンポーネントまたはクライアントコンポーネントで利用可能です。
   - 複数のポストを並べる際は、CSS Columns（Tailwindの `columns-` ユーティリティ）と `break-inside-avoid` を用いた **Masonry（タイル状）レイアウト** を採用することで、縦長のファンアートや文字量の多いポストがすき間なく美しく自動配置されます。

   ```tsx
   import { Tweet } from 'react-tweet';
   import { extractTweetId } from '@/core/utils/tweet';
   import { userConfig } from '@/config/userConfig';

   export default function FanartGallery() {
     if (!userConfig.fanarts.enabled || userConfig.fanarts.tweets.length === 0) return null;

     return (
       <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
         {userConfig.fanarts.tweets.map((urlOrId) => (
           <div key={urlOrId} className="w-full break-inside-avoid h-fit">
             <Tweet id={extractTweetId(urlOrId)} />
           </div>
         ))}
       </div>
     );
   }
   ```

## 導入時の手順
1. パッケージのインストール: `pnpm add react-tweet`
2. 上記のヘルパー関数 `extractTweetId` を `src/core/utils/` 配下等に作成。
3. `userConfig.ts` に `fanarts` プロパティのスキーマと初期データを追加。
4. UIコンポーネントの作成とページ（Mainなど）への組み込み。
