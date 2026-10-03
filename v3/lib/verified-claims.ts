/**
 * Registro de afirmaciones comerciales y técnicas de la web pública.
 *
 * POR QUÉ: VELIA construye y opera la infraestructura digital de un negocio, y
 * responde de ella. Un claim que no se puede sostener no es una licencia de
 * marketing, es un riesgo. Hasta ahora la web publicaba «Facturación
 * Verifactu», «Alojado en la UE» o «+260% consultas captadas» sin que existiera
 * en ningún sitio quién lo había comprobado ni cuándo.
 *
 * ⚠️ Esta línea decía «VELIA vende software a abogados» hasta el 29-sep-2026.
 * Esa tesis quedó DEROGADA el 9-sep (VELIA_DIRECCION_2026-09.md): VELIA Legal
 * está descontinuado como producto y marca, y el vertical es una configuración.
 * Importa aquí y no es cosmética: este fichero es el que decide qué se puede
 * afirmar en público, y tres de sus claims `verified` seguían redactados en el
 * vocabulario del vertical. El gate no los habría parado: están verificados, y
 * basta con que una página los ate para que se publiquen.
 *
 * ── LA REGLA CON LA QUE SE REFORMULA UN CLAIM (4-oct-2026) ──────────────────
 * El precedente lo fijó `tenantIsolation` el 18-sep y aquí se aplica igual: un
 * claim se puede reescribir **si y sólo si el texto nuevo no afirma nada que su
 * propio `source` no demuestre ya**. Entonces no es un claim nuevo, es el mismo
 * hecho dicho sin el vocabulario de un producto retirado, y `status`, `source`,
 * `verifiedAt` y `owner` se quedan intactos. Si para quitar el vocabulario hay
 * que ensanchar el hecho, eso NO es reformular: es afirmar algo sin verificar.
 *
 *   ✅ `developedInSpain`  reformulado — el texto afirmaba ADEMÁS menos de lo
 *                          que su fuente prueba (ver su comentario).
 *   ✅ `humanSupervision`  reformulado — su `source` ya era genérico.
 *   🖐️ `officialSources`   SE QUEDA. Su fuente es el motor de jurisprudencia y
 *                          habla de citas de legislación contra BOE/EUR-Lex.
 *                          Generalizarlo a «cita sus fuentes» sería inventar
 *                          una capacidad que nadie ha verificado, y recortarlo
 *                          al vertical es una decisión de producto, no de
 *                          redacción. HUMAN_DECISION_REQUIRED. Hoy no lo ata
 *                          ninguna página (`usedIn: []`), así que no se publica.
 *
 * Y `pilotMetrics` («del despacho piloto») tampoco se toca: está `disabled` y su
 * texto es el REGISTRO de lo que se retiró. Reescribirlo falsearía el archivo.
 *
 * REGLA DURA: **solo se renderiza lo que está en `verified`.** `claim()` devuelve
 * `null` para todo lo demás, así que un claim sin verificar no se cuela por
 * descuido: desaparece de la página.
 *
 * Para verificar uno: conseguir la fuente, ponerla en `source`, fechar, firmar
 * con el responsable y pasar el estado a `verified`. No al revés.
 */

/**
 * ⚠️ 12-sep-2026 — ESTE GATE SE HA QUEDADO SIN CONSUMIDOR, Y `usedIn` MENTÍA.
 *
 * La regla de arriba («solo se renderiza lo que está en `verified`») es cierta
 * **donde se llama a `claim()`**. Medido: `claim()` tenía UN consumidor,
 * `components/SecurityArchitecture.tsx`, y al reescribir la Home dejó de
 * importarse. Ahora no lo llama nadie.
 *
 * Y lo que el registro decía de sí mismo tampoco cuadraba. Medido contra un
 * build de producción, ruta por ruta, sobre el texto visible del HTML:
 *
 *   · los CUATRO claims `verified` no se pintan en ninguna página;
 *   · TRES `pending` sí: verifactu en /seguridad y /legal, euInfrastructure en
 *     /seguridad, lecDeadlines en /legal.
 *
 * O sea, justo al revés de lo que promete la cabecera. No porque el gate
 * fallara —hacía exactamente lo suyo— sino porque las páginas que publican esos
 * textos los escriben a mano y nunca le preguntan nada.
 *
 * ✅ CERRADO EL 12-sep. `/seguridad` y `/legal` ya no escriben esos textos a
 * mano: cada bloque declara su claim y se filtra con `claim()`. Sin verificación
 * el bloque no existe, así que el gate volvió a ser el camino real y no hace
 * falta que nadie se acuerde. Medido: **0 claims `pending` publicados**.
 *
 * QUIÉN APLICA LA REGLA AHORA, en dos capas:
 *   · `npm run test:claims`  — la FUNCIÓN: verified→texto, cualquier otro→null
 *   · `npm run check:claims` — el RESULTADO:
 * (`scripts/check-claims-publicados.mjs`). Mide el HTML servido en vez de
 * confiar en que alguien llame a una función, así que es más fuerte que el gate
 * que sustituye: protege aunque el texto se escriba a mano, que es precisamente
 * como se coló. Las cuatro infracciones vivas están declaradas, con su riesgo y
 * su dueño, en `scripts/deuda-claims-publicados.json`.
 *
 * `usedIn` queda con lo MEDIDO, no con lo recordado. Un campo que dice dónde
 * revisar y apunta a páginas equivocadas es peor que no tenerlo.
 */

export type ClaimStatus = 'verified' | 'pending' | 'disabled'

export interface Claim {
  /** Texto exacto tal y como se publica. */
  text: string
  status: ClaimStatus
  /** Dónde está la prueba. Un enlace, un documento, una tabla. Nunca "lo sé". */
  source: string
  /** ISO. Fecha en que se comprobó la fuente, no en que se escribió el claim. */
  verifiedAt: string | null
  owner: string
  /**
   * Páginas que tienen un bloque ATADO a este claim — se pinte o no.
   *
   * ⚠️ NO es «páginas donde se ve». Desde el 12-sep las páginas declaran
   * `claim: '<clave>'` en el bloque correspondiente y lo filtran con `claim()`,
   * así que un `pending` está atado y no se pinta. Las dos lecturas son
   * distintas y confundirlas es tener una columna con dos contratos.
   *
   * Para qué sirve entonces: para saber qué páginas CAMBIAN el día que este
   * claim se verifique. Verificar `verifactu` enciende dos bloques, y este campo
   * dice cuáles. Lo comprueba `lib/verified-claims.test.ts` leyendo el código de
   * cada página: si aquí dice una ruta que no tiene la atadura, falla.
   *
   * Quién decide si algo LLEGA al visitante es `npm run check:claims`, que mide
   * el HTML servido.
   */
  usedIn: string[]
}

export const CLAIMS = {
  // ── Verificados ────────────────────────────────────────────────────────────
  developedInSpain: {
    /* Reformulado el 4-oct-2026. Decía «Diseñada para la práctica jurídica
       española», y ahí había DOS defectos, no uno:

         · el vocabulario del vertical retirado, que es lo que vino a corregirse;
         · y un desajuste con su propia fuente. La fuente prueba DÓNDE se
           desarrolló el producto; el texto afirmaba PARA QUÉ práctica estaba
           diseñado. Son hechos distintos, y el segundo no estaba verificado por
           el primero. La clave de la entrada (`developedInSpain`) siempre dijo
           el hecho bueno; el texto publicado, no.

       El texto nuevo dice exactamente lo que la fuente demuestra y nada más, así
       que afirma MENOS que antes. `status`, `source`, `verifiedAt` y `owner`
       intactos: el hecho verificado no se ha movido. */
    text: 'Diseñada y desarrollada en España.',
    status: 'verified',
    source: 'Producto desarrollado íntegramente por el equipo en España. Comprobable en el propio repositorio y en la facturación de la sociedad.',
    verifiedAt: '2026-07-29',
    owner: 'Joaquín',
    usedIn: [],
  },

  officialSources: {
    /* 🖐️ NO REFORMULADO el 4-oct-2026, a propósito. Es el único de los tres que
       no se puede sacar del vocabulario jurídico sin cambiar el hecho: su fuente
       es el motor de jurisprudencia, y lo que está verificado es que una cita de
       LEGISLACIÓN se resuelve contra BOE o EUR-Lex. «Cuando cita una fuente,
       enlaza al original» sonaría mejor y sería un claim distinto, sin verificar,
       sobre cualquier cita de cualquier módulo.
       Qué hacer con él —retirarlo, acotarlo a la configuración legal o verificar
       la versión ancha— es una decisión de producto. HUMAN_DECISION_REQUIRED.
       Riesgo hoy: ninguno publicado. `usedIn: []` y el único fichero que lo ata,
       `components/SecurityArchitecture.tsx`, no tiene importador. */
    text: 'Cuando cita legislación, enlaza al BOE o a EUR-Lex.',
    status: 'verified',
    source: 'Implementado en el motor de jurisprudencia: toda cita normativa se resuelve contra la fuente oficial y se publica con enlace. Ver memory/project_legal_jurisprudence.md.',
    verifiedAt: '2026-07-29',
    owner: 'Joaquín',
    usedIn: [],
  },

  tenantIsolation: {
    /* Redactado de nuevo el 18-sep: decía «Cada despacho trabaja en un entorno
       separado». El HECHO verificado no cambia ni un ápice —mismo aislamiento,
       misma fuente, misma fecha, mismo dueño—; lo que cambia es que «despacho»
       era el vocabulario del vertical legal y este claim es de la compañía. Un
       cliente de VELIA puede no ser un despacho.

       ⚠️ Lo que NO se toca al reformular un claim: `status`, `source`,
       `verifiedAt` ni `owner`. Si hubiera que mover alguno de esos, no sería una
       reformulación: sería otro claim, y necesitaría su propia verificación. */
    text: 'Cada cliente trabaja en un entorno separado.',
    status: 'verified',
    source: 'Row Level Security activo en todas las tablas tenant_* de Supabase, con políticas por tenant_id. Auditado.',
    verifiedAt: '2026-07-29',
    owner: 'Joaquín',
    /* Pasa de `[]` a publicarse en /seguridad. Estaba verificado y sin usar en
       ninguna parte: el desperdicio inverso al de publicar sin verificar. */
    usedIn: ['/seguridad'],
  },

  humanSupervision: {
    /* Reformulado el 4-oct-2026. Decía «Ningún borrador, plazo o decisión
       jurídica sustituye la revisión del abogado».

       Aquí la reformulación es la más limpia de las tres porque la fuente YA era
       genérica: «toda propuesta de VELIA requiere aprobación explícita antes de
       aplicarse». El texto publicado era esa misma regla contada en clave de
       despacho —«borrador, plazo, decisión jurídica» son los tres artefactos del
       vertical, y «el abogado» su único revisor—. El principio no es del
       vertical: es de producto, y aplica a cualquier tenant.

       El texto nuevo no ensancha nada: sigue cubierto palabra por palabra por la
       fuente, que habla de TODA propuesta y de aprobación explícita. `status`,
       `source`, `verifiedAt` y `owner` intactos. */
    text: 'Ninguna propuesta de VELIA se aplica sin que una persona la apruebe.',
    status: 'verified',
    source: 'Principio de producto. Toda propuesta de VELIA requiere aprobación explícita antes de aplicarse — verificable en la propia interfaz.',
    verifiedAt: '2026-07-29',
    owner: 'Joaquín',
    usedIn: [],
  },

  modularEnvironment: {
    /* ── EL CLAIM QUE SOSTIENE «NO SOBRECONSTRUIMOS» (22-sep-2026) ───────────
       Es el único de este registro que no describe una política ni un
       principio: describe una COLUMNA. `tenants.active_modules` decide qué
       existe en el entorno de cada cliente, y no es una convención que alguien
       recuerde respetar — la valida el trigger `trg_validate_tenant_config`
       ANTES de cada INSERT/UPDATE sobre `tenants`, contra el catálogo de
       `lib/modules.ts`, con su esquema Zod en el borde de la API.

       POR QUÉ IMPORTA QUE SEA UNA COLUMNA Y NO UN FOLLETO: «cada cliente recibe
       lo que necesita» lo dice cualquiera. Esto se puede consultar. Medido el
       22-sep-2026 contra la base de producción, contando sólo clientes reales
       —fuera los tenants de demostración, el de la propia VELIA y el canario
       sintético—:

         Cónsul Jurídico  9 módulos   monitor · email · onboarding · whatsapp ·
                                      lead-nurturing · pipeline · calendar ·
                                      portal · legal
         METHOD NUMBERS   3 módulos   email · pipeline · ecommerce

       Dos clientes reales que no comparten ni la mitad. Y uno de los dos NO
       tiene el módulo `portal` — que es justamente por lo que este claim existe:
       impide publicar «todos nuestros clientes tienen su portal», que sería
       falso y que este mismo repositorio llegó a escribir en `VeliaOS.tsx`.

       ⚠️ LO QUE ESTE CLAIM NO AUTORIZA A DECIR: nada sobre permisos, roles ni
       accesos acotados de terceros. Ése es otro hecho, con otra fuente, y hoy
       tiene un defecto abierto en el portal (ficha `7a3ed49e`). Un claim
       verificado no le presta su verificación al de al lado. */
    text: 'Cada cliente tiene activados sólo los módulos que usa.',
    status: 'verified',
    source:
      'Columna `tenants.active_modules` en la base de producción, validada por el trigger Postgres `trg_validate_tenant_config` contra el catálogo de `lib/modules.ts` (velia-portal) y por el esquema Zod `activeModulesSchema`. Medido el 22-sep-2026: Cónsul Jurídico 9 módulos, METHOD NUMBERS 3. El trigger se comprobó en `pg_trigger`, no en la documentación que dice que existe.',
    verifiedAt: '2026-09-22',
    owner: 'Joaquín',
    usedIn: ['/'],
  },

  // ── Pendientes: NO se renderizan ───────────────────────────────────────────
  noModelTraining: {
    text: 'Tratamiento empresarial bajo las condiciones de los proveedores contratados.',
    status: 'pending',
    source: 'FALTA: adjuntar la cláusula concreta del contrato con el proveedor de IA que excluye el uso de los datos para entrenamiento, con su fecha de vigencia.',
    verifiedAt: null,
    owner: 'Joaquín',
    usedIn: ['/seguridad'],
  },

  euInfrastructure: {
    text: 'Infraestructura europea.',
    status: 'pending',
    source: 'FALTA: confirmar por escrito la región de CADA proveedor de la cadena (base de datos, almacenamiento, correo, IA) y dejarlo documentado. La base de datos está en West Europe; el resto no está registrado.',
    verifiedAt: null,
    owner: 'Joaquín',
    usedIn: ['/seguridad'],
  },

  verifactu: {
    text: 'Facturación conforme a Verifactu.',
    status: 'pending',
    source: 'FALTA: verificación técnica y documental del cumplimiento del RD 1007/2023. Es un claim regulatorio: publicarlo sin respaldo expone a la sociedad.',
    verifiedAt: null,
    owner: 'Joaquín',
    /* Era `['/seguridad', '/legal']`. `/legal` se retiró el 29-sep-2026 y con
       ella su atadura, así que declararla aquí sería decir que verificar este
       claim enciende un bloque que ya no existe. El claim NO cambia: sigue
       `pending`, con su misma fuente, fecha y dueño. */
    usedIn: ['/seguridad'],
  },

  lecDeadlines: {
    text: 'Cómputo de plazos procesales según la LEC.',
    status: 'pending',
    source: 'FALTA: acotar el alcance exacto — qué plazos cubre, qué jurisdicciones, qué hace con los días inhábiles autonómicos. Hoy el producto PROPONE plazos y el abogado los aprueba; el claim, tal cual está, promete más.',
    verifiedAt: null,
    owner: 'Joaquín',
    /* Se queda VACÍO, y el claim se queda en el registro. `/legal` era su única
       atadura y se retiró el 29-sep-2026; sin páginas que lo aten, verificarlo
       hoy no encendería nada. Borrar la entrada sería peor: perdería su
       `source`, que dice exactamente qué falta para poder afirmarlo, y el día
       que vuelva a hacer falta se reescribiría desde cero sin ese trabajo. */
    usedIn: [],
  },

  pilotMetrics: {
    text: 'Métricas cuantitativas del despacho piloto.',
    status: 'disabled',
    source: 'RETIRADO 29-jul: las cifras publicadas (+260% consultas captadas, <5 min de respuesta, 12 h/semana) son métricas de captación, no de uso del software, y su única fuente citada era "velia-chat". Sustituidas por un testimonio cualitativo hasta que existan métricas de producto auditables.',
    verifiedAt: null,
    owner: 'Joaquín',
    usedIn: [],
  },
} as const satisfies Record<string, Claim>

export type ClaimKey = keyof typeof CLAIMS

/**
 * Devuelve el texto de un claim **solo si está verificado**. Si no, `null`.
 *
 * Se usa así, y el `&&` hace que el bloque entero desaparezca:
 *
 *   {claim('verifactu') && <li>{claim('verifactu')}</li>}
 */
export function claim(key: ClaimKey): string | null {
  const c = CLAIMS[key]
  return c.status === 'verified' ? c.text : null
}

/** Para el informe de entrega y para revisiones periódicas. */
export function claimsByStatus(status: ClaimStatus): Array<{ key: string } & Claim> {
  return Object.entries(CLAIMS)
    .filter(([, c]) => c.status === status)
    .map(([key, c]) => ({ key, ...c }))
}
