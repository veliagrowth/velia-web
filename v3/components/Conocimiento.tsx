import type { ReactNode } from 'react'
import CtaFlecha from '@/components/CtaFlecha'
import { CTA_CONTACTO, CONTACTO_MICROCOPY } from '@/lib/cta'
import { fechaLarga, type Fuente } from '@/lib/conocimiento'

/**
 * Piezas de composición de las páginas de conocimiento (/ai-search/*).
 *
 * Extraídas de la primera guía el 19-sep-2026, al escribir la segunda: una
 * segunda página con su propia copia de cada pieza es el patrón «primo pobre»
 * que `portal-rules` prohíbe — dos versiones de lo mismo que dejan de parecerse
 * en el tercer cambio. Tipografía, color y espaciado del sistema existente; ni
 * un tamaño nuevo.
 */

/* La medida de lectura (`max-w-prose`) va en el ELEMENTO de texto, nunca en un
   contenedor que envuelva también un titular o un panel: se expresa en `em` y
   se resuelve con el tamaño del propio elemento. Ver `tailwind.config.ts`. */
export const cuerpo = 'max-w-prose text-[15px] md:text-base leading-[1.6] text-void/70'
export const enlace =
  'font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors'

/** Una sección numerada. El número va a la izquierda; el `h2`, la pregunta;
 *  el primer párrafo, la respuesta, separada del desarrollo: es lo que se
 *  extrae si sólo se lee una frase de la sección. */
export function SeccionNumerada({
  id,
  numero,
  titulo,
  respuesta,
  children,
}: {
  id: string
  numero: string
  titulo: string
  respuesta: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`t-${id}`} className="mx-auto max-w-6xl px-6 md:px-10 scroll-mt-24">
      <div className="hairline py-14 md:py-20 grid gap-x-10 gap-y-5 md:grid-cols-[auto_1fr]">
        <span className="indice text-slate" aria-hidden="true">
          {numero}
        </span>
        {/* `max-w-3xl` es un ancho de MAQUETACIÓN: da sitio al titular y al panel
            de evidencia. La medida de lectura la lleva cada texto dentro. Hasta
            el 19-sep este contenedor era `max-w-prose`, y al recalibrar el token
            habría estrechado también el titular y el panel. */}
        <div className="max-w-3xl">
          <h2
            id={`t-${id}`}
            className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void"
          >
            {titulo}
          </h2>
          <p className="mt-6 max-w-prose text-lg md:text-xl leading-[1.55] text-void/85">{respuesta}</p>
          <div className="mt-6 space-y-5">{children}</div>
        </div>
      </div>
    </section>
  )
}

/** Términos con su definición, en filas separadas por una línea fina. Un
 *  `<dl>`: es literalmente una lista de términos con su definición, y un
 *  extractor conserva la relación. */
export function Terminos({ filas, className = 'mt-12 md:mt-14' }: { filas: [string, ReactNode][]; className?: string }) {
  return (
    <dl className={className}>
      {filas.map(([termino, definicion]) => (
        <div key={termino} className="hairline py-7 md:grid md:grid-cols-[15rem_1fr] md:gap-10">
          <dt className="text-lg md:text-xl font-600 tracking-[-0.015em] text-void">{termino}</dt>
          <dd className={`mt-2 md:mt-0.5 max-w-prose ${cuerpo}`}>{definicion}</dd>
        </div>
      ))}
    </dl>
  )
}

/** La única llamada a la acción de una pieza, sobre su cierre oscuro.
 *
 *  Desde el 22-sep pinta el `CtaFlecha`, y es el ÚNICO sitio donde se decide
 *  eso para los cierres oscuros: la Home, `/sobre-velia` y las piezas de
 *  `/ai-search` pasan por aquí, así que cambian las cuatro a la vez y no hay
 *  una que se quede con la píldora anterior. */
export function CtaSobreOscuro({ ubicacion }: { ubicacion: string }) {
  return (
    <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      <CtaFlecha
        href={CTA_CONTACTO.href}
        etiqueta={CTA_CONTACTO.label}
        evento="final_contacto_click"
        propiedades={{ cta_location: ubicacion }}
        sobre="oscuro"
      />
      <p className="text-[13px] text-cream/70">{CONTACTO_MICROCOPY}</p>
    </div>
  )
}

/**
 * Lo que se hizo en esta misma web, con las tres naturalezas separadas.
 *
 * `<dl>` y no tres párrafos: la relación término → descripción es exactamente
 * lo que es, y un extractor la conserva. No es `<aside>` a propósito: algunos
 * extractores descartan los `aside` como contenido secundario, y esto es la
 * evidencia de la página, no un adorno.
 *
 * «Decisión» es el único rótulo en Iris: la dirección reserva ese color para
 * VELIA actuando o pensando, y una decisión es exactamente eso.
 */
export function EnNuestraWeb({ hecho, decision, interpretacion }: { hecho: ReactNode; decision: ReactNode; interpretacion: ReactNode }) {
  const filas: { termino: string; texto: ReactNode; iris?: boolean }[] = [
    { termino: 'Hecho', texto: hecho },
    { termino: 'Decisión', texto: decision, iris: true },
    { termino: 'Interpretación', texto: interpretacion },
  ]
  return (
    <div className="!mt-10 rounded-lg border border-mist bg-white px-6 py-7 md:px-8">
      <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">En veliacorp.com</p>
      <dl className="mt-5 space-y-5">
        {filas.map(f => (
          <div key={f.termino} className="md:grid md:grid-cols-[8.5rem_1fr] md:gap-6">
            <dt className={`text-[11px] font-600 tracking-[0.06em] uppercase pt-1 ${f.iris ? 'text-gold-ink' : 'text-void/65'}`}>
              {f.termino}
            </dt>
            <dd className="mt-1.5 md:mt-0 max-w-prose text-[15px] leading-[1.6] text-void/75">{f.texto}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Código en línea, sin inventar un estilo nuevo. */
export const C = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-mist px-1.5 py-0.5 text-[0.9em] text-void">{children}</code>
)

/**
 * La firma: autoría de la organización y fechas. Sin fecha de publicación
 * mientras la pieza no se haya publicado (`publicada: null`): sólo la de
 * revisión, que sí es un hecho.
 */
export function Firma({ publicada, revisada }: { publicada: string | null; revisada: string }) {
  return (
    <p className="mt-8 text-[13px] text-void/65">
      Por el equipo de VELIA ·{' '}
      {publicada ? (
        <>
          <time dateTime={publicada}>{fechaLarga(publicada)}</time>
          {revisada !== publicada && (
            <>
              {' '}· revisada el <time dateTime={revisada}>{fechaLarga(revisada)}</time>
            </>
          )}
        </>
      ) : (
        <>
          revisada el <time dateTime={revisada}>{fechaLarga(revisada)}</time>
        </>
      )}
    </p>
  )
}

/** Las fuentes consultadas: las mismas URL que el JSON-LD declara como
 *  `citation`, de una sola lista. */
export function Fuentes({ fuentes, consultadas }: { fuentes: readonly Fuente[]; consultadas: string }) {
  return (
    <section id="fuentes" aria-labelledby="t-fuentes" className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-20 scroll-mt-24">
      <h2 id="t-fuentes" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void">
        Fuentes
      </h2>
      <p className={`mt-5 max-w-prose ${cuerpo}`}>
        Documentación oficial consultada el <time dateTime={consultadas}>{fechaLarga(consultadas)}</time>.
        Los proveedores la actualizan; conviene comprobarla antes de tomar una decisión que
        dependa de ella.
      </p>
      <ol className="mt-6 space-y-1 max-w-prose">
        {fuentes.map(f => (
          <li key={f.href}>
            <a
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1.5 text-[15px] font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
            >
              {f.texto}
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
