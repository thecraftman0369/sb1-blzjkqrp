import { clsx } from 'clsx';

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
  neutral: 'bg-muted/15 text-muted border-muted/30',
  accent: 'bg-accent/15 text-accent border-accent/30',
};

export function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
        TONE_CLASSES[tone]
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<string, Tone> = {
  active: 'success',
  allowed: 'success',
  blocked: 'danger',
  rate_limited: 'warning',
  revoked: 'neutral',
  warning: 'warning',
  critical: 'danger',
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{status.replace('_', ' ')}</Badge>;
}
