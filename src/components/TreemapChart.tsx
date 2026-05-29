'use client';

import { useMemo } from 'react';
import { treemapData } from '@/lib/dataUtils';
import { DIAGRAM_COLORS } from '@/types';
import type { Projekt } from '@/types';

interface Props { rows: Projekt[] }

const ROLLER = ['LP', 'PP', 'AP'];

export default function TreemapChart({ rows }: Props) {
  const cells = useMemo(() => treemapData(rows), [rows]);

  const orgTyper = useMemo(() => {
    return Array.from(new Set(cells.map((c) => c.orgTyp))).sort();
  }, [cells]);

  function getCell(orgTyp: string, roll: string) {
    return cells.find((c) => c.orgTyp === orgTyp && c.roll === roll);
  }

  const maxCount = Math.max(...cells.map((c) => c.count), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-bold text-base mb-4" style={{ color: 'var(--color-text)' }}>
        Antal projektpartners per partnertyp och organisationstyp
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                Organisationstyp
              </th>
              {ROLLER.map((r, i) => (
                <th key={r} className="text-center py-2 px-3 font-semibold" style={{ color: DIAGRAM_COLORS[i] }}>
                  {r}
                </th>
              ))}
              <th className="text-center py-2 px-3 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                Totalt
              </th>
            </tr>
          </thead>
          <tbody>
            {orgTyper.map((orgTyp) => {
              const rowTotal = ROLLER.reduce((s, r) => s + (getCell(orgTyp, r)?.count ?? 0), 0);
              return (
                <tr key={orgTyp} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="py-2 pr-4 font-medium" style={{ color: 'var(--color-text)' }}>
                    {orgTyp}
                  </td>
                  {ROLLER.map((roll, i) => {
                    const cell = getCell(orgTyp, roll);
                    const intensity = cell ? cell.count / maxCount : 0;
                    return (
                      <td key={roll} className="py-1 px-3 text-center">
                        {cell ? (
                          <div
                            className="rounded px-2 py-1 font-semibold inline-block min-w-[3rem]"
                            style={{
                              background: `${DIAGRAM_COLORS[i]}${Math.round(intensity * 180 + 30).toString(16).padStart(2, '0')}`,
                              color: intensity > 0.5 ? '#fff' : 'var(--color-text)',
                            }}
                          >
                            {cell.count}
                            <span className="ml-1 font-normal opacity-70">
                              ({cell.pct.toFixed(1)}%)
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)' }}>–</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-2 px-3 text-center font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                    {rowTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
