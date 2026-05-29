'use client';

import { useState, useMemo } from 'react';
import { formatBudget, formatNumber, kpiTotalBudget } from '@/lib/dataUtils';
import { ROLL_LABELS } from '@/types';
import type { Projekt } from '@/types';

interface Props { rows: Projekt[] }

type SortKey = keyof Projekt | null;
type SortDir = 'asc' | 'desc';

const COLS: { key: keyof Projekt; label: string; numeric?: boolean }[] = [
  { key: 'program', label: 'Program' },
  { key: 'politisktmal', label: 'Politiskt mål' },
  { key: 'specifiktmal', label: 'Specifikt mål' },
  { key: 'projekttyp', label: 'Projekttyp' },
  { key: 'projektnamn', label: 'Projektnamn' },
  { key: 'organisationsnamn', label: 'Organisation' },
  { key: 'organisationsagande', label: 'Privat/Publik' },
  { key: 'organisationstyp', label: 'Org. typ' },
  { key: 'organisationsroll', label: 'Roll' },
  { key: 'nuts3', label: 'Nuts3' },
  { key: 'partnerbudget', label: 'Partnerbudget', numeric: true },
];

const PAGE_SIZE = 50;

export default function ProjectTable({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('partnerbudget');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  function handleSort(key: keyof Projekt) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  }

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb), 'sv')
        : String(vb).localeCompare(String(va), 'sv');
    });
  }, [rows, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalBudget = kpiTotalBudget(rows);

  function SortIcon({ col }: { col: keyof Projekt }) {
    if (sortKey !== col) return <span className="ml-1 opacity-30">↕</span>;
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
              {COLS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left py-2 px-2 font-semibold cursor-pointer select-none whitespace-nowrap hover:bg-gray-50"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {col.label}
                  <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
            {/* Totalrad */}
            <tr className="border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-kpi-bg)' }}>
              <td className="py-2 px-2 font-semibold" style={{ color: 'var(--color-primary)' }} colSpan={10}>
                Totaler ({formatNumber(rows.length)} rader)
              </td>
              <td className="py-2 px-2 font-semibold text-right font-mono" style={{ color: 'var(--color-primary)' }}>
                {formatBudget(totalBudget)}
              </td>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr
                key={`${row.id}-${i}`}
                className="border-b last:border-0 hover:bg-gray-50"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <td className="py-1.5 px-2" style={{ color: 'var(--color-text)' }}>{row.program}</td>
                <td className="py-1.5 px-2" style={{ color: 'var(--color-text)' }}>{row.politisktmal}</td>
                <td className="py-1.5 px-2" style={{ color: 'var(--color-text)' }}>{row.specifiktmal}</td>
                <td className="py-1.5 px-2" style={{ color: 'var(--color-text)' }}>{row.projekttyp}</td>
                <td className="py-1.5 px-2 max-w-[180px] truncate" style={{ color: 'var(--color-text)' }} title={row.projektnamn}>{row.projektnamn}</td>
                <td className="py-1.5 px-2 max-w-[150px] truncate" style={{ color: 'var(--color-text)' }} title={row.organisationsnamn}>{row.organisationsnamn}</td>
                <td className="py-1.5 px-2" style={{ color: 'var(--color-text)' }}>{row.organisationsagande}</td>
                <td className="py-1.5 px-2 max-w-[140px] truncate" style={{ color: 'var(--color-text)' }} title={row.organisationstyp}>{row.organisationstyp}</td>
                <td className="py-1.5 px-2" style={{ color: 'var(--color-text)' }}>{ROLL_LABELS[row.organisationsroll] ?? row.organisationsroll}</td>
                <td className="py-1.5 px-2 whitespace-nowrap" style={{ color: 'var(--color-text)' }}>{row.nuts3}</td>
                <td className="py-1.5 px-2 text-right font-mono" style={{ color: 'var(--color-primary)' }}>
                  {formatBudget(row.partnerbudget)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Visar {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} av {formatNumber(sorted.length)} rader
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-2 py-1 text-xs border rounded disabled:opacity-40"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            «
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 text-xs border rounded disabled:opacity-40"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            ‹
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const p = start + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="px-2 py-1 text-xs border rounded min-w-[28px]"
                style={{
                  borderColor: page === p ? 'var(--color-primary)' : 'var(--color-border)',
                  background: page === p ? 'var(--color-primary)' : 'white',
                  color: page === p ? 'white' : 'var(--color-text)',
                }}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 text-xs border rounded disabled:opacity-40"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            ›
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 text-xs border rounded disabled:opacity-40"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            »
          </button>
        </div>
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 rounded border" style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
            Ladda ner excel
          </button>
          <button className="text-xs px-2 py-1 rounded border" style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
            Ladda ner pdf
          </button>
        </div>
      </div>
    </div>
  );
}
