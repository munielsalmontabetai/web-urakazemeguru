import { HeroVisual } from "@/components/ui/custom/HeroVisual";
import { Introduction } from "@/components/ui/custom/Introduction";
import { FanartGrid } from "@/components/ui/custom/FanartGrid";
import { Links } from "@/components/ui/custom/Links";
import { Achievements } from "@/components/ui/custom/Achievements";
import { AdditionalAchievements } from "@/components/ui/custom/AdditionalAchievements";
import { StreamSchedule } from "@/components/ui/custom/StreamSchedule";
import { getStreamingSchedule } from "@/core/utils/streamingService";
import { getYouTubeChannelStats } from "@/core/utils/youtube";
import { LandingPageContent } from "@/components/layout/LandingPageContent";
import { StreamScheduleResult } from "@/core/types/streaming";

/**
 * メインのランディングページ。
 * サーバーコンポーネントとして、配信スケジュール情報をフェッチします
 *
 * 動的レンダリング (force-dynamic) を採用。
 * APIクォータは youtube.ts 内の KVキャッシュが保護するため、
 * ページ自体は毎リクエスト実行してライブ/スケジュールを素早く反映する。
 */
export const dynamic = "force-dynamic";

// 取得失敗時に全画面エラーへ落とさないための安全なフォールバック
const EMPTY_SCHEDULE: StreamScheduleResult = {
  activeStream: undefined,
  upcomingStreams: [],
  recentArchives: [],
  updatedAt: new Date(0).toISOString(),
};

export default async function Home() {
  // 配信データをサーバーサイドで取得（内部KVキャッシュで保護）
  // 個別に握りつぶし、片方が失敗してもページ全体は描画する
  const [streamingResult, channelResult] = await Promise.allSettled([
    getStreamingSchedule(),
    getYouTubeChannelStats(),
  ]);

  const streamingData =
    streamingResult.status === "fulfilled"
      ? streamingResult.value
      : EMPTY_SCHEDULE;
  const channelStats =
    channelResult.status === "fulfilled" ? channelResult.value : null;

  return (
    <main className="relative min-h-screen">
      <LandingPageContent>
        <HeroVisual channelStats={channelStats} />
        <Introduction />
        <Links />
        <StreamSchedule initialData={streamingData} />
        <Achievements limit={5} showMoreBtn={true} />
        <AdditionalAchievements />
        <FanartGrid />
      </LandingPageContent>
    </main>
  );
}
