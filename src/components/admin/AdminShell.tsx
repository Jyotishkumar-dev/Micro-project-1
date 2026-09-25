"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  Wrench,
  Briefcase,
  Award,
  Mail,
  Settings as SettingsIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, IconButton } from "./ui";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    setSigningOut(true);
    await getSupabaseBrowserClient().auth.signOut();
    // Full refresh so the server layout re-runs its admin check.
    router.replace("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav className="flex-1 space-y-1" aria-label="Admin sections">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              active
                ? "bg-brand-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span>View public site</span>
      </Link>

      <div className="px-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate" title={email}>
          {email}
        </p>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        loading={signingOut}
        onClick={handleSignOut}
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign out</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 bg-white/90 dark:bg-navy-800/90 backdrop-blur-lg border-b border-slate-200 dark:border-white/[0.08]">
        <span className="text-sm font-bold">Admin</span>
        <IconButton
          label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </IconButton>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80%] h-full p-4 flex flex-col bg-white dark:bg-navy-800 border-r border-slate-200 dark:border-white/[0.08]">
            <p className="text-sm font-bold px-3 pb-4">Admin</p>
            {nav}
            {footer}
          </div>
        </div>
      )}

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 flex-shrink-0 p-4 sticky top-0 h-screen border-r border-slate-200 dark:border-white/[0.08] bg-white/60 dark:bg-navy-800/40">
          <Link
            href="/admin"
            className="px-3 pb-5 text-base font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
          >
            Portfolio CMS
          </Link>
          {nav}
          {footer}
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
