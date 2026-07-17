/**
 * Constantes compartidas de la web pública.
 *
 * FOUNDERS_SEATS es la ÚNICA fuente de verdad de las plazas del Programa
 * Fundadores en toda la web (home + precios). Cuando firme un Fundador nuevo,
 * actualizar `left` aquí y redesplegar — nada más que tocar.
 */

export const FOUNDERS_SEATS = { total: 5, left: 4 } as const

export const FOUNDERS_SEATS_LABEL = `${FOUNDERS_SEATS.left} de ${FOUNDERS_SEATS.total} plazas` as const

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
