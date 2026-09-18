create table public.opportunity_images (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  storage_path text not null check (length(storage_path) > 0),
  sort_order integer not null default 0 check (sort_order between 0 and 4),
  created_at timestamptz not null default now(),
  unique (opportunity_id, storage_path),
  unique (opportunity_id, sort_order)
);
create index opportunity_images_opportunity_idx on public.opportunity_images(opportunity_id);
-- The UNIQUE(opportunity_id, sort_order) constraint supplies the ordered composite index.
alter table public.opportunity_images enable row level security;
revoke all on public.opportunity_images from anon, authenticated;
grant select on public.opportunity_images to anon, authenticated;
grant all on public.opportunity_images to service_role;
create policy "Public can read published image metadata" on public.opportunity_images
for select to anon, authenticated using (exists (
  select 1 from public.opportunities o where o.id = opportunity_id and o.status = 'published'
));

-- Only copy verifiable bucket paths. Keep image_url intact, including any legacy URLs.
insert into public.opportunity_images(opportunity_id, storage_path, sort_order)
select o.id, o.image_url, 0 from public.opportunities o
where exists (select 1 from storage.objects s where s.bucket_id = 'opportunity-images' and s.name = o.image_url)
on conflict do nothing;

drop policy "Read images of published opportunities" on storage.objects;
create policy "Read images of published opportunities" on storage.objects
for select to anon, authenticated using (bucket_id = 'opportunity-images' and (
  exists (select 1 from public.opportunity_images i join public.opportunities o on o.id = i.opportunity_id
          where i.storage_path = name and o.status = 'published')
  or exists (select 1 from public.opportunities o where o.image_url = name and o.status = 'published')
));

-- Durable upload manifest: never public, and no opportunities exist until finalization.
create table public.opportunity_upload_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null,
  payload jsonb not null,
  image_paths text[] not null default '{}',
  status text not null default 'open' check (status in ('open','completed','cancelled')),
  expires_at timestamptz not null default now() + interval '1 hour',
  created_at timestamptz not null default now(),
  check (cardinality(image_paths) between 0 and 5)
);
create index opportunity_upload_sessions_expiry_idx on public.opportunity_upload_sessions(expires_at);
alter table public.opportunity_upload_sessions enable row level security;
revoke all on public.opportunity_upload_sessions from anon, authenticated;
grant all on public.opportunity_upload_sessions to service_role;

create function public.complete_opportunity_submission(p_id uuid, p_token_hash text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare s public.opportunity_upload_sessions; p jsonb;
begin
  select * into s from public.opportunity_upload_sessions where id = p_id and token_hash = p_token_hash for update;
  if not found then raise exception 'Invalid submission'; end if;
  if s.status = 'completed' then return s.id; end if;
  if s.status <> 'open' or s.expires_at <= now() then raise exception 'Submission expired'; end if;
  if exists (select 1 from unnest(s.image_paths) path where not exists (
    select 1 from storage.objects o where o.bucket_id = 'opportunity-images' and o.name = path
  )) then raise exception 'Images incomplete'; end if;
  p := s.payload;
  insert into public.opportunities(id,type,title,description,location,whatsapp,submitted_by,
    company,employment_type,requirements,deadline,application_url,owner_name,category,instagram,website,image_url,status,published_at)
  values(s.id,p->>'type',p->>'title',p->>'description',p->>'location',p->>'whatsapp',p->>'submitted_by',
    p->>'company',p->>'employment_type',p->>'requirements',nullif(p->>'deadline','')::date,p->>'application_url',
    p->>'owner_name',p->>'category',p->>'instagram',p->>'website',s.image_paths[1],'pending',null);
  insert into public.opportunity_images(opportunity_id,storage_path,sort_order)
    select s.id, path, ordinality - 1 from unnest(s.image_paths) with ordinality as images(path,ordinality);
  update public.opportunity_upload_sessions set status = 'completed' where id = s.id;
  return s.id;
end;
$$;
revoke all on function public.complete_opportunity_submission(uuid,text) from public, anon, authenticated;
grant execute on function public.complete_opportunity_submission(uuid,text) to service_role;

create function public.detach_opportunity_images(p_id uuid, p_paths text[])
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.opportunities set image_url = null where id = p_id and image_url = any(p_paths);
  delete from public.opportunity_images where opportunity_id = p_id and storage_path = any(p_paths);
end;
$$;
revoke all on function public.detach_opportunity_images(uuid,text[]) from public, anon, authenticated;
grant execute on function public.detach_opportunity_images(uuid,text[]) to service_role;

create function public.delete_opportunity_record(p_id uuid, p_paths text[])
returns void language plpgsql security definer set search_path = '' as $$
declare current_paths text[];
begin
  perform 1 from public.opportunities where id = p_id for update;
  if not found then return; end if;
  select coalesce(array_agg(path order by path), '{}') into current_paths from (
    select storage_path as path from public.opportunity_images where opportunity_id = p_id
    union select image_url from public.opportunities where id = p_id and image_url <> '' and image_url !~ '^https?://'
  ) paths;
  if current_paths <> (select coalesce(array_agg(distinct path order by path),'{}') from unnest(p_paths) path)
    then raise exception 'Images changed; retry deletion'; end if;
  delete from public.opportunities where id = p_id;
end;
$$;
revoke all on function public.delete_opportunity_record(uuid,text[]) from public, anon, authenticated;
grant execute on function public.delete_opportunity_record(uuid,text[]) to service_role;
