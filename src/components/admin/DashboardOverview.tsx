"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, Wrench, Mail, MailOpen, ArrowRight } from "lucide-react";
import { getDashboardStats, listMessages, type DashboardStats } from "@/lib/data/admin";
import type { ContactMessageRow } from "@/lib/supabase/database.types";
import {
  AdminCard,
  AdminPageHeader,
  Banner,
  EmptyState,
  Pill,
  SkeletonRows,
} from "./ui";

/**
 * Dashboard overview: the four headline counters plus a peek at recent
 * messages. Every number here is a `count: "exact"` HEAD query, so the
 * dashboard stays a single round trip rather than counting rows client-side.
 */
export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [statsResult, messagesResult] = await Promise.all([
        getDashboardStats(),
        listMessages(false),
      ]);

      if (cancelled) return;

      if (statsResult.ok) {
        setStats(statsResult.data);
      } else {
        setError(statsResult.error);
      }

      if (messagesResult.ok) {
        setMessages(messagesResult.data.slice(0, 5));
      }

      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: "Total projects", value: stats?.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Total skills", value: stats?.skills, icon: Wrench, href: "/admin/skills" },
    { label: "Total messages", value: stats?.messages, icon: Mail, href: "/admin/messages" },
    { label: "Unread messages", value: stats?.unread, icon: MailOpen, href: "/admin/messages" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="An overview of your portfolio content and inbox."
      />

      {error && <Banner tone="error">{error}</Banner>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group">
              <AdminCard className="p-5 h-full transition-colors group-hover:border-brand-400 dark:group-hover:border-brand-500/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {card.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                      {loading ? "—" : (card.value ?? 0)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage <ArrowRight className="w-3 h-3" />
                </p>
              </AdminCard>
            </Link>
          );
        })}
      </div>

      <AdminCard className="mt-6">
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200 dark:border-white/[0.08]">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent messages
          </h2>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <SkeletonRows />
        ) : messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Messages submitted through the public contact form will appear here."
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {messages.map((message) => (
              <li
                key={message.id}
                className="px-5 py-3.5 flex items-start gap-3 flex-wrap"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {message.name}
                    </span>
                    {!message.read && <Pill tone="brand">New</Pill>}
                    {message.spam && <Pill tone="rose">Spam</Pill>}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                    {message.subject}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {message.email} ·{" "}
                    {new Date(message.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </>
  );
}
