import { clsx } from 'clsx';

export function StatTile({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const toneClass =
    tone === 'success'
      ? 'text-success'
      : tone === 'warning'
        ? 'text-warning'
        : tone === 'danger'
          ? 'text-danger'
          : 'text-foreground';

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={clsx('mt-2 text-2xl font-semibold tabular-nums', toneClass)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
