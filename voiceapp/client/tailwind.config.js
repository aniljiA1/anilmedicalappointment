/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#edfcf9',
          100: '#d2f8f0',
          200: '#a9f0e3',
          300: '#6fe3d0',
          400: '#38ccba',
          500: '#18b0a0',
          600: '#108d82',
          700: '#117169',
          800: '#125956',
          900: '#134a47',
          950: '#042d2d',
        },
        surface: {
          50: '#f8fafc',
          100: '#f0f4f8',
          200: '#e2eaf2',
          300: '#c8d6e5',
          800: '#1a2332',
          900: '#0f1923',
          950: '#080e16',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
      },
      keyframes: {
        slideIn: { from: { transform: 'translateX(-20px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        fadeUp: { from: { transform: 'translateY(10px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
