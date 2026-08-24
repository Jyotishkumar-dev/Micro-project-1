"use client";

import React from "react";
import { journeyMilestones } from "@/data/journey";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Badge } from "../ui/Badge";
import {
  Calendar,
  Compass,
  CheckCircle2,
  Sparkles,
  Milestone,
} from "lucide-react";

export function JourneySection() {
  return (
    <section id="journey" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="The Journey So Far"
          title="Milestones &amp; Learning Progression"
          subtitle="My growth trajectory as a student developer — from writing initial lines of code to building full-stack platforms and hackathon MVPs."
        />

        {/* Vertical Storytelling Timeline */}
        <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:-translate-x-px before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-cyan-400 before:to-transparent">
          {journeyMilestones.map((milestone) => (
            <div key={milestone.id} className="relative pl-10 sm:pl-16">
              {/* Timeline Node */}
              <div className="absolute left-2 sm:left-4 -translate-x-1/2 top-4 w-5 h-5 rounded-full bg-white dark:bg-slate-950 border-2 border-brand-500 flex items-center justify-center shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              </div>

              {/* Milestone Card */}
              <GlowCard className="p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {milestone.phase}
                  </span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
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
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
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
