import { fakeEndpointResponse } from '@/lib/fakeEndpoint';

export async function POST(request: Request) {
  return fakeEndpointResponse(request, {
    data: { token: `tok_${Math.random().toString(36).slice(2)}`, expiresIn: 3600 },
  });
}
