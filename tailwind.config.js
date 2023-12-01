/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        'water-blue': '#222653',
      },
    },
  },
  plugins: [
    require("daisyui"),
    require('@headlessui/tailwindcss'),
    plugin(function ({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.bold') },
        'h2': { fontSize: theme('fontSize.xl') },
        'h3': { fontSize: theme('fontSize.lg') },
      });
    })],
  daisyui: {
    themes: ["winter", "night"],
  },
}

