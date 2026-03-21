"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { SplashScreen } from "@/components/ui/custom/SplashScreen";

export function LandingPageContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div
        className={`transition-opacity duration-1000 ${showSplash ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        {children}
      </div>
    </>
  );
}
