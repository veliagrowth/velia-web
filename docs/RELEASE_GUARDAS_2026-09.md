# Guardas de `velia-web` — contrato de release

**Medido el 29-sep-2026** sobre `feat/web-rework-2026`. Cada cifra de este documento
salió de ejecutar algo, no de recordarlo. Lo que no se pudo medir dice `UNKNOWN`.

---

## 1. El agregado: `npm run check`

Ejecuta `scripts/check-todo.mjs`. **Ya no es una cadena de `&&`.**

### Qué estaba mal

`check` era nueve scripts encadenados con `&&`, y `check:analytics` —en rojo desde hace
meses por una dependencia que no vive en este repositorio— era el **tercero**. Un fallo
corta la cadena, así que las **seis guardas siguientes no se ejecutaban nunca**: claims
publicados, correo y las tres de navegador.

Mentía en las dos direcciones. Quien lo corría veía un rojo y suponía que el resto se
había ejecutado; y el día que analytics se cierre, seis guardas sin correr durante meses
se estrenarían todas a la vez, en el peor momento.

### Los cuatro estados

| Estado | Qué significa | Cuenta como |
|---|---|---|
| `VERDE` | salida 0 | aprobado |
| `ROJO` | fallo real, se arregla en este repositorio | **bloquea** |
| `DEPENDENCIA` | fallo cuya causa está fuera, **declarado** con su código de salida | **bloquea**, y no es un aprobado |
| `NO EJECUTADA` | no hubo medida | **bloquea** |

### Códigos de salida del agregado

| | |
|---|---|
| `0` | todas en verde. El único verde de verdad |
| `1` | hay al menos un `ROJO` o una `NO EJECUTADA` |
| `2` | ningún rojo, pero queda una `DEPENDENCIA` declarada |

⛔ **Un 2 no es un aprobado.** Existe para que la dependencia se pueda accionar sin
confundirla con un defecto propio, no para dejarla pasar.

### Cómo se clasifica una dependencia

**Por código de salida de la guarda, nunca parseando su texto.** Una guarda que declara
dependencia lo hace con un código propio; `check-todo.mjs` lo compara con el que tiene
declarado en su inventario. Hoy sólo `check:analytics` lo hace, con salida `2`.

---

## 2. Procedencia: contra qué se mide

Cinco guardas miden el **HTML servido**. Medir el servidor equivocado ya pasó, así que el
agregado se niega a empezar en dos casos:

| Condición | Qué hace | Por qué |
|---|---|---|
| El puerto ya está ocupado | **para**, salida 1 | no se puede demostrar qué build sirve ese proceso |
| El código es más nuevo que `.next` | **para**, salida 1 | serviría una versión que ya no existe, con todo en verde |

Al terminar mata el **árbol** de procesos y **comprueba que el puerto ha quedado libre**.
Si no, lo dice y falla.

El servidor se levanta invocando `node node_modules/next/dist/bin/next` directamente, no
`npx`: `npx` mete un proceso envoltorio en medio, así que el pid que se recibe no es el
del servidor y matarlo deja vivo al hijo. Es el huérfano que ocupó el 3150 en la sesión
del 29-sep e hizo que unas mediciones corrieran contra un build anterior.

### Las tres guardas del propio agregado, probadas por mutación

No basta con que existan. Se rompieron a propósito y se comprobó que muerden:

| Mutación | Resultado |
|---|---|
| Un servidor ajeno ocupando el 3150 | salida **1**, se niega a medir |
| `touch` en un fuente sin recompilar | salida **1**, «el código es MÁS NUEVO que el build» |
| Un defecto de contraste real reintroducido | `qa:paginas` → **ROJO**, salida **1**, y **`qa:identidad`, que va después, siguió ejecutándose y salió verde** |

La tercera es la que demuestra lo que arregla este cambio: con la cadena `&&` anterior,
`qa:identidad` no se habría ejecutado.

---

## 3. Contrato de mutaciones

**Medido: ninguna de las nueve guardas modifica el árbol de trabajo.**

El agregado toma `git status --porcelain` antes y después de **cada** guarda y atribuye
cualquier cambio a la guarda que lo produjo, en vez de dejar un árbol sucio de origen
desconocido al final. Si alguna empieza a mutar, se ve en su fila y en un aviso aparte.

⚠️ Esto **no** aplica a `velia-portal`, donde `npm run check` sí reescribe seis JSON de
instantánea. Son repositorios distintos con contratos distintos.

---

## 4. Analytics: dependencia cross-repo

**Estado: `DEPENDENCY_PENDING`. No se puede cerrar desde `velia-web`.**

`check:analytics` compara los eventos que declara `lib/analytics.ts` con la lista cerrada
del endpoint del portal, leída **del disco**:

```
../../CRM/velia-portal/app/api/public/web-analytics/route.ts
```

Medido: **6 eventos** que la web emite y el buzón descartaría con un 200
(`nav_contacto_click`, `hero_contacto_click`, `final_contacto_click`,
`shift_section_view`, `capabilities_section_view`, `operating_model_view`).

La propia guarda comprueba si otra rama del portal los contiene, y **sí**:
`feat/web-rework-2026-analytics`. El portal en disco está en otra rama.

| | |
|---|---|
| Verificable dentro de `velia-web` | que los 41 eventos declarados existen y son coherentes |
| Depende de `velia-portal` | que el endpoint los acepte |
| Qué cierra el gate | que la rama de analytics del portal llegue a `main`, y volver a medir |

⛔ **No** se inventan eventos, **no** se copian al repo web, **no** se retira la guarda
y **no** se presenta como verde.

---

## 5. `@vercel/og` — NO APLICA a `velia-web`

Auditado el 29-sep. `velia-web` **no tiene ninguna relación con `@vercel/og`**:

| Medición | Resultado |
|---|---|
| `@vercel/og`, `next/og`, `ImageResponse` en el código | **0 apariciones** |
| En `package.json` | no está |
| En el lockfile | no está |
| Dependencias reales | `next@14.2.30`, `react`, `react-dom`. Nada más |
| Imágenes Open Graph | **PNG estáticos** por convención de fichero de Next: `app/opengraph-image.png`, `app/twitter-image.png`, `app/icon.png` |

No hay generación en tiempo de ejecución, así que no hace falta `ImageResponse`, así que
no hay nada que migrar. **No se toca.**

### Dónde vive de verdad el problema

En **`velia-portal`**: `@vercel/og@^0.11.1` y `scripts/check-composicion-pinta.mjs`. El
`ERR_INVALID_URL` de Windows es suyo. Queda fuera del alcance de esta sesión y **no se
ha tocado**; se anota que el portal está en `next@14.2.35`, que ya trae `next/og`, por si
esa migración se evalúa en su propio bloque.

---

## 6. El bloqueo de Windows no es de `velia-web`

**`velia-web` se puede empujar desde Windows.** Medido: su `pre-push` es `sh` puro,
ejecutable (`-rwxr-xr-x`), y **no invoca node ni npm** — 0 coincidencias.

Y no es una guarda de QA: es una válvula de publicación. Bloquea empujar
`feat/web-rework-2026` al repositorio **público** `veliagrowth/velia-web` y deja pasar el
remoto privado `velia-web-preview`.

⚠️ El upstream de `feat/web-rework-2026` es **`preview/`**, no `origin`: un `git push`
desnudo va al repositorio de preview.

---

## 7. Contraste: qué es guarda y qué es auditoría de release

| Ámbito | Estado |
|---|---|
| Texto en prosa **y en controles y tablas** | **guarda permanente**. `auditoria-pagina.mjs` recorre 20 etiquetas: entraron `button`, `td`, `th`, `label`, `code`, `dt`, `dd`, `strong`, `em`, `summary`, `figcaption`, `blockquote`. La consumen `qa:home` y `qa:paginas` |
| Borde de control (WCAG 1.4.11), anillo de foco, estado deshabilitado | **auditoría de release, NO guarda** |

Por qué lo segundo no se integra: sobre las 16 páginas dio **1 hallazgo, y era un falso
positivo** —el honeypot de `/contacto`, correctamente oculto con `aria-hidden`, `w-px
h-px`, `opacity-0` y `tabIndex={-1}`: la comprobación miraba el `opacity` del propio
campo y no el del ancestro—. Foco y deshabilitados dieron 0 en 16 páginas.

Una guarda cuyo único hallazgo histórico es un falso positivo no es determinista ni
fiable: sería ruido con permiso. Se deja como auditoría que se repite en el release.

---

## 8. Matriz medida el 29-sep-2026

| Guarda | Estado | Salida |
|---|---|---|
| `build` | VERDE | 0 · **24 rutas** (eran 28: se retiraron 4) |
| `test:claims` | VERDE | 0 · 8/8 |
| `test:rutas` | VERDE | 0 · 7/7 |
| `check:opacidades` | VERDE | 0 |
| `check:analytics` | **DEPENDENCIA** | 2 · `velia-portal` |
| `check:claims` | VERDE | 0 |
| `check:email` | VERDE | 0 · 5 legales conservan el correo |
| `qa:home` | VERDE | 0 · 59 |
| `qa:paginas` | VERDE | 0 · 418 |
| `qa:identidad` | VERDE | 0 |
| `qa:faq` | VERDE | 0 · 33 |
| **Agregado** | **9 verdes + 1 dependencia** | **2** |

`qa:hero` existe en `package.json` y **no** está en el agregado. No se ha añadido: entra
cuando se mida, no por estar en la lista.

---

## 10. Retirada de la superficie legacy (29-sep-2026)

`/precios`, `/demo`, `/fundadores` y `/legal` **ya no existen**: sus `page.tsx` se
borraron y Next responde **404**. Medido en el servidor, no supuesto.

Antes estaban vivas a 200 con `noindex`. La política era «dejan de anunciarse, no se
rompen», y se revirtió por un motivo concreto: `noindex` es una petición a un buscador,
no un control de acceso. Escribiendo la URL se llegaba igual a 99 €/mes, a la prueba de
15 días, al Programa Fundadores y a «un día de tu despacho».

⚠️ **`/legal` (producto) no es `(legales)`.** Las cinco superficies legales vigentes
—`/aviso-legal`, `/privacidad`, `/cookies`, `/terminos`, `/ia-responsable`— siguen vivas,
indexables y en el sitemap. Son obligación legal.

Medido tras la retirada: sitemap con 14 URL y ninguna retirada · `llms.txt` limpio ·
la Home no enlaza ninguna · las cinco legales a 200.

**La criba `enlacePublicable()` se queda** (ahora en `lib/rutas-retiradas.ts`, antes
`rutas-congeladas.ts`). El 404 protege la ruta, no los enlaces que apuntan a ella: el
feed del portal sigue trayendo `link` a `veliacorp.com/precios`, y pintar un enlace a un
404 es peor que no pintarlo.

**Huérfanos nuevos**, por quedarse sin sus únicas páginas: `TrialButton`, `PricingPlans`,
`PricingSelector`, `ProductShot`, `PhoneShot` y `lib/pricing.ts`. Se clasifican, no se
borran. Ninguno se renderiza, así que los 99 €/mes salen igualmente de la superficie
pública.

**Los eventos legacy de `lib/analytics.ts` NO se tocan.** Ya no los emite nadie, pero el
buzón del portal los sigue aceptando: quitarlos encendería la otra mitad de
`check:analytics` —«el buzón acepta y la web ya no emite»—, que es un fallo real con
salida 1 en vez de la dependencia declarada. Los dos lados se retiran juntos.

---

## 11. FAQ pública

Once preguntas en la Home (`#preguntas`), entre «por qué VELIA» y el cierre. Indexable:
vive en `/`, que está en el sitemap con prioridad 1.

**Sin JSON-LD `FAQPage`**, a propósito: la Fase 0 retiró esa señal y `qa:identidad` exige
que ninguna ruta la publique. **Sin claims nuevos** en `lib/verified-claims.ts`: ninguna
respuesta afirma un hecho que necesite fuente externa.

**Tres gates comerciales humanos**, marcados con `gate: true` en `lib/faq.ts` — precio,
condiciones de salida y propiedad de activos. El texto publicado es neutral, cierto y
publicable tal cual; se sustituye cuando exista la decisión. Cero `TODO` o `TBD` visibles.

---

## 9. Preview — medida hoy, y por qué es `UNKNOWN`

| | |
|---|---|
| Última ref empujada al remoto `preview` | `e7507a9` |
| Local por delante de esa ref | **5 commits** |
| Commit **desplegado y servido** | **UNKNOWN** |

Por qué `UNKNOWN`: `https://web-preview.veliacorp.com/` y `/api/health` devuelven la
pantalla de acceso de Cloudflare Access (el JWT de la redirección lleva
`service_token_status: false`). **Una máquina no puede leer la preview**, así que la
revisión visual es necesariamente humana.

⚠️ Empujar la rama **no** despliega. El despliegue lo hace
`velia-core/scripts/web-preview/04-desplegar-y-verificar.mjs`, y la verificación de lo
servido, `06-verificar-preview-servida.mjs`. Ninguno se ha ejecutado en esta sesión.
