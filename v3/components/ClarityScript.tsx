'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

/**
 * Microsoft Clarity — mapas de calor y grabaciones de sesión.
 *
 * ⚠️ NACE APAGADO, Y NO POR PRUDENCIA GENÉRICA: encenderlo tal cual sería
 * incumplir. Clarity escribe cookies propias (`_clck`, `_clsk`), graba la sesión
 * y manda todo a un tercero fuera de la UE. Eso exige consentimiento PREVIO e
 * informado (LSSI-CE art. 22.2 y RGPD art. 6), y hoy veliacorp.com no lo pide:
 * tiene un aviso INFORMATIVO —no un muro— que dice literalmente «esta web
 * funciona sin cookies de seguimiento», y la página /cookies dice lo mismo.
 *
 * Así que esto solo arranca si se cumplen las TRES condiciones a la vez:
 *   1. `NEXT_PUBLIC_CLARITY_PROJECT_ID` existe (si no, no se carga nada);
 *   2. `window.__veliaConsent?.analytics === true`, es decir, alguien ha dicho
 *      que sí en un consentimiento real;
 *   3. no hay `prefers-reduced-data` ni Do Not Track activos.
 *
 * Falta la pieza 2: hoy no hay CMP con opt-in. Mientras no la haya, con la
 * variable puesta seguiría sin cargar — a propósito. El orden correcto es:
 * decidir → cambiar el aviso por un consentimiento de verdad → actualizar
 * /cookies y /privacidad → y entonces poner la variable.
 *
 * RGPD por defecto cuando llegue el día:
 *   · `content: false` → no manda el contenido de la página, solo la geometría
 *     de la interacción. Es lo que hace falta para un mapa de calor.
 *   · Todo lo sensible va enmascarado por marcado (`data-clarity-mask`), no por
 *     confiar en el enmascarado automático.
 *   · Se carga con `lazyOnload`: después de que la página sea interactiva, para
 *     no tocar FCP ni LCP.
 */

// Los dos globales que usa este componente —`window.__veliaConsent` y
// `window.clarity`— los declara lib/consent.ts: dos declaraciones del mismo
// global con tipos distintos no compilan, y el dueño del dato es quien lo
// produce, no quien lo consume.

const ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

export default function ClarityScript() {
  const [permitido, setPermitido] = useState(false)

  useEffect(() => {
    if (!ID) return

    const respetaAlUsuario = () => {
      // Do Not Track y ahorro de datos: dos formas de decir «no» sin banner.
      const dnt = navigator.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1'
      const ahorro = window.matchMedia?.('(prefers-reduced-data: reduce)').matches
      return !dnt && !ahorro
    }

    const revisar = () => {
      setPermitido(window.__veliaConsent?.analytics === true && respetaAlUsuario())
    }
    revisar()

    // El consentimiento puede llegar después de montar: se escucha el aviso.
    window.addEventListener('velia:consent', revisar)
    return () => window.removeEventListener('velia:consent', revisar)
  }, [])

  if (!ID || !permitido) return null

  return (
    <Script id="velia-clarity" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", ${JSON.stringify(ID)});
        window.clarity && window.clarity("consent");
        window.clarity && window.clarity("set", "content", false);`}
    </Script>
  )
}
