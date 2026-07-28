/* ============================================================
   CATÁLOGO DE PRODUCTOS — Maju Shoes
   ------------------------------------------------------------
   ORDEN: los productos de la misma marca van juntos. Al agregar
   uno nuevo, ponlo al lado de los de su marca, no al final.
   El orden de esta lista es el orden en que se ven en la página.

   Para agregar un producto, copia un bloque y cambia los datos.
   Cada producto es un objeto:

   {
     id:       texto único, sin espacios (se usa para el carrito)
     name:     nombre que ve el cliente
     gender:   "Hombre" | "Mujer" | "Unisex"  (para los filtros;
               los Unisex aparecen al filtrar Hombre y también Mujer)
     price:    precio en pesos, SIN puntos (175000 = $175.000)
     sizes:    todas las tallas que maneja la referencia
     soldOut:  tallas agotadas por el momento. Se siguen mostrando,
               pero tachadas y sin poder agregarlas al carrito.
               Déjalo como [] cuando haya de todas las tallas.
     tag:      etiqueta ("Nuevo", "Últimas tallas", ...). Se deja
               vacía ("") salvo que la tienda pida ponerla.
     art:      dibujo de muestra: "runner" | "boot" | "classic" | "slipon"
     image:    RUTA A LA FOTO REAL, ej. "img/nike-dn.jpeg".
               Mientras esté vacío ("") se muestra el dibujo de muestra.
   }
   ============================================================ */

const PRODUCTS = [
  {
    id: "nike-dn",
    name: "Nike DN",
    gender: "Unisex",
    price: 175000,
    sizes: [38, 39, 40, 41, 42, 43, 44],
    soldOut: [38, 39, 41, 42, 43, 44],
    tag: "",
    art: "runner",
    image: "img/nike-dn.jpeg",
  },
  {
    id: "nike-tn-negro",
    name: "Nike TN",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/nike-tn-negro.jpeg",
  },
  {
    /* Misma referencia que el anterior, en otro color (blanco) */
    id: "nike-tn-blanco",
    name: "Nike TN",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/nike-tn-blanco.jpeg",
  },
  {
    id: "puma-gv-special",
    name: "Puma GV Special",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "classic",
    image: "img/puma-gv-special.jpeg",
  },
  {
    id: "skechers-dlux",
    name: "Skechers D'Lux",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/skechers-dlux.jpeg",
  },
  {
    /* Misma referencia que el anterior, en otro color (beige) */
    id: "skechers-dlux-beige",
    name: "Skechers D'Lux",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/skechers-dlux-beige.jpeg",
  },
  {
    id: "adidas-bounce",
    name: "Adidas Bounce",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/adidas-bounce.jpeg",
  },
  {
    id: "adidas-repetitor",
    name: "Adidas Repetitor",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/adidas-repetitor.jpeg",
  },
  {
    id: "adidas-terrex-blanco",
    name: "Adidas Terrex",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/adidas-terrex-blanco.jpeg",
  },
  {
    /* Misma referencia que el anterior, en otro color (beige) */
    id: "adidas-terrex-beige",
    name: "Adidas Terrex",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/adidas-terrex-beige.jpeg",
  },
  {
    /* Misma referencia, en negro con suela blanca */
    id: "adidas-terrex-negro",
    name: "Adidas Terrex",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/adidas-terrex-negro.jpeg",
  },
  {
    /* Misma referencia, en negro con suela gris y cordones naranjas */
    id: "adidas-terrex-gris",
    name: "Adidas Terrex",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/adidas-terrex-gris.jpeg",
  },
  {
    id: "bape",
    name: "Bape",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "classic",
    image: "img/bape.jpeg",
  },
  {
    id: "calvin-klein",
    name: "Calvin Klein",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/calvin-klein.jpeg",
  },
  {
    id: "new-balance-1906",
    name: "New Balance 1906",
    gender: "Hombre",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "runner",
    image: "img/new-balance-1906.jpeg",
  },
  {
    id: "michael-kors",
    name: "Michael Kors",
    gender: "Unisex",
    price: 175000,
    sizes: [40, 41, 42, 43, 44],
    soldOut: [],
    tag: "",
    art: "classic",
    image: "img/michael-kors.jpeg",
  },
];

/* Filtros del catálogo */
const FILTERS = {
  todos: "Todos",
  hombre: "Hombre",
  mujer: "Mujer",
};
