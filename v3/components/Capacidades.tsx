import Link from 'next/link'
import Reveal from '@/components/Reveal'

/**
 * Las cuatro capacidades de VELIA (§8 de la dirección).
 *
 * POR QUÉ NO SON CUATRO TARJETAS. La rejilla de tarjetas iguales es la firma
 * visual del sitio generado: cuatro cajas del mismo tamaño dicen que las cuatro
 * cosas son intercambiables, y aquí no lo son —Digital Foundation es el suelo
 * sobre el que se apoyan las otras tres—. Se usa una composición editorial: una
 * fila por capacidad, índice a la izquierda, y una hairline separando. El ojo
 * lee una secuencia, no un menú.
 *
 * Los nombres se quedan en inglés porque la dirección los fijó así (§8) y son
 * nombres propios, no traducciones pendientes. Todo lo demás va en español.
 *
 * La tercera columna NO son «features»: son las piezas concretas que el cliente
 * reconoce de su propio negocio. Sin ellas, las cuatro capacidades suenan a
 * consultoría; con ellas, se entiende qué se compra.
 */

interface Capacidad {
  n: string
  nombre: string
  titular: string
  cuerpo: string
  piezas: readonly string[]
  /** Solo Digital Operations. Es la capacidad diferencial y se pinta distinta. */
  destacada?: boolean
  /**
   * El conocimiento publicado que explica la capacidad (19-sep-2026).
   *
   * Sólo la lleva la capacidad que TIENE algo escrito. No se rellena en las
   * demás por simetría: un enlace a una página que no existe es un 404, y uno a
   * una página genérica es relleno. Mientras tanto, la asimetría es la verdad.
   *
   * ⚠️ 20-sep: apuntaba a la guía porque el hub no existía. Ahora existe, y es
   * a él: desde la Home se entra al tema, y el tema reparte a sus piezas. Si
   * esto siguiera apuntando a una de las hijas, la otra sólo se encontraría
   * desde dentro de la primera.
   */
  guia?: { href: string; texto: string }
}

const CAPACIDADES: readonly Capacidad[] = [
  {
    n: '01',
    nombre: 'Digital Foundation',
    titular: 'La base sobre la que se apoya todo lo demás.',
    cuerpo:
      'La web, su arquitectura, el dominio, el alojamiento, la analítica, el seguimiento, los formularios y el CRM. No como piezas sueltas que alguien conectó una vez, sino como un sistema con dueño.',
    piezas: ['Web y arquitectura', 'Dominio y alojamiento', 'Analítica y tracking', 'CRM', 'Integraciones', 'Identidad digital'],
  },
  {
    n: '02',
    nombre: 'AI Search & Digital Visibility',
    titular: 'Que te encuentren las personas y te entiendan las máquinas.',
    cuerpo:
      'Buscadores, búsqueda generativa, rastreadores y agentes leen tu negocio antes que ningún cliente. Preparamos la infraestructura para que lo que encuentren sea correcto, completo y contextualizado.',
    piezas: ['Estructura semántica', 'Datos estructurados', 'Legibilidad por máquinas', 'Presencia local', 'Contenido'],
    guia: {
      href: '/ai-search',
      texto: 'Qué es AI Search y qué significa para una empresa',
    },
  },
  {
    n: '03',
    nombre: 'Growth & Automation',
    titular: 'De la atención al cliente, sin que nada se caiga por el camino.',
    cuerpo:
      'El recorrido completo: atención, visita, contacto, captura, CRM, cualificación, seguimiento, conversión y retención. Automatizado donde automatizar mejora el resultado, y solo ahí.',
    piezas: ['Captación', 'Seguimiento', 'Cualificación', 'Automatización de procesos', 'Conversión'],
  },
  {
    n: '04',
    nombre: 'Digital Operations',
    titular: 'Lo que casi nadie hace: quedarse.',
    cuerpo:
      'Mantenimiento, monitorización, medición, corrección y evolución. Un sistema digital no se termina: se opera. Es la capacidad que separa a VELIA de quien entrega un proyecto y se va.',
    piezas: ['Monitorización', 'Medición', 'Mantenimiento', 'Optimización continua', 'Evolución'],
    destacada: true,
  },
]

export default function Capacidades() {
  return (
    <ul className="mt-14 md:mt-20">
      {CAPACIDADES.map((c, i) => (
        <Reveal as="li" key={c.n} delay={i === 0 ? 0 : 60} className="hairline">
          <div className="grid gap-x-10 gap-y-4 py-10 md:py-14 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1.1fr_0.9fr]">
            <span className={`indice ${c.destacada ? 'text-gold-ink' : 'text-slate'}`} aria-hidden="true">
              {c.n}
            </span>

            <div>
              <h3 className="text-xl md:text-2xl font-600 tracking-[-0.02em] text-void">
                {c.nombre}
              </h3>
              <p className="mt-2 text-lg md:text-xl font-400 text-void/80 leading-snug max-w-[30ch]">
                {c.titular}
              </p>
            </div>

            {/* `md:col-span-2` NO es cosmética. En tablet la rejilla tiene dos
                columnas y este es el TERCER hijo, así que sin el span caía en la
                fila siguiente dentro de la primera columna — y esa columna es
                `auto`, o sea que se dimensiona a su contenido: el párrafo la
                ensanchaba y estrujaba el nombre de la capacidad contra el borde
                derecho. Se veía roto a 768 px y perfecto a 390 y a 1440. */}
            <div className="md:col-span-2 lg:col-span-1 lg:pt-1">
              <p className="text-[15px] leading-[1.6] text-void/65 max-w-prose">{c.cuerpo}</p>
              {/* Texto corrido separado por puntos medios, no «chips»: una fila de
                  píldoras convierte capacidades en un catálogo de funciones. */}
              <p className="mt-4 text-[13px] leading-[1.7] text-void/65">
                {c.piezas.join(' · ')}
              </p>
              {/* `inline-block py-1`: enlace suelto, no dentro de un párrafo, así
                  que no le ampara la excepción de WCAG 2.2 para enlaces en línea y
                  necesita sus 24 px de alto. */}
              {c.guia && (
                <Link
                  href={c.guia.href}
                  className="mt-4 inline-block py-1 text-[15px] font-600 text-gold-ink underline decoration-gold-ink/30 underline-offset-4 hover:decoration-gold-ink transition-colors"
                >
                  {c.guia.texto}
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </ul>
  )
}
