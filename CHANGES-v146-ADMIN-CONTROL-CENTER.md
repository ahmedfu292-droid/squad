# The Squad v146 — Admin Control Center

## What changed
- Added a responsive, lightweight administration dashboard for the full platform.
- The dashboard is associated with account ID `1000000000` and is only revealed after a server-side callable confirms that `ids/1000000000` maps to the currently authenticated Firebase UID.
- Added server-side callable endpoints `checkAdminAccess` and `getAdminDashboard` in `chanse4/firebase-functions/index.js`.
- Added aggregated counts for accounts, public profiles, chats, reports, channels, posts, calls, rooms, stories, communities, games, online presence, and active world/district players.
- Added a small recent-reports summary. Private chat message bodies, passwords, phone numbers, and private profile fields are not returned.
- The dashboard refreshes every 60 seconds while open and can be manually refreshed.
- Added responsive CSS and loaded the dashboard assets from `chanse3/index.html`.
- Updated project build and service-worker cache to v146.
- Added a deployable `firebase-functions/package.json` beside the configured v2 function source.

## Required deployment step
The UI and function source are included, but they are not deployed to the user's Firebase project by creating this ZIP. Deploy the functions from the `chanse4` Firebase project directory using the normal Firebase CLI workflow. The account `1000000000` must already exist in Firebase and `ids/1000000000` must map to that account's authenticated UID. If it does not, the dashboard correctly stays locked; do not make the ID a client-side password or add a public Firestore rule.

## Verification
- Node syntax checks passed for the modified JavaScript files.
- `tests-v146-admin-monitor.js`: 11/11.
- `tests-v145-chat-performance.js`: 9/9.
- `tests-v144-performance.js`: 12/12.
- `tests-v143-vip-chauffeur.js`: 9/9.
- `tests-v143-full-fleet.js`: passed; 123 vehicle entries retained.
- `tests-v142-full-fleet.js`: passed; 123 vehicle entries retained.
- `tests-v140-dealerships.js`: passed.
- Browser visual testing, Firebase emulator tests, live Firebase deployment, and live data verification were not performed in this environment.
