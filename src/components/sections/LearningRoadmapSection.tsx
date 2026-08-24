"use client";

import React from "react";
import { learningRoadmapData } from "@/data/learning";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Badge } from "../ui/Badge";
import { CheckCircle2, Clock, Compass, Sparkles } from "lucide-react";

export function LearningRoadmapSection() {
  const statusConfig = {
    mastered: {
      badgeText: "Mastered & Shipped",
      variant: "success" as const,
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    "in-progress": {
      badgeText: "Actively Practicing",
      variant: "brand" as const,
      icon: Sparkles,
      color: "text-brand-500",
    },
    planned: {
      badgeText: "Upcoming Focus",
      variant: "warning" as const,
      icon: Clock,
      color: "text-amber-500",
    },
  };

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Always Building. Always Learning."
          title="Engineering Growth &amp; Trajectory"
          subtitle="A transparent breakdown of my core proficiencies, current technical deep-dives, and strategic roadmap."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningRoadmapData.map((item, index) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;

            return (
              <GlowCard
                key={index}
                className="p-6 sm:p-7 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={config.variant}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{config.badgeText}</span>
                    </Badge>
                    <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Key Focus Topics:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
