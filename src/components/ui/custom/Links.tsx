"use client";

import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faTwitch,
  faXTwitter,
  faAmazon,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faLink,
  faGift,
  faEnvelope,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { userConfig } from "@/config/userConfig";
import { SectionHeading } from "./SectionHeading";
import { useRef } from "react";
import { useInView } from "motion/react";

// アイコンマッピング
const iconMap: Record<string, any> = {
  youtube: faYoutube,
  twitch: faTwitch,
  x: faXTwitter,
  amazon: faAmazon,
  gift: faGift,
  link: faLink,
  envelope: faEnvelope,
  instagram: faInstagram,
};

function LinkCard({
  label,
  url,
  icon,
  description,
  delay = 0,
}: {
  label: string;
  url: string;
  icon: string;
  description?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`group relative flex ${
        description ? "items-start" : "items-center"
      } gap-4 p-6 rounded-2xl bg-white border border-[var(--primary)]/10 shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-300`}
    >
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--primary)]/5 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
        <FontAwesomeIcon icon={iconMap[icon] || faLink} size="lg" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-2 text-[var(--foreground)] font-bold tracking-wider ${description ? "mb-1" : ""}`}>
          {label}
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="text-[var(--foreground)]/20 text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </div>
        {description && (
          <p className="text-xs text-[var(--foreground)]/60 font-text leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </motion.a>
  );
}

export function Links() {
  const { links } = userConfig;

  // 主要なSNSを抽出
  const majorSns = [
    { label: "YouTube", url: links.youtube, icon: "youtube", color: "#ff0000" },
    { label: "Twitch", url: links.twitch, icon: "twitch", color: "#9146ff" },
    { label: "X (Twitter)", url: links.x, icon: "x", color: "#000000" },
  ].filter((sns) => sns.url && sns.url.trim() !== "");

  return (
    <section
      id="links"
      className="relative w-full py-20 px-4 bg-[var(--background)]"
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeading>Links</SectionHeading>

        {/* 主要SNSエリア */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {majorSns.map((sns, idx) => (
            <motion.a
              key={sns.label}
              href={sns.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-transparent hover:border-[var(--primary)]/30 bg-[var(--primary)]/5 hover:bg-white transition-all duration-300 group"
            >
              <FontAwesomeIcon
                icon={iconMap[sns.icon]}
                className="text-2xl"
                style={{ color: "var(--foreground)" }}
              />
              <span className="font-design font-medium tracking-widest text-[var(--foreground)]">
                {sns.label}
              </span>
            </motion.a>
          ))}
        </div>

        {/* その他リンクエリア */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.others?.map((item, idx) => (
            <LinkCard
              key={item.label}
              label={item.label}
              url={item.url}
              icon={item.icon}
              description={item.description}
              delay={0.1 + idx * 0.05}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
