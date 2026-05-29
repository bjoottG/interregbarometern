'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Projekt, FilterState } from '@/types';
import { FILTER_DEFAULTS } from '@/types';

const TODAY = '2026-05-29';

function computeStatus(row: Projekt): string {
  if (row.startdatum > TODAY) return 'Kommande';
  if (row.slutdatum < TODAY) return 'Avslutad';
  return 'Pågående';
}

interface FilterContextValue {
  data: Projekt[];
  filtered: Projekt[];
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  isLoading: boolean;
  error: string | null;
  allProjektnamn: string[];
  allOrganisationsnamn: string[];
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Projekt[]>([]);
  const [filters, setFilters] = useState<FilterState>(FILTER_DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/rawdata.json')
      .then((r) => { if (!r.ok) throw new Error('Kunde inte hämta rawdata.json'); return r.json(); })
      .then((json) => { setData(json as Projekt[]); setIsLoading(false); })
      .catch((e: Error) => { setError(e.message); setIsLoading(false); });
  }, []);

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => { setFilters(FILTER_DEFAULTS); }, []);

  const filtered = React.useMemo(() => {
    return data.filter((row) => {
      if (filters.program.length > 0 && !filters.program.includes(row.program)) return false;
      if (filters.politisktmal.length > 0 && !filters.politisktmal.includes(row.politisktmal)) return false;
      if (filters.specifiktmal.length > 0 && !filters.specifiktmal.includes(row.specifiktmal)) return false;
      if (filters.projektnamn.length > 0 && !filters.projektnamn.includes(row.projektnamn)) return false;
      if (filters.projekttyp.length > 0 && !filters.projekttyp.includes(row.projekttyp)) return false;
      if (filters.projektår.length > 0 && !filters.projektår.includes(String(row.projektår))) return false;
      if (filters.organisationsnamn.length > 0 && !filters.organisationsnamn.includes(row.organisationsnamn)) return false;
      if (filters.organisationsroll.length > 0 && !filters.organisationsroll.includes(row.organisationsroll)) return false;
      if (filters.pagaende.length > 0 && !filters.pagaende.includes(computeStatus(row))) return false;
      if (filters.aktiv !== 'Alla' && row.aktiv !== filters.aktiv) return false;
      if (filters.nuts2.length > 0 && !filters.nuts2.includes(row.nuts2)) return false;
      if (filters.nuts3.length > 0 && !filters.nuts3.includes(row.nuts3)) return false;
      return true;
    });
  }, [data, filters]);

  const allProjektnamn = React.useMemo(() => Array.from(new Set(data.map((r) => r.projektnamn))).sort(), [data]);
  const allOrganisationsnamn = React.useMemo(() => Array.from(new Set(data.map((r) => r.organisationsnamn))).sort(), [data]);

  return (
    <FilterContext.Provider value={{ data, filtered, filters, setFilter, resetFilters, isLoading, error, allProjektnamn, allOrganisationsnamn }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters måste användas inuti FilterProvider');
  return ctx;
}
