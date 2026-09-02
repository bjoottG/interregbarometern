'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { formatNumber, formatBudget } from '@/lib/dataUtils';
import type { Projekt } from '@/types';

// Samma referensdatum som statusberäkningen i FilterContext
const TODAY = '2026-05-29';

interface Props {
  rows: Projekt[];
  /** Länka de två antalskorten till partnertabellen */
  linkTabell?: boolean;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
      style={{ background: '#EFEDF3', color: 'var(--color-text-muted)' }}
    >
      {children}
    </span>
  );
}

function Bar({ andel }: { andel: number }) {
  return (
    <div className="h-1.5 rounded-full w-full" style={{ background: '#E5E1EE' }}>
      <div
        className="h-1.5 rounded-full"
        style={{ background: 'var(--color-primary)', width: `${Math.min(Math.max(andel * 100, 0), 100)}%` }}
      />
    </div>
  );
}

function Kort({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 flex flex-col gap-2.5" style={{ borderColor: 'var(--color-border)' }}>
      {children}
    </div>
  );
}

const TITLE_STYLE = { color: 'var(--color-text)' };
const VALUE_STYLE = { fontSize: '2rem', color: 'var(--color-primary)', lineHeight: 1.15 };
const MUTED = { color: 'var(--color-text-muted)' };

export default function KPIRad({ rows, linkTabell }: Props) {
  const kpi = useMemo(() => {
    const partners = rows.length;
    const unikaOrg = new Set(rows.map(r => r.organisationsnamn)).size;
    const projektStatus = new Map<string, string>();
    let budget = 0;
    for (const r of rows) {
      budget += r.partnerbudget || 0;
      if (!projektStatus.has(r.projektnamn)) {
        projektStatus.set(
          r.projektnamn,
          r.startdatum > TODAY ? 'Kommande' : r.slutdatum < TODAY ? 'Avslutad' : 'Pågående',
        );
      }
    }
    const projekt = projektStatus.size;
    const statusar = [...projektStatus.values()];
    return {
      partners,
      unikaOrg,
      projekt,
      pagaende: statusar.filter(s => s === 'Pågående').length,
      avslutade: statusar.filter(s => s === 'Avslutad').length,
      budget,
      snittPerProjekt: projekt > 0 ? Math.round(budget / projekt / 1000) * 1000 : 0,
    };
  }, [rows]);

  const partnersValue = `${formatNumber(kpi.partners)}`;
  const projektValue = `${formatNumber(kpi.projekt)}`;
  const miljoner = `${(kpi.budget / 1_000_000).toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M€`;

  return (
    <div className="grid grid-cols-3 gap-4 mb-5">
      {/* Antal partners */}
      <Kort>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold" style={TITLE_STYLE}>Antal partners</p>
          <Chip>deltaganden</Chip>
        </div>
        {linkTabell ? (
          <Link href="/tabell" className="font-bold underline" style={{ ...VALUE_STYLE, textUnderlineOffset: 4 }}>{partnersValue}</Link>
        ) : (
          <p className="font-bold" style={VALUE_STYLE}>{partnersValue}</p>
        )}
        <div className="flex items-baseline justify-between text-sm" style={TITLE_STYLE}>
          <span>{formatNumber(kpi.unikaOrg)} unika organisationer</span>
          <span className="font-bold">
            {kpi.partners > 0 ? Math.round((kpi.unikaOrg / kpi.partners) * 100) : 0} %
          </span>
        </div>
        <Bar andel={kpi.partners > 0 ? kpi.unikaOrg / kpi.partners : 0} />
        <p className="text-xs" style={MUTED}>En organisation kan delta i flera projekt</p>
      </Kort>

      {/* Antal unika projekt */}
      <Kort>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold" style={TITLE_STYLE}>Antal unika projekt</p>
          <Chip>2021–2027</Chip>
        </div>
        {linkTabell ? (
          <Link href="/tabell" className="font-bold underline" style={{ ...VALUE_STYLE, textUnderlineOffset: 4 }}>{projektValue}</Link>
        ) : (
          <p className="font-bold" style={VALUE_STYLE}>{projektValue}</p>
        )}
        <Bar andel={kpi.projekt > 0 ? kpi.pagaende / kpi.projekt : 0} />
        <div className="flex gap-5 text-sm" style={TITLE_STYLE}>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--color-primary)' }} />
            Pågående {formatNumber(kpi.pagaende)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#E5E1EE' }} />
            Avslutade {formatNumber(kpi.avslutade)}
          </span>
        </div>
        <p className="text-xs" style={MUTED}>Varje projekt räknat en gång</p>
      </Kort>

      {/* EU-medel */}
      <Kort>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold" style={TITLE_STYLE}>
            EU-medel (<Link href="/ordlista#erdf-european-regional-development-fund" className="underline" style={{ textUnderlineOffset: 2 }}>ERDF</Link>)
          </p>
          <Chip>beviljat stöd</Chip>
        </div>
        <p className="font-bold" style={VALUE_STYLE}>{miljoner}</p>
        <p className="text-sm" style={TITLE_STYLE}>
          ≈ {formatNumber(kpi.snittPerProjekt)} € per projekt i snitt
        </p>
        <div className="flex items-baseline justify-between text-sm" style={TITLE_STYLE}>
          <span>Exakt belopp</span>
          <span className="font-bold">{formatBudget(kpi.budget)}</span>
        </div>
        <p className="text-xs" style={MUTED}>Beviljat EU-stöd — inte total projektbudget</p>
      </Kort>
    </div>
  );
}
