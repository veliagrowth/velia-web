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

/* ⚠️ Las descripciones de las CUATRO PRIMERAS fases se fueron el 22-sep.
   `Discover`, `Diagnose`, `Design` y `Build` son las cuatro fases que cualquiera
   espera de un proyecto: no necesitan que nadie las explique, y el mensaje de
   esta sección nunca estuvo en ellas — está en que las dos últimas no terminan.
   Cuatro párrafos preparando el argumento le quitaban sitio al argumento.

   Las dos recurrentes SÍ conservan su línea, y la asimetría es deliberada: se
   ve que esas dos pesan más antes de haberlas leído. */
const FASES = [
  { n: '01', t: 'Discover' },
  { n: '02', t: 'Diagnose' },
  { n: '03', t: 'Design' },
  { n: '04', t: 'Build' },
] as const

const RECURRENTES = [
  { n: '05', t: 'Operate',  d: 'Funciona todos los días, y alguien responde de que funcione.' },
  { n: '06', t: 'Optimize', d: 'Se mide, se corrige y se amplía.' },
] as const

export default function ModeloOperativo() {
  return (
    <div className="mt-10 md:mt-14">
      {/* SECUENCIA, no rejilla (22-sep). Al quitarles la descripcion, las cuatro
          fases quedaron como cuatro celdas de ~300 px con dos palabras dentro:
          mas hueco que contenido, y cuatro cajas iguales ademas. En una fila
          corrida ocupan una franja fina, se leen como lo que son —un orden— y,
          sobre todo, dejan de competir en peso con el bloque de abajo. Que 05 y
          06 dominen no es estetica: es el argumento de la seccion. */}
      <ol className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-mist py-5">
        {FASES.map(f => (
          <li key={f.n} className="flex items-baseline gap-2.5">
            <span className="text-[12px] font-600 tracking-[0.06em] text-void/65 tabular-nums">{f.n}</span>
            <h3 className="text-lg font-600 tracking-[-0.01em] text-void">{f.t}</h3>
          </li>
        ))}
      </ol>

      <Reveal delay={60}>
        <ol className="mt-5 grid gap-px bg-mist border border-mist sm:grid-cols-2 overflow-hidden rounded-lg">
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
        {/* El párrafo que había aquí —«ahí está la diferencia entre encargar un
            proyecto y tener una infraestructura operada»— decía exactamente lo
            que dice la pareja de abajo, y encima de ella. Se fue el 22-sep: la
            frase en grande abre, y las dos columnas lo explican. */}

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
