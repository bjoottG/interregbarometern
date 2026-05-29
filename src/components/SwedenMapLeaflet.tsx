'use client';

import { useEffect, useRef, useMemo } from 'react';
import type { Projekt } from '@/types';
import { formatNumber, formatBudget } from '@/lib/dataUtils';

interface Props {
  rows: Projekt[];
  mode: 'nuts3' | 'nuts2';
  onCountyClick?: (name: string) => void;
}

// Map GeoJSON NUTS_NAME → rawdata nuts3 value (identical in this dataset)
function buildStats(rows: Projekt[], mode: 'nuts3' | 'nuts2') {
  const map = new Map<string, { projekts: Set<string>; partners: number; budget: number }>();
  for (const r of rows) {
    const k = (mode === 'nuts3' ? r.nuts3 : r.nuts2) || '';
    if (!k) continue;
    if (!map.has(k)) map.set(k, { projekts: new Set(), partners: 0, budget: 0 });
    const e = map.get(k)!;
    e.projekts.add(r.projektnamn);
    e.partners += 1;
    e.budget += r.partnerbudget || 0;
  }
  const result = new Map<string, { projekt: number; partners: number; budget: number }>();
  for (const [k, v] of map) result.set(k, { projekt: v.projekts.size, partners: v.partners, budget: v.budget });
  return result;
}

function lerpColor(t: number): string {
  // #EEEAF5 (238,234,245) → #4A1B8B (74,27,139)
  const r = Math.round(238 + t * (74 - 238));
  const g = Math.round(234 + t * (27 - 234));
  const b = Math.round(245 + t * (139 - 245));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function SwedenMapLeaflet({ rows, mode, onCountyClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<{ map: unknown; layer: unknown } | null>(null);

  const stats = useMemo(() => buildStats(rows, mode), [rows, mode]);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    async function init() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css' as never);

      if (cancelled || !mapRef.current) return;

      // Destroy previous map
      if (leafletRef.current) {
        (leafletRef.current.map as ReturnType<typeof L.map>).remove();
        leafletRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [62.5, 16.5],
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 10,
      }).addTo(map);

      const geoRes = await fetch('/data/sweden-nuts3.geojson');
      const geoData = await geoRes.json();

      if (cancelled) return;

      const maxProjekt = Math.max(...Array.from(stats.values()).map(v => v.projekt), 1);

      const layer = L.geoJSON(geoData, {
        style: (feature) => {
          const name = (feature?.properties as { NUTS_NAME?: string })?.NUTS_NAME ?? '';
          const s = stats.get(name);
          const t = s ? s.projekt / maxProjekt : 0;
          return {
            fillColor: lerpColor(t),
            fillOpacity: 0.75,
            color: '#ffffff',
            weight: 1.5,
          };
        },
        onEachFeature: (feature, lyr) => {
          const name = (feature?.properties as { NUTS_NAME?: string })?.NUTS_NAME ?? '';
          const s = stats.get(name);
          const tooltipContent = `
            <div style="font-family:Inter,sans-serif;min-width:160px">
              <div style="font-weight:700;color:#4A1B8B;margin-bottom:4px">${name}</div>
              ${s ? `
                <div>Projekt: <strong>${formatNumber(s.projekt)}</strong></div>
                <div>Partners: <strong>${formatNumber(s.partners)}</strong></div>
                <div>Budget: <strong>${formatBudget(s.budget)}</strong></div>
              ` : '<div style="color:#666">Inga data</div>'}
            </div>
          `;
          lyr.bindTooltip(tooltipContent, { sticky: true, opacity: 0.95 });

          lyr.on('mouseover', function (this: unknown) {
            (this as ReturnType<typeof L.geoJSON>).setStyle({ weight: 2.5, fillOpacity: 0.9 });
          });
          lyr.on('mouseout', function (this: unknown) {
            layer.resetStyle(this as ReturnType<typeof L.geoJSON>);
          });
          lyr.on('click', () => { if (onCountyClick) onCountyClick(name); });
        },
      }).addTo(map);

      leafletRef.current = { map, layer };
    }

    init();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update colors when stats change without re-mounting
  useEffect(() => {
    if (!leafletRef.current) return;
    import('leaflet').then(({ default: L }) => {
      const layer = leafletRef.current?.layer as ReturnType<typeof L.geoJSON>;
      if (!layer) return;
      const maxProjekt = Math.max(...Array.from(stats.values()).map(v => v.projekt), 1);
      layer.setStyle((feature) => {
        const name = (feature?.properties as { NUTS_NAME?: string })?.NUTS_NAME ?? '';
        const s = stats.get(name);
        const t = s ? s.projekt / maxProjekt : 0;
        return { fillColor: lerpColor(t), fillOpacity: 0.75 };
      });
    });
  }, [stats]);

  return (
    <div className="relative w-full h-full min-h-[420px]">
      <div ref={mapRef} className="w-full h-full rounded-b-xl" style={{ minHeight: 420 }} />
      {/* Legend */}
      <div
        className="absolute bottom-6 left-3 z-[1000] bg-white rounded-lg px-3 py-2 text-xs shadow"
        style={{ border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2.5 w-20 rounded" style={{ background: 'linear-gradient(to right, #EEEAF5, #4A1B8B)' }} />
        </div>
        <div className="flex justify-between" style={{ color: 'var(--color-text-muted)' }}>
          <span>Få projekt</span>
          <span className="ml-4">Många</span>
        </div>
      </div>
    </div>
  );
}
