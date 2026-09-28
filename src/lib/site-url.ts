/**
 * Canonical site origin.
 *
 * `canonical`, `openGraph.url`, `robots.txt` and `sitemap.xml` must all agree
 * on one origin, or search engines get contradictory signals. They previously
 * each hardcoded `https://jyotishkumar.dev`, which silently drifted away from
 * the domain the site was actually served on.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SITE_URL` — set this to the real production domain.
 *   2. `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL` — automatic on Vercel.
 *   3. `http://localhost:3000` — local development.
 *
 * The trailing slash is stripped so `${SITE_URL}/path` never doubles up.
 */
function normalizeOrigin(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

export const SITE_URL: string =
  normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeOrigin(process.env.NEXT_PUBLIC_VERCEL_URL) ??
  normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeOrigin(process.env.VERCEL_URL) ??
  "http://localhost:3000";
