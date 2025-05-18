/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: 'hsl(172, 85%, 90%)',
          200: 'hsl(172, 85%, 80%)',
          300: 'hsl(172, 85%, 70%)',
          400: 'hsl(172, 85%, 60%)',
          500: 'hsl(172, 85%, 39%)',
          600: 'hsl(172, 85%, 30%)',
          700: 'hsl(172, 85%, 25%)',
          800: 'hsl(172, 85%, 20%)',
          900: 'hsl(172, 85%, 15%)',
        },
        secondary: {
          100: 'hsl(245, 90%, 90%)',
          200: 'hsl(245, 90%, 80%)',
          300: 'hsl(245, 90%, 70%)',
          400: 'hsl(245, 90%, 65%)',
          500: 'hsl(245, 90%, 61%)',
          600: 'hsl(245, 90%, 50%)',
          700: 'hsl(245, 90%, 40%)',
          800: 'hsl(245, 90%, 30%)',
          900: 'hsl(245, 90%, 20%)',
        },
        dark: {
          100: 'hsl(210, 45%, 16%)',
          200: 'hsl(210, 45%, 12%)',
          300: 'hsl(210, 45%, 10%)',
          400: 'hsl(210, 45%, 8%)',
          500: 'hsl(210, 45%, 6%)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} 