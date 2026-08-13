import { fakeEndpointResponse } from '@/lib/fakeEndpoint';

export async function POST(request: Request) {
  return fakeEndpointResponse(request, {
    data: { orderId: `ord_${Date.now()}`, status: 'created' },
  });
}
