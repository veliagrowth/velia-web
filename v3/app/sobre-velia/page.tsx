import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/Reveal'
import { CtaSobreOscuro } from '@/components/Conocimiento'
import { metadatosDePagina } from '@/lib/metadatos'

/**
 * /sobre-velia — REESCRITA EN EL REWORK 2026, etapa 2.
 *
 * QUÉ PUBLICABA HASTA HOY, y por qué no podía quedarse:
 *
 *   title        «Sobre VELIA | Plataforma de IA para industrias especializadas»
 *   description  «…VELIA Legal es su primer vertical…»
 *   cuerpo       «Un despacho no debería necesitar cinco programas»
 *                «VELIA es un producto de software, no un servicio a medida»
 *                «Suscripción, no facturación por horas»
 *   cierre       «¿Quieres verlo con los casos de tu despacho?» + TrialButton
 *
 * Las dos primeras líneas son la tesis del 22-ago —«VELIA es la plataforma,
 * VELIA Legal su primer vertical»—, DEROGADA el 9-sep por
 * VELIA_DIRECCION_2026-09.md (§5, §83-86). Las tres siguientes afirman lo
 * contrario de lo que dice la Home a un clic de distancia: allí VELIA construye
 * y OPERA infraestructura, aquí vendía una suscripción a un producto cerrado.
 *
 * Y no era una página olvidada en un rincón: `app/sitemap.ts` la propone a los
 * buscadores con prioridad 0.7. La web se estaba ofreciendo a sí misma, ante
 * personas y ante máquinas, con dos identidades incompatibles a la vez — que es
 * exactamente el fallo que la capacidad «AI Search & Digital Visibility» dice
 * saber resolver en el negocio de otro.
 *
 * QUÉ ES AHORA. La Home dice QUÉ hace VELIA. Esta página responde a lo único
 * que queda después: POR QUÉ se le puede creer. No repite las cuatro
 * capacidades ni las seis fases —viven en la Home, y duplicarlas serían dos
 * relojes que en cuanto se toca uno dejan de dar la misma hora—; cuenta el
 * modelo, los principios con los que se decide qué se construye, y quién
 * responde.
 *
 * CINCO MOMENTOS, con el ritmo de la Home y ninguna forma repetida:
 *
 *   1  AFIRMACIÓN      Pearl Cloud  · el único h1
 *   2  QUÉ ES OPERAR   NIGHT        ← corte 1: la diferencia de modelo
 *   3  CÓMO DECIDIMOS  Pearl Cloud  · los principios, en secuencia editorial
 *   4  QUIÉN RESPONDE  blanco       · el equipo, sin inventar tamaño
 *   5  CIERRE          NIGHT        ← corte 2: una acción
 *
 * NI UNA CIFRA. No hay año de fundación, ni número de clientes, ni proyectos
 * entregados, ni porcentajes. Nada de eso tiene fuente auditable hoy, y las
 * métricas que hubo en esta web se retiraron el 29-jul por ese mismo motivo.
 * Lo único verificable que se publica es un cliente con nombre y un enlace que
 * funciona — igual que en el momento 7 de la Home.
 *
 * ⚠️ LO QUE NO SE CUENTA, Y ES DELIBERADO: el origen de la compañía. VELIA
 * viene de una etapa anterior, y cómo se cuenta eso en público —si se cuenta—
 * es una decisión de marca, no de implementación. Está registrada como abierta
 * en la memoria del proyecto: «manual_interno_velia → misión, visión, valores e
 * historia sin escribir». Inventar aquí una historia fundacional sería ponerle
 * a la compañía unas palabras que nadie ha decidido. Queda como HUMAN_DECISION.
 */

/* Los cuatro sitios donde se declara la entidad —title, description, JSON-LD
   del layout y llms.txt— tienen que decir lo mismo, o no hay entidad, hay
   ruido. Estos dos campos eran el unico par que seguia diciendo otra cosa. */
/* Va por `metadatosDePagina` para que el `og:title` y el `og:url` se deriven de
   la MISMA declaracion que el <title> y el canonical. Hasta el 18-sep esta
   pagina heredaba el openGraph entero del layout: compartirla enseñaba el
   titulo de la portada, y su `og:url` apuntaba a la raiz del sitio. */
export const metadata: Metadata = metadatosDePagina({
  titulo: 'Sobre VELIA | Compañía de transformación y operación digital',
  tituloAlCompartir: 'Sobre VELIA — construimos y operamos, no entregamos y nos vamos',
  descripcion:
    'Quién es VELIA y por qué construye y opera la infraestructura digital de un negocio en lugar de entregar un proyecto y desaparecer: el modelo, los principios con los que decide qué construir y quién responde.',
  ruta: '/sobre-velia',
})

/**
 * Los principios no son valores de folleto: cada uno describe una decisión que
 * se toma de verdad, y cada uno tiene su contrario evidente. Un principio que
 * nadie podría discutir no informa de nada — «apostamos por la excelencia» no
 * distingue a VELIA de ninguna empresa del mundo.
 */
const PRINCIPIOS = [
  {
    n: '01',
    titular: 'La IA no se usa porque esté de moda.',
    cuerpo:
      'Un modelo de lenguaje es la herramienta correcta para algunas cosas y la equivocada para muchas otras. Cuando una operación es determinista, se resuelve con código que no falla ni cambia de opinión. La IA entra donde aporta, y ahí se supervisa.',
  },
  {
    n: '02',
    titular: 'La automatización se gobierna.',
    cuerpo:
      'Un proceso automático no recibe acceso ilimitado por el hecho de necesitar hacer su trabajo. Cada uno opera con permisos explícitos y acotados, y lo que hace queda registrado. Es más lento de construir, y es la única forma de poder dejarlo funcionando.',
  },
  {
    n: '03',
    titular: 'Lo que no está terminado se dice.',
    cuerpo:
      'Más abajo en esta página hay una sección que separa lo que está en marcha de lo que está en construcción. No es una cautela legal: una compañía que dice qué le falta es una compañía a la que se le puede creer lo que dice que tiene.',
  },
  {
    n: '04',
    titular: 'Se mide antes de afirmar.',
    cuerpo:
      'Ninguna afirmación llega a esta web sin una fuente detrás: hay un registro de verificación, y lo que no está verificado no se publica aunque sea cierto. Lo mismo se aplica dentro — un sistema que responde no es un sistema que funcione.',
  },
] as const

/**
 * El equipo, sin el encuadre anterior. Decía «Cierra despachos, gestiona
 * contratos» y «el Cerebro VELIA»: el vocabulario de un SaaS jurídico, más un
 * nombre interno que fuera de casa no significa nada.
 *
 * Tampoco se dice cuántos somos. «Dos personas, sin oficina, sin ronda» fue
 * cierto y se quitó el 29-jul porque transmitía fragilidad operativa; volver a
 * ponerlo ahora, en una compañía que se ofrece a OPERAR la infraestructura de
 * otro, sería peor. El hecho relevante no es el tamaño: es que quien decide
 * está en contacto directo con quien usa lo que se decide.
 */
const EQUIPO = [
  {
    nombre: 'Joaquín Paiva',
    rol: 'Producto y tecnología',
    cuerpo:
      'Diseña y construye la infraestructura: arquitectura, integraciones, automatización y la operación del día a día.',
  },
  {
    nombre: 'Axel Soto',
    rol: 'Legal y relación con el cliente',
    cuerpo:
      'Lleva el marco contractual y es el interlocutor directo de cada cliente durante el proyecto y después de él.',
  },
] as const

export default function SobreVeliaPage() {
  return (
    <>
      {/* ═══ 1 · AFIRMACIÓN ═══════════════════════════════════════════════
          El h1 no repite el de la Home. Aquél dice qué hace VELIA; éste, qué
          la hace distinta, que es a lo que se viene a una página «sobre». */}
      <section aria-labelledby="t-sv-afirmacion" className="mx-auto max-w-6xl px-6 md:px-10 pt-20 pb-16 md:pt-28 md:pb-24">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold-ink">
          Sobre VELIA
        </p>
        <h1 id="t-sv-afirmacion" className="mt-6 text-[clamp(2.15rem,5.6vw,4.5rem)] font-600 tracking-[-0.035em] leading-[1.04] text-void max-w-[17ch]">
          Casi nadie se queda después de entregar. Ahí empieza el trabajo.
        </h1>
        <p className="mt-8 text-lg md:text-xl leading-[1.6] text-void/70 max-w-prose">
          VELIA es una compañía de transformación y operación digital. Diseñamos el sistema
          digital de un negocio, lo construimos, lo integramos, lo automatizamos y seguimos
          operándolo mientras el negocio funciona.
        </p>
      </section>

      {/* ═══ 2 · QUÉ SIGNIFICA OPERAR · CORTE OSCURO 1 ════════════════════
          El corte va aquí porque aquí cambia lo que se está contando: se pasa
          de quiénes somos a en qué se diferencia el modelo. Es el único sitio
          de la página donde una comparación está justificada — y se hace sin
          nombrar a nadie ni descalificar a nadie. */}
      <section aria-labelledby="t-sv-modelo" className="velia-dark-stage bg-void text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-gold/85">
            El modelo
          </p>
          <h2 id="t-sv-modelo" className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] max-w-[20ch]">
            La palabra que carga con la diferencia es operar.
          </h2>
          <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-cream/70 max-w-prose">
            Hay tres formas habituales de que alguien te ayude con lo digital, y las tres
            terminan en el mismo sitio: contigo sosteniendo el resultado.
          </p>

          {/* Tres afirmaciones y una cuarta que rompe la serie. NO es una
              rejilla de cuatro tarjetas iguales: las tres primeras comparten
              forma porque comparten destino, y la de VELIA se pinta aparte
              porque el argumento entero es que no está en la misma lista. */}
          <ul className="mt-12 md:mt-16 grid gap-px bg-cream/15 sm:grid-cols-3 overflow-hidden rounded-lg">
            {[
              { quien: 'Una agencia', que: 'entrega y se va.' },
              { quien: 'Una consultora', que: 'recomienda y se va.' },
              { quien: 'Un SaaS', que: 'te da la herramienta y la llenas tú.' },
            ].map(x => (
              <li key={x.quien} className="bg-void px-6 py-7">
                <p className="text-[13px] font-600 tracking-[0.02em] text-cream/85">{x.quien}</p>
                <p className="mt-1.5 text-[15px] leading-[1.5] text-cream/70">{x.que}</p>
              </li>
            ))}
          </ul>

          <Reveal delay={60}>
            <div className="mt-4 rounded-lg border border-gold/30 bg-gold/[0.07] px-6 py-8 md:px-9 md:py-10">
              <p className="text-[13px] font-600 tracking-[0.02em] text-gold/85">VELIA</p>
              <p className="mt-2 text-xl md:text-2xl font-400 leading-[1.35] tracking-[-0.01em] text-cream max-w-[32ch]">
                construye la infraestructura y se queda operándola.
              </p>
              <p className="mt-5 text-[15px] leading-[1.6] text-cream/70 max-w-prose">
                Eso cambia lo que se compra. No es un entregable con fecha de fin, sino un
                sistema del que responde alguien: se mantiene, se mide, se corrige y se amplía
                mientras el negocio lo necesite.
              </p>
              {/* ── EL ENTORNO NO ES UN EXTRA (22-sep-2026) ─────────────────
                  Sin este párrafo, quien lee la Home puede entender el entorno
                  como lo que entiende de cualquier proveedor: un panel que te
                  venden aparte y que se paga aunque no lo uses. Es la lectura
                  por defecto, porque es la que el mercado ha enseñado, y deshace
                  el argumento entero del modelo: si el entorno es un producto
                  adicional, VELIA vuelve a ser un SaaS con servicios.

                  Va aquí y no en la Home porque la Home ya enseña QUÉ es el
                  entorno y hasta dónde llega. Lo que falta responder es por qué
                  existe, y eso es una pregunta sobre el modelo — que es
                  literalmente el título de esta sección. */}
              <p className="mt-4 text-[15px] leading-[1.6] text-cream/70 max-w-prose">
                Y explica por qué cada cliente acaba teniendo su propio entorno. No se vende
                aparte: si alguien tiene que operar un sistema todos los días, hace falta un
                sitio donde se vea lo que está pasando. El entorno es la consecuencia de
                operar, no un añadido a la factura.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 3 · CÓMO DECIDIMOS ═══════════════════════════════════════════
          Composición editorial en filas, igual que las capacidades de la Home:
          índice a la izquierda, hairline de separación, el ojo lee una
          secuencia. Deliberadamente NO es una rejilla de cuatro cajas. */}
      <section aria-labelledby="t-sv-reglas" className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
        <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
          Cómo decidimos
        </p>
        <h2 id="t-sv-reglas" className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[21ch]">
          Cuatro reglas que deciden qué se construye y qué no.
        </h2>
        <p className="mt-5 text-[15px] md:text-base leading-[1.6] text-void/65 max-w-prose">
          No son valores: son las decisiones que más se repiten, y cada una tiene un contrario
          que se toma todos los días en este sector.
        </p>

        <ul className="mt-14 md:mt-20">
          {PRINCIPIOS.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i === 0 ? 0 : 60} className="hairline">
              <div className="grid gap-x-10 gap-y-3 py-10 md:py-12 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_0.9fr]">
                <span className="indice text-slate" aria-hidden="true">
                  {p.n}
                </span>
                <h3 className="text-lg md:text-xl font-600 tracking-[-0.015em] text-void max-w-[24ch] self-start">
                  {p.titular}
                </h3>
                {/* `md:col-span-2` por el mismo motivo que en Capacidades: en
                    tablet la rejilla es de dos columnas y éste es el TERCER
                    hijo, así que sin el span cae bajo la columna `auto` del
                    índice y la ensancha hasta estrujar el titular. */}
                <p className="md:col-span-2 lg:col-span-1 text-[15px] leading-[1.6] text-void/65 max-w-prose lg:pt-1">
                  {p.cuerpo}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ═══ 3b · (RETIRADO EL 24-sep-2026) ═══════════════════════════════
          Aquí iba «VELIA OS — Detrás de cada cliente hay infraestructura
          nuestra», con dos columnas: «En marcha» y «En construcción».

          La columna de la derecha era el backlog. Control Plane, agentes
          gobernados, VELIA 4.0 Audit, terceros dentro del entorno: cuatro cosas
          que VELIA todavía no tiene, publicadas en la página que alguien abre
          para decidir si trabajar con nosotros.

          El argumento con el que se escribió era bueno —una compañía que dice
          qué le falta es una compañía a la que se le puede creer lo que dice
          que tiene— y sigue siendo cierto de puertas adentro. De puertas
          afuera hace otra cosa: convierte a una empresa que ya opera sistemas
          reales en una empresa a medio construir. El visitante no está
          evaluando nuestro roadmap; está mirando si sabemos hacer lo suyo.

          Lo que se afirma sigue sin cambiar: esta página dice lo que VELIA
          hace y no promete ninguna capacidad que no exista. Simplemente deja
          de enumerar las que faltan.

          NO SE BORRA EL CONOCIMIENTO: `components/VeliaOS.tsx` queda sin uso y
          el estado real de cada capacidad vive donde se decide —`admin_tasks` y
          la documentación de arquitectura—, que es donde sirve para trabajar. */}

      {/* ═══ 4 · QUIÉN RESPONDE ═══════════════════════════════════════════
          Blanco sobre Pearl Cloud: es el momento más concreto de la página y
          conviene que respire distinto, igual que «La distancia» en la Home. */}
      <section aria-labelledby="t-sv-quien" className="bg-white border-y border-mist">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
                Quién responde
              </p>
              <h2 id="t-sv-quien" className="mt-5 text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] text-void max-w-[20ch]">
                Quien decide lo que se construye habla con quien lo usa.
              </h2>
              <p className="mt-6 text-[15px] md:text-base leading-[1.6] text-void/70 max-w-prose">
                No hay una capa entre el cliente y las personas que trabajan en su
                infraestructura. Quien diseña el sistema es quien lo opera, y por eso lo que se
                aprende operando vuelve al diseño en lugar de perderse por el camino.
              </p>
              <p className="mt-4 text-[15px] md:text-base leading-[1.6] text-void/70 max-w-prose">
                Cónsul Jurídico lleva funcionando así desde el principio: VELIA construyó su
                infraestructura y sigue operándola.{' '}
                <a
                  href="https://consuljuridico.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
                >
                  consuljuridico.com
                </a>
              </p>
            </div>

            <Reveal delay={80}>
              <ul className="space-y-10 lg:pt-2">
                {EQUIPO.map(persona => (
                  <li key={persona.nombre} className="hairline pt-8 first:border-t-0 first:pt-0">
                    <h3 className="text-lg font-600 tracking-[-0.01em] text-void">
                      {persona.nombre}
                    </h3>
                    <p className="mt-1 text-[11px] font-600 tracking-[0.06em] uppercase text-void/65">
                      {persona.rol}
                    </p>
                    <p className="mt-3 text-[15px] leading-[1.6] text-void/65 max-w-prose">
                      {persona.cuerpo}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 5 · CIERRE · CORTE OSCURO 2 ══════════════════════════════════
          Una sola acción, la misma de toda la web: `/contacto`. El
          `TrialButton` que había aquí se va —no hay prueba gratuita que
          ofrecer— pero NO se borra del repositorio: `/precios`, `/demo` y
          `/fundadores` siguen vivas y lo siguen usando. */}
      <section aria-labelledby="t-sv-cierre" className="velia-dark-stage bg-void text-cream">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20 md:py-28">
          <h2 id="t-sv-cierre" className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-600 tracking-[-0.03em] leading-[1.1] max-w-[20ch]">
            Si quieres saber cómo trabajaríamos contigo, se empieza hablando.
          </h2>
          {/* Era una COPIA de `CtaSobreOscuro` —mismo enlace, mismo evento, mismas
              clases, mismo microcopy— escrita a mano (22-sep). Dos versiones de
              lo mismo dejan de parecerse en el tercer cambio, y este era el
              tercero: al pasar la acción al `CtaFlecha`, esta página se habría
              quedado con la píldora anterior. Ahora pasa por el componente. */}
          <CtaSobreOscuro ubicacion="sobre_velia" />
          <p className="mt-10 text-[13px] leading-[1.6] text-cream/70 max-w-prose">
            ¿Prefieres ver primero qué hacemos?{' '}
            <Link
              href="/#capacidades"
              className="text-gold/85 underline decoration-gold/30 underline-offset-4 hover:decoration-gold/85 transition-colors"
            >
              Las cuatro capacidades
            </Link>{' '}
            están en la portada.
          </p>
        </div>
      </section>
    </>
  )
}
