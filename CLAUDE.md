# Maju Shoes — notas para trabajar en este repositorio

Sitio estático (HTML/CSS/JS sin framework ni build). No hay dependencias
que instalar.

**Ojo al probarlo:** el catálogo se carga con `fetch`, así que abrir
`index.html` con doble clic ya no sirve — el navegador bloquea la
petición. Hay que levantar un servidor, por ejemplo `http-server -p 8099`
y entrar a `http://127.0.0.1:8099`.

| Qué se edita | Archivo |
|---|---|
| Productos, precios, fotos | `data/products.json` |
| WhatsApp, dirección, Instagram | `js/config.js` |
| Textos de las secciones | `index.html` |
| Estilos | `css/styles.css` |
| Tallas por género, orden de marcas | `js/app.js` (arriba del todo) |

## Cómo es un producto

```json
{
  "id": "nike-dn",            // único, sin espacios (lo usa el carrito)
  "name": "Nike DN",          // lo que ve la clienta
  "brand": "Nike",            // agrupa la grilla; ver ORDEN_MARCAS en app.js
  "gender": "Hombre",         // "Hombre" | "Mujer" | "Unisex"
  "price": 175000,            // sin puntos
  "soldOut": [38, 39],        // tallas agotadas; [] si hay de todas
  "tag": "",                  // "Nuevo", "Últimas tallas"… casi siempre ""
  "art": "runner",            // dibujo de muestra si no hay foto
  "image": "img/nike-dn.jpeg",
  "hero": true                // solo uno lo lleva: es el de la portada
}
```

Las **tallas no se guardan en el producto**: salen del género, según el
mapa `TALLAS` de `app.js`. Si alguna referencia llegara a necesitar otras,
se le pone su propio arreglo `sizes` y ese manda.

## Reglas del catálogo

Estas las pidió el dueño de la tienda. Respetarlas al agregar productos.

### 1. Tallas por género

Regla única para todo el catálogo:

| Género | Tallas |
|---|---|
| Hombre | 38 a 44 |
| Mujer | 35 a 40 |
| Unisex | 35 a 44 |

Al cambiar el género de un producto **cambian sus tallas solas**, porque
se derivan. No hay que tocar nada más.

### 2. La marca agrupa, no el orden del arreglo

La grilla agrupa por el campo `brand` siguiendo `ORDEN_MARCAS` de
`app.js`, así que **no importa en qué posición del JSON quede un producto
nuevo**. Dentro de una misma marca sí se respeta el orden del archivo.

Si entra una marca que no está en `ORDEN_MARCAS`, sus productos salen al
final de la grilla: hay que agregarla a esa lista.

### 3. La portada

El producto de la portada es el que tenga `"hero": true`. Solo uno debe
tenerlo. Si ninguno lo tiene, la página usa el primero del arreglo para no
dejar el hueco.

### 4. Nombres repetidos: preguntar, no corregir solo

Si dos productos parecen ser la misma referencia pero con el nombre escrito
distinto (mayúsculas, tildes, abreviaturas, "D'Lux" vs "Dlux"), **avisarle
al dueño y preguntarle cuál nombre queda**. No unificar por cuenta propia.

Ya preguntado y resuelto: **Nike TN y Nike Air Max Plus son referencias
distintas para la tienda**, aunque de fábrica sean el mismo modelo. Van
separadas y no hay que volver a proponer unirlas.

Al revés también: si una foto nueva es la misma de un producto que ya está
en el catálogo, avisar antes de agregarla en vez de crear una tarjeta
repetida.

Y ojo con lo que viene impreso en el zapato: la tienda vende réplicas, así
que el texto del costado no siempre es el modelo real. Ya pasó con "ZoomX",
que es el nombre de una espuma de Nike, y con "AlphaZoom Pro", que no
existe en el catálogo de Nike. Cuando el nombre salga de leer el zapato,
decirlo.

### 5. Etiquetas solo si las piden

El campo `tag` ("Nuevo", "Últimas tallas", ...) se deja vacío salvo que el
dueño lo pida explícitamente para ese producto.

### 6. Precio: preguntarlo en cada tanda

Hoy todo el catálogo está en `175000`, pero eso no es una regla fija. Al
empezar una tanda nueva hay que preguntar el precio; no asumir el anterior.

### 7. Unisex significa que sale en los tres filtros

Con `"gender": "Unisex"` la ficha aparece en **Todos, en Hombre y en
Mujer** a la vez, y la tarjeta muestra "Unisex" debajo del nombre.

No hay que duplicar el producto ni crear un filtro nuevo: la función
`matchesFilter()` de `app.js` ya trata los Unisex como parte de las dos
listas.

### 8. Tallas agotadas

No se quita la talla: se agrega al arreglo `soldOut` del producto. Así el
cliente ve que la tienda maneja esa talla, pero no puede comprarla. Si
todas quedan agotadas, la ficha deshabilita sola el botón de agregar al
carrito.

## Fotos

Van en `img/` con el nombre del producto en minúsculas y guiones
(`img/puma-gv-special.jpeg`), y se enlazan en el campo `image`. Si se
renombra un producto, se renombra también su foto para que sigan
coincidiendo.

## Subir el `?v=` al publicar

`index.html` enlaza el CSS y los dos JS con `?v=N`. **Cada vez que se
cambie `config.js`, `app.js` o `styles.css` hay que subir ese número en los
tres enlaces.**

**Agregar, quitar o editar productos ya no lo necesita**: el catálogo vive
en `data/products.json` y se pide con `cache: 'no-cache'`, así que el
navegador siempre trae la versión nueva.

## Antes de dar por terminado un cambio del catálogo

Levantar el servidor local y revisar que las tarjetas carguen, que ninguna
foto salga rota, y que el modal de tallas y el carrito funcionen.
