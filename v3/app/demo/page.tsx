import type { Metadata } from 'next'
import DemoEmbed from '@/components/DemoEmbed'
import TrialButton from '@/components/TrialButton'
import TrackedLink from '@/components/TrackedLink'
import { CONTACT_EMAIL, SITE_URL } from '@/lib/constants'
import { DEMO_URL } from '@/lib/cta'
import { PRICING } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Demo interactiva — VELIA',
  description:
    'Recorre VELIA por dentro sin registrarte: un despacho de demostración con expedientes, plazos, agenda y facturación. Solo lectura, sin riesgo.',
  alternates: { canonical: `${SITE_URL}/demo` },
}

/**
 * Demo interactiva pública — embebe el despacho de demostración (solo lectura).
 *
 * demo.app.veliacorp.com auto-entra en modo demo vía /api/demo/enter (cookies
 * SameSite=None para iframe cross-site; middleware del portal permite
 * frame-ancestors desde veliacorp.com y *.vercel.app, y bloquea toda mutación).
 * Datos 100% ficticios (Bufete Nelson & Murdock) — nada que resetear.
 *
 * El bloque «Otras formas de empezar» se retiró el 29-jul: abría un segundo árbol
 * de decisiones justo donde el visitante ya había decidido mirar. Queda una única
 * acción, y el contacto como línea discreta.
 */
export default function DemoPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-20 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-4">
              Demo interactiva
            </p>
            <h1 className="text-3xl md:text-5xl font-600 leading-[1.08] tracking-[-0.03em] max-w-[20ch]">
              VELIA, de primera mano.
            </h1>
            <p className="mt-4 text-lg text-void/60 leading-relaxed max-w-prose">
              Explora la última versión con un despacho ficticio. Puedes recorrer el producto
              completo sin registrarte y sin modificar ningún dato.
            </p>
          </div>
          <TrackedLink
            href={DEMO_URL}
            event="demo_fullscreen_open"
            className="text-[12px] font-700 tracking-[0.04em] uppercase text-gold-ink hover:text-void transition-colors whitespace-nowrap"
          >
            Abrir demo interactiva →
          </TrackedLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        {/* Mismo componente que la home: marco de navegador + splash de VELIA
            mientras carga + carga anticipada del iframe. Esta página tenía su
            propio marco e iframe copiados, así que el splash no aparecía aquí
            y cualquier arreglo había que hacerlo dos veces. */}
        <DemoEmbed heightClass="h-[75vh] min-h-[560px]" />
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
            <span className="inline-block">¿Te encaja?</span>{' '}
            <span className="inline-block">Pruébala con tus propios asuntos.</span>
          </h2>
          <p className="mt-3 text-sm text-void/60 max-w-[46ch] mx-auto leading-relaxed">
            {PRICING.trialDays} días gratis con tus propios tipos de asuntos, sin tarjeta.
          </p>
          <div className="mt-7">
            <TrialButton event="demo_trial_click" location="demo_page" />
          </div>
          <p className="mt-6 text-[13px] text-void/60">
            ¿Tienes una pregunta?{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-700 text-gold-ink hover:text-void transition-colors underline decoration-gold-ink/30"
            >
              Habla con el equipo
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
