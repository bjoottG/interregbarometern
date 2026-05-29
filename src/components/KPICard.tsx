'use client';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
}

export default function KPICard({ title, value, subtitle }: Props) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{ background: 'var(--color-kpi-bg)' }}
    >
      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {title}
      </p>
      <p className="font-bold leading-tight" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
