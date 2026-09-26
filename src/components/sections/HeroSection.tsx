"use client";

import React, { useRef, useEffect } from "react";
import { personalData } from "@/data/personal";
import { MagneticButton } from "../ui/MagneticButton";
import { gsap } from "@/lib/gsap";
import { HeroVisual } from "../ui/HeroVisual";
import {
  ArrowRight,
  Send,
  Github,
  Linkedin,
  Mail,
  Code,
  FileText,
  MapPin,
} from "lucide-react";

interface HeroSectionProps {
  onOpenResume: () => void;
}

export function HeroSection({ onOpenResume }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const greetingRef = useRef<HTMLParagraphElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const roleRef = useRef<HTMLParagraphElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from([badgeRef.current, greetingRef.current], {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
      })
        .from(headlineRef.current, {
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
        }, "-=0.4")
        .from(roleRef.current, {
          y: 25,
          opacity: 0,
          duration: 0.7,
        }, "-=0.5")
        .from(textRef.current, {
          y: 25,
          opacity: 0,
          duration: 0.7,
        }, "-=0.4")
        .from(ctaRef.current?.children || [], {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.4)",
        }, "-=0.3")
        .from(socialsRef.current, {
          opacity: 0,
          y: 15,
          duration: 0.5,
        }, "-=0.2");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden z-10"
    >
      {/* Three.js Interactive Background */}
      <div className="absolute inset-0 z-0">
        <HeroVisual />
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-navy-900/50 to-slate-50 dark:to-navy-900 z-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Typography & Narrative */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Status Badges */}
            <div ref={badgeRef} className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{personalData.availability}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-navy-800/80 border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>{personalData.location}</span>
              </div>
            </div>

            {/* Headline & Greeting */}
            <div className="space-y-3">
              <p ref={greetingRef} className="text-sm sm:text-base font-semibold font-mono tracking-wide text-brand-600 dark:text-brand-400">
                {personalData.label}
              </p>
              <h1
                ref={headlineRef}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
              >
                {personalData.name}
              </h1>
              <p
                ref={roleRef}
                className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
              >
                {personalData.role}
              </p>
            </div>

            {/* Supporting Intro */}
            <p ref={textRef} className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {personalData.shortBio}
            </p>

            {/* Action Buttons with Magnetic Pull */}
            <div ref={ctaRef} className="flex flex-wrap items-center gap-3.5 pt-2">
              <MagneticButton>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm transition-all shadow-md hover:shadow-lg group cursor-pointer"
                >
                  <span>View Projects</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>

              <MagneticButton>
                <a
                  href={personalData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-900 dark:text-white font-semibold text-sm transition-all border border-slate-200 dark:border-white/[0.08] cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </MagneticButton>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-slate-100 dark:hover:bg-navy-800/60 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-brand-500" />
                <span>Resume</span>
              </button>
            </div>

            {/* Social Channels Row */}
            <div ref={socialsRef} className="pt-4 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold">
                Connect:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={personalData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.email}
                  aria-label="Email"
                  className="p-2.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={personalData.socials.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode"
                  className="p-2.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500/50 shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Code className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Visual indicator */}
          <div className="lg:col-span-5 relative flex justify-center items-end lg:items-center hidden lg:block">
            <div className="w-full max-w-md text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-navy-800/90 backdrop-blur-md border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
                  Real-time 3D Scene
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}