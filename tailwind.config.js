/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        secondary: '#7B2CBF',
        accent: '#00D9FF',
        surface: '#181818',
        background: '#121212',
        'gray-light': '#B3B3B3',
        'gray-medium': '#535353',
        'gray-dark': '#282828',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(123, 44, 191, 0.6)',
        'glow-green': '0 0 20px rgba(29, 185, 84, 0.6)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'player': '0 -4px 20px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-green': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}