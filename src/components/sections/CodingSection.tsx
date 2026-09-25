"use client";

import React, { useRef, useEffect } from "react";
import { codingData as fallbackStats, dsaFocusAreas } from "@/data/coding";
import type { Achievement } from "@/types";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { gsap } from "@/lib/gsap";
import { Code2, Target, CheckCircle2, ExternalLink } from "lucide-react";

interface CodingSectionProps {
  /** Achievements tagged `type = 'coding'` in Supabase; falls back to bundled. */
  stats?: Achievement[];
}

export function CodingSection({ stats = fallbackStats }: CodingSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const areaRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRefs.current, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 35,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(areaRefs.current, {
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="coding" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Coding & DSA"
          title="Problem Solving & Algorithms"
          subtitle="Consistent practice on algorithmic problems to build strong computer science fundamentals."
        />

        <div className="space-y-8">
          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((item, idx) => (
              <div
                key={item.id}
                ref={(node) => {
                  cardRefs.current[idx] = node;
                }}
                className="will-change-transform"
              >
                <GlowCard
                  className="p-6 sm:p-7 flex flex-col space-y-4 h-full bg-white dark:bg-navy-800/90 border border-slate-200 dark:border-white/[0.08]"
                  glowColor="brand"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        {item.metric}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-2 border-t border-slate-100 dark:border-white/[0.08]"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </GlowCard>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {stats.length === 0 && (
            <div className="text-center py-12 px-6 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
              <Code2 className="w-8 h-8 mx-auto text-slate-400 mb-4" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No coding stats published yet
              </p>
            </div>
          )}

          {/* DSA Focus Areas */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-500" />
              <span>Focus Areas</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {dsaFocusAreas.map((area, idx) => (
                <div
                  key={area}
                  ref={(node) => {
                    areaRefs.current[idx] = node;
                  }}
                  className="will-change-transform px-3 py-1.5 rounded-lg bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-sm font-medium shadow-sm transition-colors hover:border-brand-300 dark:hover:border-brand-700"
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}