"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/** Derived from the factory so the schema generics stay in sync. */
export type SupabaseBrowserClient = ReturnType<
  typeof createBrowserClient<Database>
>;

let cached: SupabaseBrowserClient | null = null;

/**
 * Browser client used by the admin dashboard.
 *
 * Carries the signed-in admin's session, so every insert/update/delete it
 * issues is evaluated by RLS against `public.is_admin()`. The client holds no
 * elevated privilege of its own — if the session is missing or not an admin,
 * the database refuses the write regardless of what the UI shows.
 */
export function getSupabaseBrowserClient(): SupabaseBrowserClient {
  if (cached) return cached;

  cached = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

  return cached;
}
