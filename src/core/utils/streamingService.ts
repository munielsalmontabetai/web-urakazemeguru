import { fetchYouTubeStreams } from "./youtube";
import { fetchTwitchStream } from "./twitch";
import { StreamScheduleResult } from "../types/streaming";

/**
 * YouTubeとTwitchの配信情報を統合します。
 */
export async function getStreamingSchedule(): Promise<StreamScheduleResult> {
  const [youtube, twitch] = await Promise.all([
    fetchYouTubeStreams(),
    fetchTwitchStream(),
  ]);

  // 現在配信中のもの（Twitchを優先、なければYouTube）
  const activeStream = twitch || youtube.live[0];

  return {
    activeStream,
    upcomingStreams: youtube.upcoming,
    recentArchives: youtube.archives,
    updatedAt: new Date().toISOString(),
  };
}
