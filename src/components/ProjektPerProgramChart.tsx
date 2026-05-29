'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { groupBy, formatBudget, formatNumber } from '@/lib/dataUtils';
import { DIAGRAM_COLORS } from '@/types';
import type { Projekt } from '@/types';

interface Props { rows: Projekt[] }

type Mått = 'projekt' | 'budget';

export default function ProjektPerProgramChart({ rows }: Props) {
  const [mått, setMått] = useState<Mått>('projekt');

  const data = useMemo(() => {
    const grouped = groupBy(rows, 'program');
    return grouped
      .sort((a, b) => (mått === 'projekt' ? b.antalProjekt - a.antalProjekt : b.budget - a.budget))
      .map((d, i) => ({
        ...d,
        color: DIAGRAM_COLORS[i % DIAGRAM_COLORS.length],
        value: mått === 'projekt' ? d.antalProjekt : d.budget,
      }));
  }, [rows, mått]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
          Antal projekt per program
        </h3>
        <button
          onClick={() => setMått((m) => (m === 'projekt' ? 'budget' : 'projekt'))}
          className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
          style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
        >
          Växla: {mått === 'projekt' ? 'Visa budget' : 'Visa projekt'}
        </button>
      </div>

      {/* 100%-fördelningsstapel */}
      {total > 0 && (
        <div className="flex h-4 rounded overflow-hidden mb-4">
          {data.map((d) => (
            <div
              key={d.name}
              style={{ width: `${(d.value / total) * 100}%`, background: d.color }}
              title={`${d.name}: ${((d.value / total) * 100).toFixed(1)}%`}
            />
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 60, left: 160, bottom: 0 }}>
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickFormatter={mått === 'budget' ? (v: number) => `${(v / 1_000_000).toFixed(0)}M` : undefined}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={155}
            tick={{ fontSize: 11, fill: 'var(--color-text)' }}
          />
          <Tooltip
            formatter={(value) => {
              const n = Number(value ?? 0);
              return mått === 'budget' ? formatBudget(n) : formatNumber(n);
            }}
            labelStyle={{ fontWeight: 700 }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
