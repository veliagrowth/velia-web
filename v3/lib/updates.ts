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
 * Resultado de pedir el feed. NO es un array.
 *
 * ── POR QUÉ CAMBIÓ LA FIRMA (18-sep-2026) ──────────────────────────────────
 * `fetchUpdates()` devolvía `[]` en TRES situaciones que no significan lo mismo:
 * la red falló, el feed respondió con un código de error, o el feed respondió
 * perfectamente y no había nada que contar. La página recibía el mismo `[]` en
 * los tres casos y enseñaba «Ahora mismo no podemos cargar las novedades».
 *
 * Es decir: el día que el tablón esté legítimamente vacío, la web declara una
 * avería que no existe. Y al revés — si mañana el feed se cae, se lee igual que
 * un tablón vacío, así que nadie sabrá distinguirlo. Un cero no es un estado:
 * hay que preguntarle qué significa.
 *
 * Ahora son dos estados explícitos y la página los pinta distinto:
 *   'ok'          la fuente contestó. `updates` puede venir vacío, y eso es una
 *                 ausencia legítima, no un fallo.
 *   'sin_fuente'  no se pudo leer la fuente. No se sabe si hay novedades.
 *
 * FALLO SEGURO: la página sigue sin romperse en ningún caso.
 *
 * 10 minutos de caché (no una hora): publicar un anuncio desde /admin/novedades y
 * no verlo en la web hasta 60 minutos después hace dudar de si se publicó bien.
 * Sigue siendo cero coste por visita.
 */
export type UpdatesResult =
  | { estado: 'ok'; updates: ProductUpdate[] }
  | { estado: 'sin_fuente'; updates: [] }

export async function fetchUpdates(): Promise<UpdatesResult> {
  try {
    const res = await fetch(`${APP_URL}/api/public/novedades`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return { estado: 'sin_fuente', updates: [] }
    const json = (await res.json()) as { updates?: ProductUpdate[] }
    /* Un cuerpo sin `updates`, o con algo que no es una lista, NO es un tablón
       vacío: es una respuesta que no cumple el contrato. Va al cajón correcto. */
    if (!Array.isArray(json.updates)) return { estado: 'sin_fuente', updates: [] }
    return { estado: 'ok', updates: json.updates }
  } catch {
    return { estado: 'sin_fuente', updates: [] }
  }
}


/** Separa el tablón en sus dos carriles: compañía y producto. */
export function splitUpdates(updates: ProductUpdate[]) {
  const company = updates.filter(u => u.audience === 'empresa' || u.category === 'anuncio')
  const product = updates.filter(u => !(u.audience === 'empresa' || u.category === 'anuncio'))
  return { company, product }
}
