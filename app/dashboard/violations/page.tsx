import { Card, CardHeader } from '@/components/ui/Card';
import { ViolationsTable } from '@/components/dashboard/ViolationsTable';
import { getViolations } from '@/lib/dashboardQueries';

export const dynamic = 'force-dynamic';

export default async function ViolationsPage() {
  const violations = await getViolations();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Violations</h1>
        <p className="mt-1 text-sm text-muted">
          Most recent {violations.length} rate-limit breaches. 5+ in a 10-minute window auto-blocks the key.
        </p>
      </div>

      <Card>
        <CardHeader title="Violation log" />
        <ViolationsTable violations={violations} />
      </Card>
    </div>
  );
}
