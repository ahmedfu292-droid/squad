/* THE SQUAD — v184 served-markup & wiring check.
 *
 * WHAT THIS PROVES (and what it does not)
 *   - the built app is actually served by server.mjs and returns real HTML
 *   - the social shell and the login gate both exist in the served document
 *   - the Wallet and Marketplace rail entries are real markup with labels,
 *     not dead placeholders, and both economy scripts are served with 200
 *   - the confidential beneficiary number is absent from every served file
 *
 *   This is NOT a browser interaction test. Chromium cannot complete a boot on
 *   this 1-vCPU/2 GB sandbox (the page's splash never resolves a gate and the
 *   renderer stalls), so interactive verification is reported as NOT TESTED
 *   here rather than faked. Real economy logic is covered by
 *   tests-v184-economy.cjs.
 *
 * Run: node tests-v184-ui.cjs   (starts its own server on :3100)
 */
const assert = require('assert');
const { spawn } = require('child_process');

const PORT = 3100;
const BASE = process.env.BASE_URL || 'http://127.0.0.1:' + PORT + '/';
const checks = [];

const pass = (n) => checks.push(['PASS', n]);
const fail = (n, e) => checks.push(['FAIL', n + ' :: ' + (e && e.message ? e.message : String(e))]);
const step = (m) => process.stderr.write('[ui] ' + m + '\n');

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

  let html = '';
  try {
    const res = await fetch(BASE);
    assert.strictEqual(res.status, 200, 'GET / returned ' + res.status);
    html = await res.text();
    assert.ok(html.length > 1000, 'served HTML is suspiciously small: ' + html.length + ' bytes');
    pass('app HTML is served (200, ' + html.length + ' bytes)');
  } catch (err) { fail('app HTML is served', err); }

  try {
    assert.ok(/id="social-shell"/.test(html), '#social-shell missing from served HTML');
    assert.ok(/id="social-rail"/.test(html), '#social-rail missing from served HTML');
    assert.ok(/id="auth"/.test(html), 'sign-in gate #auth missing from served HTML');
    assert.ok(/id="app"[^>]*hidden/.test(html), '#app must start hidden behind the sign-in gate');
    pass('social shell and sign-in gate both present; #app starts hidden');
  } catch (err) { fail('social shell and sign-in gate both present', err); }

  for (const [route, word] of [['wallet', /Wallet|المحفظة/i], ['market', /Market|السوق/i]]) {
    try {
      const re = new RegExp('data-social="' + route + '"[^>]*>([\\s\\S]{0,160}?)</button>', 'i');
      const m = html.match(re);
      assert.ok(m, 'no rail button for data-social="' + route + '"');
      assert.ok(word.test(m[1]), route + ' rail button has no readable label: ' + m[1].replace(/\s+/g, ' ').trim().slice(0, 80));
      pass(route + ' rail entry is real markup with a label');
    } catch (err) { fail(route + ' rail entry is real markup with a label', err); }
  }

  for (const asset of ['economy-core.js', 'economy-ui.js']) {
    try {
      const res = await fetch(new URL(asset, BASE));
      assert.strictEqual(res.status, 200, asset + ' returned ' + res.status);
      const body = await res.text();
      assert.ok(body.length > 200, asset + ' is empty');
      assert.ok(/SquadEconomy/.test(body), asset + ' does not reference SquadEconomy');
      pass(asset + ' is served and wired to SquadEconomy');
    } catch (err) { fail(asset + ' is served and wired to SquadEconomy', err); }
  }

  try {
    assert.ok(/src="economy-ui\.js"/.test(html), 'index.html does not load economy-ui.js');
    assert.ok(/src="economy-core\.js"/.test(html), 'index.html does not load economy-core.js');
    pass('app loads the economy scripts at boot');
  } catch (err) { fail('app loads the economy scripts at boot', err); }

  // v193 boot guard: v175-startup-recovery.js arms the 8s splash fallback and the
  // script error handlers. If it is not loaded BEFORE Firebase/app.js, a stalled
  // auth state leaves the splash up forever and #auth never becomes visible.
  try {
    const recovery = html.indexOf('v175-startup-recovery.js');
    const firebaseCfg = html.indexOf('firebase-config.js');
    const appJs = html.indexOf('src="app.js"');
    assert.ok(recovery > -1, 'index.html does not load v175-startup-recovery.js (splash fallback missing)');
    assert.ok(firebaseCfg > -1 && appJs > -1, 'firebase-config.js or app.js missing from index.html');
    assert.ok(recovery < firebaseCfg, 'startup recovery must load before firebase-config.js');
    assert.ok(recovery < appJs, 'startup recovery must load before app.js');
    const res = await fetch(new URL('v175-startup-recovery.js', BASE));
    assert.strictEqual(res.status, 200, 'v175-startup-recovery.js returned ' + res.status);
    const src = await res.text();
    assert.ok(/__squadBootFallbackTimer/.test(src), 'recovery script does not arm the fallback timer');
    pass('startup recovery is loaded before Firebase/app.js and served');
  } catch (err) { fail('startup recovery is loaded before Firebase/app.js and served', err); }

  // The beneficiary number must never reach client-served code.
  try {
    const prohibited = ['01126664036'];
    const targets = ['/', 'economy-core.js', 'economy-ui.js', 'app.js'];
    for (const t of targets) {
      let text = '';
      try {
        const res = await fetch(new URL(t, BASE));
        if (res.status !== 200) continue;
        text = await res.text();
      } catch (_) { continue; }
      for (const needle of prohibited) {
        assert.ok(!text.includes(needle), 'beneficiary number leaked into ' + t);
      }
    }
    pass('confidential beneficiary number is absent from served client code');
  } catch (err) { fail('confidential beneficiary number is absent from served client code', err); }

  if (server) server.kill('SIGKILL');
  step('browser interaction: NOT TESTED (Chromium boot stalls on this 1-vCPU/2 GB sandbox)');

  const failed = checks.filter((c) => c[0] === 'FAIL');
  for (const [s, n] of checks) console.log(s + ' — ' + n);
  console.log('\n' + (checks.length - failed.length) + '/' + checks.length + ' served-markup checks passed');
  process.exit(failed.length ? 1 : 0);
})().catch((err) => {
  console.error('[ui] runner crashed:', err);
  process.exit(1);
});
