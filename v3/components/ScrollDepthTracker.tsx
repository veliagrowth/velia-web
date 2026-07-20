'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

/** Dispara scroll_50 / scroll_90 una vez por página al cruzar ese % de scroll. */
export default function ScrollDepthTracker() {
  useEffect(() => {
    let fired50 = false
    let fired90 = false

    const onScroll = () => {
      const doc = document.documentElement
      const scrolled = doc.scrollTop
      const max = doc.scrollHeight - doc.clientHeight
      if (max <= 0) return
      const pct = (scrolled / max) * 100

      if (!fired50 && pct >= 50) {
        fired50 = true
        trackEvent('scroll_50')
      }
      if (!fired90 && pct >= 90) {
        fired90 = true
        trackEvent('scroll_90')
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
