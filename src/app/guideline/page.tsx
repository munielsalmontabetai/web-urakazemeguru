import { Metadata } from "next";
import { userConfig } from "@/config/userConfig";
import { SectionHeading } from "@/components/ui/custom/SectionHeading";

export const metadata: Metadata = {
  title: "Guideline",
  description: "配信やファンアートなどのガイドライン・ルール",
};

export default function GuidelinePage() {
  const { guideline } = userConfig;

  // ガイドラインの設定がない、または非公開の場合
  if (!guideline || !guideline.enabled) {
    return (
      <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 flex items-center justify-center">
        <p className="text-[var(--foreground)]/50">ガイドラインは現在非公開です。</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-40 -left-64 w-[500px] h-[500px] rounded-full bg-[var(--primary)] opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-64 w-[500px] h-[500px] rounded-full bg-[var(--secondary)] opacity-5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionHeading>Guideline</SectionHeading>
          <p className="text-[var(--foreground)]/60 text-sm tracking-[0.2em] mt-2 font-text uppercase font-bold">
            Rules & Manners
          </p>
        </div>

        <div className="space-y-12">
          {guideline.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 md:p-12 border border-[var(--primary)]/10 shadow-sm relative overflow-hidden group hover:border-[var(--primary)]/30 transition-colors duration-300"
            >
              {/* 装飾アクセント */}
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--primary)]/20 group-hover:bg-[var(--primary)]/80 transition-colors duration-300" />
              
              <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-widest mb-6 flex items-center gap-3">
                <span className="text-[var(--primary)]/40 text-sm font-design">{(idx + 1).toString().padStart(2, '0')}.</span>
                {section.title}
              </h2>
              
              <div className="text-[var(--foreground)]/80 leading-relaxed font-text tracking-wider whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
