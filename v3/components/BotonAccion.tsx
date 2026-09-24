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
 * ⚠️ `CtaFlecha` NO se toca y NO se sustituye. Sigue siendo la accion del resto
 * de la pagina. Esto es el hero y solo el hero: si acaba usandose en tres
 * sitios mas, entonces habra que decidir cual de los dos es el sistema.
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
  externo = false,
}: {
  href: string
  children: React.ReactNode
  variante?: 'primaria' | 'secundaria'
  evento?: AnalyticsEvent
  externo?: boolean
}) {
  const base =
    'boton-accion inline-flex items-center justify-center rounded-[6px] border px-6 py-[0.72rem] text-[13px] font-600 tracking-[0.01em] whitespace-nowrap'

  /* Primaria: Night sobre Pearl. Secundaria: blanco con el borde de control del
     manual (neutral-450 #838CA1) — el paso 300 da 1,38:1 y no delimita nada. */
  const piel =
    variante === 'primaria'
      ? 'boton-accion--primaria border-void bg-void text-cream'
      : 'boton-accion--secundaria border-[#838CA1] bg-white text-void'

  return (
    <a
      href={href}
      onClick={evento ? () => trackEvent(evento) : undefined}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${base} ${piel}`}
    >
      {children}
    </a>
  )
}
