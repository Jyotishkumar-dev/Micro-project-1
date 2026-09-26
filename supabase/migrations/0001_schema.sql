-- ============================================================================
-- Phase 3 · Migration 0001 — Core schema
-- Target: Supabase (PostgreSQL 15+)
-- Run order: 0001 → 0002 (RLS) → 0003 (storage) → 0004 (seed)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Generic helpers
-- ---------------------------------------------------------------------------

-- Keeps `updated_at` honest without relying on application code.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- admin_allowlist — gate for "the only account(s) allowed to exist"
--
-- RLS is enabled in 0002 with NO policies, which means anon and authenticated
-- roles can neither read nor write this table. Only the service role and the
-- SQL editor (owner) can touch it. That is what makes admin a grant from the
-- database side rather than a client-side flag someone can flip.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_allowlist (
  email       text primary key,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- profiles — 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  headline    text,
  bio         text,
  avatar_url  text,
  resume_url  text,
  location    text,
  socials     jsonb not null default '{}'::jsonb,
  -- Only the owner's public-facing row is world-readable (see RLS in 0002).
  is_public   boolean not null default false,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (lower(email));

-- ---------------------------------------------------------------------------
-- is_admin — single source of truth for "is this request an admin?"
--
-- Declared here, immediately after `profiles`, because a `language sql` body is
-- parsed and relation-checked at CREATE time. Defining it earlier, before the
-- table exists, is a hard error.
--
-- SECURITY DEFINER is required: the function reads `public.profiles`, whose RLS
-- would otherwise recurse back into this function. `search_path` is pinned so a
-- malicious temp schema cannot shadow `profiles` or `auth.uid()`.
--
-- A row is admin only if BOTH conditions hold:
--   1. the caller is signed in (auth.uid() is not null), and
--   2. the caller owns a profiles row explicitly flagged is_admin.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Portfolio content tables
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  tagline          text,
  description      text not null default '',
  category         text,
  status           text,
  problem          text,
  solution         text,
  my_contribution  text,
  technologies     text[] not null default '{}',
  case_study       jsonb not null default '{}'::jsonb,
  github_url       text,
  live_url         text,
  -- Supabase Storage object path (or absolute URL). No binary data in Postgres.
  image_url        text,
  featured         boolean not null default false,
  published        boolean not null default true,
  display_order    integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists projects_display_order_idx on public.projects (display_order);

create table if not exists public.skills (
  id             uuid primary key default gen_random_uuid(),
  category       text not null,
  name           text not null,
  context        text,
  highlight      boolean not null default false,
  published      boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint skills_category_name_key unique (category, name)
);

create index if not exists skills_display_order_idx on public.skills (display_order);

create table if not exists public.experience (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  -- Natural key: lets the seed re-run idempotently and gives the CMS stable URLs.
  slug           text not null unique,
  organization   text,
  type           text not null default 'leadership',
  role           text,
  start_date     date,
  end_date       date,
  is_current     boolean not null default false,
  description    text not null default '',
  highlights     text[] not null default '{}',
  published      boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists experience_display_order_idx on public.experience (display_order);

create table if not exists public.certifications (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  organization    text,
  issue_date      date,
  credential_url  text,
  badge           text,
  description     text not null default '',
  details         text[] not null default '{}',
  published       boolean not null default true,
  display_order   integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists certifications_display_order_idx on public.certifications (display_order);

create table if not exists public.achievements (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text not null unique,
  description    text not null default '',
  metric         text,
  link           text,
  type           text,
  published      boolean not null default true,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists achievements_display_order_idx on public.achievements (display_order);

-- ---------------------------------------------------------------------------
-- contact_messages
--
-- Length CHECKs double as server-side validation so a raw PostgREST insert
-- (bypassing the Next.js route) still cannot store junk.
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 2 and 120),
  email         text not null check (char_length(email) between 3 and 254),
  subject       text not null check (char_length(subject) between 2 and 200),
  project_type  text,
  message       text not null check (char_length(message) between 10 and 5000),
  read          boolean not null default false,
  -- Server-side spam verdict. The public INSERT policy requires spam = false,
  -- so a caller cannot pre-mark its own submission as reviewed.
  spam          boolean not null default false,
  user_agent    text,
  created_at    timestamptz not null default now()
);

create index if not exists contact_messages_read_idx on public.contact_messages (read, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

drop trigger if exists experience_set_updated_at on public.experience;
create trigger experience_set_updated_at
  before update on public.experience
  for each row execute function public.set_updated_at();

drop trigger if exists certifications_set_updated_at on public.certifications;
create trigger certifications_set_updated_at
  before update on public.certifications
  for each row execute function public.set_updated_at();

drop trigger if exists achievements_set_updated_at on public.achievements;
create trigger achievements_set_updated_at
  before update on public.achievements
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth integration
-- ---------------------------------------------------------------------------

-- Creates (or repairs) the matching profiles row on every new auth user, and
-- mirrors the admin_allowlist decision into is_admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed boolean;
begin
  select exists (
    select 1 from public.admin_allowlist a where lower(a.email) = lower(new.email)
  ) into allowed;

  insert into public.profiles (id, email, full_name, avatar_url, is_admin)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    allowed
  )
  on conflict (id) do update
    set email      = excluded.email,
        is_admin   = public.profiles.is_admin or excluded.is_admin,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Hard, database-level block on public registration.
--
-- This is the only real way to guarantee "signup is not publicly available",
-- because the /auth/v1/signup endpoint is part of the public Supabase API and
-- cannot be switched off per-client. Any auth.users INSERT whose email is not
-- allowlisted is rejected.
--
-- Operational note: to add another admin, insert their email into
-- public.admin_allowlist FIRST, then invite/sign them up. For the owner
-- account, 0004_seed.sql already seeds the allowlist.
create or replace function public.block_public_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.admin_allowlist a where lower(a.email) = lower(new.email)
  ) then
    raise exception 'Public registration is disabled for this portfolio.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_before_insert on auth.users;
create trigger on_auth_user_before_insert
  before insert on auth.users
  for each row execute function public.block_public_signup();

-- ---------------------------------------------------------------------------
-- Anti-self-promotion guard
--
-- `profiles_self_update` in 0002 deliberately lets a signed-in user edit their
-- own row. Without this trigger that user could simply set is_admin = true and
-- escalate themselves, so the flag is writable only by the service role or by
-- someone who is already an admin.
-- ---------------------------------------------------------------------------
create or replace function public.protect_profile_admin_flag()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_admin is distinct from old.is_admin then
    if auth.role() <> 'service_role' and not public.is_admin() then
      raise exception 'Only the service role can grant or revoke admin access.'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_admin on public.profiles;
create trigger profiles_protect_admin
  before update on public.profiles
  for each row execute function public.protect_profile_admin_flag();
