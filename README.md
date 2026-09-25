# Jyotish Kumar — Developer Portfolio

A full-stack personal developer portfolio built with **Next.js 14 (App Router)**,
**TypeScript**, **Tailwind CSS**, **GSAP + ScrollTrigger**, **React Three Fiber**,
and **Supabase** (PostgreSQL, Auth, Row Level Security, Storage).

The public site is server-rendered from Supabase with a bundled static fallback,
so it keeps working when the backend is unreachable. Portfolio content is managed
through a private admin CMS at `/admin`.

![Portfolio Preview](/public/my_pic2.jpeg)

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in the three Supabase values
npm run dev
```

Without `.env.local` the site still runs — it serves the content bundled in
`src/data/`. The admin CMS and the contact form need the real values.

### Applying the database

Run the four files in `supabase/migrations/` in order via the Supabase SQL
editor. Full walkthrough, including how to create the owner account and how to
verify the RLS policies, is in **[`supabase/README.md`](./supabase/README.md)**.

| Order | File | Contents |
| --- | --- | --- |
| 1 | `0001_schema.sql` | Tables, indexes, triggers, `is_admin()`, the public-signup block |
| 2 | `0002_rls.sql` | Grants, RLS on every table, all policies, `reorder_items()` |
| 3 | `0003_storage.sql` | `project-images` bucket + storage policies |
| 4 | `0004_seed.sql` | Admin allowlist + documented portfolio content |

---

## Architecture

```
Browser
  ├── public site ──────────► Supabase (anon key, published-only reads)
  └── /admin ───────────────► Supabase (anon key + admin session, RLS-checked)
                                     ▲
  /api/contact ──► Route Handler ────┘ (service role, server only)
```

There is no separate backend. Supabase provides PostgreSQL, Auth, Storage and
RLS; Next.js Route Handlers cover the one operation that needs server-only
privilege (scored contact-form intake).

### Public site

`src/app/page.tsx` is a Server Component. It calls `getPortfolioData()`, which
reads through a cookie-less anon client, and hands plain props to
`PortfolioShell`. Each section keeps its original view model (`Project`,
`Skill`, `LeadershipActivity`, `Certification`, `Achievement`); the translation
from DB rows lives in one place, `src/lib/data/mappers.ts`.

If Supabase is unconfigured, unreachable, or erroring, the loader falls back to
the arrays in `src/data/` and records a warning. An empty table is *not* treated
as a failure — sections render an empty state, so unpublishing something in the
CMS actually hides it.

### Admin CMS

Route group `src/app/admin/(dashboard)/` is guarded by `requireAdmin()`, which
revalidates the session and checks `profiles.is_admin`. `src/middleware.ts`
refreshes auth cookies and redirects anonymous visitors.

Every read and write the CMS performs goes through the **anon key plus the
admin's own session**. There is no service-role path in the browser, so the UI
has exactly the privileges an attacker would — which is the point. RLS is the
authorization boundary; the route guard is only UX.

```
/admin/login           email + password, no registration
/admin                 counters + recent messages
/admin/projects        CRUD, reorder, featured, image upload
/admin/skills          CRUD, reorder, recategorise
/admin/experience      CRUD, reorder
/admin/certifications  CRUD, reorder
/admin/messages        read/unread/delete, spam filter
/admin/settings        profile, visibility, backend status
```

---

## Security model

| Concern | Control |
| --- | --- |
| Public reads | `published = true` policy; draft rows are invisible to `anon` |
| Portfolio writes | `with check (public.is_admin())` on every table |
| Contact messages | `anon` may INSERT only; there is **no** `anon` SELECT policy |
| Admin flag | `profiles_protect_admin` trigger blocks self-promotion |
| Registration | `before insert` trigger on `auth.users` rejects non-allowlisted emails |
| Service role key | `server-only` import; no `NEXT_PUBLIC_` prefix; one call site |
| Route guards | Middleware + server layout; both treated as convenience, not control |

The three layers are independent on purpose. Removing the admin UI would not
remove the RLS policies; bypassing the UI would not grant a write.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Server Component: fetches portfolio data
│   ├── loading.tsx / error.tsx   # Route-level loading and error boundaries
│   ├── api/contact/route.ts      # Validated, rate-limited, spam-scored intake
│   └── admin/
│       ├── layout.tsx            # Bare wrapper (login lives here, so no guard)
│       ├── login/page.tsx
│       └── (dashboard)/          # Guarded group: force-dynamic + requireAdmin
├── components/
│   ├── layout/PortfolioShell.tsx # Client shell; owns the resume modal state
│   ├── sections/                 # Public sections, now data-driven via props
│   ├── admin/                    # AdminShell, CRUD managers, forms, UI kit
│   └── ui/                       # Existing public UI primitives
├── lib/
│   ├── supabase/                 # env, typed clients, session helpers
│   ├── data/                     # portfolio.ts (public) · admin.ts (CRUD)
│   ├── storage/                  # project image upload/delete
│   └── validation/schemas.ts     # Zod schemas shared by API and forms
├── middleware.ts                 # Admin auth refresh + redirect
└── data/                         # Bundled fallback content

supabase/migrations/              # Schema, RLS, storage, seed
```

---

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint (next/core-web-vitals)
```

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | anon key; RLS-limited |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Contact intake; bypasses RLS |

`.env` and `.env.local` are git-ignored. Never commit real values.

---

## Known issues

- **`next@14.2.35` has open advisories** (1 critical, several high) per
  `npm audit`. The only patched line is `next@16`, which requires React 19 and
  would break `@react-three/fiber@8` / `@react-three/drei@9`. Left alone
  deliberately; see the Phase 3 report.
- The resume PDF referenced at `/resume.pdf` is not in `public/`.
- Public copy (hero headline, about story, social links) still lives in
  `src/data/personal.ts`; only list content is database-driven.
