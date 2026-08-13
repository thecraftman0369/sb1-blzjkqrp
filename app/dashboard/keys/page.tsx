import { Card, CardHeader } from '@/components/ui/Card';
import { ApiKeysTable } from '@/components/dashboard/ApiKeysTable';
import { createServiceClient } from '@/lib/supabase/server';
import { getApiKeysWithUsage } from '@/lib/dashboardQueries';

export const dynamic = 'force-dynamic';

export default async function ApiKeysPage() {
  const supabase = createServiceClient();
  const [keys, { data: plansData }] = await Promise.all([
    getApiKeysWithUsage(),
    supabase.from('plans').select('id, name').order('name', { ascending: true }),
  ]);
  const plans = (plansData ?? []) as Array<{ id: string; name: string }>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">API Keys</h1>
        <p className="mt-1 text-sm text-muted">{keys.length} keys across all plans.</p>
      </div>

      <Card>
        <CardHeader title="All keys" subtitle="Monthly usage is measured against requests_log since the start of the calendar month" />
        <ApiKeysTable keys={keys} plans={plans} />
      </Card>
    </div>
  );
}
