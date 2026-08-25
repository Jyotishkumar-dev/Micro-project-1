"use client";

import React, { useState } from "react";
import { personalData } from "@/data/personal";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResumeModal } from "@/components/ui/ResumeModal";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
import { CursorLight } from "@/components/ui/CursorLight";

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
    <div className="relative min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 selection:bg-brand-500/20 selection:text-brand-500 overflow-x-hidden">
      {/* Interactive Animated Constellation Background */}
      <InteractiveBackground />

      {/* Fluid Cursor-Following Radial Glow Light */}
      <CursorLight />

      {/* Top Scroll Depth Progress Line */}
      <ScrollProgress />

      {/* Sticky Navbar */}
      <Navbar onOpenResume={() => setResumeModalOpen(true)} />

      {/* Main Single Page Sections with GSAP ScrollTriggers */}
      <main className="relative z-10">
        {/* 1. Hero Section with Real Photo & Cinematic GSAP Entrance */}
        <HeroSection onOpenResume={() => setResumeModalOpen(true)} />

        {/* 2. About Section */}
        <AboutSection />

        {/* 3. Selected Work & Case Studies with Scroll Parallax */}
        <ProjectsSection />

        {/* 4. Skills & Capabilities (3-Tier) */}
        <SkillsSection />

        {/* 5. The Journey So Far (Scroll-Driven Timeline Line) */}
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
