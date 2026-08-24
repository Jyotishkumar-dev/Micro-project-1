"use client";

import React from "react";
import { achievementsData } from "@/data/achievements";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Badge } from "../ui/Badge";
import { Award, CheckCircle2, ExternalLink } from "lucide-react";

export function AchievementsSection() {
  return (
    <section id="achievements" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Activities &amp; Credentials"
          title="Hackathons &amp; Certifications"
          subtitle="Milestones earned through competitive hackathon builds, industry certifications, and campus leadership."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievementsData.map((item) => (
            <GlowCard
              key={item.id}
              className="p-6 sm:p-7 flex flex-col justify-between space-y-4"
              glowColor="brand"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="brand">{item.badge}</Badge>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    {item.year}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
                  {item.event}
                </p>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Details */}
                <ul className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                  {item.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {item.link && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
