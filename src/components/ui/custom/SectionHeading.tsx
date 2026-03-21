// src/components/ui/custom/SectionHeading.tsx
// 各セクションの共通見出しコンポーネント

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-10 md:mb-14">
      <div className="h-px flex-1 bg-[var(--primary)]/40" />
      <h2 className="text-2xl md:text-4xl font-design font-medium text-[var(--foreground)] tracking-widest whitespace-nowrap">
        {children}
      </h2>
      <div className="h-px flex-1 bg-[var(--primary)]/40" />
    </div>
  );
}
