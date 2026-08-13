'use client';

import { useState, useTransition } from 'react';
import { createPlan, deletePlan, updatePlan } from '@/lib/actions';
import type { Plan } from '@/lib/types';

function PlanForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  defaultValues?: Partial<Plan>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => onSubmit(formData))}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:items-end"
    >
      <Field label="Name" name="name" defaultValue={defaultValues?.name} type="text" />
      <Field label="Req/min" name="requests_per_minute" defaultValue={defaultValues?.requests_per_minute} type="number" />
      <Field label="Req/hour" name="requests_per_hour" defaultValue={defaultValues?.requests_per_hour} type="number" />
      <Field label="Req/day" name="requests_per_day" defaultValue={defaultValues?.requests_per_day} type="number" />
      <Field label="Monthly quota" name="monthly_quota" defaultValue={defaultValues?.monthly_quota} type="number" />
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

function Field({
  label,
  name,
  defaultValue,
  type,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type: 'text' | 'number';
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      {label}
      <input
        name={name}
        type={type}
        step={type === 'number' ? '1' : undefined}
        min={type === 'number' ? '0' : undefined}
        defaultValue={defaultValue}
        required
        className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
      />
    </label>
  );
}

function PlanRow({ plan }: { plan: Plan }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <tr className="border-b border-border/60 bg-surface-raised/40">
        <td colSpan={6} className="py-3">
          <PlanForm
            defaultValues={plan}
            submitLabel="Save"
            onCancel={() => setEditing(false)}
            onSubmit={async (formData) => {
              await updatePlan(plan.id, formData);
              setEditing(false);
            }}
          />
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="py-3 pr-4 font-medium text-foreground">{plan.name}</td>
      <td className="py-3 pr-4 tabular-nums text-muted">{plan.requests_per_minute}/min</td>
      <td className="py-3 pr-4 tabular-nums text-muted">{plan.requests_per_hour}/hr</td>
      <td className="py-3 pr-4 tabular-nums text-muted">{plan.requests_per_day}/day</td>
      <td className="py-3 pr-4 tabular-nums text-muted">{plan.monthly_quota.toLocaleString()}/mo</td>
      <td className="py-3 pr-4">
        <div className="flex gap-3 text-xs">
          <button type="button" onClick={() => setEditing(true)} className="text-accent hover:underline">
            Edit
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => deletePlan(plan.id))}
            className="text-danger hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export function PlansManager({ plans }: { plans: Plan[] }) {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Per minute</th>
              <th className="py-2 pr-4 font-medium">Per hour</th>
              <th className="py-2 pr-4 font-medium">Per day</th>
              <th className="py-2 pr-4 font-medium">Monthly quota</th>
              <th className="py-2 pr-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <PlanRow key={plan.id} plan={plan} />
            ))}
          </tbody>
        </table>
      </div>

      {showNew ? (
        <div className="rounded-lg border border-border bg-surface-raised/40 p-4">
          <PlanForm
            submitLabel="Create plan"
            onCancel={() => setShowNew(false)}
            onSubmit={async (formData) => {
              await createPlan(formData);
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
          + New plan
        </button>
      )}
    </div>
  );
}
