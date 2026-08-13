import { fakeEndpointResponse } from '@/lib/fakeEndpoint';

export async function GET(request: Request) {
  return fakeEndpointResponse(request, {
    data: [
      { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
      { id: 2, name: 'Alan Turing', email: 'alan@example.com' },
      { id: 3, name: 'Grace Hopper', email: 'grace@example.com' },
    ],
  });
}
