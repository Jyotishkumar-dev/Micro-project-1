"use client";

import React, { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import type { SkillRow } from "@/lib/supabase/database.types";
import { createSkill, deleteSkill, listSkills, reorder, updateSkill } from "@/lib/data/admin";
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
  TextInput,
  Toggle,
} from "./ui";

const CATEGORIES = [
  { value: "language", label: "Languages" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "database", label: "Databases" },
  { value: "tool", label: "Tools" },
  { value: "core", label: "Core Concepts" },
] as const;

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

interface SkillFormState {
  name: string;
  category: (typeof CATEGORIES)[number]["value"];
  context: string;
  highlight: boolean;
  published: boolean;
  displayOrder: number;
}

const BLANK: SkillFormState = {
  name: "",
  category: "language",
  context: "",
  highlight: false,
  published: true,
  displayOrder: 0,
};

function toFormState(row: SkillRow | null): SkillFormState {
  if (!row) return BLANK;

  const known = CATEGORIES.some((c) => c.value === row.category);

  return {
    name: row.name,
    category: known ? (row.category as SkillFormState["category"]) : "tool",
    context: row.context ?? "",
    highlight: row.highlight,
    published: row.published,
    displayOrder: row.display_order,
  };
}

/**
 * Skills CRUD.
 *
 * Grouped by category for reading, but the list is a single ordered collection
 * underneath — reordering arrows move within the full sequence and write a new
 * `display_order` for every row, which is what the public skills section reads.
 */
export function SkillManager() {
  const { items, setItems, status, error, reload } = useCollection(listSkills);
  const { busy, feedback, setFeedback, run } = useMutation();

  const [editing, setEditing] = useState<SkillRow | null>(null);
  const [creating, setCreating] = useState(false);

  const closeModal = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSubmit = async (values: SkillFormState) => {
    const saved = await run(
      () => (editing ? updateSkill(editing.id, values) : createSkill(values)),
      editing ? "Skill updated." : "Skill added."
    );

    if (saved) {
      closeModal();
      await reload();
    }
  };

  const handleDelete = async (row: SkillRow) => {
    const ok = await run(() => deleteSkill(row.id), "Skill deleted.");
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
      () => reorder("skills", next.map((row) => row.id)),
      "Order saved."
    );

    if (!ok) setItems(previous);
    else await reload();
  };

  return (
    <>
      <AdminPageHeader
        title="Skills"
        description="Manage the technologies listed on the public site, grouped by category."
        action={
          <Button
            onClick={() => {
              setFeedback(null);
              setCreating(true);
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add skill</span>
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
          <SkeletonRows rows={6} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No skills yet"
            description="Add the technologies you want to show off, or run the seed migration."
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                <span>Add skill</span>
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
                <span className="text-xs font-mono text-slate-400 w-6 tabular-nums sm:w-6">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {row.name}
                    </span>
                    <Pill tone="brand">
                      {CATEGORY_LABEL[row.category] ?? row.category}
                    </Pill>
                    {row.highlight && <Pill tone="emerald">Core</Pill>}
                    {!row.published && <Pill tone="amber">Draft</Pill>}
                  </div>
                  {row.context && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {row.context}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <ReorderControls
                    index={index}
                    total={items.length}
                    onMove={handleMove}
                    busy={busy}
                  />
                  <IconButton
                    label={`Edit ${row.name}`}
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
        title={editing ? `Edit ${editing.name}` : "Add skill"}
      >
        <SkillForm
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

function SkillForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial: SkillRow | null;
  submitting: boolean;
  onSubmit: (values: SkillFormState) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<SkillFormState>(() => toFormState(initial));

  const set = <K extends keyof SkillFormState>(key: K, value: SkillFormState[K]) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="space-y-5"
    >
      <Field label="Name" htmlFor="skill-name">
        <TextInput
          id="skill-name"
          required
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
          placeholder="React.js"
        />
      </Field>

      <Field
        label="Category"
        htmlFor="skill-category"
        hint="Changing the category moves the skill between tabs on the public site."
      >
        <Select
          id="skill-category"
          value={values.category}
          onChange={(event) =>
            set("category", event.target.value as SkillFormState["category"])
          }
        >
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Context"
        htmlFor="skill-context"
        hint="A short note on what you use it for. Optional."
      >
        <TextInput
          id="skill-context"
          value={values.context}
          onChange={(event) => set("context", event.target.value)}
          placeholder="Hooks, State Management, Component Architecture"
        />
      </Field>

      <div className="space-y-3">
        <Toggle
          id="skill-highlight"
          checked={values.highlight}
          onChange={(next) => set("highlight", next)}
          label="Core skill"
          description="Marks the skill as a core competency on the public site."
        />
        <Toggle
          id="skill-published"
          checked={values.published}
          onChange={(next) => set("published", next)}
          label="Published"
          description="Unpublished skills are hidden from visitors."
        />
      </div>

      <Field
        label="Display order"
        htmlFor="skill-order"
        hint="Lower numbers appear first. The arrow buttons update this for you."
      >
        <TextInput
          id="skill-order"
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
          <span>{initial ? "Save changes" : "Add skill"}</span>
        </Button>
      </div>
    </form>
  );
}
