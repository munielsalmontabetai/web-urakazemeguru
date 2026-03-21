---
description: テンプレートのベースとなる「マスターリポジトリ」を一から構築・初期化するためのワークフロー
---

# マスター雛形構築ワークフロー

このワークフローは、プロジェクトのベースとなる Next.js (App Router) + Tailwind CSS + shadcn/ui の環境を、当プロジェクトの Rule.md に従った完全な状態で初期構築します。

// turbo
1. Next.js プロジェクトの作成
Next.js アプリケーションを作成します。
```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

// turbo
2. shadcn/ui の初期化
着せ替えUIのベースとなる shadcn/ui を初期化します。
```bash
pnpm dlx shadcn-ui@latest init -y
```

// turbo
3. 必須ライブラリのインストール
アニメーション、フォーマッター、バリデーション等の必須ライブラリをインストールします。
```bash
pnpm add motion prettier prettier-plugin-tailwindcss zod @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
```

// turbo
4. コアディレクトリの作成
上書きや同期に備え、ルールに沿った構成を作ります。
```bash
mkdir -p src/core src/config src/components/ui/custom
```

5. userConfig.ts の作成
`src/config/userConfig.ts` を初期作成し、YouTube/TwitchのIDやデフォルトのテーマカラー変数のプレースホルダーを記述します。
