/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#1e2d42',  // Accent navy
          DEFAULT: '#0B1E36', // Primary brand deep navy
          dark: '#051329',   // Deepest navy for backgrounds
          slate: '#475569',
        },
        gold: {
          light: '#F5D77F',  // Golden hover highlight
          DEFAULT: '#D4AF37', // Primary metallic gold
          dark: '#B08E22',   // Deep bronze gold for active states
        },
        accent: {
          light: '#FDFBF7',  // Soft gold-tinted white
          slate: '#E2E8F0',  // Light grey
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
