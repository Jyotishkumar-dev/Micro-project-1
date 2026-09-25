import type { Metadata } from "next";
import { getAdminSession } from "@/lib/supabase/session";
import { getSupabaseConfigStatus } from "@/lib/supabase/env";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

const REASONS: Record<string, string> = {
  "not-configured":
    "Supabase environment variables are missing, so sign-in is unavailable. Add them to .env.local and restart the dev server.",
  "not-admin":
    "That account is signed in but is not the portfolio owner. Only an allowlisted account can administer this site.",
};

/**
 * Sanitises the `next` parameter.
 *
 * Without this, `/admin/login?next=https://evil.example` would turn the login
 * page into an open redirect: a victim authenticates on a genuine-looking page
 * and lands on an attacker's site. Only same-origin admin paths are allowed.
 */
function safeNextPath(value: string | undefined): string {
  if (!value) return "/admin";
  if (!value.startsWith("/admin")) return "/admin";
  if (value.startsWith("//") || value.includes("\\")) return "/admin";
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { reason?: string; next?: string };
}) {
  const session = await getAdminSession();
  const status = getSupabaseConfigStatus();

  const reason = searchParams.reason ? REASONS[searchParams.reason] : undefined;

  return (
    <LoginForm
      notice={reason}
      nextPath={safeNextPath(searchParams.next)}
      configured={status.configured}
      missingVars={status.missing}
    />
  );
}
