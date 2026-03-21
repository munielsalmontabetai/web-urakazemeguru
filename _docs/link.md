# Official Documentation Links

このプロジェクトで使用する主要ライブラリの公式ドキュメントです。
コード生成や技術的な判断を行う際は、以下のドキュメントの最新仕様を優先的に参照してください。

1. **React**
   - [React Official Docs](https://react.dev/learn)
   - 指針: Server ComponentsとClient Componentsの適切な使い分け。

2. **Next.js (App Router)**
   - [Next.js Documentation](https://nextjs.org/docs)
   - 指針: App Router、ISR、Imageコンポーネントの最適化。

3. **Tailwind CSS**
   - [Tailwind CSS Documentation](https://tailwindcss.com/docs)
   - 指針: ユーティリティクラスの活用、`tailwind.config.ts` によるテーマ拡張。

4. **Motion (formerly Framer Motion)**
   - [Motion Documentation](https://motion.dev/docs/react)
   - 指針: ロード画面や見出しのアニメーション、レイアウト遷移の演出。

5. **Font Awesome (React)**
   - [Font Awesome React Component](https://fontawesome.com/docs/web/use-with/react)
   - 指針: アイコンのSVGインポートによるバンドルサイズ最適化。

6. **Cloudflare Workers / OpenNext.js**
   - [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/) / [OpenNext.js Documentation](https://opennext.js.org/)
   - 指針: デプロイ環境の標準。複数人でのリポジトリ編集が行いやすく、高速で低コストなEdge環境でのNext.jsアプリケーション実行を実現するために使用する。

7. **shadcn/ui**
   - [shadcn/ui Documentation](https://ui.shadcn.com/docs)
   - 指針: UIコンポーネントのベース。コンポーネントコードを直接プロジェクトに取り込み、Tailwind CSSでデザインの「着せ替え」要件に合わせて魔改造する。

8. **pnpm**
   - [pnpm Documentation](https://pnpm.io/ja/motivation)
   - 指針: パッケージマネージャーの標準。インストール速度向上とディスクスペース節約のため、本プロジェクトでは `npm` ではなく `pnpm` を使用する。

9. **Zod**
   - [Zod Documentation](https://zod.dev/)
   - 指針: 型バリデーション。YouTube APIのレスポンスや、クライアントが設定する `userConfig.ts` の値の安全性を保証し、予期せぬクラッシュを防ぐために使用する。

10. **ESLint / Prettier**
    - [ESLint Docs](https://eslint.org/docs/latest/) / [Prettier Docs](https://prettier.io/docs/en/) / [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
    - 指針: コードフォーマッター。AIによるコード生成時や複数人での開発においてコードの美しさを保つ。必ず `prettier-plugin-tailwindcss` を導入し、Tailwindのクラス記述順を公式推奨の順序に自動で並び替える。

11. **Twitch API**
    - [Twitch API Reference](https://dev.twitch.tv/docs/api/)
    - 指針: YouTubeと並ぶ主要配信プラットフォームとして連携。配信スケジュール、ライブステータス、アーカイブ動画などの各種データを取得し統合するために使用する。

12. **YouTube API**
    - [YouTube Data API v3](https://developers.google.com/youtube/v3)
    - 指針: YouTubeと並ぶ主要配信プラットフォームとして連携。配信スケジュール、ライブステータス、アーカイブ動画などの各種データを取得し統合するために使用する。
