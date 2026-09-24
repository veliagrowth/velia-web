'use client'

import { useEffect, useRef } from 'react'

/**
 * Las anomalias Iris del hero — un relieve de marcas sobre el blanco.
 *
 * ── QUE ES, Y POR QUE NO ES UNA MANCHA ────────────────────────────────────
 * Sustituye a `FondoIris`, que eran tres circulos desenfocados siguiendo al
 * cursor. Aquello era exactamente lo que el encargo prohibe: un halo, un blob,
 * un degradado generico. Se veia «suave» porque no se veia.
 *
 * Esto es otra cosa: un campo de GUIONES horizontales cortos, en una rejilla
 * gruesa, cuya longitud y presencia las decide un ruido determinista. Donde el
 * ruido sube, las marcas se alargan y se juntan; donde baja, desaparecen. El
 * resultado son regiones irregulares con cantos escalonados —una anomalia de
 * superficie— y no una nube. La diferencia se nota: una mancha difumina, un
 * relieve tiene borde.
 *
 * Referencia de LENGUAJE, no de codigo: la home de Twenty usa marcas discretas
 * en vez de degradados. Ni una linea suya, ni un asset, ni su paleta: aqui son
 * tonos Iris del manual y un ruido propio.
 *
 * ── POR QUE CANVAS, HABIENDO UNA PREFERENCIA POR CSS ──────────────────────
 * El orden del encargo es CSS, SVG, canvas ligero, JS minimo. Los dos primeros
 * no llegan: el campo son ~1.500 marcas que reaccionan CADA UNA a la distancia
 * al cursor. En CSS no hay forma de expresarlo, y en SVG serian 1.500 nodos del
 * DOM recalculando estilo en cada fotograma — que es justo lo que hace que una
 * pagina se sienta pesada.
 *
 * Un canvas 2D las pinta en un solo paso, sin tocar el DOM, y se le puede parar
 * el reloj. Es «canvas ligero» en el sentido que pide el encargo: 2D, sin
 * libreria, sin WebGL, y sin bucle cuando no pasa nada.
 *
 * ── EL RELOJ SE PARA, Y ESO ES LA MITAD DEL TRABAJO ───────────────────────
 * Una animacion permanente de fondo se lleva bateria y hilo principal para
 * siempre. Aqui el bucle solo corre mientras hay energia que gastar: el cursor
 * la inyecta y cada fotograma la consume. Cuando la energia baja del umbral, se
 * pinta el reposo una ultima vez y el bucle SE DETIENE. En una pagina quieta,
 * esto no cuesta nada.
 *
 * ── DONDE NO SE MONTA ─────────────────────────────────────────────────────
 * · `prefers-reduced-motion`: se pinta el campo en reposo, una vez, y ya. No se
 *   oculta —el fondo sigue siendo el fondo—, simplemente no persigue nada.
 * · Puntero grueso: en tactil no hay cursor al que reaccionar, y `pointermove`
 *   solo se dispara arrastrando el dedo, que es cuando el hilo principal esta
 *   ocupado desplazando la pagina. Campo estatico y ni un oyente registrado.
 *
 * Es decorativo: `aria-hidden`, y no lleva informacion que no este en el texto.
 */

/** Separacion de la rejilla, en px de CSS. */
const PASO_X = 15
const PASO_Y = 11
/** Longitud de una marca, de minima a maxima. */
const LARGO_MIN = 3
const LARGO_MAX = 13
const GRUESO = 2.5
/** Radio de influencia del cursor. */
const RADIO = 190
/** Cuanta energia mete un movimiento y cuanta se pierde por fotograma. */
const IMPULSO = 1
const AMORTIGUA = 0.055

/* Ruido de valor determinista: mismo dibujo en cada carga y en cada recarga, sin
   `Math.random()`. Un fondo que cambia en cada visita no es una identidad. */
function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}
function suave(t: number) {
  return t * t * (3 - 2 * t)
}
function ruido(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = suave(x - xi)
  const yf = suave(y - yi)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
}

export default function AnomaliasIris() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const lienzo = ref.current
    if (!lienzo || typeof window === 'undefined' || !window.matchMedia) return
    const ctx = lienzo.getContext('2d')
    if (!ctx) return

    const quietud = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dedo = window.matchMedia('(pointer: coarse)')
    const vivo = !quietud.matches && !dedo.matches

    let ancho = 0
    let alto = 0
    let px = -9999
    let py = -9999
    let energia = 0
    let marco = 0

    const medir = () => {
      const r = lienzo.getBoundingClientRect()
      if (!r.width || !r.height) return false
      /* Se dibuja a la resolucion real de la pantalla y se escala el contexto:
         a 1 dispositivo-pixel por pixel CSS, un guion de 2,5 px sale borroso en
         una pantalla de densidad 2. El tope de 2 es deliberado — a 3 se pintan
         nueve veces los pixeles para una diferencia que nadie ve. */
      const d = Math.min(window.devicePixelRatio || 1, 2)
      ancho = r.width
      alto = r.height
      lienzo.width = Math.round(ancho * d)
      lienzo.height = Math.round(alto * d)
      ctx.setTransform(d, 0, 0, d, 0, 0)
      return true
    }

    const pintar = () => {
      ctx.clearRect(0, 0, ancho, alto)
      /* Iris 600 del manual. Un solo color para todo el campo: la intensidad la
         da la OPACIDAD de cada marca, no un degradado de tono. Dos tonos
         mezclados sobre Pearl Cloud se leen como suciedad. */
      ctx.fillStyle = '#6065DC'

      for (let y = PASO_Y; y < alto; y += PASO_Y) {
        for (let x = 0; x < ancho; x += PASO_X) {
          /* Dos octavas: la primera decide las regiones grandes, la segunda les
             rompe el borde. Con una sola, los cantos salen demasiado limpios y
             parece una degradacion, no una anomalia. */
          /* CAÍDA HACIA EL CENTRO, y no es decoración: el enunciado y las dos
             acciones viven en la columna central, y unas marcas detrás de un
             texto le bajan el contraste. En vez de confiar en que el ruido deje
             hueco —que es confiar en la suerte—, el centro se vacía por
             construcción. Las anomalías quedan donde hay sitio: los flancos. */
          const lateral = Math.min(Math.abs(x - ancho / 2) / (ancho * 0.42), 1) ** 1.7

          const n = (ruido(x / 170, y / 120) * 0.72 + ruido(x / 55, y / 42) * 0.28) * lateral
          if (n < 0.3) continue

          /* Normalizado sobre el umbral: en el borde de la region las marcas
             nacen cortas y tenues, y crecen hacia dentro. Ese degradado de
             LONGITUD —no de desenfoque— es lo que da el relieve. */
          const fuerza = Math.min((n - 0.3) / 0.34, 1)
          let largo = LARGO_MIN + (LARGO_MAX - LARGO_MIN) * fuerza
          let alfa = 0.16 + 0.54 * fuerza
          let dx = 0

          if (energia > 0.01) {
            const ex = x - px
            const ey = y - py
            const dist = Math.sqrt(ex * ex + ey * ey)
            if (dist < RADIO) {
              /* Cerca del cursor la marca se ESTIRA y se aparta un poco en
                 horizontal. Estirar y no iluminar es lo que mantiene la lectura
                 de «relieve»: el material cede, no se enciende. */
              const cerca = (1 - dist / RADIO) ** 2 * energia
              largo += 26 * cerca
              alfa += 0.4 * cerca
              dx = (ex / (dist || 1)) * 11 * cerca
            }
          }

          ctx.globalAlpha = Math.min(alfa, 0.82)
          ctx.fillRect(x + dx, y, largo, GRUESO)
        }
      }
      ctx.globalAlpha = 1
    }

    const bucle = () => {
      marco = 0
      energia -= AMORTIGUA
      if (energia < 0) energia = 0
      pintar()
      /* El bucle se detiene solo. Mientras no haya energia que gastar, esta
         pagina no pide un fotograma mas. */
      if (energia > 0.01) marco = window.requestAnimationFrame(bucle)
    }

    const pedir = () => {
      if (!marco) marco = window.requestAnimationFrame(bucle)
    }

    const mover = (e: PointerEvent) => {
      const r = lienzo.getBoundingClientRect()
      px = e.clientX - r.left
      py = e.clientY - r.top
      energia = IMPULSO
      pedir()
    }

    const recolocar = () => {
      if (medir()) pintar()
    }

    if (!medir()) return
    pintar()

    window.addEventListener('resize', recolocar, { passive: true })
    if (vivo) window.addEventListener('pointermove', mover, { passive: true })

    return () => {
      window.removeEventListener('resize', recolocar)
      window.removeEventListener('pointermove', mover)
      if (marco) window.cancelAnimationFrame(marco)
    }
  }, [])

  return <canvas ref={ref} className="anomalias" aria-hidden="true" />
}
