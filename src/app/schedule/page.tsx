import { Metadata } from "next";
import { getStreamingSchedule } from "@/core/utils/streamingService";
import { ScheduleTimeline } from "@/components/ui/custom/ScheduleTimeline";
import { SectionHeading } from "@/components/ui/custom/SectionHeading";

export const runtime = "edge";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Schedule",
  description: "配信スケジュール",
};

export default async function SchedulePage() {
  const scheduleData = await getStreamingSchedule();

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-[var(--primary)] opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-80 h-80 rounded-full bg-[var(--secondary)] opacity-5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionHeading>Schedule</SectionHeading>
          <p className="text-[var(--foreground)]/60 text-sm tracking-[0.2em] mt-2 font-text uppercase font-bold">
            Live Stream Schedule
          </p>
        </div>

        <ScheduleTimeline data={scheduleData} />

        {/* 更新情報 */}
        <div className="mt-8 text-center border-t border-[var(--primary)]/10 pt-8">
          <p className="text-[var(--foreground)]/30 text-[10px] tracking-[0.2em] uppercase font-text">
            Data synchronized via ISR • Last Updated:{" "}
            {new Date(scheduleData.updatedAt).toLocaleString("ja-JP")}
          </p>
        </div>
      </div>
    </main>
  );
}
