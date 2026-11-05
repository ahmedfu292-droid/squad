/* THE SQUAD — v184 economy regression tests
 *
 * Covers the parts that can be checked without a live Firebase project:
 *   1. pure economy logic (pricing, affordability, derived treasury, ids)
 *   2. the Firestore Rules text, which is the real server-side enforcement layer
 *   3. honest-failure behaviour (unavailable db must throw, never silently succeed)
 *
 * Run: node tests-v184-economy.js
 */
const fs = require('fs');
const assert = require('assert');
const path = require('path');

const root = __dirname;
const E = require(path.join(root, 'economy-core.js'));
const rules = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');
const core = fs.readFileSync(path.join(root, 'economy-core.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'economy-ui.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const results = [];
const queue = [];
// Registers an assertion. Async cases are awaited in run() so a rejection can
// never escape as an unhandled promise (which would look like a crash, not a fail).
function check(name, fn) {
  queue.push([name, fn]);
}

async function run() {
  for (const [name, fn] of queue) {
    try { await fn(); results.push(['PASS', name]); }
    catch (err) { results.push(['FAIL', name + ' :: ' + (err && err.message ? err.message : String(err))]); }
  }
}

/* ------------------------------------------------------------ pure logic */

check('integer prices only; floats and junk rejected', () => {
  assert.strictEqual(E.isValidPrice(250), true);
  assert.strictEqual(E.isValidPrice(1), true);
  assert.strictEqual(E.isValidPrice(100000000), true);
  assert.strictEqual(E.isValidPrice(0), false);
  assert.strictEqual(E.isValidPrice(-5), false);
  assert.strictEqual(E.isValidPrice(2.5), false);
  assert.strictEqual(E.isValidPrice(NaN), false);
  assert.strictEqual(E.isValidPrice(Infinity), false);
  assert.strictEqual(E.isValidPrice('250'), false);
  assert.strictEqual(E.isValidPrice(100000001), false);
  assert.strictEqual(E.isValidPrice(null), false);
});

check('totals are exact and overflow-guarded', () => {
  assert.strictEqual(E.totalCost(250, 1), 250);
  assert.strictEqual(E.totalCost(1200, 3), 3600);
  assert.throws(() => E.totalCost(2.5, 1));
  assert.throws(() => E.totalCost(250, 0));
  assert.throws(() => E.totalCost(250, 100));
});

check('cannot spend more than the balance (no negative balances)', () => {
  assert.strictEqual(E.canAfford(500, 500).ok, true);
  assert.strictEqual(E.canAfford(499, 500).ok, false);
  assert.strictEqual(E.canAfford(0, 1).ok, false);
  assert.strictEqual(E.canAfford(-1, 1).ok, false);
  assert.strictEqual(E.canAfford(1.5, 1).ok, false);
});

check('treasury capacity is 10,000,000,000 and is derived, never negative', () => {
  assert.strictEqual(E.TREASURY_CAPACITY, 10000000000);
  assert.strictEqual(E.treasuryBalance(0), 10000000000);
  assert.strictEqual(E.treasuryBalance(1500), 9999998500);
  // garbage / attacker-supplied input cannot credit the treasury above capacity
  assert.strictEqual(E.treasuryBalance(-5000), 10000000000);
  assert.strictEqual(E.treasuryBalance('999'), 10000000000);
  assert.strictEqual(E.treasuryBalance(NaN), 10000000000);
});

check('ownership and order ids are deterministic (duplicate-purchase guard)', () => {
  assert.strictEqual(E.ownedId('u1', 'item9'), 'u1__item9');
  assert.strictEqual(E.ownedId('u1', 'item9'), E.ownedId('u1', 'item9'));
  assert.notStrictEqual(E.ownedId('u1', 'item9'), E.ownedId('u2', 'item9'));
  assert.strictEqual(E.orderId('u1', 'item9'), 'ord_u1__item9');
});

check('real money is disabled and currency is labelled virtual', () => {
  assert.strictEqual(E.REAL_MONEY_ENABLED, false);
  assert.strictEqual(E.CURRENCY_LABEL, 'SQ');
});

check('database calls fail loudly when Firebase is absent (no fake success)', async () => {
  await assert.rejects(() => E.getWallet('u1'), /قاعدة البيانات غير متاحة/);
  await assert.rejects(() => E.listCatalog(), /قاعدة البيانات غير متاحة/);
  await assert.rejects(() => E.purchase('item1'), /قاعدة البيانات غير متاحة/);
});

/* ---------------------------------------------------- rules: enforcement */

check('wallet debit must equal catalog price exactly (rules recompute it)', () => {
  assert.ok(
    /request\.resource\.data\.balance == resource\.data\.balance - itemPrice\(/.test(rules),
    'exact-price debit equation missing from rules'
  );
  assert.ok(/itemPrice\(itemId\)/.test(rules) && /get\(\/databases\/\$\(database\)\/documents\/storeItems\/\$\(itemId\)\)\.data\.price/.test(rules),
    'catalog price lookup missing');
  assert.ok(/request\.resource\.data\.balance >= 0/.test(rules), 'non-negative balance guard missing');
  assert.ok(/affectedKeys\(\)\.hasOnly\(\['balance','lastPurchaseItem','updatedAt'\]\)/.test(rules),
    'user debit may touch fields beyond balance');
});

check('users cannot write their own wallet freely', () => {
  // the ownership branch of the wallet update rule must be gated on the price equation
  const walletBlock = rules.slice(rules.indexOf('match /wallets/'), rules.indexOf('match /inventory/'));
  const userUpdate = walletBlock.split('allow update: if signed() && request.auth.uid == uid')[1] || '';
  assert.ok(userUpdate.includes('itemPrice('), 'user wallet update not tied to catalog price');
  assert.ok(userUpdate.includes('available == true'), 'unavailable items purchasable');
  // no rule may let a client set an arbitrary balance
  assert.ok(!/allow write: if signed\(\)/.test(walletBlock), 'wallet has an open write rule');
  assert.ok(/allow delete: if false;/.test(walletBlock), 'wallet deletable');
});

check('inventory is create-only and priced from the catalog', () => {
  const inv = rules.slice(rules.indexOf('match /inventory/'), rules.indexOf('match /orders/'));
  assert.ok(/allow create: if signed\(\) && request\.auth\.uid == uid/.test(inv), 'inventory create not owner-scoped');
  assert.ok(/allow update, delete: if false;/.test(inv), 'inventory is mutable/removable');
  assert.ok(/request\.resource\.data\.price == itemPrice\(itemId\)/.test(inv), 'inventory price not authoritative');
  assert.ok(/request\.resource\.data\.itemId == itemId/.test(inv), 'inventory doc id not bound to itemId');
});

check('order ledger is append-only with server-recomputed total', () => {
  const ord = rules.slice(rules.indexOf('match /orders/'));
  assert.ok(/allow update, delete: if false;/.test(ord), 'orders are mutable');
  assert.ok(/request\.resource\.data\.total == request\.resource\.data\.unitPrice \* request\.resource\.data\.qty/.test(ord),
    'order total not recomputed');
  assert.ok(/request\.resource\.data\.unitPrice == itemPrice\(/.test(ord), 'order unitPrice not authoritative');
  assert.ok(/request\.resource\.data\.uid == request\.auth\.uid/.test(ord), 'order can be filed for another user');
  assert.ok(/currency == 'virtual'/.test(ord), 'order currency not pinned to virtual');
});

check('catalog writes are admin-only and admin roster is client-immutable', () => {
  const admins = rules.slice(rules.indexOf('match /admins/'), rules.indexOf('match /storeItems/'));
  assert.ok(/allow write: if false;/.test(admins), 'clients can write the admin roster');
  const items = rules.slice(rules.indexOf('match /storeItems/'), rules.indexOf('match /wallets/'));
  assert.ok(/allow create, update: if isAdmin\(\)/.test(items), 'catalog not admin-gated');
  assert.ok(/validInt\(request\.resource\.data\.price, 1, 100000000\)/.test(items), 'catalog price unbounded');
});

check('rules are structurally balanced', () => {
  let depth = 0;
  for (const ch of rules) { if (ch === '{') depth++; else if (ch === '}') depth--; }
  assert.strictEqual(depth, 0, 'unbalanced braces in firestore.rules');
});

/* ------------------------------------------- privacy / client hardening */

check('beneficiary number is absent from all client-served code', () => {
  const served = [html, core, ui].join('\n');
  assert.ok(!served.includes('01126664036'), 'beneficiary number leaked into client code');
});

check('wallet and market scripts are loaded by the app', () => {
  assert.ok(/<script src="economy-core\.js"><\/script>/.test(html), 'economy-core.js not loaded');
  assert.ok(/<script src="economy-ui\.js"><\/script>/.test(html), 'economy-ui.js not loaded');
});

check('nascent UI has real navigation entries, not dead buttons', () => {
  assert.ok(/data-social="market"/.test(html), 'no marketplace nav entry');
  assert.ok(/data-social="wallet"/.test(html), 'no wallet nav entry');
});

/* -------------------------------------------------------------- reporting */
run().then(() => {
  const failed = results.filter((r) => r[0] === 'FAIL');
  for (const [state, name] of results) console.log(state + ' — ' + name);
  console.log('\n' + (results.length - failed.length) + '/' + results.length + ' checks passed');
  if (failed.length) process.exit(1);
}).catch((err) => {
  console.error('runner crashed:', err);
  process.exit(1);
});
