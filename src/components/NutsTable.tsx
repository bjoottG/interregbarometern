'use client';

import { useMemo, useState } from 'react';
import type { Projekt } from '@/types';
import { formatNumber } from '@/lib/dataUtils';
import { useFilters } from '@/context/FilterContext';

interface Props {
  rows: Projekt[];
  mode: 'nuts3' | 'nuts2';
}

type SortKey = 'name' | 'projekt' | 'partners' | 'budget';

export default function NutsTable({ rows, mode }: Props) {
  const { filters, setFilter } = useFilters();
  const [sortKey, setSortKey] = useState<SortKey>('projekt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const aggregated = useMemo(() => {
    const map = new Map<string, { projekts: Set<string>; partners: number; budget: number }>();
    for (const r of rows) {
      const k = (mode === 'nuts3' ? r.nuts3 : r.nuts2) || 'N/A';
      if (!map.has(k)) map.set(k, { projekts: new Set(), partners: 0, budget: 0 });
      const e = map.get(k)!;
      e.projekts.add(r.projektnamn);
      e.partners += 1;
      e.budget += r.partnerbudget || 0;
    }
    return Array.from(map.entries()).map(([name, v]) => ({
      name, projekt: v.projekts.size, partners: v.partners, budget: v.budget,
    }));
  }, [rows, mode]);

  const sorted = useMemo(() => {
    return [...aggregated].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb), 'sv')
        : String(vb).localeCompare(String(va), 'sv');
    });
  }, [aggregated, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  function handleRowClick(name: string) {
    const filterKey = mode === 'nuts3' ? 'nuts3' : 'nuts2';
    const current = filters[filterKey] as string[];
    if (current.includes(name)) {
      setFilter(filterKey, current.filter(n => n !== name));
    } else {
      setFilter(filterKey, [...current, name]);
    }
  }

  const activeFilter = (mode === 'nuts3' ? filters.nuts3 : filters.nuts2) as string[];

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="ml-1 opacity-30 text-xs">↕</span>;
    return <span className="ml-1 text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const label = mode === 'nuts3' ? 'Nuts3' : 'Nuts2';

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
            {([['name', label], ['projekt', 'Antal projekt'], ['partners', 'Antal projektpartners'], ['budget', 'Partnerbudget EUR']] as [SortKey, string][]).map(([k, l]) => (
              <th
                key={k}
                onClick={() => handleSort(k)}
                className={`py-2 font-semibold cursor-pointer select-none whitespace-nowrap ${k !== 'name' ? 'text-right pr-3' : 'text-left pl-2'}`}
                style={{ color: 'var(--color-text-muted)', fontSize: 12 }}
              >
                {l}<SortIcon col={k} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const isActive = activeFilter.includes(row.name);
            return (
              <tr
                key={row.name}
                onClick={() => handleRowClick(row.name)}
                className="border-b cursor-pointer transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  background: isActive ? 'var(--color-kpi-bg)' : undefined,
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#f9f9f9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isActive ? 'var(--color-kpi-bg)' : ''; }}
              >
                <td className="py-1.5 pl-2 text-sm font-medium" style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text)' }}>
                  {isActive && <span className="mr-1 text-xs">✓</span>}
                  {row.name}
                </td>
                <td className="py-1.5 pr-3 text-right text-sm" style={{ color: 'var(--color-text)' }}>{formatNumber(row.projekt)}</td>
                <td className="py-1.5 pr-3 text-right text-sm" style={{ color: 'var(--color-text)' }}>{formatNumber(row.partners)}</td>
                <td className="py-1.5 pr-3 text-right font-mono" style={{ color: 'var(--color-text)', fontSize: 11 }}>
                  {row.budget > 0 ? formatNumber(Math.round(row.budget)) : '–'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
