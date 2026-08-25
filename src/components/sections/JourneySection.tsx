"use client";

import React, { useRef, useEffect } from "react";
import { journeyMilestones } from "@/data/journey";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { gsap } from "@/lib/gsap";
import { CheckCircle2 } from "lucide-react";

export function JourneySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Scroll-driven connecting line progression
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 1,
            },
          }
        );
      }

      // 2. Sequential milestone entrance
      milestoneRefs.current.forEach((item) => {
        if (!item) return;

        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          x: -25,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="journey" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="The Journey So Far"
          title="Milestones &amp; Learning Progression"
          subtitle="My growth trajectory as a student developer — from writing initial lines of code to building full-stack platforms and hackathon MVPs."
        />

        {/* Vertical Storytelling Timeline with GSAP Animated Line */}
        <div className="max-w-3xl mx-auto space-y-8 relative">
          {/* Static track background line */}
          <div className="absolute inset-0 left-4 sm:left-6 -translate-x-px w-0.5 bg-slate-200 dark:bg-navy-700/60" />

          {/* Animated Glowing Foreground Line */}
          <div
            ref={lineRef}
            className="absolute inset-0 left-4 sm:left-6 -translate-x-px w-0.5 bg-gradient-to-b from-brand-500 via-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] will-change-transform"
          />

          {journeyMilestones.map((milestone, idx) => (
            <div
              key={milestone.id}
              ref={(node) => {
                milestoneRefs.current[idx] = node;
              }}
              className="relative pl-10 sm:pl-16 will-change-transform"
            >
              {/* Timeline Node */}
              <div className="absolute left-4 sm:left-6 -translate-x-1/2 top-4 w-5 h-5 rounded-full bg-white dark:bg-navy-900 border-2 border-brand-500 flex items-center justify-center shadow-md z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              </div>

              {/* Milestone Card */}
              <GlowCard className="p-6 sm:p-7 space-y-3 bg-white dark:bg-navy-800/90 border border-slate-200 dark:border-white/[0.08]">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {milestone.phase}
                  </span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                    {milestone.year}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {milestone.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {milestone.description}
                </p>

                {/* Key Takeaways */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] space-y-1.5">
                  <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Learnings:
                  </p>
                  <ul className="space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {milestone.takeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
