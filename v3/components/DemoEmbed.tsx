'use client'

import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Demo en vivo embebida — el despacho de demostración (solo lectura) dentro de
 * un marco de navegador. Se usa en la home (justo bajo el hero) y en /demo.
 *
 * Rendimiento (bug "la demo carga lenta", escritorio y móvil):
 *  1. Un POSTER (captura real del portal) se pinta AL INSTANTE → el usuario ve
 *     el producto de inmediato mientras el iframe pesado carga por detrás.
 *  2. El iframe se monta en cuanto el bloque se acerca al viewport
 *     (IntersectionObserver, rootMargin 600px) — carga ANTES de llegar, no al
 *     llegar. La conexión ya está caliente por el `preconnect` del layout.
 *  3. Al terminar de cargar (`onLoad`), el iframe aparece con un fundido sobre
 *     el poster. Si el navegador no soporta IO, se carga de inmediato.
 */
const DEMO_URL = 'https://demo.app.veliacorp.com/'
const POSTER = '/screenshots/expedientes.webp'

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

      {/* Escenario: poster instantáneo + iframe que aparece por encima al cargar */}
      <div className={`relative w-full ${heightClass} bg-void`}>
        <img
          src={POSTER}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
        />
        {!ready && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-6 pointer-events-none">
            <span className="inline-flex items-center gap-2 rounded-full bg-void/70 px-4 py-2 text-[12px] text-cream/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" aria-hidden />
              Cargando la demo en vivo…
            </span>
          </div>
        )}
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
