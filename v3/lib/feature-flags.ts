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
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS
