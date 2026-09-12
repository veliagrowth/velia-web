import Reveal from '@/components/Reveal'

/**
 * Momento 2 — el territorio narrativo: la Revolución 4.0 (§85 de la dirección).
 *
 * EL RIESGO DE ESTA SECCIÓN es sonar a charla de LinkedIn. «Cuarta Revolución
 * Industrial» es una expresión gastada, y usarla como adorno haría exactamente
 * el daño que la dirección quiere evitar.
 *
 * Se salva con un dato concreto en vez de con una proclama: las tres primeras
 * revoluciones se enuncian secas, sin adjetivos, y toda la carga la lleva la
 * última línea —que la mayoría de las empresas trabaja con infraestructura de
 * una etapa anterior a la que ya está fuera—. Ese hueco es el negocio de VELIA,
 * y es una observación, no una promesa.
 *
 * Composición: las tres primeras etapas en gris, pequeñas y comprimidas; la
 * cuarta ocupa el ancho y es la única con Iris. La jerarquía cuenta la historia
 * antes de que nadie lea.
 */

const ETAPAS = [
  { v: '1.0', que: 'Mecanización', cuando: 'Finales del XVIII' },
  { v: '2.0', que: 'Electricidad y producción en serie', cuando: 'Finales del XIX' },
  { v: '3.0', que: 'Informática e internet', cuando: 'Segunda mitad del XX' },
] as const

export default function ElCambio() {
  return (
    <div className="mt-14 md:mt-20">
      <ol className="grid gap-px bg-mist sm:grid-cols-3 overflow-hidden rounded-lg">
        {ETAPAS.map(e => (
          <li key={e.v} className="bg-cream px-6 py-7">
            <p className="text-[13px] font-600 tracking-[0.06em] text-void/65 tabular-nums">{e.v}</p>
            <p className="mt-2 text-[15px] font-500 text-void/75 leading-snug">{e.que}</p>
            <p className="mt-1.5 text-[12px] text-void/65">{e.cuando}</p>
          </li>
        ))}
      </ol>

      <Reveal className="mt-4">
        <div className="rounded-lg bg-void px-6 py-9 md:px-10 md:py-12 text-cream">
          <p className="text-[13px] font-600 tracking-[0.06em] text-gold/90 tabular-nums">4.0</p>
          <p className="mt-2 text-2xl md:text-4xl font-600 tracking-[-0.03em] leading-[1.12] max-w-[22ch]">
            IA, automatización, datos y agentes.
          </p>
          <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-cream/70 max-w-prose">
            Es la etapa en la que ya opera el entorno: quien busca, quien compara, quien
            recomienda y quien decide. También quien no es una persona.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <p className="mt-10 text-xl md:text-2xl font-500 tracking-[-0.02em] leading-[1.35] text-void max-w-[38ch]">
          La mayoría de las empresas siguen operando con infraestructura de la 2.0 y la 3.0.
        </p>
        <p className="mt-4 text-[15px] leading-[1.6] text-void/65 max-w-prose">
          Ese hueco no se cierra comprando una herramienta más. Se cierra cambiando la
          infraestructura, y luego operándola.
        </p>
      </Reveal>
    </div>
  )
}
