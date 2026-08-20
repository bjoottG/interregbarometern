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
  // #FFFFFF (255,255,255) → #4A1B8B (74,27,139)
  const r = Math.round(255 + t * (74 - 255));
  const g = Math.round(255 + t * (27 - 255));
  const b = Math.round(255 + t * (139 - 255));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function SwedenMapLeaflet({ rows, mode, onCountyClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<{ map: unknown; layer: unknown } | null>(null);

  const stats = useMemo(() => buildStats(rows, mode), [rows, mode]);
  const maxProjekt = useMemo(
    () => Math.max(...Array.from(stats.values()).map(v => v.projekt), 1),
    [stats],
  );

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
        center: [62.0, 15.5],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

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
            fillOpacity: 1,
            color: '#1a1a1a',
            weight: 1,
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
            (this as ReturnType<typeof L.geoJSON>).setStyle({ weight: 2.5 });
          });
          lyr.on('mouseout', function (this: unknown) {
            layer.resetStyle(this as ReturnType<typeof L.geoJSON>);
          });
          lyr.on('click', () => { if (onCountyClick) onCountyClick(name); });
        },
      }).addTo(map);

      map.fitBounds(layer.getBounds(), { padding: [10, 10] });

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
        return { fillColor: lerpColor(t), fillOpacity: 1 };
      });
    });
  }, [stats]);

  return (
    <div className="relative w-full h-full min-h-[420px]">
      <div ref={mapRef} className="w-full h-full rounded-b-xl" style={{ minHeight: 680, background: '#fff' }} />
      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] text-xs" style={{ color: 'var(--color-text)' }}>
        <p className="mb-1.5 font-medium">Antal projekt</p>
        <div className="flex items-start gap-1.5">
          <div
            className="w-3"
            style={{ height: 110, background: 'linear-gradient(to top, #FFFFFF, #4A1B8B)', border: '1px solid var(--color-border)' }}
          />
          <div className="flex flex-col justify-between" style={{ height: 110, color: 'var(--color-text-muted)' }}>
            <span>– {formatNumber(maxProjekt)}</span>
            <span>– 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
