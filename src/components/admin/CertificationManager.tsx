"use client";

import React, { useState } from "react";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import type { CertificationRow } from "@/lib/supabase/database.types";
import {
  createCertification,
  deleteCertification,
  listCertifications,
  reorder,
  updateCertification,
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
  SkeletonRows,
  TextArea,
  TextInput,
  Toggle,
} from "./ui";

interface CertificationFormState {
  name: string;
  slug: string;
  organization: string;
  issueDate: string;
  credentialUrl: string;
  badge: string;
  description: string;
  details: string;
  published: boolean;
  displayOrder: number;
}

const BLANK: CertificationFormState = {
  name: "",
  slug: "",
  organization: "",
  issueDate: "",
  credentialUrl: "",
  badge: "",
  description: "",
  details: "",
  published: true,
  displayOrder: 0,
};

function toFormState(row: CertificationRow | null): CertificationFormState {
  if (!row) return BLANK;

  return {
    name: row.name,
    slug: row.slug,
    organization: row.organization ?? "",
    issueDate: row.issue_date ?? "",
    credentialUrl: row.credential_url ?? "",
    badge: row.badge ?? "",
    description: row.description,
    details: row.details.join("\n"),
    published: row.published,
    displayOrder: row.display_order,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Certifications CRUD. */
export function CertificationManager() {
  const { items, setItems, status, error, reload } = useCollection(
    listCertifications
  );
  const { busy, feedback, setFeedback, run } = useMutation();

  const [editing, setEditing] = useState<CertificationRow | null>(null);
  const [creating, setCreating] = useState(false);

  const closeModal = () => {
    setEditing(null);
    setCreating(false);
  };

  const handleSubmit = async (values: CertificationFormState) => {
    const saved = await run(
      () =>
        editing
          ? updateCertification(editing.id, values)
          : createCertification(values),
      editing ? "Certification updated." : "Certification created."
    );

    if (saved) {
      closeModal();
      await reload();
    }
  };

  const handleDelete = async (row: CertificationRow) => {
    const ok = await run(() => deleteCertification(row.id), "Certification deleted.");
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
      () => reorder("certifications", next.map((row) => row.id)),
      "Order saved."
    );

    if (!ok) setItems(previous);
    else await reload();
  };

  return (
    <>
      <AdminPageHeader
        title="Certifications"
        description="Credentials shown on the public site. Add the issue date and verification link once you have confirmed them."
        action={
          <Button
            onClick={() => {
              setFeedback(null);
              setCreating(true);
            }}
          >
            <Plus className="w-4 h-4" />
            <span>New certification</span>
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
            title="No certifications yet"
            description="Add your credentials, or run the seed migration to load the documented ones."
            action={
              <Button onClick={() => setCreating(true)}>
                <Plus className="w-4 h-4" />
                <span>New certification</span>
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
                      {row.name}
                    </span>
                    {row.badge && <Pill tone="brand">{row.badge}</Pill>}
                    {!row.issue_date && <Pill tone="amber">No date</Pill>}
                    {!row.published && <Pill tone="amber">Draft</Pill>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {row.organization ?? "—"}
                    {row.issue_date && ` · ${row.issue_date}`}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {row.credential_url && (
                    <a
                      href={row.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      aria-label={`Verify ${row.name}`}
                      title="Verification link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
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
        title={editing ? `Edit ${editing.name}` : "New certification"}
        wide
      >
        <CertificationForm
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

function CertificationForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial: CertificationRow | null;
  submitting: boolean;
  onSubmit: (values: CertificationFormState) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<CertificationFormState>(() =>
    toFormState(initial)
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));

  const set = <K extends keyof CertificationFormState>(
    key: K,
    value: CertificationFormState[K]
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
        <Field label="Name" htmlFor="cert-name">
          <TextInput
            id="cert-name"
            required
            value={values.name}
            onChange={(event) =>
              setValues((previous) => ({
                ...previous,
                name: event.target.value,
                slug: slugTouched ? previous.slug : slugify(event.target.value),
              }))
            }
            placeholder="C++ Essentials 1"
          />
        </Field>

        <Field label="Slug" htmlFor="cert-slug" hint="Lowercase and hyphens only.">
          <TextInput
            id="cert-slug"
            required
            value={values.slug}
            onChange={(event) => {
              setSlugTouched(true);
              set("slug", slugify(event.target.value));
            }}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Organisation" htmlFor="cert-org">
          <TextInput
            id="cert-org"
            value={values.organization}
            onChange={(event) => set("organization", event.target.value)}
            placeholder="Cisco Networking Academy"
          />
        </Field>

        <Field label="Issue date" htmlFor="cert-date" hint="YYYY-MM-DD. Optional.">
          <TextInput
            id="cert-date"
            type="date"
            value={values.issueDate}
            onChange={(event) => set("issueDate", event.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Badge" htmlFor="cert-badge" hint="Short label shown as a pill.">
          <TextInput
            id="cert-badge"
            value={values.badge}
            onChange={(event) => set("badge", event.target.value)}
            placeholder="Industry Certified"
          />
        </Field>

        <Field
          label="Credential URL"
          htmlFor="cert-url"
          hint="Only add a link you have verified."
        >
          <TextInput
            id="cert-url"
            type="url"
            value={values.credentialUrl}
            onChange={(event) => set("credentialUrl", event.target.value)}
            placeholder="https://…"
          />
        </Field>
      </div>

      <Field label="Description" htmlFor="cert-description">
        <TextArea
          id="cert-description"
          rows={3}
          value={values.description}
          onChange={(event) => set("description", event.target.value)}
        />
      </Field>

      <Field label="Details" htmlFor="cert-details" hint="One per line. Optional.">
        <TextArea
          id="cert-details"
          rows={4}
          value={values.details}
          onChange={(event) => set("details", event.target.value)}
        />
      </Field>

      <Toggle
        id="cert-published"
        checked={values.published}
        onChange={(next) => set("published", next)}
        label="Published"
        description="Unpublished certifications are hidden from visitors."
      />

      <Field
        label="Display order"
        htmlFor="cert-order"
        hint="Lower numbers appear first. The arrow buttons update this for you."
      >
        <TextInput
          id="cert-order"
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
          <span>{initial ? "Save changes" : "Create certification"}</span>
        </Button>
      </div>
    </form>
  );
}
