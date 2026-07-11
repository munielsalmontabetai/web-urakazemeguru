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

  // 現在配信中のもの。同時配信（Twitch + YouTube、YouTubeで複数枠など）でも
  // 取りこぼさないよう全件を保持する。表示順はTwitchを優先する。
  const activeStreams = [...(twitch ? [twitch] : []), ...youtube.live];

  return {
    activeStreams,
    upcomingStreams: youtube.upcoming,
    recentArchives: youtube.archives,
    updatedAt: new Date().toISOString(),
  };
}
