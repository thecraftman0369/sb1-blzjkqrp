/**
 * Header contract between middleware.ts and the fake /api/v1/* route
 * handlers. Middleware does the one-and-only checkRateLimit() call (it
 * atomically decrements buckets — calling it again in the handler would
 * double-spend), then forwards the verdict to the handler via request
 * headers so the handler can echo remaining/limit/resetsAt in its JSON
 * body without re-querying anything.
 */
export const RATE_LIMIT_HEADERS = {
  remaining: 'x-ratelimit-remaining',
  limit: 'x-ratelimit-limit',
  reset: 'x-ratelimit-reset',
} as const;

export interface RateLimitContext {
  remaining: number;
  limit: number;
  resetsAt: string;
}

export function readRateLimitContext(request: Request): RateLimitContext {
  return {
    remaining: Number(request.headers.get(RATE_LIMIT_HEADERS.remaining) ?? 0),
    limit: Number(request.headers.get(RATE_LIMIT_HEADERS.limit) ?? 0),
    resetsAt: request.headers.get(RATE_LIMIT_HEADERS.reset) ?? new Date().toISOString(),
  };
}
