import type { Config } from 'tailwindcss'

export default {
  // `lib/` incluido: los estilos de las etiquetas del tablón de novedades viven en
  // lib/updates.ts y, al no escanearse, Tailwind no generaba sus clases → badges sin
  // fondo (texto crema sobre tarjeta blanca, ilegible). Cualquier clase escrita fuera
  // de app/ o components/ desaparece en silencio si su carpeta no está aquí.
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /* ── VELIA Brand Identity System 2.0 · «Obsidian Iris Soft» (30-jul) ────
         Los NOMBRES se conservan porque están en ~350 sitios de la web y
         renombrarlos no aporta nada; cambian los VALORES. Igual que en el
         portal, nunca fueron nombres de color: `cream` es «el fondo claro» y
         `void` es «el texto y las secciones oscuras».
         Manual: velia-core/brand/velia-brand-identity-system-2.html            */
      colors: {
        void: '#0D1017',          // Night — texto y secciones oscuras
        deep: '#1B1F2A',          // Deep Graphite — superficie oscura
        gold: '#8D90FA',          // Iris 400 — acento SOBRE OSCURO (6,80:1 sobre Night)
        'gold-light': '#ACAEFF',  // Iris 300 — acento claro sobre oscuro (9,29:1)
        'gold-dark': '#6065DC',   // Iris 600 — relleno de acción
        /* Variante SOLO para texto sobre fondo claro. El dorado necesitaba un
           tono aparte porque gold-dark daba 3,38:1 sobre cream; con Iris el
           problema es el mismo (Iris 400 da 2,4:1 sobre Pearl Cloud), así que
           el rol se mantiene: Iris 700 da 6,16:1 sobre Pearl Cloud y 6,59:1
           sobre blanco. No tocar `gold`: es el acento sobre oscuro. */
        'gold-ink': '#4C51B9',    // Iris 700
        cream: '#F6F7FA',         // Pearl Cloud — fondo dominante
        signal: '#B5DFFF',        // Pale Ice — reservado a actividad de IA
        /* Piezas del sistema que el upgrade «Quiet Intelligence in Motion»
           necesita nombrar y antes se escribían a mano en cada sitio. */
        mist: '#E6EAF1',          // Soft Mist — separadores sobre claro
        slate: '#707A92',         // Blue Slate — texto terciario sobre claro
        'iris-mid': '#949AF8',    // Iris 500 — punto medio del gradiente
        'iris-focus': '#7479F2',  // Soft Iris — anillo de foco SÓLIDO (nunca halo)
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        /* Editorial. Uso muy limitado y explícito: frases de marca, manifiestos,
           una palabra estratégica, citas. NUNCA en botones, formularios,
           navegación, tablas, pricing ni información técnica (§4 del encargo). */
        serif: ['Instrument Serif', 'Georgia', 'serif'],
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
        /* Curva única del upgrade. Convive con `out` (la anterior) porque
           cambiarla en las ~40 transiciones existentes no aporta nada: son
           casi idénticas y el riesgo de tocarlas supera la ganancia. */
        velia: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '160ms',      // presión de un control
        control: '220ms',   // cambio de estado de un control
        panel: '320ms',     // panel, dropdown, tab
        section: '520ms',   // entrada de una sección
      },
      backgroundImage: {
        /* Gradiente de inteligencia. Solo en superficies que representan a
           VELIA pensando — nunca como decoración de fondo ni en texto. */
        intelligence: 'linear-gradient(135deg, #7479F2 0%, #949AF8 48%, #B5DFFF 100%)',
        /* Halo ambiental del hero. Contenido a propósito: se apaga al 72 %. */
        'intelligence-glow':
          'radial-gradient(circle, rgba(116,121,242,0.22) 0%, rgba(181,223,255,0.10) 45%, rgba(181,223,255,0) 72%)',
      },
    },
  },
  plugins: [],
} satisfies Config
