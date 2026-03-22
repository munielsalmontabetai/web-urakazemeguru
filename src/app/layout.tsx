import type { Metadata } from "next";
import {
  Kiwi_Maru,
  M_PLUS_Rounded_1c,
  Playfair_Display,
  Noto_Serif_JP,
  Fraunces
} from "next/font/google";
import "./globals.css";
import { userConfig } from "@/config/userConfig";
import { HeaderNav } from "@/components/ui/custom/HeaderNav";
import { Footer } from "@/components/ui/custom/Footer";

const fontIdolDesign = Kiwi_Maru({
  weight: ["400", "500"],
  preload: false,
  variable: "--font-design"
});

const fontIdolText = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-text"
});

const fontElegantDesign = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-design"
});

const fontElegantText = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-text"
});

const fontDesignerDesign = Fraunces({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-design"
});

const fontDesignerText = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-text"
});

export const metadata: Metadata = {
  metadataBase: new URL(userConfig.site.url || "http://localhost:3000"),
  title: userConfig.site.title,
  description: userConfig.site.description,
  openGraph: {
    title: userConfig.site.title,
    description: userConfig.site.description,
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: userConfig.site.title,
    description: userConfig.site.description,
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isElegant = userConfig.site.themeStyle === "elegant";
  const isDesigner = userConfig.site.themeStyle === "designer";
  const designFont = isDesigner ? fontDesignerDesign : isElegant ? fontElegantDesign : fontIdolDesign;
  const textFont = isDesigner ? fontDesignerText : isElegant ? fontElegantText : fontIdolText;

  return (
    <html lang="ja">
      <body
        className={`${textFont.variable} ${designFont.variable} font-text antialiased`}
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
