import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./env";

/**
 * Derived from `createClient` rather than spelled out as `SupabaseClient<Database>`.
 * The library resolves the client's schema generics through a conditional type,
 * so naming the type directly produces a mismatched instantiation.
 */
export type PublicSupabaseClient = ReturnType<typeof createClient<Database>>;

let cached: PublicSupabaseClient | null = null;

/** ISR window for public portfolio reads, in seconds. */
const PUBLIC_CACHE_SECONDS = 300;

/**
 * Cookie-less, anon-key client used for PUBLIC portfolio reads.
 *
 * Intentionally session-free so it can be used inside a cached server render.
 * Every table it touches is readable by `anon` under a `published = true` RLS
 * policy, so there is nothing to gain from a user session here — and nothing to
 * leak either.
 *
 * Authenticated work (the admin dashboard) must use `client.ts` / `server.ts`
 * instead, so that RLS can see who is asking.
 */
export function createPublicSupabaseClient(): PublicSupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!cached) {
    cached = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        /**
         * Next.js patches `fetch` to honour its data cache. Portfolio content
         * changes only when the owner edits it, so these reads are revalidated
         * every 5 minutes instead of hitting Postgres on every page load.
         */
        fetch: (input, init) =>
          fetch(input, { ...init, next: { revalidate: PUBLIC_CACHE_SECONDS } }),
      },
    });
  }

  return cached;
}
