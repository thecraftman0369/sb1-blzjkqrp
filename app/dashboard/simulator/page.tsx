import { Card, CardHeader } from '@/components/ui/Card';
import { BurstSimulator } from '@/components/dashboard/BurstSimulator';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function SimulatorPage() {
  const supabase = createServiceClient();

  const [{ data: keysData }, { data: endpointsData }] = await Promise.all([
    supabase
      .from('api_keys')
      .select('id, key_value, owner_name, status, plans(name)')
      .order('owner_name', { ascending: true }),
    supabase.from('endpoints').select('id, path, method').order('path', { ascending: true }),
  ]);

  const keys = ((keysData ?? []) as unknown as Array<{
    id: string;
    key_value: string;
    owner_name: string;
    status: string;
    plans: { name: string } | null;
  }>).map((k) => ({
    id: k.id,
    keyValue: k.key_value,
    ownerName: k.status === 'active' ? k.owner_name : `${k.owner_name} (${k.status})`,
    planName: k.plans?.name ?? 'Unknown',
  }));

  const endpoints = ((endpointsData ?? []) as Array<{ id: string; path: string; method: string }>).map((e) => ({
    id: e.id,
    path: e.path,
    method: e.method,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Burst Simulator</h1>
        <p className="mt-1 text-sm text-muted">
          Fires real, concurrent requests at the live /api/v1/* routes — this is the actual enforcement path, not a
          mock. Results show up in Overview, Violations, and Metrics right after the run.
        </p>
      </div>

      <Card>
        <CardHeader title="Configure test" />
        <BurstSimulator keys={keys} endpoints={endpoints} />
      </Card>
    </div>
  );
}
