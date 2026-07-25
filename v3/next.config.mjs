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
