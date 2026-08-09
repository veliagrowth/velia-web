'use client'

import { reabrirConsentimiento } from '@/lib/consent'

/**
 * «Cookies» del pie: vuelve a abrir el panel de consentimiento.
 *
 * Existe porque el RGPD (art. 7.3) exige que retirar el consentimiento sea tan
 * fácil como darlo. Si la única forma de decidir fuera el banner de la primera
 * visita, quien ya decidió no podría cambiar de idea nunca — y eso convierte un
 * consentimiento en una trampa.
 *
 * Al reabrirlo se borra la decisión guardada y, si estaba aceptado, se borran
 * también las cookies que el tercero hubiera dejado: dejar de cargar el script
 * no retira las cookies que ya están en el navegador.
 */
export default function ConsentLink() {
  return (
    <button
      type="button"
      onClick={reabrirConsentimiento}
      className="text-[11px] text-cream/55 underline underline-offset-2 hover:text-cream transition-colors"
    >
      Cookies
    </button>
  )
}
