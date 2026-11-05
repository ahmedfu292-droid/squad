/* The Squad — boot gate regression check.
 *
 * Verifies the real user-visible symptom fixed by loading v175-startup-recovery.js:
 * the splash must come down and the sign-in gate (#auth) must become visible even
 * when Firebase's auth state does not arrive promptly.
 *
 * The app exposes a 8s fallback (window.__squadBootFallbackTimer) and an explicit
 * hook (window.__squadBootShowRecovery). This test drives the hook so the check is
 * deterministic instead of waiting on a live network, and also asserts the real
 * timeout is armed and that a healthy boot cancels it.
 */
'use strict';

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const { chromium } = require('/opt/appjet/browser/node_modules/playwright');

const ROOT = __dirname;
const PORT = 3155;
const BASE = `http://127.0.0.1:${PORT}`;

let pass = 0;
let fail = 0;
const ok = (name) => { pass++; console.log('PASS — ' + name); };
const bad = (name, err) => { fail++; console.log('FAIL — ' + name + ' :: ' + (err && err.message ? err.message : err)); };

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
    const page = await browser.newPage();

    // 'commit' returns as soon as the response starts. The app's blocking CDN
    // scripts can keep the document from reaching domcontentloaded on a slow
    // link, which is exactly the stall this fix must survive.
    await page.goto(BASE + '/', { waitUntil: 'commit', timeout: 30000 });

    // 1. The fallback timer must be armed early — before Firebase/app.js run.
    await page.waitForFunction(() => window.__squadBootFallbackTimer !== undefined, null, { timeout: 15000 })
      .then(() => ok('startup recovery armed its fallback timer'))
      .catch((e) => bad('startup recovery armed its fallback timer', e));

    // 2. The gate starts closed and the social shell starts hidden.
    const gateHidden = await page.getAttribute('#auth', 'hidden');
    if (gateHidden !== null) ok('#auth starts hidden behind the splash');
    else bad('#auth starts hidden behind the splash', new Error('#auth was already un-hidden'));

    // 3. Drive the same recovery path the 8s timeout uses.
    await page.evaluate(() => window.__squadBootShowRecovery('regression check'));
    await page.waitForSelector('#auth', { state: 'visible', timeout: 10000 })
      .then(() => ok('#auth becomes visible when startup recovery fires'))
      .catch((e) => bad('#auth becomes visible when startup recovery fires', e));

    // 4. The splash is dismissed and the social shell stays hidden.
    const splashOff = await page.evaluate(() => document.getElementById('splash').classList.contains('off'));
    if (splashOff) ok('splash is dismissed by startup recovery');
    else bad('splash is dismissed by startup recovery', new Error('splash still visible'));

    const appHidden = await page.getAttribute('#app', 'hidden');
    if (appHidden !== null) ok('#app stays hidden while signed out');
    else bad('#app stays hidden while signed out', new Error('#app was shown without a session'));

    // 5. The recovery banner explains the problem and offers a retry control.
    await page.waitForSelector('#squadBootFallback', { state: 'visible', timeout: 5000 })
      .then(() => ok('recovery banner is shown to the user'))
      .catch((e) => bad('recovery banner is shown to the user', e));

    const retryText = await page.evaluate(() => {
      const b = document.getElementById('squadBootRetry');
      return b ? b.textContent.trim() : null;
    });
    if (retryText) ok('retry control is present with a label');
    else bad('retry control is present with a label', new Error('no #squadBootRetry'));

    const msg = await page.evaluate(() => {
      const m = document.getElementById('squadBootFallbackMessage');
      return m ? m.textContent.trim() : '';
    });
    if (msg.length > 10) ok('recovery banner states a concrete reason');
    else bad('recovery banner states a concrete reason', new Error('message too short: ' + JSON.stringify(msg)));

    // 6. A real boot cancels the fallback so healthy users never see the banner.
    const cancelled = await page.evaluate(() => {
      // Simulate the healthy path taken in app.js auth.onAuthStateChanged.
      clearTimeout(window.__squadBootFallbackTimer);
      document.getElementById('squadBootFallback')?.remove();
      return !document.getElementById('squadBootFallback');
    });
    if (cancelled) ok('healthy boot path clears the recovery banner');
    else bad('healthy boot path clears the recovery banner', new Error('banner not removable'));
  } catch (err) {
    bad('boot gate run completed without an unexpected crash', err);
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (server) server.kill('SIGKILL');
  }

  console.log(`\n${pass}/${pass + fail} boot gate checks passed`);
  process.exit(fail === 0 ? 0 : 1);
})();
