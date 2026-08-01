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

/**
 * Un solo nombre por acción. Antes había cuatro eventos distintos para el mismo
 * clic de prueba gratuita (`hero_trial_click`, `onboarding_start_click`,
 * `footer_cta_trial_click`, `pricing_*_demo_click`) y ninguno se podía sumar con
 * otro: el embudo no se dejaba leer. Ahora la ubicación va en `cta_location`, no
 * en el nombre del evento.
 */
export type AnalyticsEvent =
  // Navegación
  | 'nav_demo_click'
  | 'login_click'
  | 'header_trial_click'
  // Hero
  | 'hero_trial_click'
  | 'hero_demo_click'
  | 'hero_video_play'
  /** Alguien tocó el escenario de contexto del hero (pausa, reinicio, enfocar
   *  una tarjeta). Mide si la pieza interactiva se usa o solo se mira. */
  | 'hero_context_interaction'
  // Interacción de las secciones nuevas (upgrade 1-ago)
  | 'context_node_select'
  | 'brain_state_select'
  | 'day_timeline_step'
  | 'product_tab_select'
  | 'case_toggle'
  // Demo
  | 'demo_open'
  | 'demo_fullscreen_open'
  | 'demo_trial_click'
  | 'demo_iframe_loaded'
  | 'demo_iframe_manual_load'
  // Secciones vistas
  | 'brain_section_view'
  | 'product_section_view'
  | 'case_study_view'
  | 'pricing_section_view'
  | 'founders_view'
  // Interacción de contenido
  | 'product_detail_click'
  | 'security_click'
  // Precio
  | 'pricing_monthly_select'
  | 'pricing_annual_select'
  | 'pricing_trial_click'
  // Fundadores
  | 'founders_terms_click'
  | 'founders_trial_click'
  // Empresa
  | 'enterprise_contact_click'
  // Cierre
  | 'final_trial_click'
  | 'final_demo_click'
  // Profundidad de lectura
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
