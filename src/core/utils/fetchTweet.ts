import { type Tweet } from "react-tweet/api";

/**
 * fetchTweet.ts
 *
 * X (Twitter) の Syndication API からツイートを取得し、
 * react-tweet の `EmbeddedTweet` がそのまま描画できる形に整えるサーバー用ユーティリティ。
 *
 * 取得不能（削除済み・非公開・APIエラー）や、entity 配列の欠落といった
 * 変則ペイロードを呼び出し側に漏らさず、描画可能なら正規化済みの Tweet を、
 * 不能なら null を返すことで「取得できないツイートはスキップ」を実現する。
 */

const SYNDICATION_URL = "https://cdn.syndication.twimg.com/tweet-result";

// react-tweet 公式と同一のトークン生成ロジック（toString(36)）
const getToken = (id: string): string =>
  ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");

/**
 * Cloudflare Workers から Syndication API を叩くと、データセンターIPとして
 * ブロック(403)されるため、Googlebot を偽装してフェッチする。
 *
 * @returns 取得できたツイート。404・その他エラー時は undefined（フォールバック安全）
 */
async function fetchRawTweet(id: string): Promise<Tweet | undefined> {
  const url = new URL(SYNDICATION_URL);
  url.searchParams.set("id", id);
  url.searchParams.set("lang", "ja");
  url.searchParams.set(
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
      "tfw_tweet_edit_frontend:on"
    ].join(";")
  );
  url.searchParams.set("token", getToken(id));

  try {
    const res = await fetch(url.toString(), {
      headers: {
        // CloudflareのIPブロックを回避するGooglebot偽装
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
      },
      // ISRを利用してキャッシュ（一定期間更新がない限り保存）
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      return (await res.json()) as Tweet;
    }
    if (res.status === 404) {
      console.error(`[fetchTweet] Tweet not found: ${id}`);
      return undefined;
    }
    console.error(
      `[fetchTweet] Failed to fetch tweet ${id}: ${res.statusText}`
    );
    return undefined;
  } catch (err) {
    console.error(`[fetchTweet] Fetch error for tweet ${id}:`, err);
    return undefined;
  }
}

/**
 * react-tweet の `getEntities` は `entities.{hashtags,user_mentions,urls,symbols}` を
 * 無条件に `for (const entity of ...)` で走査する。一方 X の Syndication API は、
 * 空の entity 配列をキーごと省略する（例: URLを含まない投稿には `urls`/`symbols` が無い）。
 * そのまま渡すと undefined を走査して "X is not iterable" でクラッシュするため、
 * 欠けている配列を `[]` で補完する。media など他フィールドは温存する。
 */
type EntityArrays = {
  hashtags?: unknown;
  user_mentions?: unknown;
  urls?: unknown;
  symbols?: unknown;
};

function normalizeEntities(
  entities: EntityArrays | undefined
): Tweet["entities"] {
  const e = entities ?? {};
  return {
    ...e,
    hashtags: Array.isArray(e.hashtags) ? e.hashtags : [],
    user_mentions: Array.isArray(e.user_mentions) ? e.user_mentions : [],
    urls: Array.isArray(e.urls) ? e.urls : [],
    symbols: Array.isArray(e.symbols) ? e.symbols : []
  } as Tweet["entities"];
}

// getEntities が描画前提とする最小フィールド（text と display_text_range）の有無を確認する
function isRenderableBase(tweet: {
  text?: unknown;
  display_text_range?: unknown;
}): boolean {
  return (
    typeof tweet.text === "string" && Array.isArray(tweet.display_text_range)
  );
}

/**
 * 取得したツイートを描画可能な形に整える。
 * - 削除済み・非公開（Tombstone: user/text を持たない）の場合は null を返す
 * - entity 配列の欠落を補完し、引用ツイートも同様に正規化（不正なら除去）する
 */
function prepareTweet(tweet: Tweet | undefined): Tweet | null {
  if (tweet == null || tweet.user == null || !isRenderableBase(tweet)) {
    return null;
  }

  const prepared: Tweet = {
    ...tweet,
    entities: normalizeEntities(tweet.entities)
  };

  // 引用ツイートも getEntities を通る。描画可能なら正規化し、不正なら安全に取り除く。
  if (tweet.quoted_tweet) {
    prepared.quoted_tweet = isRenderableBase(tweet.quoted_tweet)
      ? {
          ...tweet.quoted_tweet,
          entities: normalizeEntities(tweet.quoted_tweet.entities)
        }
      : undefined;
  }

  return prepared;
}

/**
 * ツイートを取得し、描画可能な形に整えて返す。
 * 取得不能（削除済み・非公開・APIエラー等）の場合は null を返すので、
 * 呼び出し側で `filter(Boolean)` 等によりスキップできる。
 */
export async function fetchRenderableTweet(id: string): Promise<Tweet | null> {
  const prepared = prepareTweet(await fetchRawTweet(id));
  if (prepared == null) {
    console.warn(
      `[fetchTweet] Tweet ${id} は取得不能（削除済み・非公開など）のためスキップしました。` +
        `userConfig からの削除を検討してください。`
    );
  }
  return prepared;
}
