import { userConfig } from "@/config/userConfig";
import { StreamItem } from "../types/streaming";
import { unstable_cache } from "next/cache";
import { cache } from "react";

/**
 * YouTube API v3 を使用して配信情報を取得します。
 * クォータ節約のため、Next.jsのタグベースのキャッシュやISRを利用することを前提とします。
 */

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

// unstable_cache(Next.jsのサーバー間データキャッシュ) と cache(Reactの1リクエスト内メモリキャッシュ) を併用して完全にリクエストを重複排除します。
export const fetchYouTubeStreams = unstable_cache(
  cache(async (): Promise<{
    live: StreamItem[];
    upcoming: StreamItem[];
    archives: StreamItem[]; // 過去の動画・アーカイブ・ショートなどもここに含まれます
  }> => {
  const { apiKey, channelId } = userConfig.platforms.youtube;

  if (!apiKey || !channelId) {
    return { live: [], upcoming: [], archives: [] };
  }

  try {
    // 1. チャンネルIDから Uploads プレイリストIDを計算作成 (Quota: 0 units)
    // チャンネルID `UC...` を `UU...` にするだけでアップロード動画のプレイリストIDになります。
    const uploadsPlaylistId = "UU" + channelId.substring(2);

    // 2. 「最新50件」と「配信中」「配信予定」を並列取得 (Next.jsのfetchキャッシュを3600秒で有効化)
    const fetchOptions = {
      next: { revalidate: 3600, tags: ["youtube-streams"] },
    };

    const [playlistRes, liveRes, upcomingRes] = await Promise.all([
      // 過去のアーカイブ・動画 (Quota: 1 unit)
      fetch(
        `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&fields=items(snippet(resourceId(videoId)))&key=${apiKey}`,
        fetchOptions
      ),
      // 現在のライブ配信 (Quota: 100 units)
      fetch(
        `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&type=video&eventType=live&fields=items(id(videoId))&key=${apiKey}`,
        fetchOptions
      ),
      // 未来の予定配信 (Quota: 100 units)
      fetch(
        `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&type=video&eventType=upcoming&fields=items(id(videoId))&key=${apiKey}`,
        fetchOptions
      ),
    ]);

    // それぞれレスポンスをJSON化。エラー時は空オブジェクトとして扱う
    const [playlistData, liveData, upcomingData] = (await Promise.all([
      playlistRes.ok ? playlistRes.json() : Promise.resolve({ items: [] }),
      liveRes.ok ? liveRes.json() : Promise.resolve({ items: [] }),
      upcomingRes.ok ? upcomingRes.json() : Promise.resolve({ items: [] }),
    ])) as [any, any, any];

    // 3. 全ての結果から Video ID を抽出し、Setで重複を排除
    const allVideoIds = new Set<string>([
      ...(playlistData.items || []).map((i: any) => i.snippet?.resourceId?.videoId).filter(Boolean),
      ...(liveData.items || []).map((i: any) => i.id?.videoId).filter(Boolean),
      ...(upcomingData.items || []).map((i: any) => i.id?.videoId).filter(Boolean),
    ]);

    const videoIdsString = Array.from(allVideoIds).slice(0, 50).join(",");

    if (!videoIdsString) {
      return { live: [], upcoming: [], archives: [] };
    }

    // 4. 重複排除したIDリストに対して videos.list で詳細情報を一括取得 (Quota: 1 unit)
    // liveStreamingDetailsでライブ状態を判定し、contentDetailsでショート等の長さを判定可能
    const videosRes = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,liveStreamingDetails&id=${videoIdsString}&fields=items(id,snippet(title,publishedAt,thumbnails,liveBroadcastContent),contentDetails(duration),liveStreamingDetails)&key=${apiKey}`,
      fetchOptions
    );

    if (!videosRes.ok) {
      return { live: [], upcoming: [], archives: [] };
    }

    const videosData = (await videosRes.json()) as any;

    const live: StreamItem[] = [];
    const upcoming: StreamItem[] = [];
    const archives: StreamItem[] = [];

    // 5. 取得した動画詳細からカテゴリに振り分け
    (videosData.items || []).forEach((item: any) => {
      // APIから返る liveBroadcastContent は 'live', 'upcoming', 'none' のいずれか
      const broadcastStatus = item.snippet?.liveBroadcastContent || "none";
      // 過去のアーカイブかどうかの判定（配信終了済みのもの）
      const isCompletedBroadcast = !!item.liveStreamingDetails?.actualEndTime;

      const streamItem: StreamItem = {
        id: item.id,
        platform: "youtube",
        status:
          broadcastStatus === "live"
            ? "live"
            : broadcastStatus === "upcoming"
            ? "upcoming"
            : "none",
        title: item.snippet?.title || "",
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          "",
        url: `https://www.youtube.com/watch?v=${item.id}`,
        // 予定時刻があればそれを、なければ公開日時を優先
        scheduledStartTime:
          item.liveStreamingDetails?.scheduledStartTime ||
          item.snippet?.publishedAt,
        actualStartTime:
          item.liveStreamingDetails?.actualStartTime ||
          item.snippet?.publishedAt,
      };

      if (broadcastStatus === "live") {
        live.push(streamItem);
      } else if (broadcastStatus === "upcoming") {
        upcoming.push(streamItem);
      } else {
        // liveでもupcomingでもないものは過去動画/アーカイブ枠
        // ショート動画などをフロントで弾きたい場合は、ここで streamItem に duration を持たせるなどの拡張が可能
        archives.push(streamItem);
      }
    });

    // 過去動画は新しい順（降順）に並び替える
    archives.sort((a, b) => {
      const timeA = new Date(a.actualStartTime || a.scheduledStartTime || 0).getTime();
      const timeB = new Date(b.actualStartTime || b.scheduledStartTime || 0).getTime();
      return timeB - timeA;
    });

    return {
      live,
      upcoming,
      archives, // 上限6件の縛りを廃止し、取得した全件（最大50件）を返却
    };
  } catch (error) {
    console.error("fetchYouTubeStreams error:", error);
    return { live: [], upcoming: [], archives: [] };
  }
}), ["youtube-streams-cache"], { revalidate: 3600, tags: ["youtube-streams"] });
