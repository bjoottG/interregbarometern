'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import KPICard from '@/components/KPICard';
import ProjectTable from '@/components/ProjectTable';
import { useFilters } from '@/context/FilterContext';
import { kpiAntalProjekt, kpiTotalBudget, kpiAntalPartners, formatNumber, formatBudget } from '@/lib/dataUtils';

export default function TabellPage() {
  const { filtered, isLoading } = useFilters();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  function handleSearch() {
    setQuery(input.trim());
  }

  const rows = useMemo(() => {
    if (!query) return filtered;
    const q = query.toLowerCase();
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

      {/* Sökfält */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-end gap-3">
          <div className="flex flex-col gap-1 flex-1 max-w-md">
            <label className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              Sök Partner/Organisation
            </label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Sök på Partner/Organisation…"
            className="w-full px-3 py-2 text-sm border rounded-lg outline-none"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
          />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-sm font-medium rounded-lg"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            Sök
          </button>
          {query && (
            <button
              onClick={() => { setInput(''); setQuery(''); }}
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Rensa
            </button>
          )}
          {query && (
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {rows.length} träffar för "{query}"
            </span>
          )}
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-5">
        <div className="grid grid-cols-3 gap-4 mb-5">
          <KPICard title="Antal projekt" value={`${formatNumber(kpiAntalProjekt(rows))} st`} />
          <KPICard title="EU-medel (ERDF)" value={formatBudget(kpiTotalBudget(rows))} />
          <KPICard title="Antal partners" value={`${formatNumber(kpiAntalPartners(rows))} st`} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
          <ProjectTable rows={rows} />
        </div>
      </main>
    </>
  );
}
