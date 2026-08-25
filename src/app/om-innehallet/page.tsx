'use client';

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { DATAUTTAG } from '@/lib/site';

export default function OmInnehalletPage() {
  return (
    <>
      <Header />
      <Navigation />

      <main className="max-w-[900px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Om innehållet
          </h2>
        </div>

        {/* Tidstämpel */}
        <div
          className="rounded-xl px-5 py-4 mb-8"
          style={{ background: 'var(--color-kpi-bg)' }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            Senast uppdaterad
          </p>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {DATAUTTAG}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Tabellerna och diagrammen bygger på uppgifter som är inkomna innan detta datum.
            Ändringar som skett senare syns inte på webbplatsen.
          </p>
        </div>

        {/* Ansvarsfriskrivning */}
        <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
          <h3 className="text-base font-bold">Viktig information</h3>
          <p>
            Vi gör vårt bästa för att säkerställa att informationen på denna webbplats är
            korrekt och uppdaterad. Trots detta kan vi inte garantera att all data är
            100&nbsp;% korrekt, fullständig eller aktuell. Fel och avvikelser kan förekomma.
          </p>
        </div>
      </main>
    </>
  );
}
