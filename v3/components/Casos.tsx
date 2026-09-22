import Reveal from '@/components/Reveal'
import { CASOS } from '@/lib/casos'

/**
 * Trabajo — los cuatro proyectos, sobre el corte oscuro de la Home.
 *
 * ── POR QUÉ NO HAY IMÁGENES ───────────────────────────────────────────────
 * Las que existen en el repositorio son capturas de Instagram, de Meta Ads y de
 * Google Business con sus cifras encima: publicarlas es publicar las cifras por
 * la puerta de atrás, y son de julio de 2026. Las otras son fotos de un cliente
 * y de su equipo, que no han autorizado su uso aquí.
 *
 * Así que la prueba es tipográfica: nombre, qué es, qué hizo VELIA y el dominio
 * para comprobarlo. Un dominio que abre es más verificable que un mockup.
 *
 * ── COMPOSICIÓN ───────────────────────────────────────────────────────────
 * Dos columnas en escritorio y una en móvil, separadas por líneas finas y no
 * por tarjetas: cuatro cajas iguales pedirían comparar los proyectos entre sí,
 * y no son comparables —uno es un cliente con infraestructura operada y otro un
 * trabajo creativo puntual—. La jerarquía la marca el orden, no el tamaño.
 *
 * El enlace lleva el dominio como texto: se ve a dónde va antes de pulsarlo, y
 * `inline-block py-1` le da los 24 px de destino que pide WCAG 2.2 (2.5.8) sin
 * depender de la excepción de los enlaces en línea.
 */
export default function Casos() {
  return (
    <ul className="mt-14 md:mt-20 grid gap-px bg-white/10 sm:grid-cols-2 overflow-hidden rounded-lg">
      {CASOS.map((c, i) => (
        <li key={c.dominio} className="bg-void px-6 py-8 md:px-8 md:py-10">
          <Reveal delay={i * 60}>
            <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85">{c.tipo}</p>
            <h3 className="mt-4 text-xl md:text-2xl font-600 tracking-[-0.02em] text-cream">{c.nombre}</h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-cream/70 max-w-prose">{c.que}</p>
            <p className="mt-3 text-[15px] leading-[1.6] text-cream/85 max-w-prose">{c.velia}</p>

            {/* ── SU ENTORNO (22-sep-2026) ────────────────────────────────
                La fila que convierte la lista en un argumento. Antes los cuatro
                proyectos se leían como cuatro encargos del mismo tamaño; aquí se
                ve que dos no tienen entorno de gestión y uno lo tiene entero, y
                eso es exactamente lo que la sección de arriba afirma.

                Separada por una línea y no por una tarjeta: es un dato más del
                mismo proyecto, no una segunda ficha. `border-white/10` es el
                mismo valor que separa las celdas de la rejilla, para que la
                división interna no pese más que la externa. */}
            <p className="mt-6 border-t border-white/10 pt-5 text-[11px] font-600 tracking-[0.06em] uppercase text-cream/70">
              Su entorno
            </p>
            <p className="mt-2 text-[14px] leading-[1.6] text-cream/70 max-w-prose">{c.entorno}</p>

            <a
              href={`https://${c.dominio}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block py-1 text-[14px] font-600 text-gold/85 underline decoration-gold/30 underline-offset-4 hover:decoration-gold/85 transition-colors"
            >
              {c.dominio}
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
