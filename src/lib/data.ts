import type { Projekt } from '@/types';

let cachedData: Projekt[] | null = null;

export async function getData(): Promise<Projekt[]> {
  if (cachedData) return cachedData;

  const res = await fetch('/data/rawdata.json');
  if (!res.ok) throw new Error('Kunde inte läsa rawdata.json');

  const json = await res.json();
  cachedData = json as Projekt[];
  return cachedData;
}

// Synchronous version for client components that have already loaded data
export function parseData(raw: unknown[]): Projekt[] {
  return raw as Projekt[];
}
