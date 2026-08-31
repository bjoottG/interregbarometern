#!/usr/bin/env python3
"""Konverterar fliken 'Rådata' i data/Interreg Dashboard ...xlsx till
public/data/skapaeget.json (datat) och src/lib/skapaEgetMeta.ts (fältmetadata
för AI-chattens systemprompt). Kör om vid varje nytt datauttag:

    python3 scripts/konvertera_skapaeget.py
"""
import glob
import json
import warnings
from datetime import datetime

import openpyxl

warnings.filterwarnings('ignore')

XLSX = sorted(glob.glob('data/Interreg Dashboard*_data.xlsx'))[-1]

# Excel-kolumn (rubrikrad 3) -> JSON-fältnamn
FIELDS = [
    ('#', 'id'),
    ('Programme', 'program'),
    ('Type of project', 'projekttyp'),
    ('Start date', 'startdatum'),
    ('End date', 'slutdatum'),
    ('Project name', 'projektnamn'),
    ('VAT number', 'vatnummer'),
    ('Organisation name', 'organisationsnamn'),
    ('Organisation ownership', 'organisationsagande'),
    ('Type of organisation', 'organisationstyp'),
    ('Type of partner', 'partnerroll'),
    ('Kolumn1', 'stad'),
    ('NUTS 3', 'nuts3'),
    ('NUTS 2', 'nuts2'),
    ('ERDF per partner', 'partnerbudget'),
    ('Policy objective', 'politisktmal'),
    ('Specific objective', 'specifiktmal'),
    ('Datum_formel', 'projektar'),
    ('Land', 'land'),
]

# Kategoriska fält vars unika värden listas för AI:n
KATEGORISKA = [
    'program', 'projekttyp', 'organisationsagande', 'organisationstyp',
    'partnerroll', 'stad', 'nuts3', 'nuts2', 'politisktmal',
    'specifiktmal', 'projektar', 'land',
]

wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
rows = list(wb['Rådata'].iter_rows(values_only=True))
header = list(rows[2])
col_idx = {name: header.index(excel_name) for excel_name, name in
           [(e, n) for e, n in FIELDS]}
col_idx = {n: header.index(e) for e, n in FIELDS}


def convert(value, field):
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.strftime('%Y-%m-%d')
    if field == 'partnerbudget':
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0.0
    if field in ('id', 'projektar'):
        return str(value)
    return str(value).strip()


data = []
for r in rows[3:]:
    if not r[col_idx['projektnamn']] or not r[col_idx['organisationsnamn']]:
        continue
    data.append({field: convert(r[col_idx[field]], field) for _, field in FIELDS})

with open('public/data/skapaeget.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

meta_values = {
    field: sorted({row[field] for row in data if row[field] not in (None, '')})
    for field in KATEGORISKA
}

ts_lines = [
    '// GENERERAD FIL — kör `python3 scripts/konvertera_skapaeget.py` för att uppdatera.',
    '// Bygger på fliken Rådata i senaste Excel-filen under data/.',
    '',
    'export interface SkapaEgetRad {',
    '  id: string | null;',
    '  program: string | null;',
    '  projekttyp: string | null;',
    '  startdatum: string | null;',
    '  slutdatum: string | null;',
    '  projektnamn: string;',
    '  vatnummer: string | null;',
    '  organisationsnamn: string;',
    '  organisationsagande: string | null;',
    '  organisationstyp: string | null;',
    '  partnerroll: string | null;',
    '  stad: string | null;',
    '  nuts3: string | null;',
    '  nuts2: string | null;',
    '  partnerbudget: number | null;',
    '  politisktmal: string | null;',
    '  specifiktmal: string | null;',
    '  projektar: string | null;',
    '  land: string | null;',
    '}',
    '',
    f'export const ANTAL_RADER = {len(data)};',
    '',
    'export const FALT_VARDEN: Record<string, string[]> = '
    + json.dumps(meta_values, ensure_ascii=False, indent=2) + ';',
    '',
]

with open('src/lib/skapaEgetMeta.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_lines))

print(f'Skrev {len(data)} rader till public/data/skapaeget.json')
print(f'Skrev metadata för {len(KATEGORISKA)} fält till src/lib/skapaEgetMeta.ts')
