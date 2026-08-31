'use client';

import { useRef, useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import EgenVisualisering, { type Visualisering } from '@/components/EgenVisualisering';
import { useFilters } from '@/context/FilterContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  visualisering?: Visualisering | null;
}

const EXEMPEL = [
  'EU-medel per program',
  'Antal projekt per politiskt mål som cirkeldiagram',
  'Tabell över de 10 län med flest partners',
];

export default function SkapaEgetPage() {
  const { filtered, isLoading } = useFilters();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const next: ChatMessage[] = [...messages, { role: 'user', text: question }];
    setMessages(next);
    setInput('');
    setBusy(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({
            role: m.role,
            content: m.role === 'assistant'
              ? JSON.stringify({ svar: m.text, visualisering: m.visualisering ?? null })
              : m.text,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.error ?? 'Något gick fel — försök igen.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: data.svar, visualisering: data.visualisering }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Kunde inte nå tjänsten — försök igen.' }]);
    } finally {
      setBusy(false);
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <Navigation />
        <div className="max-w-[1200px] mx-auto px-6 py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
          Laddar data…
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Navigation />

      <main className="max-w-[900px] mx-auto px-6 py-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Skapa eget</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Beskriv med egna ord vilket diagram eller vilken tabell du vill se, så skapar AI-assistenten den
            ur dashboardens data. Exempel: ”Visa EU-medel per län för programmet Aurora”.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: 'var(--color-border)' }}>
          {/* Konversation */}
          <div ref={listRef} className="flex flex-col gap-4 mb-4 overflow-auto" style={{ maxHeight: '55vh' }}>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {EXEMPEL.map(e => (
                  <button
                    key={e}
                    onClick={() => send(e)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i}>
                {m.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="rounded-xl px-4 py-2 text-sm max-w-[80%]" style={{ background: 'var(--color-kpi-bg)', color: 'var(--color-text)' }}>
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[95%]">
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>{m.text}</p>
                    {m.visualisering && <EgenVisualisering spec={m.visualisering} rows={filtered} />}
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Skapar…</p>
            )}
          </div>

          {/* Inmatning */}
          <div className="flex gap-3 items-end border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              placeholder="Beskriv diagrammet eller tabellen du vill skapa…"
              className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none resize-none"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
            />
            <button
              onClick={() => send(input)}
              disabled={busy || !input.trim()}
              className="px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Skicka
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
            Assistenten bygger visualiseringar ur dashboardens data. Kontrollera alltid resultatet — AI kan göra fel.
          </p>
        </div>
      </main>
    </>
  );
}
