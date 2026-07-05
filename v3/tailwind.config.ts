import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0F',
        deep: '#1C1C28',
        gold: '#C9A96E',
        'gold-light': '#E8D5B0',
        'gold-dark': '#9A7840',
        cream: '#EDE9E1',
        signal: '#4ECDC4',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
