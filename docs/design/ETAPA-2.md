# Etapa 2 del rework — las cuatro páginas, y las guardas que no miraban

**17/18-sep-2026 · rama `feat/web-rework-2026`**

Este fichero registra lo que pasó en ESTA rama, que es lo único que el
`docs/README.md` permite escribir aquí. La dirección de diseño y el inventario
de rutas legacy siguen siendo canónicos en `velia-core` y no se copian: dos
copias divergen.

---

## Estado

**La etapa 2 está cerrada.** Las cuatro páginas que la dirección listaba
(`/seguridad`, `/sobre-velia`, `/novedades`, `/contacto`) están reescritas.

| Ruta | Estado |
|---|---|
| `/contacto` | ya venía reescrita de la etapa 1 — el inventario la daba por pendiente |
| `/sobre-velia` | reescrita el 17-sep |
| `/novedades` | reescrita el 18-sep |
| `/seguridad` | reescrita el 18-sep |

La etapa 1 sigue en `RELEASE CANDIDATE`, esperando revisión visual y aprobación
humana. Es una pendiente independiente: no bloquea el trabajo, pero sí bloquea
la publicación.

---

## `/sobre-velia` — la identidad derogada estaba en el sitemap

```
title        Sobre VELIA | Plataforma de IA para industrias especializadas
description  …VELIA Legal es su primer vertical…
cuerpo       VELIA es un producto de software, no un servicio a medida
             Suscripción, no facturación por horas
cierre       ¿Quieres verlo con los casos de tu despacho?  +  TrialButton
```

Las dos primeras son la tesis del 22-ago, derogada el 9-sep. Las tres siguientes
dicen lo contrario de lo que dice la Home a un clic. Y `sitemap.ts` la proponía a
los buscadores con prioridad 0.7 mientras el `llms.txt` del mismo sitio declaraba
lo opuesto: **dos identidades incompatibles, las dos servidas.**

Ahora: cinco momentos con el ritmo de la Home, ni una cifra, `TrialButton` fuera
—no borrado: `/precios`, `/demo` y `/fundadores` lo siguen usando—, y entra en el
pie. Hasta ese día no la enlazaba nada de la web nueva y sí la proponía el
sitemap: se ofrecía a los buscadores y no a las personas.

**No se cuenta el origen de la compañía, y es deliberado.** Cómo se narra esa
etapa en público es una decisión de marca, registrada como abierta en la memoria
del proyecto. Inventarla aquí sería ponerle a la compañía unas palabras que nadie
ha decidido. `HUMAN_DECISION`.

## `/novedades` — el feed se saltaba el aislamiento de las rutas legacy

Tres cosas que no eran de copy:

1. **El vacío se contaba como avería.** `fetchUpdates()` devolvía `[]` si la red
   fallaba, si el feed daba error y si el feed contestaba bien sin nada que
   contar. La página pintaba «no podemos cargar las novedades» en los tres casos.
   El día que el tablón esté legítimamente vacío, la web declara una avería que
   no existe; y si el feed se cae, se lee igual que un tablón vacío.
2. **La política de rutas congeladas se aplicó donde los enlaces se escriben a
   mano** —Home, navegación, sitemap—. Los que trae el feed no pasaban por
   ninguna criba. Medido: la entrada «El Programa Fundadores sigue abierto» lleva
   `link` a `veliacorp.com/precios`, y el pie de todas las páginas lleva a
   `/novedades`. Dos clics desde cualquier punto del sitio hasta la página de
   precios de la etapa anterior.
3. **Jerarquía visual sin jerarquía real**: rótulos `h2` de 11 px usados como
   etiquetas, y el primer anuncio destacado a `text-3xl` sólo por caer primero en
   el array — un destacado que decide el feed y no controla nadie.

Causalidad del punto 1, con tres builds y el origen del feed movido:

```
feed real (13 entradas)    → pinta las entradas
200 con {"updates": []}    → «Todavía no hay … publicadas»     avería: NO
fuente inalcanzable        → «No hemos podido leer el tablón»  avería: SÍ
```

## `/seguridad` — 25 menciones a «despacho», y dos clics de distancia

No está en la navegación y aun así es de las más alcanzables: la enlazan
`/privacidad` e `/ia-responsable`, que están en el pie. Ese camino no se puede
romper, porque las dos que lo abren son obligación legal.

Se conserva intacto lo que ya estaba bien: el gate de Product Truth (los tres
claims `pending` siguen atados y sin publicarse), el contador derivado —dice «LOS
DOS PILARES» porque `noModelTraining` no está verificado—, la rejilla calculada,
y «hoy no tenemos ISO 27001», que ahora se lleva el corte oscuro.

Se añade `tenantIsolation`, que llevaba `verified` desde julio con `usedIn: []`:
un hecho comprobado que no se publicaba en ninguna parte. Su texto se reformuló
(«despacho» → «cliente») **sin tocar** `status`, `source`, `verifiedAt` ni
`owner`: el hecho es el mismo.

**Sigue fuera del sitemap, y debe seguir:** su contenido depende de claims
`pending`.

---

## Las guardas — tres arreglos y una nueva

### `check:analytics` no decía contra qué objeto medía

Lee el endpoint del portal «en disco», que es lo que tenga la rama en la que esté
ese repositorio — una rama que no forma parte de este cambio.

| Rama del portal | Aceptados | Faltan de los 7 |
|---|---|---|
| `feat/web-rework-2026-analytics` | 42 | **0** |
| `main` · `feat/hub-nueva-web` | 35 | 7 |

Ahora imprime ruta, rama y commit, y dice si esos nombres están en otra rama.
**El veredicto no se relajó.**

### El contraste aprobaba texto ilegible

`fondoReal()` paraba en el primer ancestro con alfa > 0 y lo trataba como opaco.
El falso positivo se discute; el peligroso es el inverso: un `bg-void/5` sobre
blanco se medía como Night, y texto `cream` encima daba ~17:1 y pasaba.

```
algoritmo de HEAD  + trampa   →  25/25 EN VERDE     ← aprobaba 1,04:1
algoritmo nuevo    + trampa   →  FALLA con 1,04:1
algoritmo nuevo    sin trampa →  25/25
```

### `final_contacto_click` no lo emitía nadie

Declarado en el catálogo y aceptado por el buzón desde que se escribió la Home.
El único CTA usaba un `<Link>` pelado. El embudo habría enseñado cero
conversiones desde el cierre — que se lee como «el cierre no convierte» cuando lo
que pasa es que no se mide.

### `qa:paginas` — la guarda nueva

`qa:home` medía cinco cosas universales sólo en `/`. Con cuatro páginas nuevas,
las otras tres se comprobaron **a mano**, y una medición a mano no es una guarda:
no se repite sola, no falla el push y nadie la vuelve a correr.

Las mediciones viven una sola vez en `scripts/lib/auditoria-pagina.mjs` y las
comparten las dos: ni una línea duplicada. `qa:home` conserva lo suyo —umbral,
segunda visita, sin JavaScript, header sobre oscuro— y sigue en 25/25 con las
mismas comprobaciones que antes del refactor.

**Mordió en su primera ejecución, con 6 fallos preexistentes:**

- las **cinco** páginas legales publicaban «Versión X · Última actualización…» a
  **2,61:1**. Comparten la clase `.legal-meta`, así que comparten el arreglo.
- `/contacto` saltaba del `h1` al `h3`, porque `ContactForm` abría con un `h3`.

Ninguno lo introdujo esta etapa.

Causalidad, con texto a 1,38:1 inyectado en `/sobre-velia`:

```
qa:home     → 25/25 EN VERDE     ← sólo mira la Home
qa:paginas  → FALLA, y nombra página, texto y ratio
restaurado  → 80/80 sobre 10 páginas
```

Y `test:rutas` falló solo al mover la lista `LEGACY` al módulo compartido:
detectó su propio cambio de terreno, que es justo para lo que está.

### Cada página compartía el título de la portada

Next no fusiona `openGraph` campo a campo: una página que no lo declara hereda
entero el del layout, y **ninguna lo declaraba**. Las nueve páginas que no son la
Home publicaban su `og:title`, su `og:description` y —lo peor— `og:url` =
`https://veliacorp.com`. Cada una le decía a WhatsApp, LinkedIn y Slack que el
enlace compartido era la portada. Y `/contacto` es la que más se pega en un chat,
porque es el destino del único CTA de toda la web.

`lib/metadatos.ts` deriva `title`, `canonical`, `og:*` y `twitter:*` de una sola
declaración, y `qa:paginas` comprueba el resultado sobre el HTML servido. Las 28
comprobaciones nuevas nacieron en rojo: por eso existen.

En las cinco legales esto es **metadata, no el texto del documento**.

---

## Verificación

Sobre el **build de producción** servido en local, no sobre el código:

| | |
|---|---|
| `qa:home` | 25/25 |
| `qa:paginas` | **108/108 sobre 10 páginas** |
| `opengraph-image` · `twitter-image` | 1200×630 (1,905:1), como exige §13 |
| `test:claims` | 8/8 |
| `test:rutas` | 7/7 |
| `check:claims` | verde · 0 claims sin verificar publicados |
| `check:opacidades` | 240 |
| `check:analytics` | **rojo, y correctamente** — ver arriba |
| `tsc` | sin errores fuera de los ficheros de test |

**No verificado, y se dice:** que los eventos lleguen al buzón. `trackEvent` sólo
emite desde `veliacorp.com` por el gate de dominio, así que el efecto final no es
observable fuera de producción — y producción no se toca.

## Estado de fuera de esta rama

- `veliacorp.com` sigue sirviendo la web anterior («VELIA Legal | Software
  jurídico con IA para despachos»). **Intacta.**
- `web-preview.veliacorp.com` responde **302 hacia Cloudflare Access** con
  `auth_status: NONE`, en `/`, en `/sobre-velia` y en `/api/health` — esta última
  con un *application ID* distinto, coherente con las dos apps documentadas. Qué
  commit sirve no se puede leer sin el service token, y no se crea ningún bypass
  para verlo.

## Abierto — decisiones que no son de implementación

1. **Revisión visual y aprobación del release** (etapa 1).
2. **El Programa Fundadores sigue en el feed.** Su enlace ya no se pinta, pero el
   texto se publica: «precio de lanzamiento de por vida», «plazas limitadas»,
   «los despachos que entran ahora». Es la oferta del modelo SaaS descontinuado.
   Se retira desde `/admin/novedades`, no desde la web.
3. **Las páginas legales hablan como la etapa anterior**: `/terminos` 27
   menciones a «despacho», `/privacidad` 16, `/ia-responsable` 10. Son documentos
   con efectos jurídicos: el texto no se toca sin criterio legal. Lo que sí se
   arregló es su accesibilidad, que no es contenido.
4. Los cinco claims siguen `pending`. Conseguir su verificación documental los
   devuelve a la web sola, sin tocar código.

## Lo que queda desactualizado en `velia-core`

No se toca desde aquí —otra sesión trabaja en ese repositorio— pero conviene
corregirlo:

1. `VELIA_WEB_LEGACY_INVENTORY_2026.md` lista `/contacto`, `/sobre-velia`,
   `/novedades` y `/seguridad` como `REWRITE` pendientes. **Las cuatro están
   hechas.**
2. `memory/project_velia_web_rework_2026.md` dice que la etapa 2 no ha empezado.

## Siguiente

La etapa 3 —decidir el destino de cada ruta congelada— **no puede empezar**: el
inventario exige cuatro datos que hoy no existen (tráfico real por ruta, qué está
indexado, enlaces entrantes y cuántos correos llevan dentro el enlace a `/demo`).
Redirigir primero y descubrir dependencias después es el orden que ese inventario
existe para evitar.
