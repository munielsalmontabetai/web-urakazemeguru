"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faTwitch,
  faXTwitter
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { userConfig } from "@/config/userConfig";

export function Footer() {
  const { links, profile } = userConfig;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden border-t border-[var(--primary)]/10 bg-[var(--background)] py-12 md:py-16">
      {/* 背景の微細な装飾 */}
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.02] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[var(--secondary)] opacity-[0.02] blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 md:px-8">
        {/* ロゴ / タイトル　 */}
        <div className="mb-8">
          <div className="relative h-12 w-[150px] overflow-hidden opacity-90 transition-opacity hover:opacity-100">
            <Image
              src="/images/logo.png"
              alt={profile.nameEn}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* 主要SNSリンク */}
        <div className="mb-10 flex items-center gap-6">
          <a
            href={links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/5 text-[var(--foreground)]/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[#ff0000] hover:text-white"
            aria-label="YouTube"
          >
            <FontAwesomeIcon icon={faYoutube} className="text-xl" />
          </a>
          <a
            href={links.twitch}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/5 text-[var(--foreground)]/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-[#9146ff] hover:text-white"
            aria-label="Twitch"
          >
            <FontAwesomeIcon icon={faTwitch} className="text-xl" />
          </a>
          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/5 text-[var(--foreground)]/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-black hover:text-white"
            aria-label="X (Twitter)"
          >
            <FontAwesomeIcon icon={faXTwitter} className="text-xl" />
          </a>
        </div>

        {/* コピーライトなど */}
        <div className="font-text text-center">
          <p className="mb-2 text-xs tracking-widest text-[var(--foreground)]/40">
            © {currentYear} {profile.nameEn} / {profile.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
