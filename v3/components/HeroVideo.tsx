'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Vídeo de fondo del hero: SIEMPRE en bucle y sin ninguna interfaz de
 * pausa/reproducción (decisión Joaquín 2026-07-24 — el clip es ambiental).
 * Accesibilidad sin UI: si el usuario tiene `prefers-reduced-motion`
 * activado a nivel de sistema, el vídeo queda quieto en el poster
 * (WCAG 2.2.2 se respeta vía preferencia del SO, no con botones).
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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced && videoRef.current) {
      videoRef.current.pause()
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
      preload="metadata"
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
