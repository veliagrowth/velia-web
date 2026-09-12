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
      </Reveal>
    </div>
  )
}
