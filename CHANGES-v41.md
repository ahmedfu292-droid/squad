# The Squad v41 — Palace & Vehicle Detail Pass

This is an incremental visual-geometry pass built on v40. Existing files and features were retained.

## Added
- Palace front portico with column bases/capitals, cornice and triangular pediment.
- Layered roofline, upper pavilion, corner pilasters and a low-cost balcony balustrade.
- Side garage wing, parking-bay markings, reflecting pool and clipped garden beds.
- Shared exterior vehicle cues: side mirrors, flush handles, rocker trim, grille bars, license-plate blocks and dual exhausts.
- Added source-level regression tests for the new geometry and preservation of the cabin/drive systems.

## Validation
- `node --check district.js`
- `node --check district-core.js`
- `node tests/v41_palace_vehicle_detail_test.js`
- Existing v33, v35, v37, v38, v39 and v40 test suites should also be run before packaging.

## Honest limitations
- These are optimized procedural Three.js meshes, not OEM-authentic vehicle meshes or scan-derived interiors.
- Palace additions are exterior geometry; the existing palace furnishing/interior system is retained but this pass does not create a fully walkable multi-room mansion interior.
- Firebase functions and rules still require deployment by the project owner and post-deploy multiplayer testing.
- No claim is made that browser-based end-to-end testing has passed in this environment.
