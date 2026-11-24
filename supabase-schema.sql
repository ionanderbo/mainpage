-- ==========================================================================
-- Ion Ander Bolado Portfolio — Supabase Database & Storage Setup
-- Paste into Supabase -> SQL Editor -> New Query -> Run
-- ==========================================================================

-- 1. Updates & Notes Table
create table if not exists public.lab_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  date_label text not null,
  category text not null default 'engineering',
  category_label text not null default 'Engineering & Signals',
  title text not null,
  body text not null,
  tags text[] not null default '{}',
  accent_color text not null default '#0f766e',
  link_url text default '',
  link_label text default '',
  media_url text default '',
  media_name text default ''
);

-- 2. Projects Table (Featured, Current & Past Projects)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 10,
  status_label text not null default 'Completed',
  title text not null,
  summary text not null,
  details text default '',
  tags text[] not null default '{}',
  accent_color text not null default '#0f766e',
  primary_link_url text default '',
  primary_link_label text default '',
  secondary_link_url text default '',
  secondary_link_label text default '',
  media_url text default '',
  media_name text default '',
  widget_type text default 'standard' -- 'cardiopatch' | 'ct_biopsy' | 'eeg' | 'standard'
);

-- 3. Enable Row Level Security (RLS)
alter table public.lab_log enable row level security;
alter table public.projects enable row level security;

-- 4. Public Read-Only Policies
create policy "Public can read lab_log"
  on public.lab_log for select
  using (true);

create policy "Public can read projects"
  on public.projects for select
  using (true);

-- 5. Authenticated Write Policies (Admin Only)
create policy "Authenticated user can insert lab_log"
  on public.lab_log for insert
  to authenticated
  with check (true);

create policy "Authenticated user can update lab_log"
  on public.lab_log for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated user can delete lab_log"
  on public.lab_log for delete
  to authenticated
  using (true);

create policy "Authenticated user can insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "Authenticated user can update projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated user can delete projects"
  on public.projects for delete
  to authenticated
  using (true);

-- 6. Storage Bucket for Images, Diagrams & PDFs
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

create policy "Public can view portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

create policy "Authenticated user can upload portfolio media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-media');

create policy "Authenticated user can delete portfolio media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media');
