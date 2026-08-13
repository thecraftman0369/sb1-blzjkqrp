-- Seed data for API Rate Limiter & Usage Control System
-- Run this in the Supabase SQL editor AFTER 0001_init.sql.
-- Safe to re-run: it clears existing rows in these tables first.

truncate table violations, usage_log, api_keys, endpoints, plans restart identity cascade;

-- ============================================================
-- Plans
-- ============================================================

insert into plans (name, requests_per_minute, requests_per_hour, requests_per_day, monthly_quota) values
  ('Free',       10,  200,  1000,   10000),
  ('Pro',        60,  2000, 20000,  500000),
  ('Enterprise', 300, 10000, 100000, 5000000);

-- ============================================================
-- Endpoints
-- ============================================================

insert into endpoints (path, method, cost_multiplier) values
  ('/v1/users',       'GET',  1),
  ('/v1/products',    'GET',  1),
  ('/v1/orders',      'POST', 3),
  ('/v1/auth/login',  'POST', 5),
  ('/v1/analytics',   'GET',  5),
  ('/v1/payments',    'POST', 10);

-- ============================================================
-- API keys (spread across plans, realistic owner names)
-- ============================================================

insert into api_keys (key_value, owner_name, plan_id, status, override_multiplier)
select v.key_value, v.owner_name, p.id, v.status, v.override_multiplier
from (values
  -- Free plan
  ('sk_free_7f3a9c2e1b4d5601', 'QA Testing Key',                       'Free',       'active',  null::numeric),
  ('sk_free_2b8e4f1a9d3c7702', 'Personal Project - Weather Widget',    'Free',       'active',  null::numeric),
  ('sk_free_c19d6a3e8f2b5503', 'Hackathon Demo Key',                   'Free',       'blocked', null::numeric),

  -- Pro plan
  ('sk_pro_4e7b1c9a2d6f8804',  'Mobile App - Production',              'Pro',        'active',  null::numeric),
  ('sk_pro_9a3f5d8e1c4b7205',  'Web Dashboard - Production',           'Pro',        'active',  null::numeric),
  ('sk_pro_1d6c8a4f7e9b3306',  'Partner Integration - Acme Corp',      'Pro',        'active',  1.5),
  ('sk_pro_8f2e9b6a3d5c1707',  'Internal Analytics Tool',              'Pro',        'active',  null::numeric),

  -- Enterprise plan
  ('sk_ent_5c1a8f4e2b9d6608',  'Legacy System',                        'Enterprise', 'active',  null::numeric),
  ('sk_ent_3b9d7e5a1f8c4409',  'Enterprise Client - Globex Corp',      'Enterprise', 'active',  2.0)
) as v(key_value, owner_name, plan_name, status, override_multiplier)
join plans p on p.name = v.plan_name;
