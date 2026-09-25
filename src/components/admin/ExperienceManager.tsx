"use client";

import React, { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import type { ExperienceRow } from "@/lib/supabase/database.types";
import {
  createExperience,
  deleteExperience,
  listExperience,
  reorder,
  updateExperience,
} from "@/lib/data/admin";
import { useCollection, useMutation } from "./useCollection";
import {
  AdminCard,
  AdminPageHeader,
  Banner,
  Button,
  ConfirmButton,
  EmptyState,
  Field,
  IconButton,
  Modal,
  Pill,
  ReorderControls,
  Select,
  SkeletonRows,
  TextArea,
  TextInput,
  Toggle,
} from "./ui";

const TYPES = [
  { value: "leadership", label: "Leadership" },
  { value: "hackathon", label: "Hackathon" },
  { value: "ambassador", label: "Ambassador" },
  { value: "club", label: "Club" },
  { value: "workshop", label: "Workshop" },
] as const;

const TYPE_LABEL = Object.fromEntries(TYPES.map((t) => [t.value, t.label]));

interface ExperienceFormState {
  title: string;
  slug: string;
  organization: string;
  type: (typeof TYPES)[number]["value"];
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights: string;
  published: boolean;
  displayOrder: number;
}

const BLANK: ExperienceFormState = {
  title: "",
  slug: "",
  organization: "",
  type: "leadership",
  role: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  highlights: "",
  published: true,
  displayOrder: 0,
};

function toFormState(row: ExperienceRow | null): ExperienceFormState {
  if (!row) return BLANK;

  return {
    title: row.title,
    slug: row.slug,
    organization: row.organization ?? "",
    type: TYPES.some((t) => t.value === row.type)
      ? (row.type as ExperienceFormState["type"])
      : "leadership",
    role: row.role ?? "",
    startDate: row.start_date ?? "",
    endDate: row.end_date ?? "",
    isCurrent: row.is_current,
    description: row.description,
    highlights: row.highlights.join("\n"),
    published: row.published,
    displayOrder: row.display_order,
  };
}

/**
 * Experience / leadership CRUD.
 *
 * "Current" and "end date" are mutually exclusive in the database: marking an
 * entry as current clears the end date, so the timeline on the public site
 * never renders "Aug 2026 – Mar 2026" next to a Present badge.
 */
export function ExperienceManager() {
  const { items, setItems, status, error, reload } = useCollection(listExperience);
  const { busy, feedback, setFeedback, run } = useMutation();

  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const [creating, setCreating] = useState(false);

  const closeModal = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSubmit = async (values: ExperienceFormState) => {
    const saved = await run(
      () => (editing ? updateExperience(editing.id, values) : createExperience(values)),
      editing ? "Entry updated." : "Entry created."
    );

    if (saved) {
      closeModal();
      await reload();
    }
  };

  const handleDelete = async (row: ExperienceRow) => {
    const ok = await run(() => deleteExperience(row.id), "Entry deleted.");
    if (ok) await reload();
  };

  const handleMove = async (from: number, to: number) => {
    if (from === to) return;

    const previous = items;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);

    const ok = await run(
      () => reorder("experience", next.map((row) => row.id)),
      "Order saved."
    );

    if (!ok) setItems(previous);
    else await reload();
  };

  return (
    <>
      <AdminPageHeader
        title="Experience &amp; Leadership"
        description="Hackathons, ambassador programmes, clubs and committee roles. Only add roles you actually held."
        action={
          <Button
            onClick={() => {
              setFeedback(null);
              setCreating(true);
            }}
          >
            <Plus className="w-4 h-4" />
            <span>New entry</span>
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

      <AdminCard>
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No experience entries yet"
            description="Add your documented roles, or run the seed migration to load them."
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                <span>New entry</span>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {items.map((row, index) => (
              <li
                key={row.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <span className="text-xs font-mono text-slate-400 w-6 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {row.title}
                    </span>
                    <Pill tone="brand">{TYPE_LABEL[row.type] ?? row.type}</Pill>
                    {row.is_current && <Pill tone="emerald">Present</Pill>}
                    {!row.published && <Pill tone="amber">Draft</Pill>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {[row.role, row.organization].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <div className="flex items-center gap-1">
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
        title={editing ? `Edit ${editing.title}` : "New experience entry"}
        wide
      >
        <ExperienceForm
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

function ExperienceForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial: ExperienceRow | null;
  submitting: boolean;
  onSubmit: (values: ExperienceFormState) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ExperienceFormState>(() =>
    toFormState(initial)
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));

  const set = <K extends keyof ExperienceFormState>(
    key: K,
    value: ExperienceFormState[K]
  ) => setValues((previous) => ({ ...previous, [key]: value }));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title" htmlFor="exp-title">
          <TextInput
            id="exp-title"
            required
            value={values.title}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                title: event.target.value,
                slug: slugTouched
                  ? previous.slug
                  : event.target.value
                      .toLowerCase()
                      .replace(/['’]/g, "")
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, ""),
              }))
            }
            placeholder="Techfest, IIT Bombay"
          />
        </Field>

        <Field label="Slug" htmlFor="exp-slug" hint="Lowercase and hyphens only.">
          <TextInput
            id="exp-slug"
            required
            value={values.slug}
            onChange={(event) => {
              setSlugTouched(true);
              set(
                "slug",
                event.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "-")
                  .replace(/-+/g, "-")
                  .replace(/^-+|-+$/g, "")
              );
            }}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Organisation" htmlFor="exp-org">
          <TextInput
            id="exp-org"
            value={values.organization}
            onChange={(event) => set("organization", event.target.value)}
            placeholder="IIT Bombay"
          />
        </Field>

        <Field label="Role" htmlFor="exp-role">
          <TextInput
            id="exp-role"
            value={values.role}
            onChange={(event) => set("role", event.target.value)}
            placeholder="College Ambassador"
          />
        </Field>
      </div>

      <Field label="Type" htmlFor="exp-type">
        <Select
          id="exp-type"
          value={values.type}
          onChange={(event) =>
            set("type", event.target.value as ExperienceFormState["type"])
          }
        >
          {TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Start date" htmlFor="exp-start" hint="YYYY-MM-DD. Optional.">
          <TextInput
            id="exp-start"
            type="date"
            value={values.startDate}
            onChange={(event) => set("startDate", event.target.value)}
          />
        </Field>

        <Field
          label="End date"
          htmlFor="exp-end"
          hint={
            values.isCurrent
              ? "Ignored while this entry is marked current."
              : "YYYY-MM-DD. Leave empty if unknown."
          }
        >
          <TextInput
            id="exp-end"
            type="date"
            disabled={values.isCurrent}
            value={values.isCurrent ? "" : values.endDate}
            onChange={(event) => set("endDate", event.target.value)}
          />
        </Field>
      </div>

      <Toggle
        id="exp-current"
        checked={values.isCurrent}
        onChange={(next) => set("isCurrent", next)}
        label="Currently ongoing"
        description="Renders as “Present” on the public timeline."
      />

      <Field label="Description" htmlFor="exp-description">
        <TextArea
          id="exp-description"
          rows={3}
          value={values.description}
          onChange={(event) => set("description", event.target.value)}
        />
      </Field>

      <Field
        label="Highlights"
        htmlFor="exp-highlights"
        hint="One per line. Keep these factual."
      >
        <TextArea
          id="exp-highlights"
          rows={4}
          value={values.highlights}
          onChange={(event) => set("highlights", event.target.value)}
        />
      </Field>

      <Toggle
        id="exp-published"
        checked={values.published}
        onChange={(next) => set("published", next)}
        label="Published"
        description="Unpublished entries are hidden from visitors."
      />

      <Field
        label="Display order"
        htmlFor="exp-order"
        hint="Lower numbers appear first. The arrow buttons update this for you."
      >
        <TextInput
          id="exp-order"
          type="number"
          min={0}
          value={values.displayOrder}
          onChange={(event) => set("displayOrder", Number(event.target.value))}
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          <span>{initial ? "Save changes" : "Create entry"}</span>
        </Button>
      </div>
    </form>
  );
}
