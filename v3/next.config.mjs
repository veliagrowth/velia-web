/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
