'use client'

import { useEffect, useRef } from 'react'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

/**
 * Dispara un evento de analítica UNA vez cuando el elemento devuelto entra
 * en viewport (umbral 40% visible). Usar en secciones que el brief pide
 * medir como "view" (Cerebro, Pricing, Fundadores).
 */
export function useSectionView<T extends HTMLElement>(event: AnalyticsEvent) {
  const ref = useRef<T>(null)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || fired.current) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && !fired.current) {
          fired.current = true
          trackEvent(event)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [event])

  return ref
}
