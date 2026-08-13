'use client';

import { useMemo, useState } from 'react';
import { StatusBadge } from '@/components/ui/Badge';
import type { ViolationRow } from '@/lib/dashboardQueries';

type SortKey = 'ownerName' | 'endpoint' | 'severity' | 'timestamp';
type SortDir = 'asc' | 'desc';

export function ViolationsTable({ violations }: { violations: ViolationRow[] }) {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'warning' | 'critical'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const rows = useMemo(() => {
    let filtered = violations;
    if (severityFilter !== 'all') {
      filtered = filtered.filter((v) => v.severity === severityFilter);
    }
    return [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      return a[sortKey] < b[sortKey] ? -1 * dir : a[sortKey] > b[sortKey] ? 1 * dir : 0;
    });
  }, [violations, severityFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortHeader({ label, sortableKey }: { label: string; sortableKey: SortKey }) {
    const active = sortKey === sortableKey;
    return (
      <th className="py-2 pr-4 font-medium">
        <button
          type="button"
          onClick={() => toggleSort(sortableKey)}
          className={`flex items-center gap-1 ${active ? 'text-foreground' : ''}`}
        >
          {label}
          {active && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
        </button>
      </th>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted">Severity:</span>
        {(['all', 'warning', 'critical'] as const).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setSeverityFilter(tier)}
            className={`rounded-full border px-2.5 py-1 capitalize ${
              severityFilter === tier
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-muted hover:text-foreground'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <SortHeader label="API key" sortableKey="ownerName" />
              <SortHeader label="Endpoint" sortableKey="endpoint" />
              <SortHeader label="Severity" sortableKey="severity" />
              <SortHeader label="Time" sortableKey="timestamp" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted">
                  No violations recorded yet.
                </td>
              </tr>
            )}
            {rows.map((v) => (
              <tr key={v.id} className="border-b border-border/60 last:border-0">
                <td className="py-3 pr-4 font-medium text-foreground">{v.ownerName}</td>
                <td className="py-3 pr-4 font-mono text-xs text-muted">{v.endpoint}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={v.severity} />
                </td>
                <td className="py-3 pr-4 text-xs text-muted">{new Date(v.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
