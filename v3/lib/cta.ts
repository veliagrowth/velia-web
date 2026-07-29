/**
 * SSoT de las llamadas a la acción de la web pública.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO: la auditoría del 29-jul encontró **17 CTA
 * distintos** repartidos por el sitio, y el peor efecto no era la variedad sino
 * que el botón principal de `/precios` decía «Solicitar una demo» y llevaba a
 * `/contacto`. Quien llegaba decidido a probar VELIA se encontraba un formulario.
 *
 * Regla: en toda la web solo existen TRES acciones. Si hace falta una cuarta,
 * casi siempre es que la sección está intentando hacer dos cosas a la vez.
 *
 *   1. PRIMARIA    Probar VELIA gratis     → el flujo real de alta
 *   2. SECUNDARIA  Ver demo interactiva    → la demo sin registro
 *   3. TERCIARIA   Hablar con el equipo    → solo bufetes grandes, migraciones,
 *                                            integraciones y compra corporativa
 *
 * Nunca escribir el texto de un CTA a mano en un componente: importarlo de aquí.
 */
import { APP_URL, CONTACT_EMAIL } from './constants'
import { PRICING } from './pricing'

/** Flujo de alta real. Es el destino de TODA acción primaria del sitio. */
export const TRIAL_URL = `${APP_URL}/prueba-velia`

/** Demo de solo lectura, sin registro. */
export const DEMO_URL = 'https://demo.app.veliacorp.com/'

/** Página propia que presenta la demo antes de abrirla. */
export const DEMO_PAGE = '/demo'

export const CTA = {
  primary: {
    label: 'Probar VELIA gratis',
    href: TRIAL_URL,
  },
  secondary: {
    label: 'Ver demo interactiva',
    href: DEMO_PAGE,
  },
  tertiary: {
    label: 'Hablar con el equipo',
    href: `mailto:${CONTACT_EMAIL}`,
  },
} as const

/** Microcopy bajo el CTA primario. Se calcula desde el SSoT de precios. */
export const TRIAL_MICROCOPY = `${PRICING.trialDays} días gratis · Sin tarjeta · Configuración en minutos`

/** Versión corta, para cuando el espacio no da (móvil, tarjetas). */
export const TRIAL_MICROCOPY_SHORT = `${PRICING.trialDays} días gratis · Sin tarjeta`

/**
 * Arrastra las UTM de la visita hasta la aplicación.
 *
 * Sin esto, el embudo se corta justo donde importa: la web sabe de qué campaña
 * vino el visitante y la aplicación, que es donde se convierte, no.
 *
 * Se resuelve en el cliente (el servidor no ve la query del navegador), así que
 * los componentes que lo usan son `'use client'`. Si algo falla, devuelve la URL
 * limpia: perder las UTM es un problema de medición, romper el alta es un
 * problema de negocio.
 */
export function withUtm(url: string): string {
  if (typeof window === 'undefined') return url
  try {
    const entrada = new URLSearchParams(window.location.search)
    const destino = new URL(url)
    for (const clave of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const valor = entrada.get(clave)
      if (valor) destino.searchParams.set(clave, valor)
    }
    return destino.toString()
  } catch {
    return url
  }
}
