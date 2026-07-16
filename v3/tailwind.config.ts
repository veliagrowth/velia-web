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
      /* Escala numérica de pesos (spec tipográfica VELIA: 300 body, 600 labels,
         700 H1/H2, 800 display). Sin esto, TODAS las clases font-NNN del markup
         eran clases muertas y la web entera renderizaba a 400 (bug cazado 2026-07-16). */
      fontWeight: {
        '300': '300',
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
        '800': '800',
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
