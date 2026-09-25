"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { PROJECT_IMAGES_BUCKET, SUPABASE_URL } from "@/lib/supabase/env";
import type { Result } from "@/lib/data/admin";

/**
 * Supabase Storage helpers for project imagery.
 *
 * Images are stored as Storage objects; the `projects.image_url` column holds
 * only the object path (or an absolute URL for externally hosted art). Nothing
 * binary is stored in Postgres, so a portfolio row stays cheap to read and the
 * CDN can serve the image directly.
 *
 * The bucket is public-read and admin-write, enforced by the policies in
 * `supabase/migrations/0003_storage.sql` — this module has no privileged path.
 */

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
}

function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** True when a stored value is a Storage path rather than an absolute URL. */
export function isStoragePath(value: string): boolean {
  return Boolean(value) && !/^https?:\/\//i.test(value);
}

export function publicImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (!isStoragePath(pathOrUrl)) return pathOrUrl;
  return `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/${pathOrUrl}`;
}

export async function uploadProjectImage(
  file: File,
  slug: string
): Promise<Result<string>> {
  if (!ALLOWED.has(file.type)) {
    return {
      ok: false,
      error: "Unsupported file type. Use PNG, JPEG, WebP, GIF, AVIF or SVG.",
    };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Image must be 5 MB or smaller." };
  }

  const extension = file.name.includes(".")
    ? `.${file.name.split(".").pop()?.toLowerCase()}`
    : "";

  const path = `${safeName(slug) || "project"}-${Date.now()}-${randomSuffix()}${extension}`;

  const { error } = await getSupabaseBrowserClient()
    .storage.from(PROJECT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return {
      ok: false,
      error: `Upload failed: ${error.message}. If this is a permissions problem, check the storage policies in 0003_storage.sql.`,
    };
  }

  return { ok: true, data: path };
}

export async function deleteProjectImage(path: string): Promise<Result<null>> {
  if (!isStoragePath(path)) {
    // Externally hosted image — nothing of ours to delete.
    return { ok: true, data: null };
  }

  const { error } = await getSupabaseBrowserClient()
    .storage.from(PROJECT_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    return { ok: false, error: `Could not delete the image: ${error.message}` };
  }

  return { ok: true, data: null };
}
