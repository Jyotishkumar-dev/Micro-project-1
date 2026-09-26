-- ============================================================================
-- Phase 3 · Migration 0003 — Storage
--
-- Project images live in Supabase Storage, never as bytea in Postgres. The
-- projects row stores only the object path (or an absolute URL).
--
-- Bucket is public-read so the public portfolio can render images with a plain
-- <img src>, but writes are admin-only through storage.objects RLS.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  5242880, -- 5 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- storage.objects policies
-- ---------------------------------------------------------------------------
drop policy if exists "project_images_public_read" on storage.objects;
create policy "project_images_public_read"
  on storage.objects for select
  using (bucket_id = 'project-images');

drop policy if exists "project_images_admin_insert" on storage.objects;
create policy "project_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_admin_update" on storage.objects;
create policy "project_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_admin_delete" on storage.objects;
create policy "project_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
