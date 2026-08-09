'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { APP_URL } from '@/lib/constants'

/**
 * PUERTA COMERCIAL — «quiero que alguien de VELIA me contacte».
 *
 * No es una segunda versión de `/prueba-velia`. Son dos intenciones distintas:
 *   · `/prueba-velia`  → «quiero probar VELIA ahora» (autoservicio, sale con cuenta y tenant).
 *   · este formulario  → «quiero hablar con alguien antes» (NO exige crear cuenta).
 *
 * El socio de un despacho de seis abogados no mete a su equipo en nada sin
 * hablar con una persona. Si su única opción es registrarse, se va — y hasta el
 * 9-ago-2026 se iba en silencio: la web no tenía un solo `<form>` y `/contacto`
 * era un `mailto:`, que en el móvil abre el cliente de correo y no deja rastro.
 *
 * Aterriza en `outbound_prospects` (el CRM comercial que ya existe), no en una
 * tabla nueva, para que aparezca directamente en el panel de quien lo trabaje.
 */

// El texto del consentimiento se define UNA vez: es el que se pinta y el que se
// guarda como evidencia. Si se escribieran por separado, un día la evidencia
// diría algo distinto de lo que el abogado leyó — y la evidencia es justo lo que
// se mira cuando alguien reclama.
export const CONSENT_VERSION = '2026-08-09'
export const CONSENT_TEXT =
  'Acepto que VELIA trate mis datos para responder a esta solicitud y ponerse en ' +
  'contacto conmigo sobre su software. No se usarán para ninguna otra finalidad ' +
  'ni se cederán a terceros. Puedo pedir la baja en cualquier momento respondiendo ' +
  'a cualquiera de sus correos.'

const TAMANOS = ['Solo yo', '2-5 abogados', '6-15 abogados', 'Más de 15'] as const
const AREAS = [
  'Laboral', 'Penal', 'Familia', 'Mercantil', 'Civil',
  'Extranjería', 'Fiscal', 'Concursal / deudas', 'Varias áreas', 'Otra',
] as const

type Estado = 'idle' | 'enviando' | 'ok' | 'error'

export default function ContactForm({ origen = 'contacto' }: { origen?: string }) {
  const [estado, setEstado] = useState<Estado>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (estado === 'enviando') return
    setEstado('enviando')
    setError(null)

    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim() || null,
      despacho: String(fd.get('despacho') ?? '').trim() || null,
      abogados: String(fd.get('abogados') ?? '') || null,
      area: String(fd.get('area') ?? '') || null,
      message: String(fd.get('message') ?? '').trim() || null,
      consent: fd.get('consent') === 'on',
      consent_text: CONSENT_TEXT,
      consent_version: CONSENT_VERSION,
      source_url: typeof window !== 'undefined' ? window.location.href : null,
      source: 'web_form',
      hp: String(fd.get('empresa_web') ?? ''),
    }

    try {
      const res = await fetch(`${APP_URL}/api/velia-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      // `fetch` NO lanza con un 4xx/5xx: solo si falla la red. Sin este
      // `res.ok` el formulario diría «recibido» ante un 500 y el lead se
      // habría perdido enseñando una pantalla de éxito.
      if (!res.ok) {
        const detalle = await res.json().catch(() => null)
        throw new Error(detalle?.error ?? `El servidor respondió ${res.status}`)
      }
      setEstado('ok')
      trackEvent('enterprise_contact_click', { location: origen })
    } catch (err) {
      setEstado('error')
      setError(err instanceof Error ? err.message : 'No se pudo enviar')
    }
  }

  if (estado === 'ok') {
    return (
      <div className="rounded-3xl border border-void/10 bg-white p-8 md:p-10" role="status" aria-live="polite">
        <p className="text-[11px] font-700 tracking-[0.06em] uppercase text-gold-ink mb-3">Recibido</p>
        <h3 className="text-2xl font-700 tracking-[-0.01em]">Te escribimos en el siguiente día laborable.</h3>
        <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
          Hablarás con alguien del equipo que construye la plataforma, no con un comercial
          de guion. Te hemos mandado un correo de confirmación; si no aparece, mira en spam.
        </p>
      </div>
    )
  }

  const labelCls = 'block text-[11px] font-600 tracking-[0.06em] uppercase text-void/70 mb-2'
  const inputCls =
    'w-full border border-[#838CA1] rounded-lg px-3 py-2.5 text-[15px] bg-white ' +
    'placeholder-void/60 focus-visible:outline-2 focus-visible:outline-[#7479F2]'

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-void/10 bg-white p-8 md:p-10">
      <p className="text-[11px] font-700 tracking-[0.06em] uppercase text-gold-ink mb-3">
        Hablar con el equipo
      </p>
      <h3 className="text-2xl md:text-3xl font-700 tracking-[-0.01em] max-w-[22ch]">
        ¿Prefieres que te lo contemos antes de probar nada?
      </h3>
      <p className="mt-4 text-sm text-void/60 leading-[1.6] max-w-prose">
        Déjanos cómo contactarte y te escribimos en el siguiente día laborable. No hace
        falta crear ninguna cuenta.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelCls}>Nombre y apellidos *</label>
          <input id="cf-name" name="name" required maxLength={160} autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="cf-despacho" className={labelCls}>Despacho</label>
          <input id="cf-despacho" name="despacho" maxLength={160} autoComplete="organization" className={inputCls} />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelCls}>Email *</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelCls}>Teléfono</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
        </div>
        <div>
          <label htmlFor="cf-abogados" className={labelCls}>Tamaño del despacho</label>
          <select id="cf-abogados" name="abogados" className={inputCls} defaultValue="">
            <option value="">Prefiero no decirlo</option>
            {TAMANOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cf-area" className={labelCls}>Área principal</label>
          <select id="cf-area" name="area" className={inputCls} defaultValue="">
            <option value="">Prefiero no decirlo</option>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-message" className={labelCls}>¿Qué te gustaría resolver?</label>
        <textarea id="cf-message" name="message" rows={4} maxLength={4000} className={inputCls}
          placeholder="Cuéntanos brevemente cómo trabajáis hoy y qué te gustaría cambiar." />
      </div>

      {/* Honeypot: invisible para una persona, irresistible para un bot. */}
      <div aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden opacity-0 pointer-events-none">
        <label htmlFor="cf-empresa-web">No rellenar</label>
        <input id="cf-empresa-web" name="empresa_web" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 flex gap-3 items-start">
        <input id="cf-consent" name="consent" type="checkbox" required
          className="mt-1 w-4 h-4 shrink-0 accent-[#4C51B9]" />
        <label htmlFor="cf-consent" className="text-[13px] text-void/70 leading-[1.6]">
          {CONSENT_TEXT}
        </label>
      </div>

      {estado === 'error' && (
        <p role="alert" className="mt-5 text-[13px] text-[#B91C1C] leading-[1.6]">
          No se pudo enviar: {error}. Escríbenos a{' '}
          <a href="mailto:admin@veliacorp.com" className="underline">admin@veliacorp.com</a> y lo vemos.
        </p>
      )}

      <button type="submit" disabled={estado === 'enviando'}
        className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#4C51B9] px-8 py-4
                   text-[14px] font-700 text-white transition-transform active:scale-[0.97]
                   disabled:opacity-60 disabled:cursor-not-allowed">
        {estado === 'enviando' ? 'Enviando…' : 'Que me contacten'}
      </button>
      <p className="mt-3 text-[12px] text-void/60">Sin crear cuenta · Respuesta en 1 día laborable</p>
    </form>
  )
}
