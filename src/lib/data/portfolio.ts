import "server-only";

import type {
  Achievement,
  Certification,
  LeadershipActivity,
  Project,
  Skill,
} from "@/types";
import { projectsData } from "@/data/projects";
import { skillsData } from "@/data/skills";
import { leadershipData } from "@/data/leadership";
import { certificationsData } from "@/data/certifications";
import { codingData } from "@/data/coding";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import {
  mapAchievementRow,
  mapCertificationRow,
  mapExperienceRow,
  mapProjectRow,
  mapSkillRow,
} from "./mappers";

/**
 * Server-side read layer for the public portfolio.
 *
 * Resilience contract, in order of preference:
 *   1. Supabase row          → `source: "supabase"`
 *   2. Network/auth error    → bundled static copy, with a warning
 *   3. Supabase unconfigured → bundled static copy, with a warning
 *   4. Table genuinely empty → empty array (so sections can show an empty
 *                              state instead of pretending content exists)
 *
 * Case 4 is the reason this is not just `data ?? fallbackData`: an empty
 * database is a deliberate owner choice and must not be papered over.
 */

export type DataSource = "supabase" | "fallback";

export interface PortfolioPayload {
  projects: Project[];
  skills: Skill[];
  experience: LeadershipActivity[];
  certifications: Certification[];
  /** Achievements tagged `type = 'coding'`, rendered by the Coding section. */
  codingStats: Achievement[];
  source: DataSource;
  /** Non-fatal problems worth surfacing in the admin UI. */
  warnings: string[];
}

interface Fetched<T> {
  data: T;
  warning: string | null;
}

/**
 * Runs one query and returns its rows, or reports why it could not.
 * Never throws — a failure here must not take down the public page.
 */
async function safeFetch<T>(
  label: string,
  fallback: T,
  query: () => Promise<{ data: T | null; error: { message: string } | null }>
): Promise<Fetched<T>> {
  try {
    const { data, error } = await query();
    if (error) {
      return {
        data: fallback,
        warning: `${label}: ${error.message} — serving bundled content instead.`,
      };
    }
    return { data: data ?? fallback, warning: null };
  } catch (error) {
    return {
      data: fallback,
      warning: `${label}: ${
        error instanceof Error ? error.message : "unknown error"
      } — serving bundled content instead.`,
    };
  }
}

export async function getPortfolioData(): Promise<PortfolioPayload> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return {
      projects: projectsData,
      skills: skillsData,
      experience: leadershipData,
      certifications: certificationsData,
      codingStats: codingData,
      source: "fallback",
      warnings: [
        "Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing) — serving bundled content.",
      ],
    };
  }

  const [projects, skills, experience, certifications, achievements] =
    await Promise.all([
      safeFetch<Project[]>("projects", projectsData, async () => {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("published", true)
          .order("display_order", { ascending: true })
          .order("title", { ascending: true });
        return { data: data?.map(mapProjectRow) ?? null, error };
      }),

      safeFetch<Skill[]>("skills", skillsData, async () => {
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .eq("published", true)
          .order("display_order", { ascending: true });
        return { data: data?.map(mapSkillRow) ?? null, error };
      }),

      safeFetch<LeadershipActivity[]>("experience", leadershipData, async () => {
        const { data, error } = await supabase
          .from("experience")
          .select("*")
          .eq("published", true)
          .order("display_order", { ascending: true });
        return { data: data?.map(mapExperienceRow) ?? null, error };
      }),

      safeFetch<Certification[]>(
        "certifications",
        certificationsData,
        async () => {
          const { data, error } = await supabase
            .from("certifications")
            .select("*")
            .eq("published", true)
            .order("display_order", { ascending: true });
          return { data: data?.map(mapCertificationRow) ?? null, error };
        }
      ),

      safeFetch<Achievement[]>("achievements", codingData, async () => {
        const { data, error } = await supabase
          .from("achievements")
          .select("*")
          .eq("published", true)
          .eq("type", "coding")
          .order("display_order", { ascending: true });
        return { data: data?.map(mapAchievementRow) ?? null, error };
      }),
    ]);

  const results = [projects, skills, experience, certifications, achievements];
  const warnings = results
    .map((result) => result.warning)
    .filter((warning): warning is string => Boolean(warning));

  return {
    projects: projects.data,
    skills: skills.data,
    experience: experience.data,
    certifications: certifications.data,
    codingStats: achievements.data,
    // Mixed: some tables served from the database, some from the bundle.
    source: warnings.length === 0 ? "supabase" : "fallback",
    warnings,
  };
}
