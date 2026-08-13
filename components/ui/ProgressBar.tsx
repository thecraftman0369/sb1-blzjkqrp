import { clsx } from 'clsx';

export function ProgressBar({ value, tone = 'accent' }: { value: number; tone?: 'accent' | 'warning' | 'danger' }) {
  const pct = Math.max(0, Math.min(100, value));
  const barClass = tone === 'danger' ? 'bg-danger' : tone === 'warning' ? 'bg-warning' : 'bg-accent';

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
      <div className={clsx('h-full rounded-full transition-all', barClass)} style={{ width: `${pct}%` }} />
    </div>
  );
}
