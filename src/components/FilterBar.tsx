'use client';

import { useFilters } from '@/context/FilterContext';
import MultiSelectDropdown from './MultiSelectDropdown';
import {
  PROGRAMS, POLITISKA_MAL, SPECIFIKA_MAL, NUTS3_VALUES,
  PAGAENDE_STATUS, SPECIFIKT_MAL_DEFINITIONER, POLITISKT_MAL_DEFINITIONER,
  ORG_ROLLER, ROLL_LABELS, ROLL_DESCRIPTIONS, ORG_TYPER_DISPLAY, STRAND_VALUES,
} from '@/types';

export default function FilterBar({ alignLeft }: { alignLeft?: boolean }) {
  const { filters, setFilter, resetFilters } = useFilters();

  const hasFilters =
    filters.strand.length > 0 ||
    filters.program.length > 0 ||
    filters.politisktmal.length > 0 ||
    filters.specifiktmal.length > 0 ||
    filters.pagaende.length > 0 ||
    filters.organisationsroll.length > 0 ||
    filters.organisationstyp.length > 0 ||
    filters.nuts3.length > 0;

  return (
    <div className="border-b" style={{ borderColor: 'var(--color-border)', background: '#EEEAF6' }}>
      <div className={`${alignLeft ? '' : 'max-w-[1200px] mx-auto'} px-6 py-4`}>
        <div className="grid grid-cols-4 gap-3">
          <MultiSelectDropdown
            label="NUTS 3 (Län)"
            options={NUTS3_VALUES}
            selected={filters.nuts3}
            onChange={(v) => setFilter('nuts3', v)}
          />
          <MultiSelectDropdown
            label="Politiskt mål"
            options={POLITISKA_MAL}
            selected={filters.politisktmal}
            onChange={(v) => setFilter('politisktmal', v)}
            getDescription={(v) => POLITISKT_MAL_DEFINITIONER[v] ?? ''}
          />
          <MultiSelectDropdown
            label="Pågående Projekt"
            options={PAGAENDE_STATUS}
            selected={filters.pagaende}
            onChange={(v) => setFilter('pagaende', v)}
          />
          <MultiSelectDropdown
            label="Partnerroll"
            options={ORG_ROLLER}
            selected={filters.organisationsroll}
            onChange={(v) => setFilter('organisationsroll', v)}
            getLabel={(v) => ROLL_LABELS[v] ?? v}
            getDescription={(v) => ROLL_DESCRIPTIONS[v] ?? ''}
          />
          <MultiSelectDropdown
            label="Programkategori"
            options={STRAND_VALUES}
            selected={filters.strand}
            onChange={(v) => setFilter('strand', v)}
          />
          <MultiSelectDropdown
            label="Program"
            options={PROGRAMS}
            selected={filters.program}
            onChange={(v) => setFilter('program', v)}
          />
          <MultiSelectDropdown
            label="Specifikt mål"
            options={SPECIFIKA_MAL}
            selected={filters.specifiktmal}
            onChange={(v) => setFilter('specifiktmal', v)}
            getDescription={(v) => SPECIFIKT_MAL_DEFINITIONER[v] ?? ''}
          />
          <MultiSelectDropdown
            label="Organisationstyp"
            options={ORG_TYPER_DISPLAY}
            selected={filters.organisationstyp}
            onChange={(v) => setFilter('organisationstyp', v)}
          />
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-[7px] text-sm font-medium rounded-lg border transition-colors"
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
      </div>
    </div>
  );
}
