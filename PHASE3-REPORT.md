# Phase 3 Report — Supabase Backend, Auth, Storage & Admin CMS

Project: personal portfolio (Next.js 14 App Router, TypeScript, Tailwind)
Status: **complete — verified locally; live Supabase project setup remains a manual step**

---

## 1. What was built

Phase 3 replaces the hard-coded content of Phase 2 with a Supabase-backed data
layer and adds a private admin CMS, without changing the public design.

| Area | Delivered |
| --- | --- |
| Database | 7 tables, indexes, `updated_at` triggers, `is_admin()`, `reorder_items()` |
| Auth | Email+password sign-in, allowlist-gated signup, cookie refresh, `/admin` protection |
| RLS | Row Level Security on every table, public-read / admin-write, verified by a 61-assertion suite |
| Storage | `project-images` bucket, public read, admin write, MIME- and size-restricted |
| Admin CMS | Login, dashboard, and CRUD managers for projects, skills, experience, certifications, messages, settings |
| Contact | Zod validation, honeypot + heuristics, per-IP rate limit, graceful 503 when unconfigured |
| Resilience | Every public read falls back to bundled static content when Supabase is unreachable |

No Express server and no additional runtime were introduced — Next.js talks to
Supabase directly.

---

## 2. Supabase setup (manual, one time)

Documented in `supabase/README.md`:

1. Create a project at <https://supabase.com/dashboard>.
2. `cp .env.example .env.local` and fill in the three values from
   **Project Settings → API**.
3. Run the four migrations in order via the SQL Editor (or `supabase db push`).
4. Create the owner user in **Authentication → Users → Add user** (auto-confirm
   on). The `on_auth_user_created` trigger creates the `profiles` row and sets
   `is_admin` from the allowlist, so the account is an admin on first login.
5. Sign in at `/admin/login`.

Sign-up is blocked in three independent layers: a `before insert` trigger on
`auth.users` (the control that actually matters, because `/auth/v1/signup` is
part of the public Supabase API), the absence of any `signUp` call in the app,
and revoked `anon` grants on `admin_allowlist`.

---

## 3. Database schema

| Table | Purpose | Public read | Public write |
| --- | --- | --- | --- |
| `profiles` | 1:1 with `auth.users`, `is_admin`, `is_public` | `is_public` rows | none |
| `projects` | Portfolio projects, `slug`, `featured`, `published`, `display_order` | published | none |
| `skills` | Skill groups with category/name/level | published | none |
| `experience` | Education & leadership entries | published | none |
| `certifications` | Certifications | published | none |
| `achievements` | Achievement highlights | published | none |
| `contact_messages` | Form submissions, `read`, `spam` | **no grants** | anon `INSERT` only |
| `admin_allowlist` | Emails permitted to register as admin | none | none |

`admin_allowlist` has RLS enabled with **no policies** and all grants revoked, so
it is unreachable from the client API entirely.

Helper objects: `public.is_admin()`, `public.handle_new_user()`,
`public.block_public_signup()`, `public.protect_profile_admin_flag()`, and
`public.reorder_items(table, ids)` — a `SECURITY INVOKER` RPC that whitelists its
target table and fails closed (0 rows) for non-admins rather than raising.

Key constraints: `contact_messages` permits anonymous inserts only with
`spam = false`; `profiles.is_admin` is writable only by the service role or by
someone already an admin (anti-self-promotion trigger); the signup block runs
before insert on `auth.users`.

---

## 4. Row Level Security

- Public visitors (`anon`) read published content only, and can submit a contact
  message. They cannot read messages, read or write the allowlist, or write any
  content table.
- Signed-in non-admins read published content; every write affects 0 rows; they
  cannot self-promote to `is_admin`, upload, or reorder.
- Admins get full CRUD on the five content tables, plus message
  read/mark/delete and storage upload/delete.
- Unpublished rows vanish for `anon` but remain visible to the admin.
- Storage: public read on `project-images`; insert/update/delete gated on
  `public.is_admin()`.

The verification suite asserts **effect, not just errors**: `INSERT` raises when
RLS blocks it, but `UPDATE`/`DELETE` quietly affect 0 rows, so those assertions
check row counts. A suite that only checked for errors would report false
confidence.

---

## 5. Authentication

- `@supabase/ssr` cookie handling in `src/lib/supabase/server.ts` and
  `src/lib/supabase/client.ts`.
- `src/middleware.ts` refreshes the Supabase auth cookie on every request and
  protects `/admin`, leaving `/admin/login` reachable.
- Admin CMS operations deliberately use the **authenticated anon-key client**,
  not the service-role client, so every admin write is still subject to RLS.
- Service-role credentials live only in `src/lib/supabase/env.server.ts`, which
  imports `server-only` — the build fails loudly if it ever reaches a client
  bundle. It is used solely for contact-form spam scoring.
- Unauthenticated or non-admin visitors are redirected to
  `/admin/login?reason=not-configured|not-admin`, which renders a specific
  explanation instead of a generic failure.
- All `/admin/*` pages are dynamically rendered, so auth state is never cached
  or baked in at build time (confirmed: every admin route is `ƒ`, never `○`).

---

## 6. Storage

`project-images` is a public-read bucket limited to 5 MB and image MIME types.
Writes are gated on `public.is_admin()` via `storage.objects` policies. Uploads
happen from the project form; `projects.image_url` stores only the object path,
so the database never carries third-party URLs.

---

## 7. Admin routes

| Route | Purpose |
| --- | --- |
| `/admin/login` | Email+password sign-in, reason-aware messaging |
| `/admin` | Counts, recent messages, quick links |
| `/admin/projects` | List, create, edit, delete, feature/publish, reorder, image upload |
| `/admin/skills` | Category-grouped CRUD with levels |
| `/admin/experience` | Education/leadership CRUD, reorderable |
| `/admin/certifications` | CRUD |
| `/admin/messages` | Read/unread, mark read, delete |
| `/admin/settings` | Public profile: name, headline, bio, contact links, visibility |

Components live in `src/components/admin/` (`AdminShell`, `LoginForm`,
`DashboardOverview`, `ProjectForm`, `ProjectManager`, `SkillManager`,
`ExperienceManager`, `CertificationManager`, `MessageManager`,
`SettingsManager`, `useCollection`, `ui`). Managers are client components that
share one `useCollection` hook; pages stay server-rendered for auth.

---

## 8. Files changed

**Added — Supabase layer**
`supabase/migrations/0001_schema.sql`, `0002_rls.sql`, `0003_storage.sql`,
`0004_seed.sql`, `supabase/README.md`, `supabase/tests/rls_verification.sql`,
`supabase/tests/local_supabase_shim.sql`,
`src/lib/supabase/{env.ts, env.server.ts, database.types.ts, public.ts,
client.ts, server.ts, admin.ts, session.ts}`,
`src/lib/data/{portfolio.ts, mappers.ts, admin.ts}`,
`src/lib/validation/schemas.ts`, `src/lib/storage/project-images.ts`,
`src/middleware.ts`, `src/app/robots.ts`, `src/app/loading.tsx`,
`src/app/error.tsx`, `.env.example`, `.eslintrc.js`

**Added — admin**
`src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx`,
`src/app/admin/(dashboard)/{layout,page}.tsx` and
`{projects,skills,experience,certifications,messages,settings}/page.tsx`,
plus the 11 files in `src/components/admin/`

**Modified**
`src/app/page.tsx` (now a Server Component using `getPortfolioData()`),
`src/app/api/contact/route.ts`, `src/app/layout.tsx`, `src/app/sitemap.ts`,
`src/components/layout/{PortfolioShell,Navbar,MobileMenu}.tsx`,
`src/components/sections/*` (data-driven with static fallbacks and empty
states), `src/components/ui/{ContactForm,Badge,HeroVisual}.tsx`,
`src/components/providers/LenisProvider.tsx`, `src/data/{projects,leadership}.ts`,
`src/types/index.ts`, `src/lib/utils.ts`, `package.json`, `package-lock.json`,
`README.md`

**Dependency changes:** added `@supabase/supabase-js@2.117.2`,
`@supabase/ssr@0.12.7`, `server-only@0.0.1`, `zod@4.6.5`.

---

## 9. Environment variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | RLS-constrained client key |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses RLS; contact spam scoring only |

`.env.local` and `.env` are git-ignored. Never prefix the service-role key with
`NEXT_PUBLIC_`.

---

## 10. Verification results

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | pass |
| `npx eslint --ext .ts,.tsx src/` | pass |
| `npm run build` | pass — 14 routes; `/` 309 kB / 405 kB first load; all `/admin/*` dynamic |
| Migration apply (shim + 0001→0004) on PostgreSQL 16 | pass, no errors |
| Migration re-apply (idempotency) | pass, no duplicates created |
| `supabase/tests/rls_verification.sql` | **61 passed, 0 failed, 0 errors** |
| Playwright public flow | 9/9 |
| Playwright responsive (9 widths, 320→1920) | 47/47 |
| Playwright accessibility | 9/9 |
| Admin routes with Supabase unconfigured | all redirect to `/admin/login?reason=not-configured` |
| Admin routes with fake credentials configured | unauthenticated requests redirect to login |
| Public page with Supabase unreachable | 200, static fallback content, no long delay |
| Contact API | 400 missing fields · 400 invalid email · 400 honeypot/spam · 503 unconfigured · 429 rate limited |

Three defects were found and fixed during this verification round:

1. The verification harness contained a stray `$` that made one assertion a
   syntax error, so the anonymous-profile-visibility check was silently skipped.
2. Section 5 tried to create a signed-in non-admin user through the signup path,
   which the signup block correctly rejects — the harness now suspends the
   trigger for that single fixture insert and asserts it is re-enabled
   immediately afterwards.
3. Two build artifacts (`.next/package.json`, `.next/cache/.tsbuildinfo`) were
   tracked in git despite `.next` being ignored; they are now untracked.

---

## 11. Security notes

- The service-role key cannot reach the browser: it lives in a `server-only`
  module, and a build failure results if that ever changes.
- Admin writes go through the anon-key client under RLS, so a bug in the CMS
  cannot escalate past the policies.
- Public registration is blocked at the database level, not in the UI.
- `is_admin` cannot be self-assigned; the allowlist is unreachable from the API.
- Contact inserts are anonymous but capped per IP, honeypot-checked, and cannot
  set `spam` themselves; spam and legitimate submissions return identical
  responses so the endpoint is not a spam oracle.
- Public reads are anonymous and read-only, cached for 300 seconds.

---

## 12. Content decisions

Phase 2's unsupported claims were removed rather than invented around. The
public project list contains only SmartAttend and KrishiFleet AI; HackathonOS and
unverifiable external/image URLs were dropped. Profile facts come from the
resume: Jyotish Kumar, Bokaro, Jharkhand; B.Tech CST at SAGE University / Indore
– Alta School of Technology, Aug 2025–Present, CGPA 7.8.

---

## 13. Known limitations / remaining work

1. **A live Supabase project is still required** to exercise real authentication,
   admin CRUD, and uploads end to end. Everything verifiable offline has been
   verified; everything requiring hosted infrastructure has not.
2. **True WebGL rendering is unverified in headless Chromium.** The fallback
   gradient path, reduced-motion path, and visibility-based rendering were all
   confirmed, but the actual Three.js scene needs a real browser to confirm.
3. `next@16.3.6` was **not** adopted. It requires React 19, which conflicts with
   the installed `@react-three/fiber@8` / `@react-three/drei@9` pair. Upgrading
   means upgrading the 3D stack together.
4. `HeroVisual` renders 600 particles on desktop and 150 on mobile; further
   reduction would be needed for very low-end devices.
5. The verification suite is destructive — it inserts, updates, and deletes rows
   — so it should only be run against a scratch project or with the seed state
   reset afterwards.
6. Changes are staged but **not committed**, per the standing instruction to
   avoid commits unless requested.
