'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Vídeo del hero: SIEMPRE en bucle, sin ninguna interfaz de pausa/play
 * (decisión Joaquín 2026-07-24). El clip es ambiental y mudo.
 *
 * Robustez iOS (bug 24-jul: "no se reproduce en móvil"):
 *  - `muted` se fija además por PROPIEDAD antes de `play()`: iOS Safari a veces
 *    ignora el atributo y bloquea el autoplay si no ve la propiedad puesta.
 *  - `play()` IMPERATIVO en el mount (el atributo `autoplay` solo no basta en
 *    iOS cuando el vídeo entra en el DOM vía hidratación de React).
 *  - Reintento al volver la pestaña a primer plano y al primer gesto del
 *    usuario (Bajo Consumo / Ahorro de datos bloquean el autoplay hasta que
 *    hay interacción). El listener se autodestruye tras el primer intento OK.
 *  - NO se pausa por `prefers-reduced-motion`: al no haber botón de play,
 *    pausar dejaba el vídeo congelado para siempre sin forma de arrancarlo
 *    (era la causa del "no se reproduce" en móviles con Reducir Movimiento).
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

    const tryPlay = () => {
      // iOS: la propiedad manda sobre el atributo para permitir autoplay.
      v.muted = true
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => { /* reintentos abajo */ })
    }

    tryPlay()

    const onVisible = () => { if (!document.hidden && v.paused) tryPlay() }
    const onGesture = () => {
      if (v.paused) tryPlay()
      window.removeEventListener('touchstart', onGesture)
      window.removeEventListener('click', onGesture)
      window.removeEventListener('scroll', onGesture)
    }

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('touchstart', onGesture, { passive: true, once: false })
    window.addEventListener('click', onGesture)
    window.addEventListener('scroll', onGesture, { passive: true })

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('touchstart', onGesture)
      window.removeEventListener('click', onGesture)
      window.removeEventListener('scroll', onGesture)
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
      // `auto` (no `metadata`): en iOS con `metadata` el primer play puede
      // quedarse esperando datos y el autoplay se descarta silenciosamente.
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
