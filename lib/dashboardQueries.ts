import { createServiceClient } from '@/lib/supabase/server';
import type { ApiKeyStatus, ViolationSeverity } from '@/lib/types';

// How many recent log/violation rows to pull for in-memory aggregation
// (grouping by plan/endpoint/time bucket). Supabase/PostgREST doesn't do
// arbitrary GROUP BY without a custom SQL view or RPC, and at demo/portfolio
// scale this bound comfortably covers even a large burst test run.
const AGGREGATION_ROW_LIMIT = 5000;

export interface OverviewStats {
  totalRequests: number;
  allowedRequests: number;
  rateLimitedRequests: number;
  blockedRequests: number;
  activeKeys: number;
  avgRequestsPerMinute: number;
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const supabase = createServiceClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const [total, allowed, rateLimited, blocked, activeKeys, lastHour] = await Promise.all([
    supabase.from('usage_log').select('id', { count: 'exact', head: true }),
    supabase.from('usage_log').select('id', { count: 'exact', head: true }).eq('status', 'allowed'),
    supabase.from('usage_log').select('id', { count: 'exact', head: true }).eq('status', 'rate_limited'),
    supabase.from('usage_log').select('id', { count: 'exact', head: true }).eq('status', 'blocked'),
    supabase.from('api_keys').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('usage_log').select('id', { count: 'exact', head: true }).gte('timestamp', oneHourAgo),
  ]);

  return {
    totalRequests: total.count ?? 0,
    allowedRequests: allowed.count ?? 0,
    rateLimitedRequests: rateLimited.count ?? 0,
    blockedRequests: blocked.count ?? 0,
    activeKeys: activeKeys.count ?? 0,
    avgRequestsPerMinute: Math.round(((lastHour.count ?? 0) / 60) * 10) / 10,
  };
}

interface UsageLogRow {
  status: string;
  timestamp: string;
  endpoints: { path: string; method: string } | null;
  api_keys: { plans: { name: string } | null } | null;
}

async function getRecentUsageLogs(): Promise<UsageLogRow[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('usage_log')
    .select('status, timestamp, endpoints(path, method), api_keys(plans(name))')
    .order('timestamp', { ascending: false })
    .limit(AGGREGATION_ROW_LIMIT);

  return (data ?? []) as unknown as UsageLogRow[];
}

export interface PlanBreakdownEntry {
  plan: string;
  count: number;
}

export async function getRequestsByPlan(): Promise<PlanBreakdownEntry[]> {
  const rows = await getRecentUsageLogs();
  const counts = new Map<string, number>();

  for (const row of rows) {
    const plan = row.api_keys?.plans?.name ?? 'Unknown';
    counts.set(plan, (counts.get(plan) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([plan, count]) => ({ plan, count }));
}

export interface VolumePoint {
  bucket: string;
  allowed: number;
  rateLimited: number;
}

export async function getVolumeOverTime(): Promise<VolumePoint[]> {
  const rows = await getRecentUsageLogs();
  const buckets = new Map<string, { allowed: number; rateLimited: number }>();

  for (const row of rows) {
    // Bucket to the minute.
    const bucket = row.timestamp.slice(0, 16);
    const entry = buckets.get(bucket) ?? { allowed: 0, rateLimited: 0 };
    if (row.status === 'allowed') entry.allowed += 1;
    else if (row.status === 'rate_limited') entry.rateLimited += 1;
    buckets.set(bucket, entry);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-60)
    .map(([bucket, v]) => ({
      bucket: bucket.slice(11),
      allowed: v.allowed,
      rateLimited: v.rateLimited,
    }));
}

export interface EndpointBreakdownEntry {
  endpoint: string;
  count: number;
}

export async function getBusiestEndpoints(): Promise<EndpointBreakdownEntry[]> {
  const rows = await getRecentUsageLogs();
  const counts = new Map<string, number>();

  for (const row of rows) {
    if (!row.endpoints) continue;
    const key = `${row.endpoints.method} ${row.endpoints.path}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export interface ApiKeyRow {
  id: string;
  keyValue: string;
  ownerName: string;
  status: ApiKeyStatus;
  overrideMultiplier: number | null;
  createdAt: string;
  planId: string;
  planName: string;
  requestsPerMinute: number;
  monthlyQuota: number;
  requestsThisMonth: number;
  lastUsedAt: string | null;
}

export async function getApiKeysWithUsage(): Promise<ApiKeyRow[]> {
  const supabase = createServiceClient();
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const { data: keys } = await supabase
    .from('api_keys')
    .select('id, key_value, owner_name, status, override_multiplier, created_at, plan_id, plans(name, requests_per_minute, monthly_quota)')
    .order('created_at', { ascending: true });

  if (!keys) return [];

  const results = await Promise.all(
    (keys as unknown as Array<{
      id: string;
      key_value: string;
      owner_name: string;
      status: ApiKeyStatus;
      override_multiplier: number | null;
      created_at: string;
      plan_id: string;
      plans: { name: string; requests_per_minute: number; monthly_quota: number } | null;
    }>).map(async (key) => {
      const [usageCount, lastUsage] = await Promise.all([
        supabase
          .from('usage_log')
          .select('id', { count: 'exact', head: true })
          .eq('api_key_id', key.id)
          .eq('status', 'allowed')
          .gte('timestamp', startOfMonth.toISOString()),
        supabase
          .from('usage_log')
          .select('timestamp')
          .eq('api_key_id', key.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      const multiplier = key.override_multiplier ?? 1;

      return {
        id: key.id,
        keyValue: key.key_value,
        ownerName: key.owner_name,
        status: key.status,
        overrideMultiplier: key.override_multiplier,
        createdAt: key.created_at,
        planId: key.plan_id,
        planName: key.plans?.name ?? 'Unknown',
        requestsPerMinute: Math.round((key.plans?.requests_per_minute ?? 0) * multiplier),
        monthlyQuota: key.plans?.monthly_quota ?? 0,
        requestsThisMonth: usageCount.count ?? 0,
        lastUsedAt: (lastUsage.data as { timestamp: string } | null)?.timestamp ?? null,
      } satisfies ApiKeyRow;
    })
  );

  return results;
}

export interface ViolationRow {
  id: string;
  apiKeyId: string;
  ownerName: string;
  endpoint: string;
  severity: ViolationSeverity;
  timestamp: string;
}

export async function getViolations(): Promise<ViolationRow[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('violations')
    .select('id, api_key_id, severity, timestamp, api_keys(owner_name), endpoints(path, method)')
    .order('timestamp', { ascending: false })
    .limit(500);

  return ((data ?? []) as unknown as Array<{
    id: string;
    api_key_id: string;
    severity: ViolationSeverity;
    timestamp: string;
    api_keys: { owner_name: string } | null;
    endpoints: { path: string; method: string } | null;
  }>).map((row) => ({
    id: row.id,
    apiKeyId: row.api_key_id,
    ownerName: row.api_keys?.owner_name ?? 'Unknown',
    endpoint: row.endpoints ? `${row.endpoints.method} ${row.endpoints.path}` : 'Unknown',
    severity: row.severity,
    timestamp: row.timestamp,
  }));
}

export interface TopOffender {
  apiKeyId: string;
  ownerName: string;
  violationCount: number;
}

export async function getTopOffenders(): Promise<TopOffender[]> {
  const violations = await getViolations();
  const counts = new Map<string, { ownerName: string; count: number }>();

  for (const v of violations) {
    const entry = counts.get(v.apiKeyId) ?? { ownerName: v.ownerName, count: 0 };
    entry.count += 1;
    counts.set(v.apiKeyId, entry);
  }

  return Array.from(counts.entries())
    .map(([apiKeyId, v]) => ({ apiKeyId, ownerName: v.ownerName, violationCount: v.count }))
    .sort((a, b) => b.violationCount - a.violationCount)
    .slice(0, 10);
}
