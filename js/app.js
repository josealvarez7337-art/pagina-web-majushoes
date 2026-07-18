/* ============================================================
   MAJU SHOES — Lógica de la página
   Catálogo con filtros y buscador, carrito con tallas guardado
   en el navegador, y pedido por WhatsApp (provisional).
   ============================================================ */

document.documentElement.classList.add('js');

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

  /* Etiqueta flotante del hero: usa el primer producto del catálogo */
  var heroTag = document.getElementById('heroTag');
  if (heroTag && PRODUCTS.length) {
    heroTag.textContent = PRODUCTS[0].name + ' — ' + formatPrice(PRODUCTS[0].price);
  }

  /* Imagen del hero: si el primer producto tiene foto real, reemplaza
     el dibujo de muestra por esa foto */
  var heroArt = document.querySelector('.hero-art');
  if (heroArt && PRODUCTS.length && PRODUCTS[0].image) {
    var heroSvg = heroArt.querySelector('svg');
    if (heroSvg) {
      var heroImg = document.createElement('img');
      heroImg.src = PRODUCTS[0].image;
      heroImg.alt = PRODUCTS[0].name;
      heroImg.className = 'hero-photo';
      heroSvg.replaceWith(heroImg);
      heroArt.classList.add('has-photo');
    }
  }
})();

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
    var haystack = (p.name + ' ' + CATEGORIES[p.category] + ' ' + p.gender).toLowerCase();
    var matchTerm = !term || haystack.indexOf(term) !== -1;
    return matchesFilter(p) && matchTerm;
  });

  grid.innerHTML = '';

  if (!visible.length) {
    grid.innerHTML =
      '<div class="no-results"><b>Sin resultados</b>' +
      'No encontramos referencias con esa búsqueda. Intenta con otra palabra o revisa todas las categorías.</div>';
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
        '<p class="cat">' + CATEGORIES[p.category] + ' · ' + p.gender + '</p>' +
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

renderChips();
renderCatalog();

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
  document.getElementById('pmCategory').textContent = CATEGORIES[p.category];
  document.getElementById('pmName').textContent = p.name;
  document.getElementById('pmGender').textContent = p.gender;
  document.getElementById('pmPrice').textContent = formatPrice(p.price);

  var hint = document.getElementById('pmHint');
  hint.textContent = 'Selecciona una talla para continuar.';
  hint.classList.remove('error');

  var sizesWrap = document.getElementById('pmSizes');
  sizesWrap.innerHTML = '';
  p.sizes.forEach(function (s) {
    var b = document.createElement('button');
    b.className = 'size-btn';
    b.textContent = s;
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
  cart = cart.filter(function (it) { return getProduct(it.id); });
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
        '<p class="meta">Talla ' + it.size + ' · ' + CATEGORIES[p.category] + '</p>' +
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
