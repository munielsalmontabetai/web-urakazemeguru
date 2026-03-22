"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { userConfig } from "@/config/userConfig";
import { SectionHeading } from "./SectionHeading";

// スクロールに応じてフェードインするラッパー
function FadeIn({
  children,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 30, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Introduction() {
  const { profile } = userConfig;

  return (
    <section
      id="introduction"
      className="relative w-full overflow-hidden bg-[var(--background)] px-4 py-20 md:py-32"
    >
      {/* 背景装飾 */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[var(--primary)] opacity-5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[var(--secondary)] opacity-5 blur-3xl" />

      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading>About</SectionHeading>
        </FadeIn>

        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 md:grid-cols-2">
          {/* 1. 名前・キャッチコピーエリア (スマホ: 1番目 / PC: 右側上) */}
          <FadeIn
            delay={0.1}
            className="order-1 flex w-full flex-col items-center text-center md:order-2 md:items-start md:text-left"
          >
            <p className="font-design mb-4 text-sm font-medium tracking-widest text-[var(--secondary)] italic md:text-base">
              {profile.catchphrase}
            </p>
            <h3 className="font-design mb-2 text-5xl leading-tight font-medium text-[var(--foreground)] md:text-6xl">
              {profile.name}
            </h3>
            <p className="mb-6 text-sm tracking-widest text-[var(--foreground)]/50">
              {profile.nameEn}
            </p>

            {/* タグリスト */}
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-text rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-4 py-1 text-xs tracking-wider text-[var(--foreground)]/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* 2. 自己紹介動画エリア (スマホ: 2番目 / PC: 左側) */}
          {profile.introductionVideoId && (
            <FadeIn
              delay={0.3}
              className="order-2 w-full md:order-1 md:row-span-2"
            >
              <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--primary)]/20 bg-black/5 shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${profile.introductionVideoId}?rel=0&modestbranding=1`}
                  title={`${profile.name} 自己紹介動画`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* 装飾的な角のアクセント */}
                <div className="pointer-events-none absolute top-0 left-0 h-8 w-8 rounded-tl-2xl border-t-2 border-l-2 border-[var(--primary)]/30 transition-transform duration-500 group-hover:scale-110" />
                <div className="pointer-events-none absolute right-0 bottom-0 h-8 w-8 rounded-br-2xl border-r-2 border-b-2 border-[var(--primary)]/30 transition-transform duration-500 group-hover:scale-110" />
              </div>
            </FadeIn>
          )}

          {/* 3. 自己紹介テキストエリア (スマホ: 3番目 / PC: 右側下) */}
          <FadeIn delay={0.2} className="order-3 w-full md:order-3">
            <div className="flex h-full flex-col justify-center border-l-2 border-[var(--primary)]/50 pl-6">
              <p className="font-text text-base leading-loose whitespace-pre-wrap text-[var(--foreground)]/80 md:text-lg">
                {profile.bio}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-tighter text-[var(--foreground)]/30 uppercase">
                    Birthday
                  </span>
                  <span className="font-medium text-[var(--foreground)]/70">
                    {profile.details?.birthday}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-tighter text-[var(--foreground)]/30 uppercase">
                    Height
                  </span>
                  <span className="font-medium text-[var(--foreground)]/70">
                    {profile.details?.height}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-tighter text-[var(--foreground)]/30 uppercase">
                    Debut
                  </span>
                  <span className="font-medium text-[var(--foreground)]/70">
                    {profile.details?.debut}
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
