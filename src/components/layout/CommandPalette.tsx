"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { personalData } from "@/data/personal";
import {
  Search,
  Command,
  Home,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  Award,
  Mail,
  Sun,
  Moon,
  Github,
  Linkedin,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  X,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenResume,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or custom toggle
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (hash: string) => {
    onClose();
    window.location.hash = hash;
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    onClose();
  };

  const sections = [
    { name: "Home", hash: "#home", icon: Home, category: "Navigation" },
    { name: "About Me", hash: "#about", icon: User, category: "Navigation" },
    { name: "Featured Projects", hash: "#projects", icon: FolderGit2, category: "Navigation" },
    { name: "Skills & Tech Stack", hash: "#skills", icon: Cpu, category: "Navigation" },
    { name: "Experience & Leadership", hash: "#experience", icon: Briefcase, category: "Navigation" },
    { name: "Achievements & Hackathons", hash: "#achievements", icon: Award, category: "Navigation" },
    { name: "Contact Me", hash: "#contact", icon: Mail, category: "Navigation" },
  ];

  const actions = [
    {
      name: "Copy Email Address",
      desc: personalData.email,
      icon: copiedEmail ? Check : Copy,
      action: copyEmail,
      badge: copiedEmail ? "Copied!" : "Action",
    },
    {
      name: "Toggle Dark / Light Theme",
      desc: `Currently: ${resolvedTheme === "dark" ? "Dark Mode" : "Light Mode"}`,
      icon: resolvedTheme === "dark" ? Sun : Moon,
      action: toggleTheme,
      badge: "Theme",
    },
    {
      name: "View / Download Resume",
      desc: "Open PDF preview modal",
      icon: FileText,
      action: () => {
        onClose();
        onOpenResume();
      },
      badge: "Document",
    },
    {
      name: "Visit GitHub Profile",
      desc: "github.com/Jyotishkumar-dev",
      icon: Github,
      action: () => window.open(personalData.socials.github, "_blank"),
      badge: "External",
    },
    {
      name: "Connect on LinkedIn",
      desc: "linkedin.com/in/jyotish-kumar",
      icon: Linkedin,
      action: () => window.open(personalData.socials.linkedin, "_blank"),
      badge: "External",
    },
    {
      name: "Open SmartAttend AI (Live Demo)",
      desc: "College attendance management SaaS",
      icon: ExternalLink,
      action: () =>
        window.open(
          "https://attendance-management-system-projec-steel.vercel.app/login",
          "_blank"
        ),
      badge: "Project",
    },
  ];

  const filteredSections = sections.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actions.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, section name, or action..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Navigation Items */}
          {filteredSections.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Jump to Section
              </p>
              <div className="mt-1 space-y-1">
                {filteredSections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.hash}
                      onClick={() => navigateTo(item.hash)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {item.hash}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Quick Actions
              </p>
              <div className="mt-1 space-y-1">
                {filteredActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.name}
                      onClick={action.action}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        <div>
                          <p className="font-medium">{action.name}</p>
                          <p className="text-xs text-slate-400">{action.desc}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
                        {action.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredSections.length === 0 && filteredActions.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigation &amp; Quick Command Menu</span>
          <div className="flex items-center gap-2">
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
