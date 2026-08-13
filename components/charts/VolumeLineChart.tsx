'use client';

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_CHROME_DARK, STATUS_DARK } from '@/lib/chartColors';
import type { VolumePoint } from '@/lib/dashboardQueries';

export function VolumeLineChart({ data }: { data: VolumePoint[] }) {
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={CHART_CHROME_DARK.gridline} vertical={false} />
        <XAxis
          dataKey="bucket"
          stroke={CHART_CHROME_DARK.axis}
          tick={{ fill: CHART_CHROME_DARK.mutedText, fontSize: 11 }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          stroke={CHART_CHROME_DARK.axis}
          tick={{ fill: CHART_CHROME_DARK.mutedText, fontSize: 11 }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#191c24',
            border: `1px solid ${CHART_CHROME_DARK.gridline}`,
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: CHART_CHROME_DARK.mutedText }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: CHART_CHROME_DARK.mutedText }} />
        <Line
          type="monotone"
          dataKey="allowed"
          name="Allowed"
          stroke={STATUS_DARK.good}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="rateLimited"
          name="Rate limited"
          stroke={STATUS_DARK.warning}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-muted">
      No requests logged yet — hit a /api/v1/* route or run the burst simulator
    </div>
  );
}
