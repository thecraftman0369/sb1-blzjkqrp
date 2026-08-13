import { NextResponse } from 'next/server';
import { readRateLimitContext } from '@/lib/apiContext';

/** Wraps a dummy payload with the rate-limit verdict middleware.ts already computed. */
export function fakeEndpointResponse(request: Request, data: Record<string, unknown>) {
  const rateLimit = readRateLimitContext(request);
  return NextResponse.json(
    { success: true, ...data, rateLimit },
    {
      headers: {
        [`x-ratelimit-remaining`]: String(rateLimit.remaining),
        [`x-ratelimit-limit`]: String(rateLimit.limit),
        [`x-ratelimit-reset`]: rateLimit.resetsAt,
      },
    }
  );
}
