/**
 * SSoT de las llamadas a la acción de la web pública.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO: la auditoría del 29-jul encontró **17 CTA
 * distintos** repartidos por el sitio, y el peor efecto no era la variedad sino
 * que el botón principal de `/precios` decía «Solicitar una demo» y llevaba a
 * `/contacto`. Quien llegaba decidido a probar VELIA se encontraba un formulario.
 *
 * Nunca escribir el texto de un CTA a mano en un componente: importarlo de aquí.
 *
 * ── QUÉ SE FUE EL 6-oct-2026, Y POR QUÉ ──────────────────────────────────────
 * Este fichero declaraba TRES acciones —primaria «Probar VELIA gratis»,
 * secundaria «Ver demo interactiva», terciaria «Hablar con el equipo»— y las
 * conservaba con esta justificación escrita aquí mismo:
 *
 *     «Las tres acciones de abajo NO se borran: las páginas legacy (`/precios`,
 *      `/demo`, `/fundadores`, `/legal`) siguen vivas y las siguen usando.»
 *
 * **Esa frase era falsa.** Medido: las cuatro rutas están en
 * `rutas-retiradas.ts` y **ninguna tiene `page.tsx`**. No seguían vivas: no
 * existían. Y sus consumidores —`PricingPlans`, `PricingSelector`,
 * `TrialButton`— no los importaba nadie: eran una isla cerrada, a un `import`
 * de volver a publicar una oferta descontinuada.
 *
 * Además `TRIAL_URL` apuntaba a `/prueba-velia`, el alta self-serve del portal
 * que se retiró ese mismo día: era, literalmente, un enlace a un 404.
 *
 * 🔑 **Queda UNA acción, y es la verdad del producto:** VELIA no vende una
 * herramienta que probar, construye y opera infraestructura. Eso empieza por una
 * conversación, no por un alta.
 */
import { APP_URL } from './constants'

/**
 * La demo de solo lectura, sin registro. Vive y la usa `DemoEmbed` en el Hero.
 *
 * ⚠️ No confundir con la retirada `DEMO_PAGE = '/demo'`, que era una página
 * intermedia para presentar la demo antes de abrirla: esa ruta ya no existe.
 * Hoy la demo se enseña directamente, embebida, que es el requisito —«una
 * ventana real al producto»—.
 */
export const DEMO_URL = 'https://demo.app.veliacorp.com/'

/** La única acción de la VELIA nueva. */
export const CTA_CONTACTO = {
  label: 'Hablemos',
  href: '/contacto',
} as const

/** Microcopy del cierre. Dice qué pasa después de pulsar, que es lo único que
 *  el visitante quiere saber antes de escribir. Ninguna promesa de plazo: no
 *  hay un SLA de respuesta que podamos sostener. */
export const CONTACTO_MICROCOPY = 'Nos cuentas cómo trabajáis hoy. Te decimos qué haríamos.'

/** Entrada al portal para quien YA es cliente. No es un alta: es una puerta. */
export const ACCESO_CLIENTES = {
  label: 'Acceso clientes',
  href: APP_URL,
} as const
