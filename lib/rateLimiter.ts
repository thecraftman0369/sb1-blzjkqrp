import { redis } from '@/lib/redis';
import { createServiceClient } from '@/lib/supabase/server';

export interface WindowResult {
  remaining: number;
  limit: number;
  resetsAt: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetsAt: string;
  cost: number;
  windows: {
    minute: WindowResult;
    hour: WindowResult;
    day: WindowResult;
  };
}

type WindowName = 'minute' | 'hour' | 'day';
const WINDOW_SECONDS: Record<WindowName, number> = {
  minute: 60,
  hour: 3600,
  day: 86400,
};

/**
 * Atomic token-bucket check across all three windows (minute/hour/day) in a
 * single Lua script. Tokens for a given window only get spent if ALL THREE
 * windows currently have enough tokens to cover `cost` — a rejection on any
 * one window leaves every bucket untouched, so a request blocked by the
 * daily cap doesn't also burn down the minute bucket.
 *
 * Each bucket is a Redis hash { tokens, ts } and refills continuously based
 * on elapsed time since `ts`, rather than resetting on a fixed schedule.
 * Token counts are returned as strings because Redis's Lua->RESP numeric
 * conversion truncates to integers, which would drop fractional refill.
 */
const TOKEN_BUCKET_SCRIPT = `
local now = tonumber(ARGV[1])
local cost = tonumber(ARGV[2])

local caps = {tonumber(ARGV[3]), tonumber(ARGV[5]), tonumber(ARGV[7])}
local rates = {tonumber(ARGV[4]), tonumber(ARGV[6]), tonumber(ARGV[8])}
local ttls = {120, 7200, 172800}

local tokens = {}
local allowed = 1

for i = 1, 3 do
  local bucket = redis.call('HMGET', KEYS[i], 'tokens', 'ts')
  local t = tonumber(bucket[1])
  local last_ts = tonumber(bucket[2])

  if t == nil then
    t = caps[i]
    last_ts = now
  end

  local elapsed = math.max(0, now - last_ts) / 1000
  t = math.min(caps[i], t + elapsed * rates[i])
  tokens[i] = t

  if t < cost then
    allowed = 0
  end
end

if allowed == 1 then
  for i = 1, 3 do
    tokens[i] = tokens[i] - cost
  end
end

for i = 1, 3 do
  redis.call('HMSET', KEYS[i], 'tokens', tostring(tokens[i]), 'ts', tostring(now))
  redis.call('EXPIRE', KEYS[i], ttls[i])
end

return {allowed, tostring(tokens[1]), tostring(tokens[2]), tostring(tokens[3])}
`;

interface PlanLimits {
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
}

interface CachedKeyInfo {
  overrideMultiplier: number;
  plan: PlanLimits;
  expiresAt: number;
}

interface CachedEndpointInfo {
  cost: number;
  expiresAt: number;
}

// Plan limits / endpoint costs change rarely (admin CRUD in the dashboard),
// so a short in-memory cache keeps burst-test load off Supabase without
// meaningfully staling out real edits. api_keys.status is intentionally NOT
// cached here — the middleware checks it fresh on every request.
const CACHE_TTL_MS = 30_000;
const keyInfoCache = new Map<string, CachedKeyInfo>();
const endpointInfoCache = new Map<string, CachedEndpointInfo>();

async function getApiKeyInfo(apiKeyId: string): Promise<CachedKeyInfo> {
  const cached = keyInfoCache.get(apiKeyId);
  if (cached && cached.expiresAt > Date.now()) return cached;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('override_multiplier, plans(requests_per_minute, requests_per_hour, requests_per_day)')
    .eq('id', apiKeyId)
    .single();

  if (error || !data || !data.plans) {
    throw new Error(`checkRateLimit: unknown api key "${apiKeyId}"`);
  }

  const plan = data.plans as unknown as PlanLimits;
  const info: CachedKeyInfo = {
    overrideMultiplier: data.override_multiplier ?? 1,
    plan,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  keyInfoCache.set(apiKeyId, info);
  return info;
}

async function getEndpointInfo(endpointId: string): Promise<CachedEndpointInfo> {
  const cached = endpointInfoCache.get(endpointId);
  if (cached && cached.expiresAt > Date.now()) return cached;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('endpoints')
    .select('cost_multiplier')
    .eq('id', endpointId)
    .single();

  if (error || !data) {
    throw new Error(`checkRateLimit: unknown endpoint "${endpointId}"`);
  }

  const info: CachedEndpointInfo = {
    cost: data.cost_multiplier,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  endpointInfoCache.set(endpointId, info);
  return info;
}

function bucketKey(apiKeyId: string, window: WindowName): string {
  return `bucket:${apiKeyId}:${window}`;
}

function windowResult(tokensRaw: string, capacity: number, refillRate: number, now: number): WindowResult {
  const tokens = Math.max(0, Number.parseFloat(tokensRaw));
  const deficit = Math.max(0, capacity - tokens);
  const msUntilFull = refillRate > 0 ? (deficit / refillRate) * 1000 : 0;
  return {
    remaining: Math.floor(tokens),
    limit: capacity,
    resetsAt: new Date(now + msUntilFull).toISOString(),
  };
}

/**
 * Checks and, if allowed, atomically decrements the token buckets for an
 * API key against an endpoint's cost. Applies the key's override_multiplier
 * (if any) to the plan's per-window capacities.
 */
export async function checkRateLimit(apiKeyId: string, endpointId: string): Promise<RateLimitResult> {
  const [keyInfo, endpointInfo] = await Promise.all([
    getApiKeyInfo(apiKeyId),
    getEndpointInfo(endpointId),
  ]);

  const multiplier = keyInfo.overrideMultiplier;
  const cost = endpointInfo.cost;

  const capacities: Record<WindowName, number> = {
    minute: Math.max(1, Math.round(keyInfo.plan.requests_per_minute * multiplier)),
    hour: Math.max(1, Math.round(keyInfo.plan.requests_per_hour * multiplier)),
    day: Math.max(1, Math.round(keyInfo.plan.requests_per_day * multiplier)),
  };

  const refillRates: Record<WindowName, number> = {
    minute: capacities.minute / WINDOW_SECONDS.minute,
    hour: capacities.hour / WINDOW_SECONDS.hour,
    day: capacities.day / WINDOW_SECONDS.day,
  };

  const now = Date.now();
  const keys = [bucketKey(apiKeyId, 'minute'), bucketKey(apiKeyId, 'hour'), bucketKey(apiKeyId, 'day')];

  const [allowedFlag, minuteTokens, hourTokens, dayTokens] = await redis.eval<
    (string | number)[],
    [number, string, string, string]
  >(TOKEN_BUCKET_SCRIPT, keys, [
    now,
    cost,
    capacities.minute,
    refillRates.minute,
    capacities.hour,
    refillRates.hour,
    capacities.day,
    refillRates.day,
  ]);

  const windows = {
    minute: windowResult(minuteTokens, capacities.minute, refillRates.minute, now),
    hour: windowResult(hourTokens, capacities.hour, refillRates.hour, now),
    day: windowResult(dayTokens, capacities.day, refillRates.day, now),
  };

  const allowed = Number(allowedFlag) === 1;

  // Report the most-constrained window as the top-level limit/remaining —
  // whichever window is closest to exhaustion is the most useful number to
  // hand back to a caller (and, when blocked, is the one that caused it).
  const primary = ([windows.minute, windows.hour, windows.day] as WindowResult[]).reduce((min, w) =>
    w.remaining / w.limit < min.remaining / min.limit ? w : min
  );

  return {
    allowed,
    remaining: primary.remaining,
    limit: primary.limit,
    resetsAt: primary.resetsAt,
    cost,
    windows,
  };
}

/** Clears all buckets for an API key. Used by tests and by the dashboard's unblock action. */
export async function resetBuckets(apiKeyId: string): Promise<void> {
  await redis.del(
    bucketKey(apiKeyId, 'minute'),
    bucketKey(apiKeyId, 'hour'),
    bucketKey(apiKeyId, 'day')
  );
}
