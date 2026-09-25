import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
  isSupabaseServerConfigured,
} from "./env";

/**
 * Service-role client. BYPASSES Row Level Security.
 *
 * This is the most dangerous object in the codebase, so it is fenced in:
 *   • `import "server-only"` makes the build fail if any client component
 *     (or anything that ends up in the browser bundle) imports this file.
 *   • It is only constructed on demand and only inside server handlers.
 *   • The key is read from SUPABASE_SERVICE_ROLE_KEY, which is a server-only
 *     variable with no NEXT_PUBLIC_ prefix, so Next.js will not inline it.
 *
 * Current legitimate use: the contact-form intake route, which needs to run
 * server-side spam heuristics and then write the verdict (`spam`) that the
 * public RLS policy deliberately forbids a caller from setting itself.
 */
export function createSupabaseAdminClient(): SupabaseClient<Database> | null {
  if (!isSupabaseServerConfigured()) return null;

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
