/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1D3557',     // Furlenco style deep navy
          teal: '#00A896',     // Primary teal action color
          mint: '#E0F2F1',     // Light mint background
          orange: '#FFB703',   // Accent warm color
          sand: '#FAFAFA',     // Off-white background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
} // force reload 2
