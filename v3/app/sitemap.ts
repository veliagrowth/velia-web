import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

/**
 * REWORK 2026 — las rutas de la etapa SaaS salen del sitemap.
 *
 * `/precios`, `/demo`, `/fundadores` y `/legal` **siguen vivas y respondiendo
 * 200**: no se ha roto ningun enlace, ningun favorito ni ningun correo ya
 * enviado. Lo que dejan de hacer es proponerse como la arquitectura vigente del
 * sitio, que es justo lo que un sitemap declara.
 *
 * Quitar una ruta del sitemap NO la desindexa y NO la penaliza: deja de
 * ofrecerse. La decision definitiva sobre cada una se toma en la etapa 3, y no
 * antes de tener trafico real por ruta, que esta indexado, que enlaces
 * entrantes existen y cuantos correos llevan el enlace a /demo dentro.
 * Inventario: velia-core/docs/design/VELIA_WEB_LEGACY_INVENTORY_2026.md
 *
 * ── ACTUALIZADO EN LA FASE 0 (19-sep-2026) ──────────────────────────────────
 * Las cuatro llevan AHORA ADEMAS `noindex, follow` en su propia metadata. Este
 * comentario decia solo la mitad: salir del sitemap deja de ofrecerlas, pero no
 * pide su retirada del indice. Hacian falta las dos cosas y ya estan las dos.
 * Siguen respondiendo 200 y siguen sin borrarse.
 *
 * ── POR QUE /terminos Y /privacidad SE QUEDAN AQUI ──────────────────────────
 * Las dos describen «prueba gratuita», «planes y precios» y «los datos de tu
 * despacho»: 1.343 palabras en el sitemap que cuentan la etapa anterior. Y aun
 * asi NO salen, por tres motivos:
 *
 *   1. Son obligacion legal y estan enlazadas desde el pie de todas las
 *      paginas. Alguien que busca los terminos de VELIA tiene derecho a
 *      encontrarlos.
 *   2. Sacarlas del sitemap NO las desindexa —siguen enlazadas y en 200—, asi
 *      que el gesto no resolveria el problema de entidad y si reduciria su
 *      descubribilidad legitima. Seria un cambio cosmetico con coste real.
 *   3. Lo que hay que corregir es su TEXTO, y eso es una decision juridica con
 *      efectos, no una decision de arquitectura. HUMAN_DECISION.
 *
 * La separacion que importa: el texto juridico es de quien responde de el; su
 * presencia en las senales de descubrimiento es de esta capa. Son separables, y
 * aqui solo se decide la segunda.
 *
 * `/sobre-velia` se queda: es una pagina de la compania, ya reescrita en la
 * etapa 2.
 *
 * ⚠️ `/seguridad` SALE tambien (12-sep). No por ser legacy —no lo es, es
 * REWRITE— sino porque publica DOS claims que `verified-claims.ts` marca
 * `pending`: «conforme a Verifactu» y el alojamiento en la UE. Proponersela a
 * un buscador es pedir activamente que se indexe una afirmacion regulatoria sin
 * respaldo.
 *
 * Esto REDUCE la exposicion; NO resuelve nada. La pagina sigue viva y sigue
 * publicando los dos claims, y las dos paginas legales que la enlazan
 * (privacidad e ia-responsable) la siguen enlazando, porque ese camino es
 * obligacion legal y no se toca. La decision sobre los claims es de Joaquin y
 * esta declarada en `scripts/deuda-claims-publicados.json`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; priority: number }> = [
    { path: '/', priority: 1 },
    { path: '/contacto', priority: 0.9 },
    { path: '/sobre-velia', priority: 0.7 },
    { path: '/novedades', priority: 0.6 },
    { path: '/aviso-legal', priority: 0.2 },
    { path: '/ia-responsable', priority: 0.4 },
    { path: '/privacidad', priority: 0.2 },
    { path: '/cookies', priority: 0.2 },
    { path: '/terminos', priority: 0.2 },
  ]
  return pages.map(p => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.path === '/novedades' ? 'weekly' : 'monthly',
    priority: p.priority,
  }))
}
