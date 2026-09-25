import { z } from "zod";

/**
 * Validation schemas shared by the API routes and the admin forms.
 *
 * These run on the server before anything touches the database, so a malformed
 * payload is rejected at the edge of the app. The database still enforces its
 * own constraints (length CHECKs, unique constraints) — this layer exists to
 * return useful messages, not to be the only line of defence.
 *
 * `z.string().email()` is deliberately avoided: it is deprecated in Zod 4 in
 * favour of a top-level `z.email()`, and a regex keeps the module portable
 * across Zod 3 and 4.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/[^\s]+$/i;

/** A trimmed string that may be empty (form fields the owner has not filled in). */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null));

const requiredText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, { message: `${label} is required.` })
    .max(max, { message: `${label} must be ${max} characters or fewer.` });

/** Same as {@link optionalText} but for NOT NULL text columns: always a string. */
const freeText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => value ?? "");

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || URL_PATTERN.test(value), {
    message: "Must be a valid http(s) URL.",
  })
  .transform((value) => (value ? value : null));

/** Accepts "react, next.js" or an array, and stores a clean string[]. */
const stringList = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    const list = Array.isArray(value) ? value : (value ?? "").split("\n");
    return list
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0)
      .slice(0, 50);
  });

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Boolean coercion that is actually correct.
 *
 * `z.coerce.boolean()` is a trap: JavaScript considers the non-empty string
 * "false" truthy, so a form posting `featured: "false"` would flip the flag to
 * true. This handles the strings an HTML form and a JSON client actually send.
 */
const booleanish = z
  .union([z.boolean(), z.enum(["true", "false", "on", "off", "1", "0", ""])])
  .transform(
    (value) => value === true || value === "true" || value === "on" || value === "1"
  );

const slug = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(slugPattern, {
    message: "Use lowercase letters, numbers and single hyphens only.",
  });

/** Derives a URL-safe slug from a title. Shared by the client forms. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

// ---------------------------------------------------------------------------
// Contact message
// ---------------------------------------------------------------------------

export const contactMessageSchema = z.object({
  name: requiredText("Name", 2, 120),
  email: z
    .string()
    .trim()
    .min(3)
    .max(254)
    .regex(EMAIL_PATTERN, { message: "Enter a valid email address." }),
  subject: requiredText("Subject", 2, 200),
  projectType: z.string().trim().max(120).optional().or(z.literal("")),
  message: requiredText("Message", 10, 5000),
  /**
   * Honeypot. A real person never sees this field, so any value means a bot
   * filled it in. Must stay `z.string().optional()` rather than a strict
   * object so a missing field is not itself a validation error.
   */
  website: z.string().max(0, "Spam detected.").optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projectSchema = z.object({
  title: requiredText("Title", 2, 160),
  slug,
  tagline: optionalText(200),
  description: requiredText("Description", 10, 4000),
  category: optionalText(120),
  status: z.enum(["Live", "Hackathon Build", "In Progress"]),
  problem: optionalText(2000),
  solution: optionalText(2000),
  myContribution: optionalText(2000),
  technologies: stringList,
  caseStudyProblem: optionalText(2000),
  caseStudyIdea: optionalText(2000),
  caseStudyWhatIBuilt: optionalText(4000),
  caseStudyLearnings: stringList,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  imageUrl: optionalUrl,
  featured: booleanish.default(false),
  published: booleanish.default(true),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type ProjectInput = z.input<typeof projectSchema>;

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export const skillSchema = z.object({
  name: requiredText("Name", 1, 80),
  category: z.enum(["language", "frontend", "backend", "database", "tool", "core"]),
  context: optionalText(160),
  highlight: booleanish.default(false),
  published: booleanish.default(true),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type SkillInput = z.input<typeof skillSchema>;

// ---------------------------------------------------------------------------
// Experience / leadership
// ---------------------------------------------------------------------------

export const experienceSchema = z.object({
  title: requiredText("Title", 2, 160),
  slug,
  organization: optionalText(160),
  type: z.enum(["leadership", "hackathon", "ambassador", "club", "workshop"]),
  role: optionalText(120),
  /** YYYY-MM-DD or empty. */
  startDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Use YYYY-MM-DD." })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  endDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Use YYYY-MM-DD." })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  isCurrent: booleanish.default(false),
  description: freeText(4000),
  highlights: stringList,
  published: booleanish.default(true),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type ExperienceInput = z.input<typeof experienceSchema>;

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

export const certificationSchema = z.object({
  name: requiredText("Name", 2, 200),
  slug,
  organization: optionalText(160),
  issueDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Use YYYY-MM-DD." })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  credentialUrl: optionalUrl,
  badge: optionalText(80),
  description: freeText(2000),
  details: stringList,
  published: booleanish.default(true),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type CertificationInput = z.input<typeof certificationSchema>;

// ---------------------------------------------------------------------------
// Profile (admin settings)
// ---------------------------------------------------------------------------

export const profileSchema = z.object({
  fullName: optionalText(120),
  headline: optionalText(200),
  bio: optionalText(2000),
  avatarUrl: optionalUrl,
  resumeUrl: optionalUrl,
  location: optionalText(120),
  isPublic: booleanish.default(false),
});

export type ProfileInput = z.input<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Flattens a ZodError into `{ field: message }` for inline form errors. */
export function fieldErrors(
  error: z.ZodError
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

/** A single human-readable summary of a validation failure. */
export function firstErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the highlighted fields.";
}
