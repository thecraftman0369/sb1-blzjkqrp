'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/keys', label: 'API Keys' },
  { href: '/dashboard/plans', label: 'Plans' },
  { href: '/dashboard/endpoints', label: 'Endpoints' },
  { href: '/dashboard/violations', label: 'Violations' },
  { href: '/dashboard/metrics', label: 'Metrics' },
  { href: '/dashboard/simulator', label: 'Burst Simulator' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="px-5 py-5">
        <p className="text-sm font-semibold text-foreground">Rate Limiter</p>
        <p className="text-xs text-muted">Usage Control System</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-accent text-accent-foreground' : 'text-muted hover:bg-surface-raised hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-5 py-4 text-xs text-muted">
        Token-bucket enforcement · Supabase + Upstash
      </div>
    </aside>
  );
}
