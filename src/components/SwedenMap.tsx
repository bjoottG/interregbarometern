'use client';

import { useState } from 'react';
import { formatBudget, formatNumber } from '@/lib/dataUtils';

interface LänData {
  antalProjekt: number;
  antalPartners: number;
  budget: number;
}

interface Props {
  data: Map<string, LänData>;
  mode: 'nuts3' | 'nuts2';
}

interface Tooltip {
  x: number;
  y: number;
  name: string;
  stats: LänData | undefined;
}

// Mappning: SVG-id → visningsnamn (nuts3)
const LÄN_NAMN: Record<string, string> = {
  'SE-AB': 'Stockholms län',
  'SE-C':  'Uppsala län',
  'SE-D':  'Södermanlands län',
  'SE-E':  'Östergötlands län',
  'SE-F':  'Jönköpings län',
  'SE-G':  'Kronobergs län',
  'SE-H':  'Kalmar län',
  'SE-I':  'Gotlands län',
  'SE-K':  'Blekinge län',
  'SE-M':  'Skåne län',
  'SE-N':  'Hallands län',
  'SE-O':  'Västra Götalands län',
  'SE-S':  'Värmlands län',
  'SE-T':  'Örebro län',
  'SE-U':  'Västmanlands län',
  'SE-W':  'Dalarnas län',
  'SE-X':  'Gävleborgs län',
  'SE-Y':  'Västernorrlands län',
  'SE-Z':  'Jämtlands län',
  'SE-AC': 'Västerbottens län',
  'SE-BD': 'Norrbottens län',
};

// Förenklad SVG för svenska län (approximerade polygoner i ett 200×460 viewBox)
const LÄN_PATHS: Record<string, string> = {
  'SE-BD': 'M60,10 L140,10 L155,40 L150,80 L140,100 L120,110 L100,100 L80,110 L60,100 L50,70 L55,40 Z',
  'SE-AC': 'M60,100 L120,100 L140,100 L150,80 L155,120 L145,145 L130,155 L110,155 L90,145 L70,145 L55,130 L50,110 Z',
  'SE-Z':  'M55,130 L90,145 L110,155 L130,155 L145,145 L150,165 L140,185 L120,190 L100,190 L80,185 L65,170 L55,155 Z',
  'SE-Y':  'M80,185 L120,190 L140,185 L148,205 L142,225 L128,235 L110,237 L95,232 L82,220 L78,205 Z',
  'SE-X':  'M82,220 L110,237 L128,235 L140,245 L138,265 L125,272 L108,272 L92,265 L80,255 L78,238 Z',
  'SE-W':  'M80,255 L108,272 L125,272 L136,282 L134,300 L122,308 L106,308 L90,300 L78,288 Z',
  'SE-S':  'M78,288 L90,300 L106,308 L120,308 L130,315 L128,330 L118,336 L105,334 L92,328 L80,318 L74,305 Z',
  'SE-T':  'M100,300 L122,308 L130,315 L132,330 L124,340 L112,343 L100,340 L90,333 L88,320 Z',
  'SE-U':  'M100,340 L112,343 L124,340 L130,348 L128,360 L118,365 L106,363 L96,357 L94,348 Z',
  'SE-D':  'M96,357 L118,365 L128,360 L134,368 L132,380 L120,386 L106,384 L94,376 Z',
  'SE-C':  'M106,363 L128,360 L134,345 L142,348 L144,360 L138,372 L126,376 L114,373 Z',
  'SE-AB': 'M118,365 L134,368 L144,360 L150,365 L150,378 L140,386 L128,386 L118,380 Z',
  'SE-E':  'M94,376 L120,386 L132,380 L138,390 L136,402 L124,408 L110,406 L96,398 Z',
  'SE-F':  'M88,394 L110,406 L124,408 L130,416 L126,428 L114,432 L100,430 L86,422 L84,408 Z',
  'SE-G':  'M84,408 L100,430 L114,432 L118,442 L114,452 L103,455 L91,452 L82,443 L80,430 Z',
  'SE-H':  'M118,442 L114,452 L116,462 L124,467 L132,462 L134,450 L128,442 Z',
  'SE-N':  'M72,412 L88,420 L86,432 L80,442 L70,445 L60,440 L56,428 L60,416 Z',
  'SE-O':  'M56,370 L80,375 L90,380 L92,395 L86,408 L72,412 L60,410 L48,400 L44,386 L48,374 Z',
  'SE-K':  'M82,443 L91,452 L94,460 L88,466 L78,464 L72,456 L74,446 Z',
  'SE-M':  'M74,446 L82,443 L94,460 L96,470 L88,476 L76,474 L68,466 Z',
  'SE-I':  'M152,400 L162,395 L166,405 L160,412 L152,410 Z',
};

function interpolateColor(intensity: number): string {
  // Lila gradient: ljus (#EEEAF5) → mörk (#4A1B8B)
  const r = Math.round(238 - intensity * (238 - 74));
  const g = Math.round(234 - intensity * (234 - 27));
  const b = Math.round(245 - intensity * (245 - 139));
  return `rgb(${r},${g},${b})`;
}

export default function SwedenMap({ data, mode }: Props) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const maxValue = Math.max(...Array.from(data.values()).map((v) => v.antalProjekt), 1);

  return (
    <div className="relative">
      <svg
        viewBox="0 0 210 490"
        className="w-full max-w-[280px] mx-auto block"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
      >
        {Object.entries(LÄN_PATHS).map(([id, path]) => {
          const namn = LÄN_NAMN[id];
          const stats = data.get(namn);
          const intensity = stats ? stats.antalProjekt / maxValue : 0;
          const fill = stats ? interpolateColor(intensity) : '#F0F0F0';

          return (
            <path
              key={id}
              d={path}
              fill={fill}
              stroke="white"
              strokeWidth="1"
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={(e) => {
                const rect = (e.target as SVGPathElement).closest('svg')!.getBoundingClientRect();
                setTooltip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  name: namn,
                  stats,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 bg-white border rounded-lg shadow-lg p-3 text-xs pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            borderColor: 'var(--color-border)',
            minWidth: 160,
          }}
        >
          <p className="font-bold mb-1" style={{ color: 'var(--color-primary)' }}>{tooltip.name}</p>
          {tooltip.stats ? (
            <>
              <p style={{ color: 'var(--color-text)' }}>Projekt: <strong>{formatNumber(tooltip.stats.antalProjekt)}</strong></p>
              <p style={{ color: 'var(--color-text)' }}>Partners: <strong>{formatNumber(tooltip.stats.antalPartners)}</strong></p>
              <p style={{ color: 'var(--color-text)' }}>Budget: <strong>{formatBudget(tooltip.stats.budget)}</strong></p>
            </>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>Inga data</p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-2 justify-center">
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Få</span>
        <div className="h-3 w-24 rounded" style={{
          background: 'linear-gradient(to right, #EEEAF5, #4A1B8B)',
        }} />
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Många</span>
      </div>
    </div>
  );
}
