"use client";

import React, { useState, useRef, useEffect } from "react";
import { projectsData } from "@/data/projects";
import { Project } from "@/types";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Badge } from "../ui/Badge";
import { ProjectModal } from "../ui/ProjectModal";
import { MagneticButton } from "../ui/MagneticButton";
import { gsap } from "@/lib/gsap";
import {
  ExternalLink,
  Github,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      projectRefs.current.forEach((card, index) => {
        if (!card) return;

        // Subtle ScrollTrigger reveal with gentle parallax
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          y: 45,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });

        // Subtle parallax movement on visual card during scroll
        const visualCard = card.querySelector(".project-visual-box");
        if (visualCard) {
          gsap.to(visualCard, {
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
            y: -15,
            ease: "none",
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const handleOpenCaseStudy = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section ref={sectionRef} id="projects" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Selected Work"
          title="Featured Projects &amp; Builds"
          subtitle="Real-world applications, hackathon prototypes, and web systems built with modern full-stack workflows."
        />

        {/* Editorial Project List */}
        <div className="space-y-16 lg:space-y-24">
          {projectsData.map((project, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={project.id}
                ref={(node) => {
                  projectRefs.current[index] = node;
                }}
                className="relative rounded-3xl bg-slate-50/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-white/[0.08] p-6 sm:p-10 lg:p-12 transition-all hover:border-slate-300 dark:hover:border-white/[0.14] shadow-sm backdrop-blur-md"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isReversed ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Visual / Highlights Column */}
                  <div
                    className={`lg:col-span-6 ${
                      isReversed ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="project-visual-box will-change-transform">
                      <GlowCard className="p-6 sm:p-8 bg-white dark:bg-navy-800/95 border border-slate-200 dark:border-white/[0.08] shadow-xl space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                            PROJECT {project.number}
                          </span>
                          <Badge variant="brand">{project.status}</Badge>
                        </div>

                        <div>
                          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                            {project.category}
                          </span>
                          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {project.title}
                          </h4>
                          <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mt-1">
                            {project.tagline}
                          </p>
                        </div>

                        {/* Problem & Contribution Highlights */}
                        <div className="space-y-3 pt-2 text-xs sm:text-sm">
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/60 dark:border-white/[0.06]">
                            <p className="font-semibold text-rose-500 dark:text-rose-400 mb-1">
                              Problem Addressed:
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                              {project.problem}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/60 dark:border-white/[0.06]">
                            <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                              My Contribution:
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                              {project.myContribution}
                            </p>
                          </div>
                        </div>
                      </GlowCard>
                    </div>
                  </div>

                  {/* Project Details & Action Column */}
                  <div
                    className={`lg:col-span-6 space-y-6 ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">
                        Overview
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div>
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Technologies Used:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-mono rounded-lg bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="pt-4 flex items-center gap-3 flex-wrap">
                      <MagneticButton>
                        <button
                          onClick={() => handleOpenCaseStudy(project)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs transition-all shadow-sm group/btn cursor-pointer"
                        >
                          <span>Read Case Study</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      </MagneticButton>

                      {project.liveUrl && project.status === "Live" && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 text-xs font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-900 dark:text-white text-xs font-medium transition-colors border border-slate-200 dark:border-white/[0.08]"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Case Study Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
}
