"use client";

import React from "react";
import { personalData } from "@/data/personal";
import {
  Github,
  Linkedin,
  Mail,
  Youtube,
  Code,
  ArrowUp,
  Heart,
  Sparkles,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-slate-100/60 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                JK
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Jyotish Kumar
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Full-Stack & AI Product Developer passionate about building high-impact software, scalable web architectures, and deliberate engineering.
            </p>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 pt-2">
              <a
                href={personalData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={personalData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={personalData.socials.email}
                aria-label="Email"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={personalData.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500 transition-colors"
              >
                <Code className="w-4 h-4" />
              </a>
              <a
                href={personalData.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-500 hover:border-brand-500 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#about" className="hover:text-brand-500 transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-brand-500 transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-brand-500 transition-colors">
                  Skills & Tech Stack
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-brand-500 transition-colors">
                  Experience & Leadership
                </a>
              </li>
              <li>
                <a href="#achievements" className="hover:text-brand-500 transition-colors">
                  Hackathons & Honors
                </a>
              </li>
            </ul>
          </div>

          {/* System & Availability */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4 font-mono">
              Status & Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for Opportunities</span>
              </div>
              <p>📍 Location: India (Remote friendly)</p>
              <p>⚡ Timezone: IST (GMT+5:30)</p>
              <p>✉️ Response Time: &lt; 24 Hours</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Designed &amp; built by <span className="font-semibold text-slate-700 dark:text-slate-300">Jyotish Kumar</span> • &copy; {currentYear}. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
