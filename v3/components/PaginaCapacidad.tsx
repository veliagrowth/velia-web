import Link from 'next/link'
import { CtaSobreOscuro, cuerpo } from '@/components/Conocimiento'
import { capacidadPorSlug, CAPACIDADES_PAGINA } from '@/lib/capacidades'

/**
 * La pagina de una capacidad.
 *
 * ── UNA SOLA COMPOSICION PARA LAS TRES ────────────────────────────────────
 * Las tres paginas nuevas comparten este componente y se diferencian solo en
 * sus datos. Tres ficheros casi identicos habrian divergido en el segundo
 * cambio: uno con el aire corregido y los otros dos sin corregir.
 *
 * ── POR QUE NO ES EL MISMO LAYOUT QUE /ai-search ──────────────────────────
 * Aquella es un HUB: reparte hacia dos piezas propias y cita fuentes de
 * terceros con su fecha de consulta, porque afirma cosas sobre buscadores y
 * sistemas de IA que no son de VELIA. Estas describen UN SERVICIO DE VELIA: no
 * hay fuente externa que citar ni piezas hijas a las que repartir, y montarles
 * un bloque de «Fuentes» vacio seria decoracion con forma de rigor.
 *
 * Lo que si se comparte es el sistema tipografico —`cuerpo`, los rotulos de 11
 * px, el cierre oscuro con `CtaSobreOscuro`—, para que las cinco paginas de
 * conocimiento se lean como la misma web.
 *
 * ── SIN `Reveal` ──────────────────────────────────────────────────────────
 * Igual que las piezas de conocimiento: nada de esta pagina existe solo
 * animado. Se lee entera sin JavaScript.
 */
export default function PaginaCapacidad({ slug }: { slug: string }) {
  const c = capacidadPorSlug(slug)
  if (!c) return null
  const otras = CAPACIDADES_PAGINA.filter(x => x.slug !== slug)

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 md:px-10 pt-14 md:pt-20 pb-12 md:pb-16">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">{c.nombre}</p>
        <h1 className="mt-5 text-[clamp(1.9rem,4.2vw,3.1rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[24ch]">
          {c.titular}
        </h1>
        <div className="mt-7 space-y-4">
          {c.queEs.map(p => (
            <p key={p} className={cuerpo}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-mist">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-14 md:py-20 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-x-16">
          <div>
            <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
              Qué cambia
            </p>
            <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2.1rem)] font-600 tracking-[-0.02em] leading-[1.15] text-void max-w-[18ch]">
              Para el negocio, no para el departamento de tecnología.
            </h2>
          </div>
          <ul className="mt-8 md:mt-0 space-y-5">
            {c.queCambia.map(x => (
              <li key={x} className="hairline pb-5 last:pb-0">
                <p className="text-[15px] md:text-base leading-[1.6] text-void/75 max-w-prose">{x}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 md:px-10 py-14 md:py-20">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
          Cómo lo trabajamos
        </p>
        <ol className="mt-8 space-y-8 md:space-y-10">
          {c.comoSeTrabaja.map((x, i) => (
            <li key={x} className="grid gap-x-8 gap-y-2 md:grid-cols-[auto_1fr]">
              <span className="indice text-slate" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className={cuerpo}>{x}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 md:mt-16 hairline pt-8">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">Qué incluye</p>
          <p className="mt-3 text-[15px] leading-[1.7] text-void/70">{c.incluye.join(' · ')}</p>
        </div>
      </section>

      <section className="velia-dark-stage bg-void text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85">
            Qué queda funcionando
          </p>
          <p className="mt-5 text-[clamp(1.4rem,2.8vw,2.2rem)] font-500 tracking-[-0.02em] leading-[1.25] text-cream max-w-[26ch]">
            {c.resultado}
          </p>
          <CtaSobreOscuro ubicacion={`capacidad_${c.slug}`} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 md:px-10 py-14 md:py-20">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
          Las otras capacidades
        </p>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {otras.map(o => (
            <li key={o.slug}>
              <Link
                href={`/${o.slug}`}
                className="enlace-flecha block text-[15px] font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
              >
                {o.nombre}
                <span className="enlace-flecha__flecha ml-1 no-underline" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/ai-search"
              className="enlace-flecha block text-[15px] font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
            >
              AI Search &amp; Digital Visibility
              <span className="enlace-flecha__flecha ml-1 no-underline" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </>
  )
}
