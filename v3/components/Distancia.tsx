import Reveal from '@/components/Reveal'

/**
 * Momento 3 — la distancia entre lo que hay y lo que debería haber.
 *
 * NO ES UN «ANTES / DESPUÉS» DE DOS TARJETAS. Dos cajas iguales enfrentadas
 * dicen que las dos situaciones son del mismo tipo y solo cambia el contenido.
 * Aquí lo que cambia es la FORMA: a la izquierda, piezas sueltas, cada una en su
 * caja, desalineadas a propósito; a la derecha, una sola superficie continua.
 *
 * El desorden de la izquierda es el argumento, así que es deliberado y medido
 * —un desplazamiento distinto por pieza, ninguno mayor de 12 px— y desaparece en
 * móvil, donde una columna estrecha ya no admite desalineación sin parecer un
 * error de maquetación.
 *
 * Ni una cifra. No hay ninguna que podamos sostener sobre el coste de trabajar
 * así, y la sección no la necesita: quien lo vive lo reconoce.
 */

/** El `off` es el desplazamiento vertical en píxeles (solo a partir de md). */
const FRAGMENTOS = [
  { t: 'Una web que nadie actualiza', off: 0 },
  { t: 'Los contactos, en una hoja de cálculo', off: 8 },
  { t: 'Los presupuestos, en el correo', off: -6 },
  { t: 'El seguimiento, en la cabeza de alguien', off: 12 },
  { t: 'Las facturas, en otro programa', off: 4 },
  { t: 'Los mensajes, en tres aplicaciones', off: -10 },
  { t: 'Los datos, en ningún sitio', off: 6 },
] as const

const CONECTADO = [
  'Una sola infraestructura',
  'Los datos en un único sitio, y con dueño',
  'Los procesos que se repiten, automatizados',
  'Lo que pasa, medido',
  'Y alguien operándolo',
] as const

export default function Distancia() {
  return (
    /* La columna izquierda se dimensiona a su CONTENIDO (`auto`), no a una
       fracción: los fragmentos son cortos y desiguales, y con `1fr` quedaba un
       vacío de doscientos píxeles entre ellos y la flecha que no significaba
       nada. Aquí el espacio en blanco tiene que estar DENTRO de la columna
       izquierda —el desorden es el argumento—, no entre las dos. */
    <div className="mt-14 md:mt-20 grid gap-8 lg:grid-cols-[auto_auto_minmax(0,1fr)] lg:items-center lg:gap-x-12">
      {/* ── Lo que hay ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65 mb-6">
          Lo que suele haber
        </p>
        <ul className="space-y-2.5">
          {FRAGMENTOS.map((f, i) => (
            <Reveal as="li" key={f.t} delay={i * 40}>
              <span
                className="inline-block rounded-md border border-mist bg-white px-4 py-2.5 text-[14px] text-void/60 md:[transform:translateY(var(--off))]"
                style={{ '--off': `${f.off}px` } as React.CSSProperties}
              >
                {f.t}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* La flecha es decorativa: el orden de lectura ya dice lo mismo. */}
      <div className="hidden lg:block text-slate text-2xl px-2" aria-hidden="true">
        →
      </div>

      {/* ── Lo que queda ───────────────────────────────────────────────────── */}
      <Reveal delay={120}>
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink mb-6">
          Lo que construimos
        </p>
        {/* Una sola superficie. La unidad visual ES el mensaje: no son cinco
            cosas mejores, es que ya no son cosas separadas. */}
        <div className="rounded-lg border border-mist bg-white divide-y divide-mist">
          {CONECTADO.map(c => (
            <p key={c} className="px-5 py-4 text-[15px] text-void/85 leading-snug">
              {c}
            </p>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
