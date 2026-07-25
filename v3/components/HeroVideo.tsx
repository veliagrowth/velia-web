'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Vídeo del hero: SIEMPRE en bucle, sin interfaz de pausa/play (decisión
 * Joaquín). Clip ambiental y mudo.
 *
 * REPRODUCCIÓN EN iOS (bug recurrente "no se reproduce en el teléfono").
 * En iOS Safari el autoplay muted inline funciona SALVO en **Modo de bajo
 * consumo** (el SO lo bloquea) — ahí solo arranca con un gesto del usuario.
 * Claves para que NO vuelva a fallar:
 *  1. `muted` fijado por PROPIEDAD además del atributo (React puede no reflejar
 *     el atributo tras hidratar → iOS ve autoplay NO-muted y lo bloquea).
 *  2. `playsinline` + `webkit-playsinline` (iOS viejos) fijados por atributo.
 *  3. Reintento de `play()` en: montaje, `loadeddata`, `canplay`, al entrar el
 *     vídeo en viewport (IntersectionObserver) y al volver la pestaña a primer
 *     plano.
 *  4. Reintento en el PRIMER gesto válido para iOS: `touchend`, `pointerup`,
 *     `click`, `keydown`. OJO: iOS **NO** considera `scroll` un gesto de
 *     activación para media → escuchar scroll era inútil (era el fallo).
 *  5. Si aun así iOS lo bloquea (bajo consumo sin gesto), el **poster** queda
 *     visible: por eso el poster es un fotograma cuidado, nunca una pantalla en
 *     negro. Degradado digno, no roto.
 */
export default function HeroVideo({
  src,
  poster,
  ariaLabel,
}: {
  src: string
  poster: string
  ariaLabel: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playTracked = useRef(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    // iOS: la propiedad manda sobre el atributo; los atributos playsinline
    // garantizan reproducción embebida (no fullscreen forzado).
    v.muted = true
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')

    let done = false
    const tryPlay = () => {
      if (done) return
      v.muted = true
      const p = v.play()
      if (p && typeof p.then === 'function') {
        p.then(() => { done = true }).catch(() => { /* bloqueado: reintenta con gesto */ })
      }
    }

    tryPlay()
    v.addEventListener('loadeddata', tryPlay)
    v.addEventListener('canplay', tryPlay)

    // Al volver la app a primer plano (iOS congela la pestaña en segundo plano).
    const onVisible = () => { if (!document.hidden) tryPlay() }
    document.addEventListener('visibilitychange', onVisible)

    // Al entrar el vídeo en pantalla (en móvil está debajo del fold).
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) tryPlay()
      }, { threshold: 0.25 })
      io.observe(v)
    }

    // Primer gesto VÁLIDO para iOS (scroll NO cuenta). `touchstart` es el más
    // temprano; el resto cubren tap/click/teclado. Se escucha en window Y en
    // document (captura) por si el gesto ocurre sobre un overlay como el aviso
    // de cookies. Se autodestruyen al primer play OK.
    const gestureEvents = ['touchstart', 'touchend', 'pointerup', 'click', 'keydown'] as const
    const onGesture = () => {
      tryPlay()
      if (done) removeGestures()
    }
    const removeGestures = () => gestureEvents.forEach(ev => {
      window.removeEventListener(ev, onGesture)
      document.removeEventListener(ev, onGesture, true)
    })
    gestureEvents.forEach(ev => {
      window.addEventListener(ev, onGesture, { passive: true })
      document.addEventListener(ev, onGesture, { passive: true, capture: true })
    })

    return () => {
      v.removeEventListener('loadeddata', tryPlay)
      v.removeEventListener('canplay', tryPlay)
      document.removeEventListener('visibilitychange', onVisible)
      io?.disconnect()
      removeGestures()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="w-full rounded-2xl border border-void/10 object-cover aspect-[4/3] md:aspect-[5/4]"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      controls={false}
      preload="auto"
      aria-label={ariaLabel}
      onPlay={() => {
        if (!playTracked.current) {
          playTracked.current = true
          trackEvent('hero_product_video_play')
        }
      }}
    />
  )
}
