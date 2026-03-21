"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StreamScheduleResult, StreamItem } from "@/core/types/streaming";
import { ScheduleListCard } from "./ScheduleListCard";

type TabType = "upcoming" | "past";

export function ScheduleTimeline({ data }: { data: StreamScheduleResult }) {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  // Next 30 Days: 進行中の配信と、今後の配信
  const upcomingItems = useMemo(() => {
    const items: StreamItem[] = [];
    if (data.activeStream) {
      items.push(data.activeStream);
    }
    // ensure sorted by time nearest to farthest
    const sortedUpcoming = [...data.upcomingStreams].sort((a, b) => {
      const timeA = a.scheduledStartTime ? new Date(a.scheduledStartTime).getTime() : 0;
      const timeB = b.scheduledStartTime ? new Date(b.scheduledStartTime).getTime() : 0;
      return timeA - timeB;
    });
    items.push(...sortedUpcoming);
    return items;
  }, [data]);

  // Past 30 Days: アーカイブ
  const pastItems = useMemo(() => {
    // ensure sorted from newest to oldest
    return [...data.recentArchives].sort((a, b) => {
      const timeA = a.actualStartTime || a.scheduledStartTime ? new Date(a.actualStartTime || a.scheduledStartTime!).getTime() : 0;
      const timeB = b.actualStartTime || b.scheduledStartTime ? new Date(b.actualStartTime || b.scheduledStartTime!).getTime() : 0;
      return timeB - timeA;
    });
  }, [data]);

  const displayItems = activeTab === "upcoming" ? upcomingItems : pastItems;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-20">
      {/* Tab Navigation */}
      <div className="flex justify-center border-b border-[var(--primary)]/10">
        <div className="flex gap-4 sm:gap-8 relative w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 sm:flex-none pb-4 px-2 text-xs sm:text-sm font-bold tracking-[0.1em] sm:tracking-[0.2em] uppercase transition-colors relative z-10 ${
              activeTab === "upcoming"
                ? "text-[var(--primary)]"
                : "text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70"
            }`}
          >
            Next 30 Days
            <span className="ml-2 text-[10px] bg-[var(--primary)]/10 text-[var(--primary)] py-0.5 px-2 rounded-full">
              {upcomingItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 sm:flex-none pb-4 px-2 text-xs sm:text-sm font-bold tracking-[0.1em] sm:tracking-[0.2em] uppercase transition-colors relative z-10 ${
              activeTab === "past"
                ? "text-[var(--primary)]"
                : "text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70"
            }`}
          >
            Past 30 Days
            <span className="ml-2 text-[10px] bg-[var(--foreground)]/5 text-[var(--foreground)]/50 py-0.5 px-2 rounded-full group-hover:bg-[var(--primary)]/10 transition-colors">
              {pastItems.length}
            </span>
          </button>

          {/* Active Tab Indicator */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-[var(--primary)] transition-all duration-300"
            style={{
              width: "50%",
              transform: activeTab === "upcoming" ? "translateX(0)" : "translateX(100%)",
            }}
          />
        </div>
      </div>

      {/* Grid Area */}
      <div className="relative min-h-[400px] mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative"
          >
            {displayItems.length > 0 ? (
              displayItems.map((item, idx) => (
                <div key={item.id} className="relative h-full flex">
                  <div className="w-full flex-1">
                    <ScheduleListCard item={item} delay={idx * 0.05} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 px-4">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)]/40">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-[var(--foreground)]/50 font-bold tracking-widest mt-4">
                  {activeTab === "upcoming"
                    ? "配信予定はまだありません"
                    : "過去の配信履歴がありません"}
                </p>
                <p className="text-[var(--foreground)]/30 text-sm mt-2 font-text">
                  No schedule available.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
