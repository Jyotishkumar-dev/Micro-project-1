"use client";

import React from "react";
import { personalData } from "@/data/personal";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import {
  Github,
  GitBranch,
  Star,
  Code2,
  ExternalLink,
  Flame,
  Terminal,
  Layers,
} from "lucide-react";

export function GithubSection() {
  const stats = [
    { label: "Public Repositories", value: "20+", icon: FolderIcon },
    { label: "DSA & Problem Solutions", value: "350+", icon: Code2 },
    { label: "Active Project Workspaces", value: "8+", icon: GitBranch },
    { label: "Commit Consistency", value: "Continuous", icon: Flame },
  ];

  function FolderIcon(props: any) {
    return <Layers {...props} />;
  }

  const topLanguages = [
    { name: "TypeScript & JavaScript", percentage: 48, color: "bg-amber-400" },
    { name: "Java", percentage: 26, color: "bg-rose-500" },
    { name: "HTML & Tailwind CSS", percentage: 16, color: "bg-cyan-400" },
    { name: "SQL & Python", percentage: 10, color: "bg-emerald-400" },
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Open Source &amp; Activity"
          title="Building &amp; Learning in Public"
          subtitle="Continuous code commits, algorithmic practice, and open-source explorations documented on GitHub."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main GitHub Spotlight Box */}
          <div className="lg:col-span-7">
            <GlowCard className="p-6 sm:p-8 h-full flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <Github className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Jyotishkumar-dev
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        github.com/Jyotishkumar-dev
                      </p>
                    </div>
                  </div>

                  <a
                    href={personalData.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all hover:scale-105"
                  >
                    <span>Explore My GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  I maintain an active repository footprint covering full-stack web applications, AI orchestration scripts, and structured Data Structures &amp; Algorithms solutions.
                </p>

                {/* Top Languages Visual Bar */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Language Ecosystem Breakdown</span>
                    <span className="text-slate-400 font-mono text-[11px]">Primary Stacks</span>
                  </div>

                  {/* Multi-segmented color progress bar */}
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden p-0.5 gap-0.5">
                    {topLanguages.map((lang) => (
                      <div
                        key={lang.name}
                        style={{ width: `${lang.percentage}%` }}
                        className={`h-full rounded-sm ${lang.color}`}
                        title={`${lang.name}: ${lang.percentage}%`}
                      />
                    ))}
                  </div>

                  {/* Language Legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {topLanguages.map((lang) => (
                      <div key={lang.name} className="flex items-center gap-2 text-xs">
                        <span className={`w-2.5 h-2.5 rounded-full ${lang.color}`} />
                        <span className="text-slate-600 dark:text-slate-400 font-medium truncate">
                          {lang.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Terminal Quick Snippet */}
              <div className="p-3.5 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-emerald-400">$</span>
                  <span className="text-slate-400">git clone</span>
                  <span className="text-cyan-300 truncate">https://github.com/Jyotishkumar-dev/KrishiFleet-AI</span>
                </div>
                <span className="text-[10px] text-slate-500 hidden sm:inline-block">main</span>
              </div>
            </GlowCard>
          </div>

          {/* Right Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <GlowCard
                  key={idx}
                  className="p-6 flex flex-col justify-between space-y-4"
                  glowColor="cyan"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {item.value}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                      {item.label}
                    </p>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
