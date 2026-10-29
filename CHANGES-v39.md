# The Squad v39 — Integrated luxury-world and chat reliability pass

## Game/world additions
- Kept the original v34 project files and carried forward the existing v35 vehicle catalog/network work, v36 mountain estate purchase panel, and v38 estate arrival architecture.
- Added four purchasable apartment tiers and an in-world residences panel; purchased units can be entered on their corresponding floor in the existing flats building.
- Upgraded the bank panel with a premium navy/champagne-gold look and deposit/withdrawal presets (5, 50, 500, or all).
- Added purchasable estate guard/servant slots (up to three of each per owned property) with visible NPC placements and local persistence.
- Added a compact City Services hub, a 52-entry vehicle dealership panel, purchase/ownership flow, and a spawn API so catalog cars can be spawned at the showroom forecourt and driven.
- Added varied dimensions for catalog vehicle archetypes, gold facade accents, warmer metallic streetlight details, a decorated central fountain plaza, and a gold/navy palette for the main palace.
- Added apartment lounge furnishings and private-bank lounge details using existing low-poly procedural geometry.

## Chat reliability
- Changed text sending so the composer is cleared only after Firestore confirms the message batch was committed.
- If the commit fails, the draft remains in the input and local draft storage, and the UI shows a retry hint.
- Forwarded messages now show success feedback only when the send operation succeeds.
- Preserved the existing account, group, reaction, media, voice-note, and call code paths.

## Tests run
- JavaScript syntax checks across project and test JS files: passed.
- `tests/v33_core_test.js`: 58/58 passed.
- `tests/v35_catalog_test.js`: passed; 52 catalog entries retained.
- `tests/v37_luxury_test.js`: 14 checks passed.
- `tests/v38_estate_arrival_test.js`: 7 checks passed.
- `tests/v38_chat_test.js`: 6 checks passed.
- A browser-based Playwright test was attempted, but the environment blocks navigation to the local test server; full browser E2E remains unverified.

## Known limitations that must not be misrepresented
- The 52 added entries are real vehicle model names and can be purchased/spawned, but their visuals still use procedural class archetypes with varied proportions, not authentic OEM meshes. The source ZIP has no licensed branded 3D vehicle models or detailed OEM interiors. Exact appearance and interior interaction require adding legally usable GLB/glTF assets and mapping them into the game.
- Bank balances, apartment/estate ownership, and hired staff remain browser-local prototype state. They are not yet authoritative or synchronized across devices; a secure multiplayer economy needs server-authoritative transactions and matching Firestore security rules.
- Guard/servant NPCs are visible placements; patrol, service behavior, and full interaction AI are not implemented.
- Full visual and multiplayer validation on the live Firebase project has not been performed.
