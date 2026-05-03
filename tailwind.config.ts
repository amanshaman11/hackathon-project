import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'hero-rise': 'hero-rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'gradient-flow': 'gradient-flow 12s ease-in-out infinite',
        'blob-drift-a': 'blob-drift-a 28s ease-in-out infinite alternate',
        'blob-drift-b': 'blob-drift-b 32s ease-in-out infinite alternate',
        'step-in': 'step-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        'hero-rise': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'blob-drift-a': {
          from: { transform: 'translate(0, 0) scale(1)' },
          to: { transform: 'translate(4%, -3%) scale(1.05)' },
        },
        'blob-drift-b': {
          from: { transform: 'translate(0, 0)' },
          to: { transform: 'translate(-6%, 4%)' },
        },
        'step-in': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
