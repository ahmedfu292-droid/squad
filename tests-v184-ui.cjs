/* THE SQUAD — v184 UI regression check (real Chromium, real built app)
 *
 * Verifies against dist/ served by the app's own server:
 *   1. the app boots with no uncaught page errors
 *   2. Wallet and Marketplace rail entries exist and are visible controls
 *   3. activating Wallet paints the economy screen
 *   4. without a Firebase session we get an HONEST error/empty state and
 *      getWallet() throws — never a fabricated balance
 *
 * Run: node tests-v184-ui.cjs   (starts its own server on :3100)
 */
const assert = require('assert');
const { spawn } = require('child_process');
const { chromium } = require('/opt/appjet/browser/node_modules/playwright');

const PORT = 3100;
const BASE = process.env.BASE_URL || 'http://127.0.0.1:' + PORT + '/';
const checks = [];

const pass = (n) => checks.push(['PASS', n]);
const fail = (n, e) => checks.push(['FAIL', n + ' :: ' + (e && e.message ? e.message : String(e))]);
const step = (m) => process.stderr.write('[ui] ' + m + '\n');

// Hard watchdog: a hang must not look like a silent timeout in CI.
// Also clears the browser and server child processes it spawned.
let cleanup = () => {};
const watchdog = setTimeout(async () => {
  console.error('[ui] WATCHDOG: exceeded 95s, aborting');
  try { await cleanup(); } catch (_) {}
  for (const [s, n] of checks) console.log(s + ' — ' + n);
  process.exit(1);
}, 95000);
watchdog.unref();

// Bounded wrapper: Playwright's count()/isVisible()/textContent() take no deadline,
// so an unresponsive renderer would hang the runner forever instead of failing.
function withTimeout(promise, ms, label) {
  let timer;
  const guard = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(label + ' did not respond within ' + ms + 'ms')), ms);
  });
  return Promise.race([promise, guard]).finally(() => clearTimeout(timer));
}

async function startServer() {
  if (process.env.BASE_URL) return null;
  const proc = spawn(process.execPath, ['server.mjs'], {
    cwd: __dirname,
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) return proc; } catch (_) {}
    await new Promise((r) => setTimeout(r, 150));
  }
  proc.kill('SIGKILL');
  throw new Error('server not ready on ' + BASE);
}

(async () => {
  const server = await startServer();
  step('server ready');

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  cleanup = async () => {
    try { await browser.close(); } catch (_) {}
    if (server) server.kill('SIGKILL');
  };

  // The app pulls Firebase/Three from CDNs; on a 1-vCPU box that can stall the
  // renderer, so every external host is answered locally with a stub. This keeps
  // the check about THE SQUAD's own code and its honest no-session behaviour.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => {
    const type = route.request().resourceType();
    if (type === 'script') return route.fulfill({ status: 200, contentType: 'text/javascript', body: '/* cdn stub */' });
    return route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
  });

  try {
    // domcontentloaded is enough; the page's CDN <script> tags must not gate us.
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
    step('navigated');
    pass('app loads in a real browser');
  } catch (err) {
    fail('app loads in a real browser', err);
  }

  for (const route of ['wallet', 'market']) {
    try {
      const el = page.locator('#social-rail [data-social="' + route + '"]').first();
      assert.ok((await el.count()) > 0, route + ' entry missing from #social-rail');
      assert.ok(await el.isVisible(), route + ' entry not visible');
      pass(route + ' rail entry exists and is visible');
    } catch (err) { fail(route + ' rail entry exists and is visible', err); }
  }

  try {
    await page.locator('#social-rail [data-social="wallet"]').first().click();
    const host = page.locator('#dr-screen');
    await host.waitFor({ state: 'visible', timeout: 10000 });
    // Economy UI paints after the squad:social-rendered event.
    await page.waitForFunction(() => {
      const h = document.getElementById('dr-screen');
      return h && h.textContent && h.textContent.trim().length > 40;
    }, null, { timeout: 12000 });
    step('wallet painted');
    pass('Wallet screen renders content after activation');
  } catch (err) { fail('Wallet screen renders content after activation', err); }

  try {
    const text = (await page.locator('#dr-screen').textContent()) || '';
    // Honest state wording used by economy-ui.js for error/empty cases.
    assert.ok(/تعذر|لا توجد|لا تملك|فاضي|خطأ/.test(text),
      'expected honest error/empty state, got: ' + text.slice(0, 150));

    const api = await page.evaluate(async () => {
      if (!window.SquadEconomy) return 'no-api';
      try { await window.SquadEconomy.getWallet(); return 'resolved'; }
      catch (_) { return 'threw'; }
    });
    assert.ok(api === 'threw' || api === 'no-api',
      'getWallet() resolved without a session — fake success: ' + api);
    pass('no fake balance without a Firebase session (honest failure)');
  } catch (err) { fail('no fake balance without a Firebase session (honest failure)', err); }

  try {
    assert.deepStrictEqual(pageErrors, [], 'page errors: ' + pageErrors.join(' | '));
    pass('no uncaught page errors during wallet flow');
  } catch (err) { fail('no uncaught page errors during wallet flow', err); }

  await browser.close();
  if (server) server.kill('SIGKILL');
  clearTimeout(watchdog);

  const failed = checks.filter((c) => c[0] === 'FAIL');
  for (const [s, n] of checks) console.log(s + ' — ' + n);
  console.log('\n' + (checks.length - failed.length) + '/' + checks.length + ' browser checks passed');
  process.exit(failed.length ? 1 : 0);
})().catch((err) => {
  console.error('[ui] runner crashed:', err);
  process.exit(1);
});
