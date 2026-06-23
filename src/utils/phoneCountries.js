// Dial codes for the countries this marketplace actually serves (matches the
// country list already used for products/suppliers elsewhere in the app).
// Sorted with India first since that's the default for this platform.
export const PHONE_COUNTRIES = [
  { iso: 'IN', dial: '+91',  name: 'India' },
  { iso: 'US', dial: '+1',   name: 'United States' },
  { iso: 'GB', dial: '+44',  name: 'United Kingdom' },
  { iso: 'AE', dial: '+971', name: 'United Arab Emirates' },
  { iso: 'CN', dial: '+86',  name: 'China' },
  { iso: 'BD', dial: '+880', name: 'Bangladesh' },
  { iso: 'VN', dial: '+84',  name: 'Vietnam' },
  { iso: 'TH', dial: '+66',  name: 'Thailand' },
  { iso: 'PK', dial: '+92',  name: 'Pakistan' },
  { iso: 'LK', dial: '+94',  name: 'Sri Lanka' },
  { iso: 'NP', dial: '+977', name: 'Nepal' },
  { iso: 'ID', dial: '+62',  name: 'Indonesia' },
];

export const DEFAULT_PHONE_COUNTRY = PHONE_COUNTRIES[0]; // India

// Stored as a single "phone_number" string (e.g. "+91 9876543210") — there's
// no separate country-code column, so combine/split here instead.
export function combinePhone(dial, number) {
  const digits = (number || '').replace(/\D/g, '');
  return digits ? `${dial} ${digits}` : '';
}

export function splitPhone(stored) {
  if (!stored) return { dial: DEFAULT_PHONE_COUNTRY.dial, number: '' };
  const match = PHONE_COUNTRIES
    .filter(c => stored.startsWith(c.dial))
    .sort((a, b) => b.dial.length - a.dial.length)[0]; // longest-prefix match (e.g. +971 before +91... no overlap, but stay safe)
  if (match) {
    return { dial: match.dial, number: stored.slice(match.dial.length).replace(/\D/g, '') };
  }
  return { dial: DEFAULT_PHONE_COUNTRY.dial, number: stored.replace(/\D/g, '') };
}
