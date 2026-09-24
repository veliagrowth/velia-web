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
 * ── LA COMPOSICIÓN CAMBIA EL 22-sep, Y NO POR ESTÉTICA ────────────────────
 * Eran cuatro celdas iguales en dos columnas. El comentario de este mismo
 * archivo llevaba meses diciendo que los proyectos «no son comparables —uno es
 * un cliente con infraestructura operada y otro un trabajo creativo puntual—» y
 * la rejilla los pintaba exactamente igual. Un texto que dice una cosa y una
 * composición que dice la contraria: gana la composición, porque se ve antes.
 *
 * Ahora manda uno. Cónsul Jurídico ocupa la fila entera, con tipografía mayor y
 * su párrafo completo; los otros tres van debajo en tres columnas estrechas, con
 * una línea cada uno. La jerarquía la marcan el tamaño y el sitio, no un rótulo
 * que diga «destacado». Quién manda se declara en los datos (`principal`), no
 * en el orden del array: el orden es un accidente, y un día alguien lo cambia.
 *
 * ── EL PUNTO Y LA LÍNEA DE ENTORNO SE FUERON (24-sep-2026) ────────────────
 * Cada caso llevaba una línea diciendo qué entorno tenía —o no tenía—, con un
 * punto lleno o hueco al lado. Hablaba del ALCANCE DEL ENCARGO, que es una
 * conversación interna, delante de alguien que ha venido a ver trabajo. Un
 * proyecto se presenta por lo que es, no por lo que no incluyó.
 *
 * La idea que sostenía —se construye sólo el escalón que hace falta— no se ha
 * perdido: es la sección `#entorno` entera de la Home, con su claim detrás.
 */
export default function Casos() {
  const principal = CASOS.find(c => c.principal) ?? CASOS[0]
  const resto = CASOS.filter(c => c !== principal)

  return (
    <div className="mt-10 md:mt-14 grid gap-px bg-white/10 overflow-hidden rounded-lg">
      {/* ── El que manda ──────────────────────────────────────────────── */}
      <article className="caso bg-void px-6 py-9 md:px-10 md:py-12">
        <Reveal>
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85">
            {principal.tipo}
          </p>
          {/* El dominio va en la columna IZQUIERDA, debajo del nombre, y no al
              final del texto. Con el nombre solo, esa columna dejaba ~200 px de
              hueco muerto bajo una palabra: aire que no es respiración, es una
              celda a medio llenar. El enlace la ancla por abajo, y además es lo
              que pertenece al nombre —es su prueba—, no al párrafo de al lado. */}
          <div className="mt-4 md:grid md:grid-cols-[1fr_1.05fr] md:gap-x-12 md:items-start">
            <div>
              <h3 className="caso__nombre text-2xl md:text-4xl font-600 tracking-[-0.025em] leading-[1.05] text-cream">
                {principal.nombre}
              </h3>
              <Dominio dominio={principal.dominio} />
            </div>
            <div className="mt-5 md:mt-1">
              <p className="text-[15px] leading-[1.6] text-cream/70 max-w-prose">{principal.que}</p>
              <p className="mt-3 text-[15px] leading-[1.6] text-cream/85 max-w-prose">
                {principal.velia}
              </p>
            </div>
          </div>
        </Reveal>
      </article>

      {/* ── El contrapunto: tres columnas estrechas ───────────────────── */}
      <div className="grid gap-px bg-white/10 sm:grid-cols-3">
        {resto.map((c, i) => (
          <article key={c.dominio} className="caso bg-void px-6 py-8 md:px-7 md:py-9">
            <Reveal delay={i * 60}>
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85">{c.tipo}</p>
              <h3 className="caso__nombre mt-3.5 text-xl font-600 tracking-[-0.02em] text-cream">{c.nombre}</h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-cream/70">{c.que}</p>
              <p className="mt-2.5 text-[14px] leading-[1.6] text-cream/85">{c.velia}</p>
              <Dominio dominio={c.dominio} />
            </Reveal>
          </article>
        ))}
      </div>
    </div>
  )
}

/**
 * El enlace lleva el dominio como texto: se ve a dónde va antes de pulsarlo, y
 * `inline-block py-1` le da los 24 px de destino que pide WCAG 2.2 (2.5.8) sin
 * depender de la excepción de los enlaces en línea.
 */
function Dominio({ dominio }: { dominio: string }) {
  /* La flecha ↗ sale en diagonal al pasar o al enfocar (RESPOND, 220 ms) y a
     la vez dice lo que el enlace hace: abrir fuera. Por eso el aviso también
     va en palabras para quien no la ve — un enlace que abre pestaña sin
     decirlo desorienta a quien navega con lector de pantalla (22-sep). */
  return (
    <a
      href={`https://${dominio}`}
      target="_blank"
      rel="noopener noreferrer"
      className="dominio mt-4 inline-flex items-baseline gap-1.5 py-1 text-[14px] font-600 text-gold/85 underline decoration-gold/30 underline-offset-4 hover:decoration-gold/85 transition-colors"
    >
      {dominio}
      <span className="dominio__flecha no-underline" aria-hidden="true">
        ↗
      </span>
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  )
}
