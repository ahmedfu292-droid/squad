# The Squad v145 — Chat media and event-driven performance

## Implemented
- Chat attachment downloads are now viewport-aware. Messages carry their Storage path as data attributes and media is fetched only when its message is within roughly one viewport of the visible chat area.
- Scrolling schedules visibility checks through `requestAnimationFrame` and a passive scroll listener, avoiding repeated work during scroll events.
- Removed the eager loop that attempted to download every image/audio attachment in the latest 100 messages as soon as a chat rendered.
- Removed the 2.5-second unread-badge polling timer. Badge refresh now follows the existing message-list render path plus visibility/focus events.
- Bumped the service-worker cache key and project version to v145.
- Updated inherited static regression tests for the new build number/cache key and added a dedicated v145 test.

## Verification performed
- `node --check chanse1/app.js` — passed.
- `node --check chanse3/stage4-chat-ui.js` — passed.
- `node --check chanse2/sw.js` — passed.
- `node tests-v145-chat-performance.js` — 9/9 passed.
- `node tests-v144-performance.js` — 12/12 passed (inherited v144 checks updated for build 145).
- `node tests-v143-vip-chauffeur.js` — 9/9 passed.
- `node tests-v143-full-fleet.js` — passed; 123 vehicles retained.
- `node tests-v142-full-fleet.js` — passed; 123 vehicles retained.
- `node tests-v140-dealerships.js` — passed.

## Not verified
- No browser-based visual or network-throttling benchmark was run.
- No live Firebase project, emulator, authentication, Firestore rules deployment, or Storage deployment was changed or tested.
- This patch improves client-side attachment loading and badge refresh behavior; it does not claim server-side rate limiting or a full Firebase cost/security audit.
