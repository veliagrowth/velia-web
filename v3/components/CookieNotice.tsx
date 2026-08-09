'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { leerConsentimiento, guardarConsentimiento, publicarConsentimientoGuardado } from '@/lib/consent'

/**
 * Consentimiento de cookies.
 *
 * QUÉ CAMBIÓ Y POR QUÉ (10-ago-2026): esto era un aviso INFORMATIVO —«esta web
 * funciona sin cookies de seguimiento»— y era verdad: la analítica se medía en
 * el borde de la red, sin tocar el dispositivo. Al entrar Microsoft Clarity
 * (mapas de calor y grabación de sesión) deja de serlo, así que pasa a ser un
 * consentimiento de verdad.
 *
 * DECISIONES DE FORMA, que aquí son de fondo:
 *   · «Rechazar» y «Aceptar» tienen el MISMO peso visual y están juntos. Un
 *     rechazar en gris pequeño al lado de un aceptar en color es un rechazar de
 *     mentira, y la AEPD lo trata como tal.
 *   · No hay overlay ni muro: no bloquea leer la web. Lo que bloquea es cargar
 *     nada de terceros hasta decidir, que es lo que exige la ley.
 *   · No hay «X» para cerrar sin decidir: cerrar sin más dejaría a la persona
 *     creyendo que ya ha elegido cuando no ha elegido.
 *   · Mientras no se decide, el estado es «sin decidir» y no carga nada. Volverá
 *     a preguntarse en la siguiente visita.
 */
export default function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Publica lo ya decidido para quien escuche (Clarity), y pregunta si no hay
    // decisión previa.
    publicarConsentimientoGuardado()
    if (leerConsentimiento() === null) setVisible(true)

    // El enlace del pie y el de /cookies reabren este panel.
    const reabrir = () => setVisible(true)
    window.addEventListener('velia:consent-reabrir', reabrir)
    return () => window.removeEventListener('velia:consent-reabrir', reabrir)
  }, [])

  const decidir = (d: 'aceptado' | 'rechazado') => {
    guardarConsentimiento(d)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Consentimiento de cookies"
      role="dialog"
      className="rise fixed bottom-4 left-4 z-50 max-w-[23rem] rounded-2xl border border-white/10 bg-deep px-4 py-3.5 shadow-[0_16px_40px_-20px_rgba(13,16,23,0.5)]"
    >
      <p className="text-[12.5px] leading-relaxed text-cream/75">
        Usamos cookies propias para que la web funcione y, <strong className="font-700 text-cream">solo si lo autorizas</strong>,
        cookies de Microsoft Clarity para ver cómo se usa la web y mejorarla.{' '}
        <Link href="/cookies" className="underline text-cream/60 hover:text-gold-light transition-colors">
          Detalle y cómo cambiarlo
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        {/* Mismo tamaño, mismo peso, uno al lado del otro. A propósito. */}
        <button
          type="button"
          onClick={() => decidir('rechazado')}
          className="btn flex-1 rounded-full border border-white/25 text-cream text-[11px] font-700 tracking-[0.06em] uppercase px-4 py-1.5 hover:border-white/50 transition-colors"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={() => decidir('aceptado')}
          className="btn flex-1 rounded-full bg-cream text-void text-[11px] font-700 tracking-[0.06em] uppercase px-4 py-1.5 hover:opacity-85"
        >
          Aceptar
        </button>
      </div>
    </aside>
  )
}
