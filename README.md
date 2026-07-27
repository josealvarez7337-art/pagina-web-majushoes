# Maju Shoes — Página web

Página web de la tienda de zapatos **Maju Shoes** (Medellín, Colombia). Es un sitio
estático: no necesita servidor ni base de datos, funciona con solo abrir `index.html`
o publicarla en GitHub Pages.

## Qué incluye

- **Catálogo** con filtro por género (Todos, Hombre, Mujer) y buscador.
- **Carrito de compras** con selección de talla y cantidades. Se guarda en el
  navegador del cliente, así no se pierde si cierra la página.
- **Control de agotados**: las tallas sin existencias se muestran tachadas y no
  se pueden agregar al carrito.
- **Pedido por WhatsApp** (provisional): al finalizar el pedido se abre WhatsApp
  con el detalle del carrito ya escrito. Cuando se decida integrar una pasarela de
  pagos (Wompi, Mercado Pago, etc.), solo hay que reemplazar la función
  `checkout()` marcada en `js/app.js`.
- **Guía de tallas**, **preguntas frecuentes**, sección **Nosotros**, opciones de
  **envío** y datos de **contacto**.
- Diseño adaptable a celular, con menú móvil y botón flotante de WhatsApp.

## Cómo editar la información

| Qué quieres cambiar | Archivo |
|---|---|
| Productos, precios, tallas, fotos | `js/products.js` |
| WhatsApp, dirección, Instagram | `js/config.js` |
| Textos de las secciones (hero, nosotros, preguntas) | `index.html` |
| Colores y estilos | `css/styles.css` (variables al inicio) |

### Agregar un producto

1. Guarda la foto en la carpeta `img/` (idealmente cuadrada, mínimo 800×800).
2. En `js/products.js`, copia un bloque de producto y cambia los datos.
   Escribe la ruta de la foto en el campo `image`, por ejemplo:
   `image: "img/puma-gv-special.jpeg"`.
3. Ponlo **al lado de los productos de la misma marca**: el orden de la lista
   es el orden en que se ven en la página.
4. Mientras `image` esté vacío (`""`), se muestra un dibujo de muestra.

### Marcar una talla como agotada

No borres la talla de `sizes`. Agrégala al campo `soldOut` del producto:

```js
sizes:   [38, 39, 40, 41, 42, 43, 44],
soldOut: [38, 39, 41, 42, 43, 44],   // solo queda la 40
```

Así el cliente ve que la tienda sí maneja esa talla, pero le aparece tachada y
no la puede pedir. Cuando vuelva a llegar, se saca de `soldOut`.

## Cómo publicarla gratis con GitHub Pages

1. En GitHub, entra a **Settings → Pages** del repositorio.
2. En "Source" elige la rama principal (`main`) y la carpeta `/ (root)`.
3. Guarda: en unos minutos la página queda disponible en
   `https://<tu-usuario>.github.io/pagina-web-majushoes/`.

## Pagos en línea (pendiente de decisión)

El botón "Finalizar pedido" hoy genera el mensaje de WhatsApp. Si más adelante se
elige e-commerce completo con pagos en línea (PSE, Nequi, tarjeta), se necesita una
pasarela como **Wompi** o **Mercado Pago**; el punto exacto de integración está
comentado en `js/app.js`, en la sección "Finalizar pedido".
