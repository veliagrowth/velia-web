import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchUpdates, CATEGORY_STYLE, formatUpdateDate } from '@/components/LiveUpdates'

export const metadata: Metadata = {
  title: 'Novedades — VELIA',
  description:
    'Todo lo que VELIA incorpora al software de los despachos, semana a semana: novedades, mejoras y seguridad, con su fecha.',
  alternates: { canonical: 'https://veliacorp.com/novedades' },
}

// El feed público se cachea 1h (revalidate en fetchUpdates); suficiente frescura
// para un changelog y cero coste por visita.

export default async function NovedadesPage() {
  const updates = await fetchUpdates()

  return (
    <section className="mx-auto max-w-3xl px-6 pt-20 md:pt-28 pb-20">
      <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-6">
        Producto vivo
      </p>
      <h1 className="text-4xl md:text-5xl font-800 leading-[1.08] tracking-[-0.03em]">
        En qué está trabajando VELIA.
      </h1>
      <p className="mt-6 text-lg text-void/60 leading-relaxed max-w-prose">
        VELIA no es un software congelado: cada semana incorpora mejoras que todos los
        despachos reciben sin hacer nada. Esta es la lista, con fechas reales.
      </p>

      {updates.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-void/10 bg-white p-10">
          <p className="text-sm text-void/60 leading-[1.6]">
            Ahora mismo no podemos cargar las novedades. Vuelve en un rato o{' '}
            <Link href="/contacto" className="underline">escríbenos</Link> y te contamos
            en qué estamos trabajando.
          </p>
        </div>
      ) : (
        <ol className="mt-14 relative border-l border-void/15 ml-1.5">
          {updates.map(u => {
            const cat = CATEGORY_STYLE[u.category] ?? CATEGORY_STYLE.novedad
            return (
              <li key={u.id} className="relative pl-8 pb-10 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold" aria-hidden />
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-700 tracking-[0.08em] uppercase ${cat.cls}`}>
                    {cat.label}
                  </span>
                  <span className="text-[11px] text-void/40">{formatUpdateDate(u.published_at)}</span>
                </div>
                <h2 className="mt-3 text-lg font-700 leading-snug">{u.title}</h2>
                <p className="mt-2 text-sm text-void/60 leading-[1.6] max-w-prose">{u.body}</p>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
