/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        earth: '#6b4a2f',
        sand: '#d8c3a0',
        stone: '#8a8275',
        fire: '#e2700f',
        charcoal: '#15110e',
        gold: '#c9a24b',
        moss: '#6f8f4f',
        copper: '#b5703b',
        bronze: '#8c6a3f',
        ash: '#2a241f',
      },
      fontFamily: {
        display: ['Heebo', 'system-ui', 'sans-serif'],
        body: ['Assistant', 'system-ui', 'sans-serif'],
        carved: ['"Suez One"', 'Georgia', 'serif'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
          '25%': { opacity: '0.7' },
          '75%': { opacity: '0.95' },
        },
        drift: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '100%': { transform: 'translateX(-40px) translateY(-20px)' },
        },
        emberRise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '15%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-120px) scale(0.4)', opacity: '0' },
        },
      },
      animation: {
        flicker: 'flicker 4s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite alternate',
        ember: 'emberRise 6s linear infinite',
      },
    },
  },
  plugins: [],
}
