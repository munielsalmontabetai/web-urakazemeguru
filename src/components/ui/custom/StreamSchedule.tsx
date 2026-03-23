"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";
import {
  faClock,
  faVideo,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { StreamScheduleResult, StreamItem } from "@/core/types/streaming";
import { SectionHeading } from "./SectionHeading";

export function StreamSchedule({
  initialData
}: {
  initialData: StreamScheduleResult;
}) {
  const [data, setData] = useState<StreamScheduleResult>(initialData);
  type FilterCategory = "all" | "live" | "video" | "short";
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  const hasUpcomingOrActive =
    !!data.activeStream || data.upcomingStreams.length > 0;

  const availableCategories = useMemo(() => {
    const cats = new Set(data.recentArchives.map((item) => item.category));
    const ordered: { id: FilterCategory; label: string }[] = [
      { id: "all", label: "すべて" },
      { id: "live", label: "ライブ" },
      { id: "video", label: "動画" },
      { id: "short", label: "ショート" }
    ];
    return ordered.filter((cat) => cat.id === "all" || cats.has(cat.id as any));
  }, [data.recentArchives]);

  const filteredArchives = useMemo(() => {
    if (filterCategory === "all") return data.recentArchives;
    return data.recentArchives.filter(
      (item) => item.category === filterCategory
    );
  }, [data.recentArchives, filterCategory]);

  // クライアントサイドでのマウント後に最新状態を表示するなどの処理も可能だが
  // 基本はSSR/ISRで渡されたデータを使用する

  return (
    <section
      id="schedule"
      className="relative w-full overflow-hidden bg-[var(--background)] px-4 py-20 md:py-32"
    >
      {/* 背景装飾 */}
      <div className="pointer-events-none absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-[var(--primary)] opacity-5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -left-20 h-80 w-80 rounded-full bg-[var(--secondary)] opacity-5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionHeading>
            {hasUpcomingOrActive ? "Schedule" : "Archives & Videos"}
          </SectionHeading>
        </motion.div>

        {/* Sub Filter (Only when there are no upcoming streams/active streams) */}
        {!hasUpcomingOrActive && availableCategories.length > 2 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-8 flex justify-center overflow-hidden"
            >
              <div className="flex flex-wrap justify-center gap-2 rounded-full border border-[var(--primary)]/10 bg-[var(--primary)]/5 p-1 sm:gap-3 sm:p-1.5">
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
          </AnimatePresence>
        )}

        <div className={`space-y-12 md:space-y-16 mt-8 ${!hasUpcomingOrActive ? "min-h-[850px] sm:min-h-[600px] lg:min-h-[450px]" : ""}`}>
          {/* 現在配信中エリア */}
          {data.activeStream ? (
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
                className="w-full"
              >
                {/* Introductionの動画エリアに合わせたデザイン */}
                <div className="group relative overflow-hidden rounded-2xl border border-[var(--primary)]/20 bg-white shadow-xl">
                  {/* 装飾的な角のアクセント */}
                  <div className="pointer-events-none absolute top-0 left-0 z-20 h-8 w-8 rounded-tl-2xl border-t-2 border-l-2 border-[var(--primary)]/30 transition-transform duration-500 group-hover:scale-110" />
                  <div className="pointer-events-none absolute right-0 bottom-0 z-20 h-8 w-8 rounded-br-2xl border-r-2 border-b-2 border-[var(--primary)]/30 transition-transform duration-500 group-hover:scale-110" />

                  <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                    </span>
                    <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-md shadow-red-500/20">
                      Live Now
                    </span>
                  </div>

                  <a
                    href={data.activeStream.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* サムネイル */}
                      <div className="relative aspect-video overflow-hidden bg-black/5 md:w-3/5">
                        <img
                          src={data.activeStream.thumbnailUrl}
                          alt={data.activeStream.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      {/* 情報 */}
                      <div className="flex flex-col justify-center border-t border-[var(--primary)]/10 bg-white p-8 md:w-2/5 md:border-t-0 md:border-l md:p-10">
                        <div className="mb-4 flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-[var(--foreground)]/50 uppercase">
                          <FontAwesomeIcon
                            icon={
                              data.activeStream.platform === "youtube"
                                ? faYoutube
                                : faTwitch
                            }
                            className="text-sm text-[var(--primary)]"
                          />
                          <span>{data.activeStream.platform} Streaming</span>
                        </div>
                        <h3 className="font-design mb-8 line-clamp-3 text-2xl leading-tight font-medium text-[var(--foreground)] md:text-3xl">
                          {data.activeStream.title}
                        </h3>
                        <div className="mt-auto">
                          {/* Buttonらしいデザイン */}
                          <span className="inline-flex items-center gap-3 rounded-xl bg-[var(--primary)] px-8 py-3 text-xs font-bold tracking-widest text-white shadow-[var(--primary)]/20 shadow-md transition-colors hover:bg-[var(--primary)]/90">
                            WATCH NOW
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              className="text-[10px] opacity-80"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </motion.div>
            </div>
          ) : data.upcomingStreams.length > 0 ? (
            /* 配信予定がある場合の見出し */
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <span className="font-design mb-2 block text-sm font-medium tracking-[0.4em] text-[var(--foreground)]/30 uppercase">
                Next Stream
              </span>
            </motion.div>
          ) : null}

          {/* 今後の配信予定 & アーカイブ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 content-start">
            {/* 配信予定カード */}
            {data.upcomingStreams.map((item, idx) => (
              <StreamCard key={item.id} item={item} delay={0.1 + idx * 0.1} />
            ))}

            {/* 配信中も予定もない場合のアーカイブ (表示カテゴリで絞り込んで最新6件表示) */}
            {!hasUpcomingOrActive && (
              <AnimatePresence mode="popLayout">
                {filteredArchives
                  .slice(0, 6)
                  .map((item: StreamItem, idx: number) => (
                    <StreamCard
                      key={item.id}
                      item={item}
                      delay={0.1 + idx * 0.1}
                    />
                  ))}
              </AnimatePresence>
            )}
          </div>

          {/* 更新情報 */}
          <div className="border-t border-[var(--primary)]/10 pt-8 text-center">
            <p className="font-text text-[10px] tracking-[0.2em] text-[var(--foreground)]/30 uppercase">
              Data synchronized via ISR • Last Updated:{" "}
              {new Date(data.updatedAt).toLocaleString("ja-JP")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StreamCard({ item, delay }: { item: StreamItem; delay: number }) {
  const isUpcoming = item.status === "upcoming";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, delay, ease: "easeOut" } }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="group h-full"
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--primary)]/10 bg-white shadow-sm transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-md"
      >
        <div className="relative aspect-video overflow-hidden bg-[var(--primary)]/5">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isUpcoming && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex translate-y-2 transform items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md transition-transform duration-300 group-hover:translate-y-0">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-xs text-[var(--primary)]"
                />
                <span className="text-[10px] font-bold tracking-widest text-[var(--foreground)] uppercase">
                  Upcoming
                </span>
              </div>
            </div>
          )}
          {!isUpcoming && (
            <div className="absolute top-2 right-2 rounded border border-[var(--primary)]/10 bg-[var(--background)]/90 px-2 py-1 text-[8px] font-bold tracking-widest text-[var(--foreground)]/70 uppercase backdrop-blur-sm">
              Archive
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-2 text-[var(--primary)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/5 transition-colors duration-300 group-hover:bg-[var(--primary)] group-hover:text-white">
              <FontAwesomeIcon
                icon={item.platform === "youtube" ? faYoutube : faTwitch}
                className="text-sm"
              />
            </div>
            {item.scheduledStartTime && (
              <span className="font-text ml-2 text-xs font-bold tracking-wider text-[var(--foreground)]/60">
                {new Date(item.scheduledStartTime).toLocaleString("ja-JP", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            )}
          </div>
          <h4 className="mt-1 line-clamp-2 text-sm leading-relaxed font-bold tracking-wider text-[var(--foreground)]">
            {item.title}
          </h4>
        </div>
      </a>
    </motion.div>
  );
}
