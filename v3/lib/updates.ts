import { APP_URL } from '@/lib/constants'

/**
 * Fuente única del tablón de novedades de veliacorp.com.
 *
 * Un solo feed público (`/api/public/novedades` del portal) con DOS naturalezas
 * de contenido, distinguidas por `audience`:
 *  - 'empresa'      → anuncios de COMPAÑÍA.
 *  - 'all'|'legal'  → changelog de PRODUCTO: lo que ya tienen los clientes.
 *
 * ⚠️ NINGUNA DE LAS DOS ES «PÚBLICA» POR SÍ SOLA (20-sep-2026). Esa lectura es
 * la que tenía esta web —publicaba las dos, tal cual llegaran— y la decisión de
 * producto es la contraria: una novedad nace interna, llegar al panel de un
 * cliente es un acto explícito y llegar a la web pública es otro. `all`
 * significa «todos los clientes», no «todo el mundo». Ver `AUDIENCIA_PUBLICA`
 * más abajo: el filtro niega por defecto.
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

/**
 * La audiencia que autoriza a publicar una entrada EN LA WEB PÚBLICA.
 *
 * Negación por defecto: **si una entrada no está marcada explícitamente como
 * pública, no se publica**. Medido el 20-sep, el feed traía 13 entradas con
 * `audience` ∈ {`legal`, `empresa`, `all`} —segmentos de CLIENTE del producto
 * anterior—, todas fechadas en julio de 2026 y todas publicadas aquí sin que
 * nadie hubiera decidido publicarlas. Entre ellas, el Programa Fundadores con
 * su precio de lanzamiento, que es la oferta del modelo descontinuado.
 *
 * ⚠️ DEPENDENCIA DE velia-portal: hoy ninguna entrada trae este valor, así que
 * el tablón público queda vacío — y eso es lo correcto mientras el portal no
 * tenga la acción «publicar en la web». Cuando la tenga, basta con que emita
 * este valor, o con cambiar esta constante si allí se llama de otra forma.
 * Desde aquí no se borra, no se reescribe y no se reordena ni una entrada: el
 * SSoT sigue siendo el portal, y el histórico se queda donde está.
 */
export const AUDIENCIA_PUBLICA = 'publica'

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
    /* La fuente contestó: el estado es `ok` aunque no quede ninguna entrada al
       filtrar. Un tablón público vacío es una ausencia legítima, no una avería,
       y la página las pinta distinto. */
    return { estado: 'ok', updates: json.updates.filter(u => u.audience === AUDIENCIA_PUBLICA) }
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
