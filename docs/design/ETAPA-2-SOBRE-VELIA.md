# Etapa 2 del rework — `/sobre-velia`, y dos guardas que medían otra cosa

**17-sep-2026 · rama `feat/web-rework-2026`**

Este fichero registra lo que pasó en ESTA rama, que es lo único que el
`docs/README.md` permite escribir aquí. La dirección de diseño y el inventario
de rutas legacy siguen siendo canónicos en `velia-core` y no se copian: dos
copias divergen.

---

## Lo que se encontró

La etapa 1 dejó la Home nueva en `RELEASE CANDIDATE`, esperando revisión visual
y aprobación humana. Nada de eso lo puede cerrar una sesión sola, así que el
trabajo siguió por el mayor hueco abierto de la etapa 2.

Medido antes de tocar nada, sobre el código y sobre el build servido:

| | Estado real |
|---|---|
| `/contacto` | **ya reescrita** en la etapa 1, pese a figurar como `REWRITE` pendiente en el inventario |
| `/sobre-velia` | **sin tocar**, publicando la tesis derogada, **y en el sitemap con prioridad 0.7** |
| `/seguridad` | gate de claims cerrado; el cuerpo sigue hablando como un SaaS jurídico |
| `/novedades` | enlazada desde el pie nuevo; habla de «el software de los despachos» |

`/sobre-velia` era el mayor hueco, y no por ser fea: por ser **contradictoria y
propuesta activamente a los buscadores**.

```
title        Sobre VELIA | Plataforma de IA para industrias especializadas
description  …VELIA Legal es su primer vertical…
cuerpo       VELIA es un producto de software, no un servicio a medida
             Suscripción, no facturación por horas
cierre       ¿Quieres verlo con los casos de tu despacho?  +  TrialButton
```

Las dos primeras líneas son la tesis del 22-ago, derogada el 9-sep por
`VELIA_DIRECCION_2026-09.md` (§5, §83-86). Las tres siguientes dicen lo
contrario de lo que dice la Home a un clic de distancia.

Y el `llms.txt` de este mismo sitio declara «compañía de transformación y
operación digital… no vende un producto de software». **Dos declaraciones
incompatibles de la misma entidad, las dos servidas, las dos ofrecidas a las
máquinas** — el fallo exacto que la capacidad *AI Search & Digital Visibility*
dice saber resolver en el negocio de otro.

## Lo que se hizo

1. **`/sobre-velia` reescrita.** Cinco momentos con el ritmo de la Home y
   ninguna forma repetida: afirmación · el modelo (corte oscuro) · cómo
   decidimos · quién responde · cierre (corte oscuro). No repite las cuatro
   capacidades ni las seis fases: viven en la Home, y duplicarlas serían dos
   relojes. Ni una cifra. `TrialButton` sale de la página y **no** se borra del
   repositorio: `/precios`, `/demo` y `/fundadores` lo siguen usando.
2. **Entra en el pie**, no en el header — §7 de la dirección fija cuatro
   elementos arriba y una acción, y eso no lo cambia una página reescrita. Hasta
   hoy no la enlazaba nada de la web nueva y sí la proponía el sitemap: se
   ofrecía a los buscadores y no a las personas.
3. **`final_contacto_click` tenía un emisor de cero.** El único CTA de la Home
   usaba un `<Link>` pelado. El embudo habría enseñado los `nav_contacto_click`
   del header y cero conversiones desde el cierre — que se lee como «el cierre
   no convierte» cuando lo que pasa es que no se mide.
4. **Dos guardas medían otra propiedad.** Ver abajo.

## Lo que NO se cuenta en la página, y es deliberado

El **origen de la compañía**. Cómo se narra en público la etapa anterior es una
decisión de marca, registrada como abierta en la memoria del proyecto («misión,
visión, valores e historia sin escribir»). Inventar aquí una historia
fundacional sería ponerle a la compañía unas palabras que nadie ha decidido.
**HUMAN_DECISION.**

---

## Las dos guardas que medían otra cosa

### `check:analytics` no decía contra qué objeto medía

Lee el endpoint del portal «en disco», y eso no es un objeto fijo: es lo que
tenga la rama en la que esté ese repositorio — una rama que no forma parte de
este cambio. Medido:

| Rama del portal | Aceptados | Faltan de los 7 del rework |
|---|---|---|
| `feat/web-rework-2026-analytics` | 42 | **0** |
| `main` | 35 | 7 |
| `feat/hub-nueva-web` *(la que había en disco)* | 35 | 7 |

El rojo que salía era inaccionable: no distingue «el catálogo diverge» de «estás
mirando otra rama», y un verde sobre la rama equivocada engaña igual de bien.
Ahora imprime siempre ruta, rama y commit del portal, y cuando falla dice si
esos nombres están en otra rama. **El veredicto no se relajó**: sigue saliendo
con 1.

### El contraste aprobaba texto ilegible

`fondoReal()` subía hasta el primer ancestro con alfa > 0 y lo trataba como
opaco. El falso positivo se ve y se discute — la tarjeta destacada nueva daba
1,00 · 2,61 · 2,01 cuando sus valores reales son 4,87 · 16,31 · 8,48. El que no
se ve es el inverso, y es el que importa: **un `bg-void/5` sobre blanco se medía
como Night opaco**, así que texto `cream` encima daba ~17:1 y pasaba, cuando en
pantalla es cream sobre casi-blanco.

Causalidad demostrada con la misma trampa inyectada en la Home y el build
rehecho cada vez:

```
algoritmo de HEAD  + trampa   →  25/25 EN VERDE     ← la guarda aprobaba 1,04:1
algoritmo nuevo    + trampa   →  FALLA con 1,04:1
algoritmo nuevo    sin trampa →  25/25
```

---

## Verificación

Sobre el **build de producción** servido en local, no sobre el código:

| | |
|---|---|
| `qa:home` | 25/25 |
| `check:claims` | verde · 0 claims sin verificar publicados · 3 divulgaciones legales |
| `test:claims` | 8/8 |
| `check:opacidades` | 241 revisadas |
| `check:analytics` | **rojo, y correctamente** — ver arriba |
| `/sobre-velia` a 1440 px | 1 h1 · jerarquía sin saltos · 0 px de desborde |
| `/sobre-velia` a 390 px | 0 px de desborde · ningún elemento sobresale |
| Reveals | 6 de 6 se revelan al hacer scroll a ritmo humano |
| Contraste de la tarjeta oscura | 4,87 · 16,31 · 8,48 con el fondo compuesto |

**No verificado, y se dice:** que los eventos lleguen al buzón. `trackEvent`
solo emite desde `veliacorp.com` por el gate de dominio de `3b61acb`, así que el
efecto final no es observable fuera de producción — y producción no se toca.

## Estado de fuera de esta rama, medido hoy

- `veliacorp.com` sigue sirviendo la web anterior: el `<title>` es
  «VELIA Legal | Software jurídico con IA para despachos». **Intacta.**
- `web-preview.veliacorp.com` responde **302 hacia Cloudflare Access**, con
  `auth_status: NONE`. El host está en pie y Access muerde. Qué commit sirve no
  se puede leer sin credenciales, y no se crea ningún bypass para verlo.
- La preview sigue publicando `3b61acb`: **los commits de esta etapa no están
  en ella** hasta que alguien empuje la rama al remoto `preview`.

## Lo que queda desactualizado en `velia-core`

No se toca desde aquí —otra sesión trabaja en ese repositorio— pero conviene
que alguien lo corrija:

1. `docs/design/VELIA_WEB_LEGACY_INVENTORY_2026.md` lista `/contacto` y
   `/sobre-velia` como `REWRITE` pendientes de la etapa 2. **Las dos están
   hechas**: `/contacto` en la etapa 1 y `/sobre-velia` hoy.
2. `memory/project_velia_web_rework_2026.md` dice que la etapa 2 no ha empezado.

## Siguiente hueco

`/novedades` — está en el pie de **todas** las páginas de la web nueva y en el
sitemap, y su copy estático habla de «el software de los despachos». Es un solo
clic desde cualquier punto del sitio, frente a los dos saltos que exige
`/seguridad`.
