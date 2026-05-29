'use client';

import { useFilters } from '@/context/FilterContext';
import MultiSelectDropdown from './MultiSelectDropdown';
import SearchDropdown from './SearchDropdown';
import {
  PROGRAMS, POLITISKA_MAL, SPECIFIKA_MAL,
  PROJEKTTYPER, PROJEKTÅR, ORG_ROLLER,
  NUTS2_VALUES, NUTS3_VALUES,
} from '@/types';

export default function FilterPanel() {
  const { filters, setFilter, resetFilters, allProjektnamn, allOrganisationsnamn } = useFilters();

  const hasFilters =
    filters.program.length > 0 ||
    filters.politisktmal.length > 0 ||
    filters.specifiktmal.length > 0 ||
    filters.projektnamn.length > 0 ||
    filters.projekttyp.length > 0 ||
    filters.projektår.length > 0 ||
    filters.organisationsnamn.length > 0 ||
    filters.organisationsroll.length > 0 ||
    filters.aktiv !== 'Alla' ||
    filters.nuts2.length > 0 ||
    filters.nuts3.length > 0;

  return (
    <div
      className="bg-white rounded-xl shadow-sm border p-5 mb-6"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          Filter
        </h2>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="text-sm font-medium px-3 py-1 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
          >
            Återställ
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
        {/* Grupp 1 – Stödform */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
            Stödform
          </p>
          <MultiSelectDropdown
            label="Program"
            options={PROGRAMS}
            selected={filters.program}
            onChange={(v) => setFilter('program', v)}
          />
          <MultiSelectDropdown
            label="Politiskt mål"
            options={POLITISKA_MAL}
            selected={filters.politisktmal}
            onChange={(v) => setFilter('politisktmal', v)}
          />
          <MultiSelectDropdown
            label="Specifikt mål"
            options={SPECIFIKA_MAL}
            selected={filters.specifiktmal}
            onChange={(v) => setFilter('specifiktmal', v)}
          />
        </div>

        {/* Grupp 2 – Projektspecifikt */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
            Projektspecifikt
          </p>
          <SearchDropdown
            label="Projektnamn"
            options={allProjektnamn}
            selected={filters.projektnamn}
            onChange={(v) => setFilter('projektnamn', v)}
          />
          <MultiSelectDropdown
            label="Projekttyp"
            options={PROJEKTTYPER}
            selected={filters.projekttyp}
            onChange={(v) => setFilter('projekttyp', v)}
          />
          <MultiSelectDropdown
            label="Projekt år"
            options={PROJEKTÅR}
            selected={filters.projektår}
            onChange={(v) => setFilter('projektår', v)}
          />
        </div>

        {/* Grupp 3 – Organisationsspecifikt */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
            Organisationsspecifikt
          </p>
          <SearchDropdown
            label="Organisation namn"
            options={allOrganisationsnamn}
            selected={filters.organisationsnamn}
            onChange={(v) => setFilter('organisationsnamn', v)}
          />
          <MultiSelectDropdown
            label="Organisation roll"
            options={ORG_ROLLER}
            selected={filters.organisationsroll}
            onChange={(v) => setFilter('organisationsroll', v)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              Organisation aktiv
            </label>
            <select
              value={filters.aktiv}
              onChange={(e) => setFilter('aktiv', e.target.value)}
              className="px-3 py-2 text-sm bg-white border rounded-lg"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              {['Alla', 'Ja', 'Nej'].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <MultiSelectDropdown
            label="Org. Nuts2"
            options={NUTS2_VALUES}
            selected={filters.nuts2}
            onChange={(v) => setFilter('nuts2', v)}
          />
          <MultiSelectDropdown
            label="Org. Nuts3"
            options={NUTS3_VALUES}
            selected={filters.nuts3}
            onChange={(v) => setFilter('nuts3', v)}
          />
        </div>
      </div>
    </div>
  );
}
