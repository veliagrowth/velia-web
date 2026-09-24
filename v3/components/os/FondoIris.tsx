'use client'

import { useEffect, useRef } from 'react'

/**
 * El fondo Iris que respira detras del especimen de VELIA OS.
 *
 * ── LA REGLA QUE LO GOBIERNA (§19) ────────────────────────────────────────
 * «Sin parecer un wallpaper espectacular. El producto sigue siendo
 * protagonista.» Todo lo de aqui esta calibrado para eso: tres formas, muy
 * desenfocadas, con opacidades entre 0,10 y 0,18, y un recorrido maximo de 26
 * px. Si al mirar la pantalla te fijas primero en el fondo, esta mal.
 *
 * ── POR QUE NO HAY CANVAS NI WEBGL ────────────────────────────────────────
 * Son tres `div` con un gradiente radial y un `blur`. El encargo prohibe
 * expresamente WebGL pesado y el canvas gigante, y con razon: esto va DETRAS
 * del elemento mas importante de la web, en el primer pintado, y compite por el
 * hilo principal con el resto del hero. Tres capas compuestas por la GPU no
 * cuestan nada; un canvas que repinta a 60 Hz, si.
 *
 * ── COMO SIGUE AL CURSOR SIN MATAR EL HILO PRINCIPAL (§66) ────────────────
 * Un solo `pointermove` en `window`, y NO hace trabajo: apunta la posicion en
 * una `ref` y pide un `requestAnimationFrame` si no hay uno pidiendo ya. El
 * navegador puede disparar `pointermove` cientos de veces por segundo; asi se
 * escribe como mucho una vez por fotograma.
 *
 * Lo que se escribe son dos variables CSS en el contenedor —`--mx` y `--my`,
 * normalizadas a -1..1—, y cada capa las multiplica por su propio factor. Es
 * una sola escritura para las tres capas, y el movimiento es `transform`
 * puro: no toca `width`, `height`, `top` ni `left`, asi que no dispara layout.
 *
 * Y se desengancha: el `return` del efecto quita el listener y cancela el
 * fotograma pendiente. Un listener global que sobrevive al desmontaje es una
 * fuga, y en una SPA se acumulan.
 *
 * ── CUANDO NO SE MONTA NADA ───────────────────────────────────────────────
 * · `prefers-reduced-motion`: las formas se quedan quietas. No desaparecen
 *   —el fondo sigue siendo el fondo—, simplemente no persiguen nada.
 * · Puntero grueso (dedo): en tactil no hay cursor al que seguir, y un
 *   `pointermove` en un movil solo se dispara mientras se arrastra el dedo,
 *   que es justo cuando el hilo principal esta ocupado desplazando la pagina.
 *
 * En los dos casos no se registra el listener siquiera. No es que el efecto no
 * se vea: es que no se ejecuta.
 */
export default function FondoIris() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined' || !window.matchMedia) return

    const quietud = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dedo = window.matchMedia('(pointer: coarse)')
    if (quietud.matches || dedo.matches) return

    let pedido = 0
    let x = 0
    let y = 0

    const pintar = () => {
      pedido = 0
      el.style.setProperty('--mx', x.toFixed(3))
      el.style.setProperty('--my', y.toFixed(3))
    }

    const mover = (e: PointerEvent) => {
      /* Normalizado contra la VENTANA y no contra el elemento: el fondo
         acompaña al cursor esté donde esté, y así no hace falta medir la caja
         en cada movimiento —que es lo que fuerza un reflow—. */
      x = (e.clientX / window.innerWidth) * 2 - 1
      y = (e.clientY / window.innerHeight) * 2 - 1
      if (!pedido) pedido = window.requestAnimationFrame(pintar)
    }

    window.addEventListener('pointermove', mover, { passive: true })
    return () => {
      window.removeEventListener('pointermove', mover)
      if (pedido) window.cancelAnimationFrame(pedido)
    }
  }, [])

  return (
    <div ref={ref} className="fondo-iris" aria-hidden="true">
      <span className="fondo-iris__forma fondo-iris__forma--1" />
      <span className="fondo-iris__forma fondo-iris__forma--2" />
      <span className="fondo-iris__forma fondo-iris__forma--3" />
    </div>
  )
}
