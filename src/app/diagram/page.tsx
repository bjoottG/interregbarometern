'use client';

import { useMemo } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import { useFilters } from '@/context/FilterContext';
import { groupBy, formatBudget } from '@/lib/dataUtils';
import { DIAGRAM_COLORS, ROLL_LABELS, SPECIFIKT_MAL_DEFINITIONER, mapOrgTyp } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const ROLE_COLORS: Record<string, string> = {
  LP: '#00A896',
  PP: '#4A1B8B',
  AP: '#7B4FBC',
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
      <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{title}</h3>
      {subtitle && <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      {children}
    </div>
  );
}

const TOOLTIP_STYLE = { fontSize: 11, borderRadius: 8 };

export default function DiagramPage() {
  const { filtered, isLoading } = useFilters();

  /* ── Partners per program ── */
  const perProgram = useMemo(() =>
    groupBy(filtered, 'program')
      .sort((a, b) => b.antalPartners - a.antalPartners),
  [filtered]);

  /* ── Partners per programkategori ── */
  const perStrand = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      const k = `${r.strand_kod} – ${r.strand_namn}`;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered]);

  /* ── Partners per organisationstyp ── */
  const perOrgTyp = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      const k = mapOrgTyp(r.organisationstyp);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  /* ── Partners per organisationstyp × roll (grouped) ── */
  const perOrgRoll = useMemo(() => {
    const map = new Map<string, Record<string, number>>();
    for (const r of filtered) {
      const orgTyp = mapOrgTyp(r.organisationstyp);
      const roll = r.organisationsroll;
      if (!['LP', 'PP', 'AP'].includes(roll)) continue;
      if (!map.has(orgTyp)) map.set(orgTyp, { LP: 0, PP: 0, AP: 0 });
      map.get(orgTyp)![roll] += 1;
    }
    return [...map.entries()]
      .map(([name, rolls]) => ({ name, ...rolls, total: rolls.LP + rolls.PP + rolls.AP }))
      .sort((a, b) => b.total - a.total);
  }, [filtered]);

  /* ── EU-medel (ERDF) per specifikt mål ── */
  const perSpecifiktmal = useMemo(() =>
    groupBy(filtered, 'specifiktmal')
      .sort((a, b) => a.name.localeCompare(b.name, 'sv', { numeric: true }))
      .map(d => ({ name: d.name, budget: d.budget, def: SPECIFIKT_MAL_DEFINITIONER[d.name] ?? d.name })),
  [filtered]);

  /* ── EU-medel (ERDF) per politiskt mål ── */
  const perPolitisktmal = useMemo(() =>
    groupBy(filtered, 'politisktmal')
      .sort((a, b) => a.name.localeCompare(b.name, 'sv', { numeric: true }))
      .map(d => ({ name: d.name, budget: d.budget })),
  [filtered]);

  /* ── Partners per partnerroll ── */
  const perRoll = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) map.set(r.organisationsroll, (map.get(r.organisationsroll) ?? 0) + 1);
    return [...map.entries()]
      .filter(([k]) => ['LP', 'PP', 'AP'].includes(k))
      .map(([name, value]) => ({ name: ROLL_LABELS[name] ?? name, value, key: name }));
  }, [filtered]);

  /* ── Partners per län (top 15) ── */
  const perLan = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      const k = r.nuts3 || 'Okänd';
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [filtered]);

  if (isLoading) {
    return (
      <>
        <Header />
        <Navigation />
        <div className="max-w-[1200px] mx-auto px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
          Laddar data…
        </div>
      </>
    );
  }

  const lanYWidth = Math.max(...perLan.map(d => d.name.length)) * 6 + 8;

  return (
    <>
      <Header />
      <FilterBar />
      <Navigation />

      <main className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col gap-5">

        {/* Rad 1: Program + Programkategori */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="Antal partners per program">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={perProgram} margin={{ left: 4, right: 40, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={190} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`, 'Partners']} />
                <Bar dataKey="antalPartners" radius={[0, 3, 3, 0]} maxBarSize={18}>
                  {perProgram.map((_, i) => <Cell key={i} fill={DIAGRAM_COLORS[i % DIAGRAM_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-rows-2 gap-5">
            <ChartCard title="Partners per programkategori">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart layout="vertical" data={perStrand} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={175} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`, 'Partners']} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={18}>
                    {perStrand.map((_, i) => <Cell key={i} fill={DIAGRAM_COLORS[i % DIAGRAM_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Partners per partnerroll">
              <div className="flex items-center justify-center" style={{ height: 110 }}>
                <ResponsiveContainer width="60%" height={110}>
                  <PieChart>
                    <Pie data={perRoll} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45} innerRadius={22}>
                      {perRoll.map((d) => <Cell key={d.key} fill={ROLE_COLORS[d.key] ?? '#ccc'} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1 text-xs">
                  {perRoll.map(d => (
                    <div key={d.key} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: ROLE_COLORS[d.key] }} />
                      <span style={{ color: 'var(--color-text)' }}>{d.name}</span>
                      <span className="font-semibold ml-1" style={{ color: 'var(--color-text-muted)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Rad 2: Organisationstyp + Län */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="Antal partners per organisationstyp">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart layout="vertical" data={perOrgTyp} margin={{ left: 4, right: 40, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={185} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`, 'Partners']} />
                <Bar dataKey="value" fill={DIAGRAM_COLORS[1]} radius={[0, 3, 3, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Antal partners per organisationstyp och partnerroll" subtitle="Staplarna visar LP, PP och AP per organisationstyp">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart layout="vertical" data={perOrgRoll} margin={{ left: 4, right: 8, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={185} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend iconType="square" wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                  formatter={(v) => ROLL_LABELS[v] ?? v} />
                <Bar dataKey="LP" name="LP" stackId="a" fill={ROLE_COLORS.LP} maxBarSize={14} />
                <Bar dataKey="PP" name="PP" stackId="a" fill={ROLE_COLORS.PP} maxBarSize={14} />
                <Bar dataKey="AP" name="AP" stackId="a" fill={ROLE_COLORS.AP} radius={[0, 3, 3, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Rad 3: Län */}
        <ChartCard title="Antal partners per län (top 15)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={perLan} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={lanYWidth} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`, 'Partners']} />
              <Bar dataKey="value" fill={DIAGRAM_COLORS[0]} radius={[0, 3, 3, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rad 4: EU-medel (ERDF) per mål */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="EU-medel (ERDF) per politiskt mål">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={perPolitisktmal} margin={{ left: 4, right: 80, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <YAxis type="category" dataKey="name" width={40} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [formatBudget(Number(v)), 'EU-medel (ERDF)']} />
                <Bar dataKey="budget" fill={DIAGRAM_COLORS[2]} radius={[0, 3, 3, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="EU-medel (ERDF) per specifikt mål">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={perSpecifiktmal} margin={{ left: 4, right: 80, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [formatBudget(Number(v)), 'EU-medel (ERDF)']}
                  labelFormatter={(l) => {
                    const d = perSpecifiktmal.find(x => x.name === l);
                    return d?.def ?? l;
                  }} />
                <Bar dataKey="budget" fill={DIAGRAM_COLORS[3]} radius={[0, 3, 3, 0]} maxBarSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </main>
    </>
  );
}
