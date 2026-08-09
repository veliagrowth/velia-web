'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PRICING, ANNUAL_SAVING, ANNUAL_FREE_MONTHS, FOUNDERS_SEATS_LABEL, eur } from '@/lib/pricing'
import { CTA } from '@/lib/cta'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import TrialButton from '@/components/TrialButton'
import { trackEvent } from '@/lib/analytics'
import { useSectionView } from '@/lib/useSectionView'

/**
 * Plan único, dos modalidades de pago.
 *
 * El cambio importante del 29-jul no es visual: **el botón principal llevaba a
 * `/contacto` y decía «Solicitar una demo»**. Quien llegaba aquí decidido a
 * probar VELIA se encontraba pidiendo una demo. Ahora lleva al alta real, y es
 * el mismo botón y el mismo texto que en el resto de la web.
 *
 * La lista de funciones baja de 11 a 8 con un enlace al detalle: una lista de
 * once puntos no se lee, se escanea y se abandona.
 */
const INCLUIDO = [
  'Cerebro VELIA con fuentes oficiales',
  'Expedientes, clientes y contactos',
  'Documentos y redacción asistida',
  'Agenda, tareas y propuestas de plazos',
  'Portal del cliente',
  'Facturación y control económico',
  `${PRICING.usersIncluded} usuarios incluidos`,
  'Onboarding y soporte',
]

export default function PricingPlans() {
  // Anual por defecto, pero el mensual se ve y se cambia sin trucos.
  const [annual, setAnnual] = useState(true)
  const foundersRef = useSectionView<HTMLDivElement>('founders_view')

  const precio = annual ? eur(PRICING.annualPerMonth) : eur(PRICING.monthly)
  const extra = annual
    ? `+${eur(PRICING.extraUserAnnual)}/año por usuario adicional`
    : `+${eur(PRICING.extraUserMonthly)}/mes por usuario adicional`
  const condicion = annual
    ? `${eur(PRICING.annualTotal)} + IVA facturados anualmente · ${ANNUAL_FREE_MONTHS} meses gratis · ahorras ${eur(ANNUAL_SAVING)}`
    : `Compromiso inicial de ${PRICING.commitmentMonths} meses. Después, cancelación con ${PRICING.cancellationNoticeDays} días de preaviso.`
  const microcopy = annual
    ? 'Decide la modalidad antes de finalizar la prueba'
    : `${PRICING.trialDays} días gratis · Sin tarjeta`

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      {/* Selector. `aria-pressed` en ambos y sin salto de layout: el ancho de los
          dos botones es fijo y el precio no cambia de altura al alternar. */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div
          className="inline-flex items-center rounded-full border border-void/15 bg-white p-1"
          role="group"
          aria-label="Modalidad de pago"
        >
          <button
            type="button"
            onClick={() => { setAnnual(false); trackEvent('pricing_monthly_select') }}
            aria-pressed={!annual}
            className={`btn rounded-full px-6 py-2 text-[11px] font-700 tracking-[0.04em] uppercase whitespace-nowrap transition-colors duration-200 ${
              !annual ? 'bg-void text-cream' : 'text-void/60 hover:text-void'
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => { setAnnual(true); trackEvent('pricing_annual_select') }}
            aria-pressed={annual}
            className={`btn rounded-full px-6 py-2 text-[11px] font-700 tracking-[0.04em] uppercase whitespace-nowrap transition-colors duration-200 ${
              annual ? 'bg-void text-cream' : 'text-void/60 hover:text-void'
            }`}
          >
            Anual
          </button>
        </div>
        <p className={`text-[11px] font-700 tracking-[0.06em] uppercase whitespace-nowrap transition-colors duration-200 ${annual ? 'text-gold-ink' : 'text-void/60'}`}>
          Anual: {ANNUAL_FREE_MONTHS} meses gratis · ahorra {eur(ANNUAL_SAVING)}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
        <div className="rounded-3xl border border-void/10 bg-white p-8 md:p-10">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-4">
            VELIA Despacho · Precio de lanzamiento
          </p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <p className="text-5xl font-600 tracking-[-0.03em] whitespace-nowrap">
              {precio}
              <span className="text-lg font-600 text-void/60">/mes</span>
            </p>
            <p className="text-sm text-void/60">
              + IVA · por despacho · {PRICING.usersIncluded} usuarios incluidos ·{' '}
              <span className="inline-block">{extra}</span>
            </p>
          </div>
          {/* min-h fija: al alternar mensual/anual el texto cambia de largo y sin
              esto la lista de abajo daba un salto. */}
          <p className="mt-3 min-h-[2.6em] text-[12px] font-600 leading-[1.5] text-gold-ink">
            {condicion}
          </p>

          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {INCLUIDO.map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-void/70 leading-snug">
                <span className="text-gold-ink mt-0.5 shrink-0" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/legal"
            className="inline-block mt-5 text-[12px] font-700 tracking-[0.04em] uppercase text-gold-ink hover:text-void transition-colors"
          >
            Ver todas las funciones →
          </Link>

          <div className="mt-8">
            <TrialButton
              event="pricing_trial_click"
              location={annual ? 'pricing_page_annual' : 'pricing_page_monthly'}
            />
          </div>
          <p className="mt-3 text-[12px] text-void/60">{microcopy}</p>
        </div>

        <div className="space-y-6">
          {FEATURE_FLAGS.ENABLE_FOUNDERS_PROGRAM && (
            <div ref={foundersRef} id="fundadores" className="rounded-3xl border border-gold/40 bg-gold/10 p-8 scroll-mt-24">
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-3">
                Programa Fundadores
              </p>
              <p className="text-2xl font-600 tracking-[-0.02em] leading-[1.15] max-w-[20ch]">
                Entra en la primera generación de despachos VELIA.
              </p>
              <p className="mt-3 text-sm text-void/70 leading-[1.6]">
                Los primeros despachos que contraten la modalidad anual mantienen el precio de
                lanzamiento mientras su suscripción permanezca activa y acceden a una web
                premium de lanzamiento.
              </p>
              <p className="mt-4 text-[12px] font-700 tracking-[0.06em] uppercase text-gold-ink">
                {FOUNDERS_SEATS_LABEL} disponibles
              </p>
              <div className="mt-5">
                <TrialButton event="founders_trial_click" location="pricing_founders" className="px-6 py-3" />
              </div>
              <Link
                href="/fundadores"
                onClick={() => trackEvent('founders_terms_click')}
                className="inline-block mt-4 text-[12px] font-700 tracking-[0.04em] uppercase text-gold-ink hover:text-void transition-colors"
              >
                Ver condiciones del programa →
              </Link>
            </div>
          )}

          {FEATURE_FLAGS.ENABLE_ENTERPRISE_CONTACT && (
            <div className="rounded-3xl border border-void/10 bg-white p-8">
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/60 mb-3">
                Bufetes grandes
              </p>
              <p className="text-sm text-void/65 leading-[1.6]">
                ¿Necesitas más de 10 usuarios, una migración compleja o integraciones
                específicas? Preparamos un plan de implantación personalizado.
              </p>
              {/* Un bufete grande con migración compleja es el lead de más valor
                  que puede entrar por aquí. Hasta el 9-ago se le mandaba a un
                  `mailto:` —en el móvil, abrir el cliente de correo— y no
                  quedaba rastro de él en ninguna parte. Ahora va al formulario. */}
              <Link
                href="/contacto"
                onClick={() => trackEvent('enterprise_contact_click', { cta_location: 'pricing' })}
                className="inline-block mt-4 text-[12px] font-700 tracking-[0.04em] uppercase text-gold-ink hover:text-void transition-colors"
              >
                {CTA.tertiary.label} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
