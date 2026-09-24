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
/**
 * El correo del TITULAR, y sólo para las páginas legales.
 *
 * ── POR QUÉ SE LLAMA ASÍ (24-sep-2026) ────────────────────────────────────
 * Se llamaba `CONTACT_EMAIL` y, con ese nombre, acabó donde acaban siempre las
 * constantes cómodas: en el pie de TODAS las páginas, en el `email` del JSON-LD
 * del layout —o sea, en el HTML de cada ruta—, en `/contacto`, en `llms.txt` y
 * en dos páginas legacy. Un buzón interno publicado en toda la web.
 *
 * La decisión es que `admin@veliacorp.com` deja de ser información pública.
 * Sigue estando donde tiene una FUNCIÓN LEGAL: la LSSI-CE obliga a publicar un
 * medio de contacto del titular (aviso legal) y el RGPD exige el del
 * responsable del tratamiento (privacidad); cookies, términos e IA responsable
 * heredan esa misma obligación.
 *
 * El nombre es el mecanismo: quien vaya a poner un correo en una página nueva
 * se encuentra con que lo único que existe se llama `EMAIL_TITULAR_LEGAL`, y
 * eso obliga a preguntarse si esa página es legal. `scripts/check-email.mjs`
 * comprueba el resultado sobre el HTML servido, que es más fuerte que confiar
 * en el nombre.
 */
export const EMAIL_TITULAR_LEGAL = 'admin@veliacorp.com'

// Sección de vídeo testimonio (Iván Cónsul): oculta hasta tener el vídeo grabado.
// Al recibir el máster: subirlo a /public/videos/, poner la ruta aquí y activar.
export const TESTIMONIAL_VIDEO: { enabled: boolean; src: string; poster: string } = {
  enabled: false,
  src: '/videos/testimonio-ivan-consul.mp4',
  poster: '/videos/testimonio-ivan-consul-poster.jpg',
}
