# コンポーネントおよびページ進捗管理シート

本ドキュメントは、プロジェクト固有の要件（特定のVTuber様向け機能、API連携、着せ替えUIなど）を満たすために必要なページとコンポーネントの作成状況を管理するためのものです。

### ステータス表記

- `[ ]` : 未着手
- `[/]` : 進行中
- `[x]` : 完了

---

## ページ (Pages)

- [x] **Home (`/`)**
  - メインとなるランディングページ。スプラッシュ画面、キービジュアル、各種ウィジェットを配置。
  - サーバーコンポーネント化し、ISRによる動的データ取得に対応。
  - 全セクション（Hero, About, History, Links, Schedule, Footer等）の組み立てが完了。
- [x] **Profile (`/profile`)**
  - VTuberのプロフィール、三面図、自己紹介文などを掲載。
- [ ] **Live/Schedule (`/schedule`)**
  - _※優先度高_。YouTube / Twitch APIから取得した配信スケジュールやアーカイブの一覧表示。
- [ ] **Gallery/Fanart (`/gallery`)**
  - `react-tweet` を活用したファンアートポストのギャラリー表示。
- [ ] **Guidelines (`/guidelines`)**
  - 二次創作ガイドライン、切り抜きに関する規約などを掲載。

---

## コアコンポーネント (src/core/components)

※ロジックやAPI連携を伴う、デザインに依存しないコンポーネント

- [x] **YouTube/Twitch API Fetcher** (サーバーコンポーネント)
  - ISRを利用して定期的にスケジュールを取得・キャッシュするコンポーネント。
- [x] **Fallback UI** (エラー境界)
  - API取得エラー時に前回キャッシュを表示、またはフォールバック用のUIを出す仕組み。
  - YouTubeアーカイブへのフォールバックを実装。

---

## 着せ替えUIコンポーネント (src/components/ui/custom)

※`userConfig.ts`のテーマ設定(elegant/idol/japanese等)に応じて見た目が変化するコンポーネント

- [ ] **Splash Screen (ロード画面)**
  - Framer Motionを使用したリッチな登場演出。テーマごとにモーションや背景を切り替える。
- [ ] **Hero Visual (メインビジュアル)**
  - ファーストビュー。立ち絵や自己紹介文をアニメーション付きで配置する。
- [x] **Navigation Bar (ヘッダー/メニュー)**
  - ロゴ画像を使用したレスポンシブ対応（透過ヘッダー・ハンバーガーメニュー）。
- [ ] **Section Header (見出し)**
  - 各セクション（About, Schedule等）のタイトルUI。和風なら毛筆体風、アイドル系ならポップなデザインなど。
- [ ] **Fanart Tweet Grid**
  - 今回追加した `embed_fanart_tweet` スキルを活用し、ツイートをMasonryまたはGrid状に並べるUI。
- [x] **Live Status Badge**
  - 「現在配信中」「〇時開始予定」などを視覚的にわかりやすく示すバッジ。
  - `StreamSchedule` コンポーネントに統合。

---

## 汎用UIパーツ (shadcn/ui ベース)

※状況に応じてshadcn/uiからインストールし、スタイリングを調整して用いる

- [ ] Button
- [ ] Card
- [ ] Dialog (画像拡大用モーダル等)
- [ ] Skeleton (APIロード時のプレースホルダー)

## 追加・特化セクション

- [x] **Links (各種リンク)**
  - X, YouTube, Twitch などのSNSやプラットフォームへの導線。
- [x] **Introduction Video (動画・実績)**
  - 見た目や声が分かる自己紹介動画の埋め込み。
- [x] **Achievements/History (活動実績)**
  - lit.linkから抽出したマイルストーンやイベント出演歴をタイムライン形式で表示。
- [x] **Photo (立ち絵/キービジュアル)**
  - 「イラスト」や「キャラクター」ではなく「写真(Photo)」として扱う。立ち絵を大きく見せるエリア。Profile等と統合することも検討。
