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

/**
 * Los grupos del pie. CUATRO, y el cuarto es nuevo el 24-sep-2026.
 *
 * ── POR QUÉ CRECE UN PIE QUE SE HABÍA PODADO ──────────────────────────────
 * El 22-sep se le quitaron dos enlaces con un argumento bueno: «un pie con
 * catorce destinos es una lista, no un cierre». Sigue siendo cierto, y por eso
 * lo que entra no son enlaces sueltos: es un GRUPO con nombre —lo que VELIA
 * sabe hacer— que hasta hoy no se podía enlazar porque tres de sus cuatro
 * páginas no existían.
 *
 * Un pie con jerarquía y cuatro columnas cortas se lee mejor que uno con tres
 * columnas y un hueco. Lo que hay que evitar es la lista sin cabeza, no el
 * número de filas.
 */
export const FOOTER_NAV = {
  capacidades: {
    title: 'Qué hacemos',
    links: [
      { href: '/digital-foundation', label: 'Digital Foundation' },
      { href: '/ai-search', label: 'AI Search & Digital Visibility' },
      { href: '/growth-automation', label: 'Growth & Automation' },
      { href: '/digital-operations', label: 'Digital Operations' },
    ],
  },
  compania: {
    title: 'Compañía',
    links: [
      { href: '/#casos', label: 'Trabajo' },
      { href: '/#operamos', label: 'Cómo trabajamos' },
      { href: '/#entorno', label: 'Tu entorno' },
      { href: '/sobre-velia', label: 'Sobre VELIA' },
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
  contacto: {
    /* «Conectar» y no «Contacto»: el grupo no es sólo el formulario — lleva
       también el correo y la puerta de los clientes que ya trabajan con VELIA.
       ⚠️ NO hay enlace a redes sociales, y no es un olvido: esta web no declara
       perfiles externos (`sameAs`) porque no los tiene verificados, y un pie que
       enlaza a un perfil que no se mantiene es peor que uno que no lo enlaza. */
    title: 'Conectar',
    links: [{ href: '/contacto', label: 'Hablemos' }],
  },
} as const

/** Cierre de marca del pie. Los dos verbos que separan a VELIA de una agencia. */
export const FOOTER_CLAIM = 'Construimos infraestructura. Y la operamos.'
