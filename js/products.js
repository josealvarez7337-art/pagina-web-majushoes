/* ============================================================
   CATÁLOGO DE PRODUCTOS — Maju Shoes
   ------------------------------------------------------------
   DATOS DE MUESTRA: reemplaza nombres, precios y tallas por
   los reales de la tienda. Cada producto es un objeto:

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
    price: 140000,
    sizes: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    tag: "Nuevo",
    art: "runner",
    image: "img/nike-dn.jpeg",
  },
  {
    id: "maju-runner",
    name: "Maju Runner",
    category: "tenis",
    gender: "Unisex",
    price: 259000,
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    tag: "Nuevo",
    art: "runner",
    image: "",
  },
  {
    id: "bota-urbana",
    name: "Bota Urbana",
    category: "botas",
    gender: "Hombre",
    price: 329000,
    sizes: [38, 39, 40, 41, 42, 43],
    tag: "",
    art: "boot",
    image: "",
  },
  {
    id: "clasico-blanco",
    name: "Clásico Blanco",
    category: "tenis",
    gender: "Mujer",
    price: 239000,
    sizes: [35, 36, 37, 38],
    tag: "Últimas tallas",
    art: "classic",
    image: "",
  },
  {
    id: "slip-on-rojo",
    name: "Slip-On Rojo",
    category: "casual",
    gender: "Unisex",
    price: 199000,
    sizes: [36, 37, 38, 39, 40, 41, 42],
    tag: "",
    art: "slipon",
    image: "",
  },
  {
    id: "maju-street",
    name: "Maju Street",
    category: "tenis",
    gender: "Hombre",
    price: 269000,
    sizes: [39, 40, 41, 42, 43],
    tag: "Nuevo",
    art: "runner",
    image: "",
  },
  {
    id: "bota-trekking",
    name: "Bota Trekking",
    category: "botas",
    gender: "Unisex",
    price: 359000,
    sizes: [37, 38, 39, 40, 41, 42, 43],
    tag: "",
    art: "boot",
    image: "",
  },
  {
    id: "casual-cuero-cafe",
    name: "Casual Cuero Café",
    category: "casual",
    gender: "Hombre",
    price: 289000,
    sizes: [39, 40, 41, 42, 43],
    tag: "",
    art: "classic",
    image: "",
  },
  {
    id: "tenis-chunky",
    name: "Tenis Chunky",
    category: "tenis",
    gender: "Mujer",
    price: 279000,
    sizes: [35, 36, 37, 38, 39, 40],
    tag: "Nuevo",
    art: "runner",
    image: "",
  },
  {
    id: "mocasin-clasico",
    name: "Mocasín Clásico",
    category: "casual",
    gender: "Hombre",
    price: 249000,
    sizes: [39, 40, 41, 42, 43],
    tag: "",
    art: "slipon",
    image: "",
  },
  {
    id: "bota-alta-negra",
    name: "Bota Alta Negra",
    category: "botas",
    gender: "Mujer",
    price: 349000,
    sizes: [35, 36, 37, 38, 39],
    tag: "",
    art: "boot",
    image: "",
  },
  {
    id: "maju-court",
    name: "Maju Court",
    category: "tenis",
    gender: "Unisex",
    price: 229000,
    sizes: [36, 37, 38, 39, 40, 41, 42],
    tag: "",
    art: "classic",
    image: "",
  },
  {
    id: "sandalia-urbana",
    name: "Sandalia Urbana",
    category: "casual",
    gender: "Mujer",
    price: 159000,
    sizes: [35, 36, 37, 38],
    tag: "Últimas tallas",
    art: "slipon",
    image: "",
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
