'use client';

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

export default function TillganglighetsredogorelsePage() {
  return (
    <>
      <Header />
      <Navigation />

      <main className="max-w-[900px] mx-auto px-6 py-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Tillgänglighetsredogörelse
        </h2>

        <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
          <p>
            Tillväxtverket står bakom den här webbplatsen och vi vill att så många som möjligt
            ska kunna använda den. Den här redogörelsen beskriver hur Svenska Partners i
            Interreg uppfyller lagen om tillgänglighet till digital offentlig service,
            eventuella kända tillgänglighetsproblem och hur du kan rapportera brister till oss.
          </p>

          <h3 className="text-base font-bold mt-2">Hur tillgänglig är webbplatsen?</h3>
          <p>
            Webbplatsen är delvis tillgänglig. Du kan läsa mer om vad som inte är tillgängligt
            längre ner.
          </p>

          <h3 className="text-base font-bold mt-2">Kan du inte använda delar av webbplatsen?</h3>
          <p>
            Om du behöver innehåll från Svenska Partners i Interreg, som inte är tillgängligt
            för dig, kan du kontakta oss. Därifrån hittar vi ett sätt att hjälpa dig.
          </p>

          <h3 className="text-base font-bold mt-2">Rapportera brister i webbplatsens tillgänglighet</h3>
          <p>
            Vi strävar hela tiden efter att förbättra webbplatsens tillgänglighet. Om du
            upptäcker problem som inte är beskrivna på den här sidan, eller om du anser att vi
            inte uppfyller lagens krav, kan du kontakta oss så att vi får veta att problemet
            finns.
          </p>

          <h3 className="text-base font-bold mt-2">Tillsyn</h3>
          <p>
            Myndigheten för digital förvaltning har ansvaret för tillsyn för lagen om
            tillgänglighet till digital offentlig service. Om du inte är nöjd med hur vi
            hanterar dina synpunkter kan du kontakta Myndigheten för digital förvaltning och
            påtala det.
          </p>

          <h3 className="text-base font-bold mt-2">Teknisk information om webbplatsens tillgänglighet</h3>
          <p>
            Den här webbplatsen är delvis förenlig med lagen om tillgänglighet till digital
            offentlig service, på grund av de brister som beskrivs nedan.
          </p>

          <h4 className="text-sm font-bold">Innehåll som inte är tillgängligt</h4>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>1.4.4 (A) R127, Se till att text går att förstora. Status: Ej godkänd</li>
            <li>1.4.10 (AA) R91, Skapa en flexibel layout som fungerar vid förstoring eller liten skärm. Status: Ej godkänd</li>
            <li>1.4.12 (AA) R157, Se till att det går att öka avstånd mellan tecken, rader, stycken och ord. Status: Ej godkänd</li>
          </ul>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Kommentar: Verktyget som webbplatsen bygger på erbjuder inte ett anpassningsbart
            gränssnitt på ett tillfredsställande sätt. Detta får negativa effekter på
            flexibilitet kopplat till olika skärmstorlekar och teckenstorlekar.
          </p>

          <h4 className="text-sm font-bold">Innehåll som är delvis tillgängligt</h4>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>1.1.1 (A) R115, Beskriv med text allt innehåll som inte är text. Status: Delvis godkänd</li>
            <li>1.3.1 (A) R121, Förmedla information, struktur och relationer i koden. Status: Delvis godkänd</li>
            <li>1.4.1 (A) Använd inte enbart färg för att förmedla information. Status: Delvis godkänd</li>
            <li>2.1.1 (A) R129, All funktionalitet ska kunna användas med tangentbord. Status: Delvis godkänd</li>
            <li>2.5.2 (A) R161, Gör det möjligt att ångra klick. Status: Ej godkänd</li>
            <li>4.1.2 (A) R152, Se till att komponenter fungerar i hjälpmedel. Status: Delvis godkänd</li>
          </ul>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Kommentar: Verktyget saknar stöd för fullt tillgänglig åtkomst till innehållet i
            diagram. Innehållet går att nå via nedladdningsbara excel- och pdf-filer. Vid
            automatisk granskning har även konstaterats att webbplatsens logotyp saknar
            alternativtext (1.1.1).
          </p>
          <p>
            Vi brister i ovanstående punkter då vår webbleverantör inte erbjuder allt en
            tillgänglig webbplats behöver. I takt med att de erbjuder nya versioner, som
            innehåller tillgängliga lösningar, kommer vi att införa dem.
          </p>

          <h3 className="text-base font-bold mt-2">Oskäligt betungande anpassning</h3>
          <p>
            Tillväxtverket åberopar undantag för oskäligt betungande anpassning enligt 12 §
            lagen om tillgänglighet till digital offentlig service för nedanstående innehåll.
            Då vår leverantör ännu inte har utvecklat alla förbättringar som krävs för att den
            här webbplatsen ska bli tillgänglig kan vi inte göra det. Vi har själva inte
            resurserna för att bygga en egen webbplats från grunden.
          </p>

          <h3 className="text-base font-bold mt-2">Hur vi testat webbplatsen</h3>
          <p>
            Webbplatsen har granskats med automatiserade tillgänglighetstester (Accessibility
            Insights for Web) av sidorna Översikt, Partners och Ordlista. Granskningen utgår
            även från en revision som en extern tillgänglighetsexpert gjort av en motsvarande
            tjänst hos Tillväxtverket, byggd i samma verktyg.
          </p>
          <p>
            Senaste bedömningen gjordes 1 september 2026.
            <br />
            Redogörelsen uppdaterades senast 1 september 2026.
          </p>
        </div>
      </main>
    </>
  );
}
