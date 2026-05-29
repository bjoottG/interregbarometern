'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelectDropdown({ label, options, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggle(val: string) {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  }

  const displayText =
    selected.length === 0
      ? `Alla värden (${options.length})`
      : selected.length === 1
      ? selected[0]
      : `${selected.length} valda`;

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      <label className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border rounded-lg text-left"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <span className="truncate" style={{ color: selected.length === 0 ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
            {displayText}
          </span>
          <svg className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div
            className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {options.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt)}
                    className="rounded"
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ color: 'var(--color-text)' }}>{opt}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
