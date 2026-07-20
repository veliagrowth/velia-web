'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Aviso de cookies MINIMALISTA e informativo (no un muro de consentimiento):
 * esta web no usa cookies de seguimiento ni publicidad (analítica cookieless),
 * así que legalmente no hay nada que aceptar — el aviso informa y se descarta.
 * Esquina inferior izquierda, sin overlay, no bloquea nada. Una vez descartado
 * no vuelve a aparecer (localStorage).
 */
const STORAGE_KEY = 'velia-cookie-notice-v1'

export default function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      /* almacenamiento bloqueado → no insistimos */
    }
  }, [])

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* noop */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Aviso de cookies"
      className="rise fixed bottom-4 left-4 z-50 max-w-[21rem] rounded-2xl border border-white/10 bg-deep px-4 py-3.5 shadow-[0_16px_40px_-20px_rgba(10,10,15,0.5)]"
    >
      <p className="text-[12.5px] leading-relaxed text-cream/75">
        Esta web funciona <strong className="font-700 text-cream">sin cookies de seguimiento</strong> —
        solo analítica anónima y las cookies técnicas imprescindibles.{' '}
        <Link href="/cookies" className="underline text-cream/60 hover:text-gold-light transition-colors">
          Saber más
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="btn mt-2.5 rounded-full bg-cream text-void text-[11px] font-700 tracking-[0.08em] uppercase px-4 py-1.5 hover:opacity-85"
      >
        Entendido
      </button>
    </aside>
  )
}
