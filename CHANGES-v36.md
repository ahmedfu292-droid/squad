# The Squad v36 — Mountain estates and luxury district pass

## Implemented in this build
- Added a mountain skyline and five luxury mountain properties (glass ridge villa, Pine Crest villa, Summit palace, Royal Heights estate, Overlook chalet) with a gold/blue architectural style and lightweight geometry.
- Added an in-game estate panel with prices, purchase flow, ownership persistence per local account/browser, and teleport-to-owned-property action.
- Kept the estate ownership UI separate from existing car ownership, wallet, bank, chat, and account systems.
- Preserved all original v34 files and the v35 catalog/network work; this build is additive.

## Car model truth / asset requirement
- The expanded 52-entry catalogue contains real vehicle model names, but the project archive does not include production-quality, exact manufacturer 3D meshes or detailed interiors. Current visual vehicles are procedural class archetypes. They must not be described as authentic OEM models.
- Authentic cars require licensed GLB/glTF assets and interior assets (or authorized conversions) mapped to the catalogue. This archive intentionally does not fabricate those assets or claim they are included.

## Known limitations
- Estate purchases are currently persisted in browser localStorage, not authoritative cross-device Firestore ownership. They are suitable for prototype testing but not secure multiplayer economy; production ownership needs a server-authoritative transaction and security rules.
- The estate architecture is a performance-friendly procedural pass, not a photogrammetric/custom high-detail asset set.
- Browser end-to-end tests could not run because Playwright Chromium is unavailable in the build environment.

## Validation
- `node --check district.js`: passed
- `node --check district-core.js`: passed
- `node tests/v33_core_test.js`: 58/58 passed
- `node tests/v35_catalog_test.js`: passed (52 catalogue entries; legacy showroom retained)
