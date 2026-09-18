-- Existing opportunities and baseline remain intact.
create index opportunities_status_created_idx on public.opportunities(status, created_at desc);
create index opportunities_type_created_idx on public.opportunities(type, created_at desc);
create index opportunities_created_idx on public.opportunities(created_at desc);
-- slug already has a unique index in the baseline.

create function public.prepare_opportunity() returns trigger
language plpgsql set search_path = '' as $$
begin
  if TG_OP = 'INSERT' then
    new.status := 'pending';
    new.published_at := null;
    new.slug := coalesce(nullif(left(trim(both '-' from regexp_replace(lower(new.title), '[^a-z0-9]+', '-', 'g')), 100), ''), 'peluang') || '-' || new.id::text;
  elsif new.status = 'published' and old.status <> 'published' then
    new.published_at := now();
  elsif new.status <> 'published' then
    new.published_at := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger prepare_opportunity before insert or update on public.opportunities
for each row execute function public.prepare_opportunity();

-- All anonymous submissions pass through the validated, rate-limited server endpoint.
drop policy "Public can submit pending opportunities" on public.opportunities;
revoke all on public.opportunities from anon, authenticated;
grant select on public.opportunities to anon, authenticated;
grant all on public.opportunities to service_role;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('opportunity-images', 'opportunity-images', false, 3145728,
  array['image/jpeg', 'image/png', 'image/webp'])
on conflict(id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Read images of published opportunities" on storage.objects
for select to anon, authenticated using (
  bucket_id = 'opportunity-images' and exists (
    select 1 from public.opportunities o where o.image_url = name and o.status = 'published'
  )
);
-- No public INSERT / UPDATE / DELETE on Storage. Only the server uploads and cleans up.

create table public.opportunity_rate_limits (
  key text primary key,
  window_start timestamptz not null,
  hits integer not null
);
alter table public.opportunity_rate_limits enable row level security;
revoke all on public.opportunity_rate_limits from anon, authenticated;

create function public.consume_opportunity_limit(p_key text, p_limit integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare hit_count integer;
begin
  delete from public.opportunity_rate_limits where window_start < now() - interval '1 day';
  insert into public.opportunity_rate_limits as r values (p_key, now(), 1)
  on conflict(key) do update set
    hits = case when r.window_start < now() - make_interval(secs => p_seconds) then 1 else r.hits + 1 end,
    window_start = case when r.window_start < now() - make_interval(secs => p_seconds) then now() else r.window_start end
  returning hits into hit_count;
  return hit_count <= p_limit;
end;
$$;
revoke all on function public.consume_opportunity_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_opportunity_limit(text, integer, integer) to service_role;
