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
 * `/seguridad` y `/sobre-velia` se quedan: siguen siendo paginas de la compania
 * —aunque hablen como la etapa anterior— y estan marcadas REWRITE para la
 * etapa 2. Sacarlas ahora las dejaria sin sustituto.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; priority: number }> = [
    { path: '/', priority: 1 },
    { path: '/contacto', priority: 0.9 },
    { path: '/sobre-velia', priority: 0.7 },
    { path: '/seguridad', priority: 0.6 },
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
