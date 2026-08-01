# Auditoría previa al upgrade — «Quiet Intelligence in Motion»

**Fecha**: 1-ago-2026 · **Alcance**: veliacorp.com (repo `velia-web`, subcarpeta `v3`)
**Encargo**: Joaquín + Axel — dirección de diseño consolidada en persona.

Este documento es el paso 1 del orden de implementación (§32 del encargo): *antes*
de tocar nada, dejar por escrito qué hay, qué falla, qué se reutiliza y qué se
sustituye. Se escribe una vez y no se vuelve a re-derivar.

---

## 1. Estado actual

| Capa | Qué hay |
|---|---|
| Framework | Next.js **14.2.30**, App Router, React 18. **Sin** librería de motion, **sin** dependencias de UI. Tres dependencias en total. |
| Routing | `app/` con grupo `(legales)`. 14 rutas públicas + `sitemap.ts` + `robots.ts` + `/api/hero-video`. |
| Estilos | Tailwind 3.4 con tokens **ya migrados** a Obsidian Iris Soft (30-jul). |
| Tipografía | **Geist** por `<link>` a Google Fonts. Escala de pesos declarada en `tailwind.config.ts`. **No hay Instrument Serif.** |
| Componentes | 15, todos propios. `TrialButton`, `TrackedLink`, `DemoEmbed`, `ProductShot`, `VeliaBrain`, `Nav`, `Footer`. |
| Design tokens | Colores en `tailwind.config.ts`; una curva de easing (`--ease-out` equivalente) y animaciones en `globals.css`. |
| Analítica | `lib/analytics.ts` → `/api/public/web-analytics` del portal (tabla `velia_web_events`). `sendBeacon`, sesión **en memoria**, sin cookies. |
| Consentimiento | `CookieNotice` — hoy la web **no necesita banner** (analítica cookieless). |
| SEO | `metadata` por página, canonicals, JSON-LD `Organization` + `SoftwareApplication` con `Offer`. |
| Feature flags | `lib/feature-flags.ts`, 12 flags. Bien usado. |
| Claims | `lib/verified-claims.ts` — sistema de afirmaciones verificadas ya existente. |
| Demo | `DemoEmbed` con iframe a `demo.app.veliacorp.com` + `preconnect` en el `<head>`. |

**Lo que está bien y NO se toca**: la arquitectura de datos. `lib/pricing.ts`,
`lib/cta.ts`, `lib/verified-claims.ts`, `lib/feature-flags.ts` y `lib/analytics.ts`
son SSoT reales, con el porqué documentado. El encargo pide exactamente lo que
estos ficheros ya hacen (§16 claims verificados, §28 eventos, §31 flags). Se
**amplían**, no se sustituyen.

---

## 2. Problemas

### 2.1 El diagnóstico central: la página es una lista, no un relato

Las diez secciones de la home tienen **la misma forma**: `<section>` con
`mx-auto max-w-6xl px-6 py-20 md:py-28`, un `<h2>`, un párrafo y una rejilla.
Cambia el texto; no cambia el ritmo. Es el criterio de rechazo nº1 del encargo
(«la home sigue siendo una sucesión de bloques idénticos»).

Consecuencia medible: **7 de 10 secciones son claras**, tres de ellas seguidas
(demo → operativa → seguridad). No hay contraste que marque el cambio narrativo.

### 2.2 El Cerebro VELIA se explica escribiendo que existe

La sección 4 es la idea diferenciadora del producto y hoy es **una lista `<ol>`
de tres frases** dentro de una tarjeta estática. El encargo lo señala como
criterio de rechazo explícito («el Cerebro VELIA solo se explica mediante texto»).

### 2.3 El hero no es un momento de marca

- Fondo claro, igual que las cinco secciones siguientes.
- El visual es una **captura estática** (`expedientes.webp`).
- El comentario del código reconoce el problema: la captura ideal —la puesta al
  día del Cerebro— muestra el tenant de demo *vacío* («sin vencimientos, nada
  pendiente»), así que se optó por la lista de expedientes.
- El vídeo de archivo está detrás de un flag en `false` y la razón documentada es
  correcta: el hero debe enseñar producto, no *stock footage*.

**No hay nada que demuestre en el hero qué hace la IA.** Es el criterio de
rechazo «el usuario no entiende qué hace la IA».

### 2.4 Tipografía: labels con tracking prohibido

`tracking-[0.28em]` aparece en **6 sitios** de la home y en más páginas. El
encargo fija el máximo en **0.06em** (§4) y la regla de marca del repo dice lo
mismo («PROHIBIDO tracking de +0.28em en labels»). Es residuo del sistema 1.0
que la pasada de rebrand no alcanzó.

### 2.5 Pesos: `font-800` como lenguaje dominante

H1 y varios H2 usan `font-800`. El encargo pide **Medium o Semibold** en
titulares y prohíbe ExtraBold como lenguaje dominante (§4).

### 2.6 Pricing sin selector

Hay un solo precio (99 €/mes) y una línea que dice «en anual, 2 meses gratis».
El encargo pide **selector mensual/anual con anual por defecto** (§17). Los dos
eventos de analítica (`pricing_monthly_select`, `pricing_annual_select`) **ya
están declarados en el tipo pero no los emite nadie**: el embudo tiene dos
columnas que nunca se rellenan.

### 2.7 Interacción: prácticamente ninguna

Fuera del menú móvil y el iframe de la demo, la home no tiene un solo elemento
con el que se pueda interactuar. Ni tabs, ni estados, ni exploración. El único
movimiento es la clase `.rise` de entrada y la respiración del SVG del cerebro.

### 2.8 Riesgo de rendimiento ya presente

La fuente entra por **`<link>` a `fonts.googleapis.com`**: dos `preconnect` + una
hoja de estilo de tercero en la cadena crítica del LCP. Está anotado como
pendiente en `brand/README.md` (autoalojar Geist, licencia SIL OFL lo permite).
Al añadir Instrument Serif el problema se duplica si se hace igual.

---

## 3. Oportunidades

1. **El producto ya es la mejor prueba.** Hay demo pública de solo lectura y
   capturas reales. La web puede *demostrar* en vez de *afirmar* sin material nuevo.
2. **Las seis fases de VELIA** (observa · comprende · relaciona · prepara ·
   confirma · decide el profesional) son una estructura narrativa lista para usar.
3. **SVG + CSS bastan.** `VeliaBrain` ya demuestra que se puede hacer un visual de
   marca sin WebGL ni dependencias. Todo lo interactivo del encargo (trazas, mapa
   de contexto, órbitas) es SVG y estado de React.
4. **La analítica ya tiene los nombres.** Añadir eventos es ampliar un tipo unión.

---

## 4. Componentes reutilizables (no se tocan)

`TrialButton` · `TrackedLink` · `SectionViewMarker` · `useSectionView` ·
`ProductShot` · `DemoEmbed` · `CookieNotice` · `ScrollDepthTracker` ·
`TestimonialVideo` · `HeroVideo` (queda tras su flag) · `Footer`.

Y las cinco librerías SSoT: `pricing` · `cta` · `constants` · `verified-claims` ·
`feature-flags` · `analytics`.

## 5. Componentes a sustituir o crear

| Nuevo | Sustituye a |
|---|---|
| `IrisNode` | — (núcleo visual del estado de la IA, reutilizado en 4 sitios) |
| `HeroContextStage` | el bloque estático `ProductShot` del hero |
| `TrustStrip` | sección 2 (rejilla de 4 columnas) |
| `ContextMap` | — (nueva: la sección que explica la diferencia) |
| `BrainStateTabs` | el `<ol>` estático de la sección 4 |
| `DayWithVelia` | sección 5 (lista de 4 módulos) |
| `ProductShowcase` | `ProductShot` suelto de la sección 5 |
| `CaseStudyToggle` | la cita suelta de la sección 6 |
| `SecurityArchitecture` | rejilla de 3 columnas de la sección 7 |
| `PricingSelector` | el precio fijo de la sección 8 |

`Nav` se **modifica** (transparente sobre hero oscuro → sólido al hacer scroll).

---

## 6. Plan de ejecución

Orden del §32, sin empezar por las animaciones:

1. Tokens (colores de gradiente/glow, motion, Instrument Serif) — `globals.css` + `tailwind.config.ts`
2. Copy y ritmo (oscuro/claro alternando por cambio narrativo, no mecánicamente)
3. Header
4. Hero **estático** → luego interactivo
5. Trust strip → Context Map → Cerebro → Jornada → Producto → Caso → Seguridad → Pricing → Fundadores → CTA final
6. Responsive → accesibilidad → motion → rendimiento → SEO → analítica
7. Build y verificación

**Lo que NO se toca** (§2 del encargo): prueba gratuita, demo interactiva, login,
pricing como dato, páginas legales, analítica, URLs indexadas, parámetros UTM.

---

## 7. Lo que esta auditoría NO cubre

Honestidad sobre el alcance: **no se ha corrido Lighthouse contra producción en
esta pasada**, así que las cifras de LCP/CLS/INP del §27 son objetivos, no una
medición de partida. Lo que sí está medido es la estructura del código (recuento
de secciones, de `tracking-[0.28em]`, de dependencias y de la cadena de fuentes).
La verificación de rendimiento se hace al final, contra el build.
