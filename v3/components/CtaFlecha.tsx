import TrackedLink from '@/components/TrackedLink'
import type { AnalyticsEvent } from '@/lib/analytics'

/**
 * El botón de acción de VELIA: al pasar o al enfocar, el círculo de la flecha
 * se abre hasta llenarlo.
 *
 * Adaptado de «Arrow Fill Button» de ObsidianUI — Copyright (c) 2026
 * ObsidianUI, licencia MIT (texto completo en THIRD_PARTY_NOTICES.md). De allí
 * vienen la técnica —una capa duplicada recortada con `clip-path` que se abre
 * a píldora— y el trazado de la flecha. Lo que cambia al traerlo:
 *
 *   · colores de VELIA: Night o Pearl de fondo, relleno Iris 700 con texto
 *     blanco (6,59:1). Ni rastro del naranja original;
 *   · el hover va detrás de `@media (hover: hover)`: en táctil un `:hover` se
 *     queda pegado después del toque, así que allí responde la PULSACIÓN;
 *   · `:focus-visible` lo abre siempre, y el anillo de foco global de la web
 *     sigue encima: el relleno no sustituye al indicador de foco, lo acompaña;
 *   · `reduced-motion` cambia de estado sin transición.
 *
 * NO ES UNA FAMILIA NUEVA DE BOTONES. Etiqueta y destino salen de `lib/cta.ts`
 * como siempre, el enlace es el `TrackedLink` de siempre y la pulsación es la
 * de `.btn`. Esto sustituye a la píldora de la acción principal; no convive
 * con ella en el mismo papel.
 *
 * La capa duplicada es `aria-hidden`: el nombre accesible del enlace es su
 * etiqueta, leída una sola vez.
 */
export default function CtaFlecha({
  href,
  etiqueta,
  evento,
  propiedades,
  sobre = 'claro',
  compacto = false,
}: {
  href: string
  etiqueta: string
  evento: AnalyticsEvent
  propiedades?: Record<string, string | number | boolean>
  /** El fondo sobre el que se pinta: `claro` → botón Night; `oscuro` → botón Pearl. */
  sobre?: 'claro' | 'oscuro'
  /**
   * Talla de barra: 36 px en vez de 52 (22-sep). NO es otro botón — mismo
   * marcado, mismo comportamiento, mismos estados— sino el mismo a otra escala.
   * Dos componentes para la misma acción dejan de parecerse en el tercer
   * cambio, y la acción es justo lo que tiene que reconocerse de una sección a
   * otra.
   */
  compacto?: boolean
}) {
  return (
    <TrackedLink
      href={href}
      event={evento}
      properties={propiedades}
      className={`btn cta-flecha ${sobre === 'oscuro' ? 'cta-flecha--oscuro' : ''} ${compacto ? 'cta-flecha--compacto' : ''}`}
    >
      <span className="cta-flecha__texto">{etiqueta}</span>
      <span aria-hidden="true" className="cta-flecha__capa">
        <span>{etiqueta}</span>
        <svg viewBox="0 0 10 10" className="cta-flecha__flecha" focusable="false">
          <path
            className="cta-flecha__trazo"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.82475e-07 5.625L7.625 5.625L4.125 9.125L5 10L10 5L5 -4.37114e-07L4.125 0.874999L7.625 4.375L4.91753e-07 4.375L3.82475e-07 5.625Z"
          />
          <path
            className="cta-flecha__trazo"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.82475e-07 5.625L7.625 5.625L4.125 9.125L5 10L10 5L5 -4.37114e-07L4.125 0.874999L7.625 4.375L4.91753e-07 4.375L3.82475e-07 5.625Z"
          />
        </svg>
      </span>
    </TrackedLink>
  )
}
