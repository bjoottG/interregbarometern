'use client';

import { useMemo } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import KPICard from '@/components/KPICard';
import { useFilters } from '@/context/FilterContext';
import { groupBy, formatBudget, kpiAntalProjekt, kpiTotalBudget, kpiAntalPartners, formatNumber } from '@/lib/dataUtils';
import { DIAGRAM_COLORS, ROLL_LABELS, SPECIFIKT_MAL_DEFINITIONER, mapOrgTyp } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Treemap,
} from 'recharts';

const ROLE_COLORS: Record<string, string> = {
  LP: '#00A896',
  PP: '#4A1B8B',
  AP: '#7B4FBC',
};

const MAX_LABEL = 24;
function TruncatedTick({ x, y, payload }: {
  x?: number; y?: number; payload?: { value: string };
}) {
  const label = (payload?.value ?? '');
  const display = label.length > MAX_LABEL ? label.slice(0, MAX_LABEL - 1) + '…' : label;
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={10} fill="var(--color-text-muted)">
      {display}
    </text>
  );
}

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

  /* ── Topp-sektion KPIs ── */
  const unikaOrg = useMemo(() => new Set(filtered.map(r => r.organisationsnamn)).size, [filtered]);
  const unikaProjekt = useMemo(() => new Set(filtered.map(r => r.projektnamn)).size, [filtered]);

  const toppProjekt = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) map.set(r.projektnamn, (map.get(r.projektnamn) ?? 0) + (r.partnerbudget || 0));
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, budget]) => ({ name, budget }));
  }, [filtered]);

  const toppOrg = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) map.set(r.organisationsnamn, (map.get(r.organisationsnamn) ?? 0) + (r.partnerbudget || 0));
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, budget]) => ({ name, budget }));
  }, [filtered]);

  /* ── Treemap: organisationstyp × roll ── */
  const treemapData = useMemo(() => {
    const rows: { name: string; size: number; fill: string; orgTyp: string; roll: string }[] = [];
    for (const [orgTyp, rolls] of Object.entries(
      filtered.reduce((acc, r) => {
        const k = mapOrgTyp(r.organisationstyp);
        if (!acc[k]) acc[k] = { LP: 0, PP: 0, AP: 0 };
        if (['LP','PP','AP'].includes(r.organisationsroll)) acc[k][r.organisationsroll as 'LP'|'PP'|'AP'] += 1;
        return acc;
      }, {} as Record<string, { LP: number; PP: number; AP: number }>)
    )) {
      for (const [roll, size] of Object.entries(rolls) as [string, number][]) {
        if (size > 0) rows.push({ name: `${orgTyp}`, size, fill: ROLE_COLORS[roll] ?? '#ccc', orgTyp, roll });
      }
    }
    return rows;
  }, [filtered]);

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
      <Navigation />
      <FilterBar />

      <main className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col gap-5">

        {/* Topp-sektion */}
        {/* KPI-rad */}
        <div className="grid grid-cols-3 gap-4">
          <KPICard title="Antal projekt" value={`${formatNumber(kpiAntalProjekt(filtered))} st`} href="/tabell" />
          <KPICard title="EU-medel (ERDF)" value={formatBudget(kpiTotalBudget(filtered))} />
          <KPICard title="Antal partners" value={`${formatNumber(kpiAntalPartners(filtered))} st`} href="/tabell" />
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Tabeller */}
          <div className="flex flex-col gap-4">

            {/* Tre största projekten */}
            <div className="bg-white rounded-xl shadow-sm border p-4" style={{ borderColor: 'var(--color-border)' }}>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="text-left py-1.5 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Tre största projekten</th>
                    <th className="text-right py-1.5 font-semibold whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>EU-medel (ERDF)</th>
                  </tr>
                </thead>
                <tbody>
                  {toppProjekt.map(({ name, budget }) => (
                    <tr key={name} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="py-1.5 pr-4 truncate max-w-[240px]" style={{ color: 'var(--color-text)' }} title={name}>{name}</td>
                      <td className="py-1.5 text-right font-mono" style={{ color: 'var(--color-text)' }}>{formatBudget(budget)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="py-1.5 font-bold" style={{ color: 'var(--color-text)' }}>Summa</td>
                    <td className="py-1.5 text-right font-bold font-mono" style={{ color: 'var(--color-primary)' }}>
                      {formatBudget(toppProjekt.reduce((s, d) => s + d.budget, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Tre största organisationerna */}
            <div className="bg-white rounded-xl shadow-sm border p-4" style={{ borderColor: 'var(--color-border)' }}>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="text-left py-1.5 font-semibold" style={{ color: 'var(--color-text-muted)' }}>Tre största organisationerna</th>
                    <th className="text-right py-1.5 font-semibold whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>EU-medel (ERDF)</th>
                  </tr>
                </thead>
                <tbody>
                  {toppOrg.map(({ name, budget }) => (
                    <tr key={name} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="py-1.5 pr-4 truncate max-w-[240px]" style={{ color: 'var(--color-text)' }} title={name}>{name}</td>
                      <td className="py-1.5 text-right font-mono" style={{ color: 'var(--color-text)' }}>{formatBudget(budget)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="py-1.5 font-bold" style={{ color: 'var(--color-text)' }}>Summa</td>
                    <td className="py-1.5 text-right font-bold font-mono" style={{ color: 'var(--color-primary)' }}>
                      {formatBudget(toppOrg.reduce((s, d) => s + d.budget, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Höger: Partners per partnerroll + programkategori */}
          <div className="flex flex-col gap-4">
            <ChartCard title="Antal partners per partnerroll">
              <div className="flex items-center justify-center" style={{ height: 160 }}>
                <ResponsiveContainer width="55%" height={160}>
                  <PieChart>
                    <Pie data={perRoll} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={32}>
                      {perRoll.map((d) => <Cell key={d.key} fill={ROLE_COLORS[d.key] ?? '#ccc'} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 text-sm">
                  {perRoll.map(d => (
                    <div key={d.key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: ROLE_COLORS[d.key] }} />
                      <span style={{ color: 'var(--color-text)' }}>{d.name}</span>
                      <span className="font-bold ml-1" style={{ color: 'var(--color-primary)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Antal partners per programkategori">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart layout="vertical" data={perStrand} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={175} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`, 'Partners']} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={22}>
                    {perStrand.map((_, i) => <Cell key={i} fill={DIAGRAM_COLORS[i % DIAGRAM_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Rad 1: Program */}
        <ChartCard title="Antal partners per program">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={perProgram} margin={{ left: 4, right: 60, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={210} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`, 'Partners']} />
              <Bar dataKey="antalPartners" radius={[0, 3, 3, 0]} maxBarSize={18}>
                {perProgram.map((_, i) => <Cell key={i} fill={DIAGRAM_COLORS[i % DIAGRAM_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rad 2: Treemap organisationstyp × roll */}
        <ChartCard
          title="Antal partners per organisationstyp och partnerroll"
          subtitle="Ytan visar antal — färg visar partnerroll"
        >
          <div className="flex gap-4 mb-2">
            {(['LP','PP','AP'] as const).map(r => (
              <div key={r} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-sm" style={{ background: ROLE_COLORS[r] }} />
                <span style={{ color: 'var(--color-text)' }}>{ROLL_LABELS[r]}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={420}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              content={({ x, y, width, height, name, size, fill }: {
                x?: number; y?: number; width?: number; height?: number;
                name?: string; size?: number; fill?: string;
              }) => {
                const w = width ?? 0; const h = height ?? 0;
                const tooSmall = w < 40 || h < 20;
                return (
                  <g>
                    <rect x={x} y={y} width={w} height={h} fill={fill} stroke="#fff" strokeWidth={1.5} rx={2} />
                    {!tooSmall && (
                      <text x={(x ?? 0) + 5} y={(y ?? 0) + 14} fontSize={10} fill="#fff" fontWeight={600}>
                        {(name ?? '').length > 18 ? (name ?? '').slice(0, 17) + '…' : name}
                      </text>
                    )}
                    {!tooSmall && h > 30 && (
                      <text x={(x ?? 0) + 5} y={(y ?? 0) + 26} fontSize={9} fill="rgba(255,255,255,0.8)">
                        {size}
                      </text>
                    )}
                  </g>
                );
              }}
            >
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, _, props) => [`${v} st`, `${props.payload?.orgTyp ?? ''} – ${ROLL_LABELS[props.payload?.roll ?? ''] ?? props.payload?.roll ?? ''}`]} />
            </Treemap>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rad 3: Län */}
        <ChartCard title="Antal partners per län (top 15)">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart layout="vertical" data={perLan} margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={lanYWidth} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} st`, 'Partners']} />
              <Bar dataKey="value" fill={DIAGRAM_COLORS[0]} radius={[0, 3, 3, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rad 4: EU-medel (ERDF) per mål */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="EU-medel (ERDF) per politiskt mål">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart layout="vertical" data={perPolitisktmal} margin={{ left: 4, right: 80, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)} M€`} />
                <YAxis type="category" dataKey="name" width={40} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [formatBudget(Number(v)), 'EU-medel (ERDF)']} />
                <Bar dataKey="budget" fill={DIAGRAM_COLORS[2]} radius={[0, 3, 3, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="EU-medel (ERDF) per specifikt mål">
            <ResponsiveContainer width="100%" height={420}>
              <BarChart layout="vertical" data={perSpecifiktmal} margin={{ left: 4, right: 80, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)} M€`} />
                <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
                <Tooltip contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [formatBudget(Number(v)), 'EU-medel (ERDF)']}
                  labelFormatter={(l) => {
                    const d = perSpecifiktmal.find(x => x.name === l);
                    return d?.def ?? l;
                  }} />
                <Bar dataKey="budget" fill={DIAGRAM_COLORS[3]} radius={[0, 3, 3, 0]} maxBarSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </main>
    </>
  );
}
