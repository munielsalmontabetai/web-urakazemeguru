import { Tweet } from "react-tweet";
import { userConfig } from "@/config/userConfig";
import { extractTweetId } from "@/core/utils/tweet";
import { SectionHeading } from "./SectionHeading";

export function FanartGrid() {
  const { fanarts } = userConfig;

  if (!fanarts.enabled || fanarts.tweets.length === 0) {
    return (
      <section
        id="fanart"
        className="relative w-full py-20 px-4 bg-[var(--background)]"
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeading>Fanart</SectionHeading>
          <p className="text-center text-[var(--foreground)]/40 font-text tracking-wider">
            ファンアートを募集中です！
            <br />
            <span className="text-sm">
              ポストを送っていただいた際にはこちらで紹介させていただくかもしれません。
            </span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="fanart"
      className="relative w-full py-20 md:py-32 px-4 bg-[var(--background)]"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading>Fanart</SectionHeading>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {fanarts.tweets.map((urlOrId) => (
            <div key={urlOrId} className="w-full break-inside-avoid h-fit" data-theme="light">
              <Tweet id={extractTweetId(urlOrId)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
