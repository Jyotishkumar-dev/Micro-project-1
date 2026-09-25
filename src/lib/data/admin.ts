"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ReorderableTable } from "@/lib/supabase/database.types";
import type {
  AchievementRow,
  CertificationRow,
  ContactMessageRow,
  ExperienceRow,
  ProjectRow,
  SkillRow,
} from "@/lib/supabase/database.types";
import {
  certificationSchema,
  experienceSchema,
  projectSchema,
  skillSchema,
} from "@/lib/validation/schemas";

/**
 * Admin CRUD layer.
 *
 * Every call goes through the browser client's anon key plus the signed-in
 * user's session — there is no service-role path in this file, and there is no
 * code path that could add one. That is the point: the admin UI has exactly the
 * same database privileges a well-behaved attacker would have, so "can I edit
 * this?" is answered by RLS rather than by the client.
 *
 * Each function returns a `Result` instead of throwing, because the UI needs to
 * show a specific error rather than a stack trace.
 */

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function fail(error: { message: string } | null, fallback: string): { ok: false; error: string } {
  return {
    ok: false,
    // RLS denials surface as a generic PostgREST error. Spelling that out is
    // far more useful than "row-level security violation" to whoever is trying
    // to work out why their save failed.
    error: error?.message ?? fallback,
  };
}

const RLS_HINT =
  "The database refused this change. If you are signed in as a non-admin, that is Row Level Security doing its job.";

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

/** Assembles the jsonb case-study blob from the flat form fields. */
function toCaseStudy(values: ReturnType<typeof projectSchema.parse>) {
  return {
    problem: values.caseStudyProblem ?? "",
    idea: values.caseStudyIdea ?? "",
    whatIBuilt: values.caseStudyWhatIBuilt ?? "",
    keyFeatures: [],
    techStack: values.technologies,
    challenges: [],
    learnings: values.caseStudyLearnings,
  };
}

function toProjectRow(values: ReturnType<typeof projectSchema.parse>) {
  return {
    title: values.title,
    slug: values.slug,
    tagline: values.tagline,
    description: values.description,
    category: values.category,
    status: values.status,
    problem: values.problem,
    solution: values.solution,
    my_contribution: values.myContribution,
    technologies: values.technologies,
    case_study: toCaseStudy(values),
    github_url: values.githubUrl,
    live_url: values.liveUrl,
    image_url: values.imageUrl,
    featured: values.featured,
    published: values.published,
    display_order: values.displayOrder,
  };
}

export async function listProjects(): Promise<Result<ProjectRow[]>> {
  const { data, error } = await getSupabaseBrowserClient()
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) return fail(error, "Could not load projects.");
  return { ok: true, data: data ?? [] };
}

export async function createProject(
  input: unknown
): Promise<Result<ProjectRow>> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid project." };
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from("projects")
    .insert(toProjectRow(parsed.data))
    .select()
    .single();

  if (error) return fail(error, "Could not create the project.");
  return { ok: true, data };
}

export async function updateProject(
  id: string,
  input: unknown
): Promise<Result<ProjectRow>> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid project." };
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from("projects")
    .update(toProjectRow(parsed.data))
    .eq("id", id)
    .select()
    .single();

  if (error) return fail(error, "Could not save the project.");
  return { ok: true, data };
}

export async function deleteProject(id: string): Promise<Result<null>> {
  const { error } = await getSupabaseBrowserClient()
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) return fail(error, "Could not delete the project.");
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

function toSkillRow(values: ReturnType<typeof skillSchema.parse>) {
  return {
    name: values.name,
    category: values.category,
    context: values.context,
    highlight: values.highlight,
    published: values.published,
    display_order: values.displayOrder,
  };
}

export async function listSkills(): Promise<Result<SkillRow[]>> {
  const { data, error } = await getSupabaseBrowserClient()
    .from("skills")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) return fail(error, "Could not load skills.");
  return { ok: true, data: data ?? [] };
}

export async function createSkill(input: unknown): Promise<Result<SkillRow>> {
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid skill." };
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from("skills")
    .insert(toSkillRow(parsed.data))
    .select()
    .single();

  // The unique (category, name) constraint is the real guard against duplicates.
  if (error?.code === "23505") {
    return { ok: false, error: "That skill already exists in this category." };
  }
  if (error) return fail(error, "Could not create the skill.");
  return { ok: true, data };
}

export async function updateSkill(
  id: string,
  input: unknown
): Promise<Result<SkillRow>> {
  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid skill." };
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from("skills")
    .update(toSkillRow(parsed.data))
    .eq("id", id)
    .select()
    .single();

  if (error?.code === "23505") {
    return { ok: false, error: "That skill already exists in this category." };
  }
  if (error) return fail(error, "Could not save the skill.");
  return { ok: true, data };
}

export async function deleteSkill(id: string): Promise<Result<null>> {
  const { error } = await getSupabaseBrowserClient().from("skills").delete().eq("id", id);
  if (error) return fail(error, "Could not delete the skill.");
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Experience / leadership
// ---------------------------------------------------------------------------

function toExperienceRow(values: ReturnType<typeof experienceSchema.parse>) {
  return {
    title: values.title,
    slug: values.slug,
    organization: values.organization,
    type: values.type,
    role: values.role,
    start_date: values.startDate,
    end_date: values.isCurrent ? null : values.endDate,
    is_current: values.isCurrent,
    description: values.description,
    highlights: values.highlights,
    published: values.published,
    display_order: values.displayOrder,
  };
}

export async function listExperience(): Promise<Result<ExperienceRow[]>> {
  const { data, error } = await getSupabaseBrowserClient()
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) return fail(error, "Could not load experience.");
  return { ok: true, data: data ?? [] };
}

export async function createExperience(
  input: unknown
): Promise<Result<ExperienceRow>> {
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid experience entry.",
    };
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from("experience")
    .insert(toExperienceRow(parsed.data))
    .select()
    .single();

  if (error) return fail(error, "Could not create the entry.");
  return { ok: true, data };
}

export async function updateExperience(
  id: string,
  input: unknown
): Promise<Result<ExperienceRow>> {
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid experience entry.",
    };
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from("experience")
    .update(toExperienceRow(parsed.data))
    .eq("id", id)
    .select()
    .single();

  if (error) return fail(error, "Could not save the entry.");
  return { ok: true, data };
}

export async function deleteExperience(id: string): Promise<Result<null>> {
  const { error } = await getSupabaseBrowserClient()
    .from("experience")
    .delete()
    .eq("id", id);

  if (error) return fail(error, "Could not delete the entry.");
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

function toCertificationRow(values: ReturnType<typeof certificationSchema.parse>) {
  return {
    name: values.name,
    slug: values.slug,
    organization: values.organization,
    issue_date: values.issueDate,
    credential_url: values.credentialUrl,
    badge: values.badge,
    description: values.description,
    details: values.details,
    published: values.published,
    display_order: values.displayOrder,
  };
}

export async function listCertifications(): Promise<Result<CertificationRow[]>> {
  const { data, error } = await getSupabaseBrowserClient()
    .from("certifications")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) return fail(error, "Could not load certifications.");
  return { ok: true, data: data ?? [] };
}

export async function createCertification(
  input: unknown
): Promise<Result<CertificationRow>> {
  const parsed = certificationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid certification.",
    };
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from("certifications")
    .insert(toCertificationRow(parsed.data))
    .select()
    .single();

  if (error) return fail(error, "Could not create the certification.");
  return { ok: true, data };
}

export async function updateCertification(
  id: string,
  input: unknown
): Promise<Result<CertificationRow>> {
  const parsed = certificationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid certification.",
    };
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from("certifications")
    .update(toCertificationRow(parsed.data))
    .eq("id", id)
    .select()
    .single();

  if (error) return fail(error, "Could not save the certification.");
  return { ok: true, data };
}

export async function deleteCertification(id: string): Promise<Result<null>> {
  const { error } = await getSupabaseBrowserClient()
    .from("certifications")
    .delete()
    .eq("id", id);

  if (error) return fail(error, "Could not delete the certification.");
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Contact messages (admin-only; RLS rejects anon reads outright)
// ---------------------------------------------------------------------------

export async function listMessages(
  includeSpam: boolean
): Promise<Result<ContactMessageRow[]>> {
  let query = getSupabaseBrowserClient()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (!includeSpam) query = query.eq("spam", false);

  const { data, error } = await query;

  if (error) return fail(error, "Could not load messages.");
  return { ok: true, data: data ?? [] };
}

export async function setMessageRead(
  id: string,
  read: boolean
): Promise<Result<null>> {
  const { error } = await getSupabaseBrowserClient()
    .from("contact_messages")
    .update({ read })
    .eq("id", id);

  if (error) return fail(error, "Could not update the message.");
  return { ok: true, data: null };
}

export async function deleteMessage(id: string): Promise<Result<null>> {
  const { error } = await getSupabaseBrowserClient()
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) return fail(error, "Could not delete the message.");
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------------
// Dashboard counters
// ---------------------------------------------------------------------------

export interface DashboardStats {
  projects: number;
  skills: number;
  messages: number;
  unread: number;
}

export async function getDashboardStats(): Promise<Result<DashboardStats>> {
  const supabase = getSupabaseBrowserClient();

  const [projects, skills, messages, unread] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false)
      .eq("spam", false),
  ]);

  // The messages counters need RLS to allow the read; if it does not, surface
  // that rather than showing a confident zero.
  if (messages.error) {
    return {
      ok: false,
      error: `${messages.error.message} — ${RLS_HINT}`,
    };
  }

  return {
    ok: true,
    data: {
      projects: projects.count ?? 0,
      skills: skills.count ?? 0,
      messages: messages.count ?? 0,
      unread: unread.count ?? 0,
    },
  };
}

// ---------------------------------------------------------------------------
// Reordering (drag or arrow buttons)
// ---------------------------------------------------------------------------

export async function reorder(
  table: ReorderableTable,
  orderedIds: string[]
): Promise<Result<number>> {
  const { data, error } = await getSupabaseBrowserClient().rpc("reorder_items", {
    p_table: table,
    p_ids: orderedIds,
  });

  if (error) return fail(error, "Could not save the new order.");
  return { ok: true, data: data ?? 0 };
}
