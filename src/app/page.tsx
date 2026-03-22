import { HeroVisual } from "@/components/ui/custom/HeroVisual";
import { Introduction } from "@/components/ui/custom/Introduction";
import { FanartGrid } from "@/components/ui/custom/FanartGrid";
import { Links } from "@/components/ui/custom/Links";
import { Achievements } from "@/components/ui/custom/Achievements";
import { AdditionalAchievements } from "@/components/ui/custom/AdditionalAchievements";
import { StreamSchedule } from "@/components/ui/custom/StreamSchedule";
import { getStreamingSchedule } from "@/core/utils/streamingService";
import { LandingPageContent } from "@/components/layout/LandingPageContent";

/**
 * メインのランディングページ。
 * サーバーコンポーネントとして、配信スケジュール情報をフェッチします
 */
export const revalidate = 3600;

export default async function Home() {
  // 配信データをサーバーサイドで取得（ISRが適用される）
  const streamingData = await getStreamingSchedule();

  return (
    <main className="relative min-h-screen">
      <LandingPageContent>
        <HeroVisual />
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
