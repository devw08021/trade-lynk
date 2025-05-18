/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E3F2FD',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          800: '#1565C0',
          900: '#0D47A1',
        },
        dark: {
          100: '#2E2E2E',
          200: '#232323',
          300: '#1C1C1C',
          400: '#181818',
          800: '#0E0E0E',
        },
      },
    },
  },
  plugins: [],
} 