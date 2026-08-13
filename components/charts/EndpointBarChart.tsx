'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_CHROME_DARK, SEQUENTIAL_BLUE_DARK } from '@/lib/chartColors';
import type { EndpointBreakdownEntry } from '@/lib/dashboardQueries';

export function EndpointBarChart({ data }: { data: EndpointBreakdownEntry[] }) {
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={CHART_CHROME_DARK.gridline} horizontal={false} />
        <XAxis
          type="number"
          stroke={CHART_CHROME_DARK.axis}
          tick={{ fill: CHART_CHROME_DARK.mutedText, fontSize: 11 }}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="endpoint"
          stroke={CHART_CHROME_DARK.axis}
          tick={{ fill: CHART_CHROME_DARK.mutedText, fontSize: 11 }}
          tickLine={false}
          width={130}
        />
        <Tooltip
          contentStyle={{
            background: '#191c24',
            border: `1px solid ${CHART_CHROME_DARK.gridline}`,
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: CHART_CHROME_DARK.mutedText }}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />
        <Bar dataKey="count" name="Requests" fill={SEQUENTIAL_BLUE_DARK} radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-muted">
      No requests logged yet
    </div>
  );
}
