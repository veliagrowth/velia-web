'use client'

import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'

/**
 * La accion del hero — rectangular, compacta, con canto.
 *
 * ── POR QUE NO ES UNA CAPSULA ─────────────────────────────────────────────
 * El resto de la web usa `CtaFlecha`, que es una pastilla con su flecha y
 * funciona bien donde esta: al final de una seccion, como invitacion. En el
 * hero hay DOS acciones juntas y una pastilla oscura al lado de otra clara se
 * lee como un control de segmentos, no como dos decisiones distintas.
 *
 * El radio pequeno (6 px) y el canto duro hacen otra cosa: parecen un control
 * de aplicacion, que es exactamente lo que hay debajo. La forma del boton y la
 * forma del producto se contestan.
 *
 * ⚠️ 24-sep (tarde): ESTE ES YA EL SISTEMA. `CtaFlecha` —la pastilla con la
 * flecha que se rellenaba— se ha retirado y sus dos consumidores, la barra y el
 * cierre oscuro de las piezas, pasan por aqui. Un solo componente con TRES
 * pieles (clara, oscura y la de barra), que no es lo mismo que tres botones:
 * cambian a la vez y no hay uno que se quede con el diseno anterior.
 *
 * ── EL CANTO, Y POR QUE NO ES UNA SOMBRA ──────────────────────────────────
 * Un `box-shadow` de desplazamiento fijo y sin difuminar —2 px abajo, 2 px a la
 * derecha— dibuja un canto, no una sombra. Al pulsar, el boton se mueve esos
 * mismos 2 px y el canto desaparece: la pieza se hunde. Es feedback de
 * profundidad con una sola propiedad y sin desenfoque que recalcular.
 *
 * ── ACCESIBILIDAD ─────────────────────────────────────────────────────────
 * Es un `<a>` porque los dos van a algun sitio; no hay `<button>` que finja
 * navegar. El foco lo marca el anillo Iris solido de 2 px del manual de marca
 * —nunca el halo al 35 %—. Con `prefers-reduced-motion` el desplazamiento del
 * hover desaparece y queda el cambio de canto, que no se mueve.
 */
export default function BotonAccion({
  href,
  children,
  variante = 'primaria',
  evento,
  propiedades,
  externo = false,
  compacto = false,
}: {
  href: string
  children: React.ReactNode
  /** `primaria` Night sobre claro · `secundaria` blanca con borde · `oscura` Pearl sobre Night. */
  variante?: 'primaria' | 'secundaria' | 'oscura'
  evento?: AnalyticsEvent
  propiedades?: Record<string, string | number | boolean>
  externo?: boolean
  /** Talla de barra: 36 px. Mismo boton a otra escala, no otro boton. */
  compacto?: boolean
}) {
  const base = `boton-accion inline-flex items-center justify-center rounded-[6px] border font-600 tracking-[0.01em] whitespace-nowrap ${
    compacto ? 'px-4 py-[0.42rem] text-[12px]' : 'px-6 py-[0.72rem] text-[13px]'
  }`

  /* Primaria: Night sobre Pearl. Secundaria: blanco con el borde de control del
     manual (neutral-450 #838CA1) — el paso 300 da 1,38:1 y no delimita nada.
     Oscura: Pearl sobre Night, para los cierres. */
  const piel =
    variante === 'primaria'
      ? 'boton-accion--primaria border-void bg-void text-cream'
      : variante === 'secundaria'
        ? 'boton-accion--secundaria border-[#838CA1] bg-white text-void'
        : 'boton-accion--oscura border-cream bg-cream text-void'

  return (
    <a
      href={href}
      onClick={evento ? () => trackEvent(evento, propiedades) : undefined}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${base} ${piel}`}
    >
      {children}
    </a>
  )
}
