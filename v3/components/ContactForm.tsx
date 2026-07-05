'use client'

import { useState } from 'react'

/**
 * Formulario de captación → webhook pipeline-new-lead del n8n SELF-HOST
 * (n8n.veliacorp.com — la web v2 apuntaba al Cloud decomisionado: lead loss).
 * Errores SIEMPRE visibles (regla anti fallo-silencioso).
 */
const LEAD_WEBHOOK = 'https://n8n.veliacorp.com/webhook/velia/pipeline-new-lead'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', firm: '', email: '', phone: '', message: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
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
