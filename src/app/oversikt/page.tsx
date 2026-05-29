'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import KPICard from '@/components/KPICard';
import NutsTable from '@/components/NutsTable';
import ProgramTable from '@/components/ProgramTable';
import KrysstabellPartners from '@/components/KrysstabellPartners';
import BudgetBarChart from '@/components/BudgetBarChart';
import { useFilters } from '@/context/FilterContext';
import { kpiAntalProjekt, kpiTotalBudget, kpiAntalPartners, formatNumber, formatBudget } from '@/lib/dataUtils';

// SSR-disable för Leaflet
const SwedenMapLeaflet = dynamic(() => import('@/components/SwedenMapLeaflet'), { ssr: false });

export default function OversiktPage() {
  const { filtered, isLoading, setFilter, filters } = useFilters();
  const [mapMode] = useState<'nuts3' | 'nuts2'>('nuts3');

  const kpis = useMemo(() => ({
    projekt:  kpiAntalProjekt(filtered),
    budget:   kpiTotalBudget(filtered),
    partners: kpiAntalPartners(filtered),
  }), [filtered]);

  function handleCountyClick(name: string) {
    const current = filters.nuts3;
    if (current.includes(name)) {
      setFilter('nuts3', current.filter(n => n !== name));
    } else {
      setFilter('nuts3', [...current, name]);
    }
  }

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
        {/* KPI-rad */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <KPICard title="Projekt med svenska partners" value={`${formatNumber(kpis.projekt)} st`} />
          <KPICard title="Budget för svenska partners" value={formatBudget(kpis.budget)} />
          <KPICard title="Svenska partners" value={`${formatNumber(kpis.partners)} st`} />
        </div>

        {/* Rad 2: Tabell + Karta */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                Fördelning projekt och svenska partners per län
              </h3>
            </div>
            <div className="overflow-auto" style={{ maxHeight: 460 }}>
              <NutsTable rows={filtered} mode={mapMode} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                Antal projekt fördelat på Nuts3 (karta)
              </h3>
            </div>
            <div style={{ height: 440 }}>
              <SwedenMapLeaflet rows={filtered} mode={mapMode} onCountyClick={handleCountyClick} />
            </div>
          </div>
        </div>

        {/* Rad 3: Program + Krysstabell */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                Fördelning svenska partners per program
              </h3>
            </div>
            <div className="overflow-auto" style={{ maxHeight: 460 }}>
              <ProgramTable rows={filtered} />
            </div>
          </div>
          <KrysstabellPartners rows={filtered} />
        </div>

        {/* Rad 4: Budget politiskt + specifikt */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <BudgetBarChart rows={filtered} field="politisktmal" title="Budget per Politiskt mål" />
          <BudgetBarChart rows={filtered} field="specifiktmal" title="Budget per Specifikt mål" />
        </div>
      </main>
    </>
  );
}
