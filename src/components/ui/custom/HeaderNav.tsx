"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

import { userConfig } from "@/config/userConfig";

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Schedule", href: "/schedule" },
];

export function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // ユーザー設定からナビゲーションアイテムを動的に生成
  const navItems = [
    ...baseNavItems,
    ...(userConfig.profile?.history && userConfig.profile.history.length > 0
      ? [{ label: "History", href: "/history" }]
      : []),
    ...(userConfig.guideline && userConfig.guideline.enabled
      ? [{ label: "Guideline", href: "/guideline" }]
      : []),
  ];

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ページ遷移時にモバイルメニューを閉じる
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="relative z-50 flex items-center gap-3 group">
            <div className="w-[120px] h-10 relative overflow-hidden transition-opacity group-hover:opacity-80">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* デスクトップメニュー */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-bold tracking-widest uppercase transition-colors relative group ${
                  pathname === item.href
                    ? "text-[var(--primary)]"
                    : "text-[var(--foreground)]/70 hover:text-[var(--primary)]"
                }`}
              >
                {item.label}
                {/* アクティブ時のインジケーター */}
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--primary)]"
                  />
                )}
                {/* ホバー時のインジケーター */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--primary)]/50 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-[var(--foreground)] focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faXmark : faBars}
              className="text-xl"
            />
          </button>
        </div>
      </header>

      {/* モバイルメニューオーバーレイ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`text-2xl font-design font-bold tracking-widest ${
                      pathname === item.href
                        ? "text-[var(--primary)]"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            {/* 装飾 */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-[var(--primary)] opacity-10 blur-3xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
