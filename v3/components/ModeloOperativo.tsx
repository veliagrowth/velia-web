import Reveal from '@/components/Reveal'

/**
 * Momento 6 — cómo trabaja VELIA.
 *
 * EL MENSAJE NO SON LAS SEIS FASES: es que las dos últimas no terminan. Casi
 * cualquier agencia puede dibujar un proceso de cuatro pasos —Orbyn lo hace— y
 * todos acaban en «entrega». El de VELIA no acaba, y esa es literalmente la
 * diferencia de modelo de negocio (§8.4 de la dirección).
 *
 * Por eso las fases 05 y 06 se pintan distintas: fondo propio, acento Iris y una
 * línea que dice explícitamente que ahí no hay final. Si las seis se pintaran
 * iguales, el argumento se perdería en la simetría.
 */

const FASES = [
  { n: '01', t: 'Discover', d: 'Entender el negocio antes que la tecnología: cómo entra el trabajo, cómo se hace, dónde se pierde.' },
  { n: '02', t: 'Diagnose', d: 'Qué falta, qué sobra, qué está roto sin que nadie lo sepa, y qué se puede medir hoy.' },
  { n: '03', t: 'Design',   d: 'La infraestructura que hace falta, y el orden en que conviene construirla.' },
  { n: '04', t: 'Build',    d: 'Se construye e integra. Con lo que ya existe cuando sirve, y sustituyéndolo cuando no.' },
] as const

const RECURRENTES = [
  { n: '05', t: 'Operate',  d: 'El sistema funciona todos los días, y alguien responde de que funcione.' },
  { n: '06', t: 'Optimize', d: 'Se mide, se corrige y se amplía. Lo que se aprende vuelve a la infraestructura.' },
] as const

export default function ModeloOperativo() {
  return (
    <div className="mt-14 md:mt-20">
      <ol className="grid gap-px bg-mist sm:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-lg">
        {FASES.map(f => (
          <li key={f.n} className="bg-white px-6 py-7">
            <p className="text-[12px] font-600 tracking-[0.06em] text-void/65 tabular-nums">{f.n}</p>
            <h3 className="mt-2.5 text-lg font-600 tracking-[-0.01em] text-void">{f.t}</h3>
            <p className="mt-2 text-[14px] leading-[1.6] text-void/65">{f.d}</p>
          </li>
        ))}
      </ol>

      <Reveal delay={60}>
        <ol className="mt-4 grid gap-px bg-mist sm:grid-cols-2 overflow-hidden rounded-lg">
          {RECURRENTES.map(f => (
            <li key={f.n} className="bg-cream px-6 py-7">
              <p className="text-[12px] font-600 tracking-[0.06em] text-gold-ink tabular-nums">{f.n}</p>
              <h3 className="mt-2.5 text-lg font-600 tracking-[-0.01em] text-void">{f.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-void/65">{f.d}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={100}>
        <p className="mt-8 text-lg md:text-xl font-500 tracking-[-0.01em] leading-[1.4] text-void max-w-[42ch]">
          Las cuatro primeras fases tienen final. Las dos últimas no.
        </p>
        <p className="mt-3 text-[15px] leading-[1.6] text-void/65 max-w-prose">
          Ahí está la diferencia entre encargar un proyecto y tener una infraestructura
          operada. Un sistema digital sin nadie detrás no se queda como estaba: se degrada.
        </p>

        {/* ── EL MODELO, DICHO SIN CIFRAS (22-sep-2026) ────────────────────
            La sección explicaba el PROCESO y no lo que se contrata. Quien leía
            entendía cómo trabaja VELIA y seguía sin saber qué compra ni qué pasa
            el mes siguiente — y ese hueco lo rellena solo el visitante, casi
            siempre con el modelo que conoce: una licencia de software.

            NI UN NÚMERO, Y ES DELIBERADO. No hay precio, ni «desde», ni tramos,
            ni una página de precios: la estructura comercial y su denominación
            pública son decisión de negocio, no de esta web, y publicarlas aquí
            las daría por decididas. Lo que sí se puede decir hoy sin comprometer
            nada es la FORMA del modelo — que son dos cosas y no una—, porque es
            la consecuencia directa de las seis fases que están justo encima.

            El nombre que se usa para la parte continua es `Digital Operations`,
            que no es un término inventado para este párrafo: es una de las
            cuatro capacidades, ya publicada más arriba en esta misma página. Un
            nombre nuevo aquí sería una quinta capacidad por la puerta de atrás. */}
        {/* `border border-mist` NO es decoración: sin él la pareja se lee mal.
            Esta sección tiene fondo blanco, así que la celda «Un proyecto»
            —también blanca— se fundía con él y sólo la de la derecha parecía un
            panel. El resultado era una rejilla que se veía a medio pintar, y no
            fallaba en ninguna guarda porque no es un error de código: es que dos
            superficies del mismo color no tienen borde entre ellas. El marco
            cierra las dos y deja que la diferencia la marque el tinte, que es lo
            que tiene que decirla. */}
        <div className="mt-8 grid gap-px bg-mist border border-mist sm:grid-cols-2 overflow-hidden rounded-lg">
          <div className="bg-white px-6 py-7">
            <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
              Un proyecto
            </p>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-void/75 max-w-prose">
              Tiene alcance, orden y final: lo que se diseña, se construye y se pone en
              marcha.
            </p>
          </div>
          <div className="bg-cream px-6 py-7">
            <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">
              Digital Operations
            </p>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-void/75 max-w-prose">
              Continúa: la infraestructura funcionando, vigilada, medida y creciendo con el
              negocio. Es servicio, no una licencia — no hay herramienta que alquilar.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
