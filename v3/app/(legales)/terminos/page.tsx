import type { Metadata } from 'next'
import Link from 'next/link'
import { EMAIL_TITULAR_LEGAL } from '@/lib/constants'
import { metadatosDePagina } from '@/lib/metadatos'

/* Por `metadatosDePagina`: hasta el 18-sep esta pagina heredaba el openGraph
   entero del layout, asi que compartir su enlace ensenaba el titulo de la
   portada y su `og:url` apuntaba a la raiz del sitio. Esto es metadata, no
   el texto del documento: el contenido legal no se toca desde aqui. */
export const metadata: Metadata = metadatosDePagina({
  titulo: 'Términos del servicio — VELIA',
  descripcion:
    'Condiciones de contratación de los servicios de VELIA: cómo se contrata, alcance y precio, titularidad de los datos, uso de la IA y responsabilidad.',
  ruta: '/terminos',
})

/* ── v2.0, 26-sep-2026 · SE RETIRA UNA OFERTA QUE YA NO EXISTE ───────────────
   Las cláusulas 1 a 4 describían el SaaS jurídico: «plataforma en la nube para
   despachos», prueba gratuita de 15 días, «VELIA Despacho 99€/mes por despacho»,
   29€/mes por usuario adicional, 990€/año, Programa Fundadores con 20 plazas y
   precio congelado, y permanencia de 3 meses. Ese producto quedó DESCONTINUADO
   en septiembre de 2026 y seguía publicado aquí como oferta vigente: no era una
   página desactualizada, era una oferta contractual falsa.

   Lo que se ha hecho, y lo que NO:
     · se RETIRA la oferta y se sustituye por el modelo real (propuesta escrita
       por encargo; proyecto + operación + ampliaciones), sin publicar cifras;
     · se GENERALIZA el vocabulario del vertical —«despacho», «el abogado»— que
       presuponía que todo cliente es un bufete. La sustancia jurídica de las
       cláusulas 5 a 12 NO se toca: titularidad de datos, art. 28 RGPD, DPA,
       infraestructura UE, límite de responsabilidad, ley aplicable;
     · el caso regulado sigue contemplado EXPRESAMENTE en la cláusula de IA, que
       es donde importa;
     · NO se inventa ninguna cláusula, ningún importe ni ningún plazo. Lo que
       antes afirmaba un número, ahora remite a la propuesta aceptada.

   ⚠️ El CIF y el domicilio siguen siendo `WAITING_FOR_HUMAN_LEGAL_DATA` y no
   aparecen aquí: viven en /aviso-legal y /privacidad. Esta página no los usa.
   ⚠️ Revisión de Axel pendiente antes de publicar: el texto legal es suyo. */

export default function TerminosPage() {
  return (
    <>
      <h1>Términos del servicio</h1>
      <p className="legal-meta">Versión 2.0 · Última actualización: 26 de septiembre de 2026</p>

      <h2>1. Objeto</h2>
      <p>
        Estos términos regulan la contratación y el uso de los servicios de{' '}
        <strong>VELIA Solutions SL</strong> («VELIA»), compañía de transformación y operación
        digital: diseña, construye, integra, automatiza y opera la infraestructura digital de
        una empresa o profesional. Al contratar un servicio o usar el entorno que VELIA opera
        para ti aceptas estos términos y la{' '}
        <Link href="/privacidad">Política de privacidad</Link>.
      </p>

      <h2>2. Cómo se contrata</h2>
      <p>
        VELIA no comercializa un plan cerrado de software con alta automática. Cada encargo
        parte de un análisis del alcance y se concreta en una <strong>propuesta escrita</strong>{' '}
        con los servicios incluidos, su duración y su precio. El contrato entre las partes es
        esa propuesta una vez aceptada, junto con estos términos.
      </p>

      <h2>3. Alcance y precio</h2>
      <p>
        No existe una tarifa de catálogo. El precio de cada encargo depende del alcance, de la
        infraestructura necesaria, de la complejidad de las integraciones y del nivel de
        operación continuada que requiera el negocio. Un encargo suele tener dos componentes
        distinguibles: un <strong>proyecto inicial</strong>, con principio y final, y una{' '}
        <strong>operación recurrente</strong> de la infraestructura construida. Las ampliaciones
        posteriores se acuerdan por separado.
      </p>
      <p>
        Los importes aplicables, los impuestos repercutibles y la forma de pago son los que
        figuren en la propuesta aceptada. Ninguna cifra publicada en este sitio constituye una
        oferta.
      </p>

      <h2>4. Duración y baja</h2>
      <p>
        La duración, la renovación y el preaviso de baja son los que figuren en la propuesta
        aceptada para cada servicio. Puedes comunicar la baja a{' '}
        <a href={`mailto:${EMAIL_TITULAR_LEGAL}`}>{EMAIL_TITULAR_LEGAL}</a>. La baja de la
        operación recurrente no afecta a la titularidad de tus datos, que se rige por la
        cláusula siguiente.
      </p>

      <h2>5. Los datos de tu negocio</h2>
      <p>
        Los datos que tu negocio gestiona en el entorno que VELIA opera (clientes, contactos,
        documentos, agenda y los registros propios de tu actividad) son titularidad tuya.
        VELIA actúa como encargado del tratamiento (art. 28 RGPD) conforme al acuerdo de
        encargo (DPA) disponible bajo solicitud. Los datos se alojan en infraestructura de la
        Unión Europea con aislamiento por cliente. A la finalización del servicio puedes
        solicitar su exportación completa.
      </p>

      <h2>6. Uso de la inteligencia artificial</h2>
      <p>
        Las funciones de IA del entorno (redacción de borradores, informes, consultas a
        fuentes) son herramientas de apoyo: generan borradores y propuestas citando su fuente,
        pero <strong>no constituyen asesoramiento profesional de VELIA</strong>. La revisión,
        la validación y la decisión final corresponden siempre a la persona responsable en tu
        negocio. Cuando el entorno esté configurado para un sector regulado —por ejemplo el
        jurídico—, esto incluye expresamente que ningún resultado de la IA sustituye al
        criterio ni a la firma del profesional colegiado. Los datos enviados a la API de IA no
        se utilizan para entrenar modelos, por política contractual del proveedor.
      </p>

      <h2>7. Uso aceptable</h2>
      <p>
        Te comprometes a usar el servicio conforme a la ley y, cuando tu actividad esté
        colegiada o regulada, a su deontología profesional; a custodiar tus credenciales de
        acceso; y a no intentar acceder a datos de otros clientes, vulnerar la seguridad del
        entorno o revender el servicio sin acuerdo con VELIA.
      </p>

      <h2>8. Disponibilidad y soporte</h2>
      <p>
        VELIA se presta como servicio en la nube con el objetivo de máxima disponibilidad. No
        obstante, pueden producirse interrupciones puntuales por mantenimiento o causas ajenas.
        El soporte se presta en horario laborable a través de los canales indicados en la
        plataforma y en <a href={`mailto:${EMAIL_TITULAR_LEGAL}`}>{EMAIL_TITULAR_LEGAL}</a>.
      </p>

      <h2>9. Propiedad intelectual</h2>
      <p>
        El software, la marca y los materiales de VELIA son titularidad de VELIA o de sus
        licenciantes. La contratación concede una licencia de uso no exclusiva e
        intransferible durante la vigencia del servicio contratado. Los contenidos y datos que
        tu negocio introduce en el entorno siguen siendo suyos.
      </p>

      <h2>10. Responsabilidad</h2>
      <p>
        En la medida permitida por la ley, la responsabilidad total de VELIA por daños
        derivados del servicio se limita al importe pagado por el cliente en los doce meses
        anteriores al hecho que la origine. VELIA no responde de decisiones adoptadas sobre la
        base de borradores o informes generados por la IA sin la revisión de la persona
        responsable en el negocio del cliente.
      </p>

      <h2>11. Modificaciones</h2>
      <p>
        VELIA puede actualizar estos términos. Los cambios sustanciales se comunicarán con
        antelación razonable por email o dentro del propio entorno. Los importes acordados en
        una propuesta ya aceptada no se alteran por una actualización de estos términos.
      </p>

      <h2>12. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por la legislación española. Las partes se someten a los
        juzgados y tribunales españoles que correspondan conforme a la normativa aplicable.
      </p>
    </>
  )
}
