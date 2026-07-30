'use client'

import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import VeliaSplash from '@/components/VeliaSplash'

/**
 * Demo en vivo embebida — el despacho de demostración (solo lectura) dentro de
 * un marco de navegador. Se usa en la home (justo bajo el hero) y en /demo.
 *
 * Rendimiento (bug "la demo carga lenta", escritorio y móvil):
 *  1. El SPLASH de VELIA se pinta AL INSTANTE (cero bytes de red: SVG inline) →
 *     el marco nunca está vacío mientras el iframe pesado carga por detrás.
 *     Antes había aquí una captura del software; Joaquín la cambió por el splash
 *     el 25-jul: es lo que hace la app al arrancar, así que la web arranca igual.
 *  2. El iframe se monta en cuanto el bloque se acerca al viewport
 *     (IntersectionObserver, rootMargin 600px) — carga ANTES de llegar, no al
 *     llegar. La conexión ya está caliente por el `preconnect` del layout.
 *  3. Al terminar de cargar (`onLoad`), el iframe aparece con un fundido sobre
 *     el splash. Si el navegador no soporta IO, se carga de inmediato.
 */
const DEMO_URL = 'https://demo.app.veliacorp.com/'

export default function DemoEmbed({ heightClass = 'h-[70vh] min-h-[520px]' }: { heightClass?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (load) return
    if (!('IntersectionObserver' in window)) { setLoad(true); return }  // fallback
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { setLoad(true); io.disconnect() }
    }, { rootMargin: '600px' })
    io.observe(el)
    return () => io.disconnect()
  }, [load])

  return (
    <div ref={ref} className="rounded-2xl border border-void/15 bg-deep overflow-hidden shadow-[0_30px_80px_-40px_rgba(13,16,23,0.45)]">
      {/* Barra de navegador */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="ml-3 rounded-md bg-white/5 px-3 py-1 text-[10px] tracking-[0.06em] text-cream/60">
          demo.app.veliacorp.com · solo lectura
        </span>
      </div>

      {/* Escenario: splash instantáneo + iframe que aparece por encima al cargar */}
      <div className={`relative w-full ${heightClass} bg-void`}>
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
        >
          <VeliaSplash label="Cargando la demo en vivo…" />
        </div>
        {load && (
          <iframe
            src={DEMO_URL}
            title="Demo interactiva de VELIA — despacho de demostración en solo lectura"
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            allow="clipboard-write"
            onLoad={() => { setReady(true); trackEvent('demo_iframe_loaded') }}
          />
        )}
      </div>
    </div>
  )
}
