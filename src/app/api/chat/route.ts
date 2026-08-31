import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import {
  PROGRAMS, POLITISKA_MAL, SPECIFIKA_MAL, NUTS3_VALUES,
  ORG_TYPER_DISPLAY, STRAND_VALUES, ORG_ROLLER, PROJEKTTYPER,
  POLITISKT_MAL_DEFINITIONER, SPECIFIKT_MAL_DEFINITIONER, ROLL_LABELS,
} from '@/types';

export const maxDuration = 60;

const GRUPPERINGAR = [
  'program', 'nuts3', 'politisktmal', 'specifiktmal',
  'strand_kod', 'organisationsroll', 'organisationstyp',
  'projekttyp', 'projektnamn', 'organisationsnamn',
] as const;

const MATVARDEN = ['antalPartners', 'unikaPartners', 'antalProjekt', 'budget'] as const;

const VisualiseringSchema = z.object({
  typ: z.enum(['stapel', 'cirkel', 'tabell']),
  grupperaPa: z.enum(GRUPPERINGAR),
  matvarde: z.enum(MATVARDEN),
  filter: z.object({
    program: z.array(z.string()).nullable(),
    nuts3: z.array(z.string()).nullable(),
    politisktmal: z.array(z.string()).nullable(),
    specifiktmal: z.array(z.string()).nullable(),
    strand_kod: z.array(z.string()).nullable(),
    organisationsroll: z.array(z.string()).nullable(),
    organisationstyp: z.array(z.string()).nullable(),
    projekttyp: z.array(z.string()).nullable(),
  }),
  topN: z.number().nullable(),
  titel: z.string(),
});

const SvarSchema = z.object({
  svar: z.string(),
  visualisering: VisualiseringSchema.nullable(),
});

const SYSTEM_PROMPT = `Du är en hjälpsam dataanalys-assistent i dashboarden "Svenska Partners i Interreg" (Tillväxtverket). Användaren ställer frågor på svenska och du hjälper dem skapa egna diagram och tabeller ur dashboardens dataset.

DATASETET: En rad per svensk partner-medverkan i ett Interreg-projekt, programperioden 2021–2027. Fält och giltiga värden:
- program: ${PROGRAMS.join(', ')}
- nuts3 (län): ${NUTS3_VALUES.join(', ')}
- politisktmal: ${POLITISKA_MAL.map(m => `${m} (${POLITISKT_MAL_DEFINITIONER[m] ?? ''})`).join(', ')}
- specifiktmal: ${SPECIFIKA_MAL.map(m => `${m} (${SPECIFIKT_MAL_DEFINITIONER[m] ?? ''})`).join(', ')}
- strand_kod (programkategori): ${STRAND_VALUES.join(', ')} (A = Gränsregionalt, B = Transnationellt, C = Interregionalt)
- organisationsroll: ${ORG_ROLLER.map(r => `${r} (${ROLL_LABELS[r] ?? r})`).join(', ')}
- organisationstyp: ${ORG_TYPER_DISPLAY.join(', ')}
- projekttyp: ${PROJEKTTYPER.join(', ')}
- projektnamn, organisationsnamn: fritext
- partnerbudget: beviljat EU-stöd (ERDF) i euro per partner

MÄTVÄRDEN du kan välja:
- antalPartners: antal partnerrader
- unikaPartners: antal unika organisationer
- antalProjekt: antal unika projekt
- budget: summa EU-medel (ERDF) i euro

SVARSFORMAT: Du svarar alltid med JSON enligt schemat.
- "svar": kort förklaring på svenska av vad du visar (1–3 meningar). Skriv klarspråk.
- "visualisering": specifikation för diagram/tabell, eller null om frågan inte går att besvara med datasetet (förklara då varför i "svar" och föreslå vad du kan visa i stället).
- Välj typ: "stapel" för jämförelser, "cirkel" för fördelningar med få kategorier (max 6), "tabell" för detaljerade listor eller när användaren ber om tabell.
- Filtervärden måste exakt matcha de giltiga värdena ovan. Sätt null för filter som inte används.
- topN: begränsa antal rader/staplar (t.ex. 10 för topplistor), annars null.
- Svara aldrig på frågor som inte rör datasetet eller dashboarden — förklara vänligt att du bara hjälper till med Interreg-datat.`;

// Enkel rate-limiter per IP (per serverless-instans)
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'okänd';
  if (rateLimited(ip)) {
    return Response.json(
      { error: 'För många frågor — försök igen om en stund.' },
      { status: 429 },
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Ogiltig förfrågan.' }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12)
    .map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content.slice(0, 4000),
    }));

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return Response.json({ error: 'Ingen fråga angiven.' }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'AI-tjänsten är felkonfigurerad: API-nyckel saknas i miljön.' },
      { status: 500 },
    );
  }

  const client = new Anthropic({
    ...(process.env.ANTHROPIC_WORKSPACE_ID
      ? { defaultHeaders: { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID } }
      : {}),
  });

  try {
    const response = await client.messages.parse({
      model: 'claude-opus-5',
      max_tokens: 4000,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      ],
      messages: history,
      output_config: { format: zodOutputFormat(SvarSchema) },
    });

    if (response.stop_reason === 'refusal' || !response.parsed_output) {
      return Response.json(
        { svar: 'Jag kunde tyvärr inte besvara den frågan. Prova att formulera om den.', visualisering: null },
      );
    }

    return Response.json(response.parsed_output);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'Tjänsten är hårt belastad — försök igen strax.' }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: 'AI-tjänsten är felkonfigurerad.' }, { status: 500 });
    }
    console.error('Chat API error:', error);
    const detail = error instanceof Error ? `${error.constructor.name}: ${error.message.slice(0, 300)}` : String(error).slice(0, 300);
    return Response.json({ error: 'Något gick fel — försök igen.', detail }, { status: 500 });
  }
}
