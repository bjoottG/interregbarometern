'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { countByField } from '@/lib/dataUtils';
import { DIAGRAM_COLORS } from '@/types';
import type { Projekt } from '@/types';

interface Props {
  rows: Projekt[];
  field: keyof Projekt;
  title: string;
}

export default function DonutChart({ rows, field, title }: Props) {
  const data = useMemo(() => countByField(rows, field), [rows, field]);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-bold text-base mb-3" style={{ color: 'var(--color-text)' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={DIAGRAM_COLORS[i % DIAGRAM_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const n = Number(value ?? 0);
              return [`${n} (${total > 0 ? ((n / total) * 100).toFixed(1) : 0}%)`];
            }}
          />
          <Legend
            formatter={(value, entry) => {
              const item = data.find((d) => d.name === value);
              const pct = item && total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
              return (
                <span style={{ fontSize: 12, color: 'var(--color-text)' }}>
                  {value} ({pct}%)
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
