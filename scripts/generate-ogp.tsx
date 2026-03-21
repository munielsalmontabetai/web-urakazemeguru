import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { userConfig } from "../src/config/userConfig";
import React from "react";

async function loadGoogleFont(family: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(url, {
      headers: {
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

async function generate() {
  console.log("Generating OGP image from userConfig...");
  const { profile, colors, fonts } = userConfig;
  const fontFamily = fonts?.text || "sans-serif";
  const textToRender = `${profile.name}Official Site`;
  const fontData = await loadGoogleFont(fontFamily, textToRender);

  if (!fontData) {
    throw new Error("Failed to load font from Google Fonts");
  }

  let imageSrc = "";
  try {
    const filePath = join(process.cwd(), "public", "images", "hero-pc.png");
    const buffer = await readFile(filePath);
    imageSrc = `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.warn("Could not load public/images/hero-pc.png. Proceeding without hero image.");
  }

  const svg = await satori(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decor (Circle) */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-20%",
          width: "1000px",
          height: "1000px",
          borderRadius: "50%",
          backgroundColor: colors.primary,
          opacity: 0.05,
        }}
      />

      {/* Hero Image */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          display: "flex",
          width: "60%",
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
              height: "110%",
              marginBottom: "-5%",
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

      {/* Text Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "100px",
          width: "100%",
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
              color: colors.primary,
              margin: 0,
              lineHeight: 1.1,
              fontFamily: fontFamily,
              letterSpacing: "0.05em",
            }}
          >
            {profile.name}
          </h1>
          <p
            style={{
              fontSize: "42px",
              color: colors.text,
              margin: 0,
              opacity: 0.9,
              letterSpacing: "0.2em",
              fontFamily: fontFamily,
            }}
          >
            Official Site
          </p>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: fontFamily,
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    font: {
      loadSystemFonts: false,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outputPath = join(process.cwd(), "public", "images", "og-image.png");
  await writeFile(outputPath, pngBuffer);
  console.log(`Successfully generated static OGP: public/images/og-image.png`);
}

generate().catch((err) => {
  console.error("Error generating OGP:", err);
  process.exit(1);
});
