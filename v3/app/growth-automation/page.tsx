import PaginaCapacidad from '@/components/PaginaCapacidad'
import { metadatosDePagina } from '@/lib/metadatos'
import { capacidadPorSlug } from '@/lib/capacidades'

/* Página fina a propósito: los datos viven en `lib/capacidades.ts` y la
   composición en `components/PaginaCapacidad.tsx`. Aquí sólo la ruta y sus
   metadatos, que es lo único que de verdad es propio de este fichero. */
const C = capacidadPorSlug('growth-automation')!

export const metadata = metadatosDePagina({
  titulo: C.titular,
  descripcion: C.descripcion,
  ruta: '/growth-automation',
})

export default function Pagina() {
  return <PaginaCapacidad slug="growth-automation" />
}
