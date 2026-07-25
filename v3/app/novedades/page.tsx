import type { Metadata } from 'next'
import Link from 'next/link'
import {
  fetchUpdates,
  splitUpdates,
  CATEGORY_STYLE,
  formatUpdateDate,
} from '@/lib/updates'

export const metadata: Metadata = {
  title: 'Novedades y anuncios — VELIA',
  description:
    'El tablón de VELIA: anuncios de la compañía, lanzamientos y notas de prensa, más todo lo que incorporamos al software de los despachos, semana a semana y con su fecha.',
  alternates: { canonical: 'https://veliacorp.com/novedades' },
}

// El feed público se cachea 1h (revalidate en fetchUpdates); suficiente frescura
// para un tablón y cero coste por visita.

export default async function NovedadesPage() {
  const updates = await fetchUpdates()
  const { company, product } = splitUpdates(updates)

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-20 md:pt-28">
        <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-ink mb-6">
          Novedades y anuncios
        </p>
        <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em]">
          <span className="inline-block">Lo que hace VELIA,</span>{' '}
          <span className="inline-block">contado con fechas.</span>
        </h1>
        <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
          Aquí publicamos los anuncios de la compañía y cada mejora que llega al software.{' '}
          <span className="inline-block">Sin humo: lo que ya está funcionando.</span>
        </p>
      </section>

      {/* ── Compañía: lanzamientos, hitos, notas de prensa ─────────────────── */}
      {company.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pt-16 md:pt-20">
          <div className="flex items-end justify-between gap-6 border-b border-void/15 pb-4">
            <h2 className="text-[11px] font-700 tracking-[0.28em] uppercase text-void/60">
              La compañía
            </h2>
            <span className="text-[11px] text-void/40">
              {company.length} {company.length === 1 ? 'anuncio' : 'anuncios'}
            </span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {company.map((u, i) => (
              <article
                key={u.id}
                /* El anuncio más reciente ocupa el ancho completo: jerarquía real en
                   la parrilla, no una rejilla de tarjetas idénticas. */
                className={`rounded-2xl border border-void/12 bg-white p-7 md:p-8 ${i === 0 ? 'md:col-span-2' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-700 tracking-[0.08em] uppercase ${CATEGORY_STYLE.anuncio.cls}`}>
                    {CATEGORY_STYLE.anuncio.label}
                  </span>
                  <span className="text-[11px] text-void/60">{formatUpdateDate(u.published_at)}</span>
                </div>
                <h3 className={`mt-4 font-700 leading-snug tracking-[-0.01em] ${i === 0 ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                  {u.title}
                </h3>
                <p className={`mt-3 text-void/65 leading-[1.6] max-w-prose ${i === 0 ? 'text-[15px]' : 'text-sm'}`}>
                  {u.body}
                </p>
                {u.link && (
                  <a
                    href={u.link}
                    className="mt-5 inline-block text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors"
                  >
                    Leer más →
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Producto: el changelog que ya tienen los despachos ─────────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-16 md:pt-20 pb-20">
        <div className="flex items-end justify-between gap-6 border-b border-void/15 pb-4">
          <h2 className="text-[11px] font-700 tracking-[0.28em] uppercase text-void/60">
            El software
          </h2>
          <span className="text-[11px] text-void/40">Actualizaciones de VELIA Legal</span>
        </div>

        {product.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-void/10 bg-white p-10">
            <p className="text-sm text-void/60 leading-[1.6]">
              Ahora mismo no podemos cargar las novedades del software. Vuelve en un rato o{' '}
              <Link href="/contacto" className="underline">escríbenos</Link> y te contamos
              en qué estamos trabajando.
            </p>
          </div>
        ) : (
          <ol className="mt-12 relative border-l border-void/15 ml-1.5">
            {product.map(u => {
              const cat = CATEGORY_STYLE[u.category] ?? CATEGORY_STYLE.novedad
              return (
                <li key={u.id} className="relative pl-8 pb-10 last:pb-0">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold" aria-hidden />
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-700 tracking-[0.08em] uppercase ${cat.cls}`}>
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-void/60">{formatUpdateDate(u.published_at)}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-700 leading-snug">{u.title}</h3>
                  <p className="mt-2 text-sm text-void/60 leading-[1.6] max-w-prose">{u.body}</p>
                  {u.link && (
                    <a href={u.link} className="mt-3 inline-block text-[12px] font-700 tracking-[0.1em] uppercase text-gold-ink hover:text-void transition-colors">
                      Leer más →
                    </a>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </>
  )
}
