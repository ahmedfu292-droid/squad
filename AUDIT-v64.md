# The Squad v64 — audit notes

## Fixed in this build
- Server-side `CARS` map now contains 120 entries and matches the 120 catalog prices exactly (0 mismatches).
- Economy test scripts now point to `firebase-functions/index.js`, the actual source configured by `firebase.json`.
- Updated stale catalog/cabin/material tests to match the current 120-entry catalog and actual implementation.

## Checks performed
- `node --check` passed for all JavaScript files.
- Economy source security checks passed.
- World/economy integration checks passed, including 120/120 catalog price matching.
- Vehicle cabin and visual-upgrade checks passed.
- Other current source checks passed: v35, v37–v51 except v33 legacy core test.

## Known issue / not claimed as verified
- `tests/v33_core_test.js` still has one failing legacy stair-navigation case in the palace (one scenario remains at y=0 instead of reaching the expected floor); other scenarios in that suite pass. This needs a separate geometry/physics fix and regression test.
- Browser tests could not be run because Playwright Chromium is not installed in this runtime.
- No production Firebase/Cloudflare server was accessed or deployed. Live auth, Firestore rules deployment, multiplayer, bank transfers, and purchases still need a staging/live test by the project owner.
- The 120 labels use four generic GLB archetypes. They are not 120 separate, manufacturer-accurate car models; the SUV reference image is a visual target, not a game-ready mesh.
