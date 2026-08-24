"use client";

import React from "react";
import { personalData } from "@/data/personal";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import {
  GraduationCap,
  Hammer,
  Lightbulb,
  Compass,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="About Me"
          title="Student, Builder, and Continuous Learner"
          subtitle="A look into my engineering philosophy, academic journey, and what drives me to create software."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Narrative */}
          <div className="lg:col-span-8 space-y-6">
            <GlowCard className="p-6 sm:p-9 space-y-5">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Compass className="w-6 h-6 text-brand-500" />
                <span>My Approach &amp; Philosophy</span>
              </h3>

              {personalData.aboutStory.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base text-slate-600 dark:text-slate-300 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              {/* Core Principles */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mt-0.5">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Build to Understand
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Understanding code by writing real full-stack systems from scratch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Product-Minded
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Focusing on usability, clean user flows, and real problems.
                    </p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Right Education & Current Context Box */}
          <div className="lg:col-span-4 space-y-6">
            <GlowCard className="p-6 sm:p-7 space-y-4" glowColor="brand">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Academic Degree
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {personalData.education.degree}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Specialization in {personalData.education.specialization}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {personalData.education.institution}
                </p>
                <p className="text-slate-500">
                  Powered by {personalData.education.poweredBy}
                </p>
              </div>
            </GlowCard>

            <GlowCard className="p-6 sm:p-7 space-y-3" glowColor="emerald">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Current Status</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {personalData.availability}. Actively building projects and deepening foundations in full-stack web and AI systems.
              </p>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
}
