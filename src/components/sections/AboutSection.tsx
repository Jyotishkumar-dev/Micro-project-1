"use client";

import React from "react";
import { personalData } from "@/data/personal";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Badge } from "../ui/Badge";
import {
  MapPin,
  Sparkles,
  GraduationCap,
  Briefcase,
  Compass,
  CheckCircle2,
  BookOpen,
  Layers,
} from "lucide-react";

export function AboutSection() {
  const iconMap: Record<string, React.ElementType> = {
    MapPin,
    Sparkles,
    GraduationCap,
    Briefcase,
  };

  return (
    <section id="about" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="About Me"
          title="From First Principles to Real-World Products"
          subtitle="Engineering modern web and AI applications through deliberate project building and curiosity."
        />

        {/* Top Story & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Box */}
          <div className="lg:col-span-7 space-y-6">
            <GlowCard className="p-6 sm:p-8 space-y-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-500" />
                <span>The Story &amp; Philosophy</span>
              </h3>

              {personalData.detailedBio.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base text-slate-600 dark:text-slate-300 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Build First</strong>
                    Projects over passive video tutorials.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Clean Architecture</strong>
                    Scalable patterns, RBAC, type safety.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">AI As Leverage</strong>
                    LLM tool calling, prompt engineering.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Consistency</strong>
                    Daily problem solving &amp; public learning.
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Right Info Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personalData.infoCards.map((card, index) => {
              const Icon = iconMap[card.icon] || Sparkles;
              return (
                <GlowCard
                  key={index}
                  className="p-5 flex flex-col justify-between space-y-3"
                  glowColor="cyan"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {card.highlight}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {card.title}
                    </h4>
                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {card.value}
                    </p>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </div>

        {/* Developer Journey Timeline */}
        <div className="mt-16 sm:mt-20">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Developer Journey &amp; Milestones
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Key phases that shaped my engineering mindset and product-focused approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalData.journeyTimeline.map((item) => (
              <GlowCard key={item.step} className="p-6 relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20">
                    STEP 0{item.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Currently Learning Section */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-500/5 via-cyan-500/5 to-emerald-500/5 dark:from-brand-500/10 dark:via-cyan-500/10 dark:to-emerald-500/10 border border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Currently Active Learning Focus
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Continuous deliberate improvement in foundational engineering concepts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {personalData.currentlyLearning.map((topic, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
