/**
 * Splash de arranque de VELIA — el MISMO que ve el abogado al abrir la app en el
 * móvil (V isotipo sobre Void + wordmark abajo). Se usa mientras la demo en vivo
 * carga dentro de su marco.
 *
 * Por qué un splash y no una captura (Joaquín, 25-jul): una captura estática del
 * software genera un salto raro cuando el iframe real aparece encima y, sobre
 * todo, no es lo que la marca hace al arrancar. El splash dice "esto está
 * arrancando" con el lenguaje de la propia app — coherencia web ↔ producto.
 *
 * La V y el wordmark replican `html.velia-splash` de velia-portal/app/globals.css
 * (isotipo 86px de alto, wordmark 11px con tracking 0.34em al 45% de opacidad).
 */
export default function VeliaSplash({ label }: { label?: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-void"
      aria-hidden
    >
      {/* V isotipo — respiración lenta (autónoma → keyframes, no transition) */}
      <svg
        viewBox="0 0 50 56"
        className="velia-splash-mark h-[86px] w-auto"
        role="presentation"
      >
        <path
          fill="#EDE9E1"
          d="M25.4,51.1c-0.5,0-1.1-0.4-1.2-0.7L2.4,6.8c-0.4-0.7,0-1.6,0.7-2s1.6,0,1.9,0.7L26.8,49c0.4,0.7,0,1.6-0.7,1.9C25.8,50.9,25.6,51.1,25.4,51.1z"
        />
        <path
          fill="#EDE9E1"
          d="M25.4,51.1c-0.2,0-0.4,0-0.7-0.2c-0.7-0.4-1-1.2-0.7-1.9L45.8,5.5c0.4-0.7,1.2-1.1,1.9-0.7s1.1,1.2,0.7,1.9L26.7,50.2C26.5,50.7,26,51.1,25.4,51.1z"
        />
        <circle fill="#C9A96E" cx="25.4" cy="49.5" r="4" />
      </svg>

      {/* Wordmark — entra con fade, igual que en la app */}
      <span className="velia-splash-word mt-8 text-[11px] font-600 uppercase tracking-[0.34em] indent-[0.34em] text-cream/45">
        VELIA
      </span>

      {label && (
        <span className="absolute inset-x-0 bottom-6 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-[12px] text-cream/70">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" aria-hidden />
            {label}
          </span>
        </span>
      )}
    </div>
  )
}
