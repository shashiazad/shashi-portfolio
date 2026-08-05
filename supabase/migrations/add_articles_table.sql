-- Add articles table for published blog and technical write-ups
-- Run this in Supabase SQL Editor or use your migration workflow.

create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  featured_image text,
  content_html text not null default '',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.articles.slug is 'URL-friendly article identifier';
comment on column public.articles.featured_image is 'Optional featured image URL for article cards and previews.';
comment on column public.articles.content_html is 'HTML content authored through admin portal.';

alter table public.articles enable row level security;

create policy "Public can read published articles"
  on public.articles for select
  using (is_published = true);

create policy "Service role full access on articles"
  on public.articles for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
