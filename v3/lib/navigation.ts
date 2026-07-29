/**
 * SSoT de la navegación.
 *
 * El header tenía 8 elementos y en `Nav.tsx` había un comentario explicando que
 * se había bajado el `gap` porque no cabían y el menú se montaba sobre el
 * logotipo. Cuando hay que apretar el espaciado para que quepa el menú, el
 * problema no es el espaciado.
 *
 * Cuatro secciones y dos acciones. Novedades y Contacto viven en el footer:
 * quien los busca los encuentra, y quien no, no tiene que decidir sobre ellos.
 */

export const HEADER_LINKS = [
  { href: '/legal', label: 'Producto' },
  { href: '/demo', label: 'Demo' },
  { href: '/seguridad', label: 'Seguridad' },
  { href: '/precios', label: 'Precios' },
] as const

export const FOOTER_NAV = {
  producto: {
    title: 'Producto',
    links: [
      { href: '/legal', label: 'Producto' },
      { href: '/demo', label: 'Demo interactiva' },
      { href: '/precios', label: 'Precios' },
      { href: '/seguridad', label: 'Seguridad' },
      { href: '/novedades', label: 'Novedades' },
    ],
  },
  empresa: {
    title: 'Empresa',
    links: [
      { href: '/sobre-velia', label: 'Sobre VELIA' },
      { href: '/contacto', label: 'Contacto' },
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
      { href: '/seguridad', label: 'Seguridad' },
    ],
  },
} as const

/** Cierre de marca del footer. Sustituye al claim del «100 % de su software». */
export const FOOTER_CLAIM = 'Todo el despacho. Una plataforma. VELIA.'
