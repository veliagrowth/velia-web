'use client'

import { Fragment, useEffect, useRef } from 'react'

/**
 * Llenado de texto — las palabras pasan de tenues a plenas según el enunciado
 * sube por la pantalla, y cada una atraviesa un instante el Iris.
 *
 * Gesto estudiado en «Text Fill Animation» de ObsidianUI (MIT, ver
 * THIRD_PARTY_NOTICES.md) y REESCRITO, sin GSAP, ScrollTrigger ni SplitText:
 *
 *   · allí la sección se fija con `height: 250vh` y un visor `sticky`: dos
 *     pantallas y media de scroll para una sola oración. Aquí el enunciado se
 *     llena AL PASAR, en su sitio. No atrapa el scroll y no añade altura, que
 *     es lo contrario de lo que costó conseguir en la iteración anterior;
 *   · allí se parte en caracteres; aquí en palabras. Treinta nodos y no
 *     doscientos, y un lector de pantalla lee palabras enteras;
 *   · allí el tono tenue es un gris al 20 % —ilegible hasta que se llena—.
 *     Aquí el tenue es Slate (4,01:1 sobre Pearl Cloud) y el enunciado es texto
 *     grande: cumple AA en todos sus estados, también antes de llenarse.
 *
 * ── LO QUE HACE EL JAVASCRIPT, Y NADA MÁS ─────────────────────────────────
 * Calcula cuántas palabras tocan encendidas y pone o quita `data-on`. El color
 * y el paso por el Iris son CSS (`globals.css`, bloque 2). Tres cuidados:
 *   · sólo escucha el scroll mientras el enunciado está cerca de la pantalla
 *     (un IntersectionObserver lo enciende y lo apaga);
 *   · como mucho un cálculo por fotograma (`requestAnimationFrame`);
 *   · sólo escribe en el DOM cuando cambia el número de palabras encendidas,
 *     y sólo en las que cambian.
 *
 * ── LO QUE NO PUEDE PASAR ─────────────────────────────────────────────────
 * Sin JS, sin IntersectionObserver o con `reduced-motion`, el CSS deja todas
 * las palabras plenas: el efecto sólo QUITA intensidad cuando consta que va a
 * poder devolverla. Y el estado inicial es el del servidor —ningún atributo—,
 * así que no hay discrepancia de hidratación.
 */
export default function TextFill({
  texto,
  como: Etiqueta = 'p',
  oscuro = false,
  className = '',
  id,
}: {
  texto: string
  como?: 'p' | 'h2'
  oscuro?: boolean
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const palabras = texto.split(/\s+/).filter(Boolean)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nodos = Array.from(el.querySelectorAll<HTMLElement>('.tf-p'))
    const encenderTodas = () => nodos.forEach(n => n.setAttribute('data-on', ''))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') {
      encenderTodas()
      return
    }

    let encendidas = 0
    let marco = 0
    let escuchando = false

    const pintar = () => {
      marco = 0
      const alto = window.innerHeight
      // Empieza cuando la parte alta del enunciado asoma por el 90 % de la
      // pantalla y termina cuando llega al 42 %: lleno ANTES de la zona de
      // lectura, nunca a medias mientras se lee.
      const desde = alto * 0.9
      const hasta = alto * 0.42
      const top = el.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, (desde - top) / (desde - hasta)))
      const k = Math.round(p * nodos.length)
      if (k === encendidas) return
      const sube = k > encendidas
      const [a, b] = sube ? [encendidas, k] : [k, encendidas]
      for (let i = a; i < b; i++) nodos[i].toggleAttribute('data-on', sube)
      encendidas = k
    }
    const alMover = () => {
      if (!marco) marco = requestAnimationFrame(pintar)
    }
    const escuchar = (si: boolean) => {
      if (si === escuchando) return
      escuchando = si
      if (si) {
        window.addEventListener('scroll', alMover, { passive: true })
        window.addEventListener('resize', alMover)
      } else {
        window.removeEventListener('scroll', alMover)
        window.removeEventListener('resize', alMover)
      }
    }

    const io = new IntersectionObserver(
      ([e]) => {
        escuchar(e.isIntersecting)
        // También al SALIR: si se sale por arriba, se queda llena; si por
        // abajo, vacía. Un salto de ancla o la tecla Fin no dejan medias.
        pintar()
      },
      { rootMargin: '15% 0px 15% 0px' },
    )
    io.observe(el)
    pintar()

    return () => {
      io.disconnect()
      escuchar(false)
      if (marco) cancelAnimationFrame(marco)
    }
  }, [])

  return (
    <Etiqueta ref={ref as never} id={id} className={`tf ${oscuro ? 'tf--oscuro' : ''} ${className}`}>
      {palabras.map((p, i) => (
        <Fragment key={i}>
          <span className="tf-p">{p}</span>
          {i < palabras.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Etiqueta>
  )
}
