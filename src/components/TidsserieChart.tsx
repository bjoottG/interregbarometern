'use client';

import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { budgetPerÅr, formatBudget } from '@/lib/dataUtils';
import type { Projekt } from '@/types';

interface Props { rows: Projekt[] }

export default function TidsserieChart({ rows }: Props) {
  const data = useMemo(() => budgetPerÅr(rows), [rows]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-bold text-base mb-3" style={{ color: 'var(--color-text)' }}>
        Partnerbudget per projektstart år
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="år" tick={{ fontSize: 12, fill: 'var(--color-text)' }} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`}
          />
          <Tooltip formatter={(v) => formatBudget(Number(v ?? 0))} labelStyle={{ fontWeight: 700 }} />
          <Line
            type="monotone"
            dataKey="budget"
            stroke="var(--color-teal)"
            strokeWidth={2.5}
            dot={{ fill: 'var(--color-teal)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
