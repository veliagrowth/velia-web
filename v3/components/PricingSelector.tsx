'use client'

import { useState } from 'react'
import TrialButton from './TrialButton'
import { PRICING, ANNUAL_FREE_MONTHS, ANNUAL_SAVING, eur } from '@/lib/pricing'
import { trackEvent } from '@/lib/analytics'

/**
 * Un precio. Todo VELIA.
 *
 * POR QUÉ EXISTE: hasta hoy la home enseñaba 99 €/mes y una línea suelta que
 * decía «en anual, 2 meses gratis». La modalidad anual —que es la que interesa
 * a las dos partes y la única que da acceso al Programa Fundadores— no se podía
 * ni mirar. Además `pricing_monthly_select` y `pricing_annual_select` llevaban
 * declarados desde el 28-jul en el tipo de eventos **sin que nadie los emitiera**:
 * dos columnas del embudo que no se rellenaban nunca.
 *
 * ANUAL POR DEFECTO, SIN TRAMPA: la mensual está a un clic, con el mismo peso
 * visual, y las condiciones de las dos se ven sin desplegar nada. Preseleccionar
 * lo que más conviene es legítimo; esconder la alternativa, no.
 *
 * Los importes NUNCA se escriben aquí: salen de `lib/pricing.ts`. El ahorro se
 * calcula, y por eso no puede quedarse desincronizado del precio.
 */

type Modo = 'anual' | 'mensual'

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

export default function PricingSelector() {
  const [modo, setModo] = useState<Modo>('anual')

  const cambiar = (m: Modo) => {
    setModo(m)
    trackEvent(m === 'anual' ? 'pricing_annual_select' : 'pricing_monthly_select', { billing_mode: m })
  }

  const anual = modo === 'anual'

  return (
    <div className="rounded-3xl border border-mist bg-white px-6 py-8 sm:px-10 sm:py-12">
      {/* Selector. Dos opciones, mismo tamaño, ambas alcanzables con teclado. */}
      <div
        role="radiogroup"
        aria-label="Modalidad de facturación"
        className="inline-flex rounded-full border border-mist bg-cream p-1"
      >
        {(['anual', 'mensual'] as Modo[]).map(m => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={modo === m}
            onClick={() => cambiar(m)}
            className={`rounded-full px-5 min-h-[40px] text-[12px] font-600 tracking-[0.02em] transition-colors duration-control ease-velia ${
              modo === m ? 'bg-void text-cream' : 'text-void/60 hover:text-void'
            }`}
          >
            {m === 'anual' ? 'Anual' : 'Mensual'}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-600 tracking-[-0.03em]">Un precio. Todo VELIA.</h2>
          <p className="mt-4 text-[15px] text-void/70 leading-[1.6] max-w-[46ch]">
            Gestión del despacho, inteligencia jurídica, portal del cliente, facturación y soporte
            dentro de una única suscripción.
          </p>
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 max-w-2xl">
            {INCLUIDO.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-[13px] text-void/70 leading-[1.55]">
                <span className="mt-[7px] w-1 h-1 rounded-full bg-iris-focus shrink-0" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Cifra. `min-w` + tabular para que conmutar no mueva el layout. */}
        <div className="lg:text-right lg:min-w-[300px]">
          <p aria-live="polite">
            <span className="tabular text-5xl md:text-6xl font-600 tracking-[-0.04em] whitespace-nowrap">
              {anual ? eur(PRICING.annualPerMonth) : eur(PRICING.monthly)}
            </span>
            <span className="text-xl font-500 text-void/50">/mes</span>
          </p>

          <div className="mt-3 min-h-[76px] text-[13px] text-void/65 leading-[1.6]">
            {anual ? (
              <>
                <p>{eur(PRICING.annualTotal)} + IVA facturados anualmente</p>
                <p className="mt-1 text-gold-ink font-600">
                  {ANNUAL_FREE_MONTHS} meses gratis · Ahorras {eur(ANNUAL_SAVING)}
                </p>
                <p className="mt-1 text-void/55">Por despacho · {PRICING.usersIncluded} usuarios incluidos</p>
              </>
            ) : (
              <>
                <p>+ IVA · por despacho · {PRICING.usersIncluded} usuarios incluidos</p>
                <p className="mt-1 text-void/55">
                  Compromiso inicial de {PRICING.commitmentMonths} meses. Después, cancelación con{' '}
                  {PRICING.cancellationNoticeDays} días de preaviso.
                </p>
              </>
            )}
          </div>

          <div className="mt-6 lg:flex lg:justify-end">
            <TrialButton event="pricing_trial_click" location="home_pricing" properties={{ billing_mode: modo }} />
          </div>
          <p className="mt-4 text-[12px] text-void/55">
            {PRICING.trialDays} días gratis · Sin tarjeta
          </p>
        </div>
      </div>
    </div>
  )
}
