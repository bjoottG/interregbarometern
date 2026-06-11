'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Översikt', href: '/oversikt' },
  { label: 'Diagram', href: '/diagram' },
  { label: 'Partners', href: '/tabell' },
  { label: 'Ordlista', href: '/ordlista' },
];

export default function Navigation({ alignLeft }: { alignLeft?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className={`${alignLeft ? '' : 'max-w-[1200px] mx-auto'} px-6 flex gap-0`}>
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative px-5 py-3 text-sm font-medium transition-colors"
              style={{
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
