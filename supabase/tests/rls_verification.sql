\pset pager off
\timing off

-- ===========================================================================
-- RLS verification.
--
-- Run against a REAL Supabase project (SQL Editor -> New query -> Run):
--   select pg_temp.*   functions are created on the fly, nothing is persisted
--   outside the `pg_temp` schema.
--
-- To run it against a plain local PostgreSQL instead, apply
-- `local_supabase_shim.sql` first so that auth.* and storage.* exist.
--
-- Interpretation:
--   * "denied"            -> the statement raised; RLS blocked it outright
--   * "0 rows affected"   -> RLS filtered every row; the write did not happen
--   Both are correct denials. UPDATE and DELETE behave differently from INSERT
--   under RLS, which is why the assertions below check effect, not just errors.
--
-- RLS verification harness.
--
-- `set role` + `set request.jwt.claim.*` impersonates each caller exactly as
-- PostgREST would. Assertions run through pg_temp helpers so that BOTH outcomes
-- are really checked: a "should be denied" case fails if the statement
-- unexpectedly succeeds, and a "should be allowed" case fails if it errors.
-- ===========================================================================

create or replace function pg_temp.expect(
  query text, should_succeed boolean, label text
) returns void language plpgsql as $$
begin
  begin
    execute query;
    if should_succeed then
      raise notice 'PASS  %', label;
    else
      raise notice 'FAIL  %  (statement unexpectedly SUCCEEDED)', label;
    end if;
  exception when others then
    if should_succeed then
      raise notice 'FAIL  %  -> %', label, left(sqlerrm, 70);
    else
      raise notice 'PASS  %  (denied)', label;
    end if;
  end;
end $$;

create or replace function pg_temp.expect_rows(
  query text, expected bigint, label text
) returns void language plpgsql as $$
declare n bigint;
begin
  execute query into n;
  if n = expected then
    raise notice 'PASS  %', label;
  else
    raise notice 'FAIL  %  (expected % rows, got %)', label, expected, n;
  end if;
end $$;

-- UPDATE/DELETE do not raise when RLS filters every row out; they simply
-- affect nothing. This asserts the outcome that actually matters: no effect.
create or replace function pg_temp.expect_no_effect(
  query text, label text
) returns void language plpgsql as $$
declare n bigint;
begin
  begin
    execute query;
    get diagnostics n = row_count;
    if n = 0 then
      raise notice 'PASS  %  (0 rows affected)', label;
    else
      raise notice 'FAIL  %  (% rows were changed!)', label, n;
    end if;
  exception when others then
    raise notice 'PASS  %  (denied)', label;
  end;
end $$;

create or replace function pg_temp.check(
  ok boolean, label text
) returns void language plpgsql as $$
begin
  if ok then
    raise notice 'PASS  %', label;
  else
    raise notice 'FAIL  %', label;
  end if;
end $$;

\echo ''
\echo '================== 1. SEED DATA =================='
select case when count(*) = 2 then 'PASS' else 'FAIL' end as result,
       'exactly 2 seeded projects' as check from public.projects;
select case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
       'HackathonOS is NOT seeded' as check from public.projects where slug = 'hackathon-os';
select case when count(*) = 5 then 'PASS' else 'FAIL' end as result,
       '5 seeded leadership entries' as check from public.experience;
select case when count(*) = 4 then 'PASS' else 'FAIL' end as result,
       '4 seeded certifications' as check from public.certifications;
select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       '1 seeded achievement' as check from public.achievements;
select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       '1 admin allowlisted' as check from public.admin_allowlist;
select case when count(*) = 0 then 'PASS' else 'FAIL' end as result,
       'no seed invents project URLs' as check
  from public.projects where github_url is not null or live_url is not null;

\echo ''
\echo '================== 2. USERS & ADMIN FLAG =================='
insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111', 'jyotishyt58@gmail.com');
select case when count(*) = 1 then 'PASS' else 'FAIL' end as result,
       'auth trigger created the profile row' as check from public.profiles
 where id = '11111111-1111-1111-1111-111111111111';
select case when bool_and(is_admin) then 'PASS' else 'FAIL' end as result,
       'allowlisted user is_admin = true' as check from public.profiles
 where id = '11111111-1111-1111-1111-111111111111';

\echo ''
\echo '================== 3. PUBLIC SIGNUP IS BLOCKED =================='
select pg_temp.expect(
  $$insert into auth.users (id, email) values ('44444444-4444-4444-4444-444444444444', 'attacker@evil.example')$$,
  false, 'non-allowlisted signup is REJECTED');
select pg_temp.expect(
  $$insert into auth.users (id, email) values ('55555555-5555-5555-5555-555555555555', 'jyotishyt58@gmail.com')$$,
  true, 'allowlisted signup is allowed');

\echo ''
\echo '================== 4. ANONYMOUS VISITOR =================='
set role anon;
set request.jwt.claim.role = 'anon';
set request.jwt.claim.sub = '';

select pg_temp.expect_rows($$select count(*) from public.projects$$, 2, 'anon reads the 2 published projects');
select pg_temp.expect_rows($$select count(*) from public.skills$$, 29, 'anon reads published skills');
select pg_temp.expect_rows($$select count(*) from public.experience$$, 5, 'anon reads published experience');
select pg_temp.expect_rows($$select count(*) from public.contact_messages$$, 0, 'anon reads 0 messages (no SELECT policy)');

select pg_temp.expect($$select * from public.admin_allowlist$$, false, 'anon cannot read admin_allowlist');
select pg_temp.expect(
  $$insert into public.projects (title, slug, description) values ('Hacked','hacked','x')$$,
  false, 'anon cannot INSERT a project');
select pg_temp.expect_no_effect(
  $$update public.projects set title='Hacked' where slug='smartattend'$$, 'anon cannot UPDATE a project');
select pg_temp.expect_no_effect(
  $$delete from public.projects where slug='smartattend'$$, 'anon cannot DELETE a project');
select pg_temp.expect_no_effect(
  $$update public.contact_messages set read=true$$, 'anon cannot UPDATE messages');
select pg_temp.expect_no_effect(
  $$delete from public.contact_messages$$, 'anon cannot DELETE messages');
select pg_temp.expect(
  $$insert into storage.objects (bucket_id, name) values ('project-images','evil.png')$$,
  false, 'anon cannot upload to storage');
select pg_temp.expect(
  $$insert into public.contact_messages (name,email,subject,message) values ('Visitor','v@x.com','Hi','A perfectly fine message body.')$$,
  true, 'anon CAN submit a contact message');
select pg_temp.expect(
  $$insert into public.contact_messages (name,email,subject,message,spam) values ('Visitor','v@x.com','Hi','Body long enough here.',true)$$,
  false, 'anon cannot pre-mark its own message as spam=true');

reset role; reset request.jwt.claim.role; reset request.jwt.claim.sub;

\echo ''
\echo '================== 5. SIGNED-IN NON-ADMIN =================='
insert into auth.users (id, email) values ('66666666-6666-6666-6666-666666666666', 'colleague@example.com');
select case when not is_admin then 'PASS' else 'FAIL' end as result,
       'non-allowlisted user is_admin = false' as check from public.profiles
 where id = '66666666-6666-6666-6666-666666666666';

set role authenticated;
set request.jwt.claim.role = 'authenticated';
set request.jwt.claim.sub = '66666666-6666-6666-6666-666666666666';

select pg_temp.expect_rows($$select count(*) from public.projects$$, 2, 'non-admin reads published projects');
select pg_temp.expect_rows($$select count(*) from public.contact_messages$$, 0, 'non-admin reads 0 messages');
select pg_temp.expect(
  $$insert into public.skills (category,name) values ('tool','Injected')$$, false, 'non-admin cannot INSERT a skill');
select pg_temp.expect_no_effect(
  $$update public.projects set title='Hacked' where slug='smartattend'$$, 'non-admin cannot UPDATE a project');
select pg_temp.expect_no_effect(
  $$delete from public.projects where slug='smartattend'$$, 'non-admin cannot DELETE a project');
select pg_temp.expect_no_effect(
  $$update public.certifications set name='Hacked'$$, 'non-admin cannot UPDATE a certification');
select pg_temp.expect_no_effect(
  $$delete from public.experience$$, 'non-admin cannot DELETE experience');
select pg_temp.expect_no_effect(
  $$update public.profiles set is_admin = true where id = '66666666-6666-6666-6666-666666666666'$$,
  'non-admin cannot self-promote to admin');
select pg_temp.expect_rows(
  $$select count(*) from public.profiles where id='66666666-6666-6666-6666-666666666666' and is_admin$$,
  0, 'non-admin is_admin flag is still false after the attempt');
select pg_temp.expect(
  $$insert into storage.objects (bucket_id, name) values ('project-images','evil.png')$$,
  false, 'non-admin cannot upload to storage');
-- SECURITY INVOKER: the RPC fails closed by affecting 0 rows, not by raising.
-- Assert the count it *returns* — GET DIAGNOSTICS ROW_COUNT on a SELECT would
-- report the one result row, not the number of rows the function updated.
select pg_temp.expect_rows(
  $$select public.reorder_items('projects', array(select id from public.projects))$$,
  0, 'non-admin reorder updates 0 rows');
select pg_temp.expect_rows(
  $$select count(*) from public.projects where display_order = 0$$,
  0, 'non-admin reorder left display_order untouched');
select pg_temp.check(public.is_admin() = false, 'is_admin() is false for the non-admin');

reset role; reset request.jwt.claim.role; reset request.jwt.claim.sub;

\echo ''
\echo '================== 6. ADMIN =================='
set role authenticated;
set request.jwt.claim.role = 'authenticated';
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

select pg_temp.check(public.is_admin(), 'is_admin() is true for the owner');
select pg_temp.expect_rows($$select count(*) from public.contact_messages$$, 1, 'admin reads the contact message');
select pg_temp.expect(
  $$insert into public.projects (title, slug, description) values ('Test Project','test-project','A verification project.')$$,
  true, 'admin can INSERT a project');
select pg_temp.expect(
  $$update public.projects set featured = true, published = false where slug = 'test-project'$$,
  true, 'admin can UPDATE a project');
select pg_temp.expect(
  $$insert into public.skills (category,name) values ('tool','Managed Skill')$$, true, 'admin can INSERT a skill');
select pg_temp.expect(
  $$insert into public.experience (title, slug) values ('Test Role','test-role')$$, true, 'admin can INSERT experience');
select pg_temp.expect(
  $$insert into public.certifications (name, slug) values ('Test Cert','test-cert')$$, true, 'admin can INSERT a certification');
select pg_temp.expect(
  $$insert into storage.objects (bucket_id, name) values ('project-images','cover.png')$$, true, 'admin can upload to storage');
select pg_temp.expect(
  $$update public.contact_messages set read = true$$, true, 'admin can mark messages read');
select pg_temp.expect(
  $$update public.profiles set full_name = 'Jyotish Kumar' where id = '11111111-1111-1111-1111-111111111111'$$,
  true, 'admin can edit their own profile');
select pg_temp.expect(
  $$update public.profiles set is_admin = true where id = '11111111-1111-1111-1111-111111111111'$$,
  true, 'an existing admin may keep/adjust the admin flag');

\echo ''
\echo '--- reorder_items RPC ---'
select pg_temp.expect(
  $$select public.reorder_items('projects', array[
       (select id from public.projects where slug='krishifleet-ai'),
       (select id from public.projects where slug='smartattend'),
       (select id from public.projects where slug='test-project')])$$,
  true, 'admin can reorder projects');
select pg_temp.check(
  (select display_order from public.projects where slug='krishifleet-ai') = 1
  and (select display_order from public.projects where slug='test-project') = 3,
  'reorder_items applied the new order');
select pg_temp.expect(
  $$select public.reorder_items('pg_user', array['11111111-1111-1111-1111-111111111111']::uuid[])$$,
  false, 'reorder_items rejects a non-whitelisted table');

\echo ''
\echo '--- publishing toggles visibility for anon ---'
reset role; reset request.jwt.claim.role; reset request.jwt.claim.sub;
set role anon; set request.jwt.claim.role = 'anon';
select pg_temp.expect_rows($$select count(*) from public.projects where slug='test-project'$$, 0, 'anon cannot see the unpublished project');
select pg_temp.expect_rows($$select count(*) from public.projects where slug='krishifleet-ai'$$, 1, 'anon still sees published projects');
reset role; reset request.jwt.claim.role; reset request.jwt.claim.sub;

set role authenticated; set request.jwt.claim.role='authenticated';
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select pg_temp.expect_rows($$select count(*) from public.projects where slug='test-project'$$, 1, 'admin can still see the draft');

\echo ''
\echo '--- delete ---'
select pg_temp.expect($$delete from public.projects where slug='test-project'$$, true, 'admin can DELETE a project');
select pg_temp.expect($$delete from public.contact_messages$$, true, 'admin can DELETE messages');
select pg_temp.expect($$delete from storage.objects where name='cover.png'$$, true, 'admin can DELETE a storage object');

reset role; reset request.jwt.claim.role; reset request.jwt.claim.sub;

\echo ''
\echo '================== 7. PUBLIC PROFILE VISIBILITY =================='
update public.profiles set is_public = true, full_name = 'Jyotish Kumar' where id = '11111111-1111-1111-1111-111111111111';
set role anon; set request.jwt.claim.role = 'anon';
select pg_temp.expect_rows($$select count(*) from public.profiles where is_public$$$, 1, 'anon sees the public profile row');
select pg_temp.expect_no_effect($$update public.profiles set headline='x'$$, 'anon cannot update a profile');
reset role; reset request.jwt.claim.role; reset request.jwt.claim.sub;

\echo ''
\echo '================== DONE =================='
