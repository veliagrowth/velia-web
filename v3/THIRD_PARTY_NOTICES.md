# Avisos de terceros — velia-web

Código de terceros adaptado en esta web, con su procedencia exacta y su licencia.
Lo que no figura aquí es código original de VELIA.

---

## ObsidianUI

- **Origen:** https://gitlab.com/Atharvsinh-codez/ObsidianUI
- **Commit estudiado:** `21d9198d14fd663f809cbea9fe124efc9576c003` (21-sep-2026)
- **Licencia:** MIT — `LICENSE` en la raíz de ese repositorio, verificada leyendo el
  fichero el 22-sep-2026 (no se dio por buena la declaración de terceros).
- **Dependencias NO incorporadas:** ObsidianUI usa `gsap` (con `ScrollTrigger`,
  `SplitText` y `CustomEase`), `clsx` y `tailwind-merge`. Ninguna entra en velia-web:
  las tres técnicas se implementaron con CSS y, en un solo caso, ~40 líneas de
  JavaScript propio. Tampoco se ha copiado ningún recurso gráfico, fuente ni imagen.

### Qué se tomó de cada componente

| Componente de ObsidianUI | Fichero de origen | Relación con el código de VELIA |
|---|---|---|
| **Arrow Fill Button** | `src/components/block/arrow-fill-button.{jsx,css}` | **Adaptación directa.** La técnica —una capa duplicada de la etiqueta recortada con `clip-path` a un círculo que se abre a píldora—, los valores del recorte y el trazado SVG de la flecha proceden de ahí. Cambiados: colores, tipografía, tamaños, el `hover` detrás de `@media (hover: hover)` y la respuesta táctil por `:active`. → `components/CtaFlecha.tsx` · `app/globals.css` bloque 3 |
| **Rectangular Text Reveal** | `src/components/block/rectangular-text-reveal.jsx` | **Reimplementación de la técnica.** Se toman la idea (barra que cubre la línea y se retira hacia el lado opuesto), la curva `cubic-bezier(0.4, 0, 0.2, 1)` y el orden de magnitud de sus tiempos. No se reutiliza su código: allí es GSAP + SplitText y oculta el texto con `opacity: 0`; aquí es un componente de servidor con CSS, y en el hero el texto nunca se oculta. → `components/motion/RevealRect.tsx` · bloque 1 |
| **Text Fill Animation** | `src/components/block/text-fill-animation.{jsx,css}` | **Reimplementación del gesto.** Se toma la idea (el texto pasa de tenue a pleno con el scroll atravesando un color de acento). No se reutiliza su código: allí la sección se fija a `250vh`, se parte en caracteres con SplitText y el tono tenue no cumple contraste; aquí se llena al pasar, por palabras, sin fijar nada y con un tenue que cumple AA. → `components/motion/TextFill.tsx` · bloque 2 |
| Project One (plantilla) | `src/app/project-one` | **Sólo referencia visual.** Un único principio compositivo —el bloque oscuro encastrado en la página clara en lugar de a sangre—. Ni código, ni maquetación, ni recursos. |

### Licencia MIT de ObsidianUI (texto íntegro)

```
MIT License

Copyright (c) 2026 ObsidianUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

El CSS adaptado del Arrow Fill Button lleva además un comentario `/*! … */` con el
copyright y la licencia, que la minificación conserva: el aviso viaja también en el
fichero servido, no sólo en el repositorio.
