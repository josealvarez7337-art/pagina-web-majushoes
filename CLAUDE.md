# Maju Shoes — notas para trabajar en este repositorio

Sitio estático (HTML/CSS/JS sin framework ni build). Se prueba abriendo
`index.html`; no hay dependencias que instalar.

| Qué se edita | Archivo |
|---|---|
| Productos, precios, tallas, fotos | `js/products.js` |
| WhatsApp, dirección, Instagram | `js/config.js` |
| Textos de las secciones | `index.html` |
| Estilos | `css/styles.css` |

## Reglas del catálogo

Estas las pidió el dueño de la tienda. Respetarlas al agregar productos.

### 1. Agrupar por marca

Los productos de la misma marca o referencia van **juntos** en `PRODUCTS`.
Al agregar uno nuevo, se inserta al lado de sus hermanos de marca, no al
final de la lista.

Ojo: el orden del arreglo es el orden en que se ven en la página, y
`PRODUCTS[0]` además alimenta la foto y la etiqueta del hero. No reordenar
el catálogo completo sin avisar, porque cambia la foto principal del sitio.

### 2. Nombres repetidos: preguntar, no corregir solo

Si dos productos parecen ser la misma referencia pero con el nombre escrito
distinto (mayúsculas, tildes, abreviaturas, "D'Lux" vs "Dlux"), **avisarle
al dueño y preguntarle cuál nombre queda**. No unificar por cuenta propia.

Ya preguntado y resuelto: **Nike TN y Nike Air Max Plus son referencias
distintas para la tienda**, aunque de fábrica sean el mismo modelo. Van
separadas y no hay que volver a proponer unirlas.

Al revés también: si una foto nueva es la misma de un producto que ya está
en el catálogo, avisar antes de agregarla en vez de crear una tarjeta
repetida.

### 3. Etiquetas solo si las piden

El campo `tag` ("Nuevo", "Últimas tallas", ...) se deja vacío salvo que el
dueño lo pida explícitamente para ese producto.

### 4. Las tallas salen del género; el precio se pregunta

Regla del dueño (agosto de 2026): **el género decide el rango de tallas.**

| `gender` | `sizes` |
|---|---|
| `"Hombre"` | `[38, 39, 40, 41, 42, 43, 44]` |
| `"Mujer"` | `[35, 36, 37, 38, 39]` |
| `"Unisex"` | `[35, 36, 37, 38, 39, 40, 41, 42, 43, 44]` |

Esto ya no se pregunta por tanda: sabiendo el género, las tallas salen solas.
Todo el catálogo está aplicado a esta regla. Si el dueño pide un rango
distinto para un producto puntual, se le hace caso a él y ya; pero no se
cambia la tabla de arriba sin que lo pida.

**El precio sí sigue sin valor por defecto.** El dueño manda los zapatos por
tandas y cuando toda una tanda vale lo mismo lo dice una sola vez al principio
en vez de repetirlo producto por producto (la tanda de julio de 2026 fue toda
`175000`). Eso valía para esa tanda, no para siempre: al empezar una tanda
nueva hay que preguntarle género y precio, y no asumir los de la vez pasada.

### 5. Unisex significa que sale en los tres filtros

Cuando el dueño diga que un zapato es unisex, el producto va con
`gender: "Unisex"`. Con ese valor la ficha aparece en **Todos, en Hombre y
en Mujer** a la vez, y la tarjeta muestra "Unisex" debajo del nombre.

No hay que duplicar el producto ni crear un filtro nuevo: la función
`matchesFilter()` de `app.js` ya trata los Unisex como parte de las dos
listas.

### 6. Tallas agotadas

No se borran del arreglo `sizes`: se agregan al arreglo `soldOut` del
producto. Así el cliente ve que la tienda maneja esa talla, pero no puede
comprarla. Si todas quedan agotadas, la ficha deshabilita sola el botón de
agregar al carrito.

## Fotos

Van en `img/` con el nombre del producto en minúsculas y guiones
(`img/puma-gv-special.jpeg`), y se enlazan en el campo `image`.

## Subir el `?v=` al publicar

`index.html` enlaza el CSS y los tres JS con `?v=N`. **Cada vez que se cambie
`products.js`, `config.js`, `app.js` o `styles.css` hay que subir ese número
en los cuatro enlaces.** Si no, el navegador de quien ya visitó la página
reutiliza los archivos viejos y el dueño ve el catálogo anterior aunque
GitHub Pages ya haya publicado bien.

## Antes de dar por terminado un cambio del catálogo

Revisar en el navegador que las tarjetas carguen, que ninguna foto salga
rota y que el modal de tallas y el carrito funcionen.
