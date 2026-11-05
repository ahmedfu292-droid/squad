/* THE SQUAD — v195 social hub UI (friends, requests, suggestions, notifications, people search).
 *
 * Ownership model (same as economy-ui.js):
 *   ui2.js owns drRoute/drRender and fires 'squad:social-rendered'.
 *   We listen for that event and paint the 'friends' / 'notifications' routes.
 *   Pure ranking/formatting logic lives in squad-social-hub-core.js so it can be
 *   unit tested in Node without a browser or Firebase.
 *
 * Database contracts used here are exactly the existing Firestore Rules:
 *   users/{uid}/friends/{friendUid}        {uid,name,createdAt}
 *   users/{uid}/friendRequests/{fromUid}   {from,fromName,status,createdAt,updatedAt?}
 *   users/{uid}/notifications/{id}         {type,from,fromName,text,read,createdAt}
 *   publicProfiles/{uid}                   {name,bio?,un?,city?}
 *   presence/{uid}                         {t}   (read may be denied by privacy -> shown as unknown)
 *
 * Nothing here writes wallets, balances or admin data.
 */
(function () {
  'use strict';

  var Core = window.SquadSocialHubCore;
  if (!Core) { console.warn('squad-social-hub: core not loaded'); return; }

  var ROUTES = { friends: 'Friends', notifications: 'Notifications' };

  function db() { return window.firebase && window.firebase.firestore ? firebase.firestore() : null; }
  function auth() { return window.firebase && window.firebase.auth ? firebase.auth().currentUser : null; }
  function me() { return auth(); }
  function uid() { var u = me(); return u ? u.uid : null; }
  function stamp() { return firebase.firestore.FieldValue.serverTimestamp(); }
  function screen() { return document.getElementById('dr-screen'); }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function say(m) { if (window.toast) window.toast(m); else console.warn('[social]', m); }
  function myName() {
    var u = me();
    return String((window.U && window.U.name) || (u && u.displayName) || 'Member').slice(0, 50);
  }

  /* --------------------------------------------------------------- state */
  var state = {
    friends: [], requests: [], notices: [], suggestions: [],
    profiles: null,            // cached public profiles for search/suggestions
    loading: false, error: '', query: '', searching: false, searchResults: [],
    presence: {}, busy: {}
  };

  function reset() {
    state.friends = []; state.requests = []; state.notices = []; state.suggestions = [];
    state.error = ''; state.query = ''; state.searchResults = []; state.presence = {};
  }

  /* ------------------------------------------------------------ data layer */
  function loadFriends() {
    return db().collection('users/' + uid() + '/friends').limit(200).get().then(function (s) {
      state.friends = s.docs.map(function (d) {
        var x = d.data() || {};
        return { id: d.id, name: String(x.name || 'Friend'), ms: Core.toMs(x.createdAt) };
      });
      return state.friends;
    });
  }

  function loadRequests() {
    return db().collection('users/' + uid() + '/friendRequests')
      .where('status', '==', 'pending').limit(50).get().then(function (s) {
        state.requests = s.docs.map(function (d) {
          var x = d.data() || {};
          return { id: d.id, from: x.from || d.id, fromName: String(x.fromName || 'Member'), ms: Core.toMs(x.createdAt) };
        }).sort(function (a, b) { return b.ms - a.ms; });
        return state.requests;
      });
  }

  function loadNotices() {
    return db().collection('users/' + uid() + '/notifications')
      .orderBy('createdAt', 'desc').limit(40).get().then(function (s) {
        state.notices = s.docs.map(function (d) {
          var x = d.data() || {};
          return {
            id: d.id, type: x.type, from: x.from, fromName: String(x.fromName || 'Member'),
            text: String(x.text || ''), read: !!x.read, createdAt: x.createdAt
          };
        });
        return state.notices;
      });
  }

  function loadProfiles(force) {
    if (state.profiles && !force) return Promise.resolve(state.profiles);
    return db().collection('publicProfiles').limit(300).get().then(function (s) {
      state.profiles = s.docs.map(function (d) {
        var x = d.data() || {};
        return { id: d.id, name: String(x.name || 'Member'), un: x.un, city: x.city, bio: x.bio };
      });
      return state.profiles;
    });
  }

  /* Presence is private by design: a denied read is not an error, it is "unknown". */
  function loadPresence(ids) {
    var list = ids.slice(0, 30);
    if (!list.length) return Promise.resolve({});
    return Promise.all(list.map(function (id) {
      return db().doc('presence/' + id).get().then(function (d) {
        return d.exists ? { id: id, ms: Core.toMs((d.data() || {}).t) } : { id: id, ms: 0 };
      }).catch(function () { return { id: id, ms: 0 }; });
    })).then(function (rows) {
      rows.forEach(function (r) { state.presence[r.id] = r.ms; });
      return state.presence;
    });
  }

  function buildSuggestions() {
    var u = me();
    var selfId = uid();
    return loadProfiles().then(function (profiles) {
      state.suggestions = Core.rankSuggestions({
        me: { name: myName(), city: (window.U && window.U.city) || '', bio: (window.U && window.U.bio) || '' },
        selfId: selfId,
        friendIds: state.friends.map(function (f) { return f.id; }),
        pendingIds: state.requests.map(function (r) { return r.id; }),
        profiles: profiles,
        limit: 8
      });
      return state.suggestions;
    });
  }

  function searchPeople(q) {
    if (String(q || '').trim().length < Core.SEARCH_MIN) return Promise.resolve([]);
    return loadProfiles().then(function (profiles) {
      return Core.filterPeople(profiles, q, uid(), 20);
    });
  }

  /* -------------------------------------------------------------- mutations */
  function guard(target) {
    return Core.friendRequestGuard({
      selfId: uid(), targetId: target,
      friendIds: state.friends.map(function (f) { return f.id; }),
      pendingIds: state.requests.map(function (r) { return r.id; }),
      blockedIds: (window.U && window.U.blocked) || []
    });
  }

  function sendRequest(target) {
    var g = guard(target);
    if (!g.ok) return Promise.reject(new Error(g.reason));
    var batch = db().batch();
    batch.set(db().doc('users/' + target + '/friendRequests/' + uid()), {
      from: uid(), fromName: myName(), status: 'pending', createdAt: stamp()
    });
    batch.set(db().collection('users/' + target + '/notifications').doc(), {
      type: 'friend_request', from: uid(), fromName: myName(),
      text: 'sent you a friend request', read: false, createdAt: stamp()
    });
    return batch.commit();
  }

  function acceptRequest(req) {
    var batch = db().batch();
    batch.update(db().doc('users/' + uid() + '/friendRequests/' + req.id), { status: 'accepted', updatedAt: stamp() });
    batch.set(db().doc('users/' + uid() + '/friends/' + req.id), { uid: req.id, name: req.fromName, createdAt: stamp() });
    batch.set(db().doc('users/' + req.id + '/friends/' + uid()), { uid: uid(), name: myName(), createdAt: stamp() });
    batch.set(db().collection('users/' + req.id + '/notifications').doc(), {
      type: 'friend_accepted', from: uid(), fromName: myName(),
      text: 'accepted your friend request', read: false, createdAt: stamp()
    });
    return batch.commit();
  }

  function rejectRequest(req) {
    return db().doc('users/' + uid() + '/friendRequests/' + req.id)
      .update({ status: 'rejected', updatedAt: stamp() });
  }

  function removeFriend(friend) {
    var batch = db().batch();
    batch.delete(db().doc('users/' + uid() + '/friends/' + friend.id));
    batch.delete(db().doc('users/' + friend.id + '/friends/' + uid()));
    return batch.commit();
  }

  function markRead() {
    var unread = state.notices.filter(function (n) { return !n.read; });
    if (!unread.length) return Promise.resolve();
    var batch = db().batch();
    unread.forEach(function (n) {
      batch.update(db().doc('users/' + uid() + '/notifications/' + n.id), { read: true });
    });
    return batch.commit();
  }

  /* --------------------------------------------------------------- rendering */
  function stateBox(kind, text, actionLabel, actionAttr) {
    return '<div class="sq-state is-' + kind + '" role="' + (kind === 'error' ? 'alert' : 'status') + '">'
      + '<p>' + esc(text) + '</p>'
      + (actionLabel ? '<button class="dr-secondary" ' + actionAttr + '>' + esc(actionLabel) + '</button>' : '')
      + '</div>';
  }

  function personRow(p, extra) {
    var ms = state.presence[p.id] || 0;
    var bucket = Core.presenceBucket(ms);
    var initial = String(p.name || 'M').slice(0, 1).toUpperCase();
    return '<div class="sq-person" data-person="' + esc(p.id) + '">'
      + '<span class="dr-avatar" aria-hidden="true">' + esc(initial) + '</span>'
      + '<div class="sq-person-id"><b>' + esc(p.name) + '</b>'
      + '<small>' + (p.un ? '@' + esc(p.un) + ' · ' : '') + esc(Core.presenceLabel(bucket)) + '</small></div>'
      + (extra || '') + '</div>';
  }

  function renderFriends() {
    var el = screen();
    if (!el) return;
    if (!uid() || !db()) { el.innerHTML = stateBox('error', 'Sign in to see your friends.', 'Retry', 'data-hub-refresh'); return; }
    if (state.loading) { el.innerHTML = stateBox('loading', 'Loading your community…'); return; }
    if (state.error) {
      el.innerHTML = stateBox('error', state.error, 'Retry', 'data-hub-refresh');
      return;
    }

    var ordered = Core.sortByPresence(state.friends.map(function (f) {
      return { id: f.id, name: f.name, lastMs: state.presence[f.id] || 0 };
    }));

    el.innerHTML = '<div class="dr-feed">'
      /* requests */
      + '<section class="dr-panel sq-panel"><h3>Friend requests <span class="dr-count">' + state.requests.length + '</span></h3>'
      + (state.requests.length
        ? '<div class="sq-list">' + state.requests.map(function (r) {
            return personRow({ id: r.id, name: r.fromName },
              '<div class="sq-row-actions">'
              + '<button class="dr-primary" data-hub-accept="' + esc(r.id) + '"' + (state.busy[r.id] ? ' disabled' : '') + '>Accept</button>'
              + '<button class="dr-secondary" data-hub-reject="' + esc(r.id) + '"' + (state.busy[r.id] ? ' disabled' : '') + '>Decline</button>'
              + '</div>');
          }).join('') + '</div>'
        : '<p class="sq-muted">No pending requests. New requests will appear here.</p>')
      + '</section>'
      /* friends */
      + '<section class="dr-panel sq-panel"><h3>Your friends <span class="dr-count">' + state.friends.length + '</span>'
      + '<button class="dr-secondary sq-inline-btn" data-hub-refresh>Refresh</button></h3>'
      + (ordered.length
        ? '<div class="sq-list">' + ordered.map(function (f) {
            return personRow({ id: f.id, name: f.name },
              '<div class="sq-row-actions">'
              + '<button class="dr-secondary" data-hub-message="' + esc(f.id) + '">Message</button>'
              + '<button class="dr-secondary" data-hub-unfriend="' + esc(f.id) + '"'
              + (state.busy[f.id] ? ' disabled' : '') + '>Remove</button>'
              + '</div>');
          }).join('') + '</div>'
        : '<p class="sq-muted">You have no friends yet. Accept a request or find people below.</p>')
      + '</section>'
      /* people search */
      + '<section class="dr-panel sq-panel"><h3>Find people</h3>'
      + '<label class="sq-field-label" for="sq-people-query">Name, username or city</label>'
      + '<input class="dr-field" id="sq-people-query" type="search" maxlength="40" autocomplete="off"'
      + ' placeholder="Type at least ' + Core.SEARCH_MIN + ' characters" value="' + esc(state.query) + '">'
      + '<div class="sq-result-list" aria-live="polite">' + searchResultsHtml() + '</div></section>'
      /* suggestions */
      + '<section class="dr-panel sq-panel"><h3>Suggested for you</h3>'
      + (state.suggestions.length
        ? '<div class="sq-list">' + state.suggestions.map(function (p) {
            return personRow(p, '<div class="sq-row-actions"><button class="dr-primary" data-hub-add="'
              + esc(p.id) + '"' + (state.busy[p.id] ? ' disabled' : '') + '>Add friend</button></div>');
          }).join('') + '</div>'
        : '<p class="sq-muted">No suggestions right now. Add more members and suggestions will appear.</p>')
      + '</section></div>';

    var input = document.getElementById('sq-people-query');
    if (input) {
      var timer = null;
      input.addEventListener('input', function () {
        state.query = input.value;
        clearTimeout(timer);
        var q = state.query.trim();
        var out = el.querySelector('.sq-result-list');
        if (q.length < Core.SEARCH_MIN) {
          state.searchResults = [];
          if (out) out.innerHTML = '<p class="sq-muted">Type at least ' + Core.SEARCH_MIN + ' characters.</p>';
          return;
        }
        if (out) out.innerHTML = '<p class="sq-muted">Searching…</p>';
        timer = setTimeout(function () {
          state.searching = true;
          searchPeople(q).then(function (rows) {
            state.searchResults = rows; state.searching = false;
            var box = el.querySelector('.sq-result-list');
            if (box) box.innerHTML = searchResultsHtml();
          }).catch(function (err) {
            state.searching = false;
            var box = el.querySelector('.sq-result-list');
            if (box) box.innerHTML = stateBox('error', err && err.message ? err.message : 'Search failed.', 'Retry', 'data-hub-refresh');
          });
        }, 250);
      });
    }
  }

  function searchResultsHtml() {
    if (state.searching) return '<p class="sq-muted">Searching…</p>';
    if (!state.searchResults.length) {
      return state.query.trim().length >= Core.SEARCH_MIN
        ? '<p class="sq-muted">No members matched that search.</p>'
        : '<p class="sq-muted">Type at least ' + Core.SEARCH_MIN + ' characters to search.</p>';
    }
    return state.searchResults.map(function (p) {
      var g = guard(p.id);
      var label = g.ok ? 'Add friend' : (g.reason.indexOf('already friends') > -1 ? 'Friends' : 'Unavailable');
      return personRow(p, '<div class="sq-row-actions"><button class="dr-primary" data-hub-add="' + esc(p.id) + '"'
        + (g.ok && !state.busy[p.id] ? '' : ' disabled') + '>' + esc(label) + '</button></div>');
    }).join('');
  }

  function renderNotifications() {
    var el = screen();
    if (!el) return;
    if (!uid() || !db()) { el.innerHTML = stateBox('error', 'Sign in to see notifications.', 'Retry', 'data-hub-refresh'); return; }
    if (state.loading) { el.innerHTML = stateBox('loading', 'Loading notifications…'); return; }
    if (state.error) { el.innerHTML = stateBox('error', state.error, 'Retry', 'data-hub-refresh'); return; }

    var groups = Core.groupNotifications(state.notices);
    var now = Date.now();
    var row = function (n) {
      return '<div class="sq-notice' + (n.read ? '' : ' is-unread') + '">'
        + '<span class="sq-notice-icon" aria-hidden="true">' + n.icon + '</span>'
        + '<div class="sq-person-id"><b>' + esc(n.fromName) + '</b>'
        + '<p>' + esc(n.text || n.defaultText) + '</p></div>'
        + '<small>' + esc(Core.relativeTime(n.ms, now)) + '</small></div>';
    };

    el.innerHTML = '<div class="dr-feed"><section class="dr-panel sq-panel">'
      + '<h3>Notifications <span class="dr-count">' + groups.unreadCount + ' new</span>'
      + (groups.unreadCount ? '<button class="dr-secondary sq-inline-btn" data-hub-mark-read>Mark all read</button>' : '')
      + '<button class="dr-secondary sq-inline-btn" data-hub-refresh>Refresh</button></h3>'
      + (groups.total
        ? (groups.unread.length ? '<h4 class="sq-subhead">New</h4><div class="sq-list">' + groups.unread.map(row).join('') + '</div>' : '')
          + (groups.read.length ? '<h4 class="sq-subhead">Earlier</h4><div class="sq-list">' + groups.read.slice(0, 20).map(row).join('') + '</div>' : '')
        : '<p class="sq-muted">No notifications yet. Friend requests and accepted invites appear here.</p>')
      + '</section></div>';
  }

  /* --------------------------------------------------------------- painting */
  function currentRoute() {
    return window.SquadSocialUI && window.SquadSocialUI.getRoute ? window.SquadSocialUI.getRoute() : null;
  }

  function setHeader(route) {
    var t = document.getElementById('dr-title'), s = document.getElementById('dr-subtitle');
    if (t) t.textContent = ROUTES[route] || '';
    if (s) {
      s.textContent = route === 'friends'
        ? 'Requests, friends online and people you may know'
        : 'Friend requests and account activity';
    }
  }

  function loadAll() {
    state.loading = true; state.error = '';
    return Promise.all([loadFriends(), loadRequests(), loadNotices()])
      .then(function () {
        state.loading = false;
        return loadProfiles().catch(function () { return []; });
      })
      .then(function () {
        return loadPresence(state.friends.map(function (f) { return f.id; }));
      })
      .then(function () { return buildSuggestions().catch(function () { return []; }); })
      .catch(function (err) {
        state.loading = false;
        state.error = (err && err.message) || 'Could not load your community.';
      });
  }

  function paint() {
    var route = currentRoute();
    if (!route || !ROUTES[route]) return;
    if (!uid() || !db()) { state.loading = false; state.error = 'Sign in to continue.'; }
    setHeader(route);
    if (route === 'friends') renderFriends(); else renderNotifications();
  }

  function refresh(route) {
    return loadAll().then(function () { paint(); return route; });
  }

  // ui2.js fires this after every social render.
  window.addEventListener('squad:social-rendered', function (ev) {
    var route = (ev && ev.detail && ev.detail.route) || currentRoute();
    if (!route || !ROUTES[route]) return;
    reset();
    loadAll().then(function () { paint(); });
  });

  /* ------------------------------------------------------------------ events */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    if (t.closest('[data-hub-refresh]')) { refresh(); return; }

    var acc = t.closest('[data-hub-accept]');
    if (acc) {
      var req = state.requests.filter(function (r) { return r.id === acc.dataset.hubAccept; })[0];
      if (!req) return;
      state.busy[req.id] = true; paint();
      acceptRequest(req).then(function () { say('Friend request accepted'); return refresh(); })
        .catch(function (err) { say((err && err.message) || 'Could not accept the request'); })
        .then(function () { state.busy[req.id] = false; paint(); });
      return;
    }

    var rej = t.closest('[data-hub-reject]');
    if (rej) {
      var rq = state.requests.filter(function (r) { return r.id === rej.dataset.hubReject; })[0];
      if (!rq) return;
      state.busy[rq.id] = true; paint();
      rejectRequest(rq).then(function () { say('Request declined'); return refresh(); })
        .catch(function (err) { say((err && err.message) || 'Could not decline the request'); })
        .then(function () { state.busy[rq.id] = false; paint(); });
      return;
    }

    var unf = t.closest('[data-hub-unfriend]');
    if (unf) {
      var f = state.friends.filter(function (x) { return x.id === unf.dataset.hubUnfriend; })[0];
      if (!f) return;
      var ask = window.SquadDialog && window.SquadDialog.confirm
        ? window.SquadDialog.confirm('Remove ' + f.name + ' from your friends?')
        : Promise.resolve(true);
      ask.then(function (ok) {
        if (!ok) return;
        state.busy[f.id] = true; paint();
        removeFriend(f).then(function () { say('Friend removed'); return refresh(); })
          .catch(function (err) { say((err && err.message) || 'Could not remove this friend'); })
          .then(function () { state.busy[f.id] = false; paint(); });
      });
      return;
    }

    var add = t.closest('[data-hub-add]');
    if (add) {
      var target = add.dataset.hubAdd;
      state.busy[target] = true; paint();
      sendRequest(target).then(function () { say('Friend request sent'); return loadRequests(); })
        .catch(function (err) { say((err && err.message) || 'Could not send the request'); })
        .then(function () { state.busy[target] = false; paint(); });
      return;
    }

    var msg = t.closest('[data-hub-message]');
    if (msg) {
      var id = msg.dataset.hubMessage;
      var name = (state.friends.filter(function (x) { return x.id === id; })[0] || {}).name || 'Friend';
      db().doc('chats/' + [uid(), id].sort().join('_')).get().then(function (d) {
        if (!d.exists) {
          return db().doc('chats/' + [uid(), id].sort().join('_')).set({
            type: 'p', members: [uid(), id], names: (function () {
              var o = {}; o[uid()] = myName(); o[id] = name; return o;
            })(), lt: stamp()
          });
        }
      }).then(function () {
        var nav = document.querySelector('[data-social="messages"]');
        if (nav) nav.click();
      }).catch(function (err) { say((err && err.message) || 'Could not open the conversation'); });
      return;
    }

    if (t.closest('[data-hub-mark-read]')) {
      markRead().then(function () { say('Notifications marked as read'); return refresh(); })
        .catch(function (err) { say((err && err.message) || 'Could not update notifications'); });
    }
  });

  /* ------------------------------------------------------- shell navigation */
  function ensureNav() {
    var rail = document.querySelector('#social-rail .dr-nav');
    if (rail && !rail.querySelector('[data-social="friends"]')) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.social = 'friends';
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.4"/>'
        + '<path d="M2.5 20c.4-3.9 2.8-5.9 6.5-5.9s6.1 2 6.5 5.9"/>'
        + '<path d="M16 5.2A3.4 3.4 0 0 1 16 12M17.5 14.4c2.4.4 3.8 2.3 4 5.6"/></svg>Friends';
      var home = rail.querySelector('[data-social="feed"]');
      if (home && home.nextSibling) rail.insertBefore(b, home.nextSibling); else rail.appendChild(b);
    }
    var actions = document.querySelector('#social-main .dr-actions');
    if (actions && !actions.querySelector('[data-social="notifications"]')) {
      var n = document.createElement('button');
      n.type = 'button';
      n.className = 'dr-icon-btn';
      n.dataset.social = 'notifications';
      n.setAttribute('aria-label', 'Notifications');
      n.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16V11a6 6 0 0 0-12 0v5l-1.6 2.4h15.2z"/>'
        + '<path d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg>';
      actions.appendChild(n);
    }
  }

  function start() {
    ensureNav();
    if (currentRoute() && ROUTES[currentRoute()]) reset(), loadAll().then(paint);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  window.SquadSocialHub = {
    state: state,
    paint: paint,
    refresh: refresh,
    searchPeople: searchPeople,
    sendRequest: sendRequest,
    acceptRequest: acceptRequest,
    rejectRequest: rejectRequest,
    removeFriend: removeFriend,
    markRead: markRead
  };
})();
