import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Demo interactiva — VELIA',
  description:
    'Recorre VELIA por dentro sin registrarte: un despacho de demostración real con expedientes, plazos, agenda y facturación. Escaparate de solo lectura.',
  alternates: { canonical: 'https://veliacorp.com/demo' },
}

/**
 * Demo interactiva pública — embebe el despacho de demostración (solo lectura).
 *
 * demo.app.veliacorp.com auto-entra en modo demo vía /api/demo/enter (cookies
 * SameSite=None para iframe cross-site; middleware del portal permite
 * frame-ancestors desde veliacorp.com y *.vercel.app, y bloquea toda mutación).
 * Datos 100% ficticios (Bufete Nelson & Murdock) — nada que resetear.
 */
const DEMO_URL = 'https://demo.app.veliacorp.com/'

export default function DemoPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-20 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-4">
              Demo interactiva
            </p>
            <h1 className="text-3xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[20ch]">
              VELIA, de primera mano.
            </h1>
            <p className="mt-4 text-lg text-void/60 leading-relaxed max-w-prose">
              Esto no es un vídeo ni son capturas: es la última versión de VELIA con un
              despacho de demostración dentro. Haz clic donde quieras — expedientes,
              plazos, agenda, facturación.{' '}
              <span className="inline-block">Es un escaparate de solo lectura:</span>{' '}
              <span className="inline-block">puedes verlo todo, no puedes romper nada.</span>
            </p>
          </div>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors whitespace-nowrap"
          >
            Abrir a pantalla completa →
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        {/* Marco navegador — el mismo lenguaje visual que las capturas del producto */}
        <div className="rounded-2xl border border-void/15 bg-deep overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
            <span className="ml-3 rounded-md bg-white/5 px-3 py-1 text-[10px] tracking-[0.06em] text-cream/60">
              demo.app.veliacorp.com · solo lectura
            </span>
          </div>
          {/* El fondo oscuro hace de "cargando" hasta que el portal pinta */}
          <iframe
            src={DEMO_URL}
            title="Demo interactiva de VELIA — despacho de demostración en solo lectura"
            className="w-full h-[75vh] min-h-[560px] bg-void"
            allow="clipboard-write"
          />
        </div>
        <p className="mt-3 text-[12px] text-void/60 leading-relaxed">
          Despacho ficticio de demostración. Los datos son inventados y el modo es de solo
          lectura —{' '}
          <span className="inline-block">para trabajar con tus propios asuntos, empieza tu
          prueba gratuita.</span>
        </p>
      </section>

      {/* CTA — de mirar a probar */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-void/10 bg-white px-8 py-12 md:py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.02em]">
            ¿Te encaja? Pruébalo con tus casos.
          </h2>
          <p className="mt-3 text-sm text-void/60 max-w-[46ch] mx-auto leading-relaxed">
            15 días gratis con tus propios tipos de asuntos, sin tarjeta.{' '}
            <span className="inline-block">Montamos tu VELIA con el contexto de tu
            despacho en 2 minutos.</span>
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={`${APP_URL}/prueba-velia`}
              className="btn bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
            >
              Prueba gratis — 15 días
            </a>
            <Link
              href="/contacto"
              className="btn border border-void/20 text-void text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:border-void/50 transition-colors"
            >
              Otras formas de empezar
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
