/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '3rem', xl: '4rem' },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#16211E',
          soft: '#2A3833',
        },
        pine: {
          50: '#EAF0EE',
          100: '#CFDEDA',
          200: '#9FBDB5',
          300: '#6E9B8F',
          400: '#3F786A',
          500: '#1B3A34',
          600: '#16302B',
          700: '#112622',
          800: '#0C1B18',
          900: '#08120F',
        },
        marigold: {
          50: '#FDF3E7',
          100: '#FBE4C4',
          200: '#F5C889',
          300: '#EFAC5C',
          400: '#E9963F',
          500: '#E08A3E',
          600: '#C06E27',
          700: '#96541E',
        },
        paper: '#FAF7F2',
        'paper-dim': '#F1ECE3',
        moss: '#69756F',
        alert: '#B23A2E',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.04', letterSpacing: '-0.01em' }],
        'display-md': ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.005em' }],
      },
      maxWidth: {
        prose: '38rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(22,33,30,0.04), 0 8px 24px rgba(22,33,30,0.06)',
        card: '0 1px 0 rgba(22,33,30,0.06)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
