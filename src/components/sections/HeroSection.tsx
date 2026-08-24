"use client";

import React, { useState, useEffect } from "react";
import { personalData } from "@/data/personal";
import { Badge } from "../ui/Badge";
import { CodePreviewTerminal } from "../ui/CodePreviewTerminal";
import {
  ArrowRight,
  Send,
  Github,
  Linkedin,
  Mail,
  Youtube,
  Code,
  FileText,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface HeroSectionProps {
  onOpenResume: () => void;
}

export function HeroSection({ onOpenResume }: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % personalData.rotatingTitles.length);
        setFade(true);
      }, 250);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Subtle Background Glow Elements */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content & Copy */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            {/* Availability & Location Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{personalData.availability}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>Indore, India</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-semibold font-mono tracking-wide text-brand-600 dark:text-brand-400">
                Hi, I'm <span className="underline decoration-brand-400 underline-offset-4">{personalData.name}</span>
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                I build modern digital experiences &amp; turn ideas into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-500 dark:from-brand-400 dark:via-cyan-300 dark:to-emerald-400">
                  real products.
                </span>
              </h1>
            </div>

            {/* Rotating Role Flipper */}
            <div className="flex items-center gap-2 text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Specializing as:</span>
              <span
                className={`font-semibold text-brand-600 dark:text-brand-400 border-b-2 border-brand-500/40 pb-0.5 transition-all duration-300 ${
                  fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                }`}
              >
                {personalData.rotatingTitles[roleIndex]}
              </span>
            </div>

            {/* Short Introduction */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {personalData.shortIntro}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/25 hover:scale-105 cursor-pointer group"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700/80 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Contact Me</span>
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors"
              >
                <FileText className="w-4 h-4 text-brand-500" />
                <span>Resume</span>
              </button>
            </div>

            {/* Social Links Row */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-slate-600 dark:text-slate-400 font-bold">
                Connect:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={personalData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.email}
                  aria-label="Email"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode Profile"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Code className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Code Workspace & Profile Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 w-full">
              <CodePreviewTerminal />
            </div>

            {/* Floating Live Product Pill */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                  <img
                    src={personalData.profileImage}
                    alt={personalData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    SmartAttend AI
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Shipped &amp; Live in Production
                  </p>
                </div>
              </div>

              <a
                href="https://attendance-management-system-projec-steel.vercel.app/login"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-xs font-semibold border border-brand-200 dark:border-brand-500/30 transition-colors"
              >
                Launch App &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
