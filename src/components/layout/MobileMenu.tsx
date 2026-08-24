"use client";

import React, { useEffect } from "react";
import { X, Send, FileText, Github, Linkedin, Mail, Code, Youtube } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { personalData } from "@/data/personal";

interface NavItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activeSection: string;
  onOpenResume: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  activeSection,
  onOpenResume,
}: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
      />

      {/* Menu Drawer */}
      <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-6 z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm">
                JK
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                Jyotish Kumar
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenResume();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold transition-colors"
            >
              <FileText className="w-4 h-4 text-brand-500" />
              <span>Resume</span>
            </button>

            <a
              href="#contact"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Let's Connect</span>
            </a>
          </div>

          {/* Social Icons Row */}
          <div className="flex justify-center items-center gap-4 text-slate-500 dark:text-slate-400 pt-2">
            <a
              href={personalData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={personalData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={personalData.socials.email}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Email Jyotish"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={personalData.socials.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="LeetCode Profile"
            >
              <Code className="w-5 h-5" />
            </a>
            <a
              href={personalData.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="YouTube Channel"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
