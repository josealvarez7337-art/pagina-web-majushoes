/* ============================================================
   CATÁLOGO DE PRODUCTOS — Maju Shoes
   ------------------------------------------------------------
   Para agregar un producto, copia un bloque y cambia los datos.
   Cada producto es un objeto:

   {
     id:       texto único, sin espacios (se usa para el carrito)
     name:     nombre que ve el cliente
     category: "tenis" | "botas" | "casual"   (etiqueta descriptiva)
     gender:   "Hombre" | "Mujer" | "Unisex"  (para los filtros;
               los Unisex aparecen al filtrar Hombre y también Mujer)
     price:    precio en pesos, SIN puntos (259000 = $259.000)
     sizes:    tallas disponibles
     tag:      etiqueta opcional ("Nuevo", "Últimas tallas", ...) o ""
     art:      dibujo de muestra: "runner" | "boot" | "classic" | "slipon"
     image:    RUTA A LA FOTO REAL, ej. "img/maju-runner.jpg".
               Mientras esté vacío ("") se muestra el dibujo de muestra.
   }
   ============================================================ */

const PRODUCTS = [
  {
    id: "nike-dn",
    name: "Nike DN",
    category: "tenis",
    gender: "Unisex",
    price: 175000,
    sizes: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    tag: "Nuevo",
    art: "runner",
    image: "img/nike-dn.jpeg",
  },
  {
    id: "puma-gv-special",
    name: "Puma GV Special",
    category: "tenis",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    tag: "Nuevo",
    art: "classic",
    image: "img/puma-gv-special.jpeg",
  },
  {
    id: "skechers-dlux",
    name: "Skechers D'Lux",
    category: "tenis",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    tag: "Nuevo",
    art: "runner",
    image: "img/skechers-dlux.jpeg",
  },
  {
    id: "adidas-bounce",
    name: "Adidas Bounce",
    category: "tenis",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    tag: "Nuevo",
    art: "runner",
    image: "img/adidas-bounce.jpeg",
  },
  {
    id: "bape",
    name: "Bape",
    category: "tenis",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    tag: "Nuevo",
    art: "classic",
    image: "img/bape.jpeg",
  },
  {
    id: "calvin-klein",
    name: "Calvin Klein",
    category: "tenis",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    tag: "Nuevo",
    art: "runner",
    image: "img/calvin-klein.jpeg",
  },
];

/* Etiquetas descriptivas de las categorías (se muestran en cada producto) */
const CATEGORIES = {
  tenis: "Tenis",
  botas: "Botas",
  casual: "Casual",
};

/* Filtros del catálogo */
const FILTERS = {
  todos: "Todos",
  hombre: "Hombre",
  mujer: "Mujer",
};
