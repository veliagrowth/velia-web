# Auditoría previa — optimización de veliacorp.com

**Fecha:** 2026-07-29 · **Repo:** `velia-web/v3` · **Documento interno, no se publica.**

> ⚠️ **Este repo despliega a producción al hacer push a `main`** (Coolify). Nada de lo que
> hay aquí llega a los usuarios hasta que alguien lo empuje deliberadamente.

---

## 1. Estado actual

| | |
|---|---|
| Framework | Next.js 14.2.30, App Router, React 18, TypeScript |
| Estilos | Tailwind 3.4 + `globals.css`. Tokens de la identidad **anterior** (void/cream/gold) |
| Tipografía | Montserrat vía `next/font/google` |
| Rutas | 13 públicas + 5 legales. `/legal` es la página de producto |
| Estado central | `lib/pricing.ts`, `lib/feature-flags.ts`, `lib/constants.ts`, `lib/analytics.ts` |
| Analítica | Propia, a `app.veliacorp.com/api/public/web-analytics`. Sin cookies |
| Formularios | `ContactForm.tsx` existe pero **está sin usar** (`/contacto` no lo monta) |
| Dependencias | 3 en producción (next, react, react-dom). Sin librerías de animación |

**Lo que ya está bien y se conserva:** el SSoT de precios con ahorro calculado, los feature
flags, la analítica sin cookies y sin datos personales, la demo embebida con `preconnect`,
el `HeroVideo` con `/api/hero-video` (resuelve el 206 de iOS), `TrackedLink`,
`SectionViewMarker`, el JSON-LD de Organization y SoftwareApplication, el sitemap y las
páginas legales.

---

## 2. Problemas encontrados

### 2.1 Fragmentación de las llamadas a la acción — el más grave

**17 CTA distintos.** El peor no es el número: es que **el CTA principal de la página de
precios no lleva a la prueba gratuita.**

| CTA | Dónde | A dónde va |
|---|---|---|
| «Solicitar una demo» | `PricingPlans` (**botón principal del plan**), Footer, /sobre-velia | `/contacto` |
| «Solicitar acceso» | `PricingPlans` (Programa Fundadores) | `/contacto` |
| «Prueba VELIA gratis» | home, /contacto | flujo real |
| «Prueba gratis — 15 días» | Nav, /demo | flujo real |
| «Pruébalo gratis 15 días →» | Nav (mega-menú) | flujo real |
| «Ver VELIA en acción» | home hero | `/demo` |
| «Ver qué incluye» | home pricing | `/precios` |
| «Hablar con el equipo →» | `PricingPlans` | `/contacto` |
| «Instalar la app» | home, Footer | `app/instalar` |
| + 8 variantes más | | |

Quien llega a `/precios` decidido a probar VELIA se encuentra un botón que le pide una demo.

### 2.2 Header sobrecargado

8 elementos: Producto (mega-menú) · Demo · Precios · Seguridad · Novedades · Contacto ·
Iniciar sesión · CTA. Hay un comentario en `Nav.tsx:99` explicando que se bajó el `gap`
porque **no cabían** y el bloque se montaba sobre el logotipo. Eso es la señal.

### 2.3 Hero

- H1 «Todo tu despacho. **Un solo software.**» → el encargo pide «Con VELIA dentro».
- «Del abogado independiente al gran bufete» → el encargo lo elimina explícitamente.
- **El visual es un vídeo de archivo de abogados trabajando**, no el producto. Ver §5.

### 2.4 El caso piloto vende marketing, no software

Las cuatro métricas son de captación: `+260% consultas captadas al mes`, `<5 min en responder
cada consulta`, `12 h recuperadas cada semana`, `<60 días hasta los primeros resultados`. El
titular es «Sin sistema y sin presencia digital. 60 días después:».

Es exactamente el residuo del modelo de agencia que el encargo manda eliminar. Un abogado que
lee esto entiende que VELIA le va a traer clientes, no que le va a ordenar el despacho.

### 2.5 Secciones que compiten entre sí

La home tiene 9 secciones y tres explican lo mismo con palabras distintas: el strip de
confianza (5 tarjetas), la comparación CRM (2 columnas × 5 puntos) y el bloque de seguridad
(3 tarjetas). La app móvil ocupa una sección entera al mismo nivel que el Cerebro VELIA.

### 2.6 Formato de precio

`eur()` produce `99€` y `82,50€`. El encargo pide `99 €` y `82,50 €`, con espacio. Es la
convención tipográfica correcta en español y la que aplica `Intl.NumberFormat('es-ES')`.

### 2.7 Claims sin registro de verificación

No existe `verifiedClaims.ts`. Publicados hoy sin trazabilidad:

| Claim | Dónde | Estado real |
|---|---|---|
| «Facturación Verifactu» | home strip, Nav, /precios | ⚠️ Sin verificación documental |
| «Alojado en la Unión Europea» | home strip, Footer | ⚠️ Comprobable, sin fuente registrada |
| «Tus datos no entrenan ninguna IA» | home strip ×2 | ⚠️ Depende de condiciones contractuales |
| «Plazos según la LEC» | Nav, /legal | ⚠️ Alcance sin acotar |
| «+260% consultas captadas» | home | ⚠️ Fuente citada: "velia-chat". No auditable |

### 2.8 Footer

- «La plataforma sobre la que los despachos españoles operan el **100 %** de su software» —
  el encargo lo prohíbe expresamente.
- «© 2026 **VELIA Marketing SL**» — «Marketing» como palabra dominante, justo lo que hay que
  dejar atrás.
- «Solicitar una demo» como enlace de contacto.

### 2.9 Analítica

Los 23 eventos actuales no coinciden con los 24 que pide el encargo. Faltan
`demo_fullscreen_open`, `product_section_view`, `case_study_view`, `security_click`,
`enterprise_contact_click`, `founders_terms_click`, `trial_start`. Y no se propagan las UTM
hacia la aplicación.

---

## 3. Qué se conserva, qué se simplifica, qué se elimina

### Se conserva sin tocar
`lib/analytics.ts` (mecánica), `lib/pricing.ts` (estructura), `HeroVideo`, `DemoEmbed`,
`TrackedLink`, `SectionViewMarker`, `CookieNotice`, `ScrollDepthTracker`, `useSectionView`,
las 5 páginas legales, `robots.ts`, `app/api/hero-video`, `/novedades` y `/seguridad` (solo
retoques de lenguaje).

### Se simplifica
| Componente | Cambio |
|---|---|
| `Nav.tsx` | 8 elementos → 4 links + 2 acciones. Fuera Novedades y Contacto |
| `Footer.tsx` | Claim final, entidad legal, «Solicitar una demo» |
| `PricingPlans.tsx` | CTA a la prueba real. 11 funciones → 8 + enlace |
| `app/page.tsx` | 9 secciones → 9 pero distintas: fuera comparación y móvil, dentro operativa |
| `app/contacto/page.tsx` | Título visual → «Empieza con VELIA» |
| `lib/pricing.ts` | `eur()` con espacio + campos que faltaban |

### Se elimina de la home
- Sección completa de comparación CRM → una frase en el Cerebro VELIA.
- Sección completa de app móvil → capacidad en `/legal`, tras flag `false`.
- Las 4 métricas de captación del caso piloto.
- La quinta tarjeta del strip de confianza.

### Se crea
`lib/cta.ts` · `lib/verified-claims.ts` · `lib/navigation.ts` · `app/fundadores/page.tsx`
(condiciones) · sección de operativa centralizada en la home.

---

## 4. Cambios de copy principales

| Dónde | Antes | Después |
|---|---|---|
| H1 home | Todo tu despacho. Un solo software. | Todo tu despacho. Con VELIA dentro. |
| Sub home | …Del abogado independiente al gran bufete. | …VELIA trabaja con el contexto de cada asunto… |
| H2 caso | Sin sistema y sin presencia digital. 60 días después: | VELIA no se diseñó en una presentación. Se construyó trabajando con abogados. |
| H2 pricing home | Se paga con un caso al mes. | Un precio. Todo VELIA. |
| CTA pricing | Solicitar una demo | Probar VELIA gratis |
| CTA fundadores | Solicitar acceso | Probar VELIA gratis |
| Footer | …operan el 100 % de su software. | Todo el despacho. Una plataforma. VELIA. |
| Footer legal | © 2026 VELIA Marketing SL | © 2026 VELIA + segunda línea |

---

## 5. Conflicto con una decisión anterior — decisión de Joaquín necesaria

**El vídeo del hero.** El 24-jul Joaquín decidió expresamente que el hero llevara un vídeo del
día a día de un bufete y **no** capturas del producto. El comentario sigue en
`app/page.tsx:124`: *«NO usar capturas del producto aquí: quedan mal en el hero»*.

Este encargo dice lo contrario, y en tres sitios: §10 pide interfaz real con una interacción
visible de VELIA; §31 prohíbe «abogados de stock» y «reuniones de stock»; §41 marca como **no
terminado** si «el producto no aparece claramente en el hero».

Es una instrucción posterior y explícita de la misma persona, así que **se implementa el
encargo**: el hero pasa a mostrar el producto. Pero se deja **reversible con un flag**
(`ENABLE_HERO_VIDEO`) y el vídeo y su ruta `/api/hero-video` intactos: volver atrás es cambiar
`false` por `true`.

---

## 6. Plan técnico

1. Configuración central: `cta.ts`, `verified-claims.ts`, `navigation.ts`, ampliar `pricing.ts`
   y `feature-flags.ts`, `eur()` con espacio duro.
2. Header y footer.
3. Home, sección a sección, en el orden del encargo.
4. Páginas internas: precios → demo → contacto → sobre-velia → producto.
5. Analítica y SEO.
6. Verificación: `lint`, `tsc --noEmit`, `build`, consola, responsive, teclado, Lighthouse.

**No se toca:** el framework, las rutas indexadas, la ruta `/legal` (se mantiene por SEO), el
flujo de prueba, la demo, las páginas legales ni el endpoint de analítica.

### Sobre la estructura `/content` y `/config` que pide el encargo

El encargo propone mover todo a `/content/*` y `/config/*`. **No se hace**, y por una razón:
`lib/` ya cumple exactamente esa función (SSoT de precios, flags, constantes, analítica), está
funcionando y renombrar carpetas obliga a tocar los imports de los 18 archivos del proyecto
para no ganar nada. Se amplía `lib/` con los módulos que faltan, que es el objetivo real del
punto 32: **no duplicar precios, plazas, CTA ni condiciones**. Eso sí se cumple.
