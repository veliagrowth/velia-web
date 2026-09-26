import type { Metadata } from 'next'
import Link from 'next/link'
import { EMAIL_TITULAR_LEGAL } from '@/lib/constants'
import { metadatosDePagina } from '@/lib/metadatos'

/* Por `metadatosDePagina`: hasta el 18-sep esta pagina heredaba el openGraph
   entero del layout, asi que compartir su enlace ensenaba el titulo de la
   portada y su `og:url` apuntaba a la raiz del sitio. Esto es metadata, no
   el texto del documento: el contenido legal no se toca desde aqui. */
export const metadata: Metadata = metadatosDePagina({
  titulo: 'Política de privacidad — VELIA',
  descripcion:
    'Cómo trata VELIA los datos personales: responsable, finalidades, base jurídica, destinatarios, conservación y derechos RGPD.',
  ruta: '/privacidad',
})

/* Describe el modelo de datos ACTUAL (decisión 2026-07-16): los datos del servicio
   se alojan en infraestructura UE (Supabase) y VELIA actúa como encargado del
   tratamiento respecto de los datos del cliente. BYO-Drive es roadmap y NO se
   menciona como realidad.

   ── v1.2, 26-sep-2026 ──────────────────────────────────────────────────────
   Describía dos flujos que YA NO EXISTEN —«Formulario de contacto / demo» y
   «Alta en la prueba gratuita»— y trataba «despacho» como sinónimo de cliente.
   Una política de privacidad que enumera finalidades de un alta inexistente no
   es sólo vieja: declara tratamientos que no se hacen.

   Lo que cambia: los dos supuestos del §2 pasan a los reales (contacto y alta
   en el entorno contratado), y el sujeto se generaliza en §3, §5 y §8.
   Lo que NO cambia, porque es lo que tiene efectos: responsable, bases
   jurídicas (6.1.a y 6.1.b), art. 28 RGPD y DPA, infraestructura UE, Clarity
   con consentimiento y transferencia fuera del EEE, plazos de conservación,
   derechos y medidas de seguridad.

   ⚠️ WAITING_FOR_HUMAN_LEGAL_DATA — el §1 identifica al responsable sólo por
   denominación y correo. El RGPD (art. 13.1.a) pide identidad y datos de
   contacto del responsable; sin CIF ni domicilio queda incompleto, igual que en
   /aviso-legal. No se inventan. ⚠️ Revisión de Axel pendiente. */

export default function PrivacidadPage() {
  return (
    <>
      <h1>Política de privacidad</h1>
      <p className="legal-meta">Versión 1.2 · Última actualización: 26 de septiembre de 2026</p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de los datos personales recogidos a través de este
        sitio web es <strong>VELIA Solutions SL</strong> («VELIA»). Contacto para cualquier
        cuestión de privacidad: <a href={`mailto:${EMAIL_TITULAR_LEGAL}`}>{EMAIL_TITULAR_LEGAL}</a>.
      </p>

      <h2>2. Qué datos tratamos y para qué</h2>
      <ul>
        <li>
          <strong>Formulario de contacto:</strong> nombre, nombre de la empresa, email,
          teléfono (opcional) y el mensaje que nos envías. Finalidad: responder a tu
          solicitud, entender el encargo y hacer su seguimiento comercial. Base jurídica: tu
          consentimiento (art. 6.1.a RGPD) y la aplicación de medidas precontractuales a
          petición tuya (art. 6.1.b RGPD).
        </li>
        <li>
          <strong>Alta en el entorno que VELIA opera para ti:</strong> nombre, email, teléfono,
          credenciales de acceso y la información sobre tu negocio necesaria para configurarlo.
          Finalidad: crear tu acceso, prestarte el servicio contratado y acompañarte en su uso.
          Base jurídica: ejecución del contrato (art. 6.1.b RGPD).
        </li>
        <li>
          <strong>Navegación:</strong> medimos las páginas vistas y los eventos de uso con
          una analítica <strong>sin cookies</strong>, agregada y anónima. Además, y{' '}
          <strong>solo si nos das tu consentimiento</strong>, usamos Microsoft Clarity para
          ver mapas de calor y reproducciones anónimas de la navegación, con el contenido de
          la página desactivado y los formularios enmascarados. La base jurídica es tu
          consentimiento (art. 6.1.a RGPD), puedes retirarlo cuando quieras y Microsoft puede
          tratar esos datos fuera del EEE. Detalle completo, cookies concretas y plazos en la{' '}
          <Link href="/cookies">Política de cookies</Link>. No creamos perfiles publicitarios
          ni hacemos seguimiento entre sitios.
        </li>
      </ul>

      <h2>3. Los datos de tu negocio, cuando VELIA opera tu entorno</h2>
      <p>
        Si contratas a VELIA, los datos que gestionas dentro del entorno que opera para ti
        (clientes, contactos, documentos, agenda y los registros propios de tu actividad)
        <strong> son y siguen siendo tuyos</strong>: tu negocio es el responsable del
        tratamiento y VELIA actúa como encargado del tratamiento conforme al art. 28 RGPD, en
        virtud del acuerdo de encargo (DPA) que se suscribe con el servicio. Esos datos se
        alojan en infraestructura de la Unión Europea, con aislamiento por cliente a nivel de
        base de datos, y puedes solicitar su exportación completa en cualquier momento. Puedes
        pedirnos el modelo de DPA en{' '}
        <a href={`mailto:${EMAIL_TITULAR_LEGAL}`}>{EMAIL_TITULAR_LEGAL}</a>.
      </p>

      <h2>4. Destinatarios y encargados</h2>
      <p>
        No vendemos ni cedemos tus datos a terceros. Para prestar el servicio nos apoyamos en
        proveedores que actúan como encargados o subencargados del tratamiento, con contratos
        conforme al art. 28 RGPD:
      </p>
      <ul>
        <li><strong>Supabase</strong> — base de datos y almacenamiento (región Unión Europea).</li>
        <li><strong>Cloudflare</strong> — red de distribución, seguridad y analítica de páginas vistas sin cookies.</li>
        <li>
          <strong>Microsoft (Clarity)</strong> — mapas de calor y grabación anónima de la
          navegación en la web pública. <strong>Solo con tu consentimiento</strong> y
          únicamente en veliacorp.com: nunca dentro de la aplicación. Puede tratar datos
          fuera del Espacio Económico Europeo.
        </li>
        <li><strong>Hetzner</strong> — servidores propios de automatización (Alemania, UE).</li>
        <li><strong>Resend</strong> — envío de emails transaccionales.</li>
        <li><strong>Google Workspace</strong> — correo corporativo.</li>
        <li>
          <strong>Anthropic</strong> — procesamiento de IA vía API para las funciones del
          asistente del servicio. Por política contractual del proveedor, los datos enviados
          a través de la API no se utilizan para entrenar modelos.
        </li>
      </ul>
      <p>
        Cuando alguno de estos proveedores procesa datos fuera del Espacio Económico Europeo,
        la transferencia se ampara en decisiones de adecuación (como el EU-US Data Privacy
        Framework) o en cláusulas contractuales tipo de la Comisión Europea.
      </p>

      <h2>5. Conservación</h2>
      <p>
        Los datos de contacto comercial se conservan mientras dure la relación o hasta que
        solicites su supresión. Los datos de un encargo que no llega a contratarse se eliminan
        pasado el plazo razonable de seguimiento. Los datos del servicio contratado se
        conservan mientras el servicio esté activo y se devuelven o eliminan a su término,
        conforme al DPA.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión,
        oposición, limitación del tratamiento y portabilidad escribiendo a{' '}
        <a href={`mailto:${EMAIL_TITULAR_LEGAL}`}>{EMAIL_TITULAR_LEGAL}</a>. También tienes derecho a
        retirar el consentimiento prestado y a presentar una reclamación ante la Agencia
        Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas apropiadas: cifrado de las comunicaciones
        (HTTPS/TLS), aislamiento de datos por cliente en el propio motor de base de datos
        (Row Level Security), control de acceso por roles y registro de auditoría de las
        acciones sensibles. El detalle está publicado en{' '}
        <Link href="/seguridad">veliacorp.com/seguridad</Link>.
      </p>
    </>
  )
}
