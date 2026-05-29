'use client';

import { useMemo } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import KPICard from '@/components/KPICard';
import ProjectTable from '@/components/ProjectTable';
import { useFilters } from '@/context/FilterContext';
import { kpiAntalProjekt, kpiTotalBudget, kpiAntalPartners, formatNumber, formatBudget } from '@/lib/dataUtils';

export default function TabellPage() {
  const { filtered, isLoading } = useFilters();

  const kpis = useMemo(() => ({
    projekt:  kpiAntalProjekt(filtered),
    budget:   kpiTotalBudget(filtered),
    partners: kpiAntalPartners(filtered),
  }), [filtered]);

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
      <FilterBar />
      <Navigation />
      <main className="max-w-[1200px] mx-auto px-6 py-5">
        <div className="grid grid-cols-3 gap-4 mb-5">
          <KPICard title="Projekt med svenska partners" value={`${formatNumber(kpis.projekt)} st`} />
          <KPICard title="Budget för svenska partners" value={formatBudget(kpis.budget)} />
          <KPICard title="Svenska partners" value={`${formatNumber(kpis.partners)} st`} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
          <ProjectTable rows={filtered} />
        </div>
      </main>
    </>
  );
}
