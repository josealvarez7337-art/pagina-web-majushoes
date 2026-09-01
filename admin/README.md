# Panel de la tienda — qué falta para encenderlo

El panel ya está en el repositorio, pero **todavía no funciona**: falta el
login. Son cuatro pasos y se hacen una sola vez.

Cuando termines, la tienda entra a `.../pagina-web-majushoes/admin/`, se
loguea, y carga zapatos desde el celular sin ver nunca código.

---

## 1. La cuenta que va a usar la tienda

Crea una cuenta de GitHub aparte, solo para el panel — por ejemplo
`majushoes-panel`, con un correo tuyo o de la tienda.

Después, en este repositorio: **Settings → Collaborators → Add people**, y le
das acceso de escritura (**Write**).

La tienda nunca crea ni administra esa cuenta. Desde su lado es "un usuario y
una clave que me dieron".

## 2. El worker de Cloudflare

Es la pieza que conecta el panel con GitHub. **Va primero** porque los pasos
siguientes necesitan su dirección.

Sveltia lo publica listo en <https://github.com/sveltia/sveltia-cms-auth>.
Ese repositorio trae un botón **Deploy to Cloudflare Workers** que hace todo
el despliegue: no hay que instalar nada ni escribir código.

Después, en el panel de Cloudflare, el servicio aparece como
`sveltia-cms-auth`. Copia su dirección, que queda con esta forma:

```
https://sveltia-cms-auth.<TU-SUBDOMINIO>.workers.dev
```

Eso es lo único que necesitas de este paso. Todavía no le configures nada
más: las variables se ponen en el paso 3, cuando ya existan.

## 3. La aplicación OAuth de GitHub

Con **tu** cuenta, entra a
**Settings → Developer settings → OAuth Apps → New OAuth App**:

- **Application name:** Panel Maju Shoes
- **Homepage URL:** `https://josealvarez7337-art.github.io/pagina-web-majushoes/`
- **Authorization callback URL:** la dirección del paso 2 con `/callback` al
  final. Ejemplo: `https://algo.workers.dev/callback`

Guarda el **Client ID** y genera un **Client Secret**. El secret se ve una
sola vez: cópialo apenas aparezca.

Vuelve al worker en Cloudflare, entra a **Settings → Variables**, y agrega
estas tres con el nombre exacto:

| Variable | Valor | Nota |
|---|---|---|
| `GITHUB_CLIENT_ID` | el Client ID | |
| `GITHUB_CLIENT_SECRET` | el Client Secret | **márcala como encriptada** |
| `ALLOWED_DOMAINS` | `josealvarez7337-art.github.io` | limita quién puede usar el worker |

`ALLOWED_DOMAINS` no es obligatoria, pero sin ella cualquier sitio podría
usar tu worker para pedir permisos sobre el repositorio. Ponla.

## 4. Conectar el panel

En `admin/config.yml`, reemplaza:

```yaml
base_url: https://PENDIENTE.workers.dev
```

por la dirección real del worker. Publica el cambio y el panel queda vivo.

---

## Cómo probar que quedó bien

1. Entra a `.../pagina-web-majushoes/admin/` **desde el celular**, que es
   donde lo va a usar la tienda.
2. Loguéate con la cuenta del paso 1.
3. Cambia el precio de un zapato cualquiera y guarda.
4. Abre la página normal: el precio nuevo debe aparecer en menos de un
   minuto, sin borrar caché.
5. Devuelve el precio como estaba.

Si algo sale mal, todo queda en el historial del repositorio y se devuelve.

## Lo que ya está resuelto

- **Las fotos se optimizan solas.** Una foto de 3 MB del celular queda en unos
  300 KB, enderezada y sin la ubicación GPS. Lo hace
  `.github/workflows/optimizar-fotos.yml` después de guardar.
- **Las tallas no se preguntan.** Salen del género: Hombre 38–44, Dama 35–40,
  Unisex 35–44.
- **El orden no importa.** La página agrupa por marca sola, así que un
  producto nuevo puede caer al final del archivo sin problema.
- **El id se rellena solo** con el nombre de la foto, para que la tienda no
  tenga que inventarse uno.
- **La página aguanta lo que escriba el panel.** Un formulario web guarda los
  números como texto; `normalizar()` en `js/app.js` lo corrige al cargar.

## Un aviso

La tienda va a poder dañar el catálogo: subir la foto equivocada, dejar dos
zapatos marcados para la portada, borrar algo sin querer. Es normal.

Como todo queda en git, cualquier cosa se devuelve en un minuto. Vale la pena
avisarle que eso tiene arreglo, para que no le dé miedo usar el panel.
