"use client";

import React, { useState } from "react";
import type { Achievement, Certification, LeadershipActivity, Project, Skill } from "@/types";
import type { DataSource } from "@/lib/data/portfolio";
import { personalData } from "@/data/personal";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResumeModal } from "@/components/ui/ResumeModal";
import { LenisProvider } from "@/components/providers/LenisProvider";

import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { CodingSection } from "@/components/sections/CodingSection";
import { ContactSection } from "@/components/sections/ContactSection";

export interface PortfolioShellProps {
  projects: Project[];
  skills: Skill[];
  experience: LeadershipActivity[];
  certifications: Certification[];
  codingStats: Achievement[];
  source: DataSource;
}

/**
 * Client shell for the public page.
 *
 * This existed as `page.tsx` before Phase 3 and was moved here unchanged in
 * structure: it owns the only piece of interactivity the page frame has (the
 * resume modal). The split lets `page.tsx` stay a Server Component, which is
 * what allows portfolio content to be fetched from Supabase on the server and
 * still arrive as plain props.
 */
export function PortfolioShell({
  projects,
  skills,
  experience,
  certifications,
  codingStats,
}: PortfolioShellProps) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  return (
    <LenisProvider>
      <div className="relative min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 selection:bg-brand-500/20 selection:text-brand-500 overflow-x-hidden">
        {/* Top Scroll Depth Progress Line */}
        <ScrollProgress />

        {/* Sticky Navbar */}
        <Navbar onOpenResume={() => setResumeModalOpen(true)} />

        {/* Main Single Page Sections with GSAP ScrollTriggers */}
        <main className="relative z-10">
          {/* 1. Hero Section with Three.js Visual */}
          <HeroSection onOpenResume={() => setResumeModalOpen(true)} />

          {/* 2. About Section */}
          <AboutSection />

          {/* 3. Skills & Capabilities */}
          <SkillsSection skills={skills} />

          {/* 4. Selected Work & Case Studies */}
          <ProjectsSection projects={projects} />

          {/* 5. Experience & Leadership */}
          <ExperienceSection experience={experience} />

          {/* 6. Certifications */}
          <CertificationsSection certifications={certifications} />

          {/* 7. Coding / DSA */}
          <CodingSection stats={codingStats} />

          {/* 8. Contact Section & Working Form */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Resume Preview & Download Modal */}
        <ResumeModal
          isOpen={resumeModalOpen}
          onClose={() => setResumeModalOpen(false)}
          resumePath={personalData.resumePath}
        />
      </div>
    </LenisProvider>
  );
}
