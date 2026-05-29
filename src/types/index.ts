export interface Projekt {
  id: number;
  program: string;
  projekttyp: string;
  startdatum: string;
  slutdatum: string;
  projektnamn: string;
  organisationsnamn: string;
  organisationsagande: string;
  organisationstyp: string;
  organisationsroll: string;
  nuts3: string;
  nuts2: string;
  partnerbudget: number;
  politisktmal: string;
  specifiktmal: string;
  projektår: number;
  land: string;
  aktiv: string;
}

export interface FilterState {
  program: string[];
  politisktmal: string[];
  specifiktmal: string[];
  projektnamn: string[];
  projekttyp: string[];
  projektår: string[];
  organisationsnamn: string[];
  organisationsroll: string[];
  pagaende: string[];   // Pågående Projekt: Pågående | Avslutad | Kommande
  aktiv: string;
  nuts2: string[];
  nuts3: string[];
}

export const FILTER_DEFAULTS: FilterState = {
  program: [],
  politisktmal: [],
  specifiktmal: [],
  projektnamn: [],
  projekttyp: [],
  projektår: [],
  organisationsnamn: [],
  organisationsroll: [],
  pagaende: [],
  aktiv: 'Alla',
  nuts2: [],
  nuts3: [],
};

export const PAGAENDE_STATUS = ['Pågående', 'Avslutad'];

export const PROGRAMS = [
  'AURORA',
  'Baltic Sea Region',
  'Central Baltic',
  'Interreg europe',
  'Interreg North Sea',
  'Northern Periphery and Arctic',
  'South Baltic Programme',
  'Sverige-Norge',
  'URBACT IV',
  'Öresund-Kattegat-Skagerrak',
];

export const POLITISKA_MAL = ['ISO', 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6'];

export const SPECIFIKA_MAL = [
  'ISO6.1', 'ISO6.6', 'RSO1.1', 'RSO1.2', 'RSO1.3', 'RSO1.4', 'RSO1.5',
  'RSO2.1', 'RSO2.2', 'RSO2.3', 'RSO2.4', 'RSO2.5', 'RSO2.6', 'RSO2.7', 'RSO2.8',
  'RSO3.1', 'RSO3.2',
  'RSO4.1', 'RSO4.2', 'RSO4.3', 'RSO4.4', 'RSO4.5', 'RSO4.6',
  'RSO5.1', 'RSO5.2',
  'RSO6.1', 'RSO6.4',
];

export const PROJEKTTYPER = ['Regular', 'Small', 'Feasibility study', 'Full Application'];

export const PROJEKTÅR = ['2022', '2023', '2024', '2025', '2026'];

export const ORG_ROLLER = ['LP', 'PP', 'AP'];

export const ROLL_LABELS: Record<string, string> = {
  LP: 'Lead Partner',
  PP: 'Projekt Partner',
  AP: 'Associate partner',
};

export const SPECIFIKT_MAL_DEFINITIONER: Record<string, string> = {
  'RSO1.1': 'Stärka forskning och innovation',
  'RSO1.2': 'Säkra nyttan av digitaliseringen',
  'RSO1.3': 'Små och medelstora företags tillväxt och konkurrenskraft',
  'RSO1.4': 'Kompetens för smart specialisering och omställning',
  'RSO1.5': 'Digital konnektivitet',
  'RSO2.1': 'Energieffektivitet',
  'RSO2.2': 'Förnybar energi',
  'RSO2.3': 'Smarta energisystem',
  'RSO2.4': 'Anpassa till klimatförändringarna',
  'RSO2.5': 'Främjande av tillgång till vatten och hållbar vattenförvaltning',
  'RSO2.6': 'Cirkulär ekonomi',
  'RSO2.7': 'Biologisk mångfald',
  'RSO2.8': 'Hållbar rörlighet i städer',
  'RSO3.1': 'Hållbara TEN-T-nät',
  'RSO3.2': 'Hållbara transporter',
  'RSO4.1': 'Infrastruktur för arbetsmarknaden',
  'RSO4.2': 'Göra utbildning och lärande tillgängligt för alla',
  'RSO4.4': 'Främja social inkludering och bekämpa fattigdom',
  'RSO4.6': 'Stärka kultur och hållbar turism',
  'RSO5.1': 'Stärka den territoriella sammanhållningen och lokala utvecklingen',
  'ISO6.6': 'Förbättra institutionell kapacitet och effektiv offentlig förvaltning',
  'JSO8.1': 'Fonden för rättvis omställning',
};

export const NUTS2_VALUES = [
  'Gotland',
  'Mellersta Norrland',
  'Norra Mellansverige',
  'Småland och öarna',
  'Stockholm',
  'Sydsverige',
  'Västsverige',
  'Östra Mellansverige',
  'Övre Norrland',
];

export const NUTS3_VALUES = [
  'Blekinge län',
  'Dalarnas län',
  'Gotlands län',
  'Gävleborgs län',
  'Hallands län',
  'Jämtlands län',
  'Jönköpings län',
  'Kalmar län',
  'Kronobergs län',
  'Norrbottens län',
  'Skåne län',
  'Stockholms län',
  'Södermanlands län',
  'Uppsala län',
  'Värmlands län',
  'Västerbottens län',
  'Västernorrlands län',
  'Västmanlands län',
  'Västra Götalands län',
  'Örebro län',
  'Östergötlands län',
];

export const DIAGRAM_COLORS = [
  '#00A896',
  '#4A1B8B',
  '#7B4FBC',
  '#2196A8',
  '#A855F7',
  '#E040FB',
  '#00BCD4',
  '#9C27B0',
  '#F48FB1',
  '#80CBC4',
];
