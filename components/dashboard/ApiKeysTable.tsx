'use client';

import { useState, useTransition } from 'react';
import { StatusBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { createApiKey, setApiKeyStatus, updateOverrideMultiplier } from '@/lib/actions';
import type { ApiKeyRow } from '@/lib/dashboardQueries';

interface PlanOption {
  id: string;
  name: string;
}

function maskKey(value: string) {
  if (value.length <= 8) return value;
  return `${value.slice(0, 8)}${'•'.repeat(8)}`;
}

function formatDate(iso: string | null) {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function KeyValueCell({ value }: { value: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setRevealed((r) => !r)}
      className="font-mono text-xs text-muted hover:text-foreground"
      title={revealed ? 'Click to hide' : 'Click to reveal'}
    >
      {revealed ? value : maskKey(value)}
    </button>
  );
}

function OverrideMultiplierCell({ apiKeyId, value }: { apiKeyId: string; value: number | null }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value != null ? String(value) : '');
  const [isPending, startTransition] = useTransition();

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs text-muted underline decoration-dotted hover:text-foreground"
      >
        {value != null ? `${value}x` : 'default'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        step="0.1"
        min="0"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-16 rounded border border-border bg-surface-raised px-1.5 py-0.5 text-xs text-foreground"
        placeholder="1.0"
        autoFocus
      />
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const parsed = input.trim() === '' ? null : Number(input);
            await updateOverrideMultiplier(apiKeyId, parsed);
            setEditing(false);
          })
        }
        className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground disabled:opacity-50"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-xs text-muted hover:text-foreground"
      >
        Cancel
      </button>
    </div>
  );
}

function BlockToggleButton({ apiKeyId, status }: { apiKeyId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const blocked = status === 'blocked';

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setApiKeyStatus(apiKeyId, blocked ? 'active' : 'blocked');
        })
      }
      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
        blocked
          ? 'border-success/30 text-success hover:bg-success/10'
          : 'border-danger/30 text-danger hover:bg-danger/10'
      }`}
    >
      {isPending ? '...' : blocked ? 'Unblock' : 'Block'}
    </button>
  );
}

function NewKeyForm({ plans, onDone }: { plans: PlanOption[]; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(async () => {
        await createApiKey(formData);
        onDone();
      })}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:items-end"
    >
      <label className="flex flex-col gap-1 text-xs text-muted">
        Owner name
        <input
          name="owner_name"
          type="text"
          placeholder="e.g. Staging Integration"
          required
          className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Plan
        <select
          name="plan_id"
          required
          className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-50"
        >
          {isPending ? '...' : 'Create key'}
        </button>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-1.5 text-xs text-muted hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ApiKeysTable({ keys, plans }: { keys: ApiKeyRow[]; plans: PlanOption[] }) {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="py-2 pr-4 font-medium">Owner</th>
              <th className="py-2 pr-4 font-medium">Key</th>
              <th className="py-2 pr-4 font-medium">Plan</th>
              <th className="py-2 pr-4 font-medium">Monthly usage</th>
              <th className="py-2 pr-4 font-medium">Limit/min</th>
              <th className="py-2 pr-4 font-medium">Override</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Last used</th>
              <th className="py-2 pr-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => {
              const pct = key.monthlyQuota > 0 ? (key.requestsThisMonth / key.monthlyQuota) * 100 : 0;
              return (
                <tr key={key.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-foreground">{key.ownerName}</td>
                  <td className="py-3 pr-4">
                    <KeyValueCell value={key.keyValue} />
                  </td>
                  <td className="py-3 pr-4 text-muted">{key.planName}</td>
                  <td className="py-3 pr-4">
                    <div className="w-32">
                      <div className="mb-1 flex justify-between text-xs text-muted tabular-nums">
                        <span>{key.requestsThisMonth.toLocaleString()}</span>
                        <span>{key.monthlyQuota.toLocaleString()}</span>
                      </div>
                      <ProgressBar value={pct} tone={pct > 90 ? 'danger' : pct > 70 ? 'warning' : 'accent'} />
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted tabular-nums">{key.requestsPerMinute}/min</td>
                  <td className="py-3 pr-4">
                    <OverrideMultiplierCell apiKeyId={key.id} value={key.overrideMultiplier} />
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={key.status} />
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted">{formatDate(key.lastUsedAt)}</td>
                  <td className="py-3 pr-4">
                    <BlockToggleButton apiKeyId={key.id} status={key.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showNew ? (
        <div className="rounded-lg border border-border bg-surface-raised/40 p-4">
          <NewKeyForm plans={plans} onDone={() => setShowNew(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNew(true)}
          disabled={plans.length === 0}
          className="self-start rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground disabled:opacity-50"
        >
          + New API key
        </button>
      )}
    </div>
  );
}
