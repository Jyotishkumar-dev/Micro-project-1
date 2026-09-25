"use client";

import React, { useState } from "react";
import { Plus, Pencil, ExternalLink, Github } from "lucide-react";
import type { ProjectRow } from "@/lib/supabase/database.types";
import {
  createProject,
  deleteProject,
  listProjects,
  reorder,
  updateProject,
} from "@/lib/data/admin";
import { ProjectForm, type ProjectFormState } from "./ProjectForm";
import { useCollection, useMutation } from "./useCollection";
import {
  AdminCard,
  AdminPageHeader,
  Banner,
  Button,
  ConfirmButton,
  EmptyState,
  IconButton,
  Modal,
  Pill,
  ReorderControls,
  SkeletonRows,
} from "./ui";

/**
 * Projects CRUD.
 *
 * Reordering uses the `reorder_items` RPC (one round trip, still RLS-checked);
 * every other write is a plain insert/update/delete so a failure points at a
 * specific row. Rows show published state, because "the change saved but the
 * site still looks the same" is nearly always a `published` mistake.
 */
export function ProjectManager() {
  const { items, setItems, status, error, reload } = useCollection(listProjects);
  const { busy, feedback, setFeedback, run } = useMutation();

  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [creating, setCreating] = useState(false);

  const closeModal = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSubmit = async (values: ProjectFormState) => {
    const saved = await run(
      () => (editing ? updateProject(editing.id, values) : createProject(values)),
      editing ? "Project updated." : "Project created."
    );

    if (saved) {
      closeModal();
      await reload();
    }
  };

  const handleDelete = async (row: ProjectRow) => {
    const ok = await run(() => deleteProject(row.id), "Project deleted.");
    if (ok) await reload();
  };

  const handleMove = async (from: number, to: number) => {
    if (from === to) return;

    // Optimistic: the list reorders instantly, and reverts if the RPC refuses.
    const previous = items;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);

    const ok = await run(
      () => reorder("projects", next.map((row) => row.id)),
      "Order saved."
    );

    if (!ok) {
      setItems(previous);
    } else {
      // Re-read so display_order comes back exactly as stored.
      await reload();
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Create, edit, reorder and publish the case studies shown on the public site."
        action={
          <Button
            onClick={() => {
              setFeedback(null);
              setCreating(true);
            }}
          >
            <Plus className="w-4 h-4" />
            <span>New project</span>
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
          <Banner
            tone={feedback.tone}
            onDismiss={() => setFeedback(null)}
          >
            {feedback.message}
          </Banner>
        </div>
      )}

      <AdminCard>
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Add your first project, or run the seed migration to load the documented ones."
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                <span>New project</span>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {items.map((row, index) => (
              <li
                key={row.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center gap-3 sm:order-1">
                  <span className="text-xs font-mono text-slate-400 w-6 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex-1 min-w-0 sm:order-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {row.title}
                    </span>
                    {row.featured && <Pill tone="brand">Featured</Pill>}
                    <Pill tone={row.published ? "emerald" : "amber"}>
                      {row.published ? "Published" : "Draft"}
                    </Pill>
                    {row.status && <Pill>{row.status}</Pill>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
                    /{row.slug}
                    {row.technologies.length > 0 && ` · ${row.technologies.length} techs`}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:order-3 flex-wrap">
                  {row.live_url && (
                    <a
                      href={row.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      aria-label={`Open ${row.title} live site`}
                      title="Live site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {row.github_url && (
                    <a
                      href={row.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      aria-label={`Open ${row.title} source on GitHub`}
                      title="Source"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <ReorderControls
                    index={index}
                    total={items.length}
                    onMove={handleMove}
                    busy={busy}
                  />
                  <IconButton
                    label={`Edit ${row.title}`}
                    onClick={() => {
                      setFeedback(null);
                      setEditing(row);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </IconButton>
                  <ConfirmButton onConfirm={() => handleDelete(row)}>
                    Delete
                  </ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <Modal
        open={creating || editing !== null}
        onClose={closeModal}
        title={editing ? `Edit ${editing.title}` : "New project"}
        wide
      >
        <ProjectForm
          key={editing?.id ?? "new"}
          initial={editing}
          submitting={busy}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
}
