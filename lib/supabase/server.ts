import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only client (service role key, bypasses RLS entirely).
 * Never import this from a client component. Query results are typed
 * manually against lib/types.ts rather than a generated Database schema.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
