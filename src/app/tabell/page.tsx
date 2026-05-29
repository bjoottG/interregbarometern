'use client';

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import FilterBar from '@/components/FilterBar';
import ProjectTable from '@/components/ProjectTable';
import { useFilters } from '@/context/FilterContext';

export default function TabellPage() {
  const { filtered, isLoading } = useFilters();

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
        <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
          <ProjectTable rows={filtered} />
        </div>
      </main>
    </>
  );
}
