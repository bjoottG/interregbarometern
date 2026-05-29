'use client';

import { useMemo } from 'react';
import { formatNumber } from '@/lib/dataUtils';
import type { Projekt } from '@/types';

interface Props { rows: Projekt[] }

import { ROLL_LABELS } from '@/types';

const ROLLER = ['LP', 'PP', 'AP'];
const ROLLER_COLORS = ['#00A896', '#4A1B8B', '#7B4FBC'];

// Map raw organisationstyp to display label
const ORG_TYP_MAP: Record<string, string> = {
  'Regional public authority':    'Regional public authority',
  'Higher education and research institution': 'Higher education',
  'Education and research institution': 'Higher education',
  'National public authority':    'National public authority',
  'Research':                     'Research',
  'Local public authority':       'Local public authority',
  'Business support organisation':'Business support',
  'Small or medium-sized enterprise (SME)': 'SME',
  'Large enterprise':             'Large enterprise',
  'Enterprise, except SME':       'Enterprise',
  'NGO':                          'NGO',
  'Interest groups including NGOs': 'NGO',
  'Sectoral agency':              'Sectoral agency',
  'Bodies governed by public law':'Bodies (public law)',
  'Other':                        'Other',
};

function mapOrgTyp(raw: string): string {
  return ORG_TYP_MAP[raw] ?? raw ?? 'Okänd';
}

export default function KrysstabellPartners({ rows }: Props) {
  const { cells, orgTyper, total } = useMemo(() => {
    const map = new Map<string, Map<string, number>>();

    for (const r of rows) {
      const orgTyp = mapOrgTyp(r.organisationstyp);
      const roll = r.organisationsroll;
      if (!ROLLER.includes(roll)) continue;
      if (!map.has(orgTyp)) map.set(orgTyp, new Map());
      const inner = map.get(orgTyp)!;
      inner.set(roll, (inner.get(roll) ?? 0) + 1);
    }

    const orgTyper = Array.from(map.entries())
      .map(([name, inner]) => ({ name, total: Array.from(inner.values()).reduce((s, v) => s + v, 0) }))
      .sort((a, b) => b.total - a.total)
      .map(e => e.name);

    return { cells: map, orgTyper, total: rows.length };
  }, [rows]);

  const maxCell = useMemo(() => {
    let m = 1;
    for (const inner of cells.values()) for (const v of inner.values()) m = Math.max(m, v);
    return m;
  }, [cells]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 h-full overflow-auto" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-bold text-base mb-4" style={{ color: 'var(--color-text)' }}>
        Svenska projektpartners
      </h3>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            <th className="text-left py-1.5 pr-3 font-semibold" style={{ color: 'var(--color-text-muted)' }} />
            {ROLLER.map((r, i) => (
              <th key={r} className="text-center py-1.5 px-2 font-bold" style={{ color: ROLLER_COLORS[i] }}>
                {ROLL_LABELS[r] ?? r}
              </th>
            ))}
            <th className="text-center py-1.5 px-2 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Totalt</th>
          </tr>
        </thead>
        <tbody>
          {orgTyper.map((orgTyp) => {
            const inner = cells.get(orgTyp)!;
            const rowTotal = Array.from(inner.values()).reduce((s, v) => s + v, 0);
            return (
              <tr key={orgTyp} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <td className="py-1.5 pr-3 font-medium" style={{ color: 'var(--color-text)' }}>{orgTyp}</td>
                {ROLLER.map((roll, ri) => {
                  const val = inner.get(roll) ?? 0;
                  const intensity = val / maxCell;
                  return (
                    <td key={roll} className="py-1 px-1 text-center">
                      {val > 0 ? (
                        <div
                          className="rounded px-1.5 py-0.5 inline-block min-w-[2.5rem] font-semibold"
                          style={{
                            background: `${ROLLER_COLORS[ri]}${Math.round((0.18 + intensity * 0.72) * 255).toString(16).padStart(2, '0')}`,
                            color: intensity > 0.5 ? '#fff' : 'var(--color-text)',
                          }}
                        >
                          {formatNumber(val)}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>–</span>
                      )}
                    </td>
                  );
                })}
                <td className="py-1.5 px-2 text-center font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                  {formatNumber(rowTotal)} st
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Totalt {formatNumber(total)} partners
      </p>
    </div>
  );
}
