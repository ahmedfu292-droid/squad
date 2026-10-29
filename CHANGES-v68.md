# The Squad v68 test build

## Included
- Stable-ID compatibility checks for the 120-car client catalog and server price table.
- `transferAsset` now normalizes legacy `catalog_N` car IDs to stable IDs, and moves the compatibility alias together with the stable ownership flag.
- SUV GLB material pass: physical clearcoat paint, glass, rubber, and metallic wheel materials inferred from mesh names; SUV mesh shadow flags enabled.
- GLB wheel meshes are collected for the existing wheel-spin update loop when their mesh names identify wheels/tires.
- Firebase config now explicitly includes Firestore and Storage rules and local Functions/Firestore emulator ports.
- Added `tests/v68_economy_compat_test.js`.

## Tests run in this build environment
- `node --check district.js`: passed.
- `node --check firebase-functions/index.js`: passed.
- `tests/v35_catalog_test.js`: passed (120 catalog entries).
- `tests/v40_economy_security_test.js`: passed (17/17).
- `tests/v49_automotive_pbr_test.js`: passed (10/10).
- `tests/v50_environment_reflections_test.js`: passed (9/9).
- `tests/v68_economy_compat_test.js`: passed (120 unique stable IDs, all server price keys present, transfer alias safeguards present).
- `tests/v33_core_test.js`: 86/87; one known stair path fails in the palace building at approximately x=69.1, z=378.9. This is NOT marked fixed.

## Not verified yet
- Firebase Emulator purchase/transfer flows were not run against a live emulator in this build environment.
- Live Firebase authentication/database and deployment were not tested.
- SUV GLB materials and wheel motion need visual in-browser testing. GLB source meshes are generic archetypes; this patch does not create 120 unique OEM vehicle models.
- Full Python test runner could not start because its fixed local port 8765 was already occupied.

This is a test build for review, not a claim that every final acceptance check has passed. Keep a backup and test on a staging project before production deployment.
