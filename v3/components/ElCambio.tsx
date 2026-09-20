/**
 * El territorio narrativo: la Revolución 4.0 (§85 de la dirección).
 *
 * ── POR QUÉ ES UNA FRANJA Y NO MEDIA PANTALLA (20-sep-2026) ───────────────
 * Esto ocupaba una rejilla de tres etapas, un bloque oscuro entero para la
 * cuarta y dos párrafos de cierre: media pantalla de historia industrial antes
 * de que la Home dijera qué gana quien la lee. El contexto era correcto y el
 * tamaño equivocado. Ahora son cuatro etapas en una línea y la única frase que
 * importa debajo.
 *
 * EL RIESGO DE ESTA SECCIÓN sigue siendo sonar a charla de LinkedIn. Se salva
 * igual que antes: las etapas se enuncian secas, sin adjetivos, y la carga la
 * lleva la observación final —que la mayoría de las empresas trabaja con
 * infraestructura de una etapa anterior a la que ya está fuera—. Es una
 * observación, no una promesa.
 */

const ETAPAS = [
  { v: '1.0', que: 'Mecanización' },
  { v: '2.0', que: 'Electricidad y producción en serie' },
  { v: '3.0', que: 'Informática e internet' },
  { v: '4.0', que: 'IA, automatización, datos y agentes', ahora: true },
] as const

export default function ElCambio() {
  return (
    <div className="mt-10 md:mt-12">
      {/* Lista ordenada de verdad: es una secuencia histórica y un lector de
          pantalla debe oírla como tal. */}
      <ol className="grid gap-px bg-mist sm:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-lg">
        {ETAPAS.map(e => (
          <li key={e.v} className={`px-5 py-5 ${'ahora' in e ? 'bg-white' : 'bg-cream'}`}>
            <p className={`text-[13px] font-600 tracking-[0.06em] tabular-nums ${'ahora' in e ? 'text-gold-ink' : 'text-void/65'}`}>
              {e.v}
            </p>
            <p className={`mt-1.5 text-[15px] leading-snug ${'ahora' in e ? 'font-600 text-void' : 'font-500 text-void/75'}`}>
              {e.que}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-void/70 max-w-prose">
        La mayoría de las empresas siguen operando con infraestructura de la 2.0 y la 3.0. Ese
        hueco no se cierra comprando una herramienta más: se cierra cambiando la
        infraestructura, y luego operándola.
      </p>
    </div>
  )
}
