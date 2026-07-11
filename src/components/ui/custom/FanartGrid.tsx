import { EmbeddedTweet } from "react-tweet";
import { userConfig } from "@/config/userConfig";
import { extractTweetId } from "@/core/utils/tweet";
import { fetchRenderableTweet } from "@/core/utils/fetchTweet";
import { SectionHeading } from "./SectionHeading";

export async function FanartGrid() {
  const { fanarts } = userConfig;

  // 全ツイートを並列フェッチし、取得不能（削除済み・非公開など）はスキップする。
  // 親側でフィルタすることで、空のラッパー要素や TweetNotFound の枠を残さない。
  const tweets = fanarts.enabled
    ? (
        await Promise.all(
          fanarts.tweets.map((urlOrId) =>
            fetchRenderableTweet(extractTweetId(urlOrId))
          )
        )
      ).filter((tweet) => tweet !== null)
    : [];

  if (tweets.length === 0) {
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
          {tweets.map((tweet) => (
            <div
              key={tweet.id_str}
              className="w-full break-inside-avoid h-fit"
              data-theme="light"
            >
              <EmbeddedTweet tweet={tweet} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
