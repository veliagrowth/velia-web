/**
 * El umbral de marca — blanco puro, el logotipo de VELIA, y nada más.
 *
 * ── QUÉ ES Y QUÉ NO ES ──────────────────────────────────────────────────────
 * NO es una pantalla de carga: la Home ya está entera en el HTML, DEBAJO. El
 * umbral es una capa que se pone encima y se retira.
 *
 *     SERVIDOR → HOME COMPLETA EN EL HTML → OVERLAY → REVEAL
 *
 * ── POR QUÉ NO ES UN COMPONENTE DE CLIENTE ──────────────────────────────────
 * La primera versión decidía en un `useEffect`. Funcionaba, y aun así estaba
 * mal: el efecto corre DESPUÉS de hidratar, así que en una conexión lenta el
 * visitante veía la Home un instante y después le caía un overlay blanco
 * encima. Un destello de contenido seguido de una pantalla en blanco es peor
 * que no tener umbral. Lo cazó `qa:home` a los tres minutos de existir.
 *
 * Ahora el reparto es:
 *
 *   · el MARCADO se sirve desde el servidor, siempre presente y `display:none`;
 *   · un script EN LÍNEA del `<head>` decide, antes del primer pintado, si
 *     marca `<html data-umbral="1">` (ver `app/layout.tsx`);
 *   · el CSS lo pinta Y LO RETIRA, con una animación que termina en
 *     `visibility: hidden`.
 *
 * Lo importante de ese reparto: **quien lo quita es el CSS, no JavaScript.** Si
 * el script en línea corre y el bundle de React no llega nunca, el umbral
 * desaparece igual. Y si JavaScript está desactivado del todo, el script no
 * corre, el atributo no se pone y esto nunca se ve: la regla que gobierna toda
 * la pieza es que ninguna ruta de fallo puede acabar en una pantalla blanca.
 *
 * ── EL LOGOTIPO ─────────────────────────────────────────────────────────────
 * Va incrustado y no en /public: una petición de red aquí es un parpadeo
 * garantizado — el overlay dura ~1 s y el logotipo llegaría tarde a su propia
 * aparición. Es el activo de `brand/assets/logo/velia-logo-primary-light.svg`
 * (SSoT de marca), variante para fondos claros: trazo y wordmark en Night,
 * punto en Soft Iris.
 */
export default function Umbral() {
  return (
    <div className="umbral" aria-hidden="true" data-umbral>
      <svg viewBox="0 0 300 58" className="umbral__logo" role="presentation" focusable="false">
        <g
          className="umbral__asta"
          fill="#0D1017"
          stroke="#0D1017"
          strokeWidth="0.8707"
          strokeMiterlimit="10"
        >
          <path d="M25.4,51.1c-0.5,0-1.1-0.4-1.2-0.7L2.4,6.8c-0.4-0.7,0-1.6,0.7-2s1.6,0,1.9,0.7L26.8,49 c0.4,0.7,0,1.6-0.7,1.9C25.8,50.9,25.6,51.1,25.4,51.1z" />
          <path d="M25.4,51.1c-0.2,0-0.4,0-0.7-0.2c-0.7-0.4-1-1.2-0.7-1.9L45.8,5.5c0.4-0.7,1.2-1.1,1.9-0.7s1.1,1.2,0.7,1.9 L26.7,50.2C26.5,50.7,26,51.1,25.4,51.1z" />
        </g>
        <circle className="umbral__punto" cx="25.4" cy="49.5" r="4" fill="#7479F2" />
        <g className="umbral__wordmark" fill="#0D1017">
          <path d="M85.2,48.8V31.7c0-0.9,0.7-1.6,1.6-1.6h23c0.9,0,1.6-0.7,1.6-1.6l0,0c0-0.9-0.7-1.6-1.6-1.6h-23c-0.9,0-1.6-0.7-1.6-1.6 V9.2c0-0.9,0.7-1.6,1.6-1.6H113c0.9,0,1.6-0.7,1.6-1.6l0,0c0-0.9-0.7-1.6-1.6-1.6H83.3c-0.9,0-1.6,0.7-1.6,1.6v46.1 c0,0.9,0.7,1.6,1.6,1.6H114c0.9,0,1.6-0.7,1.6-1.6l0,0c0-0.9-0.7-1.6-1.6-1.6H86.8C85.9,50.4,85.2,49.7,85.2,48.8z" />
          <path d="M148.5,51.9V6.1c0-1,0.8-1.8,1.8-1.8l0,0c1,0,1.8,0.8,1.8,1.8v42.5c0,1,0.8,1.8,1.8,1.8h24.9c0.9,0,1.6,0.7,1.6,1.6l0,0 c0,0.9-0.7,1.6-1.6,1.6h-28.7C149.2,53.5,148.5,52.8,148.5,51.9z" />
          <path d="M213.4,51.9V6.1c0-1,0.8-1.8,1.8-1.8l0,0c1,0,1.8,0.8,1.8,1.8v45.7c0,1-0.8,1.8-1.8,1.8H215 C214.1,53.5,213.4,52.8,213.4,51.9z" />
          <path d="M296.8,53.3c0.1-0.1,0.4-0.2,0.6-0.4c0.2-0.2,0.3-0.3,0.3-0.4c0.1-0.4,0.1-0.8-0.1-1.3l-21.1-46c-0.2-0.5-0.9-0.9-1.4-0.9 h-1.6c-0.7,0-1.2,0.4-1.4,0.9l-21.3,46.1c-0.5,1.1,0.4,2.3,1.4,2.3h0.4c0.7,0,1.2-0.4,1.4-0.9l5.4-12c0.2-0.5,0.9-0.9,1.4-0.9h26.5 c0.7,0,1.2,0.4,1.4,0.9l4,8.8c0.2,0.5,0.5,1,0.7,1.5c0.3,0.6,0.4,0.9,0.7,1.3c0.5,0.8,0.8,1,1,1c0.4,0.2,0.8,0.2,0.9,0.2 C296.3,53.5,296.6,53.4,296.8,53.3z M262.4,34.4l10.4-23c0.5-1.2,2.3-1.2,2.8,0l10.5,23c0.5,1.1-0.4,2.3-1.4,2.3h-20.9 C262.8,36.6,261.9,35.4,262.4,34.4z" />
        </g>
      </svg>
    </div>
  )
}
