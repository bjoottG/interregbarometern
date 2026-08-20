'use client';

import { useState } from 'react';

export default function ExcelDownloadLink({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`text-xs underline ${className ?? ''}`}
        style={{ color: 'var(--color-primary)' }}
      >
        Ladda ner excel
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-bold text-sm mb-2" style={{ color: 'var(--color-text)' }}>
              Ingår inte i prototypen
            </h4>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Excel-nedladdning är inte tillgänglig i denna prototyp.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
