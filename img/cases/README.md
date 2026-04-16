# Assets casos VELIA

## Estructura de carpetas

```
img/cases/
  krea-hogar/
    01-identidad-marca.webp     ← Logo, paleta de color, identidad visual
    02-presencia-digital.webp   ← Capturas Instagram / Google My Business
    03-expansion.webp           ← Mapa tiendas / estrategia expansión
    [videos: .mp4 o .webm]

  consul-juridico/
    01-web-anterior.webp        ← Captura web WordPress antigua
    02-nueva-web.webp           ← Captura nueva web consuljuridico.com
    03-captacion-leads.webp     ← Captura GHL pipeline / leads dashboard
    04-dashboard.webp           ← Dashboard métricas / resultados

  the-drop-agency/
    01-gestion-manual.webp      ← Excel / caos gestión anterior
    02-pipeline-automatizado.webp ← Captura pipeline automatizado
    03-crecimiento-cartera.webp ← Gráfico crecimiento artistas
```

## Instrucciones

1. Subir imágenes/vídeos en formato `.webp` (imágenes) o `.mp4`/`.webm` (vídeos)
2. Resolución recomendada: 1280×720 (16:9 para el carrusel)
3. Peso máximo: 300KB por imagen (usar Squoosh.app para comprimir)
4. Nombrar exactamente como está en la lista de arriba para que el HTML los reconozca automáticamente
5. Para vídeos: añadir `<video>` tag manualmente en el HTML del carrusel correspondiente

## Para añadir a Vercel

Commit + push a main → Vercel despliega automáticamente.
