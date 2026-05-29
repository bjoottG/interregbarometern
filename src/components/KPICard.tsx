'use client';

import Link from 'next/link';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  href?: string;
}

export default function KPICard({ title, value, subtitle, href }: Props) {
  const valueEl = href ? (
    <Link
      href={href}
      className="font-bold leading-tight"
      style={{ fontSize: '2rem', color: 'var(--color-primary)', textDecoration: 'underline', textUnderlineOffset: 4 }}
    >
      {value}
    </Link>
  ) : (
    <p className="font-bold leading-tight" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
      {value}
    </p>
  );

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1 transition-all"
      style={{ background: 'var(--color-kpi-bg)', cursor: href ? 'pointer' : undefined }}
      onMouseEnter={e => { if (href) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(74,27,139,0.15)'; }}
      onMouseLeave={e => { if (href) (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
    >
      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {title}
      </p>
      {valueEl}
      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
