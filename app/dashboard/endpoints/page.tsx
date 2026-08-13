import { Card, CardHeader } from '@/components/ui/Card';
import { EndpointsManager } from '@/components/dashboard/EndpointsManager';
import { createServiceClient } from '@/lib/supabase/server';
import type { Endpoint } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EndpointsPage() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('endpoints').select('*').order('path', { ascending: true });
  const endpoints = (data ?? []) as Endpoint[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Endpoints</h1>
        <p className="mt-1 text-sm text-muted">Fake API routes and their token-bucket cost multipliers.</p>
      </div>

      <Card>
        <CardHeader title="Registered endpoints" />
        <EndpointsManager endpoints={endpoints} />
      </Card>
    </div>
  );
}
