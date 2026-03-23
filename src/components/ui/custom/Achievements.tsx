"use client";

import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCalendarAlt,
  faFlagCheckered,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { userConfig } from "@/config/userConfig";
import { SectionHeading } from "./SectionHeading";
import { HistoryItem } from "@/core/types/history";

function TimelineItem({ item, idx }: { item: HistoryItem; idx: number }) {
  const isMilestone = item.category === "milestone";

  // マイルストーンかイベントかでアイコンと色を変える
  const icon = isMilestone ? faStar : faCalendarAlt;
  const bgColor = isMilestone ? "bg-[var(--primary)]" : "bg-[var(--secondary)]";
  const textColor = isMilestone
    ? "text-[var(--primary)]"
    : "text-[var(--secondary)]";

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
      <div
        className={`w-full items-center justify-between md:flex ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
      >
        {/* PCレイアウト用のスペーサー (交互の配置用) */}
        <div className="hidden w-5/12 md:block" />

        {/* タイムラインのノード (アイコン) */}
        <div
          className="absolute left-0 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[var(--background)] shadow-sm md:left-1/2 md:h-8 md:w-8"
          style={{
            backgroundColor: isMilestone ? "var(--primary)" : "var(--secondary)"
          }}
        >
          <FontAwesomeIcon
            icon={icon}
            className="text-[10px] text-white md:text-xs"
          />
        </div>

        {/* コンテンツカード */}
        <div className="mb-8 w-full md:mb-0 md:w-5/12">
          <div
            className={`relative rounded-2xl border border-[var(--primary)]/10 bg-white p-5 shadow-sm md:p-6 ${idx % 2 === 0 ? "md:text-left" : "md:text-right"}`}
          >
            {/* 日付ラベル */}
            <div
              className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest md:text-xs ${isMilestone ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--secondary)]/10 text-[var(--secondary)]"}`}
            >
              {item.date}
            </div>

            {/* タイトル */}
            <h4 className="font-design text-sm leading-relaxed font-medium text-[var(--foreground)] md:text-base">
              {item.title}
            </h4>

            {/* モバイル表示用の装飾的な線 */}
            <div className="absolute top-8 -left-8 h-px w-8 bg-gradient-to-r from-[var(--primary)]/30 to-transparent md:hidden" />
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
  const historyData = (userConfig.profile as any).history as
    | HistoryItem[]
    | undefined;

  if (!historyData || historyData.length === 0) {
    return null;
  }

  // 表示用データの絞り込み（limitがある場合は末尾から最新を取得）
  const displayData =
    limit && limit > 0 ? historyData.slice(-limit) : historyData;

  return (
    <section
      id="achievements"
      className={`relative w-full overflow-hidden bg-[var(--background)] px-4 py-20 md:py-32 ${className}`}
    >
      {/* 背景装飾 */}
      <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-[var(--primary)] opacity-[0.03] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[var(--secondary)] opacity-[0.03] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl">
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
          <div className="absolute top-0 bottom-0 left-0 w-px -translate-x-[0.5px] bg-gradient-to-b from-transparent via-[var(--primary)]/20 to-transparent md:left-1/2" />

          {/* タイムラインの開始点装飾 */}
          <div className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--primary)]/30 bg-[var(--background)] md:left-1/2" />

          <div className="flex flex-col gap-6 md:gap-0">
            {displayData.map((item, idx) => (
              <div
                key={idx}
                className={idx !== displayData.length - 1 ? "md:mb-12" : ""}
              >
                <TimelineItem item={item} idx={idx} />
              </div>
            ))}
          </div>

          {/* タイムラインの終点装飾（フラッグ） */}
          <div className="relative mt-6 flex justify-start md:mt-12 md:justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--primary)]/20 bg-white shadow-sm md:h-10 md:w-10 md:translate-x-0"
            >
              <FontAwesomeIcon
                icon={faFlagCheckered}
                className="text-sm text-[var(--primary)]"
              />
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
                className="group inline-flex items-center gap-3 rounded-xl border border-[var(--primary)]/20 bg-white px-8 py-3 text-sm font-bold tracking-widest text-[var(--foreground)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md"
              >
                View All History
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xs transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
