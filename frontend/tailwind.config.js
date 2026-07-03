/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-primary': {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
        'surface': {
          DEFAULT: '#0a0e1a',
          base: '#0f1629',
          elevated: '#141b2d',
          overlay: '#1a2236',
          muted: '#64748b',
        },
        'success': '#22c55e',
        'danger': '#ef4444',
        'warning': '#f59e0b',
      },
      animation: {
        'aurora-1':   'aurora-1 12s ease-in-out infinite',
        'aurora-2':   'aurora-2 16s ease-in-out infinite',
        'aurora-3':   'aurora-3 10s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'shimmer':    'shimmer 2s infinite linear',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      boxShadow: {
        'glass':       '0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.1)',
        'glass-lg':    '0 20px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15)',
        'glow-blue':   '0 0 20px rgba(59,130,246,.4), 0 4px 12px rgba(0,0,0,.3)',
        'glow-blue-lg':'0 0 40px rgba(59,130,246,.3), 0 20px 60px rgba(0,0,0,.5)',
        'card-hover':  '0 20px 40px rgba(0,0,0,.4), 0 0 0 1px rgba(59,130,246,.1)',
      },
    },
  },
  plugins: [],
}
