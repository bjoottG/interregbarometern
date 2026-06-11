'use client';

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

interface Term {
  term: string;
  category?: string;
  definition: string;
}

const TERMS: Term[] = [
  {
    term: 'AP – Associate Partner',
    category: 'Partnerroll',
    definition: 'Associerad partner. Deltar i projektet utan att erhålla EU-medel direkt. Bidrar med kompetens, nätverk eller resurser men är inte stödmottagare.',
  },
  {
    term: 'Avslutad (projekt)',
    category: 'Projektstatus',
    definition: 'Projekt vars slutdatum passerat. Projektet är avslutat och ingår inte i aktiva åtgärder.',
  },
  {
    term: 'ERDF – European Regional Development Fund',
    category: 'Finansiering',
    definition: 'EU:s regionalfond. Den fond som finansierar Interreg-programmen. ERDF syftar till att minska regionala skillnader i Europa genom investeringar i tillväxt, innovation och hållbarhet.',
  },
  {
    term: 'EU-medel (ERDF)',
    category: 'Finansiering',
    definition: 'Det EU-stöd från regionalfonden som en partner erhåller för sin del av projektet. Värdet i dashboarden avser enbart EU-medel och inkluderar inte medfinansiering från nationella eller regionala källor.',
  },
  {
    term: 'Gränsregionalt samarbete (Strand A)',
    category: 'Programkategori',
    definition: 'Interreg-program som samlar regioner längs gemensamma landgränser eller havsbaserade gränser. Exempel: Sverige–Norge, Öresund–Kattegat–Skagerrak, Central Baltic.',
  },
  {
    term: 'Interreg',
    category: 'Program',
    definition: 'EU:s program för territoriellt samarbete mellan regioner i Europa. Interreg finansieras av ERDF och syftar till att stärka ekonomisk, social och territoriell sammanhållning.',
  },
  {
    term: 'Interregionalt samarbete (Strand C)',
    category: 'Programkategori',
    definition: 'Pan-europeiskt Interreg-program för erfarenhetsutbyte och kapacitetsutveckling. Täcker hela EU. Exempel: Interreg Europe, URBACT IV.',
  },
  {
    term: 'ISO – Interreg-specifika mål',
    category: 'Politiskt mål',
    definition: 'En separat målkategori för Interreg-program som kompletterar de ordinarie politiska målen (PO1–PO5). Fokuserar på institutionell kapacitet och gränsöverskridande samarbete.',
  },
  {
    term: 'Kat. – Programkategori',
    category: 'Programkategori',
    definition: 'Förkortad beteckning för programkategori (strand). A = Gränsregionalt, B = Transnationellt, C = Interregionalt.',
  },
  {
    term: 'Lead Partner (LP)',
    category: 'Partnerroll',
    definition: 'Samordnad stödmottagare. Ansvarar för projektet gentemot programsekretariatet, undertecknar partnerskap­savtalet och hanterar EU-medlen för hela projektet.',
  },
  {
    term: 'LP – Lead Partner',
    category: 'Partnerroll',
    definition: 'Se Lead Partner.',
  },
  {
    term: 'NUTS – Nomenclature des Unités Territoriales Statistiques',
    category: 'Geografi',
    definition: 'EU:s standard för klassificering av geografiska regioner för statistiska ändamål. Används för att identifiera var partners är lokaliserade.',
  },
  {
    term: 'NUTS 2',
    category: 'Geografi',
    definition: 'Geografisk indelningsnivå 2 i EU:s NUTS-klassificering. Motsvarar i Sverige de åtta riksområdena, t.ex. Sydsverige, Västsverige och Norra Mellansverige.',
  },
  {
    term: 'NUTS 3',
    category: 'Geografi',
    definition: 'Geografisk indelningsnivå 3 i EU:s NUTS-klassificering. Motsvarar i Sverige de 21 länen, t.ex. Skåne, Västra Götaland och Norrbotten.',
  },
  {
    term: 'PO1 – Ett smartare Europa',
    category: 'Politiskt mål',
    definition: 'Politiskt mål 1. Fokuserar på innovation, digitalisering, SMF-tillväxt och smart specialisering.',
  },
  {
    term: 'PO2 – Ett grönare Europa',
    category: 'Politiskt mål',
    definition: 'Politiskt mål 2. Fokuserar på energiomställning, klimatanpassning, cirkulär ekonomi och biologisk mångfald.',
  },
  {
    term: 'PO3 – Ett mer sammanlänkat Europa',
    category: 'Politiskt mål',
    definition: 'Politiskt mål 3. Fokuserar på rörlighet, transport och digital infrastruktur.',
  },
  {
    term: 'PO4 – Ett mer socialt Europa',
    category: 'Politiskt mål',
    definition: 'Politiskt mål 4. Fokuserar på social inkludering, utbildning, hälsa och arbetsmarknad.',
  },
  {
    term: 'PO5 – Ett Europa närmare medborgarna',
    category: 'Politiskt mål',
    definition: 'Politiskt mål 5. Fokuserar på lokal och territoriell utveckling samt hållbar turism och kultur.',
  },
  {
    term: 'PP – Projekt Partner',
    category: 'Partnerroll',
    definition: 'Se Projekt Partner.',
  },
  {
    term: 'Programperiod 2021–2027',
    category: 'Program',
    definition: 'Den nuvarande EU-budgetperioden. Interreg-programmen i dashboarden tillhör denna period.',
  },
  {
    term: 'Projekt Partner (PP)',
    category: 'Partnerroll',
    definition: 'Medverkande projektpartner. Deltar aktivt i projektgenomförandet och erhåller EU-medel för sin del av projektet. Tecknar partnersk­apsavtal med Lead Partner.',
  },
  {
    term: 'Pågående (projekt)',
    category: 'Projektstatus',
    definition: 'Projekt vars startdatum passerats men slutdatum ännu inte nåtts. Projektet är aktivt och pågår.',
  },
  {
    term: 'RSO – Regionalspecifika mål',
    category: 'Specifikt mål',
    definition: 'Regionspecifika mål (Regional Specific Objectives) som specificerar hur ett projekt bidrar till ett politiskt mål. Varje politiskt mål har ett eller flera RSO-mål, t.ex. RSO1.1 Stärka forskning och innovation.',
  },
  {
    term: 'Specifikt mål',
    category: 'Specifikt mål',
    definition: 'Det detaljerade mål som ett projekt är kopplat till inom ett politiskt mål. Koderna börjar med RSO (Regionalspecifika mål) eller ISO (Interreg-specifika mål).',
  },
  {
    term: 'Strand',
    category: 'Programkategori',
    definition: 'Beteckning för typ av Interreg-program: A (Gränsregionalt), B (Transnationellt) eller C (Interregionalt). Bestäms av programmets geografiska och tematiska inriktning.',
  },
  {
    term: 'Svenska partners',
    category: 'Partner',
    definition: 'Organisationer registrerade i Sverige som deltar i ett Interreg-projekt i rollen som LP, PP eller AP. Dashboarden visar enbart svenska partners.',
  },
  {
    term: 'Tillväxtverket',
    category: 'Organisation',
    definition: 'Sveriges nationella myndighet för tillväxt och regional utveckling. Nationell kontaktpunkt för flera Interreg-program och ansvarar för att följa upp svenska partners deltagande.',
  },
  {
    term: 'Transnationellt samarbete (Strand B)',
    category: 'Programkategori',
    definition: 'Interreg-program som täcker större geografiska områden, t.ex. Östersjön eller Nordsjön. Samlar länder och regioner kring gemensamma utmaningar. Exempel: Baltic Sea Region, Interreg North Sea, Northern Periphery and Arctic.',
  },
];

const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term, 'sv'));

const CATEGORIES = [...new Set(TERMS.map(t => t.category).filter(Boolean))].sort() as string[];

const CATEGORY_COLORS: Record<string, string> = {
  'Finansiering':      '#00A896',
  'Geografi':          '#2196A8',
  'Organisation':      '#7B4FBC',
  'Partner':           '#4A1B8B',
  'Partnerroll':       '#4A1B8B',
  'Politiskt mål':     '#A855F7',
  'Program':           '#E040FB',
  'Programkategori':   '#7B4FBC',
  'Projektstatus':     '#00BCD4',
  'Specifikt mål':     '#9C27B0',
};

export default function OrdlistaPage() {
  return (
    <>
      <Header />
      <Navigation />

      <main className="max-w-[900px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Ordlista</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Förklaringar av begrepp och termer som används i dashboarden, sorterade i bokstavsordning.
          </p>
        </div>

        {/* Kategorilegende */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <span
              key={cat}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${CATEGORY_COLORS[cat] ?? '#888'}22`,
                color: CATEGORY_COLORS[cat] ?? '#888',
                border: `1px solid ${CATEGORY_COLORS[cat] ?? '#888'}44`,
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Termslista */}
        <div className="flex flex-col">
          {sorted.map((item, i) => (
            <div
              key={item.term}
              className="py-4 flex gap-6"
              style={{
                borderTop: i === 0 ? undefined : '1px solid var(--color-border)',
              }}
            >
              <div className="w-64 flex-shrink-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  {item.term}
                </p>
                {item.category && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block"
                    style={{
                      background: `${CATEGORY_COLORS[item.category] ?? '#888'}18`,
                      color: CATEGORY_COLORS[item.category] ?? '#888',
                    }}
                  >
                    {item.category}
                  </span>
                )}
              </div>
              <p className="text-sm flex-1 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
