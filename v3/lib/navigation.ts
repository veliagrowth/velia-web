/**
 * SSoT de la navegación.
 *
 * REESCRITA EN EL REWORK 2026. La anterior era la navegación de un SaaS —
 * Producto · Demo · Seguridad · Precios— y las cuatro llevaban al funnel de
 * VELIA Legal. La VELIA nueva no vende un producto: construye y opera
 * infraestructura, así que el menú nombra lo que hace, cómo lo hace y con qué.
 *
 * Cuatro secciones y una acción. Block tiene siete enlaces para seis empresas;
 * una compañía con una sola web no necesita más.
 *
 * ⚠️ NINGUNA RUTA LEGACY APARECE AQUÍ. `/precios`, `/demo`, `/fundadores` y
 * `/legal` siguen vivas y respondiendo 200 —no se ha roto nada—, pero dejan de
 * anunciarse: son la etapa anterior de la compañía. El inventario con sus
 * dependencias está en
 * velia-core/docs/design/VELIA_WEB_LEGACY_INVENTORY_2026.md
 *
 * `/seguridad` tampoco aparece todavía: sigue hablando de seguridad de un SaaS
 * jurídico y está marcada REWRITE para la etapa 2. Las dos páginas legales que
 * la enlazan (privacidad e IA responsable) siguen enlazándola: ese camino no se
 * toca porque es obligación legal.
 */

export const HEADER_LINKS = [
  { href: '/#capacidades', label: 'Qué hacemos' },
  { href: '/#operamos', label: 'Cómo trabajamos' },
  { href: '/#velia-os', label: 'VELIA OS' },
  { href: '/contacto', label: 'Contacto' },
] as const

export const FOOTER_NAV = {
  compania: {
    title: 'Compañía',
    links: [
      { href: '/#capacidades', label: 'Qué hacemos' },
      { href: '/#operamos', label: 'Cómo trabajamos' },
      { href: '/#velia-os', label: 'VELIA OS' },
      { href: '/#caso', label: 'Un caso real' },
    ],
  },
  contacto: {
    title: 'Contacto',
    links: [
      { href: '/contacto', label: 'Hablemos' },
      { href: '/novedades', label: 'Novedades' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/aviso-legal', label: 'Aviso legal' },
      { href: '/privacidad', label: 'Privacidad' },
      { href: '/cookies', label: 'Cookies' },
      { href: '/terminos', label: 'Términos del servicio' },
      { href: '/ia-responsable', label: 'IA responsable' },
    ],
  },
} as const

/** Cierre de marca del pie. Los dos verbos que separan a VELIA de una agencia. */
export const FOOTER_CLAIM = 'Construimos infraestructura. Y la operamos.'
