"use client";

import { useEffect } from "react";

/**
 * ルートのエラーバウンダリ。
 *
 * トップページは force-dynamic で毎リクエスト実行されるため、
 * 一時的な例外（コールドスタート時のKV/サブリクエスト失敗など）が
 * そのまま全画面の "Application error" にならないよう、
 * 柔らかいフォールバックと再試行導線を提供する。
 */
export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // サーバーログ（Cloudflare observability）に digest と共に記録
    console.error("[RootError]", error.digest, error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-design mb-3 text-sm font-bold tracking-[0.3em] text-[var(--primary)]/70 uppercase">
        Oops
      </p>
      <h1 className="font-design mb-4 text-2xl font-medium text-[var(--foreground)] md:text-3xl">
        一時的に表示できませんでした
      </h1>
      <p className="font-text mb-8 max-w-md text-sm leading-relaxed text-[var(--foreground)]/60">
        ページの読み込み中に問題が発生しました。少し時間をおいて再度お試しください。
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-3 rounded-xl bg-[var(--primary)] px-8 py-3 text-xs font-bold tracking-widest text-white shadow-[var(--primary)]/20 shadow-md transition-colors hover:bg-[var(--primary)]/90"
      >
        再読み込み
      </button>
    </main>
  );
}
