# The Squad v42 — Palace Interior & Wheel Geometry

Additive update built on the v41 integrated project. No original project files were removed.

- Replaced the estate's single solid main-house block with a lightweight open-front architectural shell (side walls, rear wall, split front walls and lintel) so the interior can be seen from the approach.
- Added a furnished lounge interior: floor, rug, sofas, side seats, coffee table, feature-wall screen, chandelier and warm wall fixtures.
- Added lightweight wheel face detail to procedural cars: metallic rim lip, brake rotor, six spokes and hub.
- Kept existing vehicle catalog, driving/cabin system, estate purchase/ownership logic and previous facade/landscape details.

## Verification
- `node --check district.js`
- `node tests/v42_palace_cabin_model_test.js`
- Existing project regression suites are run before packaging.

## Honest scope note
These are custom procedural Three.js meshes, not externally authored OEM vehicle meshes or photogrammetric assets. Browser visual QA still requires a browser runtime; Firebase multiplayer still requires deployment and two-account testing by the project owner.
