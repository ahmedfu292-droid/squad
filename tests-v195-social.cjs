/* THE SQUAD — v195 social hub check (friends, requests, suggestions, notifications, search).
 *
 * WHAT THIS PROVES
 *   - the pure ranking/formatting logic in squad-social-hub-core.js behaves as
 *     documented (search matching, suggestion ranking, presence buckets,
 *     notification grouping, friend-request guards, unread totals)
 *   - the hub scripts are actually served by server.mjs
 *   - index.html loads the core BEFORE the UI, and the UI stylesheet is linked
 *
 * WHAT THIS DOES NOT PROVE
 *   - live Firestore reads/writes (no credentials in the sandbox) and therefore
 *     no end-to-end friend request between two real accounts
 *   - visual layout: reported as NOT TESTED, not faked
 *
 * Run: node tests-v195-social.cjs   (starts its own server on :3102)
 */
const assert = require('assert');
const { spawn } = require('child_process');
const Core = require('./squad-social-hub-core.js');

const PORT = 3102;
const BASE = process.env.BASE_URL_SOCIAL || 'http://127.0.0.1:' + PORT + '/';
const checks = [];
const pass = (n) => checks.push(['PASS', n]);
const fail = (n, e) => checks.push(['FAIL', n + ' :: ' + (e && e.message ? e.message : String(e))]);
const step = (m) => process.stderr.write('[social] ' + m + '\n');
const NOW = Date.UTC(2026, 10, 5, 12, 0, 0);

async function startServer() {
  if (process.env.BASE_URL_SOCIAL) return null;
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

/* ------------------------------------------------------------------ unit */
function unit() {
  // toMs handles every shape Firestore/profile data can take.
  assert.strictEqual(Core.toMs(null), 0);
  assert.strictEqual(Core.toMs(new Date(NOW)), NOW);
  assert.strictEqual(Core.toMs({ seconds: 5 }), 5000);
  assert.strictEqual(Core.toMs({ toMillis: () => 42 }), 42);
  assert.strictEqual(Core.toMs(1_700_000_000), 1_700_000_000_000); // seconds -> ms
  pass('toMs normalises Timestamp/Date/number shapes');

  const profiles = [
    { id: 'a1', name: 'Layla Nour', un: 'layla', city: 'Cairo', bio: 'hi' },
    { id: 'a2', name: 'Omar Adel', un: 'omar', city: 'Giza' },
    { id: 'a3', name: 'Me', un: 'self', city: 'Cairo' },
  ];
  // too short -> no Firestore round trip
  assert.deepStrictEqual(Core.filterPeople(profiles, 'l', 'a3'), []);
  const exact = Core.filterPeople(profiles, 'layla', 'a3');
  assert.strictEqual(exact[0].id, 'a1', 'exact username must rank first');
  assert.strictEqual(exact.length, 1);
  assert.ok(Core.filterPeople(profiles, 'Cairo', 'a3').every((p) => p.id !== 'a3'), 'self must be excluded');
  assert.strictEqual(Core.filterPeople(profiles, 'omar', 'a3')[0].id, 'a2');
  pass('filterPeople matches username/name/city, enforces SEARCH_MIN and excludes self');

  // suggestions never re-suggest friends, pending requests, blocked or self.
  const sug = Core.rankSuggestions({
    me: { name: 'Me', city: 'Cairo' },
    selfId: 'a3',
    friendIds: ['a2'],
    pendingIds: ['a4'],
    profiles: profiles.concat([{ id: 'a4', name: 'Pending' }, { id: 'a5', name: 'Blocked' }]),
  });
  assert.deepStrictEqual(sug.map((p) => p.id), ['a1'], 'only the open same-city profile may be suggested');
  pass('rankSuggestions excludes self/friends/pending and prefers shared city');

  assert.strictEqual(Core.presenceBucket(NOW - 30 * 1000, NOW), 'online');
  assert.strictEqual(Core.presenceBucket(NOW - 10 * 60 * 1000, NOW), 'active');
  assert.strictEqual(Core.presenceBucket(NOW - 3 * 60 * 60 * 1000, NOW), 'offline');
  assert.strictEqual(Core.presenceBucket(0, NOW), 'unknown');
  assert.strictEqual(Core.presenceLabel('unknown'), 'Status unknown');
  const sorted = Core.sortByPresence([
    { id: 'x', name: 'Off', lastMs: NOW - 5 * 3600e3 },
    { id: 'y', name: 'On', lastMs: NOW - 1000 },
  ], NOW);
  assert.deepStrictEqual(sorted.map((p) => p.id), ['y', 'x'], 'online must sort before offline');
  pass('presence buckets, labels and ordering are deterministic');

  const grouped = Core.groupNotifications([
    { id: 'n1', type: 'friend_request', from: 'a1', fromName: 'Layla', read: false, createdAt: { seconds: NOW / 1000 } },
    { id: 'n2', type: 'friend_accepted', from: 'a2', read: true, createdAt: { seconds: NOW / 1000 - 60 } },
    { id: 'n3', type: 'message', from: 'a2', fromName: 'Omar', read: false, createdAt: { seconds: NOW / 1000 - 120 } },
  ]);
  assert.strictEqual(grouped.unreadCount, 2);
  assert.strictEqual(grouped.total, 3);
  assert.strictEqual(grouped.unread[0].id, 'n1', 'newest unread first');
  assert.strictEqual(grouped.read[0].id, 'n2');
  assert.strictEqual(grouped.unread[0].defaultText, 'sent you a friend request');
  assert.strictEqual(grouped.unread[0].action, 'friends');
  assert.strictEqual(grouped.unread[1].fromName, 'Omar', 'missing fromName falls back to Member only when absent');
  pass('groupNotifications splits read/unread, sorts by time and attaches icon/actions');

  assert.strictEqual(Core.friendRequestGuard({ selfId: 'me', targetId: 'me' }).ok, false);
  assert.strictEqual(Core.friendRequestGuard({ selfId: 'me', targetId: 'x', friendIds: ['x'] }).ok, false);
  assert.strictEqual(Core.friendRequestGuard({ selfId: 'me', targetId: 'x', pendingIds: ['x'] }).ok, false);
  assert.strictEqual(Core.friendRequestGuard({ selfId: 'me', targetId: 'x', blockedIds: ['x'] }).ok, false);
  assert.strictEqual(Core.friendRequestGuard({ selfId: 'me', targetId: 'x' }).ok, true);
  assert.strictEqual(Core.friendRequestGuard({ targetId: 'x' }).ok, false, 'signed-out must be refused');
  pass('friendRequestGuard blocks self/friend/pending/blocked and signed-out callers');

  assert.strictEqual(Core.relativeTime({ seconds: NOW / 1000 - 30 }, NOW), 'just now');
  assert.strictEqual(Core.relativeTime({ seconds: NOW / 1000 - 5 * 60 }, NOW), '5m');
  assert.strictEqual(Core.relativeTime({ seconds: NOW / 1000 - 3 * 3600 }, NOW), '3h');
  assert.strictEqual(Core.relativeTime(null, NOW), '');
  pass('relativeTime formats recent activity in short units');

  const chats = [
    { id: 'c1', type: 'p', members: ['me', 'a1'], names: { me: 'Me', a1: 'Layla' }, lt: { seconds: NOW / 1000 - 100 }, un: { me: 2 } },
    { id: 'c2', type: 'g', nm: 'Squad Dev', lt: { seconds: NOW / 1000 }, un: { me: 5 } },
    { id: 'c3', type: 'p', members: ['me', 'a2'], names: { a2: 'Omar' }, lt: { seconds: NOW / 1000 - 500 }, hiddenFor: ['me'] },
  ];
  assert.strictEqual(Core.chatTitle(chats[0], 'me'), 'Layla');
  assert.strictEqual(Core.chatTitle(chats[1], 'me'), 'Squad Dev');
  const recent = Core.recentChats(chats, ['c3'], 5);
  assert.deepStrictEqual(recent.map((c) => c.id), ['c2', 'c1'], 'newest first, hidden dropped');
  assert.strictEqual(Core.unreadFromChats(chats), 5);
  pass('recentChats/chatsTitle/unreadFromChats match the chat document shape used by app.js');
}

/* --------------------------------------------------------------- served */
async function served(server) {
  let html = '';
  const res = await fetch(BASE);
  assert.strictEqual(res.status, 200);
  html = await res.text();

  for (const asset of ['squad-social-hub-core.js', 'squad-social-hub.js']) {
    try {
      const r = await fetch(new URL(asset, BASE));
      assert.strictEqual(r.status, 200, asset + ' returned ' + r.status);
      const body = await r.text();
      assert.ok(body.length > 500, asset + ' is empty');
      pass(asset + ' is served');
    } catch (err) { fail(asset + ' is served', err); }
  }

  try {
    const core = html.indexOf('src="squad-social-hub-core.js"');
    const ui = html.indexOf('src="squad-social-hub.js"');
    assert.ok(core > -1, 'index.html does not load squad-social-hub-core.js');
    assert.ok(ui > -1, 'index.html does not load squad-social-hub.js');
    assert.ok(core < ui, 'core must load before the UI layer');
    assert.ok(/src="economy-ui\.js"/.test(html), 'economy-ui.js must still load');
    assert.ok(html.indexOf('economy-ui.js') < core, 'hub must load after the economy scripts');
    pass('index.html loads hub core before hub UI, after the economy scripts');
  } catch (err) { fail('index.html loads hub core before hub UI, after the economy scripts', err); }

  // Vite inlines every stylesheet into one hashed bundle, so assert the served
  // CSS bundle contains the hub rules instead of looking for a <link>.
  try {
    const hrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)]
      .map((m) => (m[0].match(/href="([^"]+)"/) || [])[1])
      .filter((h) => h && !/^https?:/.test(h));
    assert.ok(hrefs.length, 'served HTML links no local stylesheet');
    let css = '';
    for (const h of hrefs) {
      const r = await fetch(new URL(h, BASE));
      if (r.ok) css += await r.text();
    }
    assert.ok(css.length > 1000, 'stylesheets are empty');
    assert.ok(/\.sq-person/.test(css), 'hub styles are missing from the served CSS bundle');
    assert.ok(/sq-notice\.is-unread/.test(css), 'unread notification styling missing');
    pass('served CSS bundle contains the v195 hub rules');
  } catch (err) { fail('served CSS bundle contains the v195 hub rules', err); }

  // The hub must not be able to touch balances: no wallet writes in client code.
  try {
    for (const asset of ['squad-social-hub.js', 'squad-social-hub-core.js']) {
      const body = await (await fetch(new URL(asset, BASE))).text();
      assert.ok(!/wallets?|balance|treasury|01126664036/i.test(body), asset + ' references economy internals');
    }
    pass('hub code never touches wallets, balances, treasury or the beneficiary number');
  } catch (err) { fail('hub code never touches wallets, balances, treasury or the beneficiary number', err); }

  if (server) server.kill('SIGKILL');
}

(async () => {
  step('unit checks');
  try { unit(); } catch (err) { fail('hub core unit checks', err); }
  step('served-asset checks');
  const server = await startServer();
  try { await served(server); } catch (err) { fail('served-asset checks', err); }
  if (server) server.kill('SIGKILL');
  step('live Firestore friend-request flow: NOT TESTED (no Firebase credentials in sandbox)');

  const failed = checks.filter((c) => c[0] === 'FAIL');
  for (const [s, n] of checks) console.log(s + ' — ' + n);
  console.log('\n' + (checks.length - failed.length) + '/' + checks.length + ' social hub checks passed');
  process.exit(failed.length ? 1 : 0);
})().catch((err) => {
  console.error('[social] runner crashed:', err);
  process.exit(1);
});
