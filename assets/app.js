/* ============================================================
   МЕБЕЛЬ&ВРЕМЯ — app.js
   Логика: шапка/футер, каталог, карточка товара, корзина,
   избранное, поиск, формы, мобильное меню. Без бэкенда.
   ============================================================ */
(function () {
  'use strict';

  var P = window.MV_PRODUCTS || [];
  var CATS = window.MV_CATEGORIES || [];
  var BRANDS = window.MV_BRANDS || [];

  var CART_KEY = 'mv_cart';
  var FAV_KEY = 'mv_favorites';
  var PHONE_DISPLAY = '+7 (900) 000-00-00';
  var PHONE_TEL = 'tel:+79000000000';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function fmt(n) {
    return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  }
  function getProduct(id) {
    return P.find(function (x) { return x.id === id; });
  }
  function catBySlug(slug) {
    return CATS.find(function (c) { return c.slug === slug; });
  }
  function catName(slug) {
    var c = catBySlug(slug);
    return c ? c.name : '';
  }
  function priceLabel(p) {
    return fmt(p.price) + (p.unit ? ' /' + p.unit : '');
  }

  /* ---------- SVG icons ---------- */
  var ICONS = {
    search: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    cart: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 12.2A2 2 0 0 0 9.4 18h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.2"/><circle cx="17" cy="21" r="1.2"/></svg>',
    heart: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.7-9.3-9.2C1.4 8.3 3.5 5 6.9 5c2 0 3.4 1.1 4.1 2.4h2C13.7 6.1 15.1 5 17.1 5c3.4 0 5.5 3.3 4.2 6.3C19.5 15.8 12 20.5 12 20.5Z"/></svg>',
    phone: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6.1 6.1l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    burger: '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    arrow: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></svg>',
    sofa: '<path d="M150 300 v-40 a20 20 0 0 1 20-20 h260 a20 20 0 0 1 20 20 v40"/><rect x="150" y="300" width="300" height="42" rx="12"/><path d="M180 342 v24 M420 342 v24"/><path d="M175 268 h120 M305 268 h120"/>',
    chair: '<path d="M170 300 v-60 a25 25 0 0 1 25-25 h120 a25 25 0 0 1 25 25 v60"/><rect x="170" y="300" width="220" height="40" rx="10"/><path d="M200 340 v24 M360 340 v24"/><path d="M180 262 h140"/>',
    cabinet: '<rect x="180" y="160" width="240" height="180" rx="12"/><path d="M196 200 h208 M196 240 h208 M196 280 h208"/><circle cx="290" cy="200" r="4"/><circle cx="290" cy="240" r="4"/><circle cx="290" cy="280" r="4"/><path d="M212 340 v12 M388 340 v12"/>',
    bed: '<path d="M150 250 v-40 h220 a20 20 0 0 1 20 20 v110"/><rect x="150" y="250" width="300" height="90" rx="12"/><path d="M180 340 v24 M420 340 v24"/><path d="M210 250 h120"/>',
    mattress: '<rect x="150" y="292" width="300" height="42" rx="12"/><path d="M165 292 q45 -24 90 0 t90 0 t90 0"/><path d="M170 334 h260"/>',
    wardrobe: '<rect x="205" y="150" width="190" height="190" rx="12"/><path d="M300 150 v190 M217 172 h166 M217 318 h166"/><circle cx="287" cy="232" r="4"/><circle cx="313" cy="232" r="4"/>',
    mirror: '<rect x="230" y="160" width="140" height="180" rx="14"/><rect x="238" y="168" width="124" height="164" rx="10"/><path d="M270 200 l40 80"/>',
    bench: '<ellipse cx="300" cy="258" rx="150" ry="45"/><path d="M150 258 h300"/><path d="M200 340 v-30 M400 340 v-30"/><path d="M200 258 l60 32 M300 226 l60 32 M400 258 l-60 32"/>',
    'dining-table': '<rect x="150" y="235" width="300" height="14" rx="7"/><path d="M225 249 v91 M375 249 v91"/><rect x="96" y="295" width="40" height="14" rx="6"/><path d="M100 295 v-45 M104 309 v31 M128 309 v31"/><rect x="464" y="295" width="40" height="14" rx="6"/><path d="M500 295 v-45 M468 309 v31 M492 309 v31"/>',
    'coffee-table': '<rect x="170" y="260" width="260" height="14" rx="8"/><rect x="192" y="312" width="216" height="12" rx="6"/><path d="M178 274 v38 M422 274 v38 M180 312 v12 M420 312 v12"/>',
    panel: '<rect x="230" y="150" width="140" height="190" rx="12"/><circle cx="300" cy="245" r="34"/><circle cx="300" cy="245" r="22"/><path d="M252 245 a48 48 0 0 1 96 0"/>'
  };

  var catalogReset = null;

  var __uid = 0;
  function phSVG(opts) {
    opts = opts || {};
    var type = ICONS[opts.type] ? opts.type : 'sofa';
    var gradient = opts.gradient || 'g1';
    var label = opts.label || 'Мебель';
    __uid++;
    var uid = __uid;
    var stops = {
      g1: ['#E9E2D6', '#D8CDBB'],
      g2: ['#E7D3C3', '#CDAA8D'],
      g3: ['#DFE0D2', '#C3C6AF'],
      g4: ['#E4E1DA', '#C9C4BA']
    }[gradient];
    return '<svg class="ph" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(label) + '">' +
      '<defs>' +
      '<linearGradient id="ph-g' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + stops[0] + '"/><stop offset="1" stop-color="' + stops[1] + '"/>' +
      '</linearGradient>' +
      '<radialGradient id="ph-vig' + uid + '" cx="0.5" cy="0.42" r="0.75">' +
      '<stop offset="0.6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2A251E" stop-opacity="0.10"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<rect width="600" height="450" fill="url(#ph-g' + uid + ')"/>' +
      '<g fill="none" stroke="#4A443A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="translate(0,18)">' +
      ICONS[type] + '</g>' +
      '<rect width="600" height="450" fill="url(#ph-vig' + uid + ')"/>' +
      '</svg>';
  }

  /* ---------- localStorage ---------- */
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
  }
  function write(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  function getCart() { return read(CART_KEY); }
  function getFavs() { return read(FAV_KEY); }
  function cartCount() {
    return getCart().reduce(function (a, i) { return a + (i.qty || 1); }, 0);
  }
  function favCount() { return getFavs().length; }
  function inCart(id) {
    return getCart().some(function (i) { return i.id === id; });
  }
  function isFav(id) {
    return getFavs().indexOf(id) > -1;
  }
  function setCart(items) { write(CART_KEY, items); }
  function setFavs(items) { write(FAV_KEY, items); }

  /* ---------- chrome injection ---------- */
  function navItemLabel(item) { return item; }

  function buildDesktopNav() {
    var html = '<ul>';
    // ИНТЕРЬЕРЫ
    html += '<li class="nav-item"><a class="nav-link" href="index.html#interiors">Интерьеры</a></li>';
    CATS.forEach(function (c) {
      var dd = '<div class="nav-dropdown"><span class="dd-title">' + esc(c.name) + '</span>';
      c.subcategories.forEach(function (sub) {
        dd += '<a href="catalog.html?category=' + encodeURIComponent(c.slug) + '&sub=' + encodeURIComponent(sub) + '">' + esc(sub) + '</a>';
      });
      dd += '</div>';
      html += '<li class="nav-item"><a class="nav-link" href="catalog.html?category=' + encodeURIComponent(c.slug) + '">' + esc(c.name) + '</a>' + dd + '</li>';
    });
    html += '<li class="nav-item"><a class="nav-link is-promo" href="catalog.html?sale=1">Акции</a></li>';
    html += '<li class="nav-item"><a class="nav-link" href="contacts.html">Салоны</a></li>';
    html += '</ul>';
    return html;
  }

  function buildMobileNav() {
    var html = '<a class="big" href="index.html#interiors">Интерьеры</a>';
    CATS.forEach(function (c) {
      html += '<a class="big" href="catalog.html?category=' + encodeURIComponent(c.slug) + '">' + esc(c.name) + '</a>';
      c.subcategories.forEach(function (sub) {
        html += '<a class="sub" href="catalog.html?category=' + encodeURIComponent(c.slug) + '&sub=' + encodeURIComponent(sub) + '">' + esc(sub) + '</a>';
      });
    });
    html += '<a class="big" href="catalog.html?sale=1">Акции</a>';
    html += '<a class="big" href="contacts.html">Салоны</a>';
    return html;
  }

  function renderHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;
    el.innerHTML =
      '<div class="topbar"><div class="container">' +
      '<div class="topbar-left">' +
      '<span class="topbar-city">' + ICONS.pin + 'Москва</span>' +
      '<a href="contacts.html">Салоны</a>' +
      '<a href="catalog.html">Доставка</a>' +
      '</div>' +
      '<div class="topbar-right">' +
      '<a class="topbar-hotline" href="' + PHONE_TEL + '">' + ICONS.phone + 'Горячая линия ' + esc(PHONE_DISPLAY) + '</a>' +
      '</div>' +
      '</div></div>' +
      '<div class="mainbar"><div class="container">' +
      '<button class="icon-btn burger" type="button" data-burger aria-label="Открыть меню">' + ICONS.burger + '</button>' +
      '<a class="logo" href="index.html">МЕБЕЛЬ<span class="amp">&amp;</span>ВРЕМЯ<span class="logo-sub">Mebel&amp;Vremya</span></a>' +
      '<nav class="main-nav" aria-label="Главное меню">' + buildDesktopNav() + '</nav>' +
      '<div class="mainbar-right">' +
      '<div class="header-phone"><a href="' + PHONE_TEL + '">' + esc(PHONE_DISPLAY) + '</a><small>Ежедневно 9:00–21:00</small></div>' +
      '<button class="icon-btn" type="button" data-search aria-label="Поиск">' + ICONS.search + '</button>' +
      '<a class="icon-btn" href="favorites.html" aria-label="Избранное">' + ICONS.heart + '<span class="badge-count" data-fav-count></span></a>' +
      '<button class="icon-btn" type="button" data-cart aria-label="Корзина">' + ICONS.cart + '<span class="badge-count" data-cart-count></span></button>' +
      '</div>' +
      '</div></div>';
  }

  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var catLinks = CATS.map(function (c) {
      return '<li><a href="catalog.html?category=' + encodeURIComponent(c.slug) + '">' + esc(c.name) + '</a></li>';
    }).join('');
    el.innerHTML =
      '<div class="container"><div class="footer-grid">' +
      '<div>' +
      '<a class="logo footer-logo" href="index.html">МЕБЕЛЬ<span class="amp">&amp;</span>ВРЕМЯ</a>' +
      '<p style="color:var(--mv-graphite-400);font-size:14px;max-width:280px;">Премиальная мебель для гостиной и спальни. От дивана или кровати до готового интерьера.</p>' +
      '<div class="socials">' +
      '<a class="social" href="https://vk.com/mebelvremya" target="_blank" rel="noopener" aria-label="VK">VK</a>' +
      '<a class="social" href="https://t.me/mebelvremya" target="_blank" rel="noopener" aria-label="Telegram">TG</a>' +
      '<a class="social" href="https://youtube.com/@mebelvremya" target="_blank" rel="noopener" aria-label="YouTube">YT</a>' +
      '</div>' +
      '</div>' +
      '<div><h4>Каталог</h4><ul>' + catLinks + '</ul></div>' +
      '<div><h4>Покупателям</h4><ul>' +
      '<li><a href="catalog.html">Каталог</a></li>' +
      '<li><a href="catalog.html?sale=1">Акции</a></li>' +
      '<li><a href="favorites.html">Избранное</a></li>' +
      '<li><a href="contacts.html">Консультация</a></li>' +
      '<li><a href="contacts.html">Доставка и оплата</a></li>' +
      '</ul></div>' +
      '<div><h4>Контакты</h4>' +
      '<a class="footer-phone" href="' + PHONE_TEL + '">' + esc(PHONE_DISPLAY) + '<small>Ежедневно 9:00–21:00</small></a>' +
      '<p style="color:var(--mv-graphite-400);font-size:14px;margin-top:12px;">Москва, Пресненская наб., 12<br>Салон «МЕБЕЛЬ&amp;ВРЕМЯ»</p>' +
      '</div>' +
      '</div></div>' +
      '<div class="footer-bottom"><div class="container">' +
      '<span>© 2025 МЕБЕЛЬ&amp;ВРЕМЯ</span>' +
      '<a href="privacy.html">Политика конфиденциальности</a>' +
      '<span class="disclaimer">Вся информация на сайте носит информационный характер и не является публичной офертой. Цены уточняйте у менеджеров.</span>' +
      '</div></div>';
  }

  function injectChrome() {
    renderHeader();
    renderFooter();
    appendMobileMenu();
    appendCartDrawer();
    appendSearchPanel();
    appendModal();
    appendToast();
    document.body.classList.add('has-chrome');
  }

  function appendMobileMenu() {
    var d = document.createElement('div');
    d.className = 'mobile-menu';
    d.innerHTML =
      '<div class="mobile-menu__overlay" data-close-menu></div>' +
      '<div class="mobile-menu__panel">' +
      '<div class="mobile-menu__head"><span class="logo">МЕБЕЛЬ<span class="amp">&amp;</span>ВРЕМЯ</span>' +
      '<button class="icon-btn" type="button" data-close-menu aria-label="Закрыть меню">' + ICONS.close + '</button></div>' +
      buildMobileNav() +
      '</div>';
    document.body.appendChild(d);
  }

  function appendCartDrawer() {
    var d = document.createElement('div');
    d.className = 'drawer';
    d.id = 'cart-drawer';
    d.innerHTML =
      '<div class="drawer__overlay" data-close-cart></div>' +
      '<div class="drawer__panel">' +
      '<div class="drawer__head"><h3>Корзина</h3>' +
      '<button class="icon-btn" type="button" data-close-cart aria-label="Закрыть">' + ICONS.close + '</button></div>' +
      '<div class="drawer__body" data-cart-body></div>' +
      '<div class="drawer__foot" data-cart-foot></div>' +
      '</div>';
    document.body.appendChild(d);
  }

  function appendSearchPanel() {
    var d = document.createElement('div');
    d.className = 'search-panel';
    d.innerHTML =
      '<div class="search-panel__overlay" data-close-search></div>' +
      '<div class="search-panel__box">' +
      '<div class="search-panel__head">' + ICONS.search +
      '<input type="search" placeholder="Поиск по каталогу…" data-search-input autocomplete="off">' +
      '<button class="icon-btn" type="button" data-close-search aria-label="Закрыть">' + ICONS.close + '</button></div>' +
      '<div class="search-results" data-search-results></div>' +
      '</div>';
    document.body.appendChild(d);
  }

  function appendModal() {
    var d = document.createElement('div');
    d.className = 'modal';
    d.id = 'calc-modal';
    d.innerHTML =
      '<div class="modal__overlay" data-close-modal></div>' +
      '<div class="modal__panel">' +
      '<button class="modal__close" type="button" data-close-modal aria-label="Закрыть">' + ICONS.close + '</button>' +
      '<h3>Рассчитать стоимость</h3>' +
      '<form class="js-form calc-form" novalidate>' +
      '<div class="form-grid" style="grid-template-columns:1fr;">' +
      '<div class="field"><label for="cf-name">Имя</label><input type="text" id="cf-name" name="name" placeholder="Ваше имя" required></div>' +
      '<div class="field"><label for="cf-phone">Телефон</label><input type="tel" id="cf-phone" name="phone" placeholder="+7 (___) ___-__-__" required></div>' +
      '<div class="field"><label for="cf-comment">Комментарий</label><textarea id="cf-comment" name="comment" placeholder="Какой товар и размеры вас интересуют?"></textarea></div>' +
      '<label class="consent"><input type="checkbox" name="consent" required><span>Согласен(на) на <a href="privacy.html">обработку персональных данных</a></span><span class="error-msg"></span></label>' +
      '</div>' +
      '<button class="btn btn--primary btn--block" type="submit" style="margin-top:16px;">Отправить заявку</button>' +
      '<div class="form-success"><div class="check">' + ICONS.check + '</div><h3>Спасибо!</h3><p>Заявка отправлена. Менеджер свяжется с вами.</p></div>' +
      '</form>' +
      '</div>';
    document.body.appendChild(d);
  }

  function appendToast() {
    var t = document.createElement('div');
    t.className = 'toast';
    t.id = 'toast';
    document.body.appendChild(t);
  }
  function toast(msg, isError) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast' + (isError ? ' toast--error' : '');
    t.classList.add('is-visible');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- badges / counter ---------- */
  function badges(p) {
    if (!p.badge) return '';
    var cls = 'badge--new', txt = esc(p.badge);
    if (p.badge === 'Хит') { cls = 'badge--hit'; }
    else if (p.badge === 'Скидка') {
      cls = 'badge--sale';
      if (p.oldPrice) {
        var pct = Math.round((1 - p.price / p.oldPrice) * 100);
        txt = '−' + pct + '%';
      }
    }
    return '<div class="badges"><span class="badge ' + cls + '">' + txt + '</span></div>';
  }

  function updateBadges() {
    var cc = document.querySelectorAll('[data-cart-count]');
    var fc = document.querySelectorAll('[data-fav-count]');
    var c = cartCount(), f = favCount();
    cc.forEach(function (el) {
      el.textContent = c;
      el.classList.toggle('is-visible', c > 0);
    });
    fc.forEach(function (el) {
      el.textContent = f;
      el.classList.toggle('is-visible', f > 0);
    });
  }

  /* ---------- product card ---------- */
  function productCard(p) {
    var activeFav = isFav(p.id) ? ' is-active' : '';
    return '<article class="product-card" data-id="' + esc(p.id) + '">' +
      '<a class="media" href="product.html?id=' + encodeURIComponent(p.id) + '" aria-label="' + esc(p.name) + '">' +
      phSVG({ type: p.icon, gradient: p.gradient, label: p.name }) + badges(p) + '</a>' +
      '<button class="fav-btn' + activeFav + '" type="button" data-fav="' + esc(p.id) + '" aria-label="В избранное">' + ICONS.heart + '</button>' +
      '<div class="body">' +
      '<span class="cat">' + esc(p.subcategory || catName(p.category)) + '</span>' +
      '<a class="name" href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a>' +
      '<div class="price-row">' +
      (p.oldPrice ? '<span class="old">' + fmt(p.oldPrice) + '</span>' : '') +
      '<span class="price price--card">' + priceLabel(p) + '</span>' +
      '</div>' +
      '<button class="btn btn--primary btn--small btn--block" type="button" data-add="' + esc(p.id) + '">В корзину</button>' +
      '</div></article>';
  }

  function renderGrid(container, items) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = '<div class="empty-state">' +
        '<svg class="icon-big" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
        '<h3>Ничего не найдено</h3>' +
        '<p>Сбросьте фильтры или измените запрос.</p>' +
        '<button class="btn btn--primary" type="button" data-reset-filters>Сбросить фильтры</button>' +
        '</div>';
      return;
    }
    container.innerHTML = items.map(productCard).join('');
  }

  /* ---------- catalog ---------- */
  var catState = {
    category: '', sub: '', brand: '', collection: '', priceMin: '', priceMax: '',
    q: '', sort: 'default', sale: false, inStock: false
  };

  function parseParams() {
    var params = new URLSearchParams(window.location.search);
    catState.category = params.get('category') || '';
    catState.sub = params.get('sub') || '';
    catState.brand = params.get('brand') || '';
    catState.collection = params.get('collection') || '';
    catState.priceMin = params.get('priceMin') || '';
    catState.priceMax = params.get('priceMax') || '';
    catState.q = params.get('q') || '';
    catState.sort = params.get('sort') || 'default';
    catState.sale = params.get('sale') === '1';
    catState.inStock = params.get('stock') === '1';
  }

  function filteredProducts() {
    var s = catState;
    var q = s.q.trim().toLowerCase();
    return P.filter(function (p) {
      if (s.category && p.category !== s.category) return false;
      if (s.sub && s.sub !== 'Вся мебель' && p.subcategory !== s.sub) return false;
      if (s.brand && p.brand !== s.brand) return false;
      if (s.collection && p.collection !== s.collection) return false;
      if (s.sale && !p.oldPrice) return false;
      if (s.inStock && !p.inStock) return false;
      if (s.priceMin && p.price < Number(s.priceMin)) return false;
      if (s.priceMax && p.price > Number(s.priceMax)) return false;
      if (q) {
        var hay = (p.name + ' ' + catName(p.category) + ' ' + (p.subcategory || '') + ' ' + (p.description || []).join(' ')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) {
      if (s.sort === 'price-asc') return a.price - b.price;
      if (s.sort === 'price-desc') return b.price - a.price;
      if (s.sort === 'new') return (a.badge === 'Новинка' ? -1 : 0) - (b.badge === 'Новинка' ? -1 : 0);
      if (s.sort === 'name') return a.name.localeCompare(b.name, 'ru');
      return 0;
    });
  }

  function catOfCurrent() {
    return catBySlug(catState.category);
  }

  function buildFilterUI() {
    var cat = catOfCurrent();
    var wrap = document.getElementById('filters');
    if (!wrap) return;
    var subs = cat ? cat.subcategories : [];
    var chips = '<div class="chip-row">' +
      subs.map(function (s) {
        var active = catState.sub === s;
        return '<button class="chip' + (active ? ' chip--active' : '') + '" type="button" data-sub="' + esc(s) + '">' + esc(s) + '</button>';
      }).join('') +
      '</div>';

    var brandOpts = '<option value="">Все бренды</option>' + BRANDS.map(function (b) {
      return '<option value="' + esc(b) + '"' + (catState.brand === b ? ' selected' : '') + '>' + esc(b) + '</option>';
    }).join('');

    var collections = Array.from(new Set(P.map(function (p) { return p.collection; })));
    var collOpts = '<option value="">Все коллекции</option>' + collections.map(function (c) {
      return '<option value="' + esc(c) + '"' + (catState.collection === c ? ' selected' : '') + '>' + esc(c) + '</option>';
    }).join('');

    var catOpts = '<option value="">Все категории</option>' + CATS.map(function (c) {
      return '<option value="' + esc(c.slug) + '"' + (catState.category === c.slug ? ' selected' : '') + '>' + esc(c.name) + '</option>';
    }).join('');

    wrap.innerHTML =
      '<div class="filters-row">' +
      '<div class="filter-group" style="flex:1;min-width:100%;"><label>Категория</label>' +
      '<select class="filter-select" data-category>' + catOpts + '</select></div>' +
      (subs.length ? '<div class="filter-group" style="flex:1;min-width:100%;"><label>Подкатегория</label>' + chips + '</div>' : '') +
      '<div class="filter-group"><label>Бренд</label><select class="filter-select" data-brand>' + brandOpts + '</select></div>' +
      '<div class="filter-group"><label>Коллекция</label><select class="filter-select" data-collection>' + collOpts + '</select></div>' +
      '<div class="filter-group"><label>Цена</label><div class="price-range">' +
      '<input type="number" min="0" placeholder="от" data-price-min value="' + esc(catState.priceMin) + '">' +
      '<span class="dash">—</span>' +
      '<input type="number" min="0" placeholder="до" data-price-max value="' + esc(catState.priceMax) + '">' +
      '</div></div>' +
      '<div class="filter-group"><label>Наличие</label>' +
      '<select class="filter-select" data-stock><option value="">Любое</option><option value="1"' + (catState.inStock ? ' selected' : '') + '>В наличии</option></select></div>' +
      '<div class="filters-actions"><button class="btn btn--ghost" type="button" data-reset-filters>Сбросить фильтры</button></div>' +
      '</div>';
  }

  function initCatalog() {
    parseParams();
    buildFilterUI();
    var grid = document.getElementById('product-grid');
    var count = document.getElementById('count');
    var sort = document.getElementById('sort');
    var search = document.getElementById('catalog-search');
    var titles = document.querySelectorAll('[data-catalog-title]');
    var cat = catOfCurrent();
    var newTitle = cat ? cat.name : (catState.q ? 'Поиск' : 'Каталог мебели');
    titles.forEach(function (t) { t.textContent = newTitle; });
    var subEl = document.querySelector('[data-catalog-subtitle]');
    if (subEl) subEl.textContent = cat ? (cat.blurb || '') : 'Вся мебель премиум-сегмента для гостиной, спальни и столовой.';

    if (search) search.value = catState.q;

    function apply() {
      var items = filteredProducts();
      renderGrid(grid, items);
      if (count) count.textContent = 'Найдено: ' + items.length;
    }
    apply();

    // chips
    document.getElementById('filters').addEventListener('click', function (e) {
      var sub = e.target.closest('[data-sub]');
      if (sub) { catState.sub = sub.getAttribute('data-sub'); buildFilterUI(); apply(); return; }
    });
    // selects & inputs (delegated on filters + sort row + search)
    document.getElementById('filters').addEventListener('input', function (e) {
      var m = e.target.closest('[data-brand],[data-collection],[data-price-min],[data-price-max],[data-stock],[data-category]');
      if (!m) return;
      if (m.hasAttribute('data-brand')) catState.brand = m.value;
      else if (m.hasAttribute('data-collection')) catState.collection = m.value;
      else if (m.hasAttribute('data-price-min')) catState.priceMin = m.value;
      else if (m.hasAttribute('data-price-max')) catState.priceMax = m.value;
      else if (m.hasAttribute('data-stock')) catState.inStock = m.value === '1';
      else if (m.hasAttribute('data-category')) {
        catState.category = m.value;
        catState.sub = '';
        var t2 = catBySlug(catState.category);
        var nt = t2 ? t2.name : (catState.q ? 'Поиск' : 'Каталог мебели');
        document.querySelectorAll('[data-catalog-title]').forEach(function (el) { el.textContent = nt; });
        var subEl2 = document.querySelector('[data-catalog-subtitle]');
        if (subEl2) subEl2.textContent = t2 ? (t2.blurb || '') : 'Вся мебель премиум-сегмента для гостиной, спальни и столовой.';
        buildFilterUI();
      }
      apply();
    });

    if (sort) {
      sort.value = catState.sort;
      sort.addEventListener('change', function () { catState.sort = this.value; apply(); });
    }
    if (search) {
      search.addEventListener('input', function () { catState.q = this.value; apply(); });
    }
    var resetAll = function () {
      catState.sub = ''; catState.brand = ''; catState.collection = '';
      catState.priceMin = ''; catState.priceMax = ''; catState.q = '';
      catState.sale = false; catState.inStock = false; catState.sort = 'default';
      if (search) search.value = '';
      if (sort) sort.value = 'default';
      buildFilterUI(); apply();
      var url = new URL(window.location.href);
      if (url.searchParams.get('category')) return; // keep category
      url.search = '';
      history.replaceState(null, '', url);
    };
    catalogReset = resetAll;
    document.getElementById('filters').addEventListener('click', function (e) {
      if (e.target.closest('[data-reset-filters]')) { resetAll(); }
    });
    // page-level reset button in empty state uses delegation
  }

  /* ---------- product page ---------- */
  function initProduct() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var p = getProduct(id);
    var root = document.getElementById('product-root');
    if (!p) {
      if (root) root.innerHTML = '<div class="empty-state"><svg class="icon-big" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><h3>Товар не найден</h3><p>Возможно, ссылка устарела.</p><a class="btn btn--primary" href="catalog.html">Перейти в каталог</a></div>';
      return;
    }
    var cat = catBySlug(p.category);
    var stockHtml, stockClass;
    if (p.inStock) { stockClass = 'stock--in'; stockHtml = '<span class="dot"></span>В наличии'; }
    else { stockClass = 'stock--out'; stockHtml = '<span class="dot"></span>Нет в наличии'; }

    var galGrads = [p.gradient].concat(['g1', 'g2', 'g3', 'g4'].filter(function (g) { return g !== p.gradient; })).slice(0, 3);
    function thumbs() {
      return galGrads.map(function (g, i) {
        return '<button class="p-thumb' + (i === 0 ? ' is-active' : '') + '" type="button" data-thumb="' + i + '" aria-label="Фото ' + (i + 1) + '">' +
          phSVG({ type: p.icon, gradient: g, label: p.name }) + '</button>';
      }).join('');
    }

    root.innerHTML =
      '<div class="product-page">' +
      '<div class="p-gallery">' +
      '<div class="main" data-main>'; // filled below
    root.querySelector('[data-main]').innerHTML = phSVG({ type: p.icon, gradient: p.gradient, label: p.name });
    root.querySelector('[data-main]').parentNode.innerHTML += '<div class="p-thumbs">' + thumbs() + '</div></div>';

    var features = (p.features || []).map(function (f) {
      return '<div class="feature">' +
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>' +
        '<div><strong>' + esc(f) + '</strong></div></div>';
    }).join('');

    var materials = (p.materials || []).map(function (m, i) {
      var colors = ['#A6502A', '#C8973F', '#8F4322', '#4A443A', '#5F584C', '#BBB2A3'];
      return '<button class="swatch' + (i === 0 ? ' is-active' : '') + '" type="button" data-material>' +
        '<span class="swatch-box" style="background:' + colors[i % colors.length] + ';"></span><small>' + esc(m) + '</small></button>';
    }).join('');

    var similar = P.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
    var similarHtml = '<section class="section" style="padding-block:clamp(3rem,6vw,5rem);"><div class="section-head"><span class="overline">Вам может понравиться</span><h2>Похожие товары</h2></div><div class="product-grid" data-similar></div></section>';

    root.insertAdjacentHTML('beforeend',
      '<div class="p-info">' +
      '<span class="overline">' + esc(cat ? cat.name : catName(p.category)) + '</span>' +
      '<h1>' + esc(p.name) + '</h1>' +
      '<div class="p-price-row">' + (p.oldPrice ? '<span class="old">' + fmt(p.oldPrice) + '</span>' : '') + '<span class="price price--lg">' + priceLabel(p) + '</span></div>' +
      '<div class="stock ' + stockClass + '">' + stockHtml + '</div>' +
      '<div class="p-actions">' +
      '<button class="btn btn--primary btn--large" type="button" data-add="' + esc(p.id) + '">В корзину</button>' +
      '<button class="btn btn--secondary btn--large" type="button" data-buy-now="' + esc(p.id) + '">Купить сейчас</button>' +
      '<button class="fav-btn' + (isFav(p.id) ? ' is-active' : '') + '" type="button" data-fav="' + esc(p.id) + '" aria-label="В избранное" style="position:static;width:56px;height:56px;background:var(--mv-graphite-100);">' + ICONS.heart + '</button>' +
      '</div>' +
      '<div class="p-desc">' + (p.description || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
      '<div class="p-materials"><span class="overline">Облицовочные материалы</span><div class="swatches" data-materials>' + materials + '</div></div>' +
      '<div class="p-actions">' +
      '<button class="btn btn--secondary btn--large" type="button" data-open-calc>Рассчитать стоимость</button>' +
      '</div>' +
      '</div>');

    var featSec = '<section class="section section--alt"><div class="container"><div class="section-head"><span class="overline">Преимущества</span><h2>Особенности модели</h2></div><div class="p-features">' + features + '</div></div></section>';
    root.insertAdjacentHTML('beforeend', featSec + similarHtml);
    var sim = root.querySelector('[data-similar]');
    if (sim) renderGrid(sim, similar);

    // gallery thumbs
    root.addEventListener('click', function (e) {
      var th = e.target.closest('[data-thumb]');
      if (th) {
        var idx = Number(th.getAttribute('data-thumb'));
        var main = root.querySelector('[data-main]');
        main.innerHTML = phSVG({ type: p.icon, gradient: galGrads[idx], label: p.name });
        root.querySelectorAll('.p-thumb').forEach(function (t) { t.classList.remove('is-active'); });
        th.classList.add('is-active');
      }
    });
    // material swatches
    root.addEventListener('click', function (e) {
      var sw = e.target.closest('[data-material]');
      if (sw) {
        root.querySelectorAll('.swatch').forEach(function (s) { s.classList.remove('is-active'); });
        sw.classList.add('is-active');
      }
    });

    // breadcrumbs update
    var crumb = document.getElementById('breadcrumb-current');
    if (crumb) crumb.textContent = p.name;
  }

  /* ---------- Favorites ---------- */
  function initFavorites() {
    var grid = document.getElementById('fav-grid');
    var count = document.getElementById('fav-count-msg');
    var ids = getFavs();
    var items = P.filter(function (p) { return ids.indexOf(p.id) > -1; });
    if (count) count.textContent = items.length ? 'Сохранено: ' + items.length : '';
    if (!grid) return;
    if (!items.length) {
      catalogReset = null; // do not wire catalog reset on /favorites
      grid.innerHTML = '<div class="empty-state">' +
        '<svg class="icon-big" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.7-9.3-9.2C1.4 8.3 3.5 5 6.9 5c2 0 3.4 1.1 4.1 2.4h2C13.7 6.1 15.1 5 17.1 5c3.4 0 5.5 3.3 4.2 6.3C19.5 15.8 12 20.5 12 20.5Z"/></svg>' +
        '<h3>В избранном пока пусто</h3>' +
        '<p>Добавляйте понравившиеся товары кнопкой с сердечком.</p>' +
        '<a class="btn btn--primary" href="catalog.html">Перейти в каталог</a>' +
        '</div>';
      return;
    }
    grid.innerHTML = items.map(productCard).join('');
  }

  /* ---------- Home ---------- */
  function initHome() {
    var catGrid = document.getElementById('cat-grid');
    if (catGrid) {
      catGrid.innerHTML = CATS.map(function (c) {
        return '<a class="category-card" href="catalog.html?category=' + encodeURIComponent(c.slug) + '">' +
          '<span class="bg" style="background:url(&quot;data:image/svg+xml;utf8,' + encodeURIComponent(phSVG({ type: c.icon, gradient: c.gradient, label: c.name })) + '&quot;) center/cover"></span>' +
          '<span class="shade"></span><span class="inner"><span class="overline">' + esc(c.short) + '</span><h3>' + esc(c.name) + '</h3></span>' +
          '<span class="arr">' + ICONS.arrow + '</span></a>';
      }).join('');
    }
    var reviews = document.getElementById('reviews');
    if (reviews) {
      reviews.innerHTML = [
        { n: 'Анна', c: 'Москва', t: 'Заказывали диван «Осло» и гостиную. Собрали под наш размер, привезли и установили за 3 дня. Отличное качество!', r: 5 },
        { n: 'Дмитрий', c: 'Санкт-Петербург', t: 'Понравился бесплатный дизайн-проект. Помогли подобрать кровать и матрас под спальню. Спасибо за сервис.', r: 5 },
        { n: 'Марина', c: 'Казань', t: 'Мягкая мебель премиум-класса. Реально видно качество материалов и сборки. Рекомендую салон «МЕБЕЛЬ&ВРЕМЯ».', r: 5 }
      ].map(function (rv) {
        return '<div class="review-card"><div class="stars">' + '★'.repeat(rv.r) + '</div><p>«' + esc(rv.t) + '»</p><div class="author">' + esc(rv.n) + ' · ' + esc(rv.c) + '</div></div>';
      }).join('');
    }
    // hero visual
    var heroVis = document.getElementById('hero-visual');
    if (heroVis) heroVis.innerHTML = phSVG({ type: 'sofa', gradient: 'g2', label: 'Мебель для гостиной' });
  }

  /* ---------- Contacts ---------- */
  function initContacts() {
    // forms handled generically
  }

  /* ---------- Generic forms ---------- */
  function bindForms(root) {
    if (!root) root = document;
    root.querySelectorAll('form.js-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = validateForm(form);
        if (!ok) return;
        var panel = form.querySelector('.form-success');
        form.querySelectorAll('.field').forEach(function (f) {
          if (f.classList.contains('has-error')) f.classList.remove('has-error');
          if (!f.classList.contains('is-success')) f.classList.add('is-success');
        });
        if (panel) { panel.classList.add('is-visible'); form.querySelector('button[type=submit]').style.display = 'none'; }
        toast('Заявка отправлена');
        var drawer = form.closest('#cart-checkout');
        if (drawer) {
          setCart([]); updateBadges();
        }
      });
    });
  }

  function validateForm(form) {
    var valid = true;
    form.querySelectorAll('input[required], textarea[required], select[required]').forEach(function (inp) {
      var field = inp.closest('.field') || inp.parentElement;
      var val = inp.value.trim();
      var invalid = false;
      var err = '';
      if (!val) { invalid = true; err = 'Заполните поле'; }
      else if (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(val)) { invalid = true; err = 'Введите корректный e-mail'; }
      else if (inp.type === 'tel' && !/^[+\d][\d\s()-]{6,}$/.test(val)) { invalid = true; err = 'Введите корректный телефон'; }
      if (invalid) {
        valid = false;
        field.classList.add('has-error');
        field.classList.remove('is-success');
        var em = field.querySelector('.error-msg');
        if (em) em.textContent = err;
        else {
          var d = document.createElement('div'); d.className = 'error-msg'; d.textContent = err;
          field.appendChild(d);
        }
      } else {
        field.classList.remove('has-error');
        field.classList.add('is-success');
      }
    });
    // consent
    form.querySelectorAll('input[name=consent][type=checkbox]').forEach(function (cb) {
      var label = cb.closest('.consent');
      var em = label ? label.querySelector('.error-msg') : null;
      if (!cb.checked) {
        valid = false;
        if (label) label.classList.add('has-error');
        if (em) em.textContent = 'Необходимо согласие';
      } else {
        if (label) label.classList.remove('has-error');
        if (em) em.textContent = '';
      }
    });
    return valid;
  }

  /* ---------- Cart ---------- */
  function addToCart(id, qty) {
    var cart = getCart();
    var ex = cart.find(function (i) { return i.id === id; });
    if (ex) ex.qty = (ex.qty || 1) + (qty || 1);
    else cart.push({ id: id, qty: qty || 1 });
    setCart(cart);
    updateBadges();
    renderCart();
    toast('Товар добавлен в корзину');
  }
  function removeFromCart(id) {
    setCart(getCart().filter(function (i) { return i.id !== id; }));
    updateBadges(); renderCart();
  }
  function changeQty(id, d) {
    var cart = getCart();
    var ex = cart.find(function (i) { return i.id === id; });
    if (!ex) return;
    ex.qty = (ex.qty || 1) + d;
    if (ex.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    setCart(cart); updateBadges(); renderCart();
  }
  function cartTotals() {
    var cart = getCart();
    var subtotal = 0, discount = 0;
    cart.forEach(function (i) {
      var p = getProduct(i.id);
      if (!p) return;
      var line = p.price * (i.qty || 1);
      subtotal += line;
      if (p.oldPrice) discount += (p.oldPrice - p.price) * (i.qty || 1);
    });
    // price is already the current selling price; savings is informational
    return { subtotal: subtotal, discount: discount, total: subtotal };
  }
  function renderCart() {
    var body = document.querySelector('[data-cart-body]');
    var foot = document.querySelector('[data-cart-foot]');
    if (!body) return;
    var cart = getCart();
    if (!cart.length) {
      body.innerHTML = '<div class="cart-empty"><svg class="icon-big" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 4h2l2.4 12.2A2 2 0 0 0 9.4 18h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1.2"/><circle cx="17" cy="21" r="1.2"/></svg><h3>Корзина пуста</h3><p>Добавьте товары из каталога.</p><a class="btn btn--primary" href="catalog.html">Перейти в каталог</a></div>';
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = cart.map(function (i) {
      var p = getProduct(i.id);
      if (!p) return '';
      return '<div class="cart-item">' +
        '<div class="thumb">' + phSVG({ type: p.icon, gradient: p.gradient, label: p.name }) + '</div>' +
        '<div class="meta"><div class="name">' + esc(p.name) + '</div><div class="cat">' + esc(catName(p.category)) + '</div>' +
        '<div class="price">' + priceLabel(p) + '</div>' +
        '<div style="margin-top:8px;"><div class="stepper"><button type="button" data-qty-dec="' + esc(p.id) + '" aria-label="Меньше">−</button>' +
        '<span class="val">' + (i.qty || 1) + '</span>' +
        '<button type="button" data-qty-inc="' + esc(p.id) + '" aria-label="Больше">+</button></div></div>' +
        '</div>' +
        '<div class="right">' +
        '<span class="price">' + fmt(p.price * (i.qty || 1)) + '</span>' +
        '<button class="remove" type="button" data-remove="' + esc(p.id) + '" aria-label="Удалить">' + ICONS.trash + '</button>' +
        '</div></div>';
    }).join('');

    var t = cartTotals();
    foot.innerHTML =
      '<div class="cart-summary">' +
      (t.discount ? '<div class="cart-line" style="color:var(--mv-danger);"><span>Вы экономите</span><span>−' + fmt(t.discount) + '</span></div>' : '') +
      '<div class="cart-line cart-line--total"><span>Итого</span><span>' + fmt(t.total) + '</span></div>' +
      '<div class="cart-actions">' +
      '<button class="btn btn--primary btn--block" type="button" data-checkout>Оформить заказ</button>' +
      '<button class="btn btn--secondary btn--block" type="button" data-close-cart>Продолжить покупки</button>' +
      '</div></div>';
  }

  function openCart() {
    renderCart();
    document.getElementById('cart-drawer').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    document.getElementById('cart-drawer').classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function toggleFav(id) {
    var favs = getFavs();
    var active = favs.indexOf(id) > -1;
    if (active) favs = favs.filter(function (x) { return x !== id; });
    else favs.push(id);
    setFavs(favs);
    updateBadges();
    document.querySelectorAll('[data-fav="' + id + '"]').forEach(function (el) {
      el.classList.toggle('is-active', !active);
    });
    if (document.body.dataset.page === 'favorites') initFavorites();
    toast(active ? 'Удалено из избранного' : 'Добавлено в избранное');
  }

  /* ---------- Search ---------- */
  function openSearch() {
    var p = document.querySelector('.search-panel');
    p.classList.add('is-open');
    var inp = p.querySelector('[data-search-input]');
    setTimeout(function () { if (inp) inp.focus(); }, 50);
  }
  function closeSearch() {
    document.querySelector('.search-panel').classList.remove('is-open');
  }
  function runSearch(q) {
    var res = document.querySelector('[data-search-results]');
    if (!res) return;
    q = (q || '').trim().toLowerCase();
    if (!q) { res.innerHTML = '<p class="muted" style="padding:16px;">Введите запрос, чтобы найти товар.</p>'; return; }
    var items = P.filter(function (p) {
      return (p.name + ' ' + catName(p.category) + ' ' + (p.subcategory || '')).toLowerCase().indexOf(q) > -1;
    });
    if (!items.length) { res.innerHTML = '<p class="muted" style="padding:16px;">Ничего не найдено по запросу «' + esc(q) + '».</p>'; return; }
    res.innerHTML = items.map(function (p) {
      return '<a class="search-result" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
        '<div class="thumb">' + phSVG({ type: p.icon, gradient: p.gradient, label: p.name }) + '</div>' +
        '<div class="meta"><div class="name">' + esc(p.name) + '</div><div class="cat">' + esc(catName(p.category)) + '</div>' +
        '<div class="price">' + priceLabel(p) + '</div></div></a>';
    }).join('');
  }

  /* ---------- Mobile menu ---------- */
  function openMobile() {
    document.querySelector('.mobile-menu').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    document.querySelector('.mobile-menu').classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ---------- Modal ---------- */
  function resetModalForm() {
    var m = document.getElementById('calc-modal');
    var form = m.querySelector('form');
    form.reset();
    form.removeAttribute('id');
    var btn = form.querySelector('button[type=submit]');
    if (btn) btn.style.display = '';
    var succ = form.querySelector('.form-success');
    if (succ) succ.classList.remove('is-visible');
    form.querySelectorAll('.field').forEach(function (f) {
      f.classList.remove('has-error', 'is-success');
    });
  }
  function showModal() {
    var m = document.getElementById('calc-modal');
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function openModal() {
    resetModalForm();
    var m = document.getElementById('calc-modal');
    m.querySelector('h3').textContent = 'Рассчитать стоимость';
    showModal();
  }
  function closeModal() {
    var m = document.getElementById('calc-modal');
    m.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ---------- Checkout ---------- */
  function openCheckout() {
    resetModalForm();
    var m = document.getElementById('calc-modal');
    m.querySelector('h3').textContent = 'Оформление заказа';
    m.querySelector('form').setAttribute('id', 'cart-checkout');
    var comment = m.querySelector('.form-grid .field textarea[name=comment]');
    if (comment) comment.placeholder = 'Адрес доставки, комментарий';
    showModal();
  }

  /* ---------- Global events ---------- */
  function onGlobalClick(e) {
    var add = e.target.closest('[data-add]');
    if (add) { addToCart(add.getAttribute('data-add')); return; }
    var buy = e.target.closest('[data-buy-now]');
    if (buy) { addToCart(buy.getAttribute('data-buy-now')); openCart(); return; }
    var fav = e.target.closest('[data-fav]');
    if (fav) { toggleFav(fav.getAttribute('data-fav')); return; }
    var rem = e.target.closest('[data-remove]');
    if (rem) { removeFromCart(rem.getAttribute('data-remove')); return; }
    var inc = e.target.closest('[data-qty-inc]');
    if (inc) { changeQty(inc.getAttribute('data-qty-inc'), 1); return; }
    var dec = e.target.closest('[data-qty-dec]');
    if (dec) { changeQty(dec.getAttribute('data-qty-dec'), -1); return; }
    if (e.target.closest('[data-cart]')) { openCart(); return; }
    if (e.target.closest('[data-close-cart]')) { closeCart(); return; }
    if (e.target.closest('[data-search]')) { openSearch(); return; }
    if (e.target.closest('[data-close-search]')) { closeSearch(); return; }
    if (e.target.closest('[data-burger]')) { openMobile(); return; }
    if (e.target.closest('[data-close-menu]')) { closeMobile(); return; }
    if (e.target.closest('[data-close-modal]')) { closeModal(); return; }
    if (e.target.closest('[data-open-calc]')) { openModal(); return; }
    if (e.target.closest('[data-checkout]')) { openCheckout(); return; }
    var rf = e.target.closest('[data-reset-filters]');
    if (rf) { if (catalogReset) catalogReset(); return; }
  }
  document.addEventListener('click', onGlobalClick);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeCart(); closeSearch(); closeMobile(); closeModal();
    }
  });

  function bindGlobal() {
    var sp = document.querySelector('.search-panel');
    var inp = sp.querySelector('[data-search-input]');
    inp.addEventListener('input', function () { runSearch(this.value); });
    inp.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        var first = sp.querySelector('.search-result');
        if (first) window.location.href = first.getAttribute('href');
      }
    });
    document.addEventListener('click', function (e) {
      var tr = e.target.closest('.search-result');
      // link navigation handled natively
    });
  }

  /* ---------- init ---------- */
  function init() {
    injectChrome();
    bindGlobal();
    var page = document.body.getAttribute('data-page');
    if (page === 'home') initHome();
    else if (page === 'catalog') initCatalog();
    else if (page === 'product') initProduct();
    else if (page === 'favorites') initFavorites();
    else if (page === 'contacts') initContacts();
    bindForms(document);
    updateBadges();

    // sticky header shadow
    var header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('is-scrolled', window.scrollY > 4);
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
