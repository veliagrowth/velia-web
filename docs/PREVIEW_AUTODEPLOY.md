# Auto-deploy de la preview privada — cómo está configurado y cómo se comprueba

**Repo de preview:** `veliagrowth/velia-web-preview` (PRIVADO) · **rama:** `feat/web-rework-2026`
**App de Coolify:** `velia-web-preview` · uuid `k12hhf35b1e6su1ce18za7jv`
**URL:** `https://web-preview.veliacorp.com` (detrás de Cloudflare Access)

⚠️ Este documento describe **sólo la preview**. No toca `veliacorp.com` ni el repo público.

## El trigger

| Pieza | Estado |
|---|---|
| Fuente de la app en Coolify | GitHub App `velia-coolify` (`source_id = 1`) |
| La GitHub App alcanza el repo privado | sí |
| Commit que sigue la app | `HEAD` de la rama, no un SHA fijado |
| Secreto de webhook de GitHub en la app | presente |

Con eso, un `git push preview feat/web-rework-2026` debe producir un despliegue **sin que
nadie llame a la API de Coolify**.

## Cómo se comprueba, y por qué así

El commit servido se lee en `/api/health`, que declara además de **dónde** sale el valor
(`commit_fuente`). Es la única ancla que no engaña: ni `uptime_s`, ni «la página ha cambiado»,
ni «el push se hizo».

```text
push a la rama de preview
      ↓   (sin intervención manual)
despliegue en Coolify con ESE commit
      ↓
GET https://web-preview.veliacorp.com/api/health   (con el token de servicio de Access)
      ↓
commit servido == commit empujado
```

La verificación completa vive en `velia-core/scripts/web-preview/06-verificar-preview-servida.mjs`.
`04-desplegar-y-verificar.mjs` sigue existiendo para **forzar** un despliegue; con el trigger
automático funcionando, ya no es el camino normal.

⛔ Lo que **no** vale como prueba: «push realizado» · «deployment creado» · `uptime_s` cambió ·
el último despliegue de la lista (eso es recencia, no identidad).
