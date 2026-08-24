"use client";

import React, { useState } from "react";
import { personalData } from "@/data/personal";
import { SectionHeading } from "../ui/SectionHeading";
import { ContactForm } from "../ui/ContactForm";
import { GlowCard } from "../ui/GlowCard";
import {
  Mail,
  Linkedin,
  Github,
  MapPin,
  Clock,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Get In Touch"
          title="Have an idea? Let's build something meaningful."
          subtitle="Whether you have an internship opportunity, a product collaboration, a hackathon project, or simply want to chat engineering — my inbox is always open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Communication Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Email Card with Quick Copy */}
            <GlowCard className="p-6 sm:p-7 space-y-4" glowColor="brand">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Direct Email
                </p>
                <a
                  href={personalData.socials.email}
                  className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors block mt-1"
                >
                  {personalData.email}
                </a>
              </div>
            </GlowCard>

            {/* Social & Networking Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={personalData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <GlowCard className="p-5 h-full flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      LinkedIn
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Professional network &amp; updates
                    </p>
                  </div>
                </GlowCard>
              </a>

              <a
                href={personalData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <GlowCard className="p-5 h-full flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-slate-900/10 dark:bg-slate-100/10 text-slate-900 dark:text-white flex items-center justify-center">
                      <Github className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      GitHub
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Code repositories &amp; activity
                    </p>
                  </div>
                </GlowCard>
              </a>
            </div>

            {/* Availability & SLA Box */}
            <GlowCard className="p-6 space-y-3" glowColor="emerald">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Response Guarantee</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                I actively check incoming messages and typically respond within <strong>12 to 24 hours</strong>. Open to both remote collaborations worldwide and in-person opportunities in India.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> India
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> IST (GMT+5:30)
                </span>
              </div>
            </GlowCard>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
