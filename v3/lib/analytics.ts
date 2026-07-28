/**
 * Eventos de conversión de la web pública — nombres fijos, un solo sitio de
 * verdad. Nunca incluir datos personales (email, teléfono, nombre) en las
 * propiedades: solo metadata de contexto (ubicación del CTA, modo de billing…).
 *
 * DÓNDE VAN (28-jul-2026): a VELIA, no a un tercero. Hasta hoy esto llamaba al
 * SDK de analítica del hosting anterior; al salir de él, el 22-jul, su
 * componente dejó de montarse y `track()` pasó a encolar en memoria y perderlo
 * todo — sin error y sin aviso. Una semana entera discutiendo el pricing con un
 * embudo vacío que parecía real.
 *
 * Cloudflare Web Analytics (activo, cookieless) sigue cubriendo páginas vistas y
 * Core Web Vitals; lo que no sabe hacer son eventos propios, así que estos van a
 * `/api/public/web-analytics` del portal → tabla `velia_web_events`.
 *
 * SIN ALMACENAR NADA EN EL DISPOSITIVO: el identificador de sesión vive en
 * memoria del módulo, así que muere al cerrar la pestaña y no hay cookie ni
 * localStorage. Por eso la web sigue sin necesitar banner de consentimiento.
 */

const ENDPOINT = 'https://app.veliacorp.com/api/public/web-analytics'

export type AnalyticsEvent =
  | 'nav_demo_click'
  | 'login_click'
  | 'hero_demo_click'
  | 'hero_trial_click'
  | 'hero_product_video_play'
  | 'product_demo_click'
  | 'demo_iframe_loaded'
  | 'demo_iframe_manual_load'
  | 'onboarding_start_click'
  | 'footer_cta_trial_click'
  | 'brain_section_view'
  | 'pricing_section_view'
  | 'pricing_toggle_monthly'
  | 'pricing_toggle_annual'
  | 'pricing_monthly_demo_click'
  | 'pricing_annual_demo_click'
  | 'founders_program_view'
  | 'founders_program_click'
  | 'demo_form_start'
  | 'demo_form_error'
  | 'demo_form_submit'
  | 'scroll_50'
  | 'scroll_90'

/** Identificador de la pestaña actual: permite encadenar el recorrido de una
 *  visita (vio precios → pulsó demo) sin saber quién es ni recordarlo después. */
let sesion: string | null = null
function idDeSesion(): string {
  if (!sesion) sesion = Math.random().toString(36).slice(2, 12)
  return sesion
}

export function trackEvent(name: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return

  const cuerpo = JSON.stringify({
    event: name,
    path: window.location.pathname,
    // Solo el dominio de procedencia: de dónde vino la visita, no qué buscó.
    referrer: origenDe(document.referrer),
    session_id: idDeSesion(),
    props: properties ?? {},
  })

  try {
    // `sendBeacon` sobrevive a la navegación que suele venir justo después de un
    // clic — con `fetch` se perderían justo los eventos de conversión, que son
    // los que importan. text/plain a propósito: evita la petición previa de CORS.
    const blob = new Blob([cuerpo], { type: 'text/plain;charset=UTF-8' })
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, blob)) return
    fetch(ENDPOINT, { method: 'POST', body: cuerpo, keepalive: true, mode: 'cors' }).catch(() => {})
  } catch {
    /* la analítica jamás puede romper la web */
  }
}

function origenDe(referrer: string): string {
  if (!referrer) return ''
  try {
    const u = new URL(referrer)
    return u.hostname === window.location.hostname ? '' : u.hostname
  } catch {
    return ''
  }
}
