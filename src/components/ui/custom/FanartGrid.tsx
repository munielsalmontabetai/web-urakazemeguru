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
        className="relative w-full bg-[var(--background)] px-4 py-20"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeading>Fanart</SectionHeading>
          <p className="font-text text-center tracking-wider text-[var(--foreground)]/40">
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
      className="relative w-full bg-[var(--background)] px-4 py-20 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading>Fanart</SectionHeading>
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
          {tweets.map((tweet) => (
            <div
              key={tweet.id_str}
              className="h-fit w-full break-inside-avoid"
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
