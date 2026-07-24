'use client'

import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Demo en vivo embebida — el despacho de demostración (solo lectura) dentro de
 * un marco de navegador. Se usa en la home (justo bajo el hero) y en /demo.
 *
 * Rendimiento: el iframe NO se monta hasta que el bloque entra en viewport
 * (IntersectionObserver) — así el hero carga ligero y el portal (pesado) solo
 * se pide cuando el usuario llega. Antes de cargar se muestra un póster con el
 * botón "Cargar la demo", que también sirve de fallback si el iframe tarda.
 */
const DEMO_URL = 'https://demo.app.veliacorp.com/'

export default function DemoEmbed({ heightClass = 'h-[70vh] min-h-[520px]' }: { heightClass?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if (load || !ref.current || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { setLoad(true); io.disconnect() }
    }, { rootMargin: '400px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [load])

  return (
    <div ref={ref} className="rounded-2xl border border-void/15 bg-deep overflow-hidden shadow-[0_30px_80px_-40px_rgba(10,10,15,0.45)]">
      {/* Barra de navegador */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="ml-3 rounded-md bg-white/5 px-3 py-1 text-[10px] tracking-[0.06em] text-cream/60">
          demo.app.veliacorp.com · solo lectura
        </span>
      </div>
      {load ? (
        <iframe
          src={DEMO_URL}
          title="Demo interactiva de VELIA — despacho de demostración en solo lectura"
          className={`w-full ${heightClass} bg-void`}
          loading="lazy"
          allow="clipboard-write"
          onLoad={() => trackEvent('demo_iframe_loaded')}
        />
      ) : (
        <button
          type="button"
          onClick={() => { setLoad(true); trackEvent('demo_iframe_manual_load') }}
          className={`btn w-full ${heightClass} bg-void flex flex-col items-center justify-center gap-3 text-cream/70 hover:text-cream transition-colors`}
          aria-label="Cargar la demo interactiva de VELIA"
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" className="text-gold/70" aria-hidden="true">
            <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 8.2 16 12l-6 3.8Z" fill="currentColor" />
          </svg>
          <span className="text-sm font-600">Cargar la demo en vivo</span>
          <span className="text-[12px] text-cream/40">El despacho de demostración, aquí mismo</span>
        </button>
      )}
    </div>
  )
}
