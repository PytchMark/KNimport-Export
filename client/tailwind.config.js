/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', 
    './src/**/*.{js,jsx}',
    '../client/index.html',
    '../client/src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0A',
          paper: '#111111',
          subtle: '#171717'
        },
        primary: {
          DEFAULT: '#fbbf24',
          hover: '#f59e0b',
          foreground: '#000000'
        },
        secondary: {
          DEFAULT: '#22c55e',
          hover: '#16a34a',
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff'
        },
        border: {
          DEFAULT: '#27272a',
          active: '#3f3f46'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'border-flow': 'borderFlow 3s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        borderFlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    }
  },
  plugins: []
};
