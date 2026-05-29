'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { groupBy } from '@/lib/dataUtils';
import { DIAGRAM_COLORS } from '@/types';
import type { Projekt } from '@/types';

interface Props {
  rows: Projekt[];
  field: 'politisktmal' | 'specifiktmal';
  title: string;
}

export default function BudgetBarChart({ rows, field, title }: Props) {
  const data = useMemo(() => {
    const totalBudget = rows.reduce((s, r) => s + (r.partnerbudget || 0), 0);
    return groupBy(rows, field)
      .sort((a, b) => b.budget - a.budget)
      .map((d, i) => ({
        name: d.name,
        budget: d.budget,
        pct: totalBudget > 0 ? Math.round((d.budget / totalBudget) * 100) : 0,
        color: DIAGRAM_COLORS[i % DIAGRAM_COLORS.length],
      }));
  }, [rows, field]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 h-full" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-bold text-base mb-4" style={{ color: 'var(--color-text)' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--color-text)' }}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            formatter={(v) => [`${(Number(v) / 1_000_000).toFixed(1)} MEUR`, 'Budget']}
            labelStyle={{ fontWeight: 700 }}
          />
          <Bar dataKey="budget" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            <LabelList
              dataKey="pct"
              position="top"
              formatter={(v: unknown) => `${v}%`}
              style={{ fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
