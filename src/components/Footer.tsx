'use client';

import Link from 'next/link';

function mailHref(user: string, domain: string) {
  return `mailto:${user}@${domain}`;
}

const LINK_STYLE = { color: '#1D1D1B' };

export default function Footer() {
  return (
    <footer className="mt-12" style={{ background: '#F3F4F6' }}>
      <div className="max-w-[1200px] mx-auto px-10 py-12">
        <div className="grid gap-10" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr' }}>

          {/* Vänster: Logotyp + beskrivning */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src="/logo-tillvaxtverket.svg" alt="Tillväxtverket" style={{ height: 36, width: 'auto' }} />
              <span className="font-bold text-base" style={{ color: '#1D1D1B' }}>Tillväxtverket</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#1D1D1B' }}>
              Vi stärker företag, kommuner och regioner och skapar förutsättningar att
              möta framtidens utmaningar. För konkurrenskraftiga företag och hållbar
              utveckling – i alla delar av Sverige.
            </p>
          </div>

          {/* Hitta på sidan */}
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: '#1D1D1B' }}>Hitta på sidan</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/oversikt" className="text-sm underline" style={LINK_STYLE}>Översikt</Link></li>
              <li><Link href="/diagram" className="text-sm underline" style={LINK_STYLE}>Diagram</Link></li>
              <li><Link href="/tabell" className="text-sm underline" style={LINK_STYLE}>Partners</Link></li>
              <li><Link href="/ordlista" className="text-sm underline" style={LINK_STYLE}>Ordlista</Link></li>
            </ul>
          </div>

          {/* Mer info */}
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: '#1D1D1B' }}>Mer info</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="text-sm underline" style={LINK_STYLE}>
                  Tillgänglighetsredogörelse
                </a>
              </li>
              <li>
                <Link href="/om-innehallet" className="text-sm underline" style={LINK_STYLE}>
                  Om innehållet
                </Link>
              </li>
              <li>
                <a
                  href="https://eufonder.se/eufonder/hittaeufinansiering/interreg.6396.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                  style={LINK_STYLE}
                >
                  Interreg på EU-fonder.se
                </a>
              </li>
              <li>
                <a
                  href="https://tillvaxtverket.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                  style={LINK_STYLE}
                >
                  Tillväxtverket
                </a>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: '#1D1D1B' }}>Kontakt</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="tel:086819100" className="text-sm underline" style={LINK_STYLE}>
                  08-681 91 00
                </a>
              </li>
              <li>
                <a href={mailHref('info', 'tillvaxtverket.se')} className="text-sm underline" style={LINK_STYLE}>
                  info@tillvaxtverket.se
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
