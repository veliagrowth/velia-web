'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PRICING, ANNUAL_SAVING, ANNUAL_FREE_MONTHS, FOUNDERS_SEATS_LABEL, eur } from '@/lib/pricing'
import { trackEvent } from '@/lib/analytics'
import { useSectionView } from '@/lib/useSectionView'

/* Lo que incluye el plan único "VELIA Despacho". La web del despacho ya NO va
   en el plan base (modelo Axel 2026-07-21): es incentivo del Programa Fundadores
   anual o un añadido opcional. */
const INCLUDED = [
  'VELIA, tu asistente: escritos, informes y consultas con fuentes oficiales (BOE)',
  'Puesta al día automática cada mañana (plazos, citas, mensajes, documentos)',
  'Cómputo de plazos procesales según la LEC con avisos',
  'CRM completo: contactos, expedientes, pipeline, agenda y control horario',
  'Portal del cliente: su caso en lenguaje llano, subida de documentos, pagos y citas',
  'Persecución automática de documentación al cliente',
  'Facturación conforme a Verifactu',
  'Inbox unificado: email y mensajes del portal',
  '2 usuarios incluidos',
  'Datos alojados en la UE · aislamiento por despacho (RLS)',
  'Onboarding inicial y soporte',
]

export default function PricingPlans() {
  // Anual seleccionado por defecto (modelo Axel), pero el mensual se ve y se
  // cambia sin trucos — nunca escondemos el precio mensual.
  const [annual, setAnnual] = useState(true)
  const foundersRef = useSectionView<HTMLDivElement>('founders_program_view')

  const price = annual ? eur(PRICING.annualPerMonth) : eur(PRICING.monthly)
  const extra = annual
    ? `+${eur(PRICING.extraUserAnnual)}/año por usuario adicional`
    : `+${eur(PRICING.extraUserMonthly)}/mes por usuario adicional`
  const note = annual
    ? `Facturado anualmente: ${eur(PRICING.annualTotal)}/año — ${ANNUAL_FREE_MONTHS} meses gratis.`
    : `Compromiso inicial de ${PRICING.commitmentMonths} meses. Después, cancela con 30 días de preaviso.`

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      {/* Toggle mensual / anual — anual por defecto, mensual siempre accesible */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center rounded-full border border-void/15 bg-white p-1 overflow-hidden">
          <button
            type="button"
            onClick={() => { setAnnual(false); trackEvent('pricing_toggle_monthly') }}
            aria-pressed={!annual}
            className={`btn rounded-full px-5 py-2 text-[11px] font-700 tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-200 ease-in-out ${
              !annual ? 'bg-void text-cream' : 'text-void/60 hover:text-void'
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => { setAnnual(true); trackEvent('pricing_toggle_annual') }}
            aria-pressed={annual}
            className={`btn rounded-full px-5 py-2 text-[11px] font-700 tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-200 ease-in-out ${
              annual ? 'bg-void text-cream' : 'text-void/60 hover:text-void'
            }`}
          >
            Anual
          </button>
        </div>
        <p className={`text-[11px] font-700 tracking-[0.08em] uppercase whitespace-nowrap transition-colors duration-200 ${annual ? 'text-gold-ink' : 'text-void/60'}`}>
          Anual: {ANNUAL_FREE_MONTHS} meses gratis · ahorra {eur(ANNUAL_SAVING)}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
        {/* Plan principal */}
        <div className="rounded-3xl border border-void/10 bg-white p-8 md:p-10">
          <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-4">
            VELIA Despacho · Precio de lanzamiento
          </p>
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-5xl font-800 tracking-[-0.03em]">
              {price}
              <span className="text-lg font-600 text-void/60">/mes</span>
            </p>
            <p className="text-sm text-void/60">
              + IVA · por despacho · {PRICING.usersIncluded} usuarios incluidos ·{' '}
              <span className="inline-block">{extra}</span>
            </p>
          </div>
          <p className="mt-3 text-[12px] font-600 tracking-[0.04em] text-gold-ink">{note}</p>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {INCLUDED.map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-void/70 leading-snug">
                <span className="text-gold-ink mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            onClick={() => trackEvent(annual ? 'pricing_annual_demo_click' : 'pricing_monthly_demo_click')}
            className="btn inline-block mt-9 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
          >
            Solicitar demo
          </Link>
          <p className="mt-3 text-[12px] text-void/60">Conoce VELIA antes de contratar.</p>
        </div>

        <div className="space-y-6">
          {/* Fundadores — mismo precio, la ventaja es la web premium (solo anual) */}
          <div ref={foundersRef} id="fundadores" className="rounded-3xl border border-gold/40 bg-gold/10 p-8 scroll-mt-24">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-3">
              Programa Fundadores
            </p>
            <p className="text-2xl font-800 tracking-[-0.02em] leading-[1.15] max-w-[18ch]">
              Web premium de lanzamiento incluida.
            </p>
            <p className="mt-3 text-sm text-void/70 leading-[1.6]">
              Los primeros despachos que contraten VELIA en modalidad anual acceden a una
              presencia digital nueva, a la altura de su trabajo —{' '}
              <span className="inline-block">incluida con el plan anual.</span> Mismo precio,
              precio de lanzamiento congelado y voz en la hoja de ruta.
            </p>
            <p className="mt-4 text-[12px] font-700 tracking-[0.08em] uppercase text-gold-ink">
              Quedan {FOUNDERS_SEATS_LABEL}
            </p>
            <Link
              href="/contacto"
              onClick={() => trackEvent('founders_program_click')}
              className="btn inline-block mt-5 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-6 py-3 hover:opacity-85"
            >
              Solicitar acceso fundador
            </Link>
          </div>

          {/* Bufetes grandes */}
          <div className="rounded-3xl border border-void/10 bg-white p-8">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/60 mb-3">
              Bufetes grandes
            </p>
            <p className="text-sm text-void/65 leading-[1.6]">
              Sin tarifa de catálogo: onboarding y estudio de integración a medida según
              la infraestructura que haya que manejar.
            </p>
            <Link href="/contacto" className="inline-block mt-4 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors">
              Hablar con el equipo →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
