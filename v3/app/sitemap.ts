import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; priority: number }> = [
    { path: '/', priority: 1 },
    { path: '/legal', priority: 0.9 },
    { path: '/demo', priority: 0.9 },
    { path: '/precios', priority: 0.9 },
    { path: '/seguridad', priority: 0.7 },
    { path: '/contacto', priority: 0.8 },
    { path: '/sobre-velia', priority: 0.5 },
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
