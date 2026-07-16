'use client'

import { useState } from 'react'
import Link from 'next/link'

/**
 * Formulario de captación → webhook web-form-lead del n8n SELF-HOST
 * (inserta en velia_web_leads + notifica al equipo vía notify-new-lead).
 * OJO: pipeline-new-lead NO vale aquí — exige tenant_id y rechazaba este payload con 400.
 * Errores SIEMPRE visibles (regla anti fallo-silencioso).
 */
const LEAD_WEBHOOK = 'https://n8n.veliacorp.com/webhook/velia/web-form-lead'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', firm: '', email: '', phone: '', message: '' })
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    // RGPD: doble guard junto al `required` nativo — error siempre visible.
    if (!consent) { setConsentError(true); return }
    setConsentError(false)
    setState('sending')
    try {
      const res = await fetch(LEAD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.firm,
          email: form.email,
          phone: form.phone,
          message: form.message,
          source: 'web-v3-contacto',
          consent: true,
          consent_at: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error()
      setState('ok')
    } catch {
      setState('error')
    }
  }

  if (state === 'ok') {
    return (
      <div className="rounded-3xl border border-void/10 bg-white p-10 self-start">
        <p className="text-2xl font-700 tracking-[-0.01em]">Recibido. ✓</p>
        <p className="mt-3 text-sm text-void/60 leading-[1.6]">
          Te escribimos hoy mismo para proponerte fecha y hora de la demo. Revisa también
          la carpeta de spam por si acaso.
        </p>
      </div>
    )
  }

  const input =
    'w-full rounded-lg border border-void/20 bg-white px-3 py-2.5 text-sm text-void placeholder-void/35 focus:outline-none focus:border-void/40 transition-colors'
  const label = 'block text-[11px] font-600 tracking-[0.28em] uppercase text-void/60 mb-1.5'

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-void/10 bg-white p-8 md:p-10 space-y-5 self-start w-full">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Nombre</label>
          <input id="name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={input} placeholder="Tu nombre" />
        </div>
        <div>
          <label htmlFor="firm" className={label}>Despacho</label>
          <input id="firm" value={form.firm} onChange={e => setForm(f => ({ ...f, firm: e.target.value }))} className={input} placeholder="Nombre del despacho" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={input} placeholder="tu@despacho.com" />
        </div>
        <div>
          <label htmlFor="phone" className={label}>Teléfono <span className="normal-case tracking-normal text-void/35">(opcional)</span></label>
          <input id="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={input} placeholder="+34 …" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className={label}>¿Qué necesitas?</label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className={`${input} resize-none`}
          placeholder="Cuéntanos cómo trabajáis hoy o qué quieres ver en la demo…"
        />
      </div>
      <div>
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={e => { setConsent(e.target.checked); if (e.target.checked) setConsentError(false) }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-void/25 accent-[#9A7840]"
          />
          <span className="text-[13px] leading-relaxed text-void/60">
            He leído y acepto la <Link href="/privacidad" className="underline text-void/80 hover:text-gold-dark" target="_blank">política de privacidad</Link>.
          </span>
        </label>
        {consentError && (
          <p className="mt-2 text-xs text-red-600">Necesitamos tu consentimiento para responderte.</p>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-void/40">
          Responsable: VELIA Marketing SL · Finalidad: responder a tu solicitud y agendar la
          demo · Derechos: acceso, rectificación y supresión en admin@veliacorp.com.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="btn bg-void text-cream text-[12px] font-700 tracking-[0.1em] uppercase rounded-full px-7 py-3.5 hover:opacity-85 disabled:opacity-40"
        >
          {state === 'sending' ? 'Enviando…' : 'Enviar'}
        </button>
        {state === 'error' && (
          <p className="text-xs text-red-600">
            No se pudo enviar. Escríbenos a{' '}
            <a href="mailto:admin@veliacorp.com" className="underline">admin@veliacorp.com</a>.
          </p>
        )}
      </div>
    </form>
  )
}
