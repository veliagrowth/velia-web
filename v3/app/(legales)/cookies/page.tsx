import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/constants'
import ConsentLink from '@/components/ConsentLink'

export const metadata: Metadata = {
  title: 'Política de cookies — VELIA',
  description:
    'Qué cookies usa veliacorp.com, para qué, cuánto duran y cómo cambiar tu decisión en cualquier momento.',
  alternates: { canonical: 'https://veliacorp.com/cookies' },
}

/**
 * Reescrita el 10-ago-2026 por dos motivos, y los dos importan:
 *
 * 1. Entra Microsoft Clarity (mapas de calor y grabación de sesión), que SÍ pone
 *    cookies y sí exige consentimiento previo. La versión anterior decía que no
 *    había nada que aceptar — cierto entonces, falso a partir de ahora.
 * 2. La versión anterior nombraba «Vercel Analytics» como proveedor de
 *    analítica. VELIA salió de Vercel el 22 de julio. Una política que nombra a
 *    un proveedor que ya no trata tus datos es tan incorrecta como una que se
 *    calla uno que sí.
 */
export default function CookiesPage() {
  return (
    <>
      <h1>Política de cookies</h1>
      <p className="legal-meta">Versión 2.0 · Última actualización: 10 de agosto de 2026</p>

      <h2>1. Lo esencial, primero</h2>
      <p>
        Esta web <strong>no utiliza cookies de publicidad ni de perfilado, y no comparte tus
        datos con anunciantes</strong>. Sí usamos, <strong>solo si tú lo autorizas</strong>, una
        herramienta que ayuda a entender cómo se usa la web para poder mejorarla. Puedes
        decir que no —y cambiar de idea después— sin perder ninguna funcionalidad.
      </p>

      <h2>2. Lo que funciona sin pedirte permiso</h2>
      <p>
        Dos cosas, ambas exentas de consentimiento por ser técnicamente necesarias o
        anónimas:
      </p>
      <ul>
        <li>
          <strong>Tu decisión sobre esta misma política.</strong> Se guarda en el
          almacenamiento local de tu navegador (<code>velia-consent-v2</code>) para no volver
          a preguntarte en cada página. No se envía a ningún sitio.
        </li>
        <li>
          <strong>Analítica sin cookies.</strong> Medimos las páginas vistas en el borde de
          la red (Cloudflare Web Analytics) y registramos eventos de uso agregados —qué
          botón se pulsa, hasta dónde se lee— en nuestros propios servidores. No se guarda
          nada en tu dispositivo, no hay identificador que sobreviva al cierre de la pestaña
          y no se puede saber quién eres ni seguirte por otras webs.
        </li>
      </ul>

      <h2>3. Lo que solo se activa si dices que sí</h2>
      <p>
        <strong>Microsoft Clarity</strong> nos permite ver mapas de calor y reproducciones
        anónimas de la navegación para detectar dónde la web confunde o falla. Si lo
        autorizas, Microsoft instala estas cookies:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Para qué</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>_clck</code></td>
              <td>Mantiene un identificador de navegador para agrupar las sesiones</td>
              <td>1 año</td>
            </tr>
            <tr>
              <td><code>_clsk</code></td>
              <td>Une las páginas de una misma visita en una sola grabación</td>
              <td>1 día</td>
            </tr>
            <tr>
              <td><code>CLID</code>, <code>ANONCHK</code>, <code>MR</code>, <code>MUID</code>, <code>SM</code></td>
              <td>Identificadores técnicos propios de Microsoft</td>
              <td>De la sesión a 1 año</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Qué NO se graba:</strong> tenemos desactivado el envío del contenido de la
        página, así que Clarity recibe la geometría de la interacción —dónde se hace clic,
        hasta dónde se baja— y no el texto que escribes. Los campos de formulario van
        enmascarados.
      </p>
      <p>
        <strong>Responsable y transferencia:</strong> el tratamiento lo realiza Microsoft
        Corporation, que puede tratar los datos fuera del Espacio Económico Europeo. La base
        jurídica es tu consentimiento (art. 6.1.a RGPD) y puedes retirarlo cuando quieras.
        Más detalle en la{' '}
        <a href="https://privacy.microsoft.com/es-es/privacystatement" target="_blank" rel="noreferrer">
          declaración de privacidad de Microsoft
        </a>.
      </p>

      <h2>4. Cambiar de idea</h2>
      <p>
        Puedes revisar o retirar tu consentimiento cuando quieras desde aquí:{' '}
        <ConsentLink />. Al retirarlo dejamos de cargar la herramienta{' '}
        <strong>y borramos las cookies que hubiera dejado</strong>, porque dejar de cargarla
        no basta para que desaparezcan.
      </p>

      <h2>5. La aplicación (app.veliacorp.com)</h2>
      <p>
        Si inicias sesión en la aplicación de VELIA, esta utiliza las cookies técnicas
        estrictamente necesarias para mantener tu sesión abierta de forma segura. Son
        imprescindibles para el funcionamiento del servicio, no se usan con fines
        publicitarios y por su naturaleza técnica están exentas de consentimiento. La
        herramienta de mapas de calor <strong>no se usa dentro de la aplicación</strong>.
      </p>

      <h2>6. Cambios y contacto</h2>
      <p>
        Si incorporamos alguna tecnología nueva que requiera consentimiento, esta política se
        actualizará y te lo pediremos de forma expresa antes de activarla. Para cualquier
        duda: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Más información sobre
        el tratamiento de datos en la <Link href="/privacidad">Política de privacidad</Link>.
      </p>
    </>
  )
}
