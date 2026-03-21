"use client";

import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCalendarAlt, faFlagCheckered, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { userConfig } from "@/config/userConfig";
import { SectionHeading } from "./SectionHeading";
import { HistoryItem } from "@/core/types/history";

function TimelineItem({ item, idx }: { item: HistoryItem; idx: number }) {
  const isMilestone = item.category === "milestone";
  
  // マイルストーンかイベントかでアイコンと色を変える
  const icon = isMilestone ? faStar : faCalendarAlt;
  const bgColor = isMilestone ? "bg-[var(--primary)]" : "bg-[var(--secondary)]";
  const textColor = isMilestone ? "text-[var(--primary)]" : "text-[var(--secondary)]";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pl-8 md:pl-0"
    >
      {/* 
        PC向けの2カラムジグザグレイアウト (md:以降)。
        スマホ向けはシンプルな左寄せ (pl-8)。
      */}
      <div className={`md:flex items-center justify-between w-full ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
        
        {/* PCレイアウト用のスペーサー (交互の配置用) */}
        <div className="hidden md:block w-5/12" />

        {/* タイムラインのノード (アイコン) */}
        <div className="absolute left-0 md:left-1/2 w-6 h-6 md:w-8 md:h-8 -translate-x-1/2 rounded-full border-4 border-[var(--background)] shadow-sm flex items-center justify-center z-10" style={{ backgroundColor: isMilestone ? "var(--primary)" : "var(--secondary)" }}>
            <FontAwesomeIcon icon={icon} className="text-white text-[10px] md:text-xs" />
        </div>

        {/* コンテンツカード */}
        <div className="w-full md:w-5/12 mb-8 md:mb-0">
          <div className={`relative p-5 md:p-6 bg-white rounded-2xl border border-[var(--primary)]/10 shadow-sm hover:shadow-md transition-shadow group ${idx % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
            
             {/* 日付ラベル */}
             <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-widest mb-3 ${isMilestone ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--secondary)]/10 text-[var(--secondary)]'}`}>
                {item.date}
             </div>

             {/* タイトル */}
             <h4 className="text-sm md:text-base font-design font-medium text-[var(--foreground)] leading-relaxed group-hover:text-[var(--primary)] transition-colors">
                {item.title}
             </h4>
             
             {/* モバイル表示用の装飾的な線 */}
             <div className="absolute top-8 -left-8 w-8 h-px bg-gradient-to-r from-[var(--primary)]/30 to-transparent md:hidden" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export function Achievements({ 
  hideHeading = false, 
  className = "", 
  limit, 
  showMoreBtn = false 
}: { 
  hideHeading?: boolean; 
  className?: string; 
  limit?: number; 
  showMoreBtn?: boolean; 
}) {
  // history はユーザーごとの設定によって存在しない場合があるため、型キャストで安全に扱う
  // @ts-ignore - TODO: userConfig.ts の export 型自体を更新するのがベストだが、今回は一時的なアクセス
  const historyData = (userConfig.profile as any).history as HistoryItem[] | undefined;

  if (!historyData || historyData.length === 0) {
    return null;
  }

  // 表示用データの絞り込み（limitがある場合は末尾から最新を取得）
  const displayData = limit && limit > 0 ? historyData.slice(-limit) : historyData;

  return (
    <section id="achievements" className={`relative w-full py-20 md:py-32 px-4 bg-[var(--background)] overflow-hidden ${className}`}>
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[var(--primary)] opacity-[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[var(--secondary)] opacity-[0.03] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
            {!hideHeading && (
              <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  viewport={{ once: true }}
              >
                  <SectionHeading>History</SectionHeading>
              </motion.div>
            )}

            <div className="relative mt-16 md:mt-24">
                {/* タイムラインの中央・左側の縦線 */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--primary)]/20 to-transparent -translate-x-[0.5px]" />
                
                {/* タイムラインの開始点装飾 */}
                <div className="absolute top-0 left-0 md:left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--primary)]/30 bg-[var(--background)]" />

                <div className="flex flex-col gap-6 md:gap-0">
                    {displayData.map((item, idx) => (
                        <div key={idx} className={idx !== displayData.length - 1 ? "md:mb-12" : ""}>
                           <TimelineItem item={item} idx={idx} />
                        </div>
                    ))}
                </div>

                {/* タイムラインの終点装飾（フラッグ） */}
                <div className="relative mt-6 md:mt-12 flex justify-start md:justify-center">
                    <motion.div
                       initial={{ scale: 0, opacity: 0 }}
                       whileInView={{ scale: 1, opacity: 1 }}
                       transition={{ duration: 0.5, delay: 0.5 }}
                       viewport={{ once: true }}
                       className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-[var(--primary)]/20 shadow-sm flex items-center justify-center -translate-x-1/2 md:translate-x-0"
                    >
                        <FontAwesomeIcon icon={faFlagCheckered} className="text-[var(--primary)] text-sm" />
                    </motion.div>
                </div>

                {/* View All Button */}
                {showMoreBtn && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                  >
                    <Link
                      href="/history"
                      className="inline-flex items-center gap-3 px-8 py-3 bg-white text-[var(--foreground)] border border-[var(--primary)]/20 rounded-xl text-sm font-bold tracking-widest hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md transition-all group"
                    >
                      View All History
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                )}
            </div>
        </div>
    </section>
  );
}
