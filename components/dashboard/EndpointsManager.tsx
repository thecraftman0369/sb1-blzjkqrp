'use client';

import { useState, useTransition } from 'react';
import { createEndpoint, deleteEndpoint, updateEndpoint } from '@/lib/actions';
import type { Endpoint } from '@/lib/types';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

function EndpointForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  defaultValues?: Partial<Endpoint>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => onSubmit(formData))}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:items-end"
    >
      <label className="flex flex-col gap-1 text-xs text-muted">
        Path
        <input
          name="path"
          type="text"
          defaultValue={defaultValues?.path}
          placeholder="/v1/example"
          required
          className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Method
        <select
          name="method"
          defaultValue={defaultValues?.method ?? 'GET'}
          className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Cost multiplier
        <input
          name="cost_multiplier"
          type="number"
          min="1"
          step="1"
          defaultValue={defaultValues?.cost_multiplier ?? 1}
          required
          className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-50"
        >
          {isPending ? '...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-xs text-muted hover:text-foreground">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function EndpointRow({ endpoint }: { endpoint: Endpoint }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <tr className="border-b border-border/60 bg-surface-raised/40">
        <td colSpan={4} className="py-3">
          <EndpointForm
            defaultValues={endpoint}
            submitLabel="Save"
            onCancel={() => setEditing(false)}
            onSubmit={async (formData) => {
              await updateEndpoint(endpoint.id, formData);
              setEditing(false);
            }}
          />
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="py-3 pr-4 font-mono text-xs text-muted">{endpoint.method}</td>
      <td className="py-3 pr-4 font-medium text-foreground">{endpoint.path}</td>
      <td className="py-3 pr-4 tabular-nums text-muted">{endpoint.cost_multiplier}x</td>
      <td className="py-3 pr-4">
        <div className="flex gap-3 text-xs">
          <button type="button" onClick={() => setEditing(true)} className="text-accent hover:underline">
            Edit
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => deleteEndpoint(endpoint.id))}
            className="text-danger hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export function EndpointsManager({ endpoints }: { endpoints: Endpoint[] }) {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="py-2 pr-4 font-medium">Method</th>
              <th className="py-2 pr-4 font-medium">Path</th>
              <th className="py-2 pr-4 font-medium">Cost</th>
              <th className="py-2 pr-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((endpoint) => (
              <EndpointRow key={endpoint.id} endpoint={endpoint} />
            ))}
          </tbody>
        </table>
      </div>

      {showNew ? (
        <div className="rounded-lg border border-border bg-surface-raised/40 p-4">
          <EndpointForm
            submitLabel="Create endpoint"
            onCancel={() => setShowNew(false)}
            onSubmit={async (formData) => {
              await createEndpoint(formData);
              setShowNew(false);
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="self-start rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
        >
          + New endpoint
        </button>
      )}
    </div>
  );
}
