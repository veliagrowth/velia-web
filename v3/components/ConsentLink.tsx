'use client'

import { reabrirConsentimiento } from '@/lib/consent'

/**
 * «Cookies»: vuelve a abrir el panel de consentimiento.
 *
 * Existe porque el RGPD (art. 7.3) exige que retirar el consentimiento sea tan
 * fácil como darlo. Si la única forma de decidir fuera el banner de la primera
 * visita, quien ya decidió no podría cambiar de idea nunca — y eso convierte un
 * consentimiento en una trampa.
 *
 * Al reabrirlo se borra la decisión guardada y, si estaba aceptado, se borran
 * también las cookies que el tercero hubiera dejado: dejar de cargar el script
 * no retira las cookies que ya están en el navegador.
 *
 * ── POR QUÉ HAY QUE ELEGIR SUPERFICIE (29-sep-2026) ───────────────────────
 * Este componente tenía UN estilo fijo: `text-cream/55`. En el pie es el
 * correcto —`<footer>` es `bg-void`, oscuro—, pero se usa en DOS sitios, y el
 * segundo es un párrafo de `/cookies` sobre Pearl Cloud.
 *
 * `cream` y `void` son justamente los dos tokens que se INVIERTEN entre
 * superficies: `cream` es «el texto» sobre oscuro y «el fondo» sobre claro. Así
 * que el mismo componente pintaba Pearl Cloud sobre Pearl Cloud. Medido:
 * **1,00:1**. Un botón invisible, en la frase que dice «puedes retirarlo desde
 * aquí», y siendo el control que exige el art. 7.3.
 *
 * Por eso `variante` NO tiene valor por defecto, y es deliberado. Un defecto
 * dejaría que el tercer sitio que lo use herede en silencio la superficie
 * equivocada, que es exactamente lo que acaba de pasar. Sin defecto, el
 * compilador obliga a mirar sobre qué fondo se está pintando.
 *
 * Lo caza `qa:paginas` desde el mismo día: `<button>` entró en la lista de
 * etiquetas con texto de `scripts/lib/auditoria-pagina.mjs`, que hasta entonces
 * sólo miraba prosa y dejaba los controles fuera.
 */
export default function ConsentLink({ variante }: { variante: 'pie' | 'prosa' }) {
  /* `pie`: sobre `bg-void`. 11 px, como el resto de la línea legal del pie.
     `prosa`: dentro de un `<p>` de `.legal-prose`. Hereda el tamaño del
     párrafo —es una palabra dentro de una frase, no una etiqueta— y copia el
     tratamiento de `.legal-prose a`, que es el hermano visual que tiene al
     lado. Esa regla no se le aplica sola: es para `<a>`, y esto es un
     `<button>`. Medido sobre Pearl Cloud: `text-void/80` da 9,7:1. */
  const estilo =
    variante === 'pie'
      ? 'text-[11px] text-cream/55 hover:text-cream'
      : 'text-void/80 hover:text-gold-dark'

  return (
    <button
      type="button"
      onClick={reabrirConsentimiento}
      className={`underline underline-offset-2 transition-colors ${estilo}`}
    >
      Cookies
    </button>
  )
}
