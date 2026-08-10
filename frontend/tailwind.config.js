/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#0D0E10',
        surface: '#17181C',
        border: {
          DEFAULT: '#23252B',
          dark: '#1E2026',
        },
        cyan: {
          DEFAULT: '#00D2FF',
          dim: 'rgba(0,210,255,0.08)',
          glow: 'rgba(0,210,255,0.15)',
          50: '#e0fbff',
          100: '#b3f4ff',
          200: '#80ecff',
          300: '#4de5ff',
          400: '#26dfff',
          500: '#00D2FF',
          600: '#00a8cc',
          700: '#007d99',
          800: '#005266',
          900: '#002733',
        },
        slate: {
          DEFAULT: '#8A909E',
          dark: '#5A6070',
          darker: '#3A3F4A',
        },
      },
      borderRadius: {
        DEFAULT: '12px',
        card: '12px',
        sm: '8px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0,210,255,0.15)',
        'cyan-sm': '0 0 8px rgba(0,210,255,0.2)',
        'surface': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'chart-grow': 'chartGrow 0.8s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        chartGrow: {
          '0%': { height: '0%', opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}