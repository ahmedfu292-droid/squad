# The Squad v64 — economy/catalog integrity and test repair

- Synchronized server-authoritative vehicle prices with all 120 catalog entries in `district-core.js`; the previous server map only covered 52 cars, so the remaining catalog cars could not be purchased through the authoritative endpoint.
- Corrected legacy economy tests to read the configured Firebase Functions source at `firebase-functions/index.js`.
- Updated catalog and vehicle-material/cabin assertions that were stale after the catalog expansion and material revisions.
- Preserved the existing app, world, chat, Firebase rules, and visual assets.

## Validation
- `node --check firebase-functions/index.js` passed.
- Focused source/integration tests are run for this build; browser-level tests require a local Playwright Chromium installation and are not represented as passing if the browser is unavailable.
- No live Firebase deployment or production server was accessed or changed.
