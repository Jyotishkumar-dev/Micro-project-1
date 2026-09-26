"use client";

import React, { useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MobileMenu } from "../layout/MobileMenu";
import { Menu, FileText, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Lenis from "lenis";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const sectionIds = ["home", "about", "skills", "projects", "experience", "contact"];

interface NavbarProps {
  onOpenResume: () => void;
}

export function Navbar({ onOpenResume }: NavbarProps) {
  const { isScrolled } = useScrollPosition();
  const activeSection = useActiveSection(sectionIds, "home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lenis] = useState(() => {
    if (typeof window === "undefined") return null;
    return new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      orientation: "vertical",
      gestureOrientation: "vertical",
    });
  });

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    if (lenis) {
      const element = document.querySelector(href) as HTMLElement | null;
      if (element) {
        lenis.scrollTo(element, { offset: -80 });
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "py-3 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm dark:shadow-xl"
            : "py-5 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          {/* Logo / Personal Brand */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#home");
            }}
            className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              JK
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                Jyotish Kumar
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono -mt-1 hidden sm:inline-block">
                CS & TECHNOLOGY STUDENT
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav role="navigation" aria-label="Main navigation" className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/70 px-2 py-1.5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 backdrop-blur-md md:flex-1 md:justify-center">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all",
                    isActive
                      ? "text-slate-900 dark:text-white font-semibold bg-white dark:bg-slate-800 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Resume Button */}
            <button
              onClick={onOpenResume}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-brand-500" />
              <span>Resume</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* CTA Button */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#contact");
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-all hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Let&apos;s Connect</span>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
              className="p-2 rounded-xl md:hidden bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        activeSection={activeSection}
        onOpenResume={onOpenResume}
        onNavigate={scrollToSection}
      />
    </>
  );
}