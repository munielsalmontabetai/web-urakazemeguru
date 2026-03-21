"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { userConfig } from "@/config/userConfig";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // 2.5秒後にスプラッシュを終了 (AnimatePresenceによってフェードアウト開始)
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]"
    >
      <div className="flex flex-col items-center">
        {/* 背景の装飾 */}
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.2 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="absolute w-64 h-64 rounded-full bg-[var(--primary)] blur-3xl"
        />
        
        {/* メインのテキストロゴアニメーション */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative text-3xl md:text-5xl font-design font-medium text-[var(--foreground)] z-10 tracking-widest"
        >
          {userConfig.site.title}
        </motion.h1>

        {/* サブテキスト */}
        <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="mt-4 text-[var(--secondary)] tracking-widest text-sm md:text-base z-10 font-bold"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}
