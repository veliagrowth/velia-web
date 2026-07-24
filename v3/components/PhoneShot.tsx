import Image from 'next/image'

/**
 * Captura REAL del producto en móvil, dentro de un marco de teléfono sobrio.
 * Las capturas viven en /public/screenshots (tenant demo ficticio "Bufete
 * Nelson & Murdock" — jamás datos de clientes reales). Sustituye a los mocks
 * de chat dibujados a mano, que no se parecían a la app real (feedback
 * Joaquín 2026-07-24). Refresco: al cambiar la UI del portal.
 *
 * Marco flat (sin sombra en reposo, sin border coloreado) según las design
 * skills VELIA. La captura es un iPhone 1170x2532 → ratio 9/19.5.
 */
export default function PhoneShot({
  src,
  alt,
  width = 260,
}: {
  src: string
  alt: string
  width?: number
}) {
  return (
    <div
      className="relative mx-auto rounded-[2.4rem] border border-void/15 bg-deep p-2 shadow-[0_20px_60px_-30px_rgba(10,10,15,0.5)]"
      style={{ width }}
    >
      {/* Sin notch dibujado: la captura ya incluye la barra superior real de la app. */}
      <div className="overflow-hidden rounded-[1.9rem]">
        <Image
          src={src}
          alt={alt}
          width={780}
          height={1688}
          sizes="(max-width: 768px) 60vw, 280px"
          quality={88}
          className="w-full h-auto"
        />
      </div>
    </div>
  )
}
