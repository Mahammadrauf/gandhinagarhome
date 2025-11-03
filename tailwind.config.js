/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006D5B', // Brand green
          dark: '#005A4C', // Darker shade for hover
          light: '#008B75', // Lighter shade
        },
      },
    },
  },
  plugins: [],
}

