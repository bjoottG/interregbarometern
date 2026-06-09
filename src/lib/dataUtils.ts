import type { Projekt } from '@/types';

// ─── Formatering ───────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  return n.toLocaleString('sv-SE');
}

export function formatBudget(n: number): string {
  return `${formatNumber(Math.round(n))} EUR`;
}

// ─── KPI-beräkningar ────────────────────────────────────────────────────────

export function kpiAntalProjekt(rows: Projekt[]): number {
  return new Set(rows.map((r) => r.projektnamn)).size;
}

export function kpiTotalBudget(rows: Projekt[]): number {
  return rows.reduce((sum, r) => sum + (r.partnerbudget || 0), 0);
}

export function kpiAntalPartners(rows: Projekt[]): number {
  return rows.length;
}

// ─── Aggregeringar ──────────────────────────────────────────────────────────

/** Gruppera rader efter en nyckel, räkna unika projektnamn och summera budget */
export function groupBy(
  rows: Projekt[],
  key: keyof Projekt,
): { name: string; antalProjekt: number; antalPartners: number; budget: number }[] {
  const map = new Map<string, { projekts: Set<string>; partners: number; budget: number }>();

  for (const row of rows) {
    const k = String(row[key] ?? '');
    if (!map.has(k)) map.set(k, { projekts: new Set(), partners: 0, budget: 0 });
    const entry = map.get(k)!;
    entry.projekts.add(row.projektnamn);
    entry.partners += 1;
    entry.budget += row.partnerbudget || 0;
  }

  return Array.from(map.entries()).map(([name, v]) => ({
    name,
    antalProjekt: v.projekts.size,
    antalPartners: v.partners,
    budget: v.budget,
  }));
}

/** Top-N per budget (summerat per projektnamn) */
export function topProjektByBudget(
  rows: Projekt[],
  n = 3,
): { name: string; budget: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.projektnamn, (map.get(row.projektnamn) ?? 0) + (row.partnerbudget || 0));
  }
  return Array.from(map.entries())
    .map(([name, budget]) => ({ name, budget }))
    .sort((a, b) => b.budget - a.budget)
    .slice(0, n);
}

/** Top-N per budget (summerat per organisationsnamn) */
export function topOrgByBudget(
  rows: Projekt[],
  n = 3,
): { name: string; budget: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.organisationsnamn, (map.get(row.organisationsnamn) ?? 0) + (row.partnerbudget || 0));
  }
  return Array.from(map.entries())
    .map(([name, budget]) => ({ name, budget }))
    .sort((a, b) => b.budget - a.budget)
    .slice(0, n);
}

/** Munkdiagram-data: räknar partners per kategori */
export function countByField(
  rows: Projekt[],
  key: keyof Projekt,
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const k = String(row[key] ?? 'Okänd');
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  const total = rows.length;
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value, pct: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

/** Budget per år (linjediagram) */
export function budgetPerÅr(rows: Projekt[]): { år: string; budget: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const k = String(row.projektår);
    map.set(k, (map.get(k) ?? 0) + (row.partnerbudget || 0));
  }
  return Array.from(map.entries())
    .map(([år, budget]) => ({ år, budget }))
    .sort((a, b) => a.år.localeCompare(b.år));
}

/** Partners per nuts3 – för kartvy */
export function partnersPerNuts3(rows: Projekt[]): Map<string, { antalProjekt: number; antalPartners: number; budget: number }> {
  const map = new Map<string, { projekts: Set<string>; partners: number; budget: number }>();
  for (const row of rows) {
    const k = row.nuts3 || 'Okänd';
    if (!map.has(k)) map.set(k, { projekts: new Set(), partners: 0, budget: 0 });
    const e = map.get(k)!;
    e.projekts.add(row.projektnamn);
    e.partners += 1;
    e.budget += row.partnerbudget || 0;
  }
  const result = new Map<string, { antalProjekt: number; antalPartners: number; budget: number }>();
  for (const [k, v] of map.entries()) {
    result.set(k, { antalProjekt: v.projekts.size, antalPartners: v.partners, budget: v.budget });
  }
  return result;
}

/** Partners per nuts2 – för kartvy */
export function partnersPerNuts2(rows: Projekt[]): Map<string, { antalProjekt: number; antalPartners: number; budget: number }> {
  const map = new Map<string, { projekts: Set<string>; partners: number; budget: number }>();
  for (const row of rows) {
    const k = row.nuts2 || 'Okänd';
    if (!map.has(k)) map.set(k, { projekts: new Set(), partners: 0, budget: 0 });
    const e = map.get(k)!;
    e.projekts.add(row.projektnamn);
    e.partners += 1;
    e.budget += row.partnerbudget || 0;
  }
  const result = new Map<string, { antalProjekt: number; antalPartners: number; budget: number }>();
  for (const [k, v] of map.entries()) {
    result.set(k, { antalProjekt: v.projekts.size, antalPartners: v.partners, budget: v.budget });
  }
  return result;
}

/** Treemap-data: partners per organisationstyp × roll */
export interface TreemapCell {
  orgTyp: string;
  roll: string;
  count: number;
  pct: number;
}

export function treemapData(rows: Projekt[]): TreemapCell[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const k = `${row.organisationstyp}||${row.organisationsroll}`;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  const total = rows.length;
  return Array.from(map.entries()).map(([k, count]) => {
    const [orgTyp, roll] = k.split('||');
    return { orgTyp, roll, count, pct: total > 0 ? (count / total) * 100 : 0 };
  });
}

/** Choropleth: normalisera till 0–1 för färgintensitet */
export function choroplethScale(value: number, max: number): number {
  if (max === 0) return 0;
  return value / max;
}
