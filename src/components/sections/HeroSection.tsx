"use client";

import React from "react";
import Image from "next/image";
import { personalData } from "@/data/personal";
import {
  ArrowRight,
  Send,
  Github,
  Linkedin,
  Mail,
  Youtube,
  Code,
  FileText,
  MapPin,
  Sparkles,
} from "lucide-react";

interface HeroSectionProps {
  onOpenResume: () => void;
}

export function HeroSection({ onOpenResume }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Subtle Ambient Backlight Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Hero Typography & Narrative */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{personalData.availability}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>{personalData.location}</span>
              </div>
            </div>

            {/* Main Headline & Greeting */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-semibold font-mono tracking-wide text-brand-600 dark:text-brand-400">
                {personalData.label}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                I build digital products &amp; learn by bringing ideas to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-500 dark:from-brand-400 dark:via-indigo-300 dark:to-cyan-300">
                  life.
                </span>
              </h1>
            </div>

            {/* Supporting Intro */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {personalData.shortBio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm transition-all shadow-md hover:scale-105 group"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700/80"
              >
                <Send className="w-4 h-4" />
                <span>Let's Connect</span>
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
              >
                <FileText className="w-4 h-4 text-brand-500" />
                <span>Resume</span>
              </button>
            </div>

            {/* Social Channels Row */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold">
                Find Me On:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={personalData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.email}
                  aria-label="Email"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Code className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Real Professional Photo Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Backing Depth Layer / Glow */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-brand-600/20 via-cyan-500/20 to-transparent blur-xl opacity-75 dark:opacity-50" />

              {/* Main Photo Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
                <div className="aspect-[4/5] relative w-full overflow-hidden">
                  <img
                    src={personalData.profileImage}
                    alt="Jyotish Kumar - Software Developer"
                    className="w-full h-full object-cover object-center grayscale-0 contrast-[1.02] hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Gradient Shade at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                {/* Integrated Editorial Photo Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex items-center justify-between backdrop-blur-md bg-slate-950/40 border-t border-white/10">
                  <div>
                    <p className="font-bold text-sm tracking-tight text-white">
                      Jyotish Kumar
                    </p>
                    <p className="text-xs text-slate-300 font-mono">
                      B.Tech CS (Data Science &amp; ML)
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Building &amp; Learning</span>
                  </div>
                </div>
              </div>

              {/* Real Project Mini Highlight Pill */}
              <div className="mt-3.5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Latest Build: <strong>SmartAttend AI</strong>
                  </span>
                </div>
                <a
                  href="https://attendance-management-system-projec-steel.vercel.app/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Live Demo &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
