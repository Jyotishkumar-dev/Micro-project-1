"use client";

import React, { useState } from "react";
import { personalData } from "@/data/personal";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ResumeModal } from "@/components/ui/ResumeModal";

import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { GithubSection } from "@/components/sections/GithubSection";
import { LearningRoadmapSection } from "@/components/sections/LearningRoadmapSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500/20 selection:text-brand-500 overflow-x-hidden">
      {/* Top Scroll Depth Progress Line */}
      <ScrollProgress />

      {/* Sticky Blurred Navbar */}
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      {/* Main Single Page Sections */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection onOpenResume={() => setResumeModalOpen(true)} />

        {/* 2. About Section */}
        <AboutSection />

        {/* 3. Featured Projects & Case Studies */}
        <ProjectsSection />

        {/* 4. Skills & Capabilities */}
        <SkillsSection />

        {/* 5. Experience & Leadership */}
        <ExperienceSection />

        {/* 6. Hackathons & Achievements */}
        <AchievementsSection />

        {/* 7. Open Source & GitHub Activity */}
        <GithubSection />

        {/* 8. Always Building. Always Learning. (Roadmap) */}
        <LearningRoadmapSection />

        {/* 9. Testimonials & Peer Feedback */}
        <TestimonialsSection />

        {/* 10. Contact Section & Working Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Quick Navigation & Action Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      {/* Interactive Resume Preview & Download Modal */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        resumePath={personalData.resumePath}
      />
    </div>
  );
}
