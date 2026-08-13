import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-safe client (anon key, RLS-restricted to public reads).
 * Use in client components. Query results are typed manually against
 * lib/types.ts rather than a generated Database schema.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
