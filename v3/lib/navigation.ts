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

/* ⚠️ 20-sep-2026: «VELIA OS» sale del menú y entra «Trabajo».
   La sección `#velia-os` ya no está en la Home —la infraestructura se movió a
   `/sobre-velia`—, así que ese enlace apuntaba a un ancla inexistente: el
   navegador se habría quedado arriba sin decir nada. Y lo que ocupa su lugar
   responde mejor a por qué alguien mira el menú de una compañía que no conoce:
   ver si ha hecho algo. Siguen siendo cuatro secciones y una acción. */
export const HEADER_LINKS = [
  { href: '/#capacidades', label: 'Qué hacemos' },
  { href: '/#casos', label: 'Trabajo' },
  { href: '/#operamos', label: 'Cómo trabajamos' },
  { href: '/contacto', label: 'Contacto' },
] as const

export const FOOTER_NAV = {
  compania: {
    title: 'Compañía',
    links: [
      { href: '/#capacidades', label: 'Qué hacemos' },
      { href: '/#operamos', label: 'Cómo trabajamos' },
      /* `#velia-os` y `#caso` eran dos anclas de la Home anterior. La primera
         se fue a `/sobre-velia#infraestructura`; la segunda la absorbió
         `#casos`, que ya no es un caso sino cuatro. */
      { href: '/#casos', label: 'Trabajo' },
      { href: '/sobre-velia#infraestructura', label: 'VELIA OS' },
      /* Etapa 2 (17-sep). `/sobre-velia` entra aquí y NO en el header: §7 de la
         dirección fija cuatro elementos y una acción arriba, y esa decisión no
         la cambia el hecho de que la página ya esté reescrita. El pie es donde
         vive lo secundario.

         Hasta hoy la página no estaba enlazada desde ninguna parte de la web
         nueva y sí propuesta en `sitemap.ts`: se ofrecía a los buscadores y no
         a las personas. */
      { href: '/sobre-velia', label: 'Sobre VELIA' },
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
