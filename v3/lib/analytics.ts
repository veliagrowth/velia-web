import { track } from '@vercel/analytics'

/**
 * Eventos de conversión de la web pública — nombres fijos, un solo sitio de
 * verdad. Nunca incluir datos personales (email, teléfono, nombre) en las
 * propiedades: solo metadata de contexto (ubicación del CTA, modo de billing…).
 */
export type AnalyticsEvent =
  | 'nav_demo_click'
  | 'login_click'
  | 'hero_demo_click'
  | 'hero_product_video_play'
  | 'product_demo_click'
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

export function trackEvent(name: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  track(name, properties)
}
