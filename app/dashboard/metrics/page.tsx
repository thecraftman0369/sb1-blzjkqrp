import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getApiKeysWithUsage, getTopOffenders } from '@/lib/dashboardQueries';

export const dynamic = 'force-dynamic';

export default async function MetricsPage() {
  const [keys, offenders] = await Promise.all([getApiKeysWithUsage(), getTopOffenders()]);

  const byUsage = [...keys].sort((a, b) => {
    const pctA = a.monthlyQuota > 0 ? a.requestsThisMonth / a.monthlyQuota : 0;
    const pctB = b.monthlyQuota > 0 ? b.requestsThisMonth / b.monthlyQuota : 0;
    return pctB - pctA;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Metrics</h1>
        <p className="mt-1 text-sm text-muted">Quota consumption and repeat offenders.</p>
      </div>

      <Card>
        <CardHeader title="Monthly quota usage" subtitle="Allowed requests this month vs. plan monthly_quota" />
        <div className="flex flex-col gap-4">
          {byUsage.map((key) => {
            const pct = key.monthlyQuota > 0 ? (key.requestsThisMonth / key.monthlyQuota) * 100 : 0;
            return (
              <div key={key.id} className="flex items-center gap-4">
                <div className="w-56 shrink-0">
                  <p className="truncate text-sm font-medium text-foreground">{key.ownerName}</p>
                  <p className="text-xs text-muted">{key.planName}</p>
                </div>
                <div className="flex-1">
                  <ProgressBar value={pct} tone={pct > 90 ? 'danger' : pct > 70 ? 'warning' : 'accent'} />
                </div>
                <div className="w-32 shrink-0 text-right text-xs tabular-nums text-muted">
                  {key.requestsThisMonth.toLocaleString()} / {key.monthlyQuota.toLocaleString()} ({Math.round(pct)}%)
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Top offenders" subtitle="Ranked by total violations recorded" />
        {offenders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No violations recorded yet.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {offenders.map((o, i) => (
              <li
                key={o.apiKeyId}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-sm font-semibold text-muted tabular-nums">{i + 1}</span>
                  <span className="text-sm font-medium text-foreground">{o.ownerName}</span>
                </div>
                <Badge tone={o.violationCount >= 5 ? 'danger' : 'warning'}>
                  {o.violationCount} violation{o.violationCount === 1 ? '' : 's'}
                </Badge>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}
