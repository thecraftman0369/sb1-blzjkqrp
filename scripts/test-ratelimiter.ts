/**
 * Standalone test for lib/rateLimiter.ts — no HTTP, no UI, just the token
 * bucket logic against real Supabase metadata and real Upstash Redis.
 *
 * Usage:
 *   npx tsx scripts/test-ratelimiter.ts [count] [--concurrent] [--reset]
 *
 * Env overrides:
 *   TEST_API_KEY           key_value to test against (default: a seeded Free-plan key)
 *   TEST_ENDPOINT_PATH     endpoint path (default: /v1/users)
 *   TEST_ENDPOINT_METHOD   endpoint method (default: GET)
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

// lib/redis.ts and lib/supabase/server.ts read env vars at module load time,
// so they're imported dynamically here, after dotenv has populated
// process.env — a top-level `import` would be hoisted and evaluated before
// the config() call above runs.
import type { RateLimitResult } from '../lib/rateLimiter';

const TEST_API_KEY = process.env.TEST_API_KEY ?? 'sk_free_7f3a9c2e1b4d5601';
const TEST_ENDPOINT_PATH = process.env.TEST_ENDPOINT_PATH ?? '/v1/users';
const TEST_ENDPOINT_METHOD = process.env.TEST_ENDPOINT_METHOD ?? 'GET';

const args = process.argv.slice(2);
const ITERATIONS = Number(args.find((a) => /^\d+$/.test(a)) ?? 15);
const CONCURRENT = args.includes('--concurrent');
const RESET = args.includes('--reset');

function printResult(i: number, r: RateLimitResult) {
  const tag = r.allowed ? 'ALLOWED' : 'BLOCKED';
  console.log(
    `#${String(i + 1).padStart(3, ' ')} ${tag.padEnd(7)} ` +
      `remaining=${String(r.remaining).padStart(4, ' ')}/${r.limit}  ` +
      `cost=${r.cost}  resetsAt=${r.resetsAt}`
  );
}

function summarize(results: RateLimitResult[]) {
  const allowed = results.filter((r) => r.allowed).length;
  console.log('');
  console.log(`Summary: ${allowed} allowed, ${results.length - allowed} blocked out of ${results.length}`);
}

async function main() {
  const { createServiceClient } = await import('../lib/supabase/server');
  const { checkRateLimit, resetBuckets } = await import('../lib/rateLimiter');

  const supabase = createServiceClient();

  const { data: apiKey, error: keyError } = await supabase
    .from('api_keys')
    .select('id, owner_name, key_value')
    .eq('key_value', TEST_API_KEY)
    .single();

  if (keyError || !apiKey) {
    console.error(`Could not find API key "${TEST_API_KEY}". Did you run supabase/seed.sql?`, keyError);
    process.exit(1);
  }

  const { data: endpoint, error: endpointError } = await supabase
    .from('endpoints')
    .select('id, path, method, cost_multiplier')
    .eq('path', TEST_ENDPOINT_PATH)
    .eq('method', TEST_ENDPOINT_METHOD)
    .single();

  if (endpointError || !endpoint) {
    console.error(`Could not find endpoint "${TEST_ENDPOINT_METHOD} ${TEST_ENDPOINT_PATH}".`, endpointError);
    process.exit(1);
  }

  if (RESET) {
    await resetBuckets(apiKey.id);
    console.log('(buckets reset)\n');
  }

  console.log('Testing rate limiter');
  console.log(`  key:      ${apiKey.owner_name} (${apiKey.key_value})`);
  console.log(`  endpoint: ${endpoint.method} ${endpoint.path} (cost ${endpoint.cost_multiplier})`);
  console.log(`  mode:     ${CONCURRENT ? 'concurrent' : 'sequential'}, ${ITERATIONS} requests`);
  console.log('');

  let results: RateLimitResult[];

  if (CONCURRENT) {
    results = await Promise.all(
      Array.from({ length: ITERATIONS }, () => checkRateLimit(apiKey.id, endpoint.id))
    );
    results.forEach((r, i) => printResult(i, r));
  } else {
    results = [];
    for (let i = 0; i < ITERATIONS; i++) {
      const r = await checkRateLimit(apiKey.id, endpoint.id);
      printResult(i, r);
      results.push(r);
    }
  }

  summarize(results);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
