'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Antes / Con VELIA.
 *
 * Es un TOGGLE y no un slider de arrastre a propósito: un slider necesita el
 * dedo puesto sobre una banda estrecha, compite con el scroll vertical en móvil
 * y no se puede usar con teclado sin inventarse un patrón. Dos botones dicen lo
 * mismo, funcionan en todas partes y no hay que explicarlos.
 *
 * Lo que se compara es la OPERATIVA, no resultados de negocio: nada de «un 40 %
 * más de clientes». Las métricas de captación que había aquí antes eran el
 * residuo exacto del modelo de agencia y están apagadas por bandera
 * (`ENABLE_CUSTOMER_METRICS`) hasta que existan cifras de uso auditables.
 */

const ESTADOS = {
  antes: {
    etiqueta: 'Antes',
    filas: [
      ['Expedientes', 'Carpetas por cliente y una hoja de cálculo maestra'],
      ['Documentación', 'Repartida entre el correo, el escritorio y la nube'],
      ['Plazos', 'Anotados a mano tras leer cada notificación'],
      ['Cliente', 'Pide el estado del asunto por teléfono'],
      ['Facturación', 'En un programa aparte, sin relación con el asunto'],
    ],
  },
  velia: {
    etiqueta: 'Con VELIA',
    filas: [
      ['Expedientes', 'Un asunto con todo dentro: partes, estado y economía'],
      ['Documentación', 'En el expediente, y VELIA trabaja sobre ella'],
      ['Plazos', 'VELIA propone el cómputo con su cita; el abogado aprueba'],
      ['Cliente', 'Entra en su portal y ve lo que le corresponde'],
      ['Facturación', 'Enlazada al asunto, con lo cobrado y lo pendiente'],
    ],
  },
} as const

type Estado = keyof typeof ESTADOS

export default function CaseStudyToggle() {
  const [estado, setEstado] = useState<Estado>('velia')

  const cambiar = (e: Estado) => {
    setEstado(e)
    trackEvent('case_toggle', { interaction_type: e })
  }

  const actual = ESTADOS[estado]

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Comparar la operativa del despacho"
        className="inline-flex rounded-full border border-mist bg-cream p-1"
      >
        {(Object.keys(ESTADOS) as Estado[]).map(k => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={estado === k}
            onClick={() => cambiar(k)}
            className={`rounded-full px-5 min-h-[40px] text-[12px] font-600 tracking-[0.02em] transition-colors duration-control ease-velia ${
              estado === k ? 'bg-void text-cream' : 'text-void/60 hover:text-void'
            }`}
          >
            {ESTADOS[k].etiqueta}
          </button>
        ))}
      </div>

      {/* Altura reservada al estado más alto: conmutar no debe mover la página. */}
      <dl className="mt-7 divide-y divide-mist border-y border-mist" aria-live="polite">
        {actual.filas.map(([k, v]) => (
          <div key={k} className="grid sm:grid-cols-[160px_1fr] gap-1 sm:gap-6 py-4">
            <dt className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/50 pt-0.5">{k}</dt>
            <dd className="text-[14px] text-void/75 leading-[1.55]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
