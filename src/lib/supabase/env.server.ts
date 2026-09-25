import "server-only";

/**
 * Server-only Supabase secrets.
 *
 * Split out from `env.ts` because that module is imported by client code. Even
 * though Next.js replaces unprefixed `process.env` reads with `undefined` in the
 * browser, keeping the secret in a file that *cannot* be imported from the
 * client removes the question entirely — `server-only` turns an accidental
 * import into a build error rather than a silent `undefined`.
 */

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

export const SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;

/** True when server-only privileged operations (contact intake) are possible. */
export function isSupabaseServerConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  let urlLooksValid = false;
  try {
    const parsed = new URL(url);
    urlLooksValid = parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    urlLooksValid = false;
  }

  return urlLooksValid && Boolean(anonKey) && Boolean(serviceRoleKey);
}
