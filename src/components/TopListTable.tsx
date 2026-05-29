'use client';

import { formatBudget } from '@/lib/dataUtils';

interface Row { name: string; budget: number }

interface Props {
  title: string;
  rows: Row[];
}

export default function TopListTable({ title, rows }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>{title}</h3>
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 rounded border" style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
            Ladda ner excel
          </button>
          <button className="text-xs px-2 py-1 rounded border" style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
            Ladda ner pdf
          </button>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            <th className="text-left py-2 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Namn</th>
            <th className="text-right py-2 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Partnerbudget</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
              <td className="py-2 pr-4" style={{ color: 'var(--color-text)' }}>{row.name}</td>
              <td className="py-2 text-right font-mono text-xs" style={{ color: 'var(--color-primary)' }}>
                {formatBudget(row.budget)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
