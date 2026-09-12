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
 * `/sobre-velia` se queda: sigue siendo una pagina de la compania —aunque hable
 * como la etapa anterior— y esta marcada REWRITE para la etapa 2. Sacarla ahora
 * la dejaria sin sustituto.
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
