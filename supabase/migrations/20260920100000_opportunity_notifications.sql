-- Durable, retry-safe notification claim marker for finalized submissions.
create table if not exists public.opportunity_notifications (
  opportunity_id uuid primary key references public.opportunities(id) on delete cascade,
  status text not null default 'sending' check (status in ('sending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  provider_id text
);

create index if not exists opportunity_notifications_status_idx
  on public.opportunity_notifications(status, created_at);

alter table public.opportunity_notifications enable row level security;
revoke all on public.opportunity_notifications from anon, authenticated;
grant all on public.opportunity_notifications to service_role;

create or replace function public.claim_opportunity_notification(p_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare claimed boolean;
begin
  insert into public.opportunity_notifications(opportunity_id, status)
  values (p_id, 'sending')
  on conflict (opportunity_id) do update set
    status = 'sending',
    created_at = now(),
    sent_at = null,
    provider_id = null
  where public.opportunity_notifications.status = 'failed'
    or (public.opportunity_notifications.status = 'sending'
      and public.opportunity_notifications.created_at < now() - interval '10 minutes')
  returning true into claimed;

  return coalesce(claimed, false);
end;
$$;

revoke all on function public.claim_opportunity_notification(uuid) from public, anon, authenticated;
grant execute on function public.claim_opportunity_notification(uuid) to service_role;
