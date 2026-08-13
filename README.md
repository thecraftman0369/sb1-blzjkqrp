# API Rate Limiter & Usage Control System

A demo dashboard that enforces real rate limiting (token bucket, via Upstash
Redis) on a fake API, with persistent usage/violation data in Supabase.

## Stack

- Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres) for persistent data
- Upstash Redis (REST API) for rate limit counters
- Deploy target: Vercel

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in your Supabase and
   Upstash credentials.

3. Run the SQL migration in `supabase/migrations/0001_init.sql` in the
   Supabase SQL editor, then run `supabase/seed.sql` to load sample data.

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Project layout

- `app/` — Next.js App Router pages and API routes
- `lib/` — Supabase clients, Redis client, rate limiter, shared types
- `supabase/` — SQL migration and seed data
- `scripts/` — standalone test/dev scripts
