'use client'

import Link from 'next/link'
import { useState } from 'react'

const INCLUDED = [
  'VELIA, tu asistente: escritos, informes y consultas con fuentes oficiales (BOE)',
  'Puesta al día automática cada mañana (plazos, citas, mensajes, documentos)',
  'Cómputo de plazos procesales según la LEC con avisos',
  'CRM completo: contactos, expedientes, pipeline, agenda y control horario',
  'Portal del cliente: su caso en lenguaje llano, subida de documentos, pagos y citas',
  'Persecución automática de documentación al cliente',
  'Facturación conforme a Verifactu',
  'Web del despacho a medida — gratis de por vida',
  'Inbox unificado: email, WhatsApp y mensajes del portal',
  'Datos alojados en la UE · aislamiento por despacho (RLS)',
]

/* Anual = 2 meses gratis (paga 10, usa 12). Decisión 2026-07-10:
   199 → 1.990€/año (equiv. 166€/mes) · Fundadores 149 → 1.490€/año (equiv. 124€/mes). */
const PLAN = {
  monthly: { price: '199€', extra: '+49€/mes por abogado adicional', note: null },
  annual: {
    price: '166€',
    extra: '+490€/año por abogado adicional',
    note: 'Facturado anualmente: 1.990€/año — 2 meses gratis.',
  },
}
const FOUNDERS = {
  monthly: { price: '149€', note: null },
  annual: { price: '124€', note: 'Facturado anualmente: 1.490€/año — 2 meses gratis.' },
}

export default function PricingPlans() {
  const [annual, setAnnual] = useState(false)
  const plan = annual ? PLAN.annual : PLAN.monthly
  const founders = annual ? FOUNDERS.annual : FOUNDERS.monthly

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      {/* Toggle mensual / anual */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center rounded-full border border-void/15 bg-white p-1 overflow-hidden">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            aria-pressed={!annual}
            className={`btn rounded-full px-5 py-2 text-[11px] font-700 tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-200 ease-in-out ${
              !annual ? 'bg-void text-cream' : 'text-void/55 hover:text-void'
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            aria-pressed={annual}
            className={`btn rounded-full px-5 py-2 text-[11px] font-700 tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-200 ease-in-out ${
              annual ? 'bg-void text-cream' : 'text-void/55 hover:text-void'
            }`}
          >
            Anual
          </button>
        </div>
        <p className={`text-[11px] font-700 tracking-[0.08em] uppercase whitespace-nowrap transition-colors duration-200 ${annual ? 'text-gold-dark' : 'text-void/40'}`}>
          Anual: 2 meses gratis
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
        {/* Plan principal */}
        <div className="rounded-3xl border border-void/10 bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-5xl font-800 tracking-[-0.03em]">
              {plan.price}
              <span className="text-lg font-600 text-void/45">/mes</span>
            </p>
            <p className="text-sm text-void/50">por despacho · 1 abogado incluido · {plan.extra}</p>
          </div>
          {plan.note && (
            <p className="mt-3 text-[12px] font-600 tracking-[0.04em] text-gold-dark">{plan.note}</p>
          )}
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {INCLUDED.map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-void/70 leading-snug">
                <span className="text-gold-dark mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            className="btn inline-block mt-9 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85"
          >
            Empezar — agenda una demo
          </Link>
        </div>

        <div className="space-y-6">
          {/* Fundadores */}
          <div id="fundadores" className="rounded-3xl border border-gold/40 bg-gold/10 p-8 scroll-mt-24">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">
              Programa Fundadores
            </p>
            <p className="text-4xl font-800 tracking-[-0.03em]">
              {founders.price}
              <span className="text-base font-600 text-void/45">/mes</span>
            </p>
            {founders.note && (
              <p className="mt-2 text-[12px] font-600 tracking-[0.04em] text-gold-dark">{founders.note}</p>
            )}
            <p className="mt-3 text-sm text-void/65 leading-[1.6]">
              Congelado <strong className="font-700">de por vida</strong> para los 5 primeros
              despachos. Mismo producto completo, acceso directo al equipo que lo construye
              y voz en la hoja de ruta.
            </p>
            <p className="mt-4 text-[12px] font-700 tracking-[0.08em] uppercase text-gold-dark">
              Quedan 4 de 5 plazas
            </p>
            <Link
              href="/contacto"
              className="btn inline-block mt-5 bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-6 py-3 hover:opacity-85"
            >
              Solicitar plaza
            </Link>
          </div>

          {/* Bufetes grandes */}
          <div className="rounded-3xl border border-void/10 bg-white p-8">
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-void/40 mb-3">
              Bufetes grandes
            </p>
            <p className="text-sm text-void/65 leading-[1.6]">
              Sin tarifa de catálogo: onboarding y estudio de integración a medida según
              la infraestructura que haya que manejar.
            </p>
            <Link href="/contacto" className="inline-block mt-4 text-[12px] font-700 tracking-[0.1em] uppercase text-gold-dark hover:text-void transition-colors">
              Hablar con el equipo →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
