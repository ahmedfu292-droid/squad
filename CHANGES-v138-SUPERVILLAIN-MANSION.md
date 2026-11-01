# The Squad v138 — Supervillain Mansion

- Added `mansion_supervillain` to the client estate catalogue in the rich district at `(0, 390)`.
- Set the purchase price to exactly 20,000,000 game coins in both the client display catalogue and the server-owned `ESTATES` price table. Client-supplied prices are still ignored by the server.
- Added a native Three.js mansion compound pass: dark stone and gold trim, private cinema pavilion/screen, gym wing/equipment silhouettes, rooftop lounge terrace, expanded reflecting pool/garden, and reinforced-vault visual detail.
- The mansion uses the project's existing estate ownership, purchase, teleport-to-property and staff systems. It is not a direct GTA V YMAP import.

## Source asset compatibility
The supplied Supervillain's Mansion archive contains GTA V Map Editor XML and YMAP XML plus an ObjectList.ini. The YMAP XML contains about 2,048 entities and depends on GTA V archetypes/object assets. The Squad city is a custom Three.js scene and does not load GTA V YMAP/ObjectList files. Therefore the supplied map was used as a design reference; its original GTA V entities were not copied into the web game.

## Verification
- JavaScript syntax checks: recorded separately in the v138 test report.
- Static source tests only. No browser screenshot, live Firebase purchase, multiplayer session, or visual acceptance test is claimed.
- Deploy the updated Firebase Functions code together with the web files so the server recognizes the new 20,000,000-coin estate ID.
- Reconciled all 12 client estate catalogue entries with the server-owned price table; six previously displayed properties lacked server price entries and would have been rejected by the purchase function.
- Amenity wings and objects are 3D scene dressing at this stage, not independently interactive room interiors.
