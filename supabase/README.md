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

Run these from the SQL editor. The `set local role` trick impersonates each
caller inside the same session, so the policies are exercised for real.

```sql
-- 1. Anonymous: can read published portfolio content
set local role anon;
select count(*) from projects;      -- > 0
select count(*) from contact_messages;  -- 0 rows, and no error: no SELECT policy
reset role;

-- 2. Anonymous: can submit a contact message
set local role anon;
insert into contact_messages (name, email, subject, message)
values ('Test', 'test@example.com', 'Hello', 'This is a test message.');
reset role;

-- 3. Anonymous: cannot write portfolio content
set local role anon;
insert into projects (title, slug, description)
values ('Nope', 'nope', 'should be rejected');  -- ERROR: new row violates row-level security
reset role;

-- 4. Anonymous: cannot read the allowlist
set local role anon;
select * from admin_allowlist;  -- ERROR: permission denied for table admin_allowlist
reset role;
```

Then sign in as the admin in the dashboard and confirm the same write succeeds;
and create a second (allowlisted) non-admin user to confirm their writes are
rejected while their reads of published content succeed.

The admin CLI check is quicker still — it just confirms the policies exist and
are not permissive by accident:

```sql
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Every portfolio table should show a `*_select_published` policy with
`published = true or is_admin()`, and `contact_messages` should have no policy
whose `roles` include `anon` for `SELECT`.

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
