# La divergencia de `velia-web`, y por qué el merge era seguro

**12-sep-2026 · Fase 0 del VELIA Web Rework 2026**

En este repositorio **`git push origin main` despliega producción** (Coolify CD, desde el
22-jul-2026). Por eso el estado de las ramas no es un detalle de higiene: es la diferencia
entre trabajar y publicar.

## Lo que había

`main` local y `origin/main` llevaban **desde el 22 de agosto divergidos**, y el aviso de git
—«have diverged, and have 2 and 1 different commits each»— llevaba ahí veinte días sin que
nadie lo leyera.

```
* d6c2b2a (origin/main)  22-ago  feat(posicionamiento): VELIA es la plataforma…
| * 0a1c927 (main)       12-ago  fix(carrusel): la V de VELIA vuelve a verse…
| * ccd46da              12-ago  feat(carrusel): «La mesa del lunes»…
|/
* 123349f                11-ago  feat(hero): el hero como pieza social 4:5   ← base común
```

**Producción sirve `d6c2b2a`, no lo que hay en disco.** Medido, no supuesto: el título que
devuelve `veliacorp.com` es «VELIA Legal | Software jurídico con IA para despachos», que es
exactamente el de `origin/main` y no el del checkout local.

Conviene decir cómo se estuvo a punto de leer mal. Al ver que el título de producción no
coincidía con el del disco, la conclusión inmediata era «producción está desactualizada». Es
falsa: **cada lado tiene commits que el otro no tiene**. Una sola lectura no distingue
«atrasado» de «divergido» — hay que preguntar por la base común.

## Qué había en cada lado

| | `d6c2b2a` (remoto, en producción) | Los dos locales del 12-ago |
|---|---|---|
| Ficheros | `v3/app/layout.tsx` · `v3/app/sobre-velia/page.tsx` | `v3/scripts/render-hero-video.mjs` · `v3/scripts/publicar-carrusel.mjs` |
| Qué hace | antepone «Legal» al `title` y al `og:title`; `/sobre-velia` pasa a «Plataforma de IA para industrias especializadas» | generadores de piezas para redes que se ejecutan a mano; **no entran en el build del sitio** |
| Alcance | metadatos públicos | herramienta interna |

**Cero solapamiento de ficheros.** Por eso el merge no podía producir conflicto, y no lo produjo.

## Los commits locales no corrían peligro

`origin/respaldo/carrusel-local-20260823` apunta **al mismo SHA** que `main` local
(`0a1c927`). Es decir, los dos commits del 12-ago ya estaban respaldados en el remoto desde el
23 de agosto. Se comprobó antes de tocar nada, no después.

## Lo que se hizo

```bash
git switch -c feat/web-rework-2026   # la rama PRIMERO
git merge origin/main                # el merge vive en la rama
```

Resultado: `aea9868`, merge por estrategia `ort`, 2 ficheros, 11 inserciones, 5 supresiones,
sin conflictos.

`main` local **queda intacto y sin empujar**. No se usó `reset --hard`, ni force-push, ni
rebase. Los dos lados de la historia se conservan enteros.

## Una nota que no es de git, sino de estrategia

`d6c2b2a` defiende la tesis «VELIA es la plataforma, VELIA Legal es su primer vertical». Esa
tesis **quedó derogada el 9-sep** por `VELIA_DIRECCION_2026-09.md` (§5: VELIA Legal
descontinuado como producto y marca; §83-86: la marca pública es VELIA, nunca «VELIA Legal»).

No es un conflicto de merge: es un cambio que el rework va a sustituir. Se integra igualmente
—para que la rama parta del estado real de producción y nada se pierda— y se deja constancia
de que su contenido es anterior a la dirección vigente.

## Lo que sigue prohibido en esta etapa

`git push origin main`. Aquí eso es publicar, y la VELIA nueva todavía no se ha validado.
La regla de push automático de `CLAUDE.local.md` **no aplica a este repositorio**: se escribió
para un repo de documentación, no para uno con despliegue continuo detrás.
