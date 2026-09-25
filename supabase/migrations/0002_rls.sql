-- ============================================================================
-- Phase 3 · Migration 0002 — Row Level Security
--
-- Rule of thumb applied throughout:
--   * ENABLE ROW LEVEL SECURITY on every table (RLS off = table-wide access for
--     whatever role happens to hold a grant, which is exactly the trap to avoid).
--   * Public/anon gets SELECT on published content and INSERT on nothing else.
--   * Writes to portfolio content are gated on public.is_admin(), which is a
--     SECURITY DEFINER read of the caller's own profiles row.
--   * contact_messages is insert-only for the public and admin-only for reads.
--   * admin_allowlist gets RLS enabled and deliberately NO policies, so it is
--     reachable only by the service role / SQL editor.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Explicit grants (belt-and-braces on top of Supabase's default privileges,
-- so a fresh project cannot accidentally hand out access)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.projects, public.skills, public.experience,
                 public.certifications, public.achievements to anon, authenticated;
grant insert, update, delete on public.projects, public.skills, public.experience,
                 public.certifications, public.achievements to authenticated;

grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;

-- The allowlist is never exposed to any web role. No grants, no policies.
revoke all on public.admin_allowlist from anon, authenticated;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Public sees only the owner's public row. Signed-in users additionally see
-- their own row. Admins see everything.
create policy "profiles_select_public_or_self_or_admin"
  on public.profiles
  for select
  using (is_public = true or auth.uid() = id or public.is_admin());

-- Self-service profile edit. The is_admin flag is neutralised by the
-- profiles_protect_admin trigger from 0001, so this cannot be used to escalate.
create policy "profiles_update_self"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- admin_allowlist — enabled, intentionally policy-free
-- ---------------------------------------------------------------------------
alter table public.admin_allowlist enable row level security;

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;

create policy "projects_select_published"
  on public.projects for select
  using (published = true or public.is_admin());

create policy "projects_admin_insert"
  on public.projects for insert
  with check (public.is_admin());

create policy "projects_admin_update"
  on public.projects for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "projects_admin_delete"
  on public.projects for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------------
alter table public.skills enable row level security;

create policy "skills_select_published"
  on public.skills for select
  using (published = true or public.is_admin());

create policy "skills_admin_insert"
  on public.skills for insert
  with check (public.is_admin());

create policy "skills_admin_update"
  on public.skills for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "skills_admin_delete"
  on public.skills for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- experience
-- ---------------------------------------------------------------------------
alter table public.experience enable row level security;

create policy "experience_select_published"
  on public.experience for select
  using (published = true or public.is_admin());

create policy "experience_admin_insert"
  on public.experience for insert
  with check (public.is_admin());

create policy "experience_admin_update"
  on public.experience for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "experience_admin_delete"
  on public.experience for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------------
alter table public.certifications enable row level security;

create policy "certifications_select_published"
  on public.certifications for select
  using (published = true or public.is_admin());

create policy "certifications_admin_insert"
  on public.certifications for insert
  with check (public.is_admin());

create policy "certifications_admin_update"
  on public.certifications for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "certifications_admin_delete"
  on public.certifications for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- achievements
-- ---------------------------------------------------------------------------
alter table public.achievements enable row level security;

create policy "achievements_select_published"
  on public.achievements for select
  using (published = true or public.is_admin());

create policy "achievements_admin_insert"
  on public.achievements for insert
  with check (public.is_admin());

create policy "achievements_admin_update"
  on public.achievements for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "achievements_admin_delete"
  on public.achievements for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- contact_messages
--
-- Note the asymmetry: there is deliberately NO select policy for anon, so
-- stored messages are never readable by a visitor. The public can only
-- append, and only rows that are not pre-flagged as spam.
-- ---------------------------------------------------------------------------
alter table public.contact_messages enable row level security;

create policy "contact_messages_public_insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (spam = false);

create policy "contact_messages_admin_select"
  on public.contact_messages for select
  using (public.is_admin());

create policy "contact_messages_admin_update"
  on public.contact_messages for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "contact_messages_admin_delete"
  on public.contact_messages for delete
  using (public.is_admin());
