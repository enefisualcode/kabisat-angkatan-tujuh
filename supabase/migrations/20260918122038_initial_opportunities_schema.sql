create table public.opportunities (
  id uuid primary key default gen_random_uuid(),

  type text not null
    check (type in ('job', 'business')),

  status text not null default 'pending'
    check (status in ('pending', 'published', 'rejected')),

  slug text unique,

  title text not null,
  description text not null,
  location text,
  image_url text,
  whatsapp text,
  submitted_by text,

  -- Field khusus Lowongan Kerja
  company text,
  employment_type text
    check (
      employment_type is null
      or employment_type in ('Full Time', 'Part Time', 'Internship', 'Freelance')
    ),
  requirements text,
  deadline date,
  application_url text,

  -- Field khusus Usaha Alumni
  owner_name text,
  category text,
  instagram text,
  website text,

  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Aktifkan Row Level Security
alter table public.opportunities enable row level security;

-- Pengunjung hanya boleh melihat posting yang sudah dipublikasikan
create policy "Public can read published opportunities"
on public.opportunities
for select
to anon, authenticated
using (status = 'published');

-- Pengunjung boleh mengirim posting baru,
-- tetapi posting wajib masuk sebagai pending
create policy "Public can submit pending opportunities"
on public.opportunities
for insert
to anon, authenticated
with check (
  status = 'pending'
  and published_at is null
);