"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StreamScheduleResult, StreamItem } from "@/core/types/streaming";
import { ScheduleListCard } from "./ScheduleListCard";

type TabType = "upcoming" | "past";
type FilterCategory = "all" | "live" | "video" | "short";

export function ScheduleTimeline({ data }: { data: StreamScheduleResult }) {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  // Live & Upcoming: 進行中の配信と、今後の配信
  const upcomingItems = useMemo(() => {
    const items: StreamItem[] = [];
    if (data.activeStream) {
      items.push(data.activeStream);
    }
    // ensure sorted by time nearest to farthest
    const sortedUpcoming = [...data.upcomingStreams].sort((a, b) => {
      const timeA = a.scheduledStartTime
        ? new Date(a.scheduledStartTime).getTime()
        : 0;
      const timeB = b.scheduledStartTime
        ? new Date(b.scheduledStartTime).getTime()
        : 0;
      return timeA - timeB;
    });
    items.push(...sortedUpcoming);
    return items;
  }, [data]);

  // Archives & Videos: アーカイブ
  const pastItems = useMemo(() => {
    // ensure sorted from newest to oldest
    return [...data.recentArchives].sort((a, b) => {
      const timeA =
        a.actualStartTime || a.scheduledStartTime
          ? new Date(a.actualStartTime || a.scheduledStartTime!).getTime()
          : 0;
      const timeB =
        b.actualStartTime || b.scheduledStartTime
          ? new Date(b.actualStartTime || b.scheduledStartTime!).getTime()
          : 0;
      return timeB - timeA;
    });
  }, [data]);

  const displayItems = useMemo(() => {
    let items = activeTab === "upcoming" ? upcomingItems : pastItems;
    if (activeTab === "past" && filterCategory !== "all") {
      items = items.filter((item) => item.category === filterCategory);
    }
    return items;
  }, [activeTab, upcomingItems, pastItems, filterCategory]);

  const availableCategories = useMemo(() => {
    const cats = new Set(pastItems.map((item) => item.category));
    const ordered: { id: FilterCategory; label: string }[] = [
      { id: "all", label: "すべて" },
      { id: "live", label: "ライブ" },
      { id: "video", label: "動画" },
      { id: "short", label: "ショート" },
    ];
    return ordered.filter((cat) => cat.id === "all" || cats.has(cat.id as any));
  }, [pastItems]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 pb-20">
      {/* Tab Navigation */}
      <div className="flex justify-center border-b border-[var(--primary)]/10">
        <div className="relative flex w-full justify-center gap-4 sm:w-auto sm:gap-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`relative z-10 flex-1 px-2 pb-4 text-xs font-bold tracking-[0.1em] uppercase transition-colors sm:flex-none sm:text-sm sm:tracking-[0.2em] ${
              activeTab === "upcoming"
                ? "text-[var(--primary)]"
                : "text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70"
            }`}
          >
            Live & Upcoming
            <span className="ml-2 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] text-[var(--primary)]">
              {upcomingItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`relative z-10 flex-1 px-2 pb-4 text-xs font-bold tracking-[0.1em] uppercase transition-colors sm:flex-none sm:text-sm sm:tracking-[0.2em] ${
              activeTab === "past"
                ? "text-[var(--primary)]"
                : "text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70"
            }`}
          >
            Archives & Videos
            <span className="ml-2 rounded-full bg-[var(--foreground)]/5 px-2 py-0.5 text-[10px] text-[var(--foreground)]/50 transition-colors group-hover:bg-[var(--primary)]/10">
              {pastItems.length}
            </span>
          </button>

          {/* Active Tab Indicator */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-[var(--primary)] transition-all duration-300"
            style={{
              width: "50%",
              transform:
                activeTab === "upcoming" ? "translateX(0)" : "translateX(100%)"
            }}
          />
        </div>
      </div>

      {/* Sub Filter (Only for Past) */}
      <AnimatePresence>
        {activeTab === "past" && availableCategories.length > 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="flex justify-center overflow-hidden"
          >
            <div className="mt-6 mb-2 flex flex-wrap justify-center gap-2 rounded-full border border-[var(--primary)]/10 bg-[var(--primary)]/5 p-1 sm:gap-3 sm:p-1.5">
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id as FilterCategory)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-widest transition-all duration-300 sm:px-6 sm:py-2 sm:text-sm ${
                    filterCategory === cat.id
                      ? "bg-[var(--primary)] text-white shadow-[var(--primary)]/20 shadow-md"
                      : "text-[var(--foreground)]/60 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Area */}
      <div className="relative mt-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // Only change key on activeTab to preserve layout animations on filter
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
          >
            {displayItems.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {displayItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout // Enable layout animation for smooth repositioning
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, delay: idx * 0.05 } }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative flex h-full"
                  >
                    <div className="w-full flex-1">
                      <ScheduleListCard item={item} delay={idx * 0.05} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="px-4 py-20 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/5 text-[var(--primary)]/40">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="mt-4 font-bold tracking-widest text-[var(--foreground)]/50">
                  {activeTab === "upcoming"
                    ? "配信予定はまだありません"
                    : "過去の配信履歴がありません"}
                </p>
                <p className="font-text mt-2 text-sm text-[var(--foreground)]/30">
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
