/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compresión APAGADA a propósito (no es un descuido).
  //
  // Bug "el vídeo del hero no se reproduce en iPhone" (25-jul): iOS Safari solo
  // reproduce vídeo si el servidor responde a las peticiones por rango
  // (`Range: bytes=…` → **206 Partial Content**). Con la compresión de Next
  // activada, la respuesta sale comprimida y en chunks: sin `Content-Length`,
  // sin `Accept-Ranges` y devolviendo 200 a un Range → iOS se planta y deja el
  // poster. En Vercel no pasaba porque los estáticos los servía su CDN; al
  // migrar a Coolify los sirve el propio Next y el fallo apareció.
  //
  // No perdemos compresión: el sitio va tras Cloudflare, que comprime HTML, CSS
  // y JS en el edge. Comprimir un MP4 no ahorra nada (ya está comprimido) y aquí
  // además rompía la reproducción.
  compress: false,
  // ETags DESACTIVADOS por el mismo motivo que la compresión: Next emite ETags
  // *débiles* (`W/"…"`) y con un validador débil ninguna caché intermedia puede
  // garantizar coherencia entre trozos, así que Cloudflare responde 200 con el
  // fichero entero a un `Range` en vez de 206 — y iOS sigue sin reproducir.
  // Sin ETag, el edge valida por Last-Modified y sí sirve rangos.
  generateEtags: false,
  // Rutas que viven en el PORTAL (app.veliacorp.com) pero que la gente teclea o
  // comparte sobre el dominio de la web. Sin esto daban 404 (caso /instalar,
  // reportado 22-jul). Temporales (307) para no quemar caché de navegador por si
  // alguna de ellas pasa a existir en la web.
  //
  // ── REVISADOS Y CLASIFICADOS EN LA FASE 0 (19-sep-2026), SIN CAMBIARLOS ───
  // La auditoría señaló que cinco de los siete —/login, /acceso, /registro,
  // /app y /portal— nunca existirán en la web pública, así que un 308 sería
  // técnicamente más correcto. Se ha decidido NO cambiarlos, y conviene dejar
  // escrito por qué:
  //
  //   · Un 308 lo cachea el navegador de forma PERMANENTE. Revertirlo no es
  //     editar una línea: es esperar a que caduquen cachés ajenas.
  //   · El beneficio es marginal. Son rutas sin enlaces entrantes: no hay
  //     señales que transferir, que es para lo que sirve la diferencia.
  //   · La decisión de que fueran temporales ya se tomó a conciencia y está
  //     escrita justo arriba. Deshacerla porque «308 es el código canónico»
  //     es cambiar una decisión razonada por una regla general.
  //
  // Clasificación, para que la próxima revisión no repita el análisis:
  //   TEMPORARY       /instalar · /prueba-velia — podrían existir aquí un día
  //   PERMANENT-ish   /login · /acceso · /registro · /app · /portal
  //                   conceptualmente permanentes; siguen en 307 por coste de
  //                   reversión, no por descuido.
  // NOINDEX FUERA DEL DOMINIO DE PRODUCCIÓN (13-sep-2026).
  //
  // Cualquier host que no sea `veliacorp.com` o `www.veliacorp.com` responde con
  // `X-Robots-Tag: noindex, nofollow`. Se decide por el HOST y no por una
  // variable de entorno, a propósito:
  //
  //   · Una variable «esto es una preview» se puede olvidar al crear la app, y el
  //     olvido no da error: la preview sale indexable. Y al revés, si alguien la
  //     pusiera en producción por error, la web pública desaparecería de Google
  //     también sin un solo aviso. Las dos direcciones fallan en silencio.
  //   · El host no se olvida. Producción es `veliacorp.com` por definición, y todo
  //     lo demás —una preview, un alias de pruebas, localhost— no debería
  //     competir con ella en un buscador.
  //
  // Arregla además algo que ya pasaba: `tunnel-test.veliacorp.com` es un alias
  // de la web de producción y servía el mismo contenido indexable. Contenido
  // duplicado bajo otro nombre, que es justo lo que un buscador penaliza.
  //
  // ⚠️ Esto NO es protección de acceso: una preview sigue siendo legible por
  // quien tenga la URL. Eso lo cierra Cloudflare Access, que ya protege
  // `coolify.veliacorp.com`. Esto sólo impide que la encuentren los buscadores si
  // un día Access falla o no se configura.
  async headers() {
    return [
      {
        source: '/:path*',
        missing: [
          { type: 'host', value: 'veliacorp.com' },
          { type: 'host', value: 'www.veliacorp.com' },
        ],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
  async redirects() {
    const app = 'https://app.veliacorp.com'
    return [
      { source: '/instalar', destination: `${app}/instalar`, permanent: false },
      { source: '/prueba-velia', destination: `${app}/prueba-velia`, permanent: false },
      { source: '/login', destination: `${app}/login`, permanent: false },
      { source: '/acceso', destination: `${app}/login`, permanent: false },
      { source: '/registro', destination: `${app}/registro`, permanent: false },
      { source: '/app', destination: app, permanent: false },
      { source: '/portal', destination: app, permanent: false },
    ]
  },
}

export default nextConfig
