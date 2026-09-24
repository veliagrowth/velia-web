'use client'

import { useEffect, useRef } from 'react'
import PersonajePixel, { REJILLA_ALTO, REJILLA_ANCHO } from '@/components/os/PersonajePixel'

/** Alto del personaje en pantalla. El ancho sale de la proporcion de la rejilla. */
const ALTO = 52
const ANCHO = Math.round((ALTO * REJILLA_ANCHO) / REJILLA_ALTO)
/** Altura del salto entre peldanos. Mas de 30 px y deja de parecer un paso. */
const SALTO = 26

/**
 * El personaje sube la escalera de estratos segun se lee la seccion.
 *
 * ── LA MECANICA (§24) ─────────────────────────────────────────────────────
 * La posicion NO es una animacion con su propio reloj: la manda el scroll. Se
 * mide cuanto se ha recorrido la lista de escalones y ese numero, de 0 a 1, se
 * multiplica por 3 —los tres saltos que hay entre cuatro peldanos—.
 *
 *     0,00 – 0,33  →  del 01 al 02
 *     0,33 – 0,66  →  del 02 al 03
 *     0,66 – 1,00  →  del 03 al 04
 *
 * La parte entera dice en que tramo va y la decimal dónde dentro del tramo. Con
 * la decimal se interpola la posicion entre los dos peldanos y se le suma un
 * ARCO —`sin(pi·f)`, cero en los extremos y maximo en medio—, que es lo que
 * convierte un deslizamiento en un salto: despega, sube, cae y aterriza justo
 * encima del siguiente. En vuelo se estira un poco y se estrecha, que es como
 * se ha dibujado siempre un salto.
 *
 * Subir la pagina lo hace bajar, y es correcto: la posicion es una FUNCION del
 * scroll, no una secuencia que se dispara. Una animacion que ignora la posicion
 * —lo que el §24 prohibe— se quedaria descolgada en cuanto alguien vuelve atras.
 *
 * ── DE DONDE SALEN LAS COORDENADAS ────────────────────────────────────────
 * Se MIDEN del DOM, no se calculan con los 56 px de alto y los 8 px de hueco
 * que hoy tienen los estratos. Si manana cambia el alto de una barra, el
 * personaje sigue pisando encima; con numeros a mano, flotaria y nadie lo
 * notaria hasta verlo. Se remide al cambiar el tamano de la ventana.
 *
 * ── CUANDO NO HACE NADA ───────────────────────────────────────────────────
 * · `prefers-reduced-motion`: se queda QUIETO en el primer peldano. No se
 *   oculta —§26: la informacion sigue entera— pero no persigue al scroll.
 * · Por debajo de `lg` su columna es `display:none` y no se puede medir. En vez
 *   de pintar algo en el sitio equivocado, no se coloca: la comprobacion es
 *   `offsetWidth === 0`, que es justo lo que devuelve un ancestro oculto.
 *
 * ── ACCESIBILIDAD Y RENDIMIENTO ───────────────────────────────────────────
 * Cuelga de un contenedor que ya es `aria-hidden`: es decoracion, y los cuatro
 * escalones estan escritos al lado con todas sus palabras. Un lector de
 * pantalla no se entera de que esto existe, que es lo correcto.
 *
 * Un solo `scroll` pasivo que no calcula nada: apunta y pide fotograma. Todo el
 * movimiento es `transform`, asi que no provoca layout ni puede desplazar la
 * pagina. Se desengancha entero al desmontar.
 */
export default function EscaleraPixel() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined' || !window.matchMedia) return

    const columna = el.parentElement
    const entorno = el.closest('.entorno')
    const lista = entorno?.querySelector('ul')
    if (!columna || !lista) return

    const quietud = window.matchMedia('(prefers-reduced-motion: reduce)')
    let puestos: { x: number; y: number }[] = []
    let pedido = 0

    /** Donde se pisa cada peldano, medido. Vacio si la columna esta oculta. */
    const medir = () => {
      if (!columna.offsetWidth) {
        puestos = []
        return
      }
      puestos = [1, 2, 3, 4].map(n => {
        const barra = columna.querySelector<HTMLElement>(`.estrato-${n}`)
        if (!barra) return { x: 0, y: 0 }
        return {
          // Junto al canto derecho —es ese canto el que dibuja los escalones—
          // pero 16 px hacia dentro: al ras del borde el cuerpo vuela sobre el
          // vacio durante todo el salto y deja de parecer que pisa.
          x: barra.offsetLeft + barra.offsetWidth - ANCHO - 16,
          // `+2` para que las botas se hundan un pelo en la barra. Apoyado
          // exacto parece pegado; con dos pixeles parece que pisa.
          y: barra.offsetTop - ALTO + 2,
        }
      })
    }

    const colocar = () => {
      pedido = 0
      if (!puestos.length) return

      let s = 0
      if (!quietud.matches) {
        const r = lista.getBoundingClientRect()
        // El ancla es la mitad de la ventana: el personaje va por el escalon
        // que se está leyendo, no por el que asoma por abajo.
        const p = (window.innerHeight * 0.5 - r.top) / (r.height || 1)
        s = Math.min(1, Math.max(0, p)) * (puestos.length - 1)
      }

      const i = Math.min(Math.floor(s), puestos.length - 2)
      const f = puestos.length > 1 ? s - i : 0
      const desde = puestos[i]
      const hasta = puestos[i + 1] ?? desde

      const arco = Math.sin(Math.PI * f)
      const x = desde.x + (hasta.x - desde.x) * f
      const y = desde.y + (hasta.y - desde.y) * f - SALTO * arco

      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(
        1 - 0.06 * arco
      ).toFixed(3)}, ${(1 + 0.06 * arco).toFixed(3)})`
    }

    const pedir = () => {
      if (!pedido) pedido = window.requestAnimationFrame(colocar)
    }

    const remedir = () => {
      medir()
      pedir()
    }

    medir()
    colocar()
    el.style.opacity = '1'

    window.addEventListener('resize', remedir, { passive: true })
    if (!quietud.matches) window.addEventListener('scroll', pedir, { passive: true })

    return () => {
      window.removeEventListener('resize', remedir)
      window.removeEventListener('scroll', pedir)
      if (pedido) window.cancelAnimationFrame(pedido)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="escalera-pixel pointer-events-none absolute left-0 top-0"
      style={{ width: ANCHO, height: ALTO, opacity: 0 }}
    >
      <PersonajePixel className="h-full w-full" />
    </div>
  )
}
