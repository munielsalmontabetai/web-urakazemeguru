"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { userConfig } from "@/config/userConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export function AdditionalAchievements({ className = "" }: { className?: string }) {
  const achievements = userConfig.profile.achievements;

  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <section id="additional-achievements" className={`relative mx-auto w-full max-w-4xl px-4 py-8 md:px-0 md:py-16 ${className}`}>
      <div className="flex flex-col gap-12">
        {achievements.map((group, gIdx) => (
          <AchievementGroup key={gIdx} group={group} gIdx={gIdx} />
        ))}
      </div>
    </section>
  );
}

function AchievementGroup({ group, gIdx }: { group: { title: string; items: string[] }; gIdx: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const LIMIT = 6;
  const hasMore = group.items.length > LIMIT;
  const displayedItems = isExpanded ? group.items : group.items.slice(0, LIMIT);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: gIdx * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-col gap-6"
    >
      <h3 className="flex items-center gap-3 font-design text-xl font-bold text-[var(--foreground)] md:text-2xl">
        <span className="h-6 w-1 rounded-full bg-[var(--primary)]" />
        {group.title}
      </h3>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-2">
        {displayedItems.map((item, iIdx) => (
          <motion.div
            key={iIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: iIdx * 0.03 }}
            className="group flex flex-col justify-center rounded-xl bg-white/50 px-5 py-4 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md border border-[var(--primary)]/5"
          >
            <p className="text-sm font-medium leading-relaxed text-[var(--foreground)] md:text-base">
              {item}
            </p>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-2 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-white px-6 py-2 text-sm font-bold text-[var(--foreground)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md"
          >
            {isExpanded ? "閉じる" : `もっと見る (${group.items.length - LIMIT}件)`}
            <FontAwesomeIcon
              icon={isExpanded ? faChevronUp : faChevronDown}
              className="text-xs transition-transform group-hover:translate-y-0.5"
            />
          </button>
        </div>
      )}
    </motion.div>
  );
}
