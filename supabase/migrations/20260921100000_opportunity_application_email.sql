alter table public.opportunities add column application_email text;

create or replace function public.complete_opportunity_submission(p_id uuid, p_token_hash text)
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
    company,employment_type,requirements,deadline,application_url,application_email,owner_name,category,instagram,website,image_url,status,published_at)
  values(s.id,p->>'type',p->>'title',p->>'description',p->>'location',p->>'whatsapp',p->>'submitted_by',
    p->>'company',p->>'employment_type',p->>'requirements',nullif(p->>'deadline','')::date,p->>'application_url',p->>'application_email',
    p->>'owner_name',p->>'category',p->>'instagram',p->>'website',s.image_paths[1],'pending',null);
  insert into public.opportunity_images(opportunity_id,storage_path,sort_order)
    select s.id, path, ordinality - 1 from unnest(s.image_paths) with ordinality as images(path,ordinality);
  update public.opportunity_upload_sessions set status = 'completed' where id = s.id;
  return s.id;
end;
$$;

revoke all on function public.complete_opportunity_submission(uuid,text) from public, anon, authenticated;
grant execute on function public.complete_opportunity_submission(uuid,text) to service_role;
