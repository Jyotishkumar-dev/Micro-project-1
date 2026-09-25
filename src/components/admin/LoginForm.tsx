"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Field, TextInput, Banner } from "./ui";

/**
 * Admin sign-in.
 *
 * There is deliberately no "create account" link and no sign-up call anywhere
 * in this file. Registration is disabled twice over: there is no UI for it, and
 * the `block_public_signup` trigger in `supabase/migrations/0001_schema.sql`
 * rejects any auth user whose email is not in `admin_allowlist`. The UI
 * convention is not the security control — the database is.
 */
export function LoginForm({
  notice,
  nextPath,
  configured,
  missingVars,
}: {
  notice?: string;
  nextPath: string;
  configured: boolean;
  missingVars: string[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!configured || loading) return;

    setLoading(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();

    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !data.user) {
      // One message for both "no such user" and "wrong password" so the form
      // cannot be used to enumerate which email addresses exist.
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    // A successful password check is not yet proof of admin rights. Ask the
    // database, and sign out immediately if the flag is not set.
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      setError("This account is not the portfolio owner.");
      setLoading(false);
      return;
    }

    // `refresh()` re-runs the server layout, which performs the real check.
    router.replace(nextPath);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Portfolio CMS
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Sign in to manage your portfolio.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-navy-800/70 p-6 space-y-5">
          {!configured && (
            <Banner tone="error">
              <p className="font-semibold">Supabase is not configured</p>
              <p className="mt-1 text-xs">
                Missing: <span className="font-mono">{missingVars.join(", ")}</span>
              </p>
            </Banner>
          )}

          {notice && <Banner tone="error">{notice}</Banner>}

          {error && <Banner tone="error">{error}</Banner>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" htmlFor="email">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="pl-9"
                  disabled={!configured}
                />
              </div>
            </Field>

            <Field label="Password" htmlFor="password">
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                  disabled={!configured}
                />
              </div>
            </Field>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!configured}
            >
              {loading ? "Signing in" : "Sign in"}
            </Button>
          </form>

          <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <ShieldCheck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
            <span>
              There is no public registration. Only the owner account, listed in
              the database&apos;s admin allowlist, can sign in here.
            </span>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-500 transition-colors">
            ← Back to the portfolio
          </Link>
        </p>
      </div>
    </div>
  );
}
