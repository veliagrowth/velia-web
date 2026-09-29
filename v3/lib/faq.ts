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
 * «se define antes de empezar» es cierto y es útil; inventar un plazo de
 * preaviso es un contrato escrito por quien no puede firmarlo.
 *
 * ── EL CAMPO `decision` (29-sep-2026) ─────────────────────────────────────
 * Antes era `gate: true`, un booleano que sólo sabía decir «esto falta». Su
 * problema es que lo cerrado se representaba por AUSENCIA: una pregunta sin
 * la marca podía ser una política aprobada o una que nadie se planteó nunca,
 * y las dos se leen igual. Al aprobarse las tres primeras, quitar la marca
 * habría borrado también la prueba de que hubo una decisión.
 *
 * Ahora `decision` es explícito y sólo lo llevan las preguntas que dependen
 * de una política comercial: `APROBADA` con su fecha, o `PENDIENTE` diciendo
 * qué falta exactamente. Las que no son política —la IA, las herramientas, la
 * personalización— no lo llevan, y esa ausencia sí significa una sola cosa.
 *
 * No se pinta: el visitante no tiene por qué ver nuestra cocina. Es para que
 * una búsqueda en este fichero diga qué está decidido y desde cuándo.
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

/**
 * El estado de la política comercial que sostiene una respuesta.
 *
 * `APROBADA` lleva fecha porque una política sin fecha no se puede auditar:
 * el día que cambie hay que saber desde cuándo decíamos lo anterior.
 * `PENDIENTE` lleva `falta` porque «pendiente» a secas no es accionable.
 */
export type Decision =
  | { estado: 'APROBADA'; fecha: string }
  | { estado: 'PENDIENTE'; falta: string }

export type Pregunta = {
  /** El ancla, estable: se usa como `id` del panel y del botón. */
  id: string
  q: string
  /** Párrafos. Dos como mucho: una FAQ que necesita tres no es una FAQ. */
  a: readonly string[]
  /** Enlace a la superficie que desarrolla la respuesta. Opcional. */
  enlace?: { href: string; texto: string }
  /** Sólo en las preguntas que dependen de una política comercial. */
  decision?: Decision
}

export const FAQ: readonly Pregunta[] = [
  {
    id: 'precio',
    q: '¿Cuánto cuesta trabajar con VELIA?',
    decision: { estado: 'APROBADA', fecha: '2026-09-29' },
    a: [
      'No hay una tarifa universal, y tampoco una oculta: el precio se define a medida para cada proyecto, según su alcance, las capacidades que se incorporan, las integraciones que hacen falta y el nivel de operación que pide el caso. Poner en orden la base digital de un negocio y, además, automatizar su captación y operarla, no cuestan lo mismo.',
      'Lo que sí es fijo es el orden: primero se entiende el contexto y se define el alcance; el número sale de ahí, por escrito y antes de empezar. Nunca al revés.',
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
    decision: { estado: 'APROBADA', fecha: '2026-09-29' },
    a: [
      'La operación recurrente puede finalizar con un preaviso de 30 días. VELIA no aplica una permanencia obligatoria por defecto, y la duración y el preaviso concretos de cada servicio son los que figuren en la propuesta aceptada.',
      'Algunos proyectos, servicios de terceros o compromisos específicos pueden tener condiciones particulares: se detallan antes de empezar, no al salir. Al finalizar, VELIA coordina la transición de los servicios y activos que correspondan según el alcance contratado.',
    ],
    enlace: { href: '/terminos', texto: 'Términos del servicio' },
  },
  {
    id: 'propiedad',
    q: '¿Qué ocurre con mi web, mis datos, mis contenidos y mis automatizaciones?',
    decision: { estado: 'APROBADA', fecha: '2026-09-29' },
    a: [
      'Son tres cosas distintas y conviene no mezclarlas. Lo tuyo sigue siendo tuyo: el dominio, la marca, los contenidos, las cuentas a tu nombre y los datos de tu negocio y de tus clientes. VELIA los trata como encargado del tratamiento y, al terminar, puedes pedir su exportación completa.',
      'La infraestructura y las capacidades con las que VELIA opera —su plano de control, sus componentes reutilizables y sus herramientas internas— son de VELIA y no se transfieren al finalizar la relación. Y los servicios de terceros se rigen por quién sea su titular y por el acuerdo de cada uno. Saber quién controla cada pieza no debería depender de la memoria de nadie: queda documentado.',
    ],
    enlace: { href: '/terminos', texto: 'Términos del servicio' },
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
      'Termina el proyecto y empieza la operación recurrente, que es otra cosa y se contrata aparte: vigilar que siga funcionando, arreglar lo que se rompe, ajustar lo que ya no encaja y medir. Lo que añade capacidades nuevas no es operación, es una ampliación, y también va por su lado.',
      'Un sistema digital no se queda como se entregó. Los proveedores cambian sus reglas, las integraciones se caen y los datos se ensucian. Sin nadie detrás no se mantiene igual: se degrada, y casi siempre en silencio.',
    ],
  },
] as const

/**
 * El estado de las políticas comerciales publicadas. Para buscar y auditar,
 * no para pintar.
 *
 * `PENDIENTES` vacío el 29-sep-2026: precio, salida y propiedad quedaron
 * aprobadas ese día. Sigue existiendo porque la siguiente pregunta comercial
 * nacerá pendiente, y porque una lista vacía dice algo —«no queda nada
 * abierto»— que la ausencia de lista no dice.
 */
export const FAQ_PENDIENTES = FAQ.filter(p => p.decision?.estado === 'PENDIENTE').map(p => p.id)
export const FAQ_APROBADAS = FAQ.filter(p => p.decision?.estado === 'APROBADA').map(p => p.id)
