/* THE SQUAD — v184 Economy UI
 * Wallet, marketplace and order history screens.
 *
 * Wires into the existing router instead of replacing it:
 *   ui2.js owns drRoute/drRender and exposes window.SquadSocialUI + the
 *   'squad:social-rendered' event. We listen for that event and paint the
 *   wallet routes that ui2.js does not know about yet.
 *
 * Every action here calls SquadEconomy, which performs a real Firestore batch.
 * Firestore Rules re-validate the balance server-side. There are no fake
 * purchases and no client-side balance authority.
 */
(function () {
  'use strict';
  if (window.__squadEconomyUI) return;
  window.__squadEconomyUI = true;

  const E = window.SquadEconomy;
  if (!E) { console.warn('[economy] economy-core.js missing'); return; }

  const ROUTES = { wallet: 'المحفظة', market: 'المتجر' };
  let catalogCache = null;
  let busy = false;

  function esc(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function screen() { return document.getElementById('dr-screen'); }
  function toast(msg) {
    if (typeof window.toast === 'function') return window.toast(msg);
    const el = document.createElement('div');
    el.className = 'dr-toast';
    el.textContent = msg;
    el.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:9999;' +
      'background:#111B32;color:#F8FAFC;border:1px solid #2563EB55;padding:12px 18px;border-radius:12px;' +
      'font:14px system-ui;box-shadow:0 12px 40px #0008';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 3600);
  }
  function price(v) { return E.formatCurrency(v); }
  function stateMsg(html) { return '<div class="dr-empty">' + html + '</div>'; }

  /* ------------------------------------------------------------ wallet view */
  async function renderWallet() {
    const host = screen();
    if (!host) return;
    host.innerHTML = '<div class="dr-empty dr-loading">جارٍ تحميل المحفظة…</div>';

    let wallet, owned, orders;
    try {
      wallet = await E.getWallet();
      owned = await E.getOwned();
      orders = await E.listOrders();
    } catch (err) {
      host.innerHTML = stateMsg('<strong>تعذر تحميل المحفظة</strong><p>' +
        esc(err.message || 'حصل خطأ') + '</p><button class="dr-primary" data-econ-retry>إعادة المحاولة</button>');
      return;
    }

    const spent = orders.reduce(function (sum, o) {
      return sum + (Number.isInteger(o.total) ? o.total : 0);
    }, 0);
    const completed = orders.filter(function (o) { return o.status === 'completed'; }).length;

    host.innerHTML =
      '<div class="dr-panel" style="padding:20px">' +
        '<h3 style="margin:0 0 6px">المحفظة</h3>' +
        '<p style="color:var(--dr-muted);margin:0 0 14px;font-size:13px">العملة الافتراضية داخل The Squad فقط — ليست أموالًا حقيقية.</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:10px">' +
          '<div class="dr-panel" style="padding:14px;flex:1 1 150px"><small style="color:var(--dr-muted)">الرصيد</small>' +
            '<div style="font-size:26px;font-weight:700;color:#38BDF8">' + esc(price(wallet.balance)) + '</div></div>' +
          '<div class="dr-panel" style="padding:14px;flex:1 1 150px"><small style="color:var(--dr-muted)">إجمالي المشتريات</small>' +
            '<div style="font-size:26px;font-weight:700">' + esc(price(spent)) + '</div></div>' +
          '<div class="dr-panel" style="padding:14px;flex:1 1 150px"><small style="color:var(--dr-muted)">العناصر المملوكة</small>' +
            '<div style="font-size:26px;font-weight:700">' + owned.length + '</div></div>' +
        '</div>' +
        (!wallet.exists
          ? '<p style="color:#FCD34D;font-size:13px;margin-top:14px">لا توجد محفظة مفعّلة لهذا الحساب بعد. تُنشأ المحافظ من الإدارة.</p>'
          : '') +
        '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="dr-primary" data-econ-goto="market">تصفح المتجر</button>' +
          '<button class="dr-secondary" data-econ-refresh>تحديث</button>' +
        '</div>' +
      '</div>' +

      '<div class="dr-panel" style="padding:18px;margin-top:14px">' +
        '<h3 style="margin:0 0 10px">سجل العمليات</h3>' +
        (orders.length === 0
          ? stateMsg('<strong>لا توجد عمليات بعد</strong>اشترِ عنصرًا من المتجر ليظهر هنا.')
          : '<div class="dr-message-list">' + orders.map(function (o) {
              const when = o.createdAt ? new Date(o.createdAt).toLocaleString('ar-EG') : '—';
              return '<div class="dr-conversation" style="cursor:default">' +
                '<span class="dr-avatar">' + esc((o.itemName || '؟').slice(0, 1)) + '</span>' +
                '<span><b>' + esc(o.itemName || o.itemId) + '</b><small>' + esc(when) + ' · ' +
                esc(o.status === 'completed' ? 'مكتملة' : o.status) + '</small></span>' +
                '<small style="color:#38BDF8">-' + esc(price(o.total || 0)) + '</small>' +
              '</div>';
            }).join('') + '</div>') +
        (completed ? '' : '') +
      '</div>' +

      '<div class="dr-panel" style="padding:18px;margin-top:14px">' +
        '<h3 style="margin:0 0 10px">العناصر المملوكة</h3>' +
        (owned.length === 0
          ? stateMsg('<strong>لا تملك عناصر بعد</strong>عناصر المتجر التي تشتريها تظهر هنا.')
          : '<div class="dr-message-list">' + owned.map(function (o) {
              return '<div class="dr-conversation" style="cursor:default">' +
                '<span class="dr-avatar">' + esc((o.name || '؟').slice(0, 1)) + '</span>' +
                '<span><b>' + esc(o.name || o.itemId) + '</b><small>' + esc(o.category || '—') + '</small></span>' +
                '<small>' + esc(price(o.price || 0)) + '</small>' +
              '</div>';
            }).join('') + '</div>') +
      '</div>';
  }

  /* -------------------------------------------------------- marketplace view */
  async function renderMarket() {
    const host = screen();
    if (!host) return;
    host.innerHTML = '<div class="dr-empty dr-loading">جارٍ تحميل المتجر…</div>';

    let items, wallet, owned;
    try {
      items = catalogCache || (await E.listCatalog());
      catalogCache = items;
      wallet = await E.getWallet();
      owned = await E.getOwned();
    } catch (err) {
      host.innerHTML = stateMsg('<strong>تعذر تحميل المتجر</strong><p>' +
        esc(err.message || 'حصل خطأ') + '</p><button class="dr-primary" data-econ-retry>إعادة المحاولة</button>');
      return;
    }

    const ownedIds = {};
    owned.forEach(function (o) { ownedIds[o.itemId] = true; });

    if (!items.length) {
      host.innerHTML = stateMsg('<strong>المتجر فاضي حاليًا</strong>تُضاف عناصر المتجر من لوحة الإدارة.');
      return;
    }

    // Stable, meaningful grouping rather than one flat wall of cards.
    const groups = {};
    items.forEach(function (it) {
      const c = it.category || 'أخرى';
      (groups[c] = groups[c] || []).push(it);
    });

    host.innerHTML =
      '<div class="dr-panel" style="padding:14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
        '<span style="font-size:13px;color:var(--dr-muted)">رصيدك</span>' +
        '<b style="font-size:20px;color:#38BDF8">' + esc(price(wallet.balance)) + '</b>' +
        '<button class="dr-secondary" data-econ-goto="wallet">المحفظة</button>' +
      '</div>' +
      Object.keys(groups).sort().map(function (cat) {
        return '<h3 style="margin:16px 0 10px;font-size:15px">' + esc(cat) + '</h3>' +
          '<div class="dr-feed">' + groups[cat].map(function (it) {
            const isOwned = !!ownedIds[it.id];
            const unavailable = it.available === false;
            const canBuy = !isOwned && !unavailable;
            let btn;
            if (isOwned) btn = '<button class="dr-secondary" disabled>مملوك بالفعل</button>';
            else if (unavailable) btn = '<button class="dr-secondary" disabled>غير متاح</button>';
            else btn = '<button class="dr-primary" data-econ-buy="' + esc(it.id) + '">شراء</button>';
            return '<div class="dr-panel" style="padding:16px">' +
              '<b>' + esc(it.name || it.id) + '</b>' +
              '<p style="color:var(--dr-muted);font-size:13px;margin:6px 0 10px">' + esc(it.description || '') + '</p>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
                '<b style="color:#C5A46D">' + esc(price(it.price || 0)) + '</b>' + btn +
              '</div>' +
            '</div>';
          }).join('') + '</div>';
      }).join('');
  }

  /* -------------------------------------------------------------- purchase */
  async function buy(itemId) {
    if (busy) return;
    busy = true;
    try {
      const items = catalogCache || (await E.listCatalog());
      catalogCache = items;
      const item = items.find(function (x) { return x.id === itemId; });
      if (!item) throw new Error('المنتج غير متاح');

      const wallet = await E.getWallet();
      const afford = E.canAfford(wallet.balance, item.price);
      if (!afford.ok) { toast(afford.reason); return; }

      const confirmed = window.SquadDialog && window.SquadDialog.confirm
        ? await window.SquadDialog.confirm(
            'شراء "' + (item.name || itemId) + '" مقابل ' + price(item.price) + '؟\n' +
            'رصيدك بعد الشراء: ' + price(wallet.balance - item.price))
        : window.confirm('شراء ' + (item.name || itemId) + ' مقابل ' + price(item.price) + '؟');
      if (!confirmed) return;

      const result = await E.purchase(itemId);
      toast('تم الشراء ✅ رصيدك الآن ' + price(result.balanceAfter));
      await renderMarket();
    } catch (err) {
      toast(err.message || 'فشلت العملية');
    } finally {
      busy = false;
    }
  }

  /* ------------------------------------------------------------- rendering */
  function paint() {
    const route = window.SquadSocialUI && window.SquadSocialUI.getRoute
      ? window.SquadSocialUI.getRoute()
      : null;
    if (!route || !ROUTES[route]) return;
    const titleEl = document.getElementById('dr-title');
    const subEl = document.getElementById('dr-subtitle');
    if (titleEl) titleEl.textContent = ROUTES[route];
    if (subEl) subEl.textContent = route === 'wallet'
      ? 'رصيدك وسجل عملياتك'
      : 'عناصر افتراضية تُشترى بالعملة الافتراضية';
    if (route === 'wallet') renderWallet();
    else renderMarket();
  }

  // ui2.js fires this after every social render, so unknown routes can be filled.
  window.addEventListener('squad:social-rendered', function (ev) {
    const route = (ev && ev.detail && ev.detail.route) || null;
    if (route && ROUTES[route]) paint();
  });

  document.addEventListener('click', function (e) {
    const t = e.target;
    if (!t || !t.closest) return;

    const nav = t.closest('[data-social]');
    // Let ui2.js switch the route; we paint after its render event.
    if (nav && ROUTES[nav.dataset.social]) { return; }

    const goto = t.closest('[data-econ-goto]');
    if (goto) {
      const target = goto.dataset.econGoto;
      const b = document.querySelector('#social-rail [data-social="' + target + '"]') ||
                document.querySelector('[data-social="' + target + '"]');
      if (b) b.click();
      return;
    }
    const retry = t.closest('[data-econ-retry]');
    if (retry) { paint(); return; }
    const refresh = t.closest('[data-econ-refresh]');
    if (refresh) { catalogCache = null; paint(); return; }
    const buyBtn = t.closest('[data-econ-buy]');
    if (buyBtn) { buy(buyBtn.dataset.econBuy); return; }
  });

  window.SquadEconomyUI = { renderWallet: renderWallet, renderMarket: renderMarket, paint: paint };
})();
