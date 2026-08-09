/**
 * Consentimiento de cookies — la lógica, separada de su interfaz.
 *
 * POR QUÉ EXISTE (10-ago-2026). Hasta hoy la web no pedía nada porque no había
 * nada que pedir: analítica sin cookies, medida en el borde de la red. El aviso
 * era informativo y lo decía en su propio código: «legalmente no hay nada que
 * aceptar». Al entrar Microsoft Clarity —que escribe cookies propias, graba la
 * sesión y la manda fuera de la UE— eso deja de ser cierto, y hace falta
 * consentimiento PREVIO, informado y revocable (LSSI-CE art. 22.2 · RGPD art. 6
 * y 7).
 *
 * TRES REGLAS QUE NO SE NEGOCIAN, y que son justo donde fallan la mayoría de
 * los banners:
 *
 *   1. NADA se carga antes de decidir. Ni «mientras tanto», ni «solo esta vez».
 *      Por eso el estado inicial es `null` —sin decidir— y no `false`: no es lo
 *      mismo haber dicho que no que no haber dicho nada, aunque el efecto
 *      inmediato coincida.
 *   2. Rechazar cuesta exactamente lo mismo que aceptar: un clic, en el mismo
 *      sitio, con el mismo tamaño. Un «rechazar» escondido no es rechazar.
 *   3. Se puede cambiar de idea siempre. Hay un enlace permanente en el pie y
 *      en /cookies, y al revocar se BORRAN las cookies que dejó el tercero: si
 *      solo se dejara de cargar el script, las que ya escribió seguirían ahí.
 *
 * Se guarda en localStorage y no en una cookie: recordar la decisión es
 * técnicamente imprescindible, así que no necesita a su vez permiso.
 */

const CLAVE = 'velia-consent-v2'

export type Decision = 'aceptado' | 'rechazado'

declare global {
  interface Window {
    __veliaConsent?: { analytics: boolean }
    /** Lo inyecta ClarityScript. Aquí solo se usa para poder pararlo al revocar. */
    clarity?: (...args: unknown[]) => void
  }
}

/** `null` = todavía no ha decidido. No es lo mismo que haber dicho que no. */
export function leerConsentimiento(): Decision | null {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(CLAVE)
    return v === 'aceptado' || v === 'rechazado' ? v : null
  } catch {
    // Almacenamiento bloqueado: se trata como «sin decidir» y no se carga nada.
    return null
  }
}

/** Publica la decisión donde el resto de la web puede verla y reaccionar. */
function publicar(analytics: boolean) {
  window.__veliaConsent = { analytics }
  window.dispatchEvent(new CustomEvent('velia:consent', { detail: { analytics } }))
}

export function guardarConsentimiento(decision: Decision) {
  const yaCargado = typeof window.clarity !== 'undefined'
  try { localStorage.setItem(CLAVE, decision) } catch { /* no impide decidir */ }

  if (decision === 'rechazado') {
    borrarCookiesDeTerceros()
    publicar(false)
    // Un script ya inyectado no se puede des-inyectar: quitarlo del DOM no
    // detiene lo que ya está corriendo en memoria. Medido — tras revocar,
    // `window.clarity` seguía definido y la sesión seguía grabándose hasta la
    // siguiente navegación. Retirar el consentimiento tiene que surtir efecto
    // AHORA, así que se le pide parar y se recarga.
    if (yaCargado) {
      try { window.clarity?.('stop') } catch { /* da igual: lo que manda es la recarga */ }
      window.location.reload()
    }
    return
  }

  publicar(true)
}

/** Lo llama el layout al arrancar para que quien escuche ya tenga el estado. */
export function publicarConsentimientoGuardado() {
  publicar(leerConsentimiento() === 'aceptado')
}

/**
 * Al revocar no basta con dejar de cargar el script: las cookies que Clarity ya
 * escribió seguirían en el navegador. Se borran en el dominio y en el punto,
 * porque un `document.cookie` con el `path` equivocado no borra nada y tampoco
 * avisa de que no ha borrado nada.
 */
function borrarCookiesDeTerceros() {
  const nombres = ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM']
  const host = window.location.hostname
  const dominios = [host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const nombre of nombres) {
    for (const dominio of dominios) {
      document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${dominio}`
    }
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }
}

/** Abre el panel otra vez desde el pie o desde /cookies. */
export function reabrirConsentimiento() {
  // Ojo: reabrir NO revoca. Solo vuelve a enseñar el panel para que la persona
  // elija otra vez. Si reabrir revocara por sí solo, pulsar «Cookies» en el pie
  // para consultar la decisión la estaría cambiando sin querer.
  window.dispatchEvent(new CustomEvent('velia:consent-reabrir'))
}
