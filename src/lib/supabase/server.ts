import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

export type SupabaseServerClient = ReturnType<
  typeof createServerClient<Database>
>;

/**
 * Request-scoped, cookie-aware client for Server Components and Route Handlers.
 *
 * Must be constructed per request — a shared instance would leak one visitor's
 * session into another's render. `setAll` is omitted on purpose: pages and route
 * handlers that refresh tokens write cookies in `src/middleware.ts`, which is the
 * only place guaranteed to be able to mutate the outgoing response.
 */
export function createSupabaseServerClient(): SupabaseServerClient | null {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // No-op by design — see note above. Middleware owns cookie writes.
      },
    },
  });
}
