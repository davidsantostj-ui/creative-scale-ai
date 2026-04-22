/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0C10',
        surface: '#161B22',
        border: '#30363D',
        primary: '#00F2EA',
        accent: '#FF0050',
        muted: '#8B949E',
      },
    },
  },
  plugins: [],
};