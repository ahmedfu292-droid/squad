/* THE SQUAD — v184 UI regression check (real browser)
 *
 * Verifies in an actual Chromium page, against the built app in dist/, that:
 *   1. the app boots with no uncaught page errors
 *   2. the Wallet and Marketplace rail entries exist and are real controls
 *   3. activating Wallet paints the economy screen
 *   4. with no Firebase session the screen shows an HONEST error state —
 *      it never renders fake balances or fake catalog items
 *
 * Run: node tests-v184-ui.cjs   (starts its own server on :3100 unless BASE_URL is set)
 */
const assert = require('assert');
const { spawn } = require('child_process');
const { chromium } = require('/opt/appjet/browser/node_modules/playwright');

const OWN_PORT = 3100;
const BASE = process.env.BASE_URL || ('http://127.0.0.1:' + OWN_PORT + '/');
const checks = [];

function pass(name) { checks.push(['PASS', name]); }
function fail(name, err) { checks.push(['FAIL', name + ' :: ' + (err && err.message ? err.message : String(err))]); }

// Self-contained: bring up the app's own static server so the check is one command.
async function startServer() {
  if (process.env.BASE_URL) return null;
  const proc = spawn(process.execPath, ['server.mjs'], {
    cwd: __dirname,
    env: Object.assign({}, process.env, { PORT: String(OWN_PORT) }),
    stdio: 'ignore',
  });
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return proc;
    } catch (_) { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 150));
  }
  proc.kill('SIGKILL');
  throw new Error('server did not become ready on ' + BASE);
}

(async () => {
  const server = await startServer();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
    pass('app loads in a real browser');
  } catch (err) {
    fail('app loads in a real browser', err);
  }

  // 2. rail entries are real, visible buttons
  for (const route of ['wallet', 'market']) {
    try {
      const el = page.locator('#social-rail [data-social="' + route + '"]').first();
      assert.ok(await el.count() > 0, route + ' entry missing from #social-rail');
      assert.ok(await el.isVisible(), route + ' entry not visible');
      pass(route + ' rail entry exists and is visible');
    } catch (err) { fail(route + ' rail entry exists and is visible', err); }
  }

  // 3. activating Wallet paints the economy screen
  try {
    await page.locator('#social-rail [data-social="wallet"]').first().click();
    const host = page.locator('#dr-screen');
    await host.waitFor({ state: 'visible', timeout: 15000 });
    // The economy UI paints asynchronously after the social render event.
    await page.waitForFunction(() => {
      const h = document.getElementById('dr-screen');
      return h && h.textContent && h.textContent.trim().length > 40;
    }, null, { timeout: 20000 });
    const text = (await host.textContent()) || '';
    assert.ok(text.trim().length > 40, 'wallet screen did not render content');
    pass('Wallet screen renders content after activation');
  } catch (err) { fail('Wallet screen renders content after activation', err); }

  // 4. honest state: no Firebase => error/empty state, never fabricated data
  try {
    const text = (await page.locator('#dr-screen').textContent()) || '';
    const honest = /تعذر|لا توجد|لا تملك|فاضي|خطأ/.test(text);
    assert.ok(honest, 'expected an honest error/empty state, got: ' + text.slice(0, 160));
    // A fabricated balance would show a formatted amount with the currency label.
    const walletApi = await page.evaluate(async () => {
      if (!window.SquadEconomy) return 'no-api';
      try { await window.SquadEconomy.getWallet(); return 'resolved'; }
      catch (e) { return 'threw'; }
    });
    assert.ok(walletApi === 'threw' || walletApi === 'no-api',
      'getWallet() resolved without a Firebase session — fake success: ' + walletApi);
    pass('no fake balance without a Firebase session (honest failure)');
  } catch (err) { fail('no fake balance without a Firebase session (honest failure)', err); }

  // 1. no uncaught exceptions during the flow
  try {
    assert.deepStrictEqual(pageErrors, [], 'page errors: ' + pageErrors.join(' | '));
    pass('no uncaught page errors during wallet flow');
  } catch (err) { fail('no uncaught page errors during wallet flow', err); }

  await browser.close();

  const failed = checks.filter((c) => c[0] === 'FAIL');
  for (const [state, name] of checks) console.log(state + ' — ' + name);
  console.log('\n' + (checks.length - failed.length) + '/' + checks.length + ' browser checks passed');
  process.exit(failed.length ? 1 : 0);
})().catch((err) => {
  console.error('runner crashed:', err);
  process.exit(1);
});
