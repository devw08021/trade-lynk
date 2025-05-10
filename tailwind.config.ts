import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          950: '#0B0E11',
          900: '#1A1F2B',
          800: '#2D3748',
          700: '#4A5568',
          500: '#A0AEC0',
          400: '#CBD5E0',
        },
        blue: {
          400: '#60A5FA',
          500: '#3B82F6',
        },
        purple: {
          500: '#A855F7',
          600: '#9333EA',
        },
        green: {
          400: '#4ADE80',
          500: '#22C55E',
        },
        red: {
          400: '#F87171',
          500: '#EF4444',
        },
        teal: {
          500: '#14B8A6',
        },
        pink: {
          500: '#EC4899',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
