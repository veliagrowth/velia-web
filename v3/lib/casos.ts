/**
 * Los proyectos que la Home enseña como trabajo real.
 *
 * ── LA REGLA DE ESTA LISTA ────────────────────────────────────────────────
 * Cada línea publicada tiene que poder demostrarse. Lo que se publica de cada
 * proyecto es: qué es (comprobable abriendo su web), qué hizo VELIA (respaldado
 * por evidencia interna) y dónde mirarlo. Nada más.
 *
 * NI UNA CIFRA. La web de la etapa agencia publicaba de estos mismos proyectos
 * «16.100 seguidores», «133K visualizaciones», «4,9★ con 153 reseñas», «de 12 a
 * 25 artistas en 4 meses» y «el 60 % del trabajo operativo corre solo». Las
 * capturas de las tres primeras siguen en el repositorio (`img/cases/`), así que
 * existieron; pero son cifras de plataformas de terceros, de julio de 2026, que
 * hoy nadie puede comprobar desde fuera, y las dos últimas no tienen detrás
 * ninguna evidencia localizable. Un número que no se puede comprobar no es una
 * prueba: es una afirmación. Aquí no hay ninguno.
 *
 * ── `evidencia`: PARA TRABAJO INTERNO, NO SE PINTA ────────────────────────
 * Dice cuánta evidencia respalda lo que se publica de cada proyecto, para que
 * la próxima revisión sepa dónde mirar primero:
 *
 *   'documentado' la relación con VELIA está respaldada por evidencia interna
 *                 localizable (repositorio, infraestructura, cliente activo).
 *   'parcial'     hay evidencia de un trabajo, pero acotada en el tiempo o en
 *                 su alcance. Se publica la versión mínima y en pasado.
 *
 * Si algún día un proyecto no llegara ni a 'parcial', no se publica: un caso
 * simple y honesto es mejor que una historia completa inventada.
 *
 * ── QUÉ CAMBIÓ EL 24-sep-2026 (tarde) ────────────────────────────────────
 * Sale el campo `entorno` entero, con su booleano y su punto. Contaba, proyecto
 * a proyecto, qué NO tenía cada uno —«sin entorno», «sin portal»— y después, ya
 * en positivo, qué sí. Las dos versiones compartían el mismo defecto: hablaban
 * del alcance del encargo, que es una conversación interna, delante de alguien
 * que ha venido a ver trabajo. Un proyecto se presenta por lo que es, no por lo
 * que no incluyó.
 *
 * Lo que se pierde —la idea de que se construye sólo el escalón que hace falta—
 * no se pierde: es la sección `#entorno` de la Home entera, sostenida por el
 * claim `modularEnvironment`. Aquí sobraba.
 *
 * Y KREA HOGAR deja de describirse por su tienda. El valor no es que VELIA le
 * haya hecho un comercio: es que su infraestructura está VIVA y operada, y por
 * eso el negocio no paga por mantener algo que sólo existe. La palabra Shopify
 * sale del texto público: nombra una herramienta, y lo que se vende no es la
 * herramienta.
 */

export type Caso = {
  nombre: string
  /** Sin protocolo: es a la vez el texto visible del enlace y su destino. */
  dominio: string
  /** Qué es, comprobable abriendo esa web. */
  que: string
  /** Qué hizo o hace VELIA. Respaldado por evidencia interna. */
  velia: string
  /** Rótulo corto del tipo de trabajo. */
  tipo: string
  /** Qué es esta organización PARA VELIA. Decide si se publica. Ver `Relacion`. */
  relacion: Relacion
  /**
   * El caso que MANDA en la composición. Sólo uno. Ocupa la fila entera y se
   * pinta más grande; el resto son contrapunto.
   *
   * No es un capricho de maquetación: celdas iguales piden comparar proyectos
   * que no son comparables —uno es un cliente con infraestructura operada y
   * otro un trabajo creativo puntual—, y la web lo dijo durante meses en un
   * comentario mientras los pintaba iguales.
   */
  principal?: true
  evidencia: 'documentado' | 'parcial'
}

/**
 * La relación REAL con VELIA. Fijada el 5-oct-2026 después de medirla contra la
 * base de producción y el repositorio, porque la rejilla pintaba cuatro cosas
 * distintas como si fueran la misma.
 *
 *   'CLIENT'     relación VELIA confirmada y operativa: tenant, fila en
 *                `clients`, datos y portal. Hoy sólo Cónsul Jurídico.
 *   'ECOSYSTEM'  VELIA opera o mantiene una superficie digital real para esa
 *                organización, aunque «cliente» no sea la palabra exacta en
 *                toda superficie. Hoy METHOD NUMBERS.
 *   'PROJECT'    trabajo real hecho por VELIA sin cliente operativo actual.
 *   'RELATED'    persona o empresa relacionada con VELIA, FUERA del perímetro
 *                de cliente. Incluye los ventures propios de los socios.
 *
 * ⚠️ `RELATED` y `PROJECT` **no se publican**. Presentarlos en la misma rejilla
 * que un cliente de pago afirma una relación comercial que no existe. Se quedan
 * en este fichero porque el historial de trabajo no se borra —son encargos
 * reales, con evidencia— pero no salen a la calle como clientes.
 */
export type Relacion = 'CLIENT' | 'ECOSYSTEM' | 'PROJECT' | 'RELATED'

/** Las dos relaciones que la Home puede afirmar en público. */
const PUBLICABLES: readonly Relacion[] = ['CLIENT', 'ECOSYSTEM']

export function esPublicable(c: Caso): boolean {
  return PUBLICABLES.includes(c.relacion)
}

export const CASOS: readonly Caso[] = [
  {
    nombre: 'Cónsul Jurídico',
    dominio: 'consuljuridico.com',
    que: 'Despacho y gestoría en Fraga (Huesca): extranjería y nacionalidad, mercantil, laboral y familia.',
    velia:
      'Cliente. VELIA construyó su infraestructura —captación, expedientes, documentos, agenda y un portal para sus propios clientes— y la sigue operando.',
    tipo: 'Infraestructura construida y operada',
    relacion: 'CLIENT',
    principal: true,
    evidencia: 'documentado',
  },
  {
    nombre: 'METHOD NUMBERS',
    dominio: 'method9989.com',
    que: 'Marca y lanzamientos. Hoy su web es el teaser del próximo.',
    /* Medido el 5-oct: tenant `method-9989`, web en producción servida por VELIA
       (`9989-web` → `method9989.com` y `www.`), y subdominio de portal. Lo que
       NO tiene es actividad de portal: 0 casos, 0 contactos, 0 hilos. Por eso el
       texto habla de la web, que es lo demostrable, y no de operación. */
    velia: 'VELIA construye y mantiene la web, y despliega cada cambio.',
    tipo: 'Web construida y mantenida',
    relacion: 'ECOSYSTEM',
    evidencia: 'documentado',
  },

  /* ── NO SE PUBLICAN ────────────────────────────────────────────────────────
     Siguen aquí porque el trabajo fue real y el historial no se borra. No salen
     a la Home porque la rejilla afirmaría una relación de cliente que no existe.
     Medido el 5-oct-2026 contra `tenants`, `clients`, Coolify y GitHub. */
  {
    nombre: 'KREA HOGAR',
    dominio: 'kreahogar.com',
    que: 'Sofás y colchones fabricados en España. Tienda en Lleida y venta online.',
    /* ⚠️ ESTE TEXTO AFIRMABA, EN PRESENTE: «Su infraestructura digital no es algo
       entregado y terminado: está viva. VELIA la mantiene, la mejora y la opera
       —catálogo, ofertas, contenido y la relación con sus clientes—».
       Retirado el 5-oct-2026. No hay evidencia de nada de eso: sin tenant, sin
       fila en `clients`, sin portal, sin app en Coolify, sin repositorio y sin
       memoria propia. Su único rastro son capturas de la etapa agencia en
       `img/cases/krea-hogar/`, un fixture de test en el portal, y correo de
       `axel@kreahogar.com` — que es un socio de VELIA, no un cliente.
       Una afirmación de operación VIVA, en presente, sostenida por eso, es
       exactamente lo que esta lista prohíbe en su primera línea. */
    velia: 'VELIA trabajó en su presencia digital y su comercio online.',
    tipo: 'Presencia digital y comercio',
    relacion: 'RELATED',
    evidencia: 'parcial',
  },
  {
    nombre: 'THE DROP AGENCY',
    dominio: 'thedrop.agency',
    que: 'Agencia creativa y de management de artistas.',
    /* No es cliente de VELIA, y su propia memoria interna lo dice literalmente:
       «agencia creativa propia de Joaquín, distinta de VELIA». Es un venture de
       un socio. El trabajo existe y está documentado —storyboards del videoclip
       SACRAMENTO, 12-jul-2026— pero publicarlo como caso de cliente es
       presentar trabajo para uno mismo como tracción comercial. */
    velia: 'VELIA acompañó su producción creativa: piezas, campañas y material para sus artistas.',
    tipo: 'Trabajo creativo',
    relacion: 'RELATED',
    evidencia: 'parcial',
  },
]

/**
 * Lo que la Home pinta. Se DERIVA de la relación, no de un booleano a mano ni
 * del orden del array: así nadie publica un caso nuevo por olvidarse de un flag.
 *
 * Hoy son dos. ⛔ No se rellena hasta cuatro para que la rejilla quede simétrica:
 * dos casos verdaderos valen más que cuatro con dos inventados.
 */
export const CASOS_PUBLICOS: readonly Caso[] = CASOS.filter(esPublicable)
