import Reveal from '@/components/Reveal'

/**
 * Qué hay montado y qué se está construyendo.
 *
 * ── DÓNDE VIVE, Y POR QUÉ CAMBIÓ (20-sep-2026) ────────────────────────────
 * Esto era el primer corte oscuro de la HOME, con el bucle del Control Plane
 * —observar, entender, diagnosticar, planificar, ejecutar, verificar,
 * aprender— dibujado entero. Un visitante tenía que atravesar la arquitectura
 * interna de la casa antes de saber qué gana su negocio.
 *
 * Ahora vive en `/sobre-velia`, que es donde llega quien quiere ese nivel de
 * detalle, y sin el diagrama del bucle: lo que el bucle explicaba —que ejecutar
 * no es haber producido un efecto— sigue dicho en el propio Control Plane.
 *
 * LO QUE NO CAMBIA, porque es el argumento: la separación explícita entre lo
 * que está EN MARCHA y lo que está EN CONSTRUCCIÓN. Aquí es donde una web de
 * agencia miente —enseña un diagrama de nodos, dice «agentes autónomos» y da
 * por hecho que nadie lo va a comprobar—. Una compañía que dice qué le falta es
 * una compañía a la que se le puede creer lo que dice que tiene.
 *
 * QUÉ NO SE PUBLICA NUNCA: proveedores, servidores, nombres de servicio,
 * endpoints, topología. Se comunica CAPACIDAD, no arquitectura. Una web que
 * describe su propia infraestructura está escribiendo el plano para otro.
 */

const EN_MARCHA = [
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
    d: 'El plano desde el que se observa, se diagnostica, se decide, se ejecuta y —sobre todo— se verifica que lo ejecutado tuvo efecto. Que una automatización se haya ejecutado no significa que haya producido el resultado que prometía.',
  },
  {
    t: 'Agentes gobernados',
    d: 'Agentes con permisos explícitos y acotados. La autonomía es una capacidad que se concede, no un efecto secundario de darle una tarea a un modelo.',
  },
  {
    t: 'VELIA 4.0 Audit',
    d: 'El diagnóstico como punto de partida: hallazgos clasificados y un plan, en vez de una propuesta comercial.',
  },
] as const

export default function VeliaOS() {
  return (
    <div className="mt-14 md:mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal>
        <p className="estado text-gold mb-6">En marcha</p>
        <ul className="space-y-7">
          {EN_MARCHA.map(x => (
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
  )
}
