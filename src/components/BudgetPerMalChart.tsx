'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { groupBy, formatBudget } from '@/lib/dataUtils';
import { DIAGRAM_COLORS } from '@/types';
import type { Projekt } from '@/types';

interface Props { rows: Projekt[] }

type Fördelning = 'politisktmal' | 'specifiktmal' | 'projekttyp' | 'program';

const ALTERNATIV: { value: Fördelning; label: string }[] = [
  { value: 'politisktmal', label: 'Politiskt mål' },
  { value: 'specifiktmal', label: 'Specifikt mål' },
  { value: 'projekttyp', label: 'Projekttyp' },
  { value: 'program', label: 'Program' },
];

export default function BudgetPerMalChart({ rows }: Props) {
  const [fördelning, setFördelning] = useState<Fördelning>('politisktmal');

  const data = useMemo(() => {
    return groupBy(rows, fördelning)
      .sort((a, b) => b.budget - a.budget)
      .map((d, i) => ({ ...d, color: DIAGRAM_COLORS[i % DIAGRAM_COLORS.length] }));
  }, [rows, fördelning]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
          Partnerbudget per {ALTERNATIV.find((a) => a.value === fördelning)?.label}
        </h3>
        <select
          value={fördelning}
          onChange={(e) => setFördelning(e.target.value as Fördelning)}
          className="text-xs px-2 py-1.5 border rounded-lg"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          {ALTERNATIV.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 0, right: 20, left: 20, bottom: 40 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--color-text)' }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`}
          />
          <Tooltip formatter={(v) => formatBudget(Number(v ?? 0))} labelStyle={{ fontWeight: 700 }} />
          <Bar dataKey="budget" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
