import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from "react-tweet";
import { type Tweet } from "react-tweet/api";
import { Suspense } from "react";

// X(Twitter) APIのトークン生成ロジック
const getToken = (id: string) =>
  ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");

/**
 * Cloudflare WorkersからXのSyndication APIを叩くと
 * データセンターIPとしてブロック(403)されるため、
 * Googlebotを偽装してフェッチを行うロジック
 */
async function fetchTweet(id: string): Promise<Tweet | undefined> {
  const fetchUrl = new URL(`https://cdn.syndication.twimg.com/tweet-result`);
  fetchUrl.searchParams.set("id", id);
  fetchUrl.searchParams.set("lang", "ja");
  fetchUrl.searchParams.set(
    "features",
    [
      "tfw_timeline_list:",
      "tfw_follower_count_sunset:true",
      "tfw_tweet_edit_backend:on",
      "tfw_refsrc_session:on",
      "tfw_fosnr_soft_interventions_enabled:on",
      "tfw_show_birdwatch_pivots_enabled:on",
      "tfw_show_business_verified_badge:on",
      "tfw_duplicate_scribes_to_settings:on",
      "tfw_use_profile_image_shape_enabled:on",
      "tfw_show_blue_verified_badge:on",
      "tfw_legacy_timeline_sunset:true",
      "tfw_show_gov_verified_badge:on",
      "tfw_show_business_affiliate_badge:on",
      "tfw_tweet_edit_frontend:on",
    ].join(";")
  );
  fetchUrl.searchParams.set("token", getToken(id));

  const res = await fetch(fetchUrl.toString(), {
    headers: {
      // CloudflareのIPブロックを回避するGooglebot偽装
      "User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    },
    // ISRを利用してキャッシュ（一定期間更新がない限り保存）
    next: { revalidate: 3600 },
  });

  if (res.ok) {
    return res.json();
  }
  if (res.status === 404) {
    console.error(`Tweet not found: ${id}`);
    return undefined;
  }

  console.error(`Failed to fetch tweet ${id}: ${res.statusText}`);
  return undefined;
}

// サーバー側で非同期にフェッチしてレンダリングする内部コンポーネント
const TweetLoader = async ({ id }: { id: string }) => {
  const tweet = await fetchTweet(id);
  // ツイートが削除済みや非公開の場合、APIは200を返すものの、userオブジェクトが存在しない(Tombstoneになる)ため
  // tweet.user の存在チェックを行い、取得不能な場合は TweetNotFound コンポーネントにフォールバックします。
  const isValidTweet = tweet != null && tweet.user != null;
  return isValidTweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />;
};

/**
 * Cloudflare Workers (OpenNext等) でブロックされない `<Tweet>` の代替コンポーネント。
 * 使い方は標準の `<Tweet id="xxx" />` と完全に同じです。
 * 内部で読み込み中状態 (Suspense) をサポートしています。
 */
export const CustomTweet = ({ id }: { id: string }) => {
  return (
    <Suspense fallback={<TweetSkeleton />}>
      <TweetLoader id={id} />
    </Suspense>
  );
};
