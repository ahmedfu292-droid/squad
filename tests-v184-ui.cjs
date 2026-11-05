/* THE SQUAD — v184 UI regression check (real Chromium, real built app)
 *
 * Verifies against dist/ served by the app's own server:
 *   1. the app boots to a visible gate (#auth when logged out, #app when signed in)
 *   2. Wallet and Marketplace entries exist in the shell markup with real labels
 *   3. without a Firebase session we get an HONEST refusal — getWallet() throws or
 *      the economy API is absent; never a fabricated balance
 *
 * Why one page.evaluate and not locator clicks: while the splash and the Firebase
 * CDN scripts boot, the renderer main thread is busy and Playwright's
 * locator.count()/isVisible() (which take no Node-side deadline) can stall for a
 * long time. A single evaluate is answered as soon as the page is free, so the
 * check fails fast and reports why instead of hanging.
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

// Hard watchdog: a hang must never look like a silent timeout, and a stalled run
// must not leave the browser or the server holding this small box's memory.
let cleanup = () => {};
const watchdog = setTimeout(async () => {
  console.error('[ui] WATCHDOG: exceeded 95s, aborting');
  try { await cleanup(); } catch (_) {}
  for (const [s, n] of checks) console.log(s + ' — ' + n);
  process.exit(1);
}, 95000);
watchdog.unref();

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

  try {
    // domcontentloaded is enough: the CDN <script> tags must not gate the check.
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 });
    step('navigated');
    pass('app loads in a real browser');
  } catch (err) {
    fail('app loads in a real browser', err);
  }

  // The app shows #splash during boot and its own 12s fallback reveals the auth
  // gate, so wait for one of the two real gates rather than a fixed sleep.
  try {
    await page.waitForFunction(
      () => {
        const isShown = (id) => {
          const el = document.getElementById(id);
          if (!el || el.hidden) return false;
          const cs = getComputedStyle(el);
          return cs.display !== 'none' && cs.visibility !== 'hidden';
        };
        return isShown('auth') || isShown('app');
      },
      null,
      { timeout: 40000 },
    );
    step('gate visible');
    pass('boot reaches a visible gate (#auth or #app)');
  } catch (err) {
    fail('boot reaches a visible gate (#auth or #app)', err);
  }

  let state = null;
  try {
    state = await page.evaluate(async () => {
      const shown = (id) => {
        const el = document.getElementById(id);
        if (!el || el.hidden) return false;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const label = (route) => {
        const b = document.querySelector('#social-rail [data-social="' + route + '"]');
        return b ? (b.textContent || '').replace(/\s+/g, ' ').trim() : null;
      };

      let economy = 'absent';
      if (window.SquadEconomy && typeof window.SquadEconomy.getWallet === 'function') {
        try { await window.SquadEconomy.getWallet(); economy = 'resolved'; }
        catch (_) { economy = 'threw'; }
      }

      return {
        authShown: shown('auth'),
        appShown: shown('app'),
        railPresent: !!document.getElementById('social-rail'),
        walletLabel: label('wallet'),
        marketLabel: label('market'),
        economy,
      };
    });
    step('state read');
  } catch (err) {
    fail('page state readable in one round-trip', err);
  }

  if (state) {
    try {
      assert.ok(state.authShown || state.appShown, 'neither #auth nor #app is visible');
      // Exactly one gate: signed in shows the shell, signed out shows sign-in.
      assert.ok(!(state.authShown && state.appShown),
        'sign-in gate and social shell are visible at the same time');
      pass('exactly one gate is visible (' + (state.appShown ? 'signed-in shell' : 'sign-in') + ')');
    } catch (err) { fail('exactly one gate is visible', err); }

    try {
      assert.ok(state.railPresent, '#social-rail is missing from the shell markup');
      pass('social shell rail exists in markup');
    } catch (err) { fail('social shell rail exists in markup', err); }

    for (const [route, text] of [['wallet', state.walletLabel], ['market', state.marketLabel]]) {
      try {
        assert.ok(text !== null, route + ' entry missing from #social-rail markup');
        assert.ok(text.length > 0, route + ' entry has no text label');
        pass(route + ' rail entry present (label: ' + text + ')');
      } catch (err) { fail(route + ' rail entry present', err); }
    }

    try {
      assert.ok(state.economy === 'threw' || state.economy === 'absent',
        'getWallet() resolved without a session — fake success: ' + state.economy);
      pass('no fabricated balance without a Firebase session (economy: ' + state.economy + ')');
    } catch (err) { fail('no fabricated balance without a Firebase session', err); }
  }

  // Errors from the logged-out bootstrap path are expected; only report economy
  // code faults as a wallet regression so this check stays honest and focused.
  try {
    const econErrors = pageErrors.filter((e) => /SquadEconomy|econom/i.test(e));
    assert.deepStrictEqual(econErrors, [], 'economy errors: ' + econErrors.join(' | '));
    pass('no uncaught page errors in the economy code path');
  } catch (err) { fail('no uncaught page errors in the economy code path', err); }

  if (process.env.VERBOSE_PAGE_ERRORS) {
    step('page errors observed during logged-out boot: ' + pageErrors.length);
    for (const e of pageErrors.slice(0, 15)) step('  ' + e);
  }

  await cleanup();
  clearTimeout(watchdog);

  const failed = checks.filter((c) => c[0] === 'FAIL');
  for (const [s, n] of checks) console.log(s + ' — ' + n);
  console.log('\n' + (checks.length - failed.length) + '/' + checks.length + ' browser checks passed');
  process.exit(failed.length ? 1 : 0);
})().catch((err) => {
  console.error('[ui] runner crashed:', err);
  process.exit(1);
});
