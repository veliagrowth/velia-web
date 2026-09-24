/**
 * Las cuatro capacidades de VELIA, y lo que se publica de cada una.
 *
 * ── POR QUE EXISTE ESTE FICHERO (24-sep-2026) ─────────────────────────────
 * `AI Search & Digital Visibility` tenia su pagina —`/ai-search`— y las otras
 * tres no. Desde la Home se podia entrar a entender una de las cuatro, y las
 * demas se quedaban en un titular y una lista de piezas. La asimetria se
 * defendio en su dia con un argumento correcto: no se enlaza a una pagina que
 * no existe. La respuesta no era quitar el enlace, era escribir las paginas.
 *
 * ── LA REGLA DE LO QUE SE PUEDE ESCRIBIR AQUI ─────────────────────────────
 * Cada linea describe LO QUE VELIA HACE, no lo que consigue. Ni una cifra, ni
 * un porcentaje, ni un plazo, ni una garantia, ni un cliente. No porque no haya
 * resultados, sino porque un resultado publicado necesita una fuente detras y
 * estas paginas no la tienen: describen un servicio, no un caso medido.
 *
 * Si algun dia hace falta afirmar un resultado, va por `lib/verified-claims.ts`
 * con su fuente y su fecha, como todo lo demas de esta web.
 *
 * ── QUE NO ENTRA ──────────────────────────────────────────────────────────
 * · Nombres de proveedores, servidores o servicios. Se comunica CAPACIDAD, no
 *   arquitectura: una web que describe su propia infraestructura le esta
 *   escribiendo el plano a otro.
 * · Vocabulario de un vertical. Ni despachos, ni expedientes, ni sectores:
 *   estas cuatro capacidades son las mismas para cualquier negocio, y ese es
 *   justamente el argumento.
 * · Funcionalidades de producto. VELIA no vende una herramienta.
 */

export type Capacidad = {
  /** La ruta, sin barra inicial. */
  slug: string
  /** El nombre propio. En ingles porque la direccion los fijo asi (§8). */
  nombre: string
  /** El titular de la pagina. Una frase, sin adjetivos. */
  titular: string
  descripcion: string
  /** Que significa, en dos o tres frases. */
  queEs: readonly string[]
  /** Que cambia para una empresa. Cada linea, un cambio concreto. */
  queCambia: readonly string[]
  /** Como lo trabaja VELIA. El metodo, no el catalogo. */
  comoSeTrabaja: readonly string[]
  /** Que incluye. Las mismas piezas que la Home, sin inventar ninguna. */
  incluye: readonly string[]
  /** Que queda funcionando cuando esto esta hecho. */
  resultado: string
}

export const CAPACIDADES_PAGINA: readonly Capacidad[] = [
  {
    slug: 'digital-foundation',
    nombre: 'Digital Foundation',
    titular: 'Qué es Digital Foundation y por qué casi todo lo demás depende de ella',
    descripcion:
      'Qué es la base digital de una empresa: web, dominio, alojamiento, datos, CRM e integraciones. Qué cambia cuando existe de verdad y cómo la construye VELIA.',
    queEs: [
      'Es la capa sobre la que se apoya todo lo demás: dónde vive la web, quién controla el dominio, dónde quedan los datos de quien contacta y cómo hablan entre sí las herramientas que ya usa el negocio.',
      'No es un proyecto que se entrega y se cierra. Es el suelo. Cuando está mal puesto, cada cosa que se construye encima hereda el problema, y el síntoma aparece siempre en otro sitio: una campaña que no se puede medir, un contacto que se pierde, una web que nadie puede cambiar sin llamar a alguien.',
    ],
    queCambia: [
      'El negocio deja de depender de accesos que están a nombre de un tercero que ya no trabaja con él.',
      'Lo que ocurre en la web se puede medir, porque hay algo midiéndolo y alguien mirándolo.',
      'Quien contacta entra en un sitio y no en cinco: un formulario, una bandeja, un teléfono y una hoja de cálculo dejan de ser cuatro verdades distintas.',
      'Cambiar algo deja de ser un encargo con presupuesto y pasa a ser una tarea.',
    ],
    comoSeTrabaja: [
      'Primero se mira lo que ya hay. Casi ningún negocio parte de cero, y lo que existe suele funcionar a medias: el trabajo empieza por saber qué se conserva, qué se conecta y qué estorba.',
      'Se construye lo que falta y se conecta con lo que se queda. La integración no es un añadido del final: es la mitad del trabajo.',
      'Se deja documentado quién controla cada pieza. Un sistema del que nadie tiene las llaves no es del negocio.',
    ],
    incluye: [
      'Web y arquitectura',
      'Dominio y alojamiento',
      'Analítica y tracking',
      'CRM',
      'Integraciones',
      'Identidad digital',
    ],
    resultado:
      'Una base sobre la que se puede construir sin rehacerla: con sus accesos en orden, sus datos en un sitio y sus piezas hablando entre ellas.',
  },
  {
    slug: 'growth-automation',
    nombre: 'Growth & Automation',
    titular: 'Qué es Growth & Automation y qué cambia cuando el trabajo repetido deja de hacerse a mano',
    descripcion:
      'Qué es la automatización aplicada a la captación y al seguimiento: qué se automatiza, qué no conviene automatizar y cómo lo trabaja VELIA.',
    queEs: [
      'Es el camino que recorre alguien desde que muestra interés hasta que se convierte en cliente, y el trabajo que ese camino genera todos los días.',
      'Automatizar no es quitar personas de en medio: es quitar de en medio lo que no necesita a una persona. Copiar un dato de un sitio a otro, acordarse de escribir a alguien, revisar si falta algo. Lo que sí necesita a una persona —decidir, negociar, entender un caso raro— sigue necesitándola, y conviene que le llegue con contexto.',
    ],
    queCambia: [
      'Quien pregunta recibe respuesta, y no depende de que ese día alguien estuviera mirando.',
      'El seguimiento deja de vivir en la cabeza de una persona y deja rastro: en qué punto está cada conversación y qué toca ahora.',
      'Lo repetido se ejecuta solo y deja registro de lo que hizo y de lo que no pudo hacer, que es la parte que importa cuando algo falla.',
      'El equipo dedica su tiempo a lo que sólo puede hacer el equipo.',
    ],
    comoSeTrabaja: [
      'Se empieza por dibujar el proceso como es de verdad, no como debería ser. La versión oficial de un proceso y la que se ejecuta rara vez coinciden, y lo que se automatiza es la segunda.',
      'Se automatiza por partes y se comprueba el efecto de cada una. Un proceso automatizado entero de golpe no se puede depurar: cuando falla, falla en algún sitio.',
      'Se decide explícitamente qué NO se automatiza. Hay decisiones que deben seguir siendo de una persona, y conviene que esté escrito cuáles.',
    ],
    incluye: [
      'Captación',
      'Seguimiento',
      'Cualificación',
      'Automatización de procesos',
      'Conversión',
    ],
    resultado:
      'Un proceso que corre solo en su parte mecánica, que avisa cuando algo se atasca y que deja a las personas el trabajo que requiere criterio.',
  },
  {
    slug: 'digital-operations',
    nombre: 'Digital Operations',
    titular: 'Qué es Digital Operations y por qué un sistema sin nadie detrás se degrada',
    descripcion:
      'Qué significa operar un sistema digital: vigilarlo, medirlo, corregirlo y ampliarlo mientras el negocio lo necesite. Qué incluye y cómo lo trabaja VELIA.',
    queEs: [
      'Es quedarse. Cuando el proyecto termina, el sistema empieza: hay que mirar que siga funcionando, arreglar lo que se rompe, ajustar lo que ya no encaja y ampliarlo cuando el negocio cambia.',
      'Un sistema digital no se queda como se entregó. Los proveedores cambian sus reglas, las integraciones se caen, los datos se ensucian y las necesidades se mueven. Sin nadie detrás no se mantiene igual: se degrada, y casi siempre en silencio.',
    ],
    queCambia: [
      'Cuando algo se rompe, alguien se entera antes que el cliente.',
      'Hay una respuesta a «¿esto está funcionando?» que no es una opinión.',
      'Lo que deja de servir se cambia, en vez de quedarse ahí porque ya estaba.',
      'El sistema crece con el negocio en vez de convertirse en lo que hay que sustituir dentro de tres años.',
    ],
    comoSeTrabaja: [
      'Se vigila el efecto, no la ejecución. Que un proceso se haya ejecutado no significa que haya producido el resultado que prometía, y esa distinción es la que separa un sistema operado de uno que sólo está encendido.',
      'Lo que falla se arregla en su causa y se busca si el mismo fallo está en otro sitio. Reparar sólo el caso que se vio es garantizar que vuelve.',
      'Se mide lo que se usa. Una funcionalidad que nadie toca no se mantiene por simetría: se retira o se arregla.',
    ],
    incluye: [
      'Monitorización',
      'Medición',
      'Mantenimiento',
      'Optimización continua',
      'Evolución',
    ],
    resultado:
      'Un sistema del que alguien responde: vigilado, corregido y ampliado mientras el negocio lo necesite.',
  },
]

export function capacidadPorSlug(slug: string) {
  return CAPACIDADES_PAGINA.find(c => c.slug === slug)
}
