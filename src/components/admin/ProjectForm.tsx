"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, Trash2, Loader2, Plus, Save } from "lucide-react";
import type { ProjectRow } from "@/lib/supabase/database.types";
import {
  deleteProjectImage,
  isStoragePath,
  publicImageUrl,
  uploadProjectImage,
} from "@/lib/storage/project-images";
import { slugify } from "@/lib/validation/schemas";
import { Banner, Button, Field, Select, TextArea, TextInput, Toggle } from "./ui";

export interface ProjectFormState {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  status: "Live" | "Hackathon Build" | "In Progress";
  problem: string;
  solution: string;
  myContribution: string;
  technologies: string;
  caseStudyProblem: string;
  caseStudyIdea: string;
  caseStudyWhatIBuilt: string;
  caseStudyLearnings: string;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

const BLANK: ProjectFormState = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  category: "",
  status: "In Progress",
  problem: "",
  solution: "",
  myContribution: "",
  technologies: "",
  caseStudyProblem: "",
  caseStudyIdea: "",
  caseStudyWhatIBuilt: "",
  caseStudyLearnings: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  featured: false,
  published: true,
  displayOrder: 0,
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function toProjectFormState(row: ProjectRow | null): ProjectFormState {
  if (!row) return BLANK;

  const caseStudy = asRecord(row.case_study);

  return {
    title: row.title,
    slug: row.slug,
    tagline: row.tagline ?? "",
    description: row.description,
    category: row.category ?? "",
    status:
      row.status === "Live" || row.status === "Hackathon Build"
        ? row.status
        : "In Progress",
    problem: row.problem ?? "",
    solution: row.solution ?? "",
    myContribution: row.my_contribution ?? "",
    technologies: row.technologies.join("\n"),
    caseStudyProblem: typeof caseStudy.problem === "string" ? caseStudy.problem : "",
    caseStudyIdea: typeof caseStudy.idea === "string" ? caseStudy.idea : "",
    caseStudyWhatIBuilt:
      typeof caseStudy.whatIBuilt === "string" ? caseStudy.whatIBuilt : "",
    caseStudyLearnings: asStringList(caseStudy.learnings).join("\n"),
    githubUrl: row.github_url ?? "",
    liveUrl: row.live_url ?? "",
    imageUrl: row.image_url ?? "",
    featured: row.featured,
    published: row.published,
    displayOrder: row.display_order,
  };
}

export function ProjectForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial: ProjectRow | null;
  submitting: boolean;
  onSubmit: (values: ProjectFormState) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ProjectFormState>(() =>
    toProjectFormState(initial)
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const set = <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K]
  ) => setValues((previous) => ({ ...previous, [key]: value }));

  const handleTitle = (title: string) => {
    setValues((previous) => ({
      ...previous,
      title,
      // Keep the slug in step with the title until the owner edits it directly,
      // so a new project never ships with an empty or copy-pasted slug.
      slug: slugTouched ? previous.slug : slugify(title),
    }));
  };

  const handleUpload = async (file: File) => {
    setImageBusy(true);
    setImageError(null);

    const result = await uploadProjectImage(file, values.slug || values.title);
    setImageBusy(false);

    if (result.ok) {
      // Replacing an image should not orphan the previous object.
      if (isStoragePath(values.imageUrl)) {
        await deleteProjectImage(values.imageUrl);
      }
      set("imageUrl", result.data);
    } else {
      setImageError(result.error);
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemoveImage = async () => {
    if (isStoragePath(values.imageUrl)) {
      const result = await deleteProjectImage(values.imageUrl);
      if (!result.ok) {
        setImageError(result.error);
        return;
      }
    }
    set("imageUrl", "");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title" htmlFor="project-title">
          <TextInput
            id="project-title"
            required
            value={values.title}
            onChange={(event) => handleTitle(event.target.value)}
            placeholder="SmartAttend"
          />
        </Field>

        <Field
          label="Slug"
          htmlFor="project-slug"
          hint="Used as the project identifier. Lowercase, hyphens only."
        >
          <TextInput
            id="project-slug"
            required
            value={values.slug}
            onChange={(event) => {
              setSlugTouched(true);
              set("slug", slugify(event.target.value));
            }}
            placeholder="smartattend"
          />
        </Field>
      </div>

      <Field label="Tagline" htmlFor="project-tagline">
        <TextInput
          id="project-tagline"
          value={values.tagline}
          onChange={(event) => set("tagline", event.target.value)}
          placeholder="One line that sums up the project"
        />
      </Field>

      <Field
        label="Description"
        htmlFor="project-description"
        hint="Shown on the project card. Keep it to a couple of sentences."
      >
        <TextArea
          id="project-description"
          required
          rows={3}
          value={values.description}
          onChange={(event) => set("description", event.target.value)}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Category" htmlFor="project-category">
          <TextInput
            id="project-category"
            value={values.category}
            onChange={(event) => set("category", event.target.value)}
            placeholder="Full-Stack SaaS"
          />
        </Field>

        <Field label="Status" htmlFor="project-status">
          <Select
            id="project-status"
            value={values.status}
            onChange={(event) =>
              set("status", event.target.value as ProjectFormState["status"])
            }
          >
            <option value="In Progress">In Progress</option>
            <option value="Hackathon Build">Hackathon Build</option>
            <option value="Live">Live</option>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Problem" htmlFor="project-problem">
          <TextArea
            id="project-problem"
            rows={3}
            value={values.problem}
            onChange={(event) => set("problem", event.target.value)}
          />
        </Field>
        <Field label="Solution" htmlFor="project-solution">
          <TextArea
            id="project-solution"
            rows={3}
            value={values.solution}
            onChange={(event) => set("solution", event.target.value)}
          />
        </Field>
      </div>

      <Field
        label="My contribution"
        htmlFor="project-contribution"
        hint="Be specific about what you personally built."
      >
        <TextArea
          id="project-contribution"
          rows={3}
          value={values.myContribution}
          onChange={(event) => set("myContribution", event.target.value)}
        />
      </Field>

      <Field
        label="Technologies"
        htmlFor="project-technologies"
        hint="One per line."
      >
        <TextArea
          id="project-technologies"
          rows={5}
          value={values.technologies}
          onChange={(event) => set("technologies", event.target.value)}
          placeholder={"React\nTypeScript\nPostgreSQL"}
        />
      </Field>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] p-4">
        <legend className="px-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          Case study (shown in the modal)
        </legend>

        <Field label="Problem" htmlFor="case-problem">
          <TextArea
            id="case-problem"
            rows={3}
            value={values.caseStudyProblem}
            onChange={(event) => set("caseStudyProblem", event.target.value)}
          />
        </Field>

        <Field label="Idea &amp; approach" htmlFor="case-idea">
          <TextArea
            id="case-idea"
            rows={3}
            value={values.caseStudyIdea}
            onChange={(event) => set("caseStudyIdea", event.target.value)}
          />
        </Field>

        <Field label="What I built" htmlFor="case-built">
          <TextArea
            id="case-built"
            rows={3}
            value={values.caseStudyWhatIBuilt}
            onChange={(event) => set("caseStudyWhatIBuilt", event.target.value)}
          />
        </Field>

        <Field label="Learnings" htmlFor="case-learnings" hint="One per line.">
          <TextArea
            id="case-learnings"
            rows={4}
            value={values.caseStudyLearnings}
            onChange={(event) => set("caseStudyLearnings", event.target.value)}
          />
        </Field>
      </fieldset>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="GitHub URL"
          htmlFor="project-github"
          hint="Leave empty until you have verified the repo link."
        >
          <TextInput
            id="project-github"
            type="url"
            value={values.githubUrl}
            onChange={(event) => set("githubUrl", event.target.value)}
            placeholder="https://github.com/…"
          />
        </Field>

        <Field label="Live URL" htmlFor="project-live">
          <TextInput
            id="project-live"
            type="url"
            value={values.liveUrl}
            onChange={(event) => set("liveUrl", event.target.value)}
            placeholder="https://…"
          />
        </Field>
      </div>

      {imageError && <Banner tone="error">{imageError}</Banner>}

      <Field
        label="Project image"
        htmlFor="project-image"
        hint="Stored in Supabase Storage; the database keeps only the path."
      >
        <div className="space-y-3">
          {values.imageUrl && (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicImageUrl(values.imageUrl)}
                alt=""
                className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleRemoveImage}
                disabled={imageBusy}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </Button>
            </div>
          )}

          <input
            ref={fileRef}
            id="project-image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={imageBusy}
          >
            {imageBusy ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ImagePlus className="w-3.5 h-3.5" />
            )}
            <span>{values.imageUrl ? "Replace image" : "Upload image"}</span>
          </Button>
        </div>
      </Field>

      <div className="space-y-3">
        <Toggle
          id="project-featured"
          checked={values.featured}
          onChange={(next) => set("featured", next)}
          label="Featured"
          description="Featured projects are prioritised on the public site."
        />
        <Toggle
          id="project-published"
          checked={values.published}
          onChange={(next) => set("published", next)}
          label="Published"
          description="Unpublished projects stay in the CMS but are hidden from visitors."
        />
      </div>

      <Field
        label="Display order"
        htmlFor="project-order"
        hint="Lower numbers appear first. The arrow buttons in the list update this for you."
      >
        <TextInput
          id="project-order"
          type="number"
          min={0}
          value={values.displayOrder}
          onChange={(event) => set("displayOrder", Number(event.target.value))}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{initial ? "Save changes" : "Create project"}</span>
        </Button>
      </div>
    </form>
  );
}
