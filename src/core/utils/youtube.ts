import { userConfig } from "@/config/userConfig";
import { StreamItem } from "../types/streaming";
import { cache } from "react";

/**
 * YouTube API v3 を使用して配信情報を取得します。
 * API_CACHE_KV を使用してCloudflare上に手動で1時間キャッシュし、
 * Quota消費を最小限に抑えます。
 */

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

// cache(Reactの1リクエスト内メモリキャッシュ) で同一リクエスト内の重複排除を行います。
// サーバー間の長期キャッシュは Cloudflare KV (API_CACHE_KV) が担います。
export const fetchYouTubeStreams = cache(
  async (): Promise<{
    live: StreamItem[];
    upcoming: StreamItem[];
    archives: StreamItem[]; // 過去の動画・アーカイブ・ショートなどもここに含まれます
  }> => {
    const { apiKey, channelId } = userConfig.platforms.youtube;

    if (!apiKey || !channelId) {
      return { live: [], upcoming: [], archives: [] };
    }

    const KV = process.env.NEXT_INC_CACHE_KV;
    const cacheKey = `yt_streams_${channelId}`;

    // 1. KVからキャッシュ取得を試みる
    if (KV) {
      try {
        const cached = await KV.get<{
          live: StreamItem[];
          upcoming: StreamItem[];
          archives: StreamItem[];
        }>(cacheKey, { type: "json" });
        if (cached) {
          console.log(`[YouTube API] Cache HIT for ${channelId}`);
          return cached;
        }
      } catch (err) {
        console.warn("[YouTube API] KV Get Error:", err);
      }
    }

    try {
      console.log(`[YouTube API] Fetching new data for ${channelId} (Quota will be consumed)`);
      // 1. チャンネルIDから Uploads プレイリストIDを計算作成 (Quota: 0 units)
      // チャンネルID `UC...` を `UU...` にするだけでアップロード動画のプレイリストIDになります。
      const uploadsPlaylistId = "UU" + channelId.substring(2);

      // 2. 「最新50件」と「配信中」「配信予定」を並列取得
      // KVでキャッシュするためNext.js自体のキャッシュは無効化(no-store)するかデフォルトのままとする
      const [playlistRes, liveRes, upcomingRes] = await Promise.all([
        // 過去のアーカイブ・動画 (Quota: 1 unit)
        fetch(
          `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&fields=items(snippet(resourceId(videoId)))&key=${apiKey}`
        ),
        // 現在のライブ配信 (Quota: 100 units)
        fetch(
          `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&type=video&eventType=live&fields=items(id(videoId))&key=${apiKey}`
        ),
        // 未来の予定配信 (Quota: 100 units)
        fetch(
          `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&type=video&eventType=upcoming&fields=items(id(videoId))&key=${apiKey}`
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
        `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,liveStreamingDetails&id=${videoIdsString}&fields=items(id,snippet(title,publishedAt,thumbnails,liveBroadcastContent),contentDetails(duration),liveStreamingDetails)&key=${apiKey}`
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
          archives.push(streamItem);
        }
      });

      // 過去動画は新しい順（降順）に並び替える
      archives.sort((a, b) => {
        const timeA = new Date(a.actualStartTime || a.scheduledStartTime || 0).getTime();
        const timeB = new Date(b.actualStartTime || b.scheduledStartTime || 0).getTime();
        return timeB - timeA;
      });

      const result = {
        live,
        upcoming,
        archives,
      };

      // 6. KVへ結果を保存 (1時間 = 3600秒)
      if (KV) {
        await KV.put(cacheKey, JSON.stringify(result), {
          expirationTtl: 3600,
        }).catch((err) => console.warn("[YouTube API] KV Put Error:", err));
      }

      return result;
    } catch (error) {
      console.error("fetchYouTubeStreams error:", error);
      return { live: [], upcoming: [], archives: [] };
    }
  }
);

export interface ChannelStats {
  subscriberCount: number;
  videoCount: number;
  publishedAt: string;
}

/**
 * YouTube API v3 を使用してチャンネル統計情報を取得します。
 * (登録者数、動画本数、開設日)
 */
export const getYouTubeChannelStats = cache(
  async (): Promise<ChannelStats | null> => {
    const { apiKey, channelId, showStats } = userConfig.platforms.youtube;

    if (!apiKey || !channelId || !showStats) {
      return null;
    }

    const KV = process.env.NEXT_INC_CACHE_KV;
    const cacheKey = `yt_channel_stats_${channelId}`;

    if (KV) {
      try {
        const cached = await KV.get<ChannelStats>(cacheKey, { type: "json" });
        if (cached) {
          return cached;
        }
      } catch (err) {
        console.warn("[YouTube API] KV Get Error (Stats):", err);
      }
    }

    try {
      const res = await fetch(
        `${YOUTUBE_API_BASE}/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
      );

      if (!res.ok) {
        return null;
      }

      const data = (await res.json()) as any;
      const channel = data.items?.[0];

      if (!channel) {
        return null;
      }

      const stats: ChannelStats = {
        subscriberCount: parseInt(channel.statistics.subscriberCount, 10) || 0,
        videoCount: parseInt(channel.statistics.videoCount, 10) || 0,
        publishedAt: channel.snippet.publishedAt,
      };

      if (KV) {
        await KV.put(cacheKey, JSON.stringify(stats), {
          expirationTtl: 3600, // 1時間キャッシュ
        }).catch((err) => console.warn("[YouTube API] KV Put Error (Stats):", err));
      }

      return stats;
    } catch (error) {
      console.error("getYouTubeChannelStats error:", error);
      return null;
    }
  }
);
