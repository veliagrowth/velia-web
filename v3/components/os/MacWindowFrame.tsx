/**
 * El marco de ventana de VELIA OS.
 *
 * ── QUE ES Y QUE NO ES ────────────────────────────────────────────────────
 * Es chrome: un marco de aplicacion de escritorio que envuelve lo que le
 * pongan dentro. No sabe nada de datos, no tiene estado y no es cliente, asi
 * que se prerenderiza entero y no cuesta ni un kilobyte de JavaScript.
 *
 * Existe separado del especimen (`VeliaOSDemo`) por el §55 del encargo: el
 * marco tiene que poder envolver MANANA una pantalla real del portal sin
 * arrastrar consigo los datos de mentira del hero. Por eso el unico acoplamiento
 * que tiene con la demo es que los dos usan los mismos tokens de color.
 *
 * ── LOS TRES PUNTOS ───────────────────────────────────────────────────────
 * Rojo, amarillo y verde, arriba a la izquierda. Son un SIGNIFICANTE: dicen
 * «esto es una aplicacion, no una pagina web», que es justo lo que hay que
 * comunicar en dos decimas de segundo. No son botones y no fingen serlo: no
 * llevan `role`, no reciben foco y van `aria-hidden`, porque un control que
 * parece cerrar una ventana y no la cierra es peor que no tenerlo.
 *
 * La regla de §48: chrome sutil, no un juguete. Los puntos son de 10 px, sin
 * brillo, sin sombra y sin el simbolo que macOS pinta encima al pasar.
 *
 * ── POR QUE NO HAY SOMBRA GRANDE ──────────────────────────────────────────
 * La profundidad la dan el borde claro de arriba y el fondo, no un `box-shadow`
 * de 80 px. Una sombra difusa enorme sobre Pearl Cloud se ve sucia, y en la
 * franja donde la ventana se solapa con el fondo Iris se vuelve gris.
 */
export default function MacWindowFrame({
  /** Lo que se lee en el centro de la barra. La identidad de la aplicacion. */
  titulo,
  /** Segunda linea del encabezado, opcional. Quien esta abierto ahora mismo. */
  subtitulo,
  /** Zona derecha de la barra: estado, no acciones. */
  estado,
  children,
  className = '',
}: {
  titulo: string
  subtitulo?: string
  estado?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`os-ventana overflow-hidden rounded-xl border border-white/10 bg-deep text-cream shadow-[0_18px_50px_-24px_rgba(13,16,23,0.55)] ${className}`}
    >
      {/* ── Barra superior ───────────────────────────────────────────────
          `select-none` porque arrastrar para seleccionar el titulo de una
          ventana no es algo que nadie quiera hacer, y rompe la ilusion. */}
      <div className="flex select-none items-center gap-3 border-b border-white/10 bg-white/[0.03] px-3.5 py-2.5">
        {/* Decorativos de verdad: `aria-hidden` y sin foco. */}
        <div className="flex flex-none items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ED6A5E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F4BF50]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#61C554]" />
        </div>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[12px] font-600 tracking-[-0.01em] text-cream/85">{titulo}</p>
          {subtitulo ? (
            <p className="truncate text-[11px] leading-tight text-cream/70">{subtitulo}</p>
          ) : null}
        </div>

        {/* Ancho minimo igual al de los puntos para que el titulo quede
            centrado de verdad y no «casi». Si no hay estado, el hueco se
            reserva igual. */}
        <div className="flex min-w-[54px] flex-none items-center justify-end gap-2">{estado}</div>
      </div>

      {children}
    </div>
  )
}

/**
 * La pildora de estado de la barra — y de cualquier sitio del OS que tenga que
 * decir «esto esta vivo» sin gritar.
 *
 * El punto lleva `aria-hidden` y el texto dice lo mismo con palabras: quien no
 * distingue el color no pierde el dato. Es la misma regla del punto de
 * `components/Casos.tsx`.
 */
export function StatusPill({
  texto,
  tono = 'activo',
}: {
  texto: string
  tono?: 'activo' | 'atencion' | 'neutro'
}) {
  const punto =
    tono === 'activo' ? 'bg-[#61C554]' : tono === 'atencion' ? 'bg-[#F4BF50]' : 'bg-cream/40'
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-600 tracking-[0.02em] text-cream/70">
      <span className={`h-1.5 w-1.5 flex-none rounded-full ${punto}`} aria-hidden="true" />
      {texto}
    </span>
  )
}
