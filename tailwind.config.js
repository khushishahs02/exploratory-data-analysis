/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Instrument Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0A0C0F',
          900: '#12151A',
          800: '#1C2128',
          700: '#2D3440',
          600: '#3D4755',
          500: '#556070',
        },
        stone: {
          50:  '#F8F7F4',
          100: '#F0EEE9',
          200: '#E4E1D9',
          300: '#CCC8BE',
        },
        gold: {
          400: '#C9A84C',
          500: '#B8922E',
          600: '#9E7B1F',
        },
        risk: {
          low:  '#2D6A4F',
          mid:  '#B5752A',
          high: '#8B2635',
        }
      },
      letterSpacing: {
        widest2: '0.2em',
      }
    },
  },
  plugins: [],
}
