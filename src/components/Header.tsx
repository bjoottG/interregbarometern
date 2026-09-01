'use client';

export default function Header() {
  return (
    <header className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-5">
        {/* Logo */}
        <a href="https://interreg-dashboard.vercel.app/oversikt" style={{ flexShrink: 0 }}>
          <img
            src="/logo-tillvaxtverket.svg"
            alt="Tillväxtverket"
            style={{ height: 44, width: 'auto' }}
          />
        </a>

        {/* Divider */}
        <div className="w-px self-stretch" style={{ background: 'var(--color-border)' }} />

        {/* Title */}
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            Svenska Partners i Interreg
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            En översikt av svenska partners i Interreg-projekt 2021–2027: vilka deltar, var de finns och hur EU-medlen fördelas
          </p>
        </div>

      </div>
    </header>
  );
}
