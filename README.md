# Maju Shoes — Página web

Página web de la tienda de zapatos **Maju Shoes** (Medellín, Colombia). Es un sitio
estático: no necesita servidor ni base de datos, funciona con solo abrir `index.html`
o publicarla en GitHub Pages.

## Qué incluye

- **Catálogo** con filtros por categoría (Tenis, Botas, Casual) y buscador.
- **Carrito de compras** con selección de talla y cantidades. Se guarda en el
  navegador del cliente, así no se pierde si cierra la página.
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

### Agregar las fotos reales de los productos

1. Crea una carpeta `img/` y guarda ahí las fotos (idealmente cuadradas, mínimo 800×800).
2. En `js/products.js`, escribe la ruta en el campo `image` del producto,
   por ejemplo: `image: "img/maju-runner.jpg"`.
3. Mientras `image` esté vacío (`""`), se muestra un dibujo de muestra.

> **Nota:** los productos actuales son **datos de muestra**; reemplázalos por los
> reales antes de publicar la página a clientes.

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
