import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { ProfileRow } from "./database.types";
import { createSupabaseServerClient, type SupabaseServerClient } from "./server";
import { isSupabaseConfigured } from "./env";

export type AdminSession = {
  supabase: SupabaseServerClient | null;
  user: User | null;
  profile: ProfileRow | null;
  /** True only when the caller is signed in AND their profiles row says admin. */
  isAdmin: boolean;
  /** Set when Supabase env vars are missing, so the UI can explain itself. */
  unavailable: boolean;
};

const ANONYMOUS: AdminSession = {
  supabase: null,
  user: null,
  profile: null,
  isAdmin: false,
  unavailable: true,
};

/**
 * Resolves the caller from cookies on the server.
 *
 * `auth.getUser()` revalidates the JWT with the auth server instead of
 * trusting whatever is in the cookie, so a forged or stale cookie cannot
 * impersonate an admin. This is a fast-fail check for rendering — it is NOT the
 * security boundary. RLS is. A user who forges their way past this function
 * still cannot write a single row, because `public.is_admin()` re-checks the
 * same claim inside the database using the verified JWT.
 */
export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) return ANONYMOUS;

  const supabase = createSupabaseServerClient();
  if (!supabase) return ANONYMOUS;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null, profile: null, isAdmin: false, unavailable: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    supabase,
    user,
    profile: profile ?? null,
    isAdmin: Boolean(profile?.is_admin),
    unavailable: false,
  };
}

/**
 * Gate for every /admin page. Redirects to the login screen (or bounces an
 * already-signed-in non-admin away) instead of rendering a broken dashboard.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (session.unavailable) {
    // Nothing to authenticate against; the login page explains the missing env
    // vars rather than showing a dead form.
    redirect("/admin/login?reason=not-configured");
  }

  if (!session.user) {
    redirect("/admin/login");
  }

  if (!session.isAdmin) {
    // Signed in, but this account is not the owner. Sign it out and start over
    // rather than leaving a half-authenticated session lying around.
    await session.supabase?.auth.signOut();
    redirect("/admin/login?reason=not-admin");
  }

  return session;
}
