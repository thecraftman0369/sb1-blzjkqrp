import { fakeEndpointResponse } from '@/lib/fakeEndpoint';

export async function GET(request: Request) {
  return fakeEndpointResponse(request, {
    data: { pageViews: 48213, uniqueVisitors: 9021, conversionRate: 0.032 },
  });
}
