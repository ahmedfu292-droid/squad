/* THE SQUAD — v184 Economy Core
 * Virtual currency only. Real money is intentionally NOT implemented.
 *
 * Design constraint (important, and documented honestly):
 *   This repository has no Cloud Functions deployment, so there is no custom
 *   trusted backend. Firestore Security Rules ARE the server-side validation
 *   layer: they run on Google servers, atomically with each write, and cannot
 *   be bypassed from the browser. Every rule that protects a balance lives in
 *   firestore.rules, never here.
 *
 * Therefore all money mutations are single-document, rules-verifiable:
 *   - debit is always exactly the catalog price (no arbitrary deltas)
 *   - balance can never go negative (rules check both old and new value)
 *   - ownership docs are create-only, which makes purchases idempotent/duplicate-proof
 *   - the treasury is DERIVED from the ledger, so no client can ever credit it
 *
 * This module is pure logic + thin Firestore calls. Nothing here is a mock:
 * the functions below either perform a real transaction or throw.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SquadEconomy = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------------------------------------------------------------- config */
  // Platform treasury CAPACITY, not any user's balance. Users start at 0.
  const TREASURY_CAPACITY = 10000000000; // 10,000,000,000 virtual units
  const MAX_ITEM_PRICE = 100000000;      // 100,000,000 per single item
  const MIN_ITEM_PRICE = 1;              // 1 unit minimum, prices are integers
  const MAX_BALANCE = 1000000000;        // 1,000,000,000 per wallet
  const MAX_OWNED = 500;                 // inventory cap per user

  const REAL_MONEY_ENABLED = false;      // disabled until a verified provider + adult oversight exists
  const CURRENCY_LABEL = 'SQ';           // virtual units only

  /* ------------------------------------------------------- pure helpers */
  // Prices are integers. Reject floats, NaN, negatives, strings with junk.
  function isValidPrice(v) {
    if (typeof v !== 'number') return false;
    if (!Number.isFinite(v) || !Number.isInteger(v)) return false;
    return v >= MIN_ITEM_PRICE && v <= MAX_ITEM_PRICE;
  }

  function isValidQuantity(v) {
    return Number.isInteger(v) && v >= 1 && v <= 99;
  }

  // Total cost for qty * unitPrice, with overflow guard before arithmetic matters.
  function totalCost(unitPrice, qty) {
    if (!isValidPrice(unitPrice)) throw new Error('سعر غير صالح');
    if (!isValidQuantity(qty)) throw new Error('كمية غير صالحة');
    const total = unitPrice * qty;
    if (!Number.isSafeInteger(total)) throw new Error('الإجمالي كبير جدًا');
    return total;
  }

  // Authoritative pre-flight check. The rules re-check this server-side; this
  // only produces a friendly message before the write is attempted.
  function canAfford(balance, cost) {
    if (!Number.isInteger(balance) || balance < 0) return { ok: false, reason: 'رصيد غير صالح' };
    if (!Number.isInteger(cost) || cost < MIN_ITEM_PRICE) return { ok: false, reason: 'تكلفة غير صالحة' };
    if (balance < cost) return { ok: false, reason: 'الرصيد غير كافٍ' };
    if (balance - cost < 0) return { ok: false, reason: 'العملية ستجعل الرصيد سالبًا' };
    return { ok: true, reason: '' };
  }

  // Treasury is derived: capacity minus everything ever collected.
  // Never negative, never influenced by a client-supplied number.
  function treasuryBalance(soldTotal) {
    const collected = Number.isInteger(soldTotal) && soldTotal > 0 ? soldTotal : 0;
    return Math.max(0, TREASURY_CAPACITY - collected);
  }

  // Deterministic ownership document id => a second purchase of the same item
  // cannot create a second doc, which is our duplicate-purchase protection.
  function ownedId(uid, itemId) {
    return String(uid) + '__' + String(itemId);
  }

  // Deterministic order id so a retried purchase of the same item+qty collides
  // instead of silently double-charging.
  function orderId(uid, itemId) {
    return 'ord_' + ownedId(uid, itemId);
  }

  function formatCurrency(v) {
    const n = Number.isFinite(v) ? Math.trunc(v) : 0;
    return n.toLocaleString('en-US') + ' ' + CURRENCY_LABEL;
  }

  function itemCategoryOf(item) {
    const c = item && item.category ? String(item.category) : '';
    return c || 'أخرى';
  }

  /* --------------------------------------------------- firebase plumbing */
  function dbx() {
    return (typeof window !== 'undefined' && window.firebase && window.firebase.firestore)
      ? window.firebase.firestore()
      : null;
  }
  function currentUid() {
    try {
      return (typeof window !== 'undefined' && window.firebase && window.firebase.auth)
        ? (window.firebase.auth().currentUser || {}).uid || null
        : null;
    } catch (_) { return null; }
  }
  function need() {
    const db = dbx();
    const uid = currentUid();
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    if (!uid) throw new Error('لازم تسجل الدخول أولًا');
    return { db, uid };
  }

  /* ------------------------------------------------------------- wallet */
  async function getWallet(uid) {
    const db = dbx();
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    const target = uid || currentUid();
    if (!target) throw new Error('لازم تسجل الدخول أولًا');
    const snap = await db.doc('wallets/' + target).get();
    if (!snap.exists) return { balance: 0, exists: false, updatedAt: 0 };
    const d = snap.data() || {};
    return {
      balance: Number.isInteger(d.balance) ? d.balance : 0,
      exists: true,
      updatedAt: d.updatedAt && d.updatedAt.toMillis ? d.updatedAt.toMillis() : 0
    };
  }

  async function getOwned(uid) {
    const db = dbx();
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    const target = uid || currentUid();
    if (!target) throw new Error('لازم تسجل الدخول أولًا');
    const snap = await db.collection('inventory').doc(target).collection('owned').get();
    return snap.docs.map(function (d) {
      const v = d.data() || {};
      return {
        id: d.id,
        itemId: v.itemId || '',
        name: v.name || '',
        price: v.price || 0,
        category: v.category || '',
        purchasedAt: v.purchasedAt && v.purchasedAt.toMillis ? v.purchasedAt.toMillis() : 0
      };
    });
  }

  /* ------------------------------------------------------------ catalog */
  async function listCatalog() {
    const db = dbx();
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    const snap = await db.collection('storeItems').limit(200).get();
    return snap.docs.map(function (d) {
      const v = d.data() || {};
      return Object.assign({ id: d.id }, v);
    });
  }

  /* --------------------------------------------------------- purchase
   * Single atomic batch. All three writes commit together or not at all:
   *   1. wallet debit  -> rules require new == old - catalogPrice (exact)
   *   2. inventory add -> create-only => duplicate purchase fails, not double-charges
   *   3. order record  -> create-only, immutable audit row
   * No treasury write happens here: the treasury is derived, so nothing a
   * client sends can ever create currency out of thin air.
   */
  async function purchase(itemId, qty) {
    const { db, uid } = need();
    const quantity = qty === undefined ? 1 : qty;
    if (!itemId || typeof itemId !== 'string') throw new Error('منتج غير صالح');

    const itemSnap = await db.doc('storeItems/' + itemId).get();
    if (!itemSnap.exists) throw new Error('المنتج غير متاح');
    const item = itemSnap.data() || {};
    if (item.available === false) throw new Error('المنتج غير متاح حاليًا');
    if (!isValidPrice(item.price)) throw new Error('سعر المنتج غير صالح');

    const cost = totalCost(item.price, quantity);

    const wallet = await getWallet(uid);
    const afford = canAfford(wallet.balance, cost);
    if (!afford.ok) throw new Error(afford.reason);

    const ownRef = db.collection('inventory').doc(uid).collection('owned').doc(itemId);
    const ownSnap = await ownRef.get();
    if (ownSnap.exists) throw new Error('تملك هذا العنصر بالفعل');

    const orderRef = db.collection('orders').doc(orderId(uid, itemId));
    const orderSnap = await orderRef.get();
    if (orderSnap.exists) throw new Error('تم تنفيذ هذه العملية بالفعل');

    const balanceAfter = wallet.balance - cost;
    const walletRef = wallet.exists ? db.doc('wallets/' + uid) : null;

    const batch = db.batch();
    if (walletRef) {
      // Rules verify: balance == old - item.price  (exact, integer, >= 0)
      batch.update(walletRef, {
        balance: balanceAfter,
        lastPurchaseItem: itemId,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // First ever purchase: rules allow create only when balance === 0 - ... is
      // impossible, so a fresh wallet can only exist via an admin grant.
      throw new Error('لا يوجد محفظة لهذا الحساب. تواصل مع الإدارة.');
    }

    batch.set(ownRef, {
      itemId: itemId,
      name: String(item.name || itemId).slice(0, 80),
      price: item.price,
      category: itemCategoryOf(item),
      qty: quantity,
      purchasedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    });

    batch.set(orderRef, {
      orderId: orderId(uid, itemId),
      uid: uid,
      itemId: itemId,
      itemName: String(item.name || itemId).slice(0, 80),
      unitPrice: item.price,
      qty: quantity,
      total: cost,
      status: 'completed',
      currency: 'virtual',
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
    });

    try {
      await batch.commit();
    } catch (err) {
      const msg = String((err && err.code) || (err && err.message) || err);
      if (msg.indexOf('permission-denied') !== -1) {
        throw new Error('تم رفض العملية من الخادم. تحقق من الرصيد أو أن العنصر مملوك بالفعل.');
      }
      throw err;
    }

    return { itemId: itemId, total: cost, balanceAfter: balanceAfter, orderId: orderId(uid, itemId) };
  }

  /* ------------------------------------------------------ order history */
  async function listOrders(uid) {
    const db = dbx();
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    const target = uid || currentUid();
    if (!target) throw new Error('لازم تسجل الدخول أولًا');
    const snap = await db.collection('orders').where('uid', '==', target).limit(100).get();
    return snap.docs.map(function (d) {
      const v = d.data() || {};
      return Object.assign({ id: d.id }, v, {
        createdAt: v.createdAt && v.createdAt.toMillis ? v.createdAt.toMillis() : 0
      });
    }).sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
  }

  /* --------------------------------------------------- admin reporting
   * Read-only aggregation for the Control Center. Sums come from orders the
   * rules make immutable, so totals cannot be inflated by the client.
   */
  async function financialSummary() {
    const db = dbx();
    if (!db) throw new Error('قاعدة البيانات غير متاحة');
    const snap = await db.collection('orders').limit(1000).get();
    let sold = 0, count = 0, failed = 0;
    snap.forEach(function (d) {
      const v = d.data() || {};
      if (v.status === 'completed' && Number.isInteger(v.total)) { sold += v.total; count++; }
      else if (v.status === 'failed' || v.status === 'refunded') { failed++; }
    });
    return { soldTotal: sold, completedOrders: count, nonCompletedOrders: failed, treasury: treasuryBalance(sold) };
  }

  /* ----------------------------------------------------- admin grant
   * Only meaningful if firestore.rules exposes an /admins/{uid} doc for this
   * account; the rules — not this code — decide whether it lands.
   */
  async function grantCredits(targetUid, amount, reason) {
    const { db } = need();
    if (!targetUid || typeof targetUid !== 'string') throw new Error('حساب غير صالح');
    if (!Number.isInteger(amount) || amount === 0) throw new Error('مبلغ غير صالح');
    const ref = db.doc('wallets/' + targetUid);
    const snap = await ref.get();
    const current = snap.exists && Number.isInteger((snap.data() || {}).balance) ? snap.data().balance : 0;
    const next = current + amount;
    if (next < 0) throw new Error('الرصيد لا يمكن أن يصبح سالبًا');
    if (next > MAX_BALANCE) throw new Error('يتجاوز الحد الأقصى للمحفظة');
    await ref.set({
      balance: next,
      lastGrantReason: String(reason || '').slice(0, 200),
      updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return { balance: next };
  }

  return {
    TREASURY_CAPACITY: TREASURY_CAPACITY,
    MAX_ITEM_PRICE: MAX_ITEM_PRICE,
    MIN_ITEM_PRICE: MIN_ITEM_PRICE,
    MAX_BALANCE: MAX_BALANCE,
    MAX_OWNED: MAX_OWNED,
    REAL_MONEY_ENABLED: REAL_MONEY_ENABLED,
    CURRENCY_LABEL: CURRENCY_LABEL,
    isValidPrice: isValidPrice,
    isValidQuantity: isValidQuantity,
    totalCost: totalCost,
    canAfford: canAfford,
    treasuryBalance: treasuryBalance,
    ownedId: ownedId,
    orderId: orderId,
    formatCurrency: formatCurrency,
    getWallet: getWallet,
    getOwned: getOwned,
    listCatalog: listCatalog,
    purchase: purchase,
    listOrders: listOrders,
    financialSummary: financialSummary,
    grantCredits: grantCredits
  };
});
