-- All fixtures and changes are rolled back; no production rows are changed.
begin;
create temp table opportunity_test_ids (id uuid, kind text);
grant select on opportunity_test_ids to anon, authenticated;
create function pg_temp.assert_true(ok boolean, message text) returns void language plpgsql as $$
begin if ok is distinct from true then raise exception 'TEST FAILED: %', message; end if; end;
$$;
with fixture as (
  insert into public.opportunities(type, title, description, status, published_at)
  values ('job', 'KABISAT transactional test', 'Rolled back', 'published', now()),
         ('business', 'KABISAT transactional test', 'Rolled back', 'rejected', now())
  returning id, type
) insert into opportunity_test_ids select id, type from fixture;
select pg_temp.assert_true((select count(*) = 2 from public.opportunities where id in (select id from opportunity_test_ids) and status = 'pending' and published_at is null), 'all inserts forced pending');
select pg_temp.assert_true((select count(distinct slug) = 2 from public.opportunities where id in (select id from opportunity_test_ids)), 'identical titles get unique slugs');
set local role anon;
select pg_temp.assert_true((select count(*) = 0 from public.opportunities where id in (select id from opportunity_test_ids)), 'anon cannot read pending');
select pg_temp.assert_true(not has_table_privilege('public.opportunities', 'INSERT'), 'anon cannot bypass validated server');
select pg_temp.assert_true(not has_table_privilege('public.opportunities', 'UPDATE'), 'anon cannot publish');
select pg_temp.assert_true(not has_table_privilege('public.opportunities', 'DELETE'), 'anon cannot delete');
select pg_temp.assert_true(not has_function_privilege('public.consume_opportunity_limit(text,integer,integer)', 'EXECUTE'), 'anon cannot bypass rate limit');
reset role;
update public.opportunities set status = 'published' where id in (select id from opportunity_test_ids where kind = 'job');
update public.opportunities set status = 'rejected' where id in (select id from opportunity_test_ids where kind = 'business');
select pg_temp.assert_true((select published_at is not null from public.opportunities where id in (select id from opportunity_test_ids where kind = 'job')), 'publish timestamp assigned');
select pg_temp.assert_true((select published_at is null from public.opportunities where id in (select id from opportunity_test_ids where kind = 'business')), 'rejected has no publish timestamp');
set local role anon;
select pg_temp.assert_true((select count(*) = 1 from public.opportunities where id in (select id from opportunity_test_ids)), 'public sees only published');
reset role;
set local role authenticated;
select pg_temp.assert_true((select count(*) = 1 from public.opportunities where id in (select id from opportunity_test_ids)), 'authenticated sees only published');
select pg_temp.assert_true(not has_table_privilege('public.opportunities', 'UPDATE'), 'authenticated cannot moderate');
reset role;
select pg_temp.assert_true((select not public and file_size_limit = 3145728 from storage.buckets where id = 'opportunity-images'), 'private image bucket and size cap');
select pg_temp.assert_true(public.consume_opportunity_limit('transaction-test', 1, 60), 'rate limiter allows first request');
select pg_temp.assert_true(not public.consume_opportunity_limit('transaction-test', 1, 60), 'rate limiter blocks excess');
rollback;
