'use client';

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

// Datum då data i tabeller och diagram togs ut ur källsystemet.
// Uppdatera detta värde vid varje nytt datauttag.
const DATAUTTAG = '9 juni 2026';

export default function OmDataPage() {
  return (
    <>
      <Header />
      <Navigation />

      <main className="max-w-[900px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Om data och ansvarsfriskrivning
          </h2>
        </div>

        {/* Tidstämpel */}
        <div
          className="rounded-xl px-5 py-4 mb-8"
          style={{ background: 'var(--color-kpi-bg)' }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            Datauttag
          </p>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {DATAUTTAG}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Samtliga uppgifter i webbplatsens tabeller och diagram avser data uttagna detta datum.
            Förändringar som skett därefter återspeglas inte.
          </p>
        </div>

        {/* Ansvarsfriskrivning */}
        <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
          <h3 className="text-base font-bold">Ansvarsfriskrivning</h3>
          <p>
            Uppgifterna på denna webbplats bygger på sammanställningar av data om svenska
            partners i Interreg-program under programperioden 2021–2027. Informationen
            tillhandahålls i informationssyfte och i befintligt skick.
          </p>
          <p>
            Trots att vi eftersträvar att uppgifterna ska vara korrekta och aktuella kan fel,
            brister eller ofullständigheter förekomma, till exempel till följd av
            eftersläpningar i källsystem, ändringar i projekt eller fel vid bearbetning av
            data. Vi lämnar inga garantier för uppgifternas riktighet, fullständighet eller
            aktualitet och tar inget ansvar för beslut som fattas eller åtgärder som vidtas
            på grundval av innehållet på webbplatsen.
          </p>
          <p>
            Uppgifterna utgör inte officiell statistik. För officiella och aktuella uppgifter
            om enskilda program eller projekt hänvisas till respektive programs sekretariat
            eller till Tillväxtverket.
          </p>
        </div>
      </main>
    </>
  );
}
