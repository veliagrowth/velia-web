'use client'

import { CTA, TRIAL_URL, withUtm } from '@/lib/cta'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

/**
 * EL botón de la acción primaria. Todo «Probar VELIA gratis» de la web pasa por
 * aquí, y por tres motivos que antes no se cumplían:
 *
 * 1. **Un solo texto.** La auditoría encontró 17 CTA distintos, cuatro de ellos
 *    para la misma acción («Prueba VELIA gratis», «Prueba gratis — 15 días»,
 *    «Pruébalo gratis 15 días →», «Solicitar acceso»).
 * 2. **Un solo destino.** El botón principal de `/precios` llevaba a `/contacto`.
 * 3. **Las UTM llegan a la aplicación.** Se añaden en el clic, no al renderizar:
 *    la página es estática y el servidor no ve la query del navegador. Sin esto
 *    el embudo se corta justo donde se convierte.
 */
export default function TrialButton({
  event,
  location,
  variant = 'primary',
  label = CTA.primary.label,
  className = '',
  properties,
}: {
  event: AnalyticsEvent
  /** Dónde está el botón. Va a la analítica como `cta_location`. */
  location: string
  variant?: 'primary' | 'onDark' | 'ghost'
  label?: string
  className?: string
  /** Contexto extra del clic (p. ej. `billing_mode`). `cta_location` siempre
   *  gana: es la dimensión con la que se lee el embudo y no debe poder pisarse
   *  desde fuera por descuido. */
  properties?: Record<string, string | number | boolean>
}) {
  const base = 'btn inline-block text-[12px] font-700 tracking-[0.04em] uppercase rounded-full transition-opacity'
  const estilo = {
    primary: 'bg-void text-cream px-7 py-3.5 hover:opacity-85',
    onDark: 'bg-gold text-void px-7 py-3.5 hover:opacity-85',
    ghost: 'border border-void/20 text-void px-7 py-3.5 hover:border-void/50',
  }[variant]

  return (
    <a
      href={TRIAL_URL}
      onClick={e => {
        trackEvent(event, { ...properties, cta_location: location })
        // Se reescribe el href del propio elemento antes de que el navegador
        // siga el enlace: así funciona igual con clic, Enter, rueda o «abrir en
        // pestaña nueva», sin preventDefault ni navegación manual.
        e.currentTarget.href = withUtm(TRIAL_URL)
      }}
      className={`${base} ${estilo} ${className}`}
    >
      {label}
    </a>
  )
}
