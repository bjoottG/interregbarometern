'use client';

function mailHref(user: string, domain: string) {
  return `mailto:${user}@${domain}`;
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 flex-shrink-0" style={{ verticalAlign: 'middle' }}>
      <path d="M7 1h4v4M11 1L5.5 6.5M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1.5 flex-shrink-0" style={{ verticalAlign: 'middle' }}>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-12 pb-8 px-6">
      <div
        className="max-w-[1200px] mx-auto rounded-2xl px-10 py-10"
        style={{ background: '#F3F4F6' }}
      >
        <div className="grid grid-cols-3 gap-10">

          {/* Vänster: Logotyp */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src="/logo-tillvaxtverket.svg" alt="Tillväxtverket" style={{ height: 36, width: 'auto' }} />
              <span className="font-bold text-base" style={{ color: '#1D1D1B' }}>Tillväxtverket</span>
            </div>
          </div>

          {/* Mer info */}
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: '#1D1D1B' }}>Mer info</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://eufonder.se/eufonder/hittaeufinansiering/interreg.6396.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline inline-flex items-center"
                  style={{ color: '#1D1D1B' }}
                >
                  Interreg på EU-fonder.se
                  <ExternalIcon />
                </a>
              </li>
              <li>
                <a
                  href="https://tillvaxtverket.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline inline-flex items-center"
                  style={{ color: '#1D1D1B' }}
                >
                  Tillväxtverket
                  <ExternalIcon />
                </a>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: '#1D1D1B' }}>Kontakt</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={mailHref('Mattias.Assmundson', 'tillvaxtverket.se')}
                  className="text-sm underline inline-flex items-center"
                  style={{ color: '#1D1D1B' }}
                >
                  Mattias Assmundson
                  <MailIcon />
                </a>
              </li>
              <li>
                <a
                  href={mailHref('Robert.Berggren', 'tillvaxtverket.se')}
                  className="text-sm underline inline-flex items-center"
                  style={{ color: '#1D1D1B' }}
                >
                  Robert Berggren
                  <MailIcon />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
