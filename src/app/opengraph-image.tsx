import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { userConfig } from "@/config/userConfig";

export const runtime = "nodejs";

export const alt = `${userConfig.site.title} OGP`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * 日本語が含まれる文字列をGoogle FontsからTTFとして取得するヘルパー
 */
async function loadGoogleFont(family: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (
    await fetch(url, {
      headers: {
        // WOFF2ではなくTTF形式を返させるための古いUser-Agent偽装
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (!resource) return null;

  const fontResponse = await fetch(resource[1]);
  if (!fontResponse.ok) return null;

  return await fontResponse.arrayBuffer();
}

export default async function Image() {
  const { profile, colors, fonts } = userConfig;
  
  // userConfig設定のフォントを参照
  const fontFamily = fonts?.text || "sans-serif";

  // OGPに描画するテキスト（すべて含めてフォントのサブセットを取得する）
  const textToRender = `${profile.name}Official SiteOfficialSite`;
  const fontData = await loadGoogleFont(fontFamily, textToRender);

  // ローカル（public）の読み込み
  let imageSrc = "";
  try {
    const filePath = join(process.cwd(), "public", "images", "hero-pc.png");
    const buffer = await readFile(filePath);
    imageSrc = `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Failed to read OGP hero image:", error);
  }

  // レイアウトの組み立て
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: colors.background, // userConfig設定に基づく
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 装飾の背景グラデーション */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-20%",
            width: "60%",
            height: "100%",
            background: `radial-gradient(circle, ${colors.primary}33 0%, transparent 70%)`,
          }}
        />

        {/* 右側: キャラクター画像エリア (背面に配置するため先に記述) */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            display: "flex",
            width: "60%", // 画像を少し大きめに確保
            height: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: "0 40px",
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              style={{
                objectFit: "contain",
                height: "110%", // 少しはみ出させるレイアウト
                marginBottom: "-5%", // 下部を画面外に隠す
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colors.secondary,
                opacity: 0.1,
              }}
            />
          )}
        </div>

        {/* 左側: テキストエリア (前面に配置するため後に記述) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "100px",
            width: "100%", // 全体に広げてテキストが被っても切り取られないようにする
            height: "100%",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "100px",
                fontWeight: 700,
                color: colors.primary, // userConfig設定
                margin: 0,
                lineHeight: 1.1,
                fontFamily: fontData ? `"${fontFamily}"` : "sans-serif",
                letterSpacing: "0.05em",
                // 文字の周りをぼかすためのシャドウレイヤー（背景色を複数回重ねてぼんやりさせる）
                textShadow: `0 0 20px ${colors.background}, 0 0 40px ${colors.background}, 0 0 60px ${colors.background}, 2px 2px 4px rgba(0,0,0,0.2)`,
              }}
            >
              {profile.name}
            </h1>
            <p
              style={{
                fontSize: "42px",
                color: colors.text,
                margin: 0,
                opacity: 0.9, // 視認性向上のため少し濃く
                letterSpacing: "0.2em",
                fontFamily: fontData ? `"${fontFamily}"` : "sans-serif",
                textShadow: `0 0 10px ${colors.background}, 0 0 20px ${colors.background}`,
              }}
            >
              Official Site
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: fontFamily,
              data: fontData,
              style: "normal",
              weight: 700,
            },
          ]
        : undefined,
    }
  );
}
