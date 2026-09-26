# Supabase setup (Phase 3)

Everything below runs against a Supabase project. No Express server, no extra
runtime — the Next.js app talks to Supabase directly.

## 1. Create the project and fill in `.env.local`

1. Create a project at <https://supabase.com/dashboard>.
2. Copy `.env.example` to `.env.local` and fill in the three values from
   **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the `anon` / publishable key)
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
3. Restart the dev server. Without these the site still works — it falls back
   to the bundled content in `src/data/` — but `/admin` cannot authenticate and
   the contact form returns 503.

## 2. Apply the migrations, in order

Open **SQL Editor** and run each file. They are written to be re-runnable.

| Order | File | What it does |
| --- | --- | --- |
| 1 | `migrations/0001_schema.sql` | Tables, indexes, `updated_at` triggers, `is_admin()`, the auth → profile trigger, and the public-signup block |
| 2 | `migrations/0002_rls.sql` | Grants, `enable row level security` on every table, all policies, `reorder_items()` |
| 3 | `migrations/0003_storage.sql` | The `project-images` bucket and its policies |
| 4 | `migrations/0004_seed.sql` | Admin allowlist + documented portfolio content |

Doing this through `supabase db push` / the Supabase CLI works too — the files
are plain SQL with no CLI-specific directives.

## 3. Create the owner account

1. Confirm the allowlist contains your email (seeded in `0004_seed.sql`):
   ```sql
   select * from public.admin_allowlist;
   ```
   To use a different address:
   ```sql
   insert into public.admin_allowlist (email) values ('you@example.com');
   ```
2. Create the user in **Authentication → Users → Add user**. Use email +
   password and leave "Auto Confirm User" on, or confirm the email from the
   dashboard.
3. Sign in at `/admin/login`.

The `on_auth_user_created` trigger creates the matching `profiles` row and sets
`is_admin` from the allowlist, so the account is an admin from the first login.

## 4. No public registration

Sign-up is blocked in three independent places, so removing the UI would not be
enough on its own:

1. **Database** — a `before insert` trigger on `auth.users` raises unless the
   email is in `admin_allowlist`. This is the control that matters: the
   `/auth/v1/signup` endpoint is part of the public Supabase API.
2. **No UI** — nothing in this app calls `signUp`, and `/admin/login` has no
   registration link.
3. **Grants** — `anon` cannot touch `admin_allowlist` at all.

If you ever want open sign-up, drop the trigger:

```sql
drop trigger on_auth_user_before_insert on auth.users;
```

## 5. RLS verification

`tests/rls_verification.sql` contains a runnable suite (48 assertions) covering
every case in the spec. Run it in the Supabase SQL editor. It is **destructive** —
it inserts, updates and deletes rows — so run it against a scratch project, or
accept that it will churn your content.

It needs a genuinely empty state for the seed-count assertions, so the simplest
workflow is: run the four migrations on a fresh project, then run the suite once.

```bash
# Locally, against a plain PostgreSQL, apply the shim first so auth.* / storage.*
# exist, then the migrations, then the suite:
psql -f supabase/tests/local_supabase_shim.sql
psql -f supabase/migrations/0001_schema.sql
psql -f supabase/migrations/0002_rls.sql
psql -f supabase/migrations/0003_storage.sql
psql -f supabase/migrations/0004_seed.sql
psql -f supabase/tests/rls_verification.sql
```

What the suite covers:

| Section | Assertions |
| --- | --- |
| Seed data | Correct row counts; no invented project URLs; HackathonOS absent |
| Users | `profiles` row auto-created; allowlist drives `is_admin` |
| Signup | Non-allowlisted signup **rejected**, allowlisted signup allowed |
| Anonymous | Reads published content; cannot read messages or the allowlist; cannot write content; **can** submit a contact message; cannot set `spam` itself |
| Non-admin | Reads published content; every write affects 0 rows; cannot self-promote to admin; cannot upload; cannot reorder |
| Admin | Full CRUD on all five content tables; can read/mark/delete messages; can upload; `reorder_items` works and rejects a non-whitelisted table |
| Publishing | Unpublished rows vanish for `anon`, remain visible to the admin |
| Profile | Public row readable by `anon`; not writable |

The suite asserts **effect, not just errors**. `INSERT` raises when RLS blocks
it, but `UPDATE`/`DELETE` quietly affect 0 rows — so the assertions check the
row count. A suite that only checked for errors would report false confidence.

Last run against PostgreSQL 16: **48 passed, 0 failed.**

## 6. Storage

`project-images` is a public-read bucket (5 MB, images only). Writes are gated
on `public.is_admin()` through `storage.objects` policies. Images are uploaded
from the project form; the `projects.image_url` column stores only the object
path.

## 7. What happens when Supabase is down

By design, nothing breaks:

- `src/lib/data/portfolio.ts` falls back to the bundled arrays in `src/data/`
  and reports why. The public page renders.
- `/api/contact` returns 503 with the owner's email address so the form can say
  something useful instead of pretending the message was sent.
- `/admin/login` explains which environment variable is missing.
