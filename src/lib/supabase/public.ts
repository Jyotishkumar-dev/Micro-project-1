import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./env";

let cached: SupabaseClient<Database> | null = null;

/** ISR window for public portfolio reads, in seconds. */
const PUBLIC_CACHE_SECONDS = 300;

/**
 * Cookie-less, anon-key client used for PUBLIC portfolio reads.
 *
 * Intentionally session-free so it can be used inside a statically cached
 * server render (`revalidate`). All of the tables it touches are readable by
 * `anon` under a `published = true` RLS policy, so there is nothing to gain
 * from a user session here — and nothing to leak either.
 *
 * Authenticated work (the admin dashboard) must use `client.ts` / `server.ts`
 * instead, so that RLS can see who is asking.
 */
export function createPublicSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;

  if (!cached) {
    cached = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        // Public portfolio content changes only when the owner edits it, so
        // these reads are safe to cache and revalidated every 5 minutes
        // instead of hitting Postgres on every page load.
        fetchOptions: { next: { revalidate: PUBLIC_CACHE_SECONDS } },
      },
    });
  }

  return cached;
}
