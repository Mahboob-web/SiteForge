-- =====================================================
-- SITEFORGE AI — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor
-- =====================================================

-- ─── LEADS TABLE ─────────────────────────────────────────────────────────────
-- Captures enquiries from the agency parent site
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  biz_name text not null,
  phone text not null,
  email text not null,
  niche text not null,
  city text,
  message text,
  plan text,
  status text default 'new' check (status in (
    'new', 'contacted', 'intake_sent', 'intake_complete',
    'generating', 'deployed', 'live'
  )),
  intake_token uuid default gen_random_uuid(),
  created_at timestamptz default now()
);

-- ─── INTAKE TABLE ────────────────────────────────────────────────────────────
-- Full client data from the 7-step intake form
create table if not exists intake (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id) on delete set null,
  token uuid not null unique,

  -- Step 1 Business Info
  biz_name text not null,
  trading_name text,
  owner_name text not null,
  abn text,
  phone text not null,
  email text not null,
  domain text,
  years_in_biz text,
  team_size text,
  biz_type text,
  address text,
  gmb_url text,
  current_site text,
  industry text not null,

  -- Step 2 Services
  services text[] default '{}',
  other_services text,
  pricing_type text default 'quote',
  price_from text,
  price_popular text,
  response_time text,
  availability text,
  guarantees text[] default '{}',
  certs text[] default '{}',

  -- Step 3 Service Areas
  suburbs text[] default '{}',
  travel_range int default 30,
  city text,

  -- Step 4 Brand & Design
  tone text default 'professional',
  colour text,
  style text,
  target_customer text,

  -- Step 5 USPs
  usps text[] default '{}',
  biz_story text,
  star_rating text,
  awards text,

  -- Step 6 Testimonials
  testimonials jsonb default '[]',
  facebook_url text,
  instagram_url text,

  -- Step 7 Assets
  logo_url text,
  plan text default 'starter',
  retainer text,

  status text default 'pending' check (status in (
    'pending', 'generating', 'complete', 'deployed'
  )),
  site_url text,
  created_at timestamptz default now()
);

-- ─── GENERATED SITES TABLE ───────────────────────────────────────────────────
-- Stores all AI-generated content
create table if not exists generated_sites (
  id uuid default gen_random_uuid() primary key,
  intake_id uuid references intake(id) on delete cascade,

  hero_headline text,
  hero_subheadline text,
  hero_cta_primary text,
  hero_cta_secondary text,
  trust_bar text[] default '{}',
  about_summary text,
  about_full text,
  owner_bio text,
  services_copy jsonb default '{}',
  suburb_pages jsonb default '{}',
  homepage_faq jsonb default '[]',
  gmb_description text,
  meta_tags jsonb default '{}',
  schema_json text,

  status text default 'pending' check (status in (
    'pending', 'complete', 'error'
  )),
  error_message text,
  created_at timestamptz default now()
);

-- ─── DEPLOYMENTS TABLE ───────────────────────────────────────────────────────
-- Tracks Vercel deployments
create table if not exists deployments (
  id uuid default gen_random_uuid() primary key,
  intake_id uuid references intake(id) on delete cascade,

  vercel_project_id text,
  vercel_deployment_id text,
  url text,
  custom_domain text,

  status text default 'pending' check (status in (
    'pending', 'building', 'ready', 'error'
  )),
  error_message text,
  created_at timestamptz default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
create index if not exists leads_email_idx on leads(email);
create index if not exists leads_status_idx on leads(status);
create index if not exists intake_token_idx on intake(token);
create index if not exists intake_lead_id_idx on intake(lead_id);
create index if not exists generated_sites_intake_idx on generated_sites(intake_id);
create index if not exists deployments_intake_idx on deployments(intake_id);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
-- All tables are private — only service role (server) can read/write
alter table leads enable row level security;
alter table intake enable row level security;
alter table generated_sites enable row level security;
alter table deployments enable row level security;

-- Allow anon to INSERT leads (from contact form)
create policy "anon can insert leads" on leads
  for insert to anon with check (true);

-- Allow anon to INSERT intake (from intake form with valid token)
create policy "anon can insert intake" on intake
  for insert to anon with check (true);

-- Allow anon to read intake by token (to check status)
create policy "anon can read intake by token" on intake
  for select to anon using (true);

-- Service role bypasses all RLS automatically

-- ─── DONE ────────────────────────────────────────────────────────────────────
-- Tables created:
-- ✅ leads         — enquiries from agency site
-- ✅ intake        — full client data from intake form
-- ✅ generated_sites — AI-generated content
-- ✅ deployments   — Vercel deployment tracking
