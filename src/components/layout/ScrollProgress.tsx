"use client";

import { useScrollPosition } from "@/hooks/useScrollPosition";

export function ScrollProgress() {
  const { scrollPercentage } = useScrollPosition();

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  );
}
