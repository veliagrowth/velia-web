/**
 * SSoT de precios de la web pública — modelo Axel (decidido 2026-07-21).
 * Plan único "VELIA Despacho": 99€/mes, anual con 2 meses gratis. Programa
 * Fundadores = mismo precio + web premium incluida (solo anual), 20 plazas.
 *
 * Cambiar un número aquí lo cambia en TODA la web (home, /precios, JSON-LD,
 * términos). Nunca escribir un importe a mano en un componente — importar de aquí.
 * El ahorro anual se CALCULA, no se teclea (evita el "198€" desincronizado).
 */
export const PRICING = {
  monthly: 99,           // €/mes + IVA · facturación mensual
  annualPerMonth: 82.5,  // equivalente mensual de la modalidad anual
  annualTotal: 990,      // €/año + IVA (2 meses gratis frente al mensual)
  usersIncluded: 2,      // usuarios incluidos en el plan
  extraUserMonthly: 29,  // €/mes + IVA por usuario adicional
  extraUserAnnual: 290,  // €/año + IVA por usuario adicional
  commitmentMonths: 3,   // permanencia inicial de la modalidad mensual
  cancellationNoticeDays: 30, // preaviso de cancelación tras la permanencia
  trialDays: 15,         // duración de la prueba gratuita, sin tarjeta
  currency: 'EUR',
  locale: 'es-ES',
} as const

/** Ahorro anual = 12 mensualidades − pago anual. Calculado, nunca hardcodeado. */
export const ANNUAL_SAVING = PRICING.monthly * 12 - PRICING.annualTotal // 198
export const ANNUAL_FREE_MONTHS = Math.round(ANNUAL_SAVING / PRICING.monthly) // 2

/**
 * Formatea un importe en euros con la convención de es-ES: **espacio antes del
 * símbolo** ("99 €", "82,50 €"), no "99€" ni "€99". Es lo que hace
 * `Intl.NumberFormat('es-ES', { currency: 'EUR' })` y lo que espera un lector
 * español; pegarlo al número es una convención inglesa.
 *
 * El espacio es DURO (U+00A0): un importe nunca puede partirse entre líneas
 * dejando el símbolo huérfano al principio de la siguiente.
 *
 * Los enteros van sin decimales ("99 €", no "99,00 €") porque en un precio de
 * catálogo los dos ceros son ruido; los no enteros llevan siempre dos cifras
 * ("82,50 €", nunca "82,5 €").
 */
export function eur(n: number): string {
  const cifra = Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')
  return `${cifra} €`
}

/**
 * Programa Fundadores (modelo Axel): NO es un precio más bajo — es el mismo plan
 * con la web premium de lanzamiento incluida (solo pago anual) y el precio
 * congelado, para los primeros despachos. Al firmar cada fundador, bajar `left`.
 * Cónsul Jurídico = fundador #1 (por eso left = total − 1 al partir).
 */
export const FOUNDERS = {
  seatsTotal: 20,
  seatsLeft: 19,
} as const

export const FOUNDERS_SEATS_LABEL = `${FOUNDERS.seatsLeft} de ${FOUNDERS.seatsTotal} plazas` as const
