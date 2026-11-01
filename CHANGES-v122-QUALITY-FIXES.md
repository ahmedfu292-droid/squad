# The Squad v122 — Quality Fixes

## Preserved
- All v121 project files and existing features are retained; no files were removed.
- `firestore.rules`, `storage.rules`, `firebase-config.js`, `.firebaserc`, and `firebase.json` are byte-for-byte unchanged from v120/v121.
- Existing login/register/password-reset UI and auth implementation remain in place; the lamp-to-login visual sequence is retained.

## Fixes
- Updated historical regression tests that were incorrectly pinned to old v100/v107/v117 release labels so they validate the current build/cache relationship instead.
- Corrected catalog tests to reflect the current 122-car catalog.
- Added server-side economy price entries for the four 2026 catalog IDs: Range Rover SV, Cadillac Escalade-V, BMW X6 M Competition, and Mercedes-AMG G 63.
- Removed the heavy `district-core.js` and `district.js` city modules from service-worker precache. The files remain in the project and continue to load through the existing on-demand loader.
- Updated release metadata and service-worker cache namespace to v122.
- Added an eight-check static login regression test.

## Verification performed
- 52 individual `tests/*_test.js` suites passed.
- Quality gate: 7/7 suites passed.
- Login regression checks: 8/8 passed.
- `node --check` passed for every JavaScript file.
- Firebase security/config files listed above were compared byte-for-byte and unchanged.
- ZIP integrity checked after packaging.

## Not performed
- No browser automation or real Android/iOS visual test (Playwright, Puppeteer, and jsdom are not installed in this environment).
- No live Firebase Authentication / Firestore / Cloud Functions emulator or production test.
- No deployment was performed. Because `firebase-functions/index.js` gained four catalog price entries, deploy the existing Cloud Functions when ready; no Firebase rules upload is required for these changes.
