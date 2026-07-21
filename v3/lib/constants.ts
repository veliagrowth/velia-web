/**
 * Constantes compartidas de la web pública.
 *
 * Los precios y las plazas del Programa Fundadores viven en `lib/pricing.ts`
 * (SSoT única). Se re-exporta FOUNDERS_SEATS_LABEL aquí por compatibilidad con
 * los imports existentes.
 */

export { FOUNDERS_SEATS_LABEL, FOUNDERS, PRICING, ANNUAL_SAVING, ANNUAL_FREE_MONTHS, eur } from './pricing'

export const SITE_URL = 'https://veliacorp.com'
export const APP_URL = 'https://app.veliacorp.com'
export const CONTACT_EMAIL = 'admin@veliacorp.com'

// Sección de vídeo testimonio (Iván Cónsul): oculta hasta tener el vídeo grabado.
// Al recibir el máster: subirlo a /public/videos/, poner la ruta aquí y activar.
export const TESTIMONIAL_VIDEO: { enabled: boolean; src: string; poster: string } = {
  enabled: false,
  src: '/videos/testimonio-ivan-consul.mp4',
  poster: '/videos/testimonio-ivan-consul-poster.jpg',
}
