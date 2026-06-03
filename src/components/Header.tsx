'use client';

export default function Header() {
  return (
    <header className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-5">
        {/* Logo */}
        <img
          src="/logo-tillvaxtverket.svg"
          alt="Tillväxtverket"
          style={{ height: 44, width: 'auto', flexShrink: 0 }}
        />

        {/* Divider */}
        <div className="w-px self-stretch" style={{ background: 'var(--color-border)' }} />

        {/* Title */}
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          Svenska Partners i Interreg
        </h1>

      </div>
    </header>
  );
}
