import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Política de privacidad — VELIA',
  description:
    'Cómo trata VELIA los datos personales: responsable, finalidades, base jurídica, destinatarios, conservación y derechos RGPD.',
  alternates: { canonical: 'https://veliacorp.com/privacidad' },
}

/* Describe el modelo de datos ACTUAL (decisión 2026-07-16): los datos del servicio
   se alojan en infraestructura UE (Supabase) y VELIA actúa como encargado del
   tratamiento respecto de los datos de los despachos. BYO-Drive es roadmap y NO
   se menciona como realidad. Revisión legal (Axel) en paralelo — v1.0. */

export default function PrivacidadPage() {
  return (
    <>
      <h1>Política de privacidad</h1>
      <p className="legal-meta">Versión 1.0 · Última actualización: 16 de julio de 2026</p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de los datos personales recogidos a través de este
        sitio web es <strong>VELIA Marketing SL</strong> («VELIA»). Contacto para cualquier
        cuestión de privacidad: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Qué datos tratamos y para qué</h2>
      <ul>
        <li>
          <strong>Formulario de contacto / demo:</strong> nombre, nombre del despacho, email,
          teléfono (opcional) y el mensaje que nos envías. Finalidad: responder a tu
          solicitud, agendar la demostración y hacer el seguimiento comercial de la misma.
          Base jurídica: tu consentimiento (art. 6.1.a RGPD) y la aplicación de medidas
          precontractuales a petición tuya (art. 6.1.b RGPD).
        </li>
        <li>
          <strong>Alta en la prueba gratuita:</strong> nombre, email, teléfono, contraseña y
          la información sobre tu despacho que aportas durante el registro. Finalidad: crear
          tu cuenta, prestarte el servicio durante el periodo de prueba y acompañarte en su
          uso. Base jurídica: ejecución del contrato / medidas precontractuales (art. 6.1.b
          RGPD).
        </li>
        <li>
          <strong>Navegación:</strong> esta web utiliza una analítica sin cookies que trabaja
          con datos agregados y anónimos (ver <Link href="/cookies">Política de cookies</Link>).
          No creamos perfiles publicitarios ni hacemos seguimiento entre sitios.
        </li>
      </ul>

      <h2>3. Los datos de tu despacho, cuando usas VELIA</h2>
      <p>
        Si tu despacho contrata VELIA, los datos que gestionas dentro de la plataforma
        (clientes, expedientes, documentos, agenda) <strong>son y siguen siendo de tu
        despacho</strong>: tu despacho es el responsable del tratamiento y VELIA actúa como
        encargado del tratamiento conforme al art. 28 RGPD, en virtud del acuerdo de encargo
        (DPA) que se suscribe con el servicio. Esos datos se alojan en infraestructura de la
        Unión Europea, con aislamiento por despacho a nivel de base de datos, y puedes
        solicitar su exportación completa en cualquier momento. Puedes pedirnos el modelo de
        DPA en <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>4. Destinatarios y encargados</h2>
      <p>
        No vendemos ni cedemos tus datos a terceros. Para prestar el servicio nos apoyamos en
        proveedores que actúan como encargados o subencargados del tratamiento, con contratos
        conforme al art. 28 RGPD:
      </p>
      <ul>
        <li><strong>Supabase</strong> — base de datos y almacenamiento (región Unión Europea).</li>
        <li><strong>Vercel</strong> — alojamiento de la web y de la aplicación.</li>
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
        solicites su supresión. Los datos de cuentas de prueba que no continúan con el
        servicio se eliminan pasado el plazo razonable de seguimiento. Los datos del servicio
        contratado se conservan mientras la suscripción esté activa y se devuelven o eliminan
        a su término, conforme al DPA.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión,
        oposición, limitación del tratamiento y portabilidad escribiendo a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. También tienes derecho a
        retirar el consentimiento prestado y a presentar una reclamación ante la Agencia
        Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas apropiadas: cifrado de las comunicaciones
        (HTTPS/TLS), aislamiento de datos por despacho en el propio motor de base de datos
        (Row Level Security), control de acceso por roles y registro de auditoría de las
        acciones sensibles. El detalle está publicado en{' '}
        <Link href="/seguridad">veliacorp.com/seguridad</Link>.
      </p>
    </>
  )
}
