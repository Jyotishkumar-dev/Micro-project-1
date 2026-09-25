/**
 * Centralised Supabase environment access.
 *
 * Two rules encoded here:
 *  1. The service role key is only ever read by `admin.ts`, which is
 *     `server-only`. It must never reach a client component or a NEXT_PUBLIC_*
 *     variable.
 *  2. Nothing in the app may assume Supabase is configured. Every consumer
 *     checks `isSupabaseConfigured()` and falls back, so a missing or wrong
 *     env file degrades the site instead of crashing it.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

/** Public (anon) config. Safe to reference from client code. */
export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = anonKey;

/** Server-only. Never import this from a "use client" module. */
export const SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;

/** Storage bucket used for project imagery. */
export const PROJECT_IMAGES_BUCKET = "project-images";

function isPlausibleUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/** True when public reads (anon key) are possible. */
export function isSupabaseConfigured(): boolean {
  return Boolean(anonKey) && isPlausibleUrl(url);
}

/** True when server-only privileged operations (contact intake) are possible. */
export function isSupabaseServerConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(serviceRoleKey);
}

/** Human-readable reason, surfaced in the admin Settings screen. */
export function getSupabaseConfigStatus(): {
  configured: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (!isPlausibleUrl(url)) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  return { configured: isSupabaseConfigured(), missing };
}
