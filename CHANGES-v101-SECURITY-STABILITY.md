# The Squad v101 — Security & Stability Foundation

## Changes in this build
- Bumped application version and service-worker cache namespace to v101.
- Added `services-hub.html` to the service-worker precache list so the page is available offline after a successful install.
- Fixed the profile-name HTML injection point in `ui2.js` by escaping the current user's display name before inserting it into markup.
- Replaced placeholder em-dash profile counters with explicit zero values while live counts load.
- Added `tests/v101_foundation_test.js` and updated the v100 audit test to validate forward-compatible version/cache naming.

## Preserved
Firebase config, `.firebaserc`, Firestore/Storage rules, auth, chat, community, calls, world and district source files were retained. No Firebase project ID or production rules were changed.

## Important items not yet safely completed
The following require schema migration, product decisions, credentials, Firebase Emulator/live test accounts, or paid/third-party infrastructure; this build does not claim them fixed:
- Private account ID (`sid`) exposure and open `ids`/`usernames` lookup: moving these safely requires coordinated changes to signup/login, username lookup, account documents, and rules. A rules-only lock would break current flows.
- Chat block enforcement and per-member `seen`/`un` validation: requires inspecting every chat write path and migrating existing chat metadata.
- Moving historical base64 image/audio messages to Storage: requires a migration job and rollback strategy; old messages are preserved.
- Email verification, password reset UX, phone OTP, App Check provider enforcement.
- TURN credentials and Push Worker URL; no secrets or fake endpoints were added.
- Multiplayer room sharding, proximity subscriptions, server-authoritative movement, and Firestore/WebSocket architecture changes.
- CSS consolidation, single-shell redesign, full SVG icon replacement, full accessibility pass, and deployment-folder separation.
- Real browser, two-account, Firebase Rules Emulator, mobile, Lighthouse, and load testing.

## Firebase project
The package currently targets `chatapp-67eb6` in `.firebaserc` and `firebase-config.js`. This build intentionally leaves that unchanged. Do not deploy rules until the actual production project has been confirmed.
