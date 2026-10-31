# The Squad v105 — Final Validation Gate

## What changed in v105
- Corrected the browser-test runner paths: it now serves the project root and loads `tests/fakefb.js` from its actual location.
- Updated Service Worker cache and `version.json` to v105.
- Added `tests/v105_final_validation_test.js` to guard the security invariants already present in v104.
- Preserved Firebase config, Firestore/Storage rules, economy functions, chat, calls, city, cafe and vehicle assets.

## Verified in this build
- Static regression test v105.
- Existing v103 and v104 chat/rules static tests.
- JavaScript syntax checks for all project JS files.
- ZIP integrity.

## Release blockers — not claimed fixed
1. `usernames/{name}` still contains `sid` and signed-in users can `get` the document. This exposes the private account number to authenticated users. A server-side username/password sign-in flow is needed before removing the field without breaking legacy login.
2. Group unread counters are still updated in a shared chat document. Firestore Rules currently limit changed keys to group members but cannot safely iterate every changed map entry to prove every increment is legitimate. A per-member metadata subcollection or trusted server endpoint is required.
3. Existing message media is still base64 in Firestore. Migration to Storage requires a resumable migration and private Storage rules; old media has not been moved.
4. App Check, TURN credentials, Push Worker URL and budget alerts are not activated by this source-only build.
5. Emulator-backed Firestore/Storage rules tests and live two-account tests have not run in this environment.

## Browser harness
The browser harness previously failed before running because it referenced a non-existent `site/` directory and root `fakefb.js`. Those paths are corrected. This environment's Chromium policy blocks both localhost and file navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`), so the UI harness could not be executed here. It can be run on a normal local Windows machine after installing the documented Playwright browser dependency.

## Release decision
**NOT APPROVED FOR PUBLIC RELEASE.** v105 is a validation and test-infrastructure update, not proof that every security item is closed. Do not deploy Firestore/Storage rules or migrate live data based only on this report.
