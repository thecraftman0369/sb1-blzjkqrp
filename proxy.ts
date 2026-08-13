import { NextResponse, type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rateLimiter';
import { RATE_LIMIT_HEADERS } from '@/lib/apiContext';

export const config = {
  matcher: ['/api/v1/:path*'],
};

const AUTO_BLOCK_THRESHOLD = 5;
const AUTO_BLOCK_WINDOW_MINUTES = 10;

// Endpoint metadata (path/method -> id) barely ever changes — a plain admin
// CRUD action — so it's safe to cache briefly to cut a DB round trip off
// every request. api_keys status is deliberately NOT cached here: the
// auto-block rule below needs a freshly-blocked key to start getting 403s
// on its very next request, not after some cache TTL expires.
const ENDPOINT_CACHE_TTL_MS = 60_000;
const endpointCache = new Map<string, { id: string; expiresAt: number }>();

async function resolveEndpointId(path: string, method: string): Promise<string | null> {
  const cacheKey = `${method} ${path}`;
  const cached = endpointCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.id;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('endpoints')
    .select('id')
    .eq('path', path)
    .eq('method', method)
    .single();

  if (!data) return null;

  endpointCache.set(cacheKey, { id: data.id, expiresAt: Date.now() + ENDPOINT_CACHE_TTL_MS });
  return data.id;
}

function errorResponse(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status });
}

export async function proxy(request: NextRequest) {
  const apiKeyValue = request.headers.get('x-api-key');
  if (!apiKeyValue) {
    return errorResponse(401, 'Unauthorized', { message: 'Missing x-api-key header' });
  }

  const supabase = createServiceClient();

  const { data: apiKey } = await supabase
    .from('api_keys')
    .select('id, status')
    .eq('key_value', apiKeyValue)
    .single();

  if (!apiKey) {
    return errorResponse(401, 'Unauthorized', { message: 'Invalid API key' });
  }

  if (apiKey.status === 'blocked' || apiKey.status === 'revoked') {
    return errorResponse(403, 'Forbidden', { message: `API key is ${apiKey.status}` });
  }

  // Strip the leading /api so the lookup matches endpoints.path, which is
  // seeded as the logical API path ("/v1/users"), not the Next.js route
  // path ("/api/v1/users").
  const endpointPath = request.nextUrl.pathname.replace(/^\/api/, '');
  const endpointId = await resolveEndpointId(endpointPath, request.method);

  if (!endpointId) {
    return errorResponse(404, 'Not Found', { message: `No endpoint registered for ${request.method} ${endpointPath}` });
  }

  const result = await checkRateLimit(apiKey.id, endpointId);

  if (result.allowed) {
    await supabase.from('usage_log').insert({
      api_key_id: apiKey.id,
      endpoint_id: endpointId,
      status: 'allowed',
    });

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(RATE_LIMIT_HEADERS.remaining, String(result.remaining));
    requestHeaders.set(RATE_LIMIT_HEADERS.limit, String(result.limit));
    requestHeaders.set(RATE_LIMIT_HEADERS.reset, result.resetsAt);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set(RATE_LIMIT_HEADERS.remaining, String(result.remaining));
    response.headers.set(RATE_LIMIT_HEADERS.limit, String(result.limit));
    response.headers.set(RATE_LIMIT_HEADERS.reset, result.resetsAt);
    return response;
  }

  // Blocked by rate limit: log it, record a violation, and check whether
  // this key has crossed the auto-block threshold.
  await supabase.from('usage_log').insert({
    api_key_id: apiKey.id,
    endpoint_id: endpointId,
    status: 'rate_limited',
  });

  const breachedWindows = (Object.entries(result.windows) as [string, { remaining: number }][])
    .filter(([, w]) => w.remaining < result.cost)
    .map(([name]) => name);
  const severity = breachedWindows.includes('hour') || breachedWindows.includes('day') ? 'critical' : 'warning';

  await supabase.from('violations').insert({
    api_key_id: apiKey.id,
    endpoint_id: endpointId,
    severity,
  });

  const since = new Date(Date.now() - AUTO_BLOCK_WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await supabase
    .from('violations')
    .select('id', { count: 'exact', head: true })
    .eq('api_key_id', apiKey.id)
    .gte('timestamp', since);

  if ((count ?? 0) >= AUTO_BLOCK_THRESHOLD) {
    await supabase.from('api_keys').update({ status: 'blocked' }).eq('id', apiKey.id);
  }

  const retryAfter = Math.max(1, Math.ceil((new Date(result.resetsAt).getTime() - Date.now()) / 1000));

  return NextResponse.json(
    { error: 'Too Many Requests', retryAfter, limit: result.limit, resetsAt: result.resetsAt },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}
