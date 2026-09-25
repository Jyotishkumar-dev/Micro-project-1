/**
 * Public Supabase environment access.
 *
 * This module is imported by BOTH server and client code, so it must never
 * touch a secret. The service role key lives in `env.server.ts`, which is
 * fenced behind `server-only`.
 *
 * Nothing here may assume Supabase is configured. Every consumer checks
 * `isSupabaseConfigured()` and falls back, so a missing or wrong env file
 * degrades the site instead of crashing it.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/** Public (anon) config. Safe to reference from client code. */
export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = anonKey;

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

/** Human-readable reason, surfaced in the admin Settings screen. */
export function getSupabaseConfigStatus(): {
  configured: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (!isPlausibleUrl(url)) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return { configured: isSupabaseConfigured(), missing };
}
