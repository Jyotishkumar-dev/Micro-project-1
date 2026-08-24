"use client";

import React from "react";
import { Project } from "@/types";
import { GlowCard } from "./GlowCard";
import { Badge } from "./Badge";
import { ExternalLink, Github, BookOpen, ArrowRight, Sparkles } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
}

export function ProjectCard({ project, onOpenCaseStudy }: ProjectCardProps) {
  const statusVariants: Record<string, "success" | "brand" | "warning" | "default"> = {
    Live: "success",
    "Hackathon Build": "brand",
    "In Development": "warning",
    Completed: "default",
  };

  return (
    <GlowCard className="flex flex-col h-full p-6 sm:p-8 justify-between border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <Badge variant={statusVariants[project.status] || "default"}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {project.status}
          </Badge>
          <span className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono font-medium">
            {project.category.toUpperCase()}
          </span>
        </div>

        {/* Project Title & Tagline */}
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {project.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-400">
          {project.tagline}
        </p>

        {/* Description */}
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Problem & Solution Mini Highlight */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 text-xs">
          <div className="text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-rose-500 dark:text-rose-400">Problem: </span>
            <span className="line-clamp-2">{project.problem}</span>
          </div>
        </div>

        {/* Tech Stack Tags */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 transition-colors"
              aria-label={`View live demo of ${project.title}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}
        </div>

        <button
          onClick={() => onOpenCaseStudy(project)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 group/btn transition-colors py-2"
        >
          <span>Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </GlowCard>
  );
}
