import type { Metadata } from "next";

/**
 * Root layout for the admin area.
 *
 * Intentionally does NOT perform the auth check — `/admin/login` lives under
 * this path, so guarding here would redirect the login page to itself. The
 * protected group in `(dashboard)/layout.tsx` does the guarding instead.
 */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  // Keep the dashboard out of search indexes.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-50 dark:bg-navy-900">{children}</div>;
}
