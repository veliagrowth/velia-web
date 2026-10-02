'use client'

import { useEffect, useRef } from 'react'

/**
 * La anomalía del cierre. Capa decorativa del bloque de preguntas.
 *
 * ── QUÉ ES, Y QUÉ NO ──────────────────────────────────────────────────────
 * No es un gradiente de fondo ni una «aurora». Lo que hay debajo es una MALLA
 * de líneas de un píxel —la misma estructura que la web usa para hablar de
 * infraestructura— y lo único que se mueve es la LUZ sobre ella: una lente
 * blanda que sigue al puntero con retardo y revela la malla donde pasa.
 *
 * Esa es la diferencia con el efecto genérico: aquí el movimiento no inventa
 * una forma, ILUMINA una que ya estaba. Y la malla no se dibuja encima del
 * texto: vive en el fondo del bloque, con la máscara apagándola hacia los
 * bordes para que nunca compita con una línea de prosa.
 *
 * Sin púrpura. Un solo color de marca, Iris 400 (`#8D90FA`), y a una opacidad
 * que no llega al 10 %. Sobre Night queda como una veladura, no como un foco.
 *
 * ── POR QUÉ CSS Y NO CANVAS ───────────────────────────────────────────────
 * Un `<canvas>` obliga a repintar cada fotograma en el hilo principal. Aquí
 * sólo se escriben dos variables CSS y el compositor hace el resto: lo único
 * que cambia es `transform` y una `--mask-position`, las dos en GPU. El coste
 * en reposo es cero, porque sin puntero no hay listener.
 *
 * ── EL RETARDO ES EL DETALLE ──────────────────────────────────────────────
 * La lente no va pegada al cursor: interpola hacia él (`lerp` 0,085) en un
 * `requestAnimationFrame`. Seguir el puntero exacto se lee como un cursor
 * personalizado; llegar un poco después se lee como materia. Y el bucle se
 * detiene cuando ya ha llegado, así que no hay rAF girando en vacío.
 *
 * ── LO QUE NO HACE ────────────────────────────────────────────────────────
 * No se monta con `prefers-reduced-motion: reduce` —queda la malla quieta, que
 * es la mitad que informa— ni en punteros gruesos (`pointer: coarse`), donde
 * no hay cursor que seguir y el listener sólo gastaría batería.
 */
export default function FaqAtmosfera() {
  const caja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = caja.current
    if (!el) return

    // Dos puertas, y las dos son de respeto al visitante, no de rendimiento.
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dedo = window.matchMedia('(pointer: coarse)')
    if (quieto.matches || dedo.matches) return

    // Punto de partida: el centro. Si alguien entra y no mueve el ratón, la
    // lente está donde la composición la quiere, no en la esquina 0,0.
    let x = 50
    let y = 50
    let destinoX = 50
    let destinoY = 50
    let rafId = 0
    let vivo = true

    const paso = () => {
      const dx = destinoX - x
      const dy = destinoY - y
      // Se para sola. Por debajo de 0,05 % el ojo no distingue el avance, y
      // seguir pidiendo fotogramas para eso es tener una animación infinita
      // disfrazada de interacción.
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        rafId = 0
        return
      }
      x += dx * 0.085
      y += dy * 0.085
      el.style.setProperty('--fx', x.toFixed(2) + '%')
      el.style.setProperty('--fy', y.toFixed(2) + '%')
      rafId = requestAnimationFrame(paso)
    }

    const mover = (e: PointerEvent) => {
      if (!vivo) return
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      destinoX = ((e.clientX - r.left) / r.width) * 100
      destinoY = ((e.clientY - r.top) / r.height) * 100
      if (!rafId) rafId = requestAnimationFrame(paso)
    }

    // Al salir del bloque la lente vuelve al centro en vez de quedarse
    // clavada en el borde por donde se fue.
    const salir = () => {
      destinoX = 50
      destinoY = 50
      if (!rafId) rafId = requestAnimationFrame(paso)
    }

    el.dataset.vivo = 'true'
    el.addEventListener('pointermove', mover, { passive: true })
    el.addEventListener('pointerleave', salir, { passive: true })

    return () => {
      vivo = false
      if (rafId) cancelAnimationFrame(rafId)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerleave', salir)
      delete el.dataset.vivo
    }
  }, [])

  /* `aria-hidden` y sin texto: es atmósfera. Un lector de pantalla no tiene
     nada que anunciar aquí, y el bloque de preguntas ya tiene su encabezado. */
  return <div ref={caja} className="faq-atmosfera" aria-hidden="true" />
}
