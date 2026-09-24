/**
 * Los datos del especimen de VELIA OS que asoma en el hero de la Home.
 *
 * ── TODO LO DE ESTE FICHERO ES FICTICIO, Y ESO ES EL CONTRATO ─────────────
 * Ni una fila sale de produccion. No hay llamada a Supabase, no hay endpoint,
 * no hay `fetch`: el especimen es un componente con un objeto literal dentro, y
 * por eso se puede prerenderizar, no puede fallar y no puede filtrar nada.
 *
 * La razon no es tecnica, es de riesgo. Las capturas reales del portal llevan
 * dentro el trabajo de un cliente en produccion —expedientes, contactos,
 * importes—, y publicarlas en la home seria publicar eso. `components/Casos.tsx`
 * ya declara por que no hay imagenes de los proyectos; esto es la misma regla
 * aplicada al producto.
 *
 * ── PERO NO ES UN MOCKUP DE MARKETING ─────────────────────────────────────
 * El encargo lo dice con todas las letras: los datos son inventados, el
 * VOCABULARIO no. Los modulos, los estados y la forma de las fichas salen del
 * portal real, para que la demo sirva ademas como direccion de diseno del
 * producto y no como una postal que el producto nunca alcanzara.
 *
 * Lo que se ha respetado del portal, y se comprueba abriendolo:
 *   · un espacio de trabajo por cliente, con VELIA como espacio propio;
 *   · los modulos son capacidades, no pantallas de un menu de SaaS;
 *   · un proyecto tiene estado y avance, no una barra de progreso decorativa;
 *   · la actividad es lo ultimo que paso, con su hora, no un feed infinito.
 *
 * ── LOS NUMEROS ───────────────────────────────────────────────────────────
 * Los cuatro clientes son clientes reales de VELIA y sus NOMBRES son publicos
 * —ya estan en `lib/casos.ts`, con su dominio—. Las CIFRAS que se les ponen
 * aqui dentro no: son de demostracion, y estan elegidas para que la escena se
 * lea, no para afirmar nada. Ninguna cifra de este fichero puede usarse en un
 * texto comercial, y no hay ni una sola de resultado —ni ventas, ni ROI, ni
 * conversion, ni porcentaje de mejora—. Un numero de trabajo en curso («12
 * tareas abiertas») describe una pantalla; un numero de resultado afirmaria
 * algo sobre el negocio de otro.
 *
 * Nada de lo de aqui es dato personal: no hay correos, ni telefonos, ni
 * direcciones, ni nombres de clientes finales, ni documentos, ni importes.
 */

/** Los modulos del especimen. El orden es el de la barra lateral. */
export const MODULOS = [
  { id: 'resumen', nombre: 'Resumen' },
  { id: 'trabajo', nombre: 'Trabajo' },
  { id: 'contenido', nombre: 'Contenido' },
  { id: 'visibilidad', nombre: 'Visibilidad' },
  { id: 'automatizacion', nombre: 'Automatización' },
] as const

export type ModuloId = (typeof MODULOS)[number]['id']

/**
 * El estado de un proyecto. Son tres y no cinco a proposito: en una ventana de
 * 560 px de alto, un vocabulario de cinco estados se convierte en cinco colores
 * que nadie distingue.
 */
export type EstadoProyecto = 'operando' | 'en-curso' | 'revision'

export type Metrica = {
  etiqueta: string
  valor: string
  /** Una linea de contexto. Sin ella una cifra suelta no dice nada. */
  nota: string
}

export type Proyecto = {
  nombre: string
  estado: EstadoProyecto
  /** Lo que se ve al seleccionarlo. Una frase, no una ficha. */
  detalle: string
  /** 0-100. Para `operando` no se pinta: lo operado no tiene barra de avance. */
  avance: number
  /** En que modulos aparece. `resumen` los ve todos y no se declara. */
  modulos: readonly ModuloId[]
}

export type Actividad = {
  /** Hora relativa, fija. No se calcula con `Date`: cambiaria en cada render. */
  cuando: string
  texto: string
  modulos: readonly ModuloId[]
}

export type Espacio = {
  id: string
  nombre: string
  /** La capacidad VELIA dominante. Es el vocabulario publico de la web. */
  capacidad: string
  /** Dos letras para el conmutador. Se escriben, no se derivan: «THE DROP
   *  AGENCY» daria «TH», y la inicial util de esa marca es la D. */
  sigla: string
  /** Lo que se lee bajo el nombre en el encabezado de la ventana. */
  rotulo: string
  metricas: Readonly<Record<ModuloId, readonly Metrica[]>>
  proyectos: readonly Proyecto[]
  actividad: readonly Actividad[]
}

/* Atajo local: casi todo proyecto y casi toda actividad pertenecen a mas de un
   modulo, y escribir el array entero cuatro veces por espacio llenaba el
   fichero de ruido. `TODOS` es «esto se ve mire donde mire». */
const TODOS = ['resumen', 'trabajo', 'contenido', 'visibilidad', 'automatizacion'] as const

export const ESPACIOS: readonly Espacio[] = [
  {
    id: 'consul-juridico',
    nombre: 'Cónsul Jurídico',
    capacidad: 'Digital Operations',
    sigla: 'CJ',
    rotulo: 'Entorno completo · despacho y gestoría',
    metricas: {
      resumen: [
        { etiqueta: 'Tareas abiertas', valor: '12', nota: 'Cuatro entran hoy' },
        { etiqueta: 'Automatizaciones', valor: '4', nota: 'Activas, sin incidencias' },
        { etiqueta: 'Visibilidad', valor: 'Estable', nota: 'Sin caídas esta semana' },
      ],
      trabajo: [
        { etiqueta: 'Tareas abiertas', valor: '12', nota: 'Tres esperan al cliente' },
        { etiqueta: 'Vencen esta semana', valor: '5', nota: 'Ninguna fuera de plazo' },
        { etiqueta: 'Cerradas en 7 días', valor: '19', nota: 'Ritmo sostenido' },
      ],
      contenido: [
        { etiqueta: 'Piezas publicadas', valor: '6', nota: 'Este mes' },
        { etiqueta: 'En revisión', valor: '2', nota: 'Esperan aprobación' },
        { etiqueta: 'Canales', valor: '3', nota: 'Web, boletín y perfil' },
      ],
      visibilidad: [
        { etiqueta: 'Estado', valor: 'Estable', nota: 'Sin caídas esta semana' },
        { etiqueta: 'Páginas vigiladas', valor: '24', nota: 'Comprobadas cada hora' },
        { etiqueta: 'Fichas al día', valor: '4', nota: 'Datos y horarios revisados' },
      ],
      automatizacion: [
        { etiqueta: 'Flujos activos', valor: '4', nota: 'Sin incidencias' },
        { etiqueta: 'Ejecuciones hoy', valor: '38', nota: 'Todas con efecto' },
        { etiqueta: 'Avisos abiertos', valor: '0', nota: 'Nada que atender' },
      ],
    },
    proyectos: [
      {
        nombre: 'Portal de clientes',
        estado: 'operando',
        detalle:
          'Sus clientes entran a ver asuntos, citas y mensajes. Operado por VELIA desde que se entregó.',
        avance: 100,
        modulos: TODOS,
      },
      {
        nombre: 'Captación y primer contacto',
        estado: 'operando',
        detalle: 'Quien pregunta entra, se clasifica y llega a la persona correcta sin pasos manuales.',
        avance: 100,
        modulos: ['trabajo', 'automatizacion'],
      },
      {
        nombre: 'Agenda y recordatorios',
        estado: 'en-curso',
        detalle: 'Las citas avisan solas. Queda cerrar el aviso de segunda visita.',
        avance: 72,
        modulos: ['trabajo', 'automatizacion'],
      },
      {
        nombre: 'Contenido del despacho',
        estado: 'revision',
        detalle: 'Seis piezas listas; dos esperan el visto bueno del despacho antes de publicarse.',
        avance: 85,
        modulos: ['contenido', 'visibilidad'],
      },
    ],
    actividad: [
      { cuando: 'Hace 8 min', texto: 'Cita confirmada y recordatorio programado', modulos: ['trabajo', 'automatizacion'] },
      { cuando: 'Hace 40 min', texto: 'Nueva consulta clasificada y asignada', modulos: ['trabajo', 'automatizacion'] },
      { cuando: 'Hace 2 h', texto: 'Pieza publicada en la web del despacho', modulos: ['contenido', 'visibilidad'] },
      { cuando: 'Ayer', texto: 'Revisión semanal de fichas y horarios', modulos: ['visibilidad'] },
    ],
  },
  {
    id: 'krea-hogar',
    nombre: 'KREA HOGAR',
    capacidad: 'Growth & Automation',
    sigla: 'KH',
    rotulo: 'Comercio y presencia digital · sofás y colchones',
    metricas: {
      resumen: [
        { etiqueta: 'Oportunidades', valor: '8', nota: 'Abiertas esta semana' },
        { etiqueta: 'Proyectos activos', valor: '3', nota: 'Ninguno parado' },
        { etiqueta: 'Tienda', valor: 'Shopify', nota: 'A medida de su sector' },
      ],
      trabajo: [
        { etiqueta: 'Oportunidades', valor: '8', nota: 'Cinco llegaron de la tienda' },
        { etiqueta: 'Proyectos activos', valor: '3', nota: 'Ninguno parado' },
        { etiqueta: 'Pendientes de respuesta', valor: '2', nota: 'Menos de 24 h' },
      ],
      contenido: [
        { etiqueta: 'Fichas de producto', valor: '46', nota: 'Con foto y medidas' },
        { etiqueta: 'Piezas del mes', valor: '9', nota: 'Tienda y perfiles' },
        { etiqueta: 'En revisión', valor: '1', nota: 'Campaña de temporada' },
      ],
      visibilidad: [
        { etiqueta: 'Estado', valor: 'Estable', nota: 'Tienda y ficha local' },
        { etiqueta: 'Páginas vigiladas', valor: '31', nota: 'Catálogo incluido' },
        { etiqueta: 'Ficha local', valor: 'Al día', nota: 'Horarios y fotos' },
      ],
      automatizacion: [
        { etiqueta: 'Flujos activos', valor: '5', nota: 'Pedido, aviso y seguimiento' },
        { etiqueta: 'Ejecuciones hoy', valor: '61', nota: 'Todas con efecto' },
        { etiqueta: 'Avisos abiertos', valor: '1', nota: 'Stock de un modelo' },
      ],
    },
    proyectos: [
      {
        nombre: 'Tienda a medida',
        estado: 'operando',
        detalle:
          'Shopify construido para cómo se vende un sofá: medidas, telas y plazos. VELIA lo mantiene y lo despliega.',
        avance: 100,
        modulos: TODOS,
      },
      {
        nombre: 'Catálogo y fichas',
        estado: 'en-curso',
        detalle: 'Cuarenta y seis fichas al día. Entran las novedades de temporada según llegan a tienda.',
        avance: 64,
        modulos: ['contenido', 'visibilidad'],
      },
      {
        nombre: 'Campañas y seguimiento',
        estado: 'operando',
        detalle: 'Quien pregunta por un modelo recibe respuesta y seguimiento sin que nadie lo recuerde.',
        avance: 100,
        modulos: ['trabajo', 'automatizacion'],
      },
    ],
    actividad: [
      { cuando: 'Hace 15 min', texto: 'Pedido registrado y aviso enviado a tienda', modulos: ['trabajo', 'automatizacion'] },
      { cuando: 'Hace 1 h', texto: 'Tres fichas de producto actualizadas', modulos: ['contenido', 'visibilidad'] },
      { cuando: 'Hace 3 h', texto: 'Aviso de stock bajo en un modelo', modulos: ['automatizacion'] },
      { cuando: 'Ayer', texto: 'Campaña de temporada preparada para revisión', modulos: ['contenido'] },
    ],
  },
  {
    id: 'method-numbers',
    nombre: 'METHOD NUMBERS',
    capacidad: 'Digital Foundation',
    sigla: 'MN',
    rotulo: 'Marca y lanzamientos · web operada',
    metricas: {
      resumen: [
        { etiqueta: 'Proyectos', valor: '5', nota: 'Uno por lanzamiento' },
        { etiqueta: 'Tareas', valor: '11', nota: 'Seis del próximo' },
        { etiqueta: 'Despliegues', valor: 'Solos', nota: 'Sin intervención' },
      ],
      trabajo: [
        { etiqueta: 'Tareas', valor: '11', nota: 'Seis del próximo lanzamiento' },
        { etiqueta: 'Proyectos', valor: '5', nota: 'Uno por lanzamiento' },
        { etiqueta: 'Bloqueadas', valor: '0', nota: 'Nada esperando' },
      ],
      contenido: [
        { etiqueta: 'Piezas del lanzamiento', valor: '7', nota: 'Teaser y antesala' },
        { etiqueta: 'En revisión', valor: '3', nota: 'Esperan fecha' },
        { etiqueta: 'Publicadas', valor: '4', nota: 'Web y perfiles' },
      ],
      visibilidad: [
        { etiqueta: 'Estado', valor: 'Estable', nota: 'La web responde' },
        { etiqueta: 'Páginas vigiladas', valor: '9', nota: 'Teaser incluido' },
        { etiqueta: 'Lectura por máquinas', valor: 'Preparada', nota: 'Datos de marca al día' },
      ],
      automatizacion: [
        { etiqueta: 'Flujos activos', valor: '2', nota: 'Despliegue y avisos' },
        { etiqueta: 'Despliegues', valor: '14', nota: 'Este mes, sin tocar nada' },
        { etiqueta: 'Avisos abiertos', valor: '0', nota: 'Nada que atender' },
      ],
    },
    proyectos: [
      {
        nombre: 'Web del lanzamiento',
        estado: 'operando',
        detalle: 'La web está en pie y se despliega sola. Es exactamente lo que este encargo necesita.',
        avance: 100,
        modulos: TODOS,
      },
      {
        nombre: 'Antesala del próximo',
        estado: 'en-curso',
        detalle: 'Siete piezas preparadas. Se publican cuando la marca fije la fecha.',
        avance: 58,
        modulos: ['trabajo', 'contenido'],
      },
      {
        nombre: 'Identidad legible por máquinas',
        estado: 'revision',
        detalle: 'Los datos de marca están al día; queda revisar cómo se declara el próximo lanzamiento.',
        avance: 80,
        modulos: ['visibilidad'],
      },
    ],
    actividad: [
      { cuando: 'Hace 25 min', texto: 'Despliegue completado sin intervención', modulos: ['automatizacion'] },
      { cuando: 'Hace 4 h', texto: 'Dos piezas de antesala preparadas', modulos: ['contenido'] },
      { cuando: 'Ayer', texto: 'Datos de marca revisados', modulos: ['visibilidad'] },
      { cuando: 'Hace 2 días', texto: 'Teaser actualizado en la web', modulos: ['trabajo', 'contenido'] },
    ],
  },
  {
    id: 'the-drop-agency',
    nombre: 'THE DROP AGENCY',
    capacidad: 'Digital Operations',
    sigla: 'TD',
    rotulo: 'Management y producción audiovisual',
    metricas: {
      resumen: [
        { etiqueta: 'Flujos activos', valor: '6', nota: 'Producción y entrega' },
        { etiqueta: 'Proyectos', valor: '4', nota: 'Dos rodando' },
        { etiqueta: 'Entregas', valor: '2', nota: 'Esta semana' },
      ],
      trabajo: [
        { etiqueta: 'Proyectos', valor: '4', nota: 'Dos rodando' },
        { etiqueta: 'Entregas', valor: '2', nota: 'Esta semana' },
        { etiqueta: 'Esperando material', valor: '1', nota: 'Rodaje de mañana' },
      ],
      contenido: [
        { etiqueta: 'Piezas en montaje', valor: '5', nota: 'Dos para redes' },
        { etiqueta: 'Entregadas', valor: '12', nota: 'Este mes' },
        { etiqueta: 'En revisión', valor: '2', nota: 'Esperan al artista' },
      ],
      visibilidad: [
        { etiqueta: 'Estado', valor: 'Estable', nota: 'Perfiles y web' },
        { etiqueta: 'Piezas publicadas', valor: '12', nota: 'Este mes' },
        { etiqueta: 'Canales', valor: '4', nota: 'Con calendario propio' },
      ],
      automatizacion: [
        { etiqueta: 'Flujos activos', valor: '6', nota: 'Producción y entrega' },
        { etiqueta: 'Ejecuciones hoy', valor: '22', nota: 'Todas con efecto' },
        { etiqueta: 'Avisos abiertos', valor: '0', nota: 'Nada que atender' },
      ],
    },
    proyectos: [
      {
        nombre: 'Producción y entrega',
        estado: 'operando',
        detalle: 'Cada pieza sale del montaje a su canal con el mismo camino. Seis flujos lo sostienen.',
        avance: 100,
        modulos: TODOS,
      },
      {
        nombre: 'Calendario de publicación',
        estado: 'en-curso',
        detalle: 'Cuatro canales con su ritmo. Falta encajar el del próximo lanzamiento.',
        avance: 61,
        modulos: ['contenido', 'visibilidad'],
      },
      {
        nombre: 'Material de rodaje',
        estado: 'revision',
        detalle: 'El material del rodaje de mañana entra esta tarde. Todo lo demás está cerrado.',
        avance: 45,
        modulos: ['trabajo'],
      },
    ],
    actividad: [
      { cuando: 'Hace 12 min', texto: 'Pieza entregada al canal del artista', modulos: ['contenido', 'automatizacion'] },
      { cuando: 'Hace 2 h', texto: 'Montaje enviado a revisión', modulos: ['trabajo', 'contenido'] },
      { cuando: 'Hace 5 h', texto: 'Calendario de la semana confirmado', modulos: ['visibilidad'] },
      { cuando: 'Ayer', texto: 'Rodaje de mañana preparado', modulos: ['trabajo'] },
    ],
  },
]

/** Los rotulos de estado, en un solo sitio para que no diverjan. */
export const ROTULO_ESTADO: Readonly<Record<EstadoProyecto, string>> = {
  operando: 'Operando',
  'en-curso': 'En curso',
  revision: 'En revisión',
}
