import Link from 'next/link'
import { APP_URL } from '@/lib/constants'

/**
 * Sección "producto vivo" de la home: últimas novedades publicadas del producto,
 * leídas del feed público del portal (audience=all, contenido ya publicado).
 * FALLO SEGURO: si el feed no responde o viene vacío, la sección no se renderiza —
 * la home nunca se rompe ni muestra un hueco por culpa del feed.
 */

export type ProductUpdate = {
  id: string
  title: string
  body: string
  category: 'novedad' | 'mejora' | 'seguridad' | 'correccion'
  icon: string | null
  published_at: string
}

export const CATEGORY_STYLE: Record<ProductUpdate['category'], { label: string; cls: string }> = {
  novedad:    { label: 'Novedad',    cls: 'bg-[rgba(78,205,196,0.14)] text-[#0E8C82]' },
  mejora:     { label: 'Mejora',     cls: 'bg-[rgba(201,169,110,0.16)] text-[#9A7840]' },
  seguridad:  { label: 'Seguridad',  cls: 'bg-[rgba(108,92,231,0.14)] text-[#5B4BC4]' },
  correccion: { label: 'Corrección', cls: 'bg-[rgba(28,28,40,0.07)] text-[#1C1C28]' },
}

export function formatUpdateDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function fetchUpdates(): Promise<ProductUpdate[]> {
  try {
    const res = await fetch(`${APP_URL}/api/public/novedades`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = (await res.json()) as { updates?: ProductUpdate[] }
    return Array.isArray(json.updates) ? json.updates : []
  } catch {
    return []
  }
}

export default async function LiveUpdates() {
  const updates = await fetchUpdates()
  if (updates.length === 0) return null

  return (
    <section className="bg-white border-y border-void/10">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-600 tracking-[0.28em] uppercase text-gold-dark mb-3">
              Producto vivo
            </p>
            <h2 className="text-3xl md:text-4xl font-700 tracking-[-0.02em] max-w-[22ch]">
              VELIA mejora cada semana.
            </h2>
            <p className="mt-5 text-sm text-void/60 leading-[1.6] max-w-prose">
              No compras un software congelado: compras un equipo que lo hace crecer.
              Esto es lo último que ya tienen todos los despachos, con su fecha.
            </p>
          </div>
          <Link
            href="/novedades"
            className="text-[12px] font-700 tracking-[0.1em] uppercase text-gold-dark hover:text-void transition-colors"
          >
            Ver todas las novedades →
          </Link>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {updates.slice(0, 3).map(u => {
            const cat = CATEGORY_STYLE[u.category] ?? CATEGORY_STYLE.novedad
            return (
              <li key={u.id} className="border-t border-void/15 pt-5">
                <div className="flex items-center gap-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-700 tracking-[0.08em] uppercase ${cat.cls}`}>
                    {cat.label}
                  </span>
                  <span className="text-[11px] text-void/40">{formatUpdateDate(u.published_at)}</span>
                </div>
                <h3 className="mt-3 text-base font-700 leading-snug">{u.title}</h3>
                <p className="mt-2 text-sm text-void/60 leading-[1.6] line-clamp-3">{u.body}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
