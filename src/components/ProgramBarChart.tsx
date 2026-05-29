'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { groupBy, formatNumber } from '@/lib/dataUtils';
import { DIAGRAM_COLORS } from '@/types';
import type { Projekt } from '@/types';

interface Props { rows: Projekt[] }

export default function ProgramBarChart({ rows }: Props) {
  const data = useMemo(() => {
    return groupBy(rows, 'program')
      .sort((a, b) => b.antalProjekt - a.antalProjekt)
      .map((d, i) => ({ ...d, color: DIAGRAM_COLORS[i % DIAGRAM_COLORS.length] }));
  }, [rows]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 h-full" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-bold text-base mb-4" style={{ color: 'var(--color-text)' }}>
        Projekt med svenska deltagare
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 60, left: 180, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
          <YAxis
            type="category"
            dataKey="name"
            width={175}
            tick={{ fontSize: 11, fill: 'var(--color-text)' }}
          />
          <Tooltip
            formatter={(v) => [`${formatNumber(Number(v))} st`, 'Antal projekt']}
            labelStyle={{ fontWeight: 700 }}
          />
          <Bar dataKey="antalProjekt" radius={[0, 4, 4, 0]}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            <LabelList
              dataKey="antalProjekt"
              position="right"
              formatter={(v: unknown) => `${v} st`}
              style={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
