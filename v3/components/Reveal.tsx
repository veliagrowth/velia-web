'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Revelado al entrar en viewport.
 *
 * Regla que no se rompe: **el contenido nunca depende de esto para existir**.
 * La clase `.reveal` solo tiene opacidad 0 dentro de
 * `prefers-reduced-motion: no-preference`; si no hay JS, si el observer no
 * existe o si el usuario pidió menos movimiento, el bloque se ve igual. Una
 * animación de entrada que puede dejar media página invisible no es una
 * animación, es un fallo silencioso esperando su turno.
 *
 * Se desconecta al primer disparo: esto no es un efecto de scroll, es una
 * entrada. Reanimar al volver a subir marea y cuesta trabajo al hilo principal.
 */
export default function Reveal({
  children,
  className = '',
  /** Retardo en ms. Úsese con cuentagotas: escalonar más de 3 elementos se nota. */
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      entradas => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            setVisible(true)
            obs.disconnect()
          }
        }
      },
      // Se dispara con el bloque aún un poco por debajo del pliegue: al llegar
      // ya está entrando, no empieza a moverse cuando lo estás mirando.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      data-visible={visible ? 'true' : undefined}
      style={delay && visible ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
