/* THE SQUAD — v195 social hub core (pure logic, no DOM, no Firebase).
 *
 * Every function here is deterministic and side-effect free so it can be unit
 * tested in Node. The UI layer (squad-social-hub.js) does all IO.
 *
 * Exposed as window.SquadSocialHubCore in the browser and as module.exports
 * under Node.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.SquadSocialHubCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var ONLINE_MS = 2 * 60 * 1000;        // presence heartbeat is written every ~1 min
  var ACTIVE_MS = 30 * 60 * 1000;       // "recently active" window
  var SEARCH_MIN = 2;                   // do not query Firestore for 1 character

  /* Firestore Timestamp | Date | number | {seconds} -> epoch ms (0 when unknown) */
  function toMs(v) {
    if (!v) return 0;
    if (typeof v === 'number') return v > 1e12 ? v : v * 1000;
    if (v instanceof Date) return v.getTime();
    if (typeof v.toMillis === 'function') { try { return v.toMillis() || 0; } catch (e) { return 0; } }
    if (typeof v.seconds === 'number') return v.seconds * 1000;
    if (typeof v.toDate === 'function') { try { return v.toDate().getTime() || 0; } catch (e) { return 0; } }
    return 0;
  }

  function norm(v) { return String(v === undefined || v === null ? '' : v).toLowerCase().trim(); }

  function uniq(list) {
    var seen = {}, out = [];
    (list || []).forEach(function (x) { if (x !== undefined && x !== null && !seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  /* ------------------------------------------------------------------ search */

  /* People search over already-loaded public profiles.
   * Returns [] for queries shorter than SEARCH_MIN characters so the caller can
   * avoid a Firestore round trip. */
  function filterPeople(profiles, query, selfId, limit) {
    var q = norm(query);
    if (q.length < SEARCH_MIN) return [];
    var cap = limit || 24;
    var scored = [];
    (profiles || []).forEach(function (p) {
      if (!p || !p.id || p.id === selfId) return;
      var name = norm(p.name), un = norm(p.un), city = norm(p.city), sid = String(p.sid || '');
      var score = 0;
      if (un === q) score = 100;
      else if (un && un.indexOf(q) === 0) score = 60;
      else if (name && name.indexOf(q) === 0) score = 50;
      else if (un && un.indexOf(q) > -1) score = 30;
      else if (name && name.indexOf(q) > -1) score = 30;
      else if (city && city.indexOf(q) > -1) score = 10;
      else if (sid && sid === q) score = 90;
      if (!score) return;
      if (p.bio) score += 1;
      scored.push({ profile: p, score: score });
    });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return norm(a.profile.name).localeCompare(norm(b.profile.name));
    });
    return scored.slice(0, cap).map(function (s) { return s.profile; });
  }

  /* ------------------------------------------------------------ suggestions */

  /* Score a candidate using only data we actually store: shared city, profile
   * completeness. Nothing here claims to know interests the DB does not have. */
  function scoreSuggestion(me, p) {
    if (!me || !p) return 0;
    var score = 0;
    var city = norm(me.city);
    if (city && city === norm(p.city)) score += 6;
    if (p.bio) score += 2;
    if (p.un) score += 1;
    if (p.name) score += 1;
    if (norm(p.name) === norm(me.name)) score += 0;  // never boost duplicates
    return score;
  }

  function rankSuggestions(opts) {
    opts = opts || {};
    var me = opts.me || {};
    var exclude = {};
    uniq([opts.selfId].concat(opts.friendIds || [], opts.pendingIds || [], opts.blockedIds || []))
      .forEach(function (id) { exclude[id] = 1; });
    var out = [];
    (opts.profiles || []).forEach(function (p) {
      if (!p || !p.id || exclude[p.id]) return;
      out.push({ profile: p, score: scoreSuggestion(me, p) });
    });
    out.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return norm(a.profile.name).localeCompare(norm(b.profile.name));
    });
    return out.slice(0, opts.limit || 10).map(function (s) { return s.profile; });
  }

  /* -------------------------------------------------------------- presence */

  function presenceBucket(lastMs, now) {
    if (!lastMs) return 'unknown';
    var delta = (typeof now === 'number' ? now : Date.now()) - lastMs;
    if (delta < 0) return 'online';
    if (delta <= ONLINE_MS) return 'online';
    if (delta <= ACTIVE_MS) return 'active';
    return 'offline';
  }

  function presenceLabel(bucket) {
    return bucket === 'online' ? 'Online'
      : bucket === 'active' ? 'Active recently'
      : bucket === 'offline' ? 'Offline'
      : 'Status unknown';
  }

  function sortByPresence(list, now) {
    var rank = { online: 0, active: 1, offline: 2, unknown: 3 };
    return (list || []).slice().sort(function (a, b) {
      var ra = rank[presenceBucket(a.lastMs, now)], rb = rank[presenceBucket(b.lastMs, now)];
      if (ra !== rb) return ra - rb;
      return norm(a.name).localeCompare(norm(b.name));
    });
  }

  /* ---------------------------------------------------------- notifications */

  function notificationKind(n) {
    var t = n && n.type;
    if (t === 'friend_request') return { key: 'friend_request', icon: '\u2795', text: 'sent you a friend request', action: 'friends' };
    if (t === 'friend_accepted') return { key: 'friend_accepted', icon: '\u2714', text: 'accepted your friend request', action: 'friends' };
    return { key: 'other', icon: '\u{1F514}', text: 'sent you a notification', action: 'notifications' };
  }

  function groupNotifications(list) {
    var unread = [], read = [];
    (list || []).forEach(function (n) {
      if (!n) return;
      var item = { id: n.id, type: n.type, from: n.from, fromName: n.fromName || 'Member', text: n.text || '', read: !!n.read, ms: toMs(n.createdAt) };
      var kind = notificationKind(n);
      item.icon = kind.icon;
      item.defaultText = kind.text;
      item.action = kind.action;
      (item.read ? read : unread).push(item);
    });
    var desc = function (a, b) { return b.ms - a.ms; };
    unread.sort(desc); read.sort(desc);
    return { unread: unread, read: read, total: unread.length + read.length, unreadCount: unread.length };
  }

  /* ---------------------------------------------------------- friend guard */

  /* Decide whether a friend request may be sent. Mirrors the Firestore Rules:
   * no self requests, no duplicates, and a rejected request may be resent. */
  function friendRequestGuard(opts) {
    opts = opts || {};
    var target = opts.targetId;
    if (!opts.selfId) return { ok: false, reason: 'Sign in to add friends.' };
    if (!target) return { ok: false, reason: 'Unknown account.' };
    if (target === opts.selfId) return { ok: false, reason: 'You cannot add yourself.' };
    if ((opts.blockedIds || []).indexOf(target) > -1) return { ok: false, reason: 'This account is blocked.' };
    if ((opts.friendIds || []).indexOf(target) > -1) return { ok: false, reason: 'You are already friends.' };
    if ((opts.pendingIds || []).indexOf(target) > -1) return { ok: false, reason: 'Request already sent.' };
    return { ok: true, reason: '' };
  }

  /* ------------------------------------------------------------------ time */

  function relativeTime(ts, now) {
    var ms = toMs(ts);
    if (!ms) return '';
    var delta = Math.max(0, (typeof now === 'number' ? now : Date.now()) - ms);
    var m = Math.floor(delta / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm';
    var h = Math.floor(m / 60);
    if (h < 24) return h + 'h';
    var d = Math.floor(h / 24);
    if (d < 7) return d + 'd';
    var w = Math.floor(d / 7);
    if (w < 5) return w + 'w';
    return Math.floor(d / 30) + 'mo';
  }

  /* --------------------------------------------------------- conversations */

  /* Recent conversations, newest last message first, archived/hidden dropped. */
  function recentChats(chats, hiddenIds, limit) {
    var hidden = {};
    (hiddenIds || []).forEach(function (id) { hidden[id] = 1; });
    return (chats || [])
      .filter(function (c) { return c && c.id && !hidden[c.id]; })
      .sort(function (a, b) { return toMs(b.lt) - toMs(a.lt); })
      .slice(0, limit || 5);
  }

  function chatTitle(c, selfId) {
    if (!c) return 'Conversation';
    if (c.type === 'g') return c.nm || 'Group';
    var names = c.names || {};
    var other = (c.members || []).filter(function (m) { return m !== selfId; })[0];
    return (other && names[other]) || c.nm || 'Private chat';
  }

  function unreadFromChats(chats) {
    var total = 0;
    (chats || []).forEach(function (c) {
      var u = c && c.un;
      if (!u) return;
      Object.keys(u).forEach(function (k) { var v = Number(u[k]) || 0; if (v > total) total = v; });
    });
    return total;
  }

  return {
    SEARCH_MIN: SEARCH_MIN,
    ONLINE_MS: ONLINE_MS,
    ACTIVE_MS: ACTIVE_MS,
    toMs: toMs,
    filterPeople: filterPeople,
    scoreSuggestion: scoreSuggestion,
    rankSuggestions: rankSuggestions,
    presenceBucket: presenceBucket,
    presenceLabel: presenceLabel,
    sortByPresence: sortByPresence,
    notificationKind: notificationKind,
    groupNotifications: groupNotifications,
    friendRequestGuard: friendRequestGuard,
    relativeTime: relativeTime,
    recentChats: recentChats,
    chatTitle: chatTitle,
    unreadFromChats: unreadFromChats
  };
});
