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
  className = "",
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
      className="relative w-full py-20 md:py-32 px-4 bg-[var(--background)] overflow-hidden"
    >
      {/* 背景装飾 */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[var(--primary)] opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[var(--secondary)] opacity-5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <SectionHeading>About</SectionHeading>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 items-center">
          {/* 1. 名前・キャッチコピーエリア (スマホ: 1番目 / PC: 右側上) */}
          <FadeIn
            delay={0.1}
            className="order-1 md:order-2 w-full flex flex-col items-center md:items-start text-center md:text-left"
          >
            <p className="text-[var(--secondary)] font-design tracking-widest text-sm md:text-base mb-4 font-medium italic">
              {profile.catchphrase}
            </p>
            <h3 className="text-5xl md:text-6xl font-design font-medium text-[var(--foreground)] leading-tight mb-2">
              {profile.name}
            </h3>
            <p className="text-sm text-[var(--foreground)]/50 tracking-widest mb-6">
              {profile.nameEn}
            </p>

            {/* タグリスト */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1 rounded-full border border-[var(--primary)]/30 text-[var(--foreground)]/60 text-xs tracking-wider font-text bg-[var(--primary)]/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* 2. 自己紹介動画エリア (スマホ: 2番目 / PC: 左側) */}
          {profile.introductionVideoId && (
            <FadeIn delay={0.3} className="order-2 md:order-1 md:row-span-2 w-full">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-[var(--primary)]/20 bg-black/5 group">
                <iframe
                  src={`https://www.youtube.com/embed/${profile.introductionVideoId}?rel=0&modestbranding=1`}
                  title={`${profile.name} 自己紹介動画`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {/* 装飾的な角のアクセント */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--primary)]/30 rounded-tl-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--primary)]/30 rounded-br-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              </div>
            </FadeIn>
          )}

          {/* 3. 自己紹介テキストエリア (スマホ: 3番目 / PC: 右側下) */}
          <FadeIn delay={0.2} className="order-3 md:order-3 w-full">
            <div className="border-l-2 border-[var(--primary)]/50 pl-6 h-full flex flex-col justify-center">
              <p className="text-[var(--foreground)]/80 font-text leading-loose text-base md:text-lg whitespace-pre-wrap">
                {profile.bio}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-[var(--foreground)]/30 text-[10px] uppercase tracking-tighter">Birthday</span>
                  <span className="text-[var(--foreground)]/70 font-medium">{profile.details?.birthday}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--foreground)]/30 text-[10px] uppercase tracking-tighter">Height</span>
                  <span className="text-[var(--foreground)]/70 font-medium">{profile.details?.height}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--foreground)]/30 text-[10px] uppercase tracking-tighter">Debut</span>
                  <span className="text-[var(--foreground)]/70 font-medium">{profile.details?.debut}</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
