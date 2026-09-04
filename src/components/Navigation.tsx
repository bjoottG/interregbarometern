'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DATAUTTAG } from '@/lib/site';

const tabs = [
  { label: 'Översikt', href: '/oversikt' },
  { label: 'Diagram', href: '/diagram' },
  { label: 'Partners', href: '/tabell' },
  { label: 'Ordlista', href: '/ordlista' },
];

export default function Navigation({ alignLeft }: { alignLeft?: boolean }) {
  const pathname = usePathname();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <nav className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className={`${alignLeft ? '' : 'max-w-[1200px] mx-auto'} px-6 flex gap-0`}>
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative px-5 py-3 text-sm font-medium transition-colors"
              style={{
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
            >
              {tab.label}
            </Link>
          );
        })}

        {/* Datauttag */}
        <div className="ml-auto self-center relative flex items-center gap-1.5 text-sm flex-shrink-0">
          <span style={{ color: 'var(--color-text-muted)' }}>Senast uppdaterad </span>
          <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
            {DATAUTTAG}
          </span>
          <button
            onClick={() => setInfoOpen(o => !o)}
            aria-label="Information om uppgifternas datum"
            aria-expanded={infoOpen}
            className="flex items-center justify-center"
            style={{ color: 'var(--color-primary)' }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <rect x="7.3" y="6.8" width="1.4" height="4.4" rx="0.7" fill="currentColor" />
              <circle cx="8" cy="4.9" r="0.9" fill="currentColor" />
            </svg>
          </button>

          {infoOpen && (
            <>
              <div className="fixed inset-0 z-[999]" onClick={() => setInfoOpen(false)} />
              <div
                className="absolute right-0 top-full mt-2 z-[1000] rounded-lg px-4 py-3 shadow-lg w-80 bg-white border"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                    Senast uppdaterad
                  </p>
                  <button
                    onClick={() => setInfoOpen(false)}
                    aria-label="Stäng"
                    className="text-sm leading-none px-1"
                    style={{ color: 'var(--color-text)' }}
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--color-text)' }}>
                  Uppgifterna uppdaterades senast {DATAUTTAG}.
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                  Tabellerna och diagrammen bygger på uppgifter som är inkomna innan detta
                  datum. Ändringar som skett senare syns inte på webbplatsen.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
