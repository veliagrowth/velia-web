import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CookieNotice from '@/components/CookieNotice'
import ClarityScript from '@/components/ClarityScript'
import ScrollDepthTracker from '@/components/ScrollDepthTracker'
import { SITE_URL, CONTACT_EMAIL } from '@/lib/constants'
import './globals.css'

/* La descripción ya no menciona Verifactu ni el cómputo de plazos según la LEC:
   los dos están en `verified-claims` como `pending` y no se publican hasta tener
   la verificación documental. Un metadato es tan público como un titular. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /* REWORK 2026. Decia «VELIA Legal | Software juridico con IA para despachos»,
     y con eso lo primero que veia cualquiera —en Google, en una pestana o al
     compartir un enlace— era el nombre de un producto descontinuado.

     La descripcion nombra lo que VELIA hace, no lo que vende: no hay producto
     que describir. Y no promete posicion en ningun buscador ni aparicion en
     ningun sistema de IA: es una regla de producto (§8.2 de la direccion), no
     una cautela de redaccion. */
  title: 'VELIA | Infraestructura digital para la nueva era',
  description:
    'VELIA es una compañía de transformación y operación digital. Diseñamos, construimos, integramos, automatizamos y operamos la infraestructura digital de empresas y profesionales para la era de la IA, la automatización y los agentes.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'VELIA | Infraestructura digital para la nueva era',
    description:
      'Construimos y operamos la infraestructura digital con la que una empresa compite en la nueva era. No entregamos un proyecto y desaparecemos.',
    url: SITE_URL,
    siteName: 'VELIA',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELIA | Infraestructura digital para la nueva era',
    description:
      'Compañía de transformación y operación digital para la era de la IA, la automatización y los agentes.',
  },
}

/* JSON-LD de marca. Antes describia «plataforma de software con IA para
   despachos profesionales» y nombraba VELIA Legal como su primer vertical: una
   maquina leia el posicionamiento anterior mientras la pagina ya contaba otro.
   La entidad tiene que decir lo mismo en los cuatro sitios donde se declara —
   title, description, JSON-LD y llms.txt— o no hay entidad, hay ruido. */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VELIA',
  legalName: 'VELIA Marketing SL',
  url: SITE_URL,
  logo: `${SITE_URL}/velia_logotipo.svg`,
  email: CONTACT_EMAIL,
  description:
    'Compañía de transformación y operación digital. VELIA diseña, construye, integra, automatiza y opera la infraestructura digital de empresas y profesionales para la era de la IA, la automatización y los agentes.',
  knowsAbout: [
    'Infraestructura digital',
    'Automatización de procesos',
    'Integración de sistemas',
    'Visibilidad en buscadores y sistemas de IA',
    'Operación de sistemas digitales',
  ],
  areaServed: 'ES',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* ── DECISIÓN DEL UMBRAL, ANTES DEL PRIMER PINTADO ──────────────────
            Va aquí, en línea y síncrono, y no en un efecto de React: un efecto
            corre DESPUÉS de hidratar, así que en una conexión lenta el visitante
            vería la Home un instante y luego le caería un overlay blanco encima.
            Un destello de contenido seguido de una pantalla en blanco es peor
            que no tener umbral.

            Este script solo PONE el atributo. Quien retira el umbral es el CSS
            (`globals.css`, animación `umbral-ciclo`, que acaba en
            `visibility: hidden`). Si este script corre y el bundle de React no
            llega nunca, el umbral desaparece igual. Si JavaScript está apagado,
            esto no corre, el atributo no se pone y el umbral nunca se ve: la
            Home está entera en el HTML y se lee sin nada de esto.

            Ninguna ruta de fallo puede acabar en una pantalla blanca.

            Los cuatro oyentes van aquí y no en un componente por el mismo
            motivo: poder saltar el umbral no puede depender de que React haya
            hidratado, porque justo mientras el umbral se ve es cuando todavía
            no lo ha hecho. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){" +
              // Marca que hay JavaScript ANTES del primer pintado. De esto
              // depende que `.reveal` pueda esconderse: sin esta marca el
              // contenido se queda visible, que es el estado seguro.
              "document.documentElement.setAttribute('data-js','1');" +
              "try{" +
              "if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;" +
              "var k='velia:umbral',r=document.documentElement;" +
              // sessionStorage puede LANZAR (ventana privada, cookies de sitio
              // bloqueadas, captura de miniaturas). Si no se puede leer, no se
              // enseña: un umbral repetido molesta más que su ausencia.
              "try{if(sessionStorage.getItem(k)==='1')return;sessionStorage.setItem(k,'1')}catch(e){return}" +
              "r.setAttribute('data-umbral','1');" +
              "var f=function(){r.setAttribute('data-umbral','saltado');q();setTimeout(function(){r.removeAttribute('data-umbral')},300)};" +
              "var q=function(){removeEventListener('keydown',f);removeEventListener('pointerdown',f);removeEventListener('wheel',f);removeEventListener('touchstart',f)};" +
              "addEventListener('keydown',f,{once:true});addEventListener('pointerdown',f,{once:true});" +
              "addEventListener('wheel',f,{once:true,passive:true});addEventListener('touchstart',f,{once:true,passive:true});" +
              "setTimeout(function(){if(r.getAttribute('data-umbral')==='1'){r.removeAttribute('data-umbral');q()}},1100)" +
              "}catch(e){}})()",
          }}
        />
        {/* Calienta la conexión al portal de la demo ANTES de que el iframe se
            monte (bug "la demo carga lenta"): ahorra DNS + TLS + handshake del
            túnel Cloudflare en el momento del scroll. */}
        {/* Geist sustituye a Montserrat con el sistema 2.0 (30-jul). Va como <link> y
            no por next/font porque Next 14.2.30 no la tiene en su catálogo tipado.
            PENDIENTE: autoalojar el .woff2 (Geist es SIL OFL) — anotado en brand/README.md. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Las DOS familias en UNA sola petición. Instrument Serif se añadió con
            el upgrade del 1-ago para las frases de marca; pedirla en un segundo
            <link> habría metido otro viaje completo en la cadena crítica del LCP
            para una fuente que aparece en cinco frases de toda la web. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap"
        />
        <link rel="preconnect" href="https://demo.app.veliacorp.com" />
        <link rel="dns-prefetch" href="https://demo.app.veliacorp.com" />
        <link rel="preconnect" href="https://app.veliacorp.com" />
      </head>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieNotice />
        <ScrollDepthTracker />
        {/* Mapas de calor y grabaciones. Montado pero INERTE: sin
            NEXT_PUBLIC_CLARITY_PROJECT_ID y sin un consentimiento real no
            inyecta absolutamente nada. Ver el porqué en el propio componente. */}
        <ClarityScript />
      </body>
    </html>
  )
}
