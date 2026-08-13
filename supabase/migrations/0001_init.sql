-- API Rate Limiter & Usage Control System
-- Initial schema migration. Run this in the Supabase SQL editor.

create extension if not exists pgcrypto;

-- ============================================================
-- Tables
-- ============================================================

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  requests_per_minute int not null,
  requests_per_hour int not null,
  requests_per_day int not null,
  monthly_quota int not null,
  created_at timestamptz not null default now()
);

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  key_value text not null unique,
  owner_name text not null,
  plan_id uuid not null references plans(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'blocked', 'revoked')),
  override_multiplier numeric,
  created_at timestamptz not null default now()
);

create table if not exists endpoints (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  method text not null,
  cost_multiplier int not null default 1,
  created_at timestamptz not null default now(),
  unique (path, method)
);

create table if not exists usage_log (
  id uuid primary key default gen_random_uuid(),
  api_key_id uuid references api_keys(id) on delete cascade,
  endpoint_id uuid references endpoints(id) on delete cascade,
  status text not null check (status in ('allowed', 'rate_limited', 'blocked')),
  "timestamp" timestamptz not null default now()
);

create table if not exists violations (
  id uuid primary key default gen_random_uuid(),
  api_key_id uuid references api_keys(id) on delete cascade,
  endpoint_id uuid references endpoints(id) on delete cascade,
  severity text not null default 'warning' check (severity in ('warning', 'critical')),
  "timestamp" timestamptz not null default now()
);

-- ============================================================
-- Indexes (dashboard queries filter/sort by these columns heavily)
-- ============================================================

create index if not exists idx_api_keys_plan_id on api_keys(plan_id);
create index if not exists idx_api_keys_status on api_keys(status);

create index if not exists idx_usage_log_api_key_id on usage_log(api_key_id);
create index if not exists idx_usage_log_endpoint_id on usage_log(endpoint_id);
create index if not exists idx_usage_log_timestamp on usage_log("timestamp" desc);
create index if not exists idx_usage_log_status on usage_log(status);

create index if not exists idx_violations_api_key_id on violations(api_key_id);
create index if not exists idx_violations_timestamp on violations("timestamp" desc);

-- ============================================================
-- Row Level Security
-- This is a public demo dashboard: anon (browser) is allowed read-only
-- access so dashboard pages/charts can query directly. All writes
-- (usage logging, status changes, key/plan/endpoint management) go
-- through Next.js API routes using the service role key, which bypasses
-- RLS entirely.
-- ============================================================

alter table plans enable row level security;
alter table api_keys enable row level security;
alter table endpoints enable row level security;
alter table usage_log enable row level security;
alter table violations enable row level security;

create policy "Public read access" on plans for select using (true);
create policy "Public read access" on api_keys for select using (true);
create policy "Public read access" on endpoints for select using (true);
create policy "Public read access" on usage_log for select using (true);
create policy "Public read access" on violations for select using (true);
