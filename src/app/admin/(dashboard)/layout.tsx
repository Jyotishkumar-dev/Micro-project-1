import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/supabase/session";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Every authenticated admin page is rendered per request, never prerendered.
 *
 * This is a correctness requirement, not a performance choice: if the layout
 * were statically generated, the `requireAdmin()` check would run once at build
 * time with no session and its result would be baked into a file that is then
 * served to every visitor. Forcing dynamic rendering guarantees the check runs
 * against the request's own cookies.
 */
export const dynamic = "force-dynamic";

/**
 * Gate for every authenticated admin page.
 *
 * `requireAdmin()` revalidates the session with the auth server and then checks
 * the caller's `profiles.is_admin` flag, redirecting to the login screen if
 * either fails. This protects the UI; RLS protects the data. Both are needed —
 * the redirect stops a non-admin seeing the dashboard, and RLS stops them
 * writing to the database even if they skip the UI entirely.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return <AdminShell email={session.user?.email ?? ""}>{children}</AdminShell>;
}
