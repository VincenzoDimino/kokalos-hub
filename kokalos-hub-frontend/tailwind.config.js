/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#070B14',
        mediterranean: '#0EA5E9',
        terracotta: '#F97316',
        goldSican: '#EAB308',
        glassDark: 'rgba(15, 23, 42, 0.72)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
