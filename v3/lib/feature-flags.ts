/**
 * Feature flags centralizados de la web pública.
 *
 * Cambiar un flag aquí basta — nunca condicionar renders con booleans sueltos
 * repartidos por componentes. `false` por defecto en todo lo que dependa de
 * un acuerdo, dato o verificación que aún no existe.
 */

export const FEATURE_FLAGS = {
  /** Financiación de la anualidad. Requiere acuerdo firmado con entidad colaboradora
   *  (tipo, plazo, TAE y comisiones conocidos) antes de activar. */
  ENABLE_ANNUAL_FINANCING: false,

  /** Programa Fundadores/Pioneros visible en precios y home. */
  ENABLE_FOUNDERS_PROGRAM: true,

  /** Pricing público visible sin pedir demo primero. */
  ENABLE_PUBLIC_PRICING: true,

  /** Logos de clientes en la web. Requiere autorización expresa por cliente. */
  ENABLE_CUSTOMER_LOGOS: false,

  /** Vídeo testimonio del piloto (Cónsul Jurídico). Ver TESTIMONIAL_VIDEO en constants.ts. */
  ENABLE_PILOT_TESTIMONIAL: false,

  /** Prueba gratuita real y funcional (hoy: 15 días, ver TRIAL_URL en Nav). */
  ENABLE_FREE_TRIAL: true,

  /** Checkout directo sin pasar por demo/cualificación. */
  ENABLE_DIRECT_CHECKOUT: false,

  /** Demo interactiva embebida y enlazada. */
  ENABLE_INTERACTIVE_DEMO: true,

  /** Bloque del caso piloto (Cónsul Jurídico). Requiere autorización del despacho. */
  ENABLE_CUSTOMER_CASE: true,

  /** Cifras del despacho piloto. FALSE hasta que existan métricas de USO DEL
   *  PRODUCTO auditables: las que había eran de captación de clientes y su única
   *  fuente citada no era verificable. Ver CLAIMS.pilotMetrics. */
  ENABLE_CUSTOMER_METRICS: false,

  /** Bloque de contacto para bufetes grandes (migraciones, integraciones). */
  ENABLE_ENTERPRISE_CONTACT: true,

  /** Sección propia de app móvil en la home. FALSE: competía en importancia con
   *  el Cerebro VELIA y el pricing. La capacidad se cuenta en /legal. */
  ENABLE_MOBILE_APP_SECTION: false,

  /**
   * Vídeo de archivo del despacho en el hero.
   *
   * FALSE desde el 29-jul. El 24-jul se decidió lo contrario —vídeo de un bufete,
   * no capturas— pero el encargo de optimización pide en tres puntos distintos
   * que el hero enseñe el PRODUCTO (§10, §31 y §41), y prohíbe expresamente el
   * material de archivo con abogados.
   *
   * Es una decisión reversible: poner `true` devuelve el vídeo. El componente
   * `HeroVideo`, el archivo y la ruta `/api/hero-video` siguen intactos.
   */
  ENABLE_HERO_VIDEO: false,

  /* ── Upgrade «Quiet Intelligence in Motion» (1-ago-2026) ──────────────────
     Cada pieza interactiva nueva tiene su bandera para poder apagarla SIN que
     la narrativa se rompa: al desactivarla queda su equivalente estático, no
     un hueco. Es el requisito §31 del encargo y también sentido común — una
     sección que solo existe animada es una sección que se cae con el JS.     */

  /** Escenario de contexto animado del hero. `false` → captura estática. */
  ENABLE_INTERACTIVE_HERO: true,

  /** Mapa de contexto explorable. `false` → la sección no se pinta (su idea la
   *  recoge igualmente el titular del Cerebro VELIA). */
  ENABLE_CONTEXT_MAP: true,

  /** «Un día con VELIA». `false` → vuelve la rejilla de módulos. */
  ENABLE_DAY_TIMELINE: true,

  /** Comparación Antes / Con VELIA dentro del caso real. */
  ENABLE_BEFORE_AFTER: true,

  /** Selector mensual/anual en el precio de la home. `false` → precio mensual
   *  fijo, como estaba antes del 1-ago. */
  ENABLE_PRICING_SELECTOR: true,
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS
