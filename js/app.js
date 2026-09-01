/* ============================================================
   MAJU SHOES — Lógica de la página
   Catálogo con filtros y buscador, carrito con tallas guardado
   en el navegador, y pedido por WhatsApp (provisional).
   ============================================================ */

document.documentElement.classList.add('js');

/* El catálogo se carga de data/products.json al abrir la página.
   Arranca vacío y se llena en cargarCatalogo(), al final del archivo. */
var PRODUCTS = [];

/* Orden de las marcas en la página. Los productos se agrupan por
   marca al mostrarlos, así que no importa en qué orden los cargue
   la tienda. Una marca que no esté en esta lista va al final. */
var ORDEN_MARCAS = [
  'Nike', 'Jordan', 'Puma', 'Skechers', 'Adidas', 'Bape',
  'Calvin Klein', 'New Balance', 'Michael Kors', 'Clemont',
  'Coach', 'Boss', 'Oakley', 'Off White', 'Creative',
];

/* Tallas por género. La tienda maneja un solo rango por género, así
   que no se guardan en cada producto: salen de aquí. Si alguna
   referencia llegara a necesitar otras, se le pone su propio
   arreglo "sizes" en el JSON y ese manda. */
var TALLAS = {
  Hombre: [38, 39, 40, 41, 42, 43, 44],
  Mujer: [35, 36, 37, 38, 39, 40],
  Unisex: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
};

function sizesOf(p) {
  return p.sizes || TALLAS[p.gender] || [];
}

/* Deja cada producto del JSON en la forma que espera la página.

   Hace falta porque el panel de la tienda escribe ese archivo, y un
   formulario web guarda las tallas agotadas y el precio como texto ("38")
   en vez de número (38). Sin esto, una talla agotada no se vería tachada.
   También rellena el id cuando falta, sacándolo del nombre de la foto, para
   que la tienda no tenga que inventarse uno al cargar un producto. */
function normalizar(p) {
  var id = p.id;
  if (!id) {
    var base = (p.image || p.name || '').split('/').pop();
    id = base.replace(/\.[a-z0-9]+$/i, '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  return {
    id: id,
    name: p.name || '',
    brand: p.brand || '',
    gender: p.gender || 'Unisex',
    price: Number(p.price) || 0,
    sizes: Array.isArray(p.sizes) && p.sizes.length ? p.sizes.map(Number) : null,
    soldOut: Array.isArray(p.soldOut) ? p.soldOut.map(Number) : [],
    tag: p.tag || '',
    art: p.art || 'classic',
    image: p.image || '',
    hero: !!p.hero,
  };
}

/* Filtros del catálogo */
var FILTERS = {
  todos: 'Todos',
  hombre: 'Hombre',
  mujer: 'Mujer',
};

/* ---------- Utilidades ---------- */

function formatPrice(n) {
  return '$' + n.toLocaleString('es-CO');
}

/* Dibujos de muestra para productos sin foto (campo image vacío) */
const ART = {
  runner: '<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 64 C10 52, 18 44, 30 41 L58 33 C68 30, 74 22, 78 13 C81 7, 89 6, 93 11 L100 20 C112 23, 112 40, 112 52 L112 64 C112 68, 109 71, 105 71 L15 71 C12 71, 10 68, 10 64 Z"/><path d="M30 41 L30 58" stroke-dasharray="2.5 4"/><path d="M46 36 L48 55" stroke-dasharray="2.5 4"/></svg>',
  boot: '<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 66 C8 54, 20 48, 34 47 L70 44 C82 43, 90 36, 96 26 C99 20, 107 20, 110 26 L114 34 C116 46, 114 56, 114 66 C114 69, 111 72, 107 72 L13 72 C10 72, 8 69, 8 66 Z"/><path d="M34 47 L36 64" stroke-dasharray="2.5 4"/><path d="M52 45 L54 66" stroke-dasharray="2.5 4"/><path d="M70 44 L72 66" stroke-dasharray="2.5 4"/></svg>',
  classic: '<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 62 C10 48, 24 42, 38 42 L64 42 C78 42, 84 32, 90 22 C93 16, 101 17, 104 23 L109 34 C114 40, 114 52, 114 62 C114 67, 110 70, 106 70 L16 70 C12 70, 10 66, 10 62 Z"/><path d="M38 42 L38 60" stroke-dasharray="2.5 4"/><path d="M52 42 L52 60" stroke-dasharray="2.5 4"/><path d="M66 42 L66 60" stroke-dasharray="2.5 4"/></svg>',
  slipon: '<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 63 C9 50, 22 45, 35 45 L60 41 C72 39, 80 30, 86 20 C89 14, 97 15, 100 21 L105 32 C112 37, 113 50, 113 63 C113 67, 109 70, 105 70 L15 70 C11 70, 9 67, 9 63 Z"/><path d="M35 45 L36 62" stroke-dasharray="2.5 4"/><path d="M50 43 L51 62" stroke-dasharray="2.5 4"/></svg>',
};

function productMediaHTML(p) {
  if (p.image) {
    return '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">';
  }
  return ART[p.art] || ART.classic;
}

function getProduct(id) {
  return PRODUCTS.find(function (p) { return p.id === id; });
}

/* Una talla está agotada si aparece en el campo soldOut del producto */
function isSoldOut(p, size) {
  return !!p.soldOut && p.soldOut.indexOf(size) !== -1;
}

/* ---------- Enlaces de contacto (desde js/config.js) ---------- */

(function applyConfig() {
  var waLink = 'https://wa.me/' + CONFIG.whatsappNumber;
  var waHola = waLink + '?text=' + encodeURIComponent('Hola ' + CONFIG.storeName + ' 👋, tengo una pregunta.');

  var el;
  if ((el = document.getElementById('contactAddress'))) { el.href = CONFIG.mapsUrl; el.textContent = CONFIG.address; }
  if ((el = document.getElementById('footAddress'))) { el.href = CONFIG.mapsUrl; el.textContent = CONFIG.address; }
  if ((el = document.getElementById('contactPhone'))) { el.href = waHola; el.target = '_blank'; el.textContent = CONFIG.whatsappDisplay; }
  if ((el = document.getElementById('footWhatsapp'))) { el.href = waHola; el.textContent = 'WhatsApp: ' + CONFIG.whatsappDisplay; }
  if ((el = document.getElementById('contactWaBtn'))) { el.href = waHola; }
  if ((el = document.getElementById('waFloat'))) { el.href = waHola; }

  if (CONFIG.instagram) {
    var igUrl = 'https://instagram.com/' + CONFIG.instagram;
    if ((el = document.getElementById('contactInstagram'))) {
      el.outerHTML = '<a id="contactInstagram" href="' + igUrl + '" target="_blank" rel="noopener">@' + CONFIG.instagram + '</a>';
    }
    if ((el = document.getElementById('footInstagram'))) {
      el.outerHTML = '<a id="footInstagram" href="' + igUrl + '" target="_blank" rel="noopener">Instagram: @' + CONFIG.instagram + '</a>';
    }
  }

})();

/* ---------- Hero ----------
   El producto de la portada es el que tenga hero: true en el JSON.
   Si ninguno lo tiene, se usa el primero para no dejar el hueco. */

function applyHero() {
  var p = PRODUCTS.find(function (x) { return x.hero; }) || PRODUCTS[0];
  if (!p) return;

  var heroTag = document.getElementById('heroTag');
  if (heroTag) {
    heroTag.textContent = p.name + ' — ' + formatPrice(p.price);
  }

  var heroArt = document.querySelector('.hero-art');
  if (heroArt && p.image) {
    var heroSvg = heroArt.querySelector('svg');
    if (heroSvg) {
      var heroImg = document.createElement('img');
      heroImg.src = p.image;
      heroImg.alt = p.name;
      heroImg.className = 'hero-photo';
      heroSvg.replaceWith(heroImg);
      heroArt.classList.add('has-photo');
    }
  }
}

/* ---------- Aviso flotante (toast) ---------- */

function showToast(msg) {
  var toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { toast.classList.remove('show'); }, 2000);
}

/* ---------- Catálogo: filtros, buscador y grilla ---------- */

var activeFilter = 'todos';
var searchTerm = '';
var grid = document.getElementById('productGrid');

function renderChips() {
  var wrap = document.getElementById('categoryChips');
  wrap.innerHTML = '';
  Object.keys(FILTERS).forEach(function (key) {
    var b = document.createElement('button');
    b.className = 'chip' + (key === activeFilter ? ' active' : '');
    b.textContent = FILTERS[key];
    b.addEventListener('click', function () {
      activeFilter = key;
      renderChips();
      renderCatalog();
    });
    wrap.appendChild(b);
  });
}

/* Los productos Unisex aparecen tanto en "Hombre" como en "Mujer" */
function matchesFilter(p) {
  if (activeFilter === 'todos') return true;
  return p.gender.toLowerCase() === activeFilter || p.gender === 'Unisex';
}

function renderCatalog() {
  var term = searchTerm.trim().toLowerCase();
  var visible = PRODUCTS.filter(function (p) {
    var haystack = (p.name + ' ' + p.brand + ' ' + p.gender).toLowerCase();
    var matchTerm = !term || haystack.indexOf(term) !== -1;
    return matchesFilter(p) && matchTerm;
  });

  /* Los de una misma marca van juntos, en el orden de ORDEN_MARCAS.
     Dentro de cada marca se respeta el orden del JSON. */
  visible = visible
    .map(function (p, i) { return { p: p, i: i }; })
    .sort(function (a, b) {
      var ma = ORDEN_MARCAS.indexOf(a.p.brand);
      var mb = ORDEN_MARCAS.indexOf(b.p.brand);
      if (ma === -1) ma = ORDEN_MARCAS.length;
      if (mb === -1) mb = ORDEN_MARCAS.length;
      return ma - mb || a.i - b.i;
    })
    .map(function (x) { return x.p; });

  grid.innerHTML = '';

  if (!visible.length) {
    grid.innerHTML =
      '<div class="no-results"><b>Sin resultados</b>' +
      'No encontramos referencias con esa búsqueda. Intenta con otra palabra o revisa todo el catálogo.</div>';
    return;
  }

  visible.forEach(function (p, i) {
    var card = document.createElement('article');
    card.className = 'card';
    card.style.animationDelay = (i % 4) * 0.06 + 's';
    card.innerHTML =
      '<div class="card-media">' +
        (p.tag ? '<span class="card-tag">' + p.tag + '</span>' : '') +
        productMediaHTML(p) +
      '</div>' +
      '<div class="card-body">' +
        '<h3>' + p.name + '</h3>' +
        '<p class="cat">' + p.gender + '</p>' +
        '<div class="card-foot">' +
          '<span class="price">' + formatPrice(p.price) + '</span>' +
          '<button class="add-btn" aria-label="Elegir talla de ' + p.name + '">+</button>' +
        '</div>' +
      '</div>';

    card.addEventListener('click', function () { openProductModal(p.id); });

    /* Efecto 3D al mover el mouse */
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });

    grid.appendChild(card);
  });
}

document.getElementById('searchInput').addEventListener('input', function (e) {
  searchTerm = e.target.value;
  renderCatalog();
});

document.getElementById('searchBtn').addEventListener('click', function () {
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  setTimeout(function () { document.getElementById('searchInput').focus({ preventScroll: true }); }, 450);
});

/* ---------- Carga del catálogo ----------
   El catálogo vive en data/products.json, aparte del código, para que
   la tienda pueda editarlo sin tocar JavaScript. Se pide con
   cache: 'no-cache' para que el navegador siempre revalide: por eso
   los cambios de productos ya no necesitan subir el ?v= del index. */

function cargarCatalogo() {
  grid.innerHTML = '<div class="no-results">Cargando el catálogo…</div>';

  return fetch('data/products.json', { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      PRODUCTS = ((data && data.products) || []).map(normalizar);
      renderChips();
      renderCatalog();
      applyHero();
    })
    .catch(function (err) {
      console.error('No se pudo cargar data/products.json:', err);
      grid.innerHTML =
        '<div class="no-results"><b>No pudimos cargar el catálogo</b>' +
        'Revisa tu conexión e intenta de nuevo en un momento.</div>';
    });
}

cargarCatalogo();

/* ---------- Capa oscura, modales y panel del carrito ---------- */

var overlay = document.getElementById('overlay');
var cartDrawer = document.getElementById('cartDrawer');
var productModal = document.getElementById('productModal');
var sizeGuideModal = document.getElementById('sizeGuideModal');
var mobileMenu = document.getElementById('mobileMenu');

function refreshOverlay() {
  var anyOpen = cartDrawer.classList.contains('open') ||
    productModal.classList.contains('open') ||
    sizeGuideModal.classList.contains('open');
  overlay.classList.toggle('show', anyOpen);
  document.body.classList.toggle('no-scroll', anyOpen);
}

function closeTopmost() {
  if (sizeGuideModal.classList.contains('open')) { toggleModal(sizeGuideModal, false); return; }
  if (productModal.classList.contains('open')) { toggleModal(productModal, false); return; }
  if (cartDrawer.classList.contains('open')) { toggleCart(false); return; }
  if (mobileMenu.classList.contains('open')) { toggleMobileMenu(false); }
}

function toggleModal(modal, open) {
  modal.classList.toggle('open', open);
  modal.setAttribute('aria-hidden', String(!open));
  refreshOverlay();
}

overlay.addEventListener('click', closeTopmost);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeTopmost();
});
document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
  btn.addEventListener('click', function () { toggleModal(btn.closest('.modal'), false); });
});
document.querySelectorAll('[data-open-size-guide]').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleModal(sizeGuideModal, true);
  });
});

/* ---------- Ventana de producto (selección de talla) ---------- */

var selectedSize = null;
var modalProductId = null;

function openProductModal(id) {
  var p = getProduct(id);
  if (!p) return;
  modalProductId = id;
  selectedSize = null;

  document.getElementById('pmMedia').innerHTML =
    (p.tag ? '<span class="card-tag">' + p.tag + '</span>' : '') + productMediaHTML(p);
  document.getElementById('pmName').textContent = p.name;
  document.getElementById('pmGender').textContent = p.gender;
  document.getElementById('pmPrice').textContent = formatPrice(p.price);

  var addBtn = document.getElementById('pmAddBtn');
  var hayTallas = sizesOf(p).some(function (s) { return !isSoldOut(p, s); });
  addBtn.disabled = !hayTallas;

  var hint = document.getElementById('pmHint');
  hint.textContent = hayTallas
    ? 'Selecciona una talla para continuar.'
    : 'Agotado por el momento. Escríbenos por WhatsApp y te avisamos cuando llegue.';
  hint.classList.remove('error');

  var sizesWrap = document.getElementById('pmSizes');
  sizesWrap.innerHTML = '';
  sizesOf(p).forEach(function (s) {
    var b = document.createElement('button');
    var agotada = isSoldOut(p, s);
    b.className = 'size-btn' + (agotada ? ' sold-out' : '');
    b.textContent = s;
    if (agotada) {
      b.disabled = true;
      b.title = 'Talla ' + s + ' agotada';
      b.setAttribute('aria-label', 'Talla ' + s + ' agotada');
      sizesWrap.appendChild(b);
      return;
    }
    b.addEventListener('click', function () {
      selectedSize = s;
      sizesWrap.querySelectorAll('.size-btn').forEach(function (x) { x.classList.remove('selected'); });
      b.classList.add('selected');
      hint.textContent = 'Talla ' + s + ' seleccionada.';
      hint.classList.remove('error');
    });
    sizesWrap.appendChild(b);
  });

  toggleModal(productModal, true);
}

document.getElementById('pmAddBtn').addEventListener('click', function () {
  if (!modalProductId) return;
  if (selectedSize === null) {
    var hint = document.getElementById('pmHint');
    hint.textContent = 'Elige una talla antes de agregar al carrito.';
    hint.classList.add('error');
    return;
  }
  addToCart(modalProductId, selectedSize);
  flyToCart(this);
  toggleModal(productModal, false);
});

/* ---------- Carrito (guardado en el navegador) ---------- */

var CART_KEY = 'majushoes_cart_v1';
var cart = [];
try {
  cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  if (!Array.isArray(cart)) cart = [];
  /* Descarta lo que ya no existe o quedó agotado desde la última visita */
  cart = cart.filter(function (it) {
    var p = getProduct(it.id);
    return p && sizesOf(p).indexOf(it.size) !== -1 && !isSoldOut(p, it.size);
  });
} catch (e) { cart = []; }

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* modo privado */ }
}

function cartTotalCount() {
  return cart.reduce(function (n, it) { return n + it.qty; }, 0);
}

function cartTotalPrice() {
  return cart.reduce(function (n, it) { return n + getProduct(it.id).price * it.qty; }, 0);
}

function addToCart(id, size) {
  var found = cart.find(function (it) { return it.id === id && it.size === size; });
  if (found) { found.qty += 1; } else { cart.push({ id: id, size: size, qty: 1 }); }
  saveCart();
  renderCart();
  updateCartBadge(true);
  var p = getProduct(id);
  setTimeout(function () { showToast(p.name + ' (talla ' + size + ') agregado al carrito'); }, 400);
}

function changeQty(index, delta) {
  var it = cart[index];
  if (!it) return;
  it.qty += delta;
  if (it.qty < 1) it.qty = 1;
  saveCart();
  renderCart();
  updateCartBadge(false);
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartBadge(false);
}

function updateCartBadge(animate) {
  var badge = document.getElementById('cartCount');
  var icon = document.getElementById('cartIcon');
  var n = cartTotalCount();
  badge.textContent = n;
  badge.classList.toggle('hidden', n === 0);
  if (animate && n > 0) {
    badge.classList.remove('bump');
    icon.classList.remove('shake');
    void badge.offsetWidth;
    badge.classList.add('bump');
    icon.classList.add('shake');
  }
}

function renderCart() {
  var wrap = document.getElementById('cartItems');
  var totalEl = document.getElementById('cartTotal');
  var checkoutBtn = document.getElementById('checkoutBtn');

  if (!cart.length) {
    wrap.innerHTML =
      '<div class="cart-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4h2.2l2.5 11.2h11l2.3-7.7H6"/><circle cx="9.5" cy="19.5" r="1.6"/><circle cx="16.5" cy="19.5" r="1.6"/></svg>' +
        '<b>Tu carrito está vacío</b>' +
        'Explora el catálogo y agrega tus referencias favoritas.' +
      '</div>';
    totalEl.textContent = formatPrice(0);
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  wrap.innerHTML = '';
  cart.forEach(function (it, i) {
    var p = getProduct(it.id);
    var item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML =
      '<div class="cart-item-media">' + productMediaHTML(p) + '</div>' +
      '<div class="cart-item-info">' +
        '<h4>' + p.name + '</h4>' +
        '<p class="meta">Talla ' + it.size + '</p>' +
        '<div class="cart-item-row">' +
          '<span class="qty-stepper">' +
            '<button data-minus aria-label="Restar una unidad">−</button>' +
            '<span>' + it.qty + '</span>' +
            '<button data-plus aria-label="Sumar una unidad">+</button>' +
          '</span>' +
          '<span class="price">' + formatPrice(p.price * it.qty) + '</span>' +
        '</div>' +
        '<button class="cart-item-remove" data-remove>Quitar</button>' +
      '</div>';
    item.querySelector('[data-minus]').addEventListener('click', function () { changeQty(i, -1); });
    item.querySelector('[data-plus]').addEventListener('click', function () { changeQty(i, 1); });
    item.querySelector('[data-remove]').addEventListener('click', function () { removeItem(i); });
    wrap.appendChild(item);
  });

  totalEl.textContent = formatPrice(cartTotalPrice());
}

function toggleCart(open) {
  cartDrawer.classList.toggle('open', open);
  cartDrawer.setAttribute('aria-hidden', String(!open));
  refreshOverlay();
}

document.getElementById('cartIcon').addEventListener('click', function () {
  renderCart();
  toggleCart(true);
});
document.getElementById('cartClose').addEventListener('click', function () { toggleCart(false); });

renderCart();
updateCartBadge(false);

/* ---------- Finalizar pedido ----------
   PROVISIONAL: el pedido se envía por WhatsApp con el detalle
   del carrito. Cuando se decida usar una pasarela de pagos en
   línea (Wompi, Mercado Pago, etc.), este es el único punto
   que hay que reemplazar: la función checkout().
   ------------------------------------------------------------ */

function buildOrderMessage() {
  var lines = ['Hola ' + CONFIG.storeName + ' 👋 Quiero hacer este pedido:', ''];
  cart.forEach(function (it) {
    var p = getProduct(it.id);
    lines.push('• ' + p.name + ' — Talla ' + it.size + ' x' + it.qty + ' — ' + formatPrice(p.price * it.qty));
    if (p.image) {
      /* WhatsApp no permite adjuntar fotos desde un enlace; se envía la
         dirección pública de la foto y WhatsApp la muestra como vista previa */
      lines.push('  Foto: ' + new URL(p.image, window.location.href).href);
    }
  });
  lines.push('');
  lines.push('Total: ' + formatPrice(cartTotalPrice()));
  lines.push('');
  lines.push('¿Me confirman disponibilidad, pago y entrega? Gracias.');
  return lines.join('\n');
}

function checkout() {
  if (!cart.length) {
    showToast('Tu carrito está vacío');
    return;
  }
  var url = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(buildOrderMessage());
  window.open(url, '_blank', 'noopener');
}

document.getElementById('checkoutBtn').addEventListener('click', checkout);

/* ---------- Punto volador al agregar al carrito ---------- */

function flyToCart(fromEl) {
  var cartIconEl = document.getElementById('cartIcon');
  var startRect = fromEl.getBoundingClientRect();
  var endRect = cartIconEl.getBoundingClientRect();
  var dot = document.createElement('div');
  dot.className = 'fly-dot';
  dot.style.left = (startRect.left + startRect.width / 2 - 7) + 'px';
  dot.style.top = (startRect.top + startRect.height / 2 - 7) + 'px';
  document.body.appendChild(dot);
  requestAnimationFrame(function () {
    dot.style.left = (endRect.left + endRect.width / 2 - 7) + 'px';
    dot.style.top = (endRect.top + endRect.height / 2 - 7) + 'px';
    dot.style.opacity = '0.2';
  });
  setTimeout(function () { dot.remove(); }, 650);
}

/* ---------- Menú móvil ---------- */

var hamburgerBtn = document.getElementById('hamburgerBtn');

function toggleMobileMenu(open) {
  mobileMenu.classList.toggle('open', open);
  hamburgerBtn.setAttribute('aria-expanded', String(open));
}

hamburgerBtn.addEventListener('click', function () {
  toggleMobileMenu(!mobileMenu.classList.contains('open'));
});
mobileMenu.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () { toggleMobileMenu(false); });
});

/* ---------- Preguntas frecuentes (acordeón) ---------- */

document.querySelectorAll('.faq-item').forEach(function (item) {
  var q = item.querySelector('.faq-q');
  var a = item.querySelector('.faq-a');
  q.addEventListener('click', function () {
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (other) {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = null;
      other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
      q.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ---------- Aparición al hacer scroll (con seguro anti-fallo) ---------- */

var revealEls = document.querySelectorAll('.reveal');
try {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { io.observe(el); });
} catch (e) {
  revealEls.forEach(function (el) { el.classList.add('is-visible'); });
}
setTimeout(function () {
  revealEls.forEach(function (el) { el.classList.add('is-visible'); });
}, 1400);

/* ---------- Barra de progreso + encabezado compacto ---------- */

var progressBar = document.getElementById('progressBar');
var headerEl = document.querySelector('header');
window.addEventListener('scroll', function () {
  var h = document.documentElement;
  var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
  headerEl.classList.toggle('scrolled', h.scrollTop > 40);
});

/* ---------- Contadores animados (sección Nosotros) ---------- */

var counters = document.querySelectorAll('[data-count]');
var countersStarted = false;
function runCounters() {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 900;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
var aboutSection = document.querySelector('.about');
if (aboutSection) {
  try {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounters(); cio.disconnect(); }
      });
    }, { threshold: 0.3 });
    cio.observe(aboutSection);
  } catch (e) { runCounters(); }
}
setTimeout(runCounters, 2200);

/* ---------- Paralaje del arte del hero ---------- */

var heroArt = document.querySelector('.hero-art');
if (heroArt) {
  document.querySelector('.hero').addEventListener('mousemove', function (e) {
    var r = heroArt.getBoundingClientRect();
    var x = (e.clientX - (r.left + r.width / 2)) / r.width;
    var y = (e.clientY - (r.top + r.height / 2)) / r.height;
    heroArt.style.transform = 'rotate(' + (x * 3) + 'deg) translate(' + (x * 10) + 'px, ' + (y * 10) + 'px)';
  });
}

/* ---------- Onda (ripple) en botones ---------- */

document.addEventListener('click', function (e) {
  var btn = e.target.closest('.btn');
  if (!btn) return;
  var r = btn.getBoundingClientRect();
  var ripple = document.createElement('span');
  var size = Math.max(r.width, r.height);
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(function () { ripple.remove(); }, 650);
});
