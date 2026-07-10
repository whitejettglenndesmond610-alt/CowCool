import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#06080d',
          secondary: '#0c0e14',
          card: 'rgba(255, 255, 255, 0.025)',
        },
        accent: {
          cyan: '#00c8e8',
          purple: '#7c3aed',
          rose: '#f472b6',
        },
      },
      fontFamily: {
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        shimmer: 'shimmer 4s ease infinite',
        'float-card': 'floatCard 5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        floatCard: {
          '0%, 100%': { transform: 'translateY(0) rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'translateY(-8px) rotateX(2deg) rotateY(-3deg)' },
          '50%': { transform: 'translateY(-2px) rotateX(-1deg) rotateY(2deg)' },
          '75%': { transform: 'translateY(-10px) rotateX(1deg) rotateY(-1deg)' },
        },
      },
    },
  },
  plugins: [animate],
}
