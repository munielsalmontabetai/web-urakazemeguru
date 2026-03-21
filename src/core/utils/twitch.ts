import { userConfig } from "@/config/userConfig";
import { StreamItem } from "../types/streaming";

/**
 * Twitch API を使用して配信状況を取得します。
 */

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getTwitchAccessToken(): Promise<string | null> {
  const { clientId, secretId } = userConfig.platforms.twitch;

  if (!clientId || !secretId) return null;

  // キャッシュされたトークンが有効なら返す
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const res = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${secretId}&grant_type=client_credentials`,
      { method: "POST" }
    );
    const data = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };

    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return data.access_token;
  } catch (error) {
    console.error("Twitch access token error", error);
    return null;
  }
}

export async function fetchTwitchStream(): Promise<StreamItem | null> {
  const { clientId, channelId } = userConfig.platforms.twitch;
  const accessToken = await getTwitchAccessToken();

  if (!clientId || !channelId || !accessToken) return null;

  try {
    const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channelId}`, {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 600 }, // TwitchはYouTubeより頻繁に更新（10分）
    });

    const data = (await res.json()) as {
      data?: Array<{
        id: string;
        title: string;
        thumbnail_url: string;
        started_at: string;
        viewer_count: number;
      }>;
    };
    const stream = data.data?.[0];

    if (!stream) return null;

    return {
      id: stream.id,
      platform: "twitch",
      status: "live",
      title: stream.title,
      thumbnailUrl: stream.thumbnail_url.replace("{width}", "1280").replace("{height}", "720"),
      url: `https://www.twitch.tv/${channelId}`,
      actualStartTime: stream.started_at,
      viewerCount: stream.viewer_count,
    };
  } catch (error) {
    console.error("fetchTwitchStream error", error);
    return null;
  }
}
