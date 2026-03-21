import { Metadata } from "next";
import { Achievements } from "@/components/ui/custom/Achievements";
import { Links } from "@/components/ui/custom/Links";
import { SectionHeading } from "@/components/ui/custom/SectionHeading";

export const metadata: Metadata = {
  title: "History",
  description: "活動の歴史・実績",
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-40 -right-40 w-96 h-96 rounded-full bg-[var(--primary)] opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute top-[60%] -left-20 w-80 h-80 rounded-full bg-[var(--secondary)] opacity-5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 w-full flex flex-col items-center">
        <div className="text-center mb-8 w-full">
            <SectionHeading>History</SectionHeading>
            <p className="text-[var(--foreground)]/60 text-sm tracking-[0.2em] mt-2 font-text uppercase font-bold">
                VTuber Activities & Milestones
            </p>
        </div>

        {/* 既存のAchievementsコンポーネントを再利用 */}
        <div className="w-full">
            <Achievements hideHeading={true} className="!py-0 !bg-transparent" />
        </div>
      </div>

      {/* リンクセクション */}
      <div className="mt-20 relative z-10 border-t border-[var(--primary)]/10">
        <Links />
      </div>
    </main>
  );
}
