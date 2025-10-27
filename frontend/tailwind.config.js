/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flow: {
          green: '#00EF8B',
          dark: '#1a1a1a',
          gray: '#2d2d2d',
        }
      }
    },
  },
  plugins: [],
}
