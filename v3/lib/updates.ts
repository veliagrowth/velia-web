import { APP_URL } from '@/lib/constants'

/**
 * Fuente única del tablón de novedades de veliacorp.com.
 *
 * Un solo feed público (`/api/public/novedades` del portal) con DOS naturalezas
 * de contenido, distinguidas por `audience`:
 *  - 'empresa'      → anuncios de COMPAÑÍA: lanzamientos de vertical, cierre del
 *                     Programa Fundadores, notas de prensa. Solo web pública.
 *  - 'all'|'legal'  → changelog de PRODUCTO: lo que ya tienen los despachos.
 *
 * Antes esto vivía en components/LiveUpdates.tsx (sección de la home). La home ya
 * no lo muestra (Joaquín, 25-jul) y el tablón pasó a ser la página /novedades.
 */

export type UpdateCategory = 'novedad' | 'mejora' | 'seguridad' | 'correccion' | 'anuncio'

export type ProductUpdate = {
  id: string
  title: string
  body: string
  category: UpdateCategory
  icon: string | null
  published_at: string
  audience: string
  link: string | null
}

/* Colores de texto de "novedad" y "mejora" oscurecidos frente al tono base de
   marca (Signal #B5DFFF / Gold #4C51B9): a 10px sobre su propio fondo tintado
   daban 3.76:1 / 3.64:1 (fallan AA 4.5:1, cazado por Lighthouse). */
export const CATEGORY_STYLE: Record<UpdateCategory, { label: string; cls: string }> = {
  novedad:    { label: 'Novedad',    cls: 'bg-[rgba(181,223,255,0.14)] text-[#0b736b]' },
  mejora:     { label: 'Mejora',     cls: 'bg-[rgba(116,121,242,0.16)] text-gold-ink' },
  seguridad:  { label: 'Seguridad',  cls: 'bg-[rgba(116,121,242,0.14)] text-[#5B4BC4]' },
  correccion: { label: 'Corrección', cls: 'bg-[rgba(27,31,42,0.07)] text-[#1B1F2A]' },
  anuncio:    { label: 'Anuncio',    cls: 'bg-void text-cream' },
}

export function formatUpdateDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * FALLO SEGURO: si el feed no responde, devuelve [] y la página no se rompe.
 *
 * 10 minutos de caché (no una hora): publicar un anuncio desde /admin/novedades y
 * no verlo en la web hasta 60 minutos después hace dudar de si se publicó bien.
 * Sigue siendo cero coste por visita.
 */
export async function fetchUpdates(): Promise<ProductUpdate[]> {
  try {
    const res = await fetch(`${APP_URL}/api/public/novedades`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return []
    const json = (await res.json()) as { updates?: ProductUpdate[] }
    return Array.isArray(json.updates) ? json.updates : []
  } catch {
    return []
  }
}

/** Separa el tablón en sus dos carriles: compañía y producto. */
export function splitUpdates(updates: ProductUpdate[]) {
  const company = updates.filter(u => u.audience === 'empresa' || u.category === 'anuncio')
  const product = updates.filter(u => !(u.audience === 'empresa' || u.category === 'anuncio'))
  return { company, product }
}
