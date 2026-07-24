import type { Metadata } from 'next'
import Link from 'next/link'
import TrackedLink from '@/components/TrackedLink'
import { APP_URL, CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Empieza con VELIA — monta tu despacho en 2 minutos',
  description:
    'Cuéntale a VELIA cómo trabaja tu despacho y monta tu prueba con tu propio contexto. 15 días gratis, sin tarjeta. O recorre la demo interactiva sin registro.',
  alternates: { canonical: 'https://veliacorp.com/contacto' },
}

const ONBOARDING_URL = `${APP_URL}/prueba-velia`

/**
 * /contacto — SIN formulario clásico (decisión Joaquín 2026-07-24). El peso de
 * la conversión recae en el onboarding interactivo ("radiografía" en
 * app.veliacorp.com/prueba-velia), que monta el VELIA del despacho con su
 * propio contexto. La demo de solo lectura es la vía sin registro, y queda un
 * email discreto como último recurso. El componente ContactForm queda dormido
 * (sin uso) por si se reactiva.
 */
export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-20 md:pt-28 pb-24">
      <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-6">
        Empieza aquí
      </p>
      <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em] max-w-[16ch]">
        Conoce VELIA con tu propio despacho.
      </h1>
      <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
        Nada de rellenar un formulario y esperar. En un par de minutos le cuentas a VELIA
        cómo trabajas y monta tu espacio con el contexto de tu despacho.{' '}
        <span className="inline-block">15 días gratis, sin tarjeta.</span>
      </p>

      {/* Camino primario: el onboarding interactivo (la "radiografía") */}
      <div className="mt-12 rounded-3xl border border-void/10 bg-white p-8 md:p-10">
        <p className="text-[11px] font-700 tracking-[0.2em] uppercase text-gold-ink mb-3">
          El camino recomendado
        </p>
        <h2 className="text-2xl md:text-3xl font-700 tracking-[-0.01em] max-w-[20ch]">
          Monta tu VELIA en 2 minutos.
        </h2>
        <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
          Te preguntamos cómo trabaja tu despacho —áreas, volumen, dónde vive hoy tu
          información— y VELIA arranca ya con tu contexto cargado. Sin llamadas, sin
          esperas, sin compromiso.
        </p>
        <TrackedLink
          href={ONBOARDING_URL}
          event="onboarding_start_click"
          className="btn inline-block mt-7 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-8 py-4 hover:opacity-85"
        >
          Empezar mi prueba
        </TrackedLink>
      </div>

      {/* Camino secundario: la demo de solo lectura, sin registro */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-void/10 bg-white/60 p-7">
          <h3 className="text-lg font-700 mb-2">¿Prefieres verlo antes?</h3>
          <p className="text-sm text-void/60 leading-[1.6]">
            Entra en un despacho de demostración y recorre VELIA por dentro —expedientes,
            plazos, agenda y facturación—.{' '}
            <span className="inline-block">Sin registro, es un escaparate de solo lectura.</span>
          </p>
          <Link
            href="/demo"
            className="inline-block mt-5 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
          >
            Abrir la demo interactiva →
          </Link>
        </div>
        <div className="rounded-2xl border border-void/10 bg-white/60 p-7">
          <h3 className="text-lg font-700 mb-2">¿Tienes una pregunta concreta?</h3>
          <p className="text-sm text-void/60 leading-[1.6]">
            Escríbenos y te respondemos en el día laborable. Hablas con el equipo que
            construye la plataforma, no con un comercial.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-block mt-5 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
          >
            {CONTACT_EMAIL} →
          </a>
        </div>
      </div>
    </section>
  )
}
