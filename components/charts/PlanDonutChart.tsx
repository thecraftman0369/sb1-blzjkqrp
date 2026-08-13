'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { categoricalColor, CHART_CHROME_DARK } from '@/lib/chartColors';
import type { PlanBreakdownEntry } from '@/lib/dashboardQueries';

export function PlanDonutChart({ data }: { data: PlanBreakdownEntry[] }) {
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="plan"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          strokeWidth={2}
          stroke={CHART_CHROME_DARK.gridline}
        >
          {data.map((entry, i) => (
            <Cell key={entry.plan} fill={categoricalColor(i)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#191c24',
            border: `1px solid ${CHART_CHROME_DARK.gridline}`,
            borderRadius: 8,
            fontSize: 12,
          }}
          itemStyle={{ color: CHART_CHROME_DARK.primaryText }}
        />
        <Legend
          verticalAlign="bottom"
          height={32}
          wrapperStyle={{ fontSize: 12, color: CHART_CHROME_DARK.mutedText }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-muted">
      No requests logged yet
    </div>
  );
}
