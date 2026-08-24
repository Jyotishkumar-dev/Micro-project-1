"use client";

import React from "react";
import { experienceData } from "@/data/experience";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Badge } from "../ui/Badge";
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Users,
  Award,
} from "lucide-react";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Experience &amp; Leadership"
          title="Technical Leadership &amp; Community"
          subtitle="A track record of engineering initiatives, department leadership, hackathon execution, and building in public."
        />

        {/* Experience Timeline */}
        <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-translate-x-px before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-cyan-400 before:to-transparent before:hidden md:before:block">
          {experienceData.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={exp.id}
                className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-500 items-center justify-center text-brand-500 shadow-md shadow-brand-500/20 z-10">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>

                {/* Card Container */}
                <div className="w-full md:w-[calc(50%-2rem)]">
                  <GlowCard className="p-6 sm:p-7 space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.period}
                        </span>
                        {exp.location && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {exp.organization}
                      </p>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Skills Tag Row */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-xs font-mono rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </GlowCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
