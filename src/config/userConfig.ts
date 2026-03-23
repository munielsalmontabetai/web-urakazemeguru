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
      height: "158㎝（靴底ｎ㎝含む）",
      likes: ["特撮", "万年筆インク"],
      dislikes: ["ホラー全般"],
    },
    // ハッシュタグ一覧
    hashtags: [
      { id: "general", label: "総合", tag: "#浦風めぐる" },
      { id: "stream", label: "配信", tag: "#浦風便り" },
      { id: "review", label: "感想", tag: "#ぼだっこ観測" },
      { id: "clip", label: "切り抜き", tag: "#ムニエルの切身" },
      { id: "fanart", label: "ファンアート", tag: "#浦風のインク棚" },
    ],
    // ファンマークとファン名
    fanName: "ぼだっこ",
    fanMark: "🌀🐟",
    // 自己紹介動画 (YouTube ID)
    introductionVideoId: "V_hhH24DWWo", // 代表的な動画
    // 表示用タグ
    tags: ["能天使", "特撮オタク","ゲーム配信", ],
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
      { date: "2026.02.14", title: "LEAFshadeスポンサードVtuber制度 加入", category: "milestone" },
      { date: "2026.03.28", title: "どんちゃかぶい 出演", category: "event" },
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
      "https://x.com/muniel_salmon/status/2034576442663797072","https://x.com/muniel_salmon/status/1966842001003082222","https://x.com/Art_raimu/status/1930855330571071536","https://x.com/Shido_MagiChro/status/2023448556921909522",
    ],
  },

  // ガイドライン（配信マナー・二次創作など）設定
  guideline: {
    enabled: true,
    sections: [
      {
        title: "配信でのお願い（マナー）",
        content: `・作品のネタバレ、匂わせコメントはヒントを求めるまでお待ちください。\n・配信内容に関係のない自分語りや、リスナーさん同士での過度な会話にご注意ください。\n・話題に出ていない他の活動者様のお名前を出すことはお控えください。\n・不快なコメントを見かけたら、反応せずにブロック＆スルーでお願いします。\n 　みんなで楽しい配信するために、ご協力よろしくお願いします！`,
      },
      {
        title: "切り抜き動画について",
        content: `・YouTubeや各種SNSへの「切り抜き動画」の投稿は大歓迎です！\n・投稿の際は概要欄に元配信のURLとチャンネルへのリンクの記載をお願いします。\n・悪意のある編集や、発言の意図を著しく歪めるような切り抜きはご遠慮ください。\n・歌枠の切り抜きは権利の都合上お控えいただく場合があります。お手数ですが詳細は各配信の概要欄をご確認ください。\n・限定コンテンツの内容は外部への共有・転載は禁止とさせていただきます。\n・ハッシュタグ「#ムニエルの切身 」を付けてもらえると探しやすいのでぜひご活用ください！`,
      },
      {
        title: "二次創作・ファンアートについて",
        content: `・ファンアート・二次創作は大歓迎です！\n・公序良俗に反するものや、他者の権利を侵害する恐れのある作品はお控えください。\n・ハッシュタグ「#浦風のインク棚」で投稿された作品は、配信サムネイルやSNSで使用させていただく場合がございます。\n・使用NGの場合は投稿時にその旨ご記載ください。\n・当チャンネルのコンテンツ（画像・音声・配信等）をAIの学習に使用することは禁止しています。`,
      },
    ],
  },
};
