# The Squad v37 — Luxury bank and residences pass

## Added
- Restyled the existing bank overlay with a more premium dark navy / gold visual system, improved spacing, responsive sizing, clearer account summary, and transaction history presentation.
- Added additional deposit and withdrawal presets (5, 50, 500, and all) while retaining existing 5/all actions.
- Added a new apartment residences panel with four tiers: Classic, Skyline, Signature, and Royal Penthouse.
- Added purchase state, wallet deduction, local persistence per signed-in user/browser, and teleport into the existing flats building at the selected floor.
- Preserved existing bank and estate selectors and all source files from v36; changes are additive within district.js plus this changelog.

## Validation
- `node --check district.js`: passed.
- `node --check district-core.js`: passed.
- `node tests/v33_core_test.js`: 58/58 passed.
- `node tests/v35_catalog_test.js`: passed (52 catalog entries; legacy showroom retained).
- Browser end-to-end validation was not run because Playwright Chromium is unavailable in this environment.

## Important limitations
- Bank balances and apartment ownership remain browser-local prototype data, not authoritative cross-device multiplayer state. Production economy and ownership need server-side Firestore transactions and suitable security rules before public deployment.
- Bank UI and apartments use the current procedural world geometry; they do not add custom high-detail 3D architectural assets.
- The car catalog names real production models, but exact OEM meshes and detailed interiors are not included in the original archive. Authentic models require licensed assets.
- Added subtle gold architectural reveals and mullions to the main building facades, emphasizing the bank, residences, palace, and showroom without adding high-cost external dependencies.
- Enhanced the existing apartment floors with lounge seating, rugs, warm gold accents, and plant details; enhanced the bank vault floor with a private-client lounge treatment.
- Added `tests/v37_luxury_test.js` covering the bank theme, transaction presets, apartment tiers, ownership flow, and facade finish markers.
- Added champagne-gold facade accents to key buildings, bronze/gold details to street lamps, and decorative gold/blue rings plus low-count bollards around the central fountain plaza.
- Shifted the main palace from magenta neon accents to a coordinated champagne-gold, deep-navy, and ice-blue palette closer to the supplied Dream Palace reference.
- Added a compact City Services hub so estate, apartment, and car-dealership controls do not crowd the multiplayer HUD on smaller screens.
- Added an in-game Luxury Motor Gallery for all 52 catalog entries, purchase/ownership state, and a callable spawn API that places purchased catalog vehicles at an open showroom forecourt position so they can be entered and driven.
- Catalog vehicles are now part of the active physics/car list when spawned, and their driven state can use the existing player vehicle replication path. Parked vehicles are still local-only, and the extra vehicles still use procedural archetype geometry until licensed OEM GLB assets are supplied.
- Added purchasable guard and servant slots for owned mountain estates (up to three of each per property), with local persistence and visible staff characters restored when the world is loaded. These are prototype NPC placements; patrol/interaction AI and cross-device ownership are not yet implemented.
- Added deterministic size/proportion variants across catalog vehicles, so each catalog entry is not simply a byte-for-byte duplicate of one of four base silhouettes. This improves variety but is still not an authentic model-specific OEM mesh.
