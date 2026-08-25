"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "brand" | "cyan" | "emerald";
}

export function GlowCard({
  children,
  className,
  glowColor = "brand",
  ...props
}: GlowCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const colorGradients = {
    brand: "radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.12), transparent 80%)",
    cyan: "radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(6, 182, 212, 0.12), transparent 80%)",
    emerald: "radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.12), transparent 80%)",
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--mouse-x": `${mousePos.x}px`,
          "--mouse-y": `${mousePos.y}px`,
        } as React.CSSProperties
      }
      className={cn(
        "glow-card relative rounded-3xl bg-white dark:bg-navy-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.07] shadow-sm dark:shadow-2xl overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-white/[0.14] group",
        className
      )}
      {...props}
    >
      {/* Radial Hover Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
        style={{
          opacity: mousePos.opacity,
          background: colorGradients[glowColor],
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
