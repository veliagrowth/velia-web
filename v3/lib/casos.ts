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
 * ── QUÉ CAMBIÓ EL 24-sep-2026, Y QUÉ NO ───────────────────────────────────
 * Las tres líneas de `entorno` de los proyectos sin portal empezaban por una
 * negación: «Sin entorno.», «Sin portal.», «Sin entorno todavía. La
 * transformación está prevista, no hecha.» El docstring de este mismo campo
 * lleva desde que se escribió diciendo que esto «se dice en positivo» y que
 * «no necesitó un entorno de gestión es un hecho sobre el encargo, no una
 * carencia del cliente». Los datos no obedecían a su propia regla: el texto
 * decía una cosa y las cuatro cadenas la contraria.
 *
 * Leído desde fuera, además, no describía al cliente: describía el estado de
 * desarrollo de VELIA. «Todavía», «previsto», «no hecho» son vocabulario de
 * hoja de ruta interna, y la web pública no es el sitio donde se cuentan los
 * pendientes de quien la escribe.
 *
 * LO QUE NO CAMBIA, y es lo importante: `tieneEntorno` sigue siendo el booleano
 * MEDIDO contra `tenants.active_modules` el 22-sep. Tres de los cuatro siguen
 * en `false` y su punto sigue hueco. Se ha reescrito cómo se cuenta un hecho,
 * no el hecho. Si alguien quisiera además llenar un punto, eso ya no es copy:
 * es cambiar lo que el punto significa, y entonces hay que cambiar la leyenda,
 * este comentario y la medición que los sostiene.
 *
 * ── LA PROCEDENCIA DEL SHOPIFY DE KREA HOGAR ──────────────────────────────
 * La línea del comercio a medida NO sale del repositorio: no hay evidencia
 * localizable de esa tienda en este código. Viene del briefing de Joaquín del
 * 24-sep-2026, y se publica como dirección de copy con su origen declarado
 * aquí. Por eso `evidencia` se queda en 'parcial' y por eso no lleva ni una
 * cifra detrás: ni facturación, ni conversión, ni pedidos. Si algún día hace
 * falta afirmar un resultado de esa tienda, hace falta antes la fuente.
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
  /**
   * Qué entorno VELIA tiene este proyecto — o por qué no tiene ninguno.
   *
   * ── AÑADIDO EL 22-sep-2026, Y ES LA COLUMNA QUE MÁS TRABAJO HACE ────────
   * Sin ella, los cuatro proyectos se leen como cuatro encargos equivalentes, y
   * la idea de que VELIA construye lo que hace falta y nada más se queda en una
   * frase. Con ella, la lista misma es la prueba: dos de los cuatro no tienen
   * entorno de gestión, y uno lo tiene entero.
   *
   * ⚠️ NO SE ESCRIBE DE MEMORIA. Cada línea se contrasta contra
   * `tenants.active_modules` en la base de producción (medido el 22-sep):
   * Cónsul Jurídico nueve módulos con `portal` y `legal` dentro; METHOD NUMBERS
   * tres, sin `portal`; KREA HOGAR y THE DROP AGENCY no son tenants. Decir «no
   * tiene entorno» de quien sí lo tiene sería tan falso como lo contrario, y es
   * más fácil de cometer: el impulso es rellenar las cuatro filas por simetría.
   *
   * Y se dice en positivo. «No necesitó un entorno de gestión» es un hecho sobre
   * el encargo, no una carencia del cliente.
   */
  entorno: string
  /**
   * Si este proyecto tiene entorno VELIA o no. Es un BOOLEANO y no se deduce
   * del texto: el texto se lee, esto se pinta. Alimenta el punto —lleno o
   * hueco— que traduce la frase a un golpe de vista, con el mismo lenguaje de
   * `.estado` que ya usa `/sobre-velia`.
   */
  tieneEntorno: boolean
  /**
   * El caso que MANDA en la composición. Sólo uno. Ocupa la fila entera y se
   * pinta más grande; los otros tres son contrapunto.
   *
   * No es un capricho de maquetación: cuatro celdas iguales piden comparar
   * cuatro proyectos que no son comparables —uno es un cliente con
   * infraestructura operada y otro un trabajo creativo puntual—, y la web lo
   * dice desde hace meses en un comentario mientras los pintaba iguales.
   */
  principal?: true
  evidencia: 'documentado' | 'parcial'
}

export const CASOS: readonly Caso[] = [
  {
    nombre: 'Cónsul Jurídico',
    dominio: 'consuljuridico.com',
    que: 'Despacho y gestoría en Fraga (Huesca): extranjería y nacionalidad, mercantil, laboral y familia.',
    velia:
      'Cliente. VELIA construyó su infraestructura —captación, expedientes, documentos, agenda y un portal para sus propios clientes— y la sigue operando.',
    tipo: 'Infraestructura construida y operada',
    entorno:
      'Entorno completo. El trabajo del despacho vive dentro, y sus clientes tienen el suyo para seguir asuntos, citas y mensajes.',
    tieneEntorno: true,
    principal: true,
    evidencia: 'documentado',
  },
  {
    nombre: 'KREA HOGAR',
    dominio: 'kreahogar.com',
    que: 'Sofás y colchones fabricados en España. Tienda en Lleida y venta online.',
    velia:
      'VELIA construye y opera su presencia digital y su comercio: un Shopify hecho a la medida de su sector, con la web, el contenido y las campañas alrededor.',
    tipo: 'Presencia digital y comercio',
    entorno:
      'Su tienda online es el entorno: se vende desde ahí. No necesitó además un panel de gestión interna.',
    tieneEntorno: false,
    evidencia: 'parcial',
  },
  {
    nombre: 'METHOD NUMBERS',
    dominio: 'method9989.com',
    que: 'Marca y lanzamientos. Hoy su web es el teaser del próximo.',
    velia: 'VELIA construye y mantiene la web, y despliega cada cambio.',
    tipo: 'Web construida y mantenida',
    entorno:
      'Lo que este encargo necesita es que la web esté en pie y se despliegue sola. Eso es lo que está operado.',
    tieneEntorno: false,
    evidencia: 'documentado',
  },
  {
    nombre: 'THE DROP AGENCY',
    dominio: 'thedrop.agency',
    que: 'Agencia creativa y de management de artistas.',
    velia: 'VELIA acompaña su producción creativa: piezas, campañas y el material con el que trabajan sus artistas.',
    tipo: 'Trabajo creativo',
    entorno:
      'El encargo vive en la producción, no en un panel. Lo que se opera es el trabajo creativo que sale de ahí.',
    tieneEntorno: false,
    evidencia: 'parcial',
  },
]
