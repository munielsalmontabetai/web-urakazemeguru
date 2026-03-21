---
name: generate_ogp_image
description: Next.jsの `ImageResponse` (`next/og`) を用いて、活動者名とメインビジュアルを合成した動的なOGP画像（Twitterカード用など）を自動生成するスキル
---

# `generate_ogp_image` スキル

## 概要
Next.js標準のOGP生成機能（`opengraph-image.tsx`）を活用し、`userConfig` に設定されたVTuberの名前や肩書き、およびパブリックディレクトリにある立ち絵などの画像（例: `hero-pc.png`）を動的に組み合わせて、Twitter等で美しく表示されるOGP（Open Graph Protocol）画像を自動生成します。

## 仕様とルール

1. **ファイル配置**:
   - `src/app/opengraph-image.tsx` を作成します。
   - サイズは標準的なTwitterカードに合わせ `1200x630` で出力します（`export const size = { width: 1200, height: 630 }`）。

2. **日本語（文字化け・豆腐化）対策**:
   - そのままでは日本語が描画できない（豆腐「□」になる）ため、Google Fonts APIから日本語フォント（例: `Noto Serif JP` または `Noto Sans JP`）の `ttf` データを `fetch` し、`ImageResponse` の `fonts` オプションに流し込む処理が必須です。

   ```typescript
   // フォント取得用ヘルパー関数の例
   async function getFont(family: string, weight: number, text: string) {
     const API = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
     const css = await (await fetch(API)).text();
     const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
     if (resource) {
       const response = await fetch(resource[1]);
       if (response.status === 200) {
         return await response.arrayBuffer();
       }
     }
     throw new Error('Failed to load font data');
   }
   ```
   > **Note**: 上記のようなCSSをパースする手法か、もしくは安定したCDN（ローカルにフォントファイルを置く手もある）から `.ttf` を取得します。
   > ローカルに `ttf` がない場合は、Google Fontsから取得するのが確実です。

3. **ローカル画像の読み込み（`fs.readFile`）**:
   - `public` 配下にある画像（例: `/images/hero-pc.png`）をOGP内に埋め込む場合、Vercel等にデプロイした際に対応できるように `fs.promises.readFile` を用いてBuffer化するか、あるいは公開URL付きの `<img>` を利用します。安定性としては Node.js の `fs` を用いて ArrayBuffer 化し、`src` に Base64 スキームまたはバッファ配列として注入する方法が推奨されます（またはリクエスト `URL` オブジェクトからフルパスを作ってネットワーク経由で読み込ませる）。

   ```typescript
   import { readFile } from 'node:fs/promises';
   import { join } from 'node:path';

   // ...
   const imagePath = join(process.cwd(), 'public', 'images', 'hero-pc.png');
   const imageData = await readFile(imagePath);
   const imageSrc = `data:image/png;base64,${imageData.toString('base64')}`;
   ```

4. **レイアウト例（Satori準拠）**:
   - Satori (VercelのOG生成エンジン) は、Tailwind CSSライクな `tw` プロパティや Flexbox に対応していますが、高度なCSSプロパティ（Grid, filter等）には非対応です。
   - `display: flex` で左右（または上下）にコンテナを割り当てて構築します。

   ```tsx
   import { ImageResponse } from 'next/og';
   import { userConfig } from '@/config/userConfig';

   export default async function Image() {
     // フォント取得と画像取得の準備...
     
     return new ImageResponse(
       (
         <div style={{ display: 'flex', width: '100%', height: '100%', background: userConfig.colors.background }}>
           <div style={{ display: 'flex', flexDirection: 'column', width: '50%', justifyContent: 'center', padding: '80px' }}>
             <h1 style={{ color: userConfig.colors.primary, fontSize: '80px' }}>{userConfig.profile.name}</h1>
             <p style={{ color: userConfig.colors.text, fontSize: '40px' }}>Official Site</p>
           </div>
           <div style={{ display: 'flex', width: '50%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
             <img src={imageSrc} height="630" style={{ objectFit: 'contain' }} />
           </div>
         </div>
       ),
       { width: 1200, height: 630, fonts: [ /* ... */ ] }
     );
   }
   ```

## 導入時の手順
1. `generate_ogp_image`（本スキル）をロードして設計を確認する。
2. `src/app/opengraph-image.tsx` または `src/app/opengraph-image.alt.txt`（設定に応じた代替）を作成。
3. 日本語フォントフェッチおよびローカル画像ファイル読み込みロジックを組み込む。
4. `userConfig` の配色やタイトルを参照して出力レイアウトを構築する。
