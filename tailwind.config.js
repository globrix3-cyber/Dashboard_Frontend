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
        white: '#FDF9F1',
        gray: { 50: '#FDF9F1', 100: '#E3D5C1', 200: '#E3D5C1', 300: '#E3D5C1', 400: '#79634E', 500: '#79634E', 600: '#79634E', 700: '#5B4632', 800: '#5B4632', 900: '#2B2016' },
        orange: { 200: '#E3D5C1' },
        saffron: {
          DEFAULT: '#C8792C',
          light:   '#FDF9F1',
          mid:     '#F0DCC0',
          dark:    '#C8792C',
        },
        emerald: {
          DEFAULT: '#1A7A4A',
          light:   '#EAF5EF',
          dark:    '#156039',
        },
        navy: {
          DEFAULT: '#5B4632',
          light:   '#F0DCC0',
          mid:     '#5B4632',
        },
        gold: {
          DEFAULT: '#C8792C',
          light:   '#FDF9F1',
        },
        ink: {
          DEFAULT: '#5B4632',
          soft:    '#2B2016',
        },
        cream: {
          DEFAULT: '#E3D5C1',
          mid:     '#E3D5C1',
          deep:    '#E3D5C1',
        },
        warm:   '#FDF9F1',
        border: '#E3D5C1',
        'border-soft': '#E3D5C1',
        muted:  '#79634E',
      },
      borderRadius: {
        xl2: '18px',
        xl3: '24px',
      },
      boxShadow: {
        xs:  '0 1px 3px rgba(43,32,22,0.06)',
        sm2: '0 2px 8px rgba(43,32,22,0.08)',
        md2: '0 6px 24px rgba(43,32,22,0.10)',
        lg2: '0 12px 40px rgba(43,32,22,0.12)',
      },
    },
  },
  plugins: [],
}
