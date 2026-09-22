'use client'

import { useEffect, useRef } from 'react'

/**
 * La salida del hero — el hero no desaparece, se aparta.
 *
 * Escribe `--salida` (0 → 1) en su propio elemento según se recorre el primer
 * alto de pantalla. El CSS (`globals.css`, bloque 10) lo traduce en un
 * desplazamiento corto hacia arriba y algo menos de intensidad, de forma que el
 * hero cede el sitio mientras la primera sección —que se llena al pasar— lo
 * toma. Las dos cosas pasan en la misma franja de scroll: la transición se lee
 * como una composición y no como dos bloques independientes.
 *
 * ── POR QUÉ NO ES UN «PARALLAX» ───────────────────────────────────────────
 * El recorrido entero son 26 px y medio punto de opacidad, y termina antes de
 * que el hero salga de pantalla. No hay scroll secuestrado, ni elementos que se
 * adelanten al dedo, ni capas a distintas velocidades: eso se nota como un
 * truco. Aquí lo único que se percibe es que la página tiene profundidad.
 *
 * ── LO QUE NO PUEDE PASAR ─────────────────────────────────────────────────
 * · Sin JS o con `reduced-motion` no se monta nada y la variable no existe: el
 *   `var(--salida, 0)` del CSS cae a 0 y el hero se queda quieto y entero.
 * · `transform` y `opacity` NO mueven el layout, así que esto no puede
 *   introducir un desplazamiento (CLS). Es la razón de que sean esas dos y no
 *   `margin` o `top`.
 * · Un solo cálculo por fotograma, y sólo mientras el hero está en pantalla:
 *   pasado el primer alto, el oyente se retira.
 */
export default function HeroSalida({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let marco = 0
    let ultimo = -1

    const pintar = () => {
      marco = 0
      const alto = el.offsetHeight || window.innerHeight
      const p = Math.min(1, Math.max(0, window.scrollY / alto))
      // Dos decimales: por debajo de eso no se ve y son escrituras de más.
      const v = Math.round(p * 100) / 100
      if (v === ultimo) return
      ultimo = v
      el.style.setProperty('--salida', String(v))
    }
    const alMover = () => {
      if (!marco) marco = requestAnimationFrame(pintar)
    }

    window.addEventListener('scroll', alMover, { passive: true })
    window.addEventListener('resize', alMover)
    pintar()

    return () => {
      window.removeEventListener('scroll', alMover)
      window.removeEventListener('resize', alMover)
      if (marco) cancelAnimationFrame(marco)
    }
  }, [])

  return (
    <div ref={ref} className="hero-salida">
      {children}
    </div>
  )
}
