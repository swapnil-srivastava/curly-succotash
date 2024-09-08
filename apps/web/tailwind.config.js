/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4B5563',
          dark: '#E5E7EB',
        },
        secondary: {
          light: '#60A5FA',
          dark: '#3B82F6',
        },
        background: {
          light: '#F3F4F6',
          dark: '#1F2937',
        },
      },
    },
  },
  plugins: [],
}