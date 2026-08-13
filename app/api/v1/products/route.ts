import { fakeEndpointResponse } from '@/lib/fakeEndpoint';

export async function GET(request: Request) {
  return fakeEndpointResponse(request, {
    data: [
      { id: 101, name: 'Wireless Mouse', price: 29.99 },
      { id: 102, name: 'Mechanical Keyboard', price: 89.99 },
      { id: 103, name: 'USB-C Hub', price: 44.5 },
    ],
  });
}
