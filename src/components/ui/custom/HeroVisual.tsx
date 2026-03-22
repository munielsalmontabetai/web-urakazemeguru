"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faTwitch,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { userConfig } from "@/config/userConfig";

export function HeroVisual() {
  return (
    <section className="relative w-full h-[100vh] md:h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]">
      {/* 背景画像 (PC用) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 hidden md:block w-full h-full"
      >
        <Image
          src="/images/hero-pc.png"
          alt={userConfig.site.title}
          fill
          className="object-cover object-center"
          priority
        />
      </motion.div>

      {/* 背景画像 (スマホ用) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 block md:hidden w-full h-full"
      >
        <Image
          src="/images/hero-sp.png"
          alt={userConfig.site.title}
          fill
          className="object-cover object-center"
          priority
        />
      </motion.div>

      {/* 背景を少し暗くして文字の視認性を高めるオーバーレイ (必要に応じて調整) */}
      <div className="absolute inset-0 z-10 pointer-events-none" />

      {/* メインコンテンツコンテナ */}
      <div className={`relative z-30 w-full h-full max-w-7xl mx-auto flex flex-col justify-center px-4 sm:px-8 md:px-12 pointer-events-none md:pointer-events-auto ${userConfig.site.heroAlignment === "right" ? "md:items-end" : ""}`}>
        <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col items-center pt-20 md:pt-0 pointer-events-auto text-center md:items-start md:text-left">
          <motion.div
            initial={{ x: userConfig.site.heroAlignment === "right" ? 30 : -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center md:items-start"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-design font-medium text-[var(--foreground)] tracking-tight drop-shadow-md leading-tight [text-shadow:_0_2px_10px_rgb(255_255_255_/_80%)] md:[text-shadow:none]">
              {userConfig.site.title}
            </h1>
            <p className="mt-4 md:mt-6 text-base sm:text-xl md:text-2xl text-[var(--foreground)] opacity-95 max-w-xl drop-shadow-sm bg-[var(--background)]/70 md:bg-transparent px-6 py-3 md:p-0 rounded-full md:rounded-none backdrop-blur-md md:backdrop-blur-none border border-[var(--primary)]/30 md:border-transparent">
              {userConfig.site.description}
            </p>

            {/* SNS リンクアイコン群 */}
            <div className="mt-8 flex gap-6 z-40">
              {userConfig.links.youtube && (
                <a
                  href={userConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[#ff0000] scale-100 hover:scale-110 transition-all duration-300 drop-shadow-md"
                  aria-label="YouTube"
                >
                  <FontAwesomeIcon icon={faYoutube} size="2x" />
                </a>
              )}
              {userConfig.links.twitch && (
                <a
                  href={userConfig.links.twitch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[#9146ff] scale-100 hover:scale-110 transition-all duration-300 drop-shadow-md"
                  aria-label="Twitch"
                >
                  <FontAwesomeIcon icon={faTwitch} size="2x" />
                </a>
              )}
              {userConfig.links.x && (
                <a
                  href={userConfig.links.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[#1da1f2] scale-100 hover:scale-110 transition-all duration-300 drop-shadow-md"
                  aria-label="X (Twitter)"
                >
                  <FontAwesomeIcon icon={faXTwitter} size="2x" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* スクロールダウンインジケーター (次のセクションとの境界にまたがる100%の帯) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-0 left-0 w-full z-40 flex flex-col items-center justify-end h-32 pointer-events-none"
      >
        {/* 背景の帯 (半透明＋ブラー) */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[var(--background)]/80 to-[var(--background)]/0 backdrop-blur-[2px]">
          {/* SCROLL テキストとライン */}
          <div className="flex flex-col items-center justify-center transform translate-y-6">
            <span className="text-xs font-bold tracking-widest text-[var(--foreground)] mb-2 drop-[0_2px_4px_rgba(255,255,255,0.8)]">
              SCROLL
            </span>
            <div className="relative w-px h-16 bg-[var(--foreground)]/20 overflow-hidden">
              {/* ライン上のアニメーションする光 */}
              <motion.div
                animate={{ y: ["-100%", "300%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute left-0 top-0 w-full h-[30%] bg-[var(--foreground)] shadow-[0_0_8px_var(--foreground)]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
