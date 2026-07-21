import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Términos del servicio — VELIA',
  description:
    'Condiciones de contratación del servicio VELIA: prueba gratuita, planes y precios, datos del despacho, uso de la IA y responsabilidad.',
  alternates: { canonical: 'https://veliacorp.com/terminos' },
}

/* Pricing modelo Axel (decidido 2026-07-21): plan 99€/mes, 2 usuarios, +29€,
   permanencia 3 meses, Programa Fundadores = web premium con plan anual (20 plazas).
   Revisión legal de estos términos en paralelo — v1.1. */

export default function TerminosPage() {
  return (
    <>
      <h1>Términos del servicio</h1>
      <p className="legal-meta">Versión 1.1 · Última actualización: 21 de julio de 2026</p>

      <h2>1. Objeto</h2>
      <p>
        Estos términos regulan la contratación y el uso de VELIA, la plataforma de software
        en la nube para despachos profesionales operada por <strong>VELIA Marketing SL</strong>{' '}
        («VELIA»). Al crear una cuenta o contratar el servicio aceptas estos términos y la{' '}
        <Link href="/privacidad">Política de privacidad</Link>.
      </p>

      <h2>2. Prueba gratuita</h2>
      <p>
        VELIA ofrece un periodo de prueba de 15 días sin coste y sin tarjeta. Durante la
        prueba el servicio puede aplicar límites razonables de uso. Al finalizar, la cuenta
        no se cobra automáticamente: si no contratas un plan, simplemente queda inactiva y
        puedes solicitar la eliminación de sus datos.
      </p>

      <h2>3. Planes y precios</h2>
      <ul>
        <li>
          <strong>VELIA Despacho:</strong> 99€/mes por despacho con dos usuarios incluidos, y
          29€/mes por usuario adicional. Pago anual: dos meses gratis (990€/año, equivalente a
          82,50€/mes).
        </li>
        <li>
          <strong>Programa Fundadores:</strong> mismo precio para los primeros veinte despachos
          que contraten en modalidad anual, con el precio de lanzamiento congelado y la web
          premium de lanzamiento incluida (según el alcance descrito en la web), mientras la
          suscripción se mantenga activa.
        </li>
        <li>
          <strong>Bufetes grandes:</strong> sin tarifa de catálogo — onboarding y estudio de
          integración a medida, con presupuesto específico.
        </li>
      </ul>
      <p>
        Los precios se muestran sin IVA. La web del despacho, cuando esté incluida (Programa
        Fundadores anual) o contratada como añadido, se diseña a medida y permanece disponible
        mientras la suscripción esté activa, sin coste de mantenimiento aparte.
      </p>

      <h2>4. Duración y baja</h2>
      <p>
        El pago mensual tiene un compromiso inicial de 3 meses — el tiempo real que tarda un
        despacho en completar la puesta en marcha y adoptar la plataforma — y después se
        renueva mes a mes, con 30 días de preaviso para la baja. El plan anual da acceso durante
        12 meses con renovación anual. Puedes comunicar la baja a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>5. Los datos de tu despacho</h2>
      <p>
        Los datos que tu despacho gestiona en VELIA (clientes, expedientes, documentos,
        agenda) son titularidad de tu despacho. VELIA actúa como encargado del tratamiento
        (art. 28 RGPD) conforme al acuerdo de encargo (DPA) disponible bajo solicitud. Los
        datos se alojan en infraestructura de la Unión Europea con aislamiento por despacho.
        A la finalización del servicio puedes solicitar la exportación completa de
        expedientes, contactos y documentos.
      </p>

      <h2>6. Uso de la inteligencia artificial</h2>
      <p>
        Las funciones de IA de VELIA (redacción de borradores, informes, consultas con
        fuentes oficiales) son herramientas de apoyo al profesional: generan borradores y
        propuestas citando su fuente, pero <strong>no constituyen asesoramiento jurídico de
        VELIA</strong>. La revisión, validación y firma de cualquier escrito o decisión
        profesional corresponde siempre al abogado. Los datos enviados a la API de IA no se
        utilizan para entrenar modelos, por política contractual del proveedor.
      </p>

      <h2>7. Uso aceptable</h2>
      <p>
        Te comprometes a usar el servicio conforme a la ley y a la deontología profesional, a
        custodiar tus credenciales de acceso y a no intentar acceder a datos de otros
        despachos, vulnerar la seguridad de la plataforma o revender el servicio sin acuerdo
        con VELIA.
      </p>

      <h2>8. Disponibilidad y soporte</h2>
      <p>
        VELIA se presta como servicio en la nube con el objetivo de máxima disponibilidad. No
        obstante, pueden producirse interrupciones puntuales por mantenimiento o causas ajenas.
        El soporte se presta en horario laborable a través de los canales indicados en la
        plataforma y en <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>9. Propiedad intelectual</h2>
      <p>
        El software, la marca y los materiales de VELIA son titularidad de VELIA o de sus
        licenciantes. La contratación concede una licencia de uso no exclusiva e
        intransferible durante la vigencia de la suscripción. Los contenidos y datos que el
        despacho introduce en la plataforma siguen siendo suyos.
      </p>

      <h2>10. Responsabilidad</h2>
      <p>
        En la medida permitida por la ley, la responsabilidad total de VELIA por daños
        derivados del servicio se limita al importe pagado por el despacho en los doce meses
        anteriores al hecho que la origine. VELIA no responde de decisiones profesionales
        adoptadas sobre la base de borradores o informes generados por la herramienta sin la
        revisión del abogado.
      </p>

      <h2>11. Modificaciones</h2>
      <p>
        VELIA puede actualizar estos términos y sus precios. Los cambios sustanciales se
        comunicarán con antelación razonable por email o dentro de la plataforma; el precio
        del Programa Fundadores permanece congelado conforme a su compromiso.
      </p>

      <h2>12. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por la legislación española. Las partes se someten a los
        juzgados y tribunales españoles que correspondan conforme a la normativa aplicable.
      </p>
    </>
  )
}
