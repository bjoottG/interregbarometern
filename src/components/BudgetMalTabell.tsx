'use client';

import { useState, useMemo } from 'react';
import { groupBy, formatBudget } from '@/lib/dataUtils';
import { DIAGRAM_COLORS, SPECIFIKT_MAL_DEFINITIONER } from '@/types';
import type { Projekt } from '@/types';

interface Props { rows: Projekt[] }

type Tab = 'politisktmal' | 'specifiktmal';

const POLITISKT_MAL_DEFINITIONER: Record<string, string> = {
  ISO: 'Interreg-specifika mål',
  PO1: 'Ett smartare Europa',
  PO2: 'Ett grönare Europa',
  PO3: 'Ett mer sammanlänkat Europa',
  PO4: 'Ett mer socialt Europa',
  PO5: 'Ett Europa närmare medborgarna',
  PO6: 'Övrigt politiskt mål',
};

export default function BudgetMalTabell({ rows }: Props) {
  const [tab, setTab] = useState<Tab>('politisktmal');

  const data = useMemo(() => {
    return groupBy(rows, tab)
      .sort((a, b) => b.budget - a.budget)
      .map((d, i) => ({
        ...d,
        color: DIAGRAM_COLORS[i % DIAGRAM_COLORS.length],
        definition: tab === 'politisktmal'
          ? (POLITISKT_MAL_DEFINITIONER[d.name] ?? '')
          : (SPECIFIKT_MAL_DEFINITIONER[d.name] ?? ''),
      }));
  }, [rows, tab]);

  const totalBudget = data.reduce((s, d) => s + d.budget, 0);
  const maxBudget = Math.max(...data.map(d => d.budget), 1);

  return (
    <div
      className="bg-white rounded-xl shadow-sm border p-5 col-span-2"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
          Budget per mål
        </h3>
        <div className="flex rounded-lg overflow-hidden border text-xs font-medium" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setTab('politisktmal')}
            className="px-3 py-1.5 transition-colors"
            style={{
              background: tab === 'politisktmal' ? 'var(--color-primary)' : 'white',
              color: tab === 'politisktmal' ? 'white' : 'var(--color-text-muted)',
            }}
          >
            Politiskt mål
          </button>
          <button
            onClick={() => setTab('specifiktmal')}
            className="px-3 py-1.5 transition-colors border-l"
            style={{
              background: tab === 'specifiktmal' ? 'var(--color-primary)' : 'white',
              color: tab === 'specifiktmal' ? 'white' : 'var(--color-text-muted)',
              borderColor: 'var(--color-border)',
            }}
          >
            Specifikt mål
          </button>
        </div>
      </div>

      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            <th className="text-left py-2 pr-3 font-semibold w-24" style={{ color: 'var(--color-text-muted)' }}>
              Kod
            </th>
            <th className="text-left py-2 pr-3 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              Definition
            </th>
            <th className="text-right py-2 px-3 font-semibold whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
              Budget (EUR)
            </th>
            <th className="text-right py-2 pl-3 font-semibold w-20" style={{ color: 'var(--color-text-muted)' }}>
              Andel
            </th>
            <th className="py-2 pl-4 w-40 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              Fördelning
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => {
            const pct = totalBudget > 0 ? (d.budget / totalBudget) * 100 : 0;
            const barWidth = totalBudget > 0 ? (d.budget / maxBudget) * 100 : 0;
            return (
              <tr key={d.name} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <td className="py-2 pr-3 font-semibold" style={{ color: d.color }}>
                  {d.name}
                </td>
                <td className="py-2 pr-3" style={{ color: 'var(--color-text)' }}>
                  {d.definition || <span style={{ color: 'var(--color-text-muted)' }}>–</span>}
                </td>
                <td className="py-2 px-3 text-right font-mono font-semibold whitespace-nowrap" style={{ color: 'var(--color-text)' }}>
                  {formatBudget(d.budget)}
                </td>
                <td className="py-2 pl-3 text-right whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                  {pct.toFixed(1)}%
                </td>
                <td className="py-2 pl-4">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${barWidth}%`, background: d.color }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2" style={{ borderColor: 'var(--color-border)' }}>
            <td className="py-2 pr-3 font-semibold" style={{ color: 'var(--color-text)' }} colSpan={2}>
              Totalt
            </td>
            <td className="py-2 px-3 text-right font-mono font-semibold" style={{ color: 'var(--color-primary)' }}>
              {formatBudget(totalBudget)}
            </td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
