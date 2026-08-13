import { fakeEndpointResponse } from '@/lib/fakeEndpoint';

export async function POST(request: Request) {
  return fakeEndpointResponse(request, {
    data: { paymentId: `pay_${Date.now()}`, status: 'succeeded' },
  });
}
