'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { COMPOSICION, DESORDEN, PIEZAS, SIMBOLO } from '@/lib/hero-composicion'

/**
 * «La mesa del lunes» — el momento de marca del hero.
 *
 * QUÉ TIENE QUE ENTENDERSE SIN LEER NADA: lo que hay suelto encima de una mesa
 * un lunes por la mañana se ordena, cada pieza deja de ser un FORMATO y pasa a
 * ser lo que APORTA —Plazo, Cláusulas, Cliente, Antecedente, Prueba, Importe—
 * y todo acaba dentro de un expediente de VELIA, donde cada dato dice de qué
 * documento sale.
 *
 * ══ POR QUÉ LA GEOMETRÍA VIVE FUERA (rev4, 9-ago-2026) ══════════════════════
 *
 * Toda la composición se calcula en `lib/hero-composicion.ts` y este fichero
 * solo la pinta. Antes las coordenadas estaban repartidas entre el markup,
 * estilos en línea y tres media queries, y cada tamaño heredaba trozos del
 * otro: de ahí salieron cuatro fallos que el build no ve, incluido que móvil
 * se quedara con dos conceptos de seis.
 *
 * Ahora hay DOS composiciones completas e independientes —escritorio en dos
 * filas de tres, móvil en dos columnas de tres— y un solo HUB del que derivan,
 * por cálculo, el símbolo, las seis trazas y el origen de la ventana.
 *
 * LOS SEIS CONCEPTOS EXISTEN EN LOS DOS TAMAÑOS, y el expediente final es el
 * mismo: tres datos con su procedencia y el cierre completo. Móvil no es una
 * versión pobre, es otra composición.
 *
 * EL SÍMBOLO ES EL ASSET OFICIAL, sin redibujar: los dos paths y el punto de
 * brand/assets/logo/velia-symbol-iris.svg. Se anima, no se reinterpreta. Su
 * punto —que en el logotipo es el vértice inferior de la V— se coloca en el
 * hub, y el desvío que eso produce en el dibujo se compensa por cálculo, no a
 * ojo (ver el fichero de composición).
 *
 * ACCESIBILIDAD: el escenario va `aria-hidden` porque todo lo que dice está en
 * el titular y el párrafo de al lado. El botón de pausa no es un adorno: WCAG
 * 2.2.2 lo exige en cuanto algo se mueve solo más de cinco segundos. Con
 * `prefers-reduced-motion` no hay bucle ni movimiento: se queda en el
 * expediente terminado.
 */

const ESC = COMPOSICION.escritorio
const MOV = COMPOSICION.movil

/** El símbolo de marca. Mismo dibujo en los dos tamaños; solo cambian la escala
 *  y la traslación, que salen del hub. */
function SimboloVelia({ c }: { c: typeof ESC }) {
  return (
    <g transform={`translate(${c.simbolo.tx} ${c.simbolo.ty}) scale(${c.simbolo.escala})`}>
      <g className="mesa-marca" fill="#F6F7FA" stroke="#F6F7FA" strokeWidth={SIMBOLO.trazo} strokeMiterlimit="10">
        <path d="M156.91035,311.86381c-3.32518,0-7.3154-2.66016-7.98044-4.65526L3.952,17.25273C1.29186,12.59748,3.952,6.61215,8.60726,3.952s10.64058,0,12.63569,4.65525L166.22086,297.89805c2.66014,4.65526,0,10.64057-4.65526,12.6357-1.9951,0-3.32517,1.33005-4.65525,1.33005Z" />
        <path d="M156.91035,311.86381c-1.33008,0-2.66014,0-4.65526-1.33008-4.65526-2.66016-6.65036-7.98044-4.65526-12.6357L292.57776,8.60726c2.66016-4.65525,7.98044-7.3154,12.6357-4.65525s7.31539,7.98043,4.65526,12.63569L165.55583,305.87849c-1.33008,3.32518-4.65526,5.98531-8.64548,5.98531Z" />
      </g>
      {/* El punto. Color plano: el manual prohíbe degradados y brillos sobre él. */}
      <circle className="mesa-punto" cx={SIMBOLO.punto.x} cy={SIMBOLO.punto.y} r={SIMBOLO.punto.r} fill="#7479F2" />
    </g>
  )
}

/** Una escena: sus trazas y su símbolo. Hay una por composición porque el
 *  viewBox tiene que compartir proporción con la caja — con proporciones
 *  distintas el navegador encaja el SVG con bandas y las líneas dejan de tocar
 *  las piezas. Eso no se arregla con CSS: el viewBox es un atributo. */
function Escena({ c, clase }: { c: typeof ESC; clase: string }) {
  return (
    <svg className={`mesa-svg ${clase}`} viewBox={`0 0 ${c.vb.w} ${c.vb.h}`} fill="none">
      <g stroke="#8D90FA" strokeWidth="1" strokeLinecap="round">
        {c.trazas.map((t, i) => (
          <path key={i} className="mesa-tz" d={t.d} style={{ ['--len' as string]: t.len, ['--t0' as string]: `${i * 0.09}s` }} />
        ))}
      </g>
      <SimboloVelia c={c} />
    </svg>
  )
}

export default function HeroContextStage() {
  const [reducido, setReducido] = useState(false)
  const [pausa, setPausa] = useState(false)
  const escena = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aplicar = () => setReducido(mq.matches)
    aplicar()
    mq.addEventListener('change', aplicar)
    return () => mq.removeEventListener('change', aplicar)
  }, [])

  /**
   * El ciclo corre SOLO mientras la escena está en pantalla.
   *
   * No es un ahorro de CPU —que también—: es lo que hace que el visitante vea
   * la secuencia DESDE EL PRINCIPIO. El ciclo nace pausado en su fotograma 0
   * (el desorden de la mesa) y no avanza hasta que la escena entra de verdad
   * en el viewport. Antes arrancaba con el primer pintado, así que si la
   * página tardaba —y con 5,3 s de TTFB en frío tarda— cuando alguien llegaba
   * la animación ya iba por el segundo cinco: piezas ya ordenadas, sin símbolo
   * y sin trazas. Parecía que se truncaba, y en realidad se la había perdido.
   *
   * Al salir de pantalla se pausa y al volver continúa donde estaba, que es lo
   * que se espera de algo que estabas viendo.
   */
  useEffect(() => {
    const el = escena.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const obs = new IntersectionObserver(
      ([e]) => { el.dataset.visible = e.isIntersecting ? 'true' : 'false' },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const alternarPausa = useCallback(() => {
    setPausa(p => {
      trackEvent('hero_context_interaction', { interaction_type: p ? 'resume' : 'pause' })
      return !p
    })
  }, [])

  return (
    <div>
      <div ref={escena} className="mesa" aria-hidden="true" data-pausa={pausa ? 'true' : 'false'}>
        <Escena c={MOV} clase="mesa-svg--mv" />
        <Escena c={ESC} clase="mesa-svg--sm" />

        {/* Las seis piezas, una sola vez. Cada tamaño tiene sus coordenadas en
            variables propias y es el CSS —no el JS— quien elige cuáles usa: un
            estilo en línea no se puede sobrescribir con una media query. */}
        {PIEZAS.map((p, i) => (
          <div
            key={p.aporta}
            className="mesa-pz"
            style={{
              // Solo left/top cambian con el tamaño. El desorden es COMÚN a
              // propósito: si cambiara, cambiaría un valor que los keyframes
              // consumen y Chrome recrearía la animación — medido, la pieza
              // saltaba de t=3650 ms a t=1460 al girar el teléfono.
              ['--x-sm' as string]: `${ESC.destinos[i].x}%`,
              ['--y-sm' as string]: `${ESC.destinos[i].y}%`,
              ['--x-mv' as string]: `${MOV.destinos[i].x}%`,
              ['--y-mv' as string]: `${MOV.destinos[i].y}%`,
              ['--dx' as string]: DESORDEN[i].dx,
              ['--dy' as string]: DESORDEN[i].dy,
              ['--r' as string]: DESORDEN[i].r,
              ['--t0' as string]: `${i * 0.09}s`,
            }}
          >
            <span className="l" />
            <span className="l c" />
            <span className="apo">{p.aporta}</span>
            <span className="nom">{p.nom}</span>
          </div>
        ))}

        {/* EL ACTO DE PRODUCTO. Nace del hub y responde dónde acaba todo esto:
            dentro del expediente, en VELIA, listo para trabajar. Cada dato dice
            de qué archivo sale — el espectador ve que Notificación.pdf ha
            dejado de ser un archivo y ahora es un vencimiento del asunto.
            Es el MISMO expediente en los dos tamaños. */}
        <div className="mesa-win">
          <div className="cab">
            <span className="marcaprod">
              <svg viewBox={`0 0 ${SIMBOLO.vb.w} ${SIMBOLO.vb.h}`} aria-hidden="true">
                <g fill="#0D1017" stroke="#0D1017" strokeWidth={SIMBOLO.trazo} strokeMiterlimit="10">
                  <path d="M156.91035,311.86381c-3.32518,0-7.3154-2.66016-7.98044-4.65526L3.952,17.25273C1.29186,12.59748,3.952,6.61215,8.60726,3.952s10.64058,0,12.63569,4.65525L166.22086,297.89805c2.66014,4.65526,0,10.64057-4.65526,12.6357-1.9951,0-3.32517,1.33005-4.65525,1.33005Z" />
                  <path d="M156.91035,311.86381c-1.33008,0-2.66014,0-4.65526-1.33008-4.65526-2.66016-6.65036-7.98044-4.65526-12.6357L292.57776,8.60726c2.66016-4.65525,7.98044-7.3154,12.6357-4.65525s7.31539,7.98043,4.65526,12.63569L165.55583,305.87849c-1.33008,3.32518-4.65526,5.98531-8.64548,5.98531Z" />
                </g>
                <circle cx={SIMBOLO.punto.x} cy={SIMBOLO.punto.y} r={SIMBOLO.punto.r} fill="#7479F2" />
              </svg>
              <b>VELIA</b>
            </span>
            <span className="est">Expediente 2026/184</span>
          </div>

          <div className="cuerpo">
            <div className="dato mesa-fila" style={{ ['--t0' as string]: '0s' }}>
              <span className="linea"><span className="k">Vencimiento</span><span className="v">20 días hábiles</span></span>
              <span className="de">de Notificación.pdf</span>
            </div>
            <div className="dato mesa-fila" style={{ ['--t0' as string]: '0.3s' }}>
              <span className="linea"><span className="k">Cliente</span><span className="v">Martínez Ferrer, S.L.</span></span>
              <span className="de">de Correo de Martínez</span>
            </div>
            <div className="dato mesa-fila" style={{ ['--t0' as string]: '0.6s' }}>
              <span className="linea"><span className="k">Honorarios</span><span className="v">1.240,00 €</span></span>
              <span className="de">de Honorarios.csv</span>
            </div>
          </div>

          <div className="cierre mesa-cierre">
            <span className="marca-est"><i />Contexto actualizado</span>
            <p className="dice">
              He relacionado los seis documentos con el asunto y he encontrado un vencimiento.
              Todo está preparado para que continúes.
            </p>
          </div>
        </div>
      </div>

      {/* El control de pausa NO se ve. Decisión de Joaquín: ensuciaba el hero.
          Pero algo que se mueve solo en bucle necesita poder pararse (WCAG
          2.2.2), así que el botón sigue ahí y sale únicamente al llegar con el
          tabulador — el mismo patrón que un enlace de «saltar al contenido».
          Quien navega con ratón no lo ve nunca; quien navega con teclado lo
          encuentra en el primer tabulador de la escena. */}
      <div className="mt-3 flex items-center justify-end">
        {!reducido && (
          <button
            type="button"
            onClick={alternarPausa}
            className="sr-only focus:not-sr-only focus:mr-auto text-[11px] font-600 tracking-[0.04em] text-cream/70 hover:text-cream transition-colors duration-control"
          >
            {pausa ? 'Reanudar' : 'Pausar'} la secuencia de demostración
          </button>
        )}
        <span className="text-[11px] text-cream/35">Datos ficticios</span>
      </div>
    </div>
  )
}
