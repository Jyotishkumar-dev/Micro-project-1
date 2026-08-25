"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function CursorLight() {
  const lightRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    // Disable on touch devices
    if (window.matchMedia("(hover: none)").matches) {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isHoverable = Boolean(
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("[data-interactive]") ||
          target.closest(".glow-card")
        );
        setIsInteractive(isHoverable);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Smooth Lerp tracking loop
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updatePosition = () => {
      currentX = lerp(currentX, mouseX, 0.12);
      currentY = lerp(currentY, mouseY, 0.12);

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden hidden md:block"
    >
      <div
        ref={lightRef}
        className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 pointer-events-none will-change-transform ${
          isInteractive
            ? "w-[500px] h-[500px] opacity-100 scale-105"
            : "w-[420px] h-[420px] opacity-80 scale-100"
        }`}
        style={{
          background: isDark
            ? isInteractive
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(99, 102, 241, 0.08) 35%, transparent 70%)"
              : "radial-gradient(circle, rgba(99, 102, 241, 0.09) 0%, rgba(56, 189, 248, 0.04) 40%, transparent 70%)"
            : isInteractive
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(148, 163, 184, 0.04) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(148, 163, 184, 0.05) 0%, transparent 65%)",
          filter: "blur(25px)",
        }}
      />
    </div>
  );
}
