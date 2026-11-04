/**
 * Minimal CSV helpers for admin exports.
 *
 * columns: [{ header: 'Email', value: row => row.email }]  (value may also be a key string)
 */

// Cells starting with these characters can be interpreted as formulas by
// Excel / Sheets / LibreOffice (CSV injection). Prefix them with an apostrophe.
const FORMULA_START = /^[=+\-@\t\r]/;

function cell(value) {
  let s;
  if (value == null) s = '';
  else if (value instanceof Date) s = Number.isNaN(value.getTime()) ? '' : value.toISOString();
  else s = String(value);

  if (FORMULA_START.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows, columns) {
  const header = columns.map(c => cell(c.header)).join(',');
  const lines = (rows || []).map(row =>
    columns
      .map(c => cell(typeof c.value === 'function' ? c.value(row) : row?.[c.value ?? c.key]))
      .join(','),
  );
  return [header, ...lines].join('\r\n') + '\r\n';
}

export function downloadCsv(filename, csvText) {
  // BOM so Excel opens the file as UTF-8 (₹, Devanagari, accented names).
  const blob = new Blob(['﻿', csvText], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** YYYY-MM-DD in the user's local time zone. */
export function todayStamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date-only (YYYY-MM-DD, local) for created_at style values; '' if missing/invalid. */
export function csvDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
