"use client";

import React, { useRef, useEffect } from "react";
import { leadershipData as fallbackExperience } from "@/data/leadership";
import type { LeadershipActivity } from "@/types";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { gsap } from "@/lib/gsap";
import { CheckCircle2, Award, Users, Target, BookOpen } from "lucide-react";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  leadership: Users,
  hackathon: Award,
  ambassador: Target,
  club: BookOpen,
  workshop: CheckCircle2,
};

const typeColors: Record<string, "brand" | "cyan" | "emerald"> = {
  leadership: "brand",
  hackathon: "emerald",
  ambassador: "cyan",
  club: "brand",
  workshop: "emerald",
};

interface ExperienceSectionProps {
  /** Supabase rows when available; falls back to the bundled copy. */
  experience?: LeadershipActivity[];
}

export function ExperienceSection({
  experience = fallbackExperience,
}: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(itemRefs.current, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Experience & Leadership"
          title="Technical Leadership & Activities"
          subtitle="Roles where I've led teams, organized events, and represented my institution in technical capacities."
        />

        <div className="space-y-6">
          {experience.map((item, idx) => {
            const Icon = typeIcons[item.type];
            const glowColor = typeColors[item.type] as "brand" | "cyan" | "emerald";

            return (
              <div
                key={item.id}
                ref={(node) => {
                  itemRefs.current[idx] = node;
                }}
                className="will-change-transform"
              >
                <GlowCard
                  className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white dark:bg-navy-800/90 border border-slate-200 dark:border-white/[0.08]"
                  glowColor={glowColor}
                >
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mt-0.5">
                            {item.event}
                          </p>
                        </div>
                      </div>
                      <div className="text-right sm:text-left flex-shrink-0">
                        <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                          {item.role}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.period}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {item.highlights.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-white/[0.08]">
                        {item.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right sm:text-left">
                    {item.organization && item.organization !== item.event && (
                      <p className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                        {item.organization}
                      </p>
                    )}
                  </div>
                </GlowCard>
              </div>
            );
          })}
        </div>

        {/* Empty state — nothing published yet. */}
        {experience.length === 0 && (
          <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
            <Users className="w-8 h-8 mx-auto text-slate-400 mb-4" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No leadership activities published yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
}