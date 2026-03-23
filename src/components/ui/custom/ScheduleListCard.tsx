"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";
import { faClock, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { StreamItem } from "@/core/types/streaming";

interface ScheduleListCardProps {
  item: StreamItem;
  delay?: number;
}

export function ScheduleListCard({ item, delay = 0 }: ScheduleListCardProps) {
  const isLive = item.status === "live";
  const isUpcoming = item.status === "upcoming";
  const isArchive = item.status === "none";

  return (
    <div className="group h-full">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full bg-white rounded-2xl overflow-hidden border transition-all duration-300 shadow-sm relative z-10 
          ${
            isLive
              ? "border-red-500/30 hover:shadow-lg hover:border-red-500/50"
              : "border-[var(--primary)]/10 hover:shadow-md hover:border-[var(--primary)]/30"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Thumbnail Area */}
          <div className="relative w-full aspect-video overflow-hidden bg-[var(--primary)]/5 shrink-0">
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Status Badge */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isLive && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-[10px] font-bold tracking-widest rounded-full uppercase shadow-md shadow-red-500/20">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Live Now
                </div>
              )}
              {isUpcoming && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-widest rounded-full uppercase shadow-md">
                  <FontAwesomeIcon icon={faClock} />
                  Upcoming
                </div>
              )}
              {isArchive && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold tracking-widest rounded-full uppercase border border-white/10 shadow-md">
                  <FontAwesomeIcon icon={faCirclePlay} />
                  Archive
                </div>
              )}
            </div>
          </div>

          {/* Info Area */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300
                    ${
                      isLive
                        ? "bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white"
                        : "bg-[var(--primary)]/5 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={item.platform === "youtube" ? faYoutube : faTwitch}
                      className="text-sm"
                    />
                  </div>
                  {item.scheduledStartTime && (
                    <span className="text-xs sm:text-sm font-bold tracking-wider text-[var(--foreground)]/70 font-text ml-1 gap-1 flex items-center">
                      {new Date(item.scheduledStartTime).toLocaleString("ja-JP", {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-[var(--foreground)] tracking-wider line-clamp-2 leading-relaxed mb-4">
                {item.title}
              </h4>
            </div>

            {isLive && (
              <div className="mt-auto">
                <span className="text-xs font-bold text-red-500 tracking-widest uppercase group-hover:underline underline-offset-4">
                  Watch Stream →
                </span>
              </div>
            )}
            {!isLive && (
              <div className="mt-auto">
                <span className="text-xs font-bold text-[var(--primary)]/70 tracking-widest uppercase group-hover:text-[var(--primary)] transition-colors">
                  {isUpcoming ? "Waiting Room →" : "Watch Archive →"}
                </span>
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}
