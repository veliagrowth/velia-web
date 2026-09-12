import Reveal from '@/components/Reveal'

/**
 * Momento 5 — VELIA OS. El primer corte oscuro de la página.
 *
 * AQUÍ ES DONDE UNA WEB DE AGENCIA MIENTE. Es la sección en la que se enseña un
 * diagrama de nodos, se dice «agentes autónomos» y se da por hecho que nadie lo
 * va a comprobar. Esta sección hace lo contrario: separa explícitamente lo que
 * está EN PRODUCCIÓN de lo que está EN CONSTRUCCIÓN.
 *
 * No es un descargo legal, es el argumento. Una compañía que dice qué le falta
 * es una compañía a la que se le puede creer lo que dice que tiene. Y encaja con
 * la regla de producto de la propia casa: no se afirma una capacidad que no
 * exista (§47 del encargo, §16 de la directiva).
 *
 * QUÉ NO SE PUBLICA NUNCA: proveedores, servidores, nombres de servicio,
 * endpoints, topología. Se comunica CAPACIDAD, no arquitectura. Una web que
 * describe su propia infraestructura está escribiendo el plano para otro.
 *
 * El bucle de abajo es la dirección del Control Plane, y va marcado como tal.
 * Escribirlo como si ya funcionara entero sería exactamente el fallo que esta
 * sección existe para no cometer.
 */

const EN_PRODUCCION = [
  {
    t: 'Infraestructura propia',
    d: 'VELIA no opera el negocio de un cliente desde una carpeta compartida y cinco suscripciones. Opera desde sistemas propios.',
  },
  {
    t: 'Automatización en marcha',
    d: 'Procesos que se ejecutan solos todos los días, con su registro de lo que hicieron y de lo que no.',
  },
  {
    t: 'Un espacio por cliente',
    d: 'Cada cliente tiene su portal: lo que está en marcha, lo que se ha entregado, lo que ha pedido y lo que se ha medido.',
  },
] as const

const EN_CONSTRUCCION = [
  {
    t: 'Control Plane',
    d: 'El plano desde el que se observa, se diagnostica, se decide, se ejecuta y —sobre todo— se verifica que lo ejecutado tuvo efecto.',
  },
  {
    t: 'Agentes gobernados',
    d: 'Agentes con permisos explícitos y acotados. La autonomía es una capacidad que se concede, no un efecto secundario de darle una tarea a un modelo.',
  },
  {
    t: 'VELIA 4.0 Audit',
    d: 'El diagnóstico como punto de partida: trece dimensiones, hallazgos clasificados y un plan, en vez de una propuesta comercial.',
  },
] as const

const BUCLE = ['Observar', 'Entender', 'Diagnosticar', 'Planificar', 'Ejecutar', 'Verificar', 'Aprender'] as const

export default function VeliaOS() {
  return (
    <>
      <div className="mt-14 md:mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="estado text-gold mb-6">En producción</p>
          <ul className="space-y-7">
            {EN_PRODUCCION.map(x => (
              <li key={x.t}>
                <h3 className="text-base font-600 text-cream">{x.t}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-cream/70 max-w-prose">{x.d}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <p className="estado estado--futuro text-cream/60 mb-6">En construcción</p>
          <ul className="space-y-7">
            {EN_CONSTRUCCION.map(x => (
              <li key={x.t}>
                <h3 className="text-base font-600 text-cream/85">{x.t}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-cream/60 max-w-prose">{x.d}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div className="mt-14 md:mt-20 border-t border-white/10 pt-10">
          <p className="estado estado--futuro text-cream/55 mb-6">
            Control Plane · hacia dónde va
          </p>
          {/* Lista ordenada de verdad: es una secuencia, y un lector de pantalla
              debe oírla como tal. Los separadores son decorativos. */}
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
            {BUCLE.map((paso, i) => (
              <li key={paso} className="flex items-center gap-3">
                <span className="text-[13px] font-500 tracking-[0.01em] text-cream/75 whitespace-nowrap">
                  {paso}
                </span>
                {i < BUCLE.length - 1 && (
                  <span className="text-cream/25 text-[13px]" aria-hidden="true">→</span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[15px] leading-[1.6] text-cream/60 max-w-prose">
            El paso que casi nadie implementa es el penúltimo. Que una automatización se haya
            ejecutado no significa que haya producido el efecto que prometía, y un sistema que
            no distingue esas dos cosas informa de un éxito que no ha ocurrido.
          </p>
        </div>
      </Reveal>
    </>
  )
}
