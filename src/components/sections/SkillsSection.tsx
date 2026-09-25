"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { skillsData, skillCategories } from "@/data/skills";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowCard } from "../ui/GlowCard";
import { Badge } from "../ui/Badge";
import { gsap } from "@/lib/gsap";
import {
  Code,
  Layout,
  Server,
  Database,
  Wrench,
  Brain,
} from "lucide-react";

type SkillCategoryKey = (typeof skillCategories)[number]["key"];

const categoryIcons = {
  language: Code,
  frontend: Layout,
  backend: Server,
  database: Database,
  tool: Wrench,
  core: Brain,
};

const categoryColors = {
  language: "brand",
  frontend: "cyan",
  backend: "emerald",
  database: "brand",
  tool: "cyan",
  core: "emerald",
};

const getIconBgClass = (category: string) => {
  const base = "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ";
  switch (categoryColors[category as keyof typeof categoryColors]) {
    case "brand":
      return base + "bg-brand-500/10 text-brand-600 dark:text-brand-400";
    case "cyan":
      return base + "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400";
    default:
      return base + "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
};

const getIconElement = (category: string) => {
  switch (category) {
    case "language":
      return <Code className="w-5 h-5" />;
    case "frontend":
      return <Layout className="w-5 h-5" />;
    case "backend":
      return <Server className="w-5 h-5" />;
    case "database":
      return <Database className="w-5 h-5" />;
    case "tool":
      return <Wrench className="w-5 h-5" />;
    case "core":
      return <Brain className="w-5 h-5" />;
    default:
      return <Code className="w-5 h-5" />;
  }
};

const getBadgeVariant = (category: string) => {
  const color = categoryColors[category as keyof typeof categoryColors];
  if (color === "brand") return "brand";
  if (color === "cyan") return "cyan";
  return "emerald";
};

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCategory, setActiveCategory] = useState<SkillCategoryKey>(skillCategories[0].key);

  const filteredSkills = useMemo(
    () => skillsData.filter((skill) => skill.category === activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRefs.current, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Technical Capabilities"
          title="Skills & Technologies"
          subtitle="An honest overview of languages, frameworks, tools, and concepts I work with daily."
        />

        <div className="flex flex-wrap gap-2 mb-10 justify-center" role="tablist" aria-label="Skill categories">
          {skillCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              role="tab"
              aria-selected={activeCategory === cat.key}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? "bg-brand-600 text-white shadow-md"
                  : "bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-700 border border-slate-200 dark:border-white/[0.08]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, idx) => {
            const iconClassName = getIconBgClass(skill.category);
            return (
              <div
                key={skill.id}
                ref={(node) => {
                  cardRefs.current[idx] = node;
                }}
                className="will-change-transform"
              >
                <GlowCard
                  className="p-5 space-y-3 bg-white dark:bg-navy-800/90 border border-slate-200 dark:border-white/[0.08]"
                  glowColor={getBadgeVariant(skill.category)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={iconClassName}>
                        {getIconElement(skill.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                            {skill.name}
                          </h4>
                          {skill.highlight && (
                            <Badge variant={getBadgeVariant(skill.category)} size="sm">
                              Core
                            </Badge>
                          )}
                        </div>
                        {skill.context && (
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {skill.context}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No skills in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}