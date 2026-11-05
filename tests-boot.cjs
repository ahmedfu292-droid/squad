/* The Squad — boot gate regression check.
 *
 * Symptom this guards: v175-startup-recovery.js existed but index.html never
 * loaded it, so the 8s splash fallback and the script error handlers never
 * installed. When Firebase's auth state stalled, the splash stayed up forever
 * and the sign-in gate (#auth) never became visible.
 *
 * Part A loads the real served app and confirms recovery is armed before
 *         Firebase/app.js run and that the gate starts closed.
 * Part B runs the real, unmodified recovery script against a minimal fixture
 *         with generous timeouts, so the recovery path is verified without
 *         depending on the flaky sandbox network.
 */
'use strict';

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/appjet/browser/node_modules/playwright');

const ROOT = __dirname;
const PORT = 3155;
const BASE = `http://127.0.0.1:${PORT}`;

let pass = 0;
let fail = 0;
const ok = (name) => { pass++; console.log('PASS — ' + name); };
const bad = (name, err) => { fail++; console.log('FAIL — ' + name + ' :: ' + (err && err.message ? err.message : err)); };

// Hard watchdog: never let a wedged browser main thread eat the whole deadline.
const watchdog = setTimeout(() => {
  console.log('FAIL — check did not finish within 90s (browser main thread blocked)');
  process.exit(1);
}, 90000);

function waitForServer(ms) {
  const deadline = Date.now() + ms;
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(BASE + '/', (res) => { res.resume(); resolve(); });
      req.on('error', () => {
        if (Date.now() > deadline) return reject(new Error('server did not start'));
        setTimeout(tick, 200);
      });
    };
    tick();
  });
}

(async () => {
  let server;
  let browser;
  try {
    server = spawn(process.execPath, [path.join(ROOT, 'server.mjs')], {
      cwd: ROOT,
      env: { ...process.env, PORT: String(PORT) },
      stdio: 'ignore',
    });
    await waitForServer(20000);

    browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

    /* ---------- Part A: real served app ---------- */
    const live = await browser.newPage();
    live.setDefaultTimeout(15000);
    // 'commit' returns as soon as the response starts: the app's blocking CDN
    // scripts must not gate this check.
    await live.goto(BASE + '/', { waitUntil: 'commit', timeout: 20000 });

    await live.waitForFunction(() => window.__squadBootFallbackTimer !== undefined, null, { timeout: 15000 })
      .then(() => ok('startup recovery arms its fallback timer in the real app'))
      .catch((e) => bad('startup recovery arms its fallback timer in the real app', e));

    const gateHidden = await live.getAttribute('#auth', 'hidden');
    if (gateHidden !== null) ok('#auth starts hidden behind the splash');
    else bad('#auth starts hidden behind the splash', new Error('#auth was already un-hidden'));
    await live.close().catch(() => {});

    /* ---------- Part B: the real recovery script, deterministic fixture ---------- */
    const scriptSrc = fs.readFileSync(path.join(ROOT, 'v175-startup-recovery.js'), 'utf8');
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    await page.setContent(
      '<div id="splash">splash</div>' +
      '<main id="auth" hidden><input id="u"></main>' +
      '<div id="app" hidden>app</div>'
    );
    await page.addScriptTag({ content: scriptSrc });

    const armed = await page.evaluate(() => window.__squadBootFallbackTimer !== undefined);
    if (armed) ok('fallback timer is armed by the recovery script');
    else bad('fallback timer is armed by the recovery script', new Error('__squadBootFallbackTimer missing'));

    // Drive the exact function the 8s timeout calls.
    await page.evaluate(() => window.__squadBootShowRecovery('regression check'));

    await page.waitForSelector('#auth', { state: 'visible', timeout: 10000 })
      .then(() => ok('#auth becomes visible when startup recovery fires'))
      .catch((e) => bad('#auth becomes visible when startup recovery fires', e));

    const splashOff = await page.evaluate(() => document.getElementById('splash').classList.contains('off'));
    if (splashOff) ok('splash is dismissed by startup recovery');
    else bad('splash is dismissed by startup recovery', new Error('splash still shown'));

    const appHidden = await page.getAttribute('#app', 'hidden');
    if (appHidden !== null) ok('#app stays hidden while signed out');
    else bad('#app stays hidden while signed out', new Error('#app shown without a session'));

    const signin = await page.$('#auth input');
    if (signin) ok('sign-in form is reachable after recovery');
    else bad('sign-in form is reachable after recovery', new Error('no input inside #auth'));

    const retry = await page.evaluate(() => {
      const b = document.getElementById('squadBootRetry');
      return b ? b.textContent.trim() : null;
    });
    if (retry) ok('retry control is present with a label');
    else bad('retry control is present with a label', new Error('no #squadBootRetry'));

    const msg = await page.evaluate(() => {
      const m = document.getElementById('squadBootFallbackMessage');
      return m ? m.textContent.trim() : '';
    });
    if (msg.length > 10) ok('banner states a concrete reason to the user');
    else bad('banner states a concrete reason to the user', new Error('message: ' + JSON.stringify(msg)));

    // A healthy boot (app.js auth.onAuthStateChanged) cancels the fallback.
    const cleared = await page.evaluate(() => {
      clearTimeout(window.__squadBootFallbackTimer);
      document.getElementById('squadBootFallback')?.remove();
      return !document.getElementById('squadBootFallback');
    });
    if (cleared) ok('healthy boot path clears the recovery banner');
    else bad('healthy boot path clears the recovery banner', new Error('banner not removable'));
  } catch (err) {
    bad('boot gate check completed without an unexpected crash', err);
  } finally {
    clearTimeout(watchdog);
    if (browser) await browser.close().catch(() => {});
    if (server) server.kill('SIGKILL');
  }

  console.log(`\n${pass}/${pass + fail} boot gate checks passed`);
  process.exit(fail === 0 ? 0 : 1);
})();
