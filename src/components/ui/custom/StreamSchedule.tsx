"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { faClock, faVideo, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { StreamScheduleResult, StreamItem } from "@/core/types/streaming";
import { SectionHeading } from "./SectionHeading";

export function StreamSchedule({ initialData }: { initialData: StreamScheduleResult }) {
  const [data, setData] = useState<StreamScheduleResult>(initialData);

  // クライアントサイドでのマウント後に最新状態を表示するなどの処理も可能だが
  // 基本はSSR/ISRで渡されたデータを使用する

  return (
    <section
      id="schedule"
      className="relative w-full py-20 md:py-32 px-4 bg-[var(--background)] overflow-hidden"
    >
      {/* 背景装飾 */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-[var(--primary)] opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-[var(--secondary)] opacity-5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, margin: "-80px" }}
        >
          <SectionHeading>Schedule</SectionHeading>
        </motion.div>

        <div className="space-y-12 md:space-y-16">
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
                <div className="relative group overflow-hidden rounded-2xl border border-[var(--primary)]/20 shadow-xl bg-white">
                  {/* 装飾的な角のアクセント */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--primary)]/30 rounded-tl-2xl pointer-events-none z-20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--primary)]/30 rounded-br-2xl pointer-events-none z-20 group-hover:scale-110 transition-transform duration-500" />

                  <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold tracking-[0.2em] rounded-full uppercase shadow-md shadow-red-500/20">
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
                      <div className="md:w-3/5 aspect-video relative overflow-hidden bg-black/5">
                        <img
                          src={data.activeStream.thumbnailUrl}
                          alt={data.activeStream.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      {/* 情報 */}
                      <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[var(--primary)]/10 bg-white">
                        <div className="flex items-center gap-3 text-[var(--foreground)]/50 text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">
                          <FontAwesomeIcon
                            icon={data.activeStream.platform === "youtube" ? faYoutube : faTwitch}
                            className="text-sm text-[var(--primary)]"
                          />
                          <span>{data.activeStream.platform} Streaming</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-design font-medium text-[var(--foreground)] leading-tight mb-8 line-clamp-3">
                          {data.activeStream.title}
                        </h3>
                        <div className="mt-auto">
                           {/* Buttonらしいデザイン */}
                          <span className="inline-flex items-center gap-3 px-8 py-3 bg-[var(--primary)] text-white rounded-xl text-xs font-bold tracking-widest hover:bg-[var(--primary)]/90 transition-colors shadow-md shadow-[var(--primary)]/20">
                            WATCH NOW
                            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[10px] opacity-80" />
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
              <span className="text-sm tracking-[0.4em] font-design font-medium text-[var(--foreground)]/30 uppercase mb-2 block">
                Next Stream
              </span>
            </motion.div>
          ) : null}

          {/* 今後の配信予定 & アーカイブ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* 配信予定カード */}
            {data.upcomingStreams.map((item, idx) => (
              <StreamCard key={item.id} item={item} delay={0.1 + idx * 0.1} />
            ))}

            {/* 配信中も予定もない場合のアーカイブ (トップページはレイアウト都合で最新6件のみ表示) */}
            {!data.activeStream &&
              data.upcomingStreams.length === 0 &&
              data.recentArchives.slice(0, 6).map((item, idx) => (
                <StreamCard key={item.id} item={item} delay={0.1 + idx * 0.1} />
              ))}
          </div>

          {/* 更新情報 */}
          <div className="pt-8 text-center border-t border-[var(--primary)]/10">
            <p className="text-[var(--foreground)]/30 text-[10px] tracking-[0.2em] uppercase font-text">
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="group"
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white rounded-2xl overflow-hidden border border-[var(--primary)]/10 shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-300 h-full flex flex-col"
      >
        <div className="aspect-video relative overflow-hidden bg-[var(--primary)]/5">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isUpcoming && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="px-4 py-2 bg-white rounded-full flex items-center gap-2 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <FontAwesomeIcon icon={faClock} className="text-[var(--primary)] text-xs" />
                <span className="text-[10px] font-bold tracking-widest text-[var(--foreground)] uppercase">
                  Upcoming
                </span>
              </div>
            </div>
          )}
          {!isUpcoming && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-[var(--background)]/90 backdrop-blur-sm rounded text-[var(--foreground)]/70 text-[8px] font-bold tracking-widest uppercase border border-[var(--primary)]/10">
              Archive
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[var(--primary)]">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/5 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
               <FontAwesomeIcon
                 icon={item.platform === "youtube" ? faYoutube : faTwitch}
                 className="text-sm"
               />
            </div>
            {item.scheduledStartTime && (
              <span className="text-xs font-bold tracking-wider text-[var(--foreground)]/60 font-text ml-2">
                {new Date(item.scheduledStartTime).toLocaleString("ja-JP", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-[var(--foreground)] tracking-wider line-clamp-2 leading-relaxed mt-1">
            {item.title}
          </h4>
        </div>
      </a>
    </motion.div>
  );
}
