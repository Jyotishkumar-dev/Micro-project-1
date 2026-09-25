"use client";

import React, { useState } from "react";
import { Mail, MailOpen, Trash2, Reply, ShieldAlert } from "lucide-react";
import type { ContactMessageRow } from "@/lib/supabase/database.types";
import { deleteMessage, listMessages, setMessageRead } from "@/lib/data/admin";
import { useCollection, useMutation } from "./useCollection";
import {
  AdminCard,
  AdminPageHeader,
  Banner,
  Button,
  ConfirmButton,
  EmptyState,
  IconButton,
  Pill,
  SkeletonRows,
} from "./ui";

/**
 * Contact message inbox.
 *
 * Reading these rows at all is already an RLS-gated operation: `anon` has no
 * SELECT policy on `contact_messages`, so an unauthenticated request returns an
 * empty result set rather than the messages. There is no code path here that
 * widens that.
 */
export function MessageManager() {
  const [includeSpam, setIncludeSpam] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loader = React.useCallback(
    () => listMessages(includeSpam),
    [includeSpam]
  );

  const { items, setItems, status, error, reload } = useCollection(loader);
  const { busy, feedback, setFeedback, run } = useMutation();

  const handleToggleRead = async (row: ContactMessageRow) => {
    const ok = await run(
      () => setMessageRead(row.id, !row.read),
      row.read ? "Marked as unread." : "Marked as read."
    );

    if (ok) {
      setItems((current) =>
        current.map((item) =>
          item.id === row.id ? { ...item, read: !row.read } : item
        )
      );
    }
  };

  const handleDelete = async (row: ContactMessageRow) => {
    const ok = await run(() => deleteMessage(row.id), "Message deleted.");
    if (ok) await reload();
  };

  const unread = items.filter((item) => !item.read && !item.spam).length;

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description="Submissions from the public contact form. Only you can read these."
        action={
          <Button variant="secondary" onClick={reload} disabled={status === "loading"}>
            Refresh
          </Button>
        }
      />

      {error && (
        <Banner tone="error" onDismiss={reload}>
          {error}
        </Banner>
      )}

      {feedback && (
        <div className="mb-4">
          <Banner tone={feedback.tone} onDismiss={() => setFeedback(null)}>
            {feedback.message}
          </Banner>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSpam}
            onChange={(event) => setIncludeSpam(event.target.checked)}
            className="w-4 h-4 rounded border-slate-300 dark:border-navy-600 accent-brand-600"
          />
          Show messages flagged as spam
        </label>
        <Pill tone={unread > 0 ? "brand" : "neutral"}>
          {unread} unread
        </Pill>
      </div>

      <AdminCard>
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : items.length === 0 ? (
          <EmptyState
            title={includeSpam ? "No messages" : "No messages (spam hidden)"}
            description="Submissions from the public contact form will land here."
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {items.map((row) => {
              const isOpen = expanded === row.id;

              return (
                <li
                  key={row.id}
                  className={row.read ? "" : "bg-brand-500/[0.04]"}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : row.id)}
                        aria-expanded={isOpen}
                        className="flex-1 min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1 -m-1"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {row.name}
                          </span>
                          {!row.read && !row.spam && <Pill tone="brand">New</Pill>}
                          {row.spam && (
                            <Pill tone="rose">
                              <ShieldAlert className="w-3 h-3" />
                              Spam
                            </Pill>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200 mt-0.5">
                          {row.subject}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {row.email}
                          {row.project_type && ` · ${row.project_type}`} ·{" "}
                          {new Date(row.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </button>

                      <div className="flex items-center gap-1">
                        <IconButton
                          label={row.read ? "Mark as unread" : "Mark as read"}
                          onClick={() => handleToggleRead(row)}
                          disabled={busy}
                        >
                          {row.read ? (
                            <Mail className="w-4 h-4" />
                          ) : (
                            <MailOpen className="w-4 h-4 text-brand-500" />
                          )}
                        </IconButton>

                        <a
                          href={`mailto:${row.email}?subject=${encodeURIComponent(
                            `Re: ${row.subject}`
                          )}`}
                          aria-label={`Reply to ${row.name}`}
                          title="Reply by email"
                          className="p-2 rounded-lg text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                          <Reply className="w-4 h-4" />
                        </a>

                        <ConfirmButton onConfirm={() => handleDelete(row)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </ConfirmButton>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-3 pl-1">
                        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed border-l-2 border-slate-200 dark:border-white/10 pl-3">
                          {row.message}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminCard>
    </>
  );
}
