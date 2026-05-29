'use client';

import { useFilters } from '@/context/FilterContext';
import MultiSelectDropdown from './MultiSelectDropdown';
import {
  PROGRAMS, POLITISKA_MAL, SPECIFIKA_MAL, NUTS3_VALUES,
  PAGAENDE_STATUS, ORG_ROLLER, ROLL_LABELS, SPECIFIKT_MAL_DEFINITIONER,
} from '@/types';

export default function FilterBar() {
  const { filters, setFilter, resetFilters } = useFilters();

  const hasFilters =
    filters.program.length > 0 ||
    filters.politisktmal.length > 0 ||
    filters.specifiktmal.length > 0 ||
    filters.pagaende.length > 0 ||
    filters.organisationsroll.length > 0 ||
    filters.nuts3.length > 0;

  return (
    <div className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-3">
        {/* Rad 1 */}
        <div className="flex items-end gap-3 mb-2">
          <div className="w-52">
            <MultiSelectDropdown
              label="NUTS 3 (Län)"
              options={NUTS3_VALUES}
              selected={filters.nuts3}
              onChange={(v) => setFilter('nuts3', v)}
            />
          </div>
          <div className="w-44">
            <MultiSelectDropdown
              label="Politiskt mål"
              options={POLITISKA_MAL}
              selected={filters.politisktmal}
              onChange={(v) => setFilter('politisktmal', v)}
            />
          </div>
          <div className="w-44">
            <MultiSelectDropdown
              label="Pågående Projekt"
              options={PAGAENDE_STATUS}
              selected={filters.pagaende}
              onChange={(v) => setFilter('pagaende', v)}
            />
          </div>
          <div className="w-52">
            <MultiSelectDropdown
              label="Partnerroll"
              options={ORG_ROLLER}
              selected={filters.organisationsroll}
              onChange={(v) => setFilter('organisationsroll', v)}
              getLabel={(v) => ROLL_LABELS[v] ?? v}
            />
          </div>
          <div className="ml-auto">
            <button
              onClick={resetFilters}
              className="px-4 py-[7px] text-sm font-medium rounded-lg border transition-colors"
              style={{
                color: hasFilters ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderColor: hasFilters ? 'var(--color-primary)' : 'var(--color-border)',
                background: 'white',
              }}
            >
              Återställ filter
            </button>
          </div>
        </div>
        {/* Rad 2 */}
        <div className="flex items-end gap-3">
          <div className="w-52">
            <MultiSelectDropdown
              label="Program"
              options={PROGRAMS}
              selected={filters.program}
              onChange={(v) => setFilter('program', v)}
            />
          </div>
          <div className="w-80">
            <MultiSelectDropdown
              label="Specifikt mål"
              options={SPECIFIKA_MAL}
              selected={filters.specifiktmal}
              onChange={(v) => setFilter('specifiktmal', v)}
              getDescription={(v) => SPECIFIKT_MAL_DEFINITIONER[v] ?? ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
