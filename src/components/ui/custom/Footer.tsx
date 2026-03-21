"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faTwitch,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { userConfig } from "@/config/userConfig";

export function Footer() {
  const { links, profile } = userConfig;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--background)] border-t border-[var(--primary)]/10 py-12 md:py-16 relative overflow-hidden">
      {/* 背景の微細な装飾 */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--primary)] opacity-[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--secondary)] opacity-[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10 flex flex-col items-center">
        {/* ロゴ / タイトル　 */}
        <div className="mb-8">
          <div className="w-[150px] h-12 relative overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
            <Image
              src="/images/logo.png"
              alt={profile.nameEn}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* 主要SNSリンク */}
        <div className="flex items-center gap-6 mb-10">
          <a
            href={links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[var(--primary)]/5 flex items-center justify-center text-[var(--foreground)]/60 hover:bg-[#ff0000] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            aria-label="YouTube"
          >
            <FontAwesomeIcon icon={faYoutube} className="text-xl" />
          </a>
          <a
            href={links.twitch}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[var(--primary)]/5 flex items-center justify-center text-[var(--foreground)]/60 hover:bg-[#9146ff] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            aria-label="Twitch"
          >
            <FontAwesomeIcon icon={faTwitch} className="text-xl" />
          </a>
          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[var(--primary)]/5 flex items-center justify-center text-[var(--foreground)]/60 hover:bg-black hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            aria-label="X (Twitter)"
          >
            <FontAwesomeIcon icon={faXTwitter} className="text-xl" />
          </a>
        </div>

        {/* コピーライトなど */}
        <div className="text-center font-text">
          <p className="text-[var(--foreground)]/40 text-xs tracking-widest mb-2">
            © {currentYear} {profile.nameEn} / {profile.name}. All rights
            reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-[var(--foreground)]/30 tracking-widest mt-4">
            <a
              href="mailto:yuzukirana.official@gmail.com"
              className="hover:text-[var(--primary)] transition-colors"
            >
              Contact
            </a>
            <span>|</span>
            <a
              href={links.litlink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--primary)] transition-colors"
            >
              lit.link
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
