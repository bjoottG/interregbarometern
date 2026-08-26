'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import KPICard from '@/components/KPICard';
import ProjectTable from '@/components/ProjectTable';
import ExcelDownloadLink from '@/components/ExcelDownloadLink';
import { useFilters } from '@/context/FilterContext';
import { kpiAntalProjekt, kpiTotalBudget, kpiAntalPartners, kpiUnikaPartners, formatNumber, formatBudget } from '@/lib/dataUtils';

export default function TabellPage() {
  const { filtered, isLoading } = useFilters();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter(r => r.organisationsnamn?.toLowerCase().includes(q));
  }, [filtered, query]);

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

  return (
    <>
      <Header />
      <Navigation />
      <FilterBar />

      <main className="max-w-[1400px] mx-auto px-6 py-5">
        <div className="grid grid-cols-3 gap-4 mb-5">
          <KPICard title="Antal partners" value={`${formatNumber(kpiAntalPartners(rows))} st`} subtitle={`varav ${formatNumber(kpiUnikaPartners(rows))} unika partners`} />
          <KPICard title="Antal unika projekt" value={`${formatNumber(kpiAntalProjekt(rows))} st`} subtitle="Varje projekt räknat en gång" />
          <KPICard title="EU-medel (ERDF)" value={formatBudget(kpiTotalBudget(rows))} subtitle="Beviljat EU-stöd — inte total projektbudget" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-end justify-between mb-4">
            <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
              Projektlista
            </h3>
            <div className="flex flex-col gap-1 w-full max-w-xs">
              <label className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                Sök i tabellen
              </label>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>
          </div>
          <ProjectTable rows={rows} />
          <div className="mt-3">
            <ExcelDownloadLink />
          </div>
        </div>
      </main>
    </>
  );
}
