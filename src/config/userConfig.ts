import { UserConfig } from "@/types/userConfig";

/**
 * userConfig.ts
 *
 * 各VTuber（クライアント）向けの設定ファイルです。
 * クライアント固有のYouTube IDやTwitch ID、配色テーマ、希望するデザインジャンル
 * （エレガント/アイドル/和風など）の変数をここに集約します。
 */

export const userConfig: UserConfig = {
  // 配信プラットフォームの設定 (YouTube or Twitch)
  platforms: {
    youtube: {
      enabled: true,
      channelId: "UCDM2_Nanp9ridOVNFKvMGUg", // 浦風めぐる様 YouTube Channel ID
      apiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "",
    },
    twitch: {
      enabled: false,
      channelId: "",
      clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "",
      secretId: process.env.TWITCH_CLIENT_SECRET || "",
    },
  },

  // サイト全体の基本情報設定
  site: {
    url: "https://urakazemeguru.v-streamer.jp",
    title: "浦風めぐる Official Site",
    description:
      "クールビューティーな能天使Vtuber、浦風めぐるの公式サイトです。人間界を満喫中の彼女の活動情報をお届けします。",
    // テーマの種類：'elegant' | 'idol' | 'japanese' 等（Rule.md準拠）
    themeStyle: "idol",
  },

  // カスタム配色設定（着せ替え用）
  colors: {
    primary: "#4c69aa", // メインカラー
    secondary: "#A7B6D1", // サブカラー
    accent: "#8fa3cf", // アクセントカラー (サブカラーより少し明るめのトーン)
    background: "#f5faff", // 背景色
    text: "#24313d", // テキストカラー
  },

  // フォント設定
  fonts: {
    text: "M PLUS Rounded 1c",
    design: "Kiwi Maru",
  },

  // プロフィール・自己紹介設定
  profile: {
    name: "浦風 めぐる",
    nameEn: "Urakaze Meguru",
    concept: "クールビューティーな能天使Vtuber",
    // 自己紹介文
    bio: `とある事情で天界パスポートを紛失し、天界に帰れなくなりました。配信を通じて目撃情報を集める――はずが、現在はすっかり人間界を満喫中です。どうぞごひいきに！`,
    catchphrase: "誰がどう見てもクールビューティー……のはず",
    // プロフィール詳細
    details: {
      birthday: "11月14日",
      debut: "2024年10月29日",
      height: "???",
      likes: ["人間界の食べ物", "ムニエル"],
      dislikes: ["パスポート紛失"],
    },
    // ハッシュタグ一覧
    hashtags: [
      { id: "general", label: "総合", tag: "#浦風めぐる" },
      { id: "stream", label: "配信", tag: "#浦風便り" },
      { id: "review", label: "感想", tag: "#ぱだっこ観測" },
      { id: "clip", label: "切り抜き", tag: "#ムニエルの切身" },
      { id: "fanart", label: "ファンアート", tag: "#浦風のインク棚" },
    ],
    // ファンマークとファン名
    fanName: "ぱだっこ",
    fanMark: "🌀🐟",
    // 自己紹介動画 (YouTube ID)
    introductionVideoId: "V_hhH24DWWo", // 代表的な動画
    // 表示用タグ
    tags: ["能天使", "クールビューティー", "パスポート紛失"],
    // 活動履歴・実績 (タイムライン用)
    history: [
      { date: "2024.10.29", title: "YouTube初配信", category: "milestone" },
      {
        date: "2025.05.31",
        title: "おいらのイタリアン×LEAFshade 出演",
        category: "event",
      },
      {
        date: "2025.11.01",
        title: "メンバーシップ開設",
        category: "milestone",
      },
      {
        date: "2026.01.11",
        title: "Vtuberわくわくmeets! 出演",
        category: "event",
      },
      {
        date: "2026.01.31",
        title: "世界遺産deバーチャルLIVE！ 富岡製糸場 出演",
        category: "event",
      },
      { date: "2026.03.28", title: "どんちゃかぷい 出演", category: "event" },
      { date: "2026.04.25", title: "ぶいの一つ 出演", category: "event" },
    ],
  },

  // リンク・SNS設定
  links: {
    x: "https://x.com/muniel_salmon",
    xSub: "https://x.com/UrakazenoUra",
    youtube: "https://www.youtube.com/@muniel_salmon",
    // 汎用的なリンク集（Linksセクション用）
    others: [
      {
        label: "Lit.link",
        url: "https://lit.link/muniel8salmon",
        icon: "link",
        description: "",
      },
      {
        label: "マシュマロ",
        url: "https://marshmallow-qa.com/muniel_salmon",
        icon: "marshmallow",
        description: "",
      },
      {
        label: "オーエン配送",
        url: "https://ouen55.com/muniel_salmon/",
        icon: "mail",
        description: "",
      },
    ],
  },

  // 写真（立ち絵）設定
  photos: {
    // その他バリエーション
    variants: ["/images/photo_1.png"],
  },

  // ファンアート（X / Twitter連携）設定
  fanarts: {
    enabled: true,
    tweets: [
      "https://x.com/muniel_salmon/status/2034576442663797072",
    ],
  },

  // ガイドライン（配信マナー・二次創作など）設定
  guideline: {
    enabled: true,
    sections: [
      {
        title: "配信でのお願い（マナー）",
        content: `・ネタバレや自分語り、他活動者様のお名前を出すことはお控えください。\n・不快なコメントを見かけても、反応せずにスルーをお願いします。`,
      },
      {
        title: "切り抜き動画について",
        content: `・切り抜きは大歓迎です！\n・必ず元配信のURLとチャンネルへのリンクを記載してください。\n・悪意のある編集はご遠慮ください。\n・ハッシュタグ「#ムニエルの切身」を付けてもらえると嬉しいです。`,
      },
      {
        title: "二次創作・ファンアートについて",
        content: `・ファンアートや二次创作はとても励みになります！\n・ハッシュタグ「#浦風のインク棚」で頂いた作品は活動で使用させていただく場合があります。\n・AI学習への利用、公序良俗に反する作品は禁止です。`,
      },
    ],
  },
};
