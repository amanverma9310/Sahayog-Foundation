/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16211E',
        pine: {
          50: '#EAF0EE', 100: '#CFDEDA', 200: '#9FBDB5', 300: '#6E9B8F',
          400: '#3F786A', 500: '#1B3A34', 600: '#16302B', 700: '#112622',
          800: '#0C1B18', 900: '#08120F',
        },
        marigold: {
          50: '#FDF3E7', 100: '#FBE4C4', 400: '#E9963F', 500: '#E08A3E', 600: '#C06E27',
        },
        paper: '#F7F8FA',
        alert: '#B23A2E',
      },
      fontFamily: {
        sans: ['"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
