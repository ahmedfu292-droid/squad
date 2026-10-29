# The Squad v35 — Online vehicle replication + expanded vehicle catalog

## Changes in this build
- Added an expanded catalog of 52 real-world car model names across luxury sedans, SUVs, sports cars, and hypercars.
- Added metadata for each catalog entry (vehicle class, game price, performance tier, paint colors). Existing seven showroom cars and existing keys are preserved.
- Added optional vehicle-state replication to `district/{room}/players/{uid}`. Other clients interpolate a visible replica of a player's currently driven car.
- Added validation for the optional `car` payload in `firestore.rules`; deploy the updated rules in Firebase before testing multiplayer vehicle sync.
- Kept all files from v34 and added this changelog. The original ZIP is retained separately.

## Important asset limitation
The v34 archive does not contain licensed, production-quality vehicle meshes. The added catalog names real production vehicles, but the additional entries currently use procedural archetype geometry and are **not exact OEM 3D models**. Do not represent them as authentic manufacturer meshes. Exact vehicle appearance and detailed interiors require importing properly licensed GLB/glTF assets into `assets/vehicles/` and mapping them in the model registry.

## Test results
- `node --check district-core.js`: passed.
- `node --check district.js`: passed.
- `node tests/v33_core_test.js`: 58/58 passed.
- Browser tests could not launch because the Playwright Chromium executable is not installed in this environment.
