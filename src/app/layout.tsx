import type { Metadata } from "next";
import {
  Kiwi_Maru,
  M_PLUS_Rounded_1c,
  Playfair_Display,
  Noto_Serif_JP,
  Noto_Sans_JP,
  Fraunces,
  BIZ_UDGothic,
  Roboto
} from "next/font/google";
import "./globals.css";
import { userConfig } from "@/config/userConfig";
import { HeaderNav } from "@/components/ui/custom/HeaderNav";
import { Footer } from "@/components/ui/custom/Footer";

// すべての主要なフォントを初期化し、固有の変数名を付ける
const fontKiwiMaru = Kiwi_Maru({
  weight: ["400", "500"],
  preload: false,
  variable: "--font-kiwi"
});
const fontMPlus = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-mplus"
});
const fontPlayfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-playfair"
});
const fontNotoSerif = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-noto-serif"
});
const fontNotoSans = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-noto-sans"
});
const fontFraunces = Fraunces({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fraunces"
});
const fontBizUDGothic = BIZ_UDGothic({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-biz-udgothic"
});
const fontRoboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto"
});

// userConfigでの文字列名とフォントの紐づけ
function getFontByName(name: string | undefined, fallback: any) {
  if (!name) return fallback;
  switch (name) {
    case "Kiwi Maru":
      return fontKiwiMaru;
    case "M PLUS Rounded 1c":
      return fontMPlus;
    case "Playfair Display":
      return fontPlayfair;
    case "Noto Serif JP":
      return fontNotoSerif;
    case "Noto Sans JP":
      return fontNotoSans;
    case "Fraunces":
      return fontFraunces;
    case "BIZ UDGothic":
      return fontBizUDGothic;
    case "Roboto":
      return fontRoboto;
    default:
      return fallback;
  }
}
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  // 2. metadataBaseを設定することで、以下の相対パスが自動的に絶対URLに変換されます
  metadataBase: new URL(siteUrl),
  title: userConfig.site.title,
  description: userConfig.site.description,
  openGraph: {
    title: userConfig.site.title,
    description: userConfig.site.description,
    // metadataBaseがあるため、これだけで「https://ドメイン/images/og-image.png」になります
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: userConfig.site.title,
    description: userConfig.site.description,
    images: ["/images/og-image.png"] // ここも自動で絶対パスになります
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isElegant = userConfig.site.themeStyle === "elegant";
  const isDesigner = userConfig.site.themeStyle === "designer";

  // デフォルトフォールバック
  const defaultDesignFont = isDesigner
    ? fontFraunces
    : isElegant
      ? fontPlayfair
      : fontKiwiMaru;
  const defaultTextFont = isDesigner
    ? fontNotoSerif
    : isElegant
      ? fontNotoSerif
      : fontMPlus;

  const designFont = getFontByName(userConfig.fonts?.design, defaultDesignFont);
  const textFont = getFontByName(userConfig.fonts?.text, defaultTextFont);

  const fontVariables = `${fontKiwiMaru.variable} ${fontMPlus.variable} ${fontPlayfair.variable} ${fontNotoSerif.variable} ${fontNotoSans.variable} ${fontFraunces.variable} ${fontBizUDGothic.variable} ${fontRoboto.variable}`;

  return (
    <html lang="ja">
      <body
        className={`${fontVariables} font-text antialiased`}
        style={
          {
            "--primary": userConfig.colors.primary,
            "--primary-foreground": userConfig.colors.background,
            "--secondary": userConfig.colors.secondary,
            "--secondary-foreground": userConfig.colors.text,
            "--accent": userConfig.colors.accent || userConfig.colors.primary,
            "--accent-foreground": userConfig.colors.text,
            "--background": userConfig.colors.background,
            "--foreground": userConfig.colors.text,
            // Next.jsのフォント変数による意図しないフォールバックを防ぐため
            // 英語フォントの後に明示的に日本語フォント（textFont.style.fontFamily）を指定します
            "--font-design": `${designFont.style.fontFamily}, ${textFont.style.fontFamily}, serif`,
            "--font-text": `${textFont.style.fontFamily}, sans-serif`
          } as React.CSSProperties
        }
      >
        <div className="flex min-h-screen flex-col">
          <HeaderNav />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
