"use client";

import React, { useState } from "react";
import { personalData } from "@/data/personal";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResumeModal } from "@/components/ui/ResumeModal";

import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500/20 selection:text-brand-500 overflow-x-hidden">
      {/* Top Scroll Depth Progress Line */}
      <ScrollProgress />

      {/* Sticky Navbar */}
      <Navbar onOpenResume={() => setResumeModalOpen(true)} />

      {/* Main Single Page Sections */}
      <main>
        {/* 1. Hero Section with Real Photo */}
        <HeroSection onOpenResume={() => setResumeModalOpen(true)} />

        {/* 2. About Section */}
        <AboutSection />

        {/* 3. Selected Work & Case Studies */}
        <ProjectsSection />

        {/* 4. Skills & Capabilities (3-Tier) */}
        <SkillsSection />

        {/* 5. The Journey So Far (Milestones) */}
        <JourneySection />

        {/* 6. Activities & Hackathons */}
        <AchievementsSection />

        {/* 7. Contact Section & Working Form */}
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
  );
}
