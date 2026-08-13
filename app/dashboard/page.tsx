import { Card, CardHeader } from '@/components/ui/Card';
import { StatTile } from '@/components/ui/StatTile';
import { PlanDonutChart } from '@/components/charts/PlanDonutChart';
import { VolumeLineChart } from '@/components/charts/VolumeLineChart';
import { EndpointBarChart } from '@/components/charts/EndpointBarChart';
import {
  getBusiestEndpoints,
  getOverviewStats,
  getRequestsByPlan,
  getVolumeOverTime,
} from '@/lib/dashboardQueries';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const [stats, byPlan, volume, endpoints] = await Promise.all([
    getOverviewStats(),
    getRequestsByPlan(),
    getVolumeOverTime(),
    getBusiestEndpoints(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted">Live enforcement data from usage_log and violations.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile label="Total requests" value={stats.totalRequests.toLocaleString()} />
        <StatTile label="Allowed" value={stats.allowedRequests.toLocaleString()} tone="success" />
        <StatTile label="Rate limited" value={stats.rateLimitedRequests.toLocaleString()} tone="warning" />
        <StatTile label="Active API keys" value={stats.activeKeys.toLocaleString()} />
        <StatTile label="Avg rate (last hr)" value={`${stats.avgRequestsPerMinute}/min`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Requests by plan" subtitle="Share of logged requests per plan tier" />
          <PlanDonutChart data={byPlan} />
        </Card>
        <Card>
          <CardHeader title="Busiest endpoints" subtitle="Most-hit routes by request count" />
          <EndpointBarChart data={endpoints} />
        </Card>
      </div>

      <Card>
        <CardHeader title="Request volume over time" subtitle="Allowed vs. rate-limited, bucketed by minute" />
        <VolumeLineChart data={volume} />
      </Card>
    </div>
  );
}
