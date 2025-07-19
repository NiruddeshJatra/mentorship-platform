/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neural Growth Palette
        neural: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          500: '#6366f1', // Primary neural purple
          600: '#5856eb',
          700: '#4f46e5',
          900: '#312e81',
        },
        growth: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981', // Primary growth green
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        forest: {
          50: '#f0fdf4',
          500: '#064e3b', // Deep forest
          900: '#022c22',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'neural-pulse': 'neural-pulse 2s ease-in-out infinite',
        'grow': 'grow 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'neural-pulse': {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        grow: {
          '0%': { transform: 'scale(0.95)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        }
      },
      backgroundImage: {
        'neural-gradient': 'linear-gradient(135deg, #064e3b 0%, #6366f1 100%)',
        'growth-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'hero-gradient': 'linear-gradient(135deg, #064e3b 0%, #6366f1 50%, #10b981 100%)',
      }
    },
  },
  plugins: [],
}