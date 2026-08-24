"use client";

import React from "react";
import { skillTiers } from "@/data/skills";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Code2, Wrench, Sparkles, CheckCircle } from "lucide-react";

export function SkillsSection() {
  const tierIcons = [Code2, Wrench, Sparkles];

  return (
    <section id="skills" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Technical Capabilities"
          title="Skills &amp; Technologies"
          subtitle="An honest overview of languages and frameworks I build with, developer tools I use daily, and concepts I am currently exploring."
        />

        {/* 3-Tier Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {skillTiers.map((tier, index) => {
            const Icon = tierIcons[index] || Code2;

            return (
              <GlowCard
                key={tier.title}
                className="p-6 sm:p-8 flex flex-col justify-between"
                glowColor={index === 0 ? "brand" : index === 1 ? "cyan" : "emerald"}
              >
                <div>
                  {/* Tier Header */}
                  <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {tier.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {tier.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Skill Items */}
                  <div className="space-y-2.5">
                    {tier.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">
                            {skill.name}
                          </span>
                          {skill.highlight && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          )}
                        </div>
                        {skill.context && (
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {skill.context}
                          </p>
                        )}
                      </div>
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
