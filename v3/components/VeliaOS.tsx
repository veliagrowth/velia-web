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
    /* ⚠️ CORREGIDO EL 22-sep-2026. Decía: «Un espacio por cliente — Cada cliente
       tiene su portal». Medido ese día contra la base de producción, era FALSO:
       de los dos clientes reales, uno no tiene activado el módulo `portal`. No
       por un descuido, sino porque no lo necesita — que es precisamente el
       argumento de la compañía.

       La forma del error merece quedarse escrita, porque es la de siempre: la
       frase describía el caso que teníamos delante (Cónsul Jurídico) y lo
       enunciaba como universal. Nadie la habría cazado leyendo la página; se
       cazó consultando la columna. Ahora dice lo que la columna dice.

       La escala completa de qué puede llegar a contener un entorno vive en la
       Home (`#entorno`), sostenida por el claim `modularEnvironment`. */
    t: 'Un entorno por cliente',
    d: 'Cada cliente tiene el suyo, con activado sólo lo que usa. Unos llevan dentro el negocio entero; a otros les basta con ver lo que hay en marcha, lo entregado y lo medido.',
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
  {
    /* ── POR QUÉ ESTO ESTÁ EN LA COLUMNA DE LA DERECHA (22-sep-2026) ───────
       Hay proyectos —producción de vídeo, campañas, contenido— donde dentro del
       entorno del cliente tienen que entrar terceros: una productora, una
       agencia, un filmmaker. El portal ya distingue roles, así que la tentación
       de anunciarlo como disponible es fuerte y sería un error medible: hoy hay
       un defecto abierto en el cierre de puerta por rol —cinco de siete
       pantallas marcadas no cierran— y publicarlo aquí sería vender como
       garantía algo que está roto.

       No se calla y no se promete: se dice dónde está. Es exactamente para lo
       que existe esta columna, y es el único sitio de la web donde la frase
       puede aparecer sin mentir. Sube a «En marcha» el día que el cierre se
       demuestre, no el día que se arregle. */
    t: 'Terceros dentro del entorno',
    d: 'Que una productora, una agencia o un colaborador externo trabaje dentro del entorno de un cliente viendo sólo lo suyo. El control de acceso por rol existe; lo que falta es demostrar que cierra en todas las pantallas antes de ofrecerlo.',
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
