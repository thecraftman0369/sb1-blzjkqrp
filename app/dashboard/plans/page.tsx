import { Card, CardHeader } from '@/components/ui/Card';
import { PlansManager } from '@/components/dashboard/PlansManager';
import { createServiceClient } from '@/lib/supabase/server';
import type { Plan } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function PlansPage() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('plans').select('*').order('requests_per_minute', { ascending: true });
  const plans = (data ?? []) as Plan[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Plans</h1>
        <p className="mt-1 text-sm text-muted">Rate limit tiers applied to API keys.</p>
      </div>

      <Card>
        <CardHeader title="Plan tiers" />
        <PlansManager plans={plans} />
      </Card>
    </div>
  );
}
