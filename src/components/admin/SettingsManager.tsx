"use client";

import React, { useState } from "react";
import { Save, ShieldCheck, Database, HardDrive, CheckCircle2, XCircle } from "lucide-react";
import type { ProfileRow } from "@/lib/supabase/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { profileSchema } from "@/lib/validation/schemas";
import { useMutation } from "./useCollection";
import {
  AdminCard,
  AdminPageHeader,
  Banner,
  Button,
  Field,
  Pill,
  TextArea,
  TextInput,
  Toggle,
} from "./ui";

interface SettingsManagerProps {
  profile: ProfileRow | null;
  email: string;
  /** Whether the public anon key is present. Never the key itself. */
  configured: boolean;
  /** Whether the service role key is present. A boolean, never the key. */
  serviceRoleConfigured: boolean;
  bucket: string;
}

interface ProfileFormState {
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  isPublic: boolean;
}

const BLANK: ProfileFormState = {
  fullName: "",
  headline: "",
  bio: "",
  location: "",
  avatarUrl: "",
  resumeUrl: "",
  isPublic: false,
};

/**
 * Settings.
 *
 * Scope note: this edits the *authenticated* profile row, and the public site
 * copy (hero headline, about story, contact links) still comes from
 * `src/data/personal.ts`. Moving all of that into the database is a deliberate
 * follow-up, not something to smuggle into this phase — the public pages were
 * not to be redesigned.
 */
export function SettingsManager({
  profile,
  email,
  configured,
  serviceRoleConfigured,
  bucket,
}: SettingsManagerProps) {
  const [values, setValues] = useState<ProfileFormState>({
    fullName: profile?.full_name ?? "",
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    avatarUrl: profile?.avatar_url ?? "",
    resumeUrl: profile?.resume_url ?? "",
    isPublic: profile?.is_public ?? false,
  });
  const { busy, feedback, setFeedback, run } = useMutation();

  const set = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!profile) {
      setFeedback({
        tone: "error",
        message: "No profile row is linked to this account yet.",
      });
      return;
    }

    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) {
      setFeedback({
        tone: "error",
        message: parsed.error.issues[0]?.message ?? "Please check the fields.",
      });
      return;
    }

    // Deliberately does NOT send `is_admin`. The profiles_protect_admin trigger
    // would reject the change anyway; omitting it keeps the intent obvious.
    await run(async () => {
      const { error } = await getSupabaseBrowserClient()
        .from("profiles")
        .update({
          full_name: parsed.data.fullName,
          headline: parsed.data.headline,
          bio: parsed.data.bio,
          avatar_url: parsed.data.avatarUrl,
          resume_url: parsed.data.resumeUrl,
          location: parsed.data.location,
          is_public: parsed.data.isPublic,
        })
        .eq("id", profile.id);

      return { ok: !error, error: error?.message };
    }, "Profile saved.");
  };

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Your account, public profile visibility, and a summary of the backend configuration."
      />

      {feedback && (
        <div className="mb-4">
          <Banner tone={feedback.tone} onDismiss={() => setFeedback(null)}>
            {feedback.message}
          </Banner>
        </div>
      )}

      <div className="space-y-6">
        <AdminCard>
          <div className="px-5 py-4 border-b border-slate-200 dark:border-white/[0.08]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Account</h2>
          </div>
          <dl className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="mt-0.5 font-medium text-slate-900 dark:text-white break-all">
                {email}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Role</dt>
              <dd className="mt-0.5">
                <Pill tone="emerald">
                  <ShieldCheck className="w-3 h-3" />
                  Administrator
                </Pill>
              </dd>
            </div>
          </dl>
        </AdminCard>

        <form onSubmit={handleSave}>
          <AdminCard>
            <div className="px-5 py-4 border-b border-slate-200 dark:border-white/[0.08]">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Public profile
              </h2>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" htmlFor="settings-name">
                  <TextInput
                    id="settings-name"
                    value={values.fullName}
                    onChange={(event) => set("fullName", event.target.value)}
                  />
                </Field>

                <Field label="Location" htmlFor="settings-location">
                  <TextInput
                    id="settings-location"
                    value={values.location}
                    onChange={(event) => set("location", event.target.value)}
                    placeholder="Bokaro, Jharkhand"
                  />
                </Field>
              </div>

              <Field label="Headline" htmlFor="settings-headline">
                <TextInput
                  id="settings-headline"
                  value={values.headline}
                  onChange={(event) => set("headline", event.target.value)}
                />
              </Field>

              <Field label="Bio" htmlFor="settings-bio">
                <TextArea
                  id="settings-bio"
                  rows={4}
                  value={values.bio}
                  onChange={(event) => set("bio", event.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Avatar URL"
                  htmlFor="settings-avatar"
                  hint="A Supabase Storage path or absolute URL."
                >
                  <TextInput
                    id="settings-avatar"
                    value={values.avatarUrl}
                    onChange={(event) => set("avatarUrl", event.target.value)}
                  />
                </Field>

                <Field label="Resume URL" htmlFor="settings-resume">
                  <TextInput
                    id="settings-resume"
                    value={values.resumeUrl}
                    onChange={(event) => set("resumeUrl", event.target.value)}
                  />
                </Field>
              </div>

              <Toggle
                id="settings-public"
                checked={values.isPublic}
                onChange={(next) => set("isPublic", next)}
                label="Expose this profile publicly"
                description="Anonymous visitors can read this row only while this is on. Contact messages and admin data are never public."
              />

              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-white/[0.08]">
                <Button type="submit" loading={busy}>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save profile</span>
                </Button>
              </div>
            </div>
          </AdminCard>
        </form>

        <AdminCard>
          <div className="px-5 py-4 border-b border-slate-200 dark:border-white/[0.08]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Backend configuration
            </h2>
          </div>

          <div className="p-5 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              {configured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Supabase {configured ? "connected" : "not configured"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {configured
                    ? "Environment variables are present. The service role key is only read on the server."
                    : "Add the variables from .env.example to .env.local and restart the dev server."}
                </p>
                {!serviceRoleConfigured && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    SUPABASE_SERVICE_ROLE_KEY is missing — the public contact form
                    will return 503 until it is set.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Row Level Security
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enforced in the database. The route guard in this app is only a
                  convenience — RLS is what actually authorises a write.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HardDrive className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Image bucket
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  {bucket}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08]">
              <p className="font-medium text-slate-900 dark:text-white">
                Adding another administrator
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Insert their email into{" "}
                <span className="font-mono">public.admin_allowlist</span> in the
                Supabase SQL editor first, then invite them. Sign-up is blocked at
                the database level for any email that is not on that list.
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
