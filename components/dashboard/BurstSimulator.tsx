'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface KeyOption {
  id: string;
  keyValue: string;
  ownerName: string;
  planName: string;
}

interface EndpointOption {
  id: string;
  path: string;
  method: string;
}

interface RequestOutcome {
  status: number;
  category: 'accepted' | 'rate_limited' | 'blocked' | 'error';
}

interface TestResult {
  count: number;
  endpointLabel: string;
  keyLabel: string;
  accepted: number;
  rateLimited: number;
  blocked: number;
  errored: number;
  elapsedMs: number;
  ranAt: string;
}

function categorize(status: number): RequestOutcome['category'] {
  if (status === 429) return 'rate_limited';
  if (status === 401 || status === 403) return 'blocked';
  if (status >= 200 && status < 300) return 'accepted';
  return 'error';
}

async function fireOne(endpoint: EndpointOption, keyValue: string): Promise<RequestOutcome> {
  try {
    const res = await fetch(`/api${endpoint.path}`, {
      method: endpoint.method,
      headers: {
        'x-api-key': keyValue,
        ...(endpoint.method !== 'GET' ? { 'content-type': 'application/json' } : {}),
      },
      body: endpoint.method !== 'GET' ? '{}' : undefined,
    });
    return { status: res.status, category: categorize(res.status) };
  } catch {
    return { status: 0, category: 'error' };
  }
}

export function BurstSimulator({ keys, endpoints }: { keys: KeyOption[]; endpoints: EndpointOption[] }) {
  const [count, setCount] = useState(50);
  const [endpointId, setEndpointId] = useState(endpoints[0]?.id ?? '');
  const [keyId, setKeyId] = useState(keys[0]?.id ?? '');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const selectedEndpoint = endpoints.find((e) => e.id === endpointId);
  const selectedKey = keys.find((k) => k.id === keyId);

  async function runTest() {
    if (!selectedEndpoint || !selectedKey || running) return;
    setRunning(true);

    const started = performance.now();
    const outcomes = await Promise.all(
      Array.from({ length: count }, () => fireOne(selectedEndpoint, selectedKey.keyValue))
    );
    const elapsedMs = Math.round(performance.now() - started);

    const tally = { accepted: 0, rateLimited: 0, blocked: 0, errored: 0 };
    for (const o of outcomes) {
      if (o.category === 'accepted') tally.accepted += 1;
      else if (o.category === 'rate_limited') tally.rateLimited += 1;
      else if (o.category === 'blocked') tally.blocked += 1;
      else tally.errored += 1;
    }

    setResult({
      count,
      endpointLabel: `${selectedEndpoint.method} ${selectedEndpoint.path}`,
      keyLabel: `${selectedKey.ownerName} (${selectedKey.planName})`,
      accepted: tally.accepted,
      rateLimited: tally.rateLimited,
      blocked: tally.blocked,
      errored: tally.errored,
      elapsedMs,
      ranAt: new Date().toISOString(),
    });
    setRunning(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Requests
          <input
            type="number"
            min={1}
            max={2000}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(2000, Number(e.target.value) || 1)))}
            className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Target endpoint
          <select
            value={endpointId}
            onChange={(e) => setEndpointId(e.target.value)}
            className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
          >
            {endpoints.map((e) => (
              <option key={e.id} value={e.id}>
                {e.method} {e.path}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          API key
          <select
            value={keyId}
            onChange={(e) => setKeyId(e.target.value)}
            className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
          >
            {keys.map((k) => (
              <option key={k.id} value={k.id}>
                {k.ownerName} — {k.planName}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={runTest}
          disabled={running || !selectedEndpoint || !selectedKey}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          {running ? `Firing ${count} requests…` : 'Run Test'}
        </button>
      </div>

      {result && (
        <div className="rounded-xl border border-border bg-surface-raised/40 p-5">
          <div className="mb-1 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-foreground">Last test results</h3>
            <span className="text-xs text-muted">{new Date(result.ranAt).toLocaleTimeString()}</span>
          </div>
          <p className="mb-4 text-xs text-muted">
            {result.count} concurrent requests → {result.endpointLabel} as {result.keyLabel}, completed in{' '}
            {result.elapsedMs}ms
          </p>

          <SplitBar result={result} />

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultTile label="Accepted" value={result.accepted} tone="success" />
            <ResultTile label="Rate limited" value={result.rateLimited} tone="warning" />
            <ResultTile label="Blocked" value={result.blocked} tone="danger" />
            <ResultTile label="Errors" value={result.errored} tone="neutral" />
          </div>
        </div>
      )}
    </div>
  );
}

function SplitBar({ result }: { result: TestResult }) {
  const total = result.count || 1;
  const segments = [
    { key: 'accepted', value: result.accepted, className: 'bg-success' },
    { key: 'rateLimited', value: result.rateLimited, className: 'bg-warning' },
    { key: 'blocked', value: result.blocked, className: 'bg-danger' },
    { key: 'errored', value: result.errored, className: 'bg-muted' },
  ].filter((s) => s.value > 0);

  return (
    <div className="flex h-4 w-full overflow-hidden rounded-full bg-surface">
      {segments.map((s) => (
        <div
          key={s.key}
          className={clsx('h-full', s.className)}
          style={{ width: `${(s.value / total) * 100}%` }}
          title={`${s.key}: ${s.value}`}
        />
      ))}
    </div>
  );
}

function ResultTile({ label, value, tone }: { label: string; value: number; tone: 'success' | 'warning' | 'danger' | 'neutral' }) {
  const toneClass =
    tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-danger' : 'text-muted';
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className={clsx('mt-1 text-lg font-semibold tabular-nums', toneClass)}>{value}</p>
    </div>
  );
}
