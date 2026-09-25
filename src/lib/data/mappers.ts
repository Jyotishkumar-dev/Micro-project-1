import type {
  Achievement,
  Certification,
  LeadershipActivity,
  Project,
  Skill,
} from "@/types";
import { formatMonthYear } from "@/lib/utils";
import type {
  AchievementRow,
  CertificationRow,
  ExperienceRow,
  Json,
  ProjectRow,
  SkillRow,
} from "@/lib/supabase/database.types";

/**
 * Translation layer between Postgres rows and the shapes the existing
 * components already render.
 *
 * Keeping this in one place means the UI components did not have to be
 * rewritten to become data-driven — they take the same view models as before,
 * now sourced from the database instead of a hardcoded array.
 */

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------

const PROJECT_STATUSES = ["Live", "Hackathon Build", "In Progress"] as const;
type ProjectStatus = (typeof PROJECT_STATUSES)[number];

const SKILL_CATEGORIES = [
  "language",
  "frontend",
  "backend",
  "database",
  "tool",
  "core",
] as const;
type SkillCategory = (typeof SKILL_CATEGORIES)[number];

const LEADERSHIP_TYPES = [
  "leadership",
  "hackathon",
  "ambassador",
  "club",
  "workshop",
] as const;
type LeadershipType = (typeof LEADERSHIP_TYPES)[number];

const EMPTY_CASE_STUDY: Project["caseStudy"] = {
  problem: "",
  idea: "",
  whatIBuilt: "",
  keyFeatures: [],
  techStack: [],
  challenges: [],
  learnings: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

/**
 * The case study lives in a jsonb column so the CMS can evolve its shape
 * without a migration every time. That flexibility means the value is
 * untrusted at the type level, so it is re-validated field by field here
 * rather than cast.
 */
function parseCaseStudy(value: Json): Project["caseStudy"] {
  if (!isRecord(value)) return { ...EMPTY_CASE_STUDY };

  const keyFeatures = Array.isArray(value.keyFeatures)
    ? value.keyFeatures.filter(isRecord).map((feature) => ({
        title: asString(feature.title),
        description: asString(feature.description),
      }))
    : [];

  const challenges = Array.isArray(value.challenges)
    ? value.challenges.filter(isRecord).map((challenge) => ({
        challenge: asString(challenge.challenge),
        resolution: asString(challenge.resolution),
      }))
    : [];

  return {
    problem: asString(value.problem),
    idea: asString(value.idea),
    whatIBuilt: asString(value.whatIBuilt),
    keyFeatures,
    techStack: asStringArray(value.techStack),
    challenges,
    learnings: asStringArray(value.learnings),
  };
}

function toProjectStatus(value: string | null): ProjectStatus {
  return PROJECT_STATUSES.includes(value as ProjectStatus)
    ? (value as ProjectStatus)
    : "In Progress";
}

export function mapProjectRow(row: ProjectRow, index: number): Project {
  const caseStudy = parseCaseStudy(row.case_study);

  return {
    id: row.slug,
    number: String(index + 1).padStart(2, "0"),
    title: row.title,
    category: row.category ?? "Project",
    tagline: row.tagline ?? "",
    shortDescription: row.description,
    // The card and the modal both need a problem statement; fall back from the
    // structured case study to the flat column so a minimal row still renders.
    problem: row.problem ?? caseStudy.problem,
    solution: row.solution ?? caseStudy.idea,
    myContribution: row.my_contribution ?? caseStudy.whatIBuilt,
    tags: row.technologies,
    featured: row.featured,
    status: toProjectStatus(row.status),
    githubUrl: row.github_url ?? undefined,
    liveUrl: row.live_url ?? undefined,
    image: row.image_url ?? undefined,
    caseStudy: {
      ...caseStudy,
      problem: caseStudy.problem || row.problem || "",
      idea: caseStudy.idea || row.solution || "",
      whatIBuilt: caseStudy.whatIBuilt || row.my_contribution || "",
      techStack: caseStudy.techStack.length ? caseStudy.techStack : row.technologies,
    },
  };
}

// ---------------------------------------------------------------------------
// Skill
// ---------------------------------------------------------------------------

function toSkillCategory(value: string): SkillCategory {
  return SKILL_CATEGORIES.includes(value as SkillCategory)
    ? (value as SkillCategory)
    : "tool";
}

/** The DB tracks category; proficiency is presentation-only and not persisted. */
export function mapSkillRow(row: SkillRow): Skill {
  return {
    id: row.id,
    name: row.name,
    category: toSkillCategory(row.category),
    proficiency: "proficient",
    context: row.context ?? undefined,
    highlight: row.highlight,
  };
}

// ---------------------------------------------------------------------------
// Experience / Leadership
// ---------------------------------------------------------------------------

function toLeadershipType(value: string): LeadershipType {
  return LEADERSHIP_TYPES.includes(value as LeadershipType)
    ? (value as LeadershipType)
    : "leadership";
}

/** "2026-08-01" + is_current → "Aug 2026 – Present" */
function formatPeriod(row: ExperienceRow): string {
  const start = row.start_date ? formatMonthYear(row.start_date) : "";
  const end = row.is_current ? "Present" : row.end_date ? formatMonthYear(row.end_date) : "";

  if (start && end) return `${start} – ${end}`;
  return start || end;
}

export function mapExperienceRow(row: ExperienceRow): LeadershipActivity {
  const organization = row.organization ?? "";

  return {
    id: row.slug,
    title: row.title,
    // The card renders `event` as the accent line under the title. With no
    // separate subtitle column, the organisation is the honest thing to show —
    // and it is suppressed at the bottom when it would just repeat.
    event: organization,
    role: row.role ?? "",
    period: formatPeriod(row),
    organization: organization ? organization : "",
    description: row.description,
    highlights: row.highlights,
    type: toLeadershipType(row.type),
  };
}

// ---------------------------------------------------------------------------
// Certification
// ---------------------------------------------------------------------------

export function mapCertificationRow(row: CertificationRow): Certification {
  return {
    id: row.slug,
    title: row.name,
    organization: row.organization ?? "",
    year: row.issue_date ? formatMonthYear(row.issue_date) : "",
    badge: row.badge ?? "Certified",
    description: row.description,
    details: row.details,
    link: row.credential_url ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export function mapAchievementRow(row: AchievementRow): Achievement {
  return {
    id: row.slug,
    title: row.title,
    description: row.description,
    metric: row.metric ?? undefined,
    link: row.link ?? undefined,
  };
}
