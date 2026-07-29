/**
 * Registro de afirmaciones comerciales y técnicas de la web pública.
 *
 * POR QUÉ: VELIA vende software a abogados. Un claim que no se puede sostener no
 * es una licencia de marketing, es un riesgo. Hasta ahora la web publicaba
 * «Facturación Verifactu», «Alojado en la UE» o «+260% consultas captadas» sin
 * que existiera en ningún sitio quién lo había comprobado ni cuándo.
 *
 * REGLA DURA: **solo se renderiza lo que está en `verified`.** `claim()` devuelve
 * `null` para todo lo demás, así que un claim sin verificar no se cuela por
 * descuido: desaparece de la página.
 *
 * Para verificar uno: conseguir la fuente, ponerla en `source`, fechar, firmar
 * con el responsable y pasar el estado a `verified`. No al revés.
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
  /** Páginas donde se usa, para saber qué revisar si cambia. */
  usedIn: string[]
}

export const CLAIMS = {
  // ── Verificados ────────────────────────────────────────────────────────────
  developedInSpain: {
    text: 'Diseñada para la práctica jurídica española.',
    status: 'verified',
    source: 'Producto desarrollado íntegramente por el equipo en España. Comprobable en el propio repositorio y en la facturación de la sociedad.',
    verifiedAt: '2026-07-29',
    owner: 'Joaquín',
    usedIn: ['/', '/sobre-velia'],
  },

  officialSources: {
    text: 'Cuando cita legislación, enlaza al BOE o a EUR-Lex.',
    status: 'verified',
    source: 'Implementado en el motor de jurisprudencia: toda cita normativa se resuelve contra la fuente oficial y se publica con enlace. Ver memory/project_legal_jurisprudence.md.',
    verifiedAt: '2026-07-29',
    owner: 'Joaquín',
    usedIn: ['/', '/seguridad'],
  },

  tenantIsolation: {
    text: 'Cada despacho trabaja en un entorno separado.',
    status: 'verified',
    source: 'Row Level Security activo en todas las tablas tenant_* de Supabase, con políticas por tenant_id. Auditado.',
    verifiedAt: '2026-07-29',
    owner: 'Joaquín',
    usedIn: ['/', '/seguridad'],
  },

  humanSupervision: {
    text: 'Ningún borrador, plazo o decisión jurídica sustituye la revisión del abogado.',
    status: 'verified',
    source: 'Principio de producto. Toda propuesta de VELIA requiere aprobación explícita antes de aplicarse — verificable en la propia interfaz.',
    verifiedAt: '2026-07-29',
    owner: 'Joaquín',
    usedIn: ['/', '/seguridad', '/legal'],
  },

  // ── Pendientes: NO se renderizan ───────────────────────────────────────────
  noModelTraining: {
    text: 'Tratamiento empresarial bajo las condiciones de los proveedores contratados.',
    status: 'pending',
    source: 'FALTA: adjuntar la cláusula concreta del contrato con el proveedor de IA que excluye el uso de los datos para entrenamiento, con su fecha de vigencia.',
    verifiedAt: null,
    owner: 'Joaquín',
    usedIn: ['/', '/seguridad'],
  },

  euInfrastructure: {
    text: 'Infraestructura europea.',
    status: 'pending',
    source: 'FALTA: confirmar por escrito la región de CADA proveedor de la cadena (base de datos, almacenamiento, correo, IA) y dejarlo documentado. La base de datos está en West Europe; el resto no está registrado.',
    verifiedAt: null,
    owner: 'Joaquín',
    usedIn: ['/', '/seguridad'],
  },

  verifactu: {
    text: 'Facturación conforme a Verifactu.',
    status: 'pending',
    source: 'FALTA: verificación técnica y documental del cumplimiento del RD 1007/2023. Es un claim regulatorio: publicarlo sin respaldo expone a la sociedad.',
    verifiedAt: null,
    owner: 'Joaquín',
    usedIn: ['/', '/precios', '/legal'],
  },

  lecDeadlines: {
    text: 'Cómputo de plazos procesales según la LEC.',
    status: 'pending',
    source: 'FALTA: acotar el alcance exacto — qué plazos cubre, qué jurisdicciones, qué hace con los días inhábiles autonómicos. Hoy el producto PROPONE plazos y el abogado los aprueba; el claim, tal cual está, promete más.',
    verifiedAt: null,
    owner: 'Joaquín',
    usedIn: ['/', '/legal'],
  },

  pilotMetrics: {
    text: 'Métricas cuantitativas del despacho piloto.',
    status: 'disabled',
    source: 'RETIRADO 29-jul: las cifras publicadas (+260% consultas captadas, <5 min de respuesta, 12 h/semana) son métricas de captación, no de uso del software, y su única fuente citada era "velia-chat". Sustituidas por un testimonio cualitativo hasta que existan métricas de producto auditables.',
    verifiedAt: null,
    owner: 'Joaquín',
    usedIn: ['/'],
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
