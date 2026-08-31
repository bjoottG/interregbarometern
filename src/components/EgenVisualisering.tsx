'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import { formatNumber, formatBudget } from '@/lib/dataUtils';
import { DIAGRAM_COLORS, ROLL_LABELS, mapOrgTyp } from '@/types';
import type { Projekt } from '@/types';

export interface Visualisering {
  typ: 'stapel' | 'cirkel' | 'tabell';
  grupperaPa:
    | 'program' | 'nuts3' | 'politisktmal' | 'specifiktmal'
    | 'strand_kod' | 'organisationsroll' | 'organisationstyp'
    | 'projekttyp' | 'projektnamn' | 'organisationsnamn';
  matvarde: 'antalPartners' | 'unikaPartners' | 'antalProjekt' | 'budget';
  filter: Partial<Record<
    'program' | 'nuts3' | 'politisktmal' | 'specifiktmal'
    | 'strand_kod' | 'organisationsroll' | 'organisationstyp' | 'projekttyp',
    string[] | null
  >>;
  topN: number | null;
  titel: string;
}

const BAR_COLOR = '#1D5C63';

const MATVARDE_LABELS: Record<Visualisering['matvarde'], string> = {
  antalPartners: 'Antal partners',
  unikaPartners: 'Unika partners',
  antalProjekt: 'Antal projekt',
  budget: 'EU-medel (ERDF)',
};

function groupKey(row: Projekt, grupperaPa: Visualisering['grupperaPa']): string {
  if (grupperaPa === 'organisationstyp') return mapOrgTyp(row.organisationstyp);
  if (grupperaPa === 'organisationsroll') return ROLL_LABELS[row.organisationsroll] ?? row.organisationsroll;
  return String(row[grupperaPa] ?? 'Okänd');
}

function matchesFilter(row: Projekt, filter: Visualisering['filter']): boolean {
  for (const [key, values] of Object.entries(filter)) {
    if (!values || values.length === 0) continue;
    const rowValue = key === 'organisationstyp'
      ? mapOrgTyp(row.organisationstyp)
      : String(row[key as keyof Projekt] ?? '');
    if (!values.includes(rowValue)) return false;
  }
  return true;
}

export default function EgenVisualisering({ spec, rows }: { spec: Visualisering; rows: Projekt[] }) {
  const data = useMemo(() => {
    const groups = new Map<string, { count: number; orgs: Set<string>; projekt: Set<string>; budget: number }>();
    for (const row of rows) {
      if (!matchesFilter(row, spec.filter ?? {})) continue;
      const key = groupKey(row, spec.grupperaPa);
      if (!groups.has(key)) groups.set(key, { count: 0, orgs: new Set(), projekt: new Set(), budget: 0 });
      const g = groups.get(key)!;
      g.count += 1;
      g.orgs.add(row.organisationsnamn);
      g.projekt.add(row.projektnamn);
      g.budget += row.partnerbudget || 0;
    }
    const defaultTop = spec.typ === 'cirkel' ? 6 : spec.typ === 'stapel' ? 15 : 30;
    return Array.from(groups.entries())
      .map(([name, g]) => ({
        name,
        value:
          spec.matvarde === 'budget' ? g.budget :
          spec.matvarde === 'antalProjekt' ? g.projekt.size :
          spec.matvarde === 'unikaPartners' ? g.orgs.size :
          g.count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, spec.topN ?? defaultTop);
  }, [spec, rows]);

  const isBudget = spec.matvarde === 'budget';
  const fmt = (v: number) => (isBudget ? formatBudget(v) : `${formatNumber(v)} st`);

  if (data.length === 0) {
    return (
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Inga rader matchade urvalet.
      </p>
    );
  }

  const yWidth = Math.min(Math.max(...data.map(d => d.name.length)) * 6 + 12, 300);

  return (
    <div className="bg-white rounded-xl border p-4 mt-2" style={{ borderColor: 'var(--color-border)' }}>
      <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--color-text)' }}>{spec.titel}</h4>

      {spec.typ === 'stapel' && (
        <ResponsiveContainer width="100%" height={Math.max(data.length * 28 + 40, 120)}>
          <BarChart layout="vertical" data={data} margin={{ left: 4, right: 30, top: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-border)" />
            <XAxis
              type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => (isBudget ? formatBudget(Number(v)) : String(v))}
            />
            <YAxis type="category" dataKey="name" width={yWidth} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
            <Bar dataKey="value" fill={BAR_COLOR} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {spec.typ === 'cirkel' && (
        <div className="flex items-center justify-center gap-6 flex-wrap" style={{ minHeight: 200 }}>
          <ResponsiveContainer width={220} height={200}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                {data.map((_, i) => <Cell key={i} fill={DIAGRAM_COLORS[i % DIAGRAM_COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 text-xs">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: DIAGRAM_COLORS[i % DIAGRAM_COLORS.length] }} />
                <span style={{ color: 'var(--color-text)' }}>{d.name}</span>
                <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{fmt(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {spec.typ === 'tabell' && (
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
              <th className="text-left py-1.5 font-semibold" style={{ color: 'var(--color-text-muted)' }} />
              <th className="text-right py-1.5 font-semibold whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                {MATVARDE_LABELS[spec.matvarde]}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <td className="py-1.5 pr-4" style={{ color: 'var(--color-text)' }}>{d.name}</td>
                <td className="py-1.5 text-right font-mono whitespace-nowrap" style={{ color: 'var(--color-text)' }}>{fmt(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
