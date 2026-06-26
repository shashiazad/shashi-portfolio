-- ============================================================
-- Referrals & Jobs — Supabase SQL Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Enable UUID generation
create extension if not exists "uuid-ossp";

-- 2. Jobs table
create table if not exists public.jobs (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  company         text not null,
  description     text not null default '',
  tech_stack      text[] not null default '{}',
  experience_min  numeric not null default 0,
  experience_max  numeric not null default 0,
  location_type   text not null default 'Remote',
  employment_type text not null default 'Full-time',
  posted_at       timestamptz not null default now(),
  apply_by        timestamptz,
  is_active       boolean not null default true,
  job_location    text,
  job_id          text,
  job_link        text
);

-- 3. Referral requests table
create table if not exists public.referral_requests (
  id                  uuid primary key default uuid_generate_v4(),
  job_link            text,
  job_id_with_company text,
  name                text not null,
  email               text not null,
  mobile              text not null,
  years_experience    numeric not null default 0,
  tech_stacks         text[] not null default '{}',
  resume_url          text not null,
  address             text,
  college             text,
  latest_education    text,
  consent             boolean not null default false,
  ip_hash             text,
  created_at          timestamptz not null default now()
);

-- 4. Rate-limit tracking table (IP-based, ephemeral)
create table if not exists public.rate_limits (
  id         uuid primary key default uuid_generate_v4(),
  ip_hash    text not null,
  endpoint   text not null,
  created_at timestamptz not null default now()
);

-- Index for fast rate-limit lookups
create index if not exists idx_rate_limits_ip_time
  on public.rate_limits (ip_hash, endpoint, created_at desc);

-- Auto-clean old rate-limit rows (optional: run via pg_cron)
-- delete from public.rate_limits where created_at < now() - interval '5 minutes';

-- 5. Row Level Security ─────────────────────────────────

-- Jobs: anyone can read active jobs; only service_role can write
alter table public.jobs enable row level security;

create policy "Public can read active jobs"
  on public.jobs for select
  using (is_active = true);

create policy "Service role full access on jobs"
  on public.jobs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Referral requests: only service_role can read/write
alter table public.referral_requests enable row level security;

create policy "Service role full access on referral_requests"
  on public.referral_requests for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Rate limits: only service_role
alter table public.rate_limits enable row level security;

create policy "Service role full access on rate_limits"
  on public.rate_limits for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 6. Enable Realtime for jobs table
alter publication supabase_realtime add table public.jobs;

-- 7. Storage bucket (run separately in Storage settings or via SQL)
-- insert into storage.buckets (id, name, public)
-- values ('resumes', 'resumes', false);
--
-- -- Only service_role can upload/read
-- create policy "Service role upload" on storage.objects
--   for insert with check (bucket_id = 'resumes' and auth.role() = 'service_role');
-- create policy "Service role read" on storage.objects
--   for select using (bucket_id = 'resumes' and auth.role() = 'service_role');
