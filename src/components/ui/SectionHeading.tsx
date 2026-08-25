"use client";

import React, { useRef, useEffect } from "react";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";

interface SectionHeadingProps {
  badgeText?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badgeText,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "mb-12 md:mb-16 will-change-transform",
        align === "center" ? "text-center max-w-3xl mx-auto" : "text-left max-w-2xl",
        className
      )}
    >
      {badgeText && (
        <div className={cn("mb-3 flex", align === "center" ? "justify-center" : "justify-start")}>
          <Badge variant="brand" className="text-xs uppercase tracking-widest font-semibold px-3.5 py-1">
            {badgeText}
          </Badge>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
