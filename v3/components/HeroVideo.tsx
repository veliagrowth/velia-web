'use client'

import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Vídeo de fondo del hero con control de pausa accesible (WCAG 2.2.2 —
 * cualquier contenido en movimiento autoplay de más de 5s necesita forma de
 * pararlo). Arranca pausado si el usuario prefiere movimiento reducido.
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
  const [playing, setPlaying] = useState(true)
  const playTracked = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced && videoRef.current) {
      videoRef.current.pause()
      setPlaying(false)
    }
  }, [])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full rounded-2xl border border-void/10 object-cover aspect-[4/3] md:aspect-[5/4]"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
        onPlay={() => {
          if (!playTracked.current) {
            playTracked.current = true
            trackEvent('hero_product_video_play')
          }
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pausar vídeo' : 'Reproducir vídeo'}
        className="btn absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-void/70 text-cream backdrop-blur-sm hover:bg-void/85 transition-colors"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <rect x="1" y="1" width="3.2" height="10" rx="0.6" />
            <rect x="7.2" y="1" width="3.2" height="10" rx="0.6" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M1.5 0.8 10.5 6 1.5 11.2Z" />
          </svg>
        )}
      </button>
    </div>
  )
}
