/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        saffron: {
          DEFAULT: '#D9600A',
          light:   '#FDF1E8',
          mid:     '#F0B48A',
          dark:    '#BF530A',
        },
        emerald: {
          DEFAULT: '#1A7A4A',
          light:   '#EAF5EF',
          dark:    '#156039',
        },
        navy: {
          DEFAULT: '#1B3175',
          light:   '#EEF2FB',
          mid:     '#3B5AC6',
        },
        gold: {
          DEFAULT: '#B8730A',
          light:   '#FDF5E2',
        },
        ink: {
          DEFAULT: '#1C1815',
          soft:    '#3D3731',
        },
        cream: {
          DEFAULT: '#F4EFE4',
          mid:     '#EDE5D4',
          deep:    '#E4D9C4',
        },
        warm:   '#FAF7F1',
        border: '#D4C9B8',
        'border-soft': '#E6DED0',
        muted:  '#7A7068',
      },
      borderRadius: {
        xl2: '18px',
        xl3: '24px',
      },
      boxShadow: {
        xs:  '0 1px 3px rgba(28,24,21,0.06)',
        sm2: '0 2px 8px rgba(28,24,21,0.08)',
        md2: '0 6px 24px rgba(28,24,21,0.10)',
        lg2: '0 12px 40px rgba(28,24,21,0.12)',
      },
    },
  },
  plugins: [],
}
