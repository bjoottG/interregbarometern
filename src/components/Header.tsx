'use client';

export default function Header() {
  return (
    <header className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-3">
        <div className="w-1 h-9 rounded-full flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
            Tillväxtverket
          </p>
          <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--color-primary)' }}>
            Svenska partners i Interreg
          </h1>
        </div>
      </div>
    </header>
  );
}
