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
      keyframes: {
        unfold: {
          '0%': { transform: 'scaleY(0.8) translateY(12px)', opacity: '0', filter: 'blur(2px)' },
          '60%': { transform: 'scaleY(1.02) translateY(0px)', opacity: '1', filter: 'blur(0px)' },
          '100%': { transform: 'scaleY(1) translateY(0px)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '60%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        // tailwind.config.js (inside extend.keyframes)
        'rise-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(180px)',  // start lower for visible rise effect
            filter: 'blur(6px)' 
          },
          '60%': { 
            opacity: '1', 
            transform: 'translateY(-6px)',   // slight overshoot for natural feel
            filter: 'blur(0)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)', 
            filter: 'blur(0)' 
          },
        },

      },
      animation: {
        unfold: 'unfold 600ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both',
        pop: 'pop 300ms ease-out 0ms both',
        'rise-up': 'rise-up 2.2s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}

