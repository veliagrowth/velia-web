/**
 * Las preguntas que alguien hace antes de escribirnos, y lo que se puede
 * responder HOY sin inventar nada.
 *
 * ── POR QUÉ ESTE FICHERO, Y NO EL TEXTO DENTRO DEL COMPONENTE ─────────────
 * Mismo patrón que `capacidades.ts` y `entorno.ts`: los datos viven aquí y la
 * composición en `components/Faq.tsx`. Aquí es donde se discute qué se dice;
 * allí, cómo se ve. Y una respuesta comercial que cambia no debería obligar a
 * abrir un componente con estado.
 *
 * ── LA REGLA QUE GOBIERNA LO QUE SE PUEDE ESCRIBIR AQUÍ ───────────────────
 * Ni una cifra, ni un plazo, ni una permanencia, ni un preaviso, ni un coste
 * de salida, ni una garantía, ni un SLA. No porque no existan —algunos
 * existirán— sino porque **ninguno está aprobado como condición pública**, y
 * una condición comercial publicada es una promesa aunque se escriba en una
 * FAQ.
 *
 * Donde falta una decisión, la respuesta lo DICE en vez de rellenarlo: decir
 * «se define antes de empezar» es cierto y es útil; inventar «30 días de
 * preaviso» es un contrato escrito por quien no puede firmarlo.
 *
 * Las que hoy esperan una decisión humana están marcadas con `gate: true`.
 * No es una etiqueta que se pinte —el visitante no tiene por qué ver nuestra
 * cocina—: es para que una búsqueda en este fichero diga qué queda abierto.
 * ⛔ No se escribe `TODO`, `TBD` ni un hueco visible: el texto que hay es
 * publicable tal cual, y se sustituye el día que exista la decisión.
 *
 * ── LO QUE TAMPOCO ENTRA ──────────────────────────────────────────────────
 * · «VELIA Legal», ni vocabulario de un vertical. `qa:identidad` lo comprueba.
 * · Un JSON-LD `FAQPage`. La Fase 0 lo retiró a propósito y la guarda exige
 *   que NINGUNA ruta lo publique. Esta sección es contenido, no una señal
 *   estructurada más: se añadiría el día que se decida reabrir esa puerta.
 * · Afirmaciones que necesiten una fuente externa. Si alguna hiciera falta,
 *   va por `lib/verified-claims.ts` con su fuente y su fecha, como el resto.
 */

export type Pregunta = {
  /** El ancla, estable: se usa como `id` del panel y del botón. */
  id: string
  q: string
  /** Párrafos. Dos como mucho: una FAQ que necesita tres no es una FAQ. */
  a: readonly string[]
  /** Espera una decisión comercial humana. No se pinta; se busca. */
  gate?: true
}

export const FAQ: readonly Pregunta[] = [
  {
    id: 'precio',
    q: '¿Cuánto cuesta trabajar con VELIA?',
    gate: true,
    a: [
      'No hay una tarifa universal, y no es una evasiva: el coste depende del alcance de la transformación, de las capacidades que se incorporan, de las integraciones que hacen falta y del nivel de operación que pide cada caso. Un negocio que necesita poner en orden su base digital y otro que además quiere automatizar su captación y que alguien la opere no cuestan lo mismo.',
      'Lo que sí es fijo es el orden: primero se entiende el contexto y se define el alcance, y el número sale de ahí. Nunca al revés.',
    ],
  },
  {
    id: 'modelo',
    q: '¿Cómo se estructura el servicio?',
    a: [
      'En tres piezas que no son planes: un proyecto de implantación, una operación recurrente y las ampliaciones que el negocio pida cuando las pida.',
      'El proyecto construye e integra. La operación es quedarse: vigilar, corregir y evolucionar lo construido. Las ampliaciones son capacidades nuevas sobre lo que ya funciona. No es una suscripción a un producto cerrado.',
    ],
  },
  {
    id: 'inicio',
    q: '¿Qué ocurre cuando empezamos a trabajar con VELIA?',
    a: [
      'Entender el contexto, definir el alcance, diseñar la solución, implementarla, operarla y medir para mejorarla. En ese orden.',
      'La primera fase no produce código: produce una decisión sobre qué se conserva, qué se conecta y qué estorba. Casi ningún negocio parte de cero, y saltarse ese paso es lo que hace que un proyecto digital acabe sustituyendo cosas que funcionaban.',
    ],
  },
  {
    id: 'salida',
    q: '¿Qué ocurre si dejo de trabajar con VELIA?',
    gate: true,
    a: [
      'Las condiciones de salida dependen del servicio y del acuerdo contratado. Antes de empezar se define qué activos, datos, infraestructura e integraciones quedan bajo gestión de VELIA y qué ocurre con cada uno al terminar la relación.',
      'Es una conversación que se tiene al principio, no al final. Un negocio que no sabe de quién son sus accesos hasta que quiere irse ya tiene un problema, y ese problema es justo el que VELIA existe para quitar.',
    ],
  },
  {
    id: 'propiedad',
    q: '¿Qué ocurre con mi web, mis datos, mis contenidos y mis automatizaciones?',
    gate: true,
    a: [
      'No son la misma cosa y no se tratan igual. Están los activos del negocio —su dominio, sus datos, sus contenidos, sus cuentas—; la infraestructura que VELIA opera por él; los servicios de terceros, que tienen sus propias condiciones; y los componentes contratados para un caso concreto.',
      'Qué pasa con cada uno se fija en el acuerdo, no en una política general que valga para todos. Lo que sí es principio: el negocio tiene que poder saber en todo momento quién controla cada pieza, y eso se deja documentado.',
    ],
  },
  {
    id: 'herramientas',
    q: '¿Tengo que cambiar mis herramientas actuales?',
    a: [
      'No necesariamente. Se mira primero lo que ya hay, porque lo que existe suele funcionar a medias y no del todo mal: el trabajo empieza por saber qué se conserva, qué se conecta y qué sobra.',
      'Integrar no es el añadido del final; es la mitad del trabajo.',
    ],
  },
  {
    id: 'sustitucion',
    q: '¿VELIA sustituye mis herramientas?',
    a: [
      'Por defecto, no. El orden es descubrir, evaluar, integrar o reutilizar, y sustituir sólo cuando la sustitución aporte algo claro.',
      'Cambiar una herramienta que funciona tiene un coste que rara vez se cuenta: el de volver a aprenderla. Si no hay una razón que lo supere, se queda.',
    ],
  },
  {
    id: 'ia',
    q: '¿Qué papel tiene la IA en VELIA?',
    a: [
      'La IA, los agentes y la automatización son capacidades de la infraestructura que VELIA construye y opera. No son el producto, y no se usan porque toque: cuando una operación se resuelve mejor con código normal, se usa código normal.',
      'Lo que sí cambia con ellas es cuánto trabajo repetido deja de necesitar a una persona. Las decisiones que requieren criterio siguen siendo de quien tiene ese criterio.',
    ],
  },
  {
    id: 'personalizacion',
    q: '¿Las soluciones son estándar o personalizadas?',
    a: [
      'Las dos cosas, y en ese orden. VELIA tiene capacidades reutilizables —lo que ya está construido, probado y en marcha— y cada implantación las configura y las adapta al negocio.',
      'Se reutiliza antes de construir. Escribir algo nuevo cuando ya existe algo equivalente no es personalización: es deuda con otro nombre.',
    ],
  },
  {
    id: 'escalado',
    q: '¿Puedo empezar por una parte y ampliar después?',
    a: [
      'Sí, y es lo habitual. Suele empezarse por la base digital, y desde ahí se amplía hacia visibilidad y captación, hacia automatización, o hacia la operación del día a día, según lo que el negocio necesite antes.',
      'No es una escalera de paquetes por la que haya que subir en orden. Se construye el escalón que hace falta, no el siguiente.',
    ],
  },
  {
    id: 'operacion',
    q: '¿Qué ocurre después de la implantación?',
    a: [
      'Ahí empieza la operación: vigilar que siga funcionando, arreglar lo que se rompe, ajustar lo que ya no encaja y ampliarlo cuando el negocio cambia. El alcance concreto es el que se haya contratado.',
      'Un sistema digital no se queda como se entregó. Los proveedores cambian sus reglas, las integraciones se caen y los datos se ensucian. Sin nadie detrás no se mantiene igual: se degrada, y casi siempre en silencio.',
    ],
  },
] as const

/** Las que esperan una decisión comercial humana. Para buscar, no para pintar. */
export const FAQ_CON_GATE = FAQ.filter(p => p.gate).map(p => p.id)
