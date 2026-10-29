# The Squad — v44 Final Consolidation / Handoff

This package consolidates the source tree carried forward from v43 and includes a final lightweight procedural polish pass for the palace and vehicle meshes.

## v44 additions
- Framed side windows, facade sconces, extended balcony balusters, front steps, and paired planters on buyable estate models.
- Brake caliper details on procedural car wheels.
- Existing procedural cabin, steering/drive synchronization, estate catalog, and Firebase callable economy integration are retained.
- No original source files were intentionally removed.

## Important scope and limitations
- Vehicles and palace architecture in this package are procedural Three.js meshes. This package does **not** include manufacturer-original car models or a set of externally sourced GLB/glTF vehicles. Do not market the 52 catalog entries as 52 authentic high-detail 3D models.
- The palace is an in-world procedural model; these are not baked photorealistic assets and visual fit still needs browser playtesting on target devices.
- Firebase Cloud Functions are included as source. The project owner must deploy functions and Firestore rules to their own Firebase project and test using two authenticated accounts. This archive cannot verify production deployment.
- Do not loosen Firestore rules to make the game appear to work. Keep economy documents client-write-protected and use server-authoritative callable functions.
- Browser-based visual / multiplayer end-to-end testing was not available in this environment. Source-level checks do not prove that production multiplayer is operational.

## Owner deployment checklist
1. Review `functions/index.js`, `firestore.rules`, `firebase.json`, and `.firebaserc` before deployment.
2. Confirm the Firebase project ID and billing/region requirements are correct for your project.
3. Install function dependencies in `functions/` and deploy functions plus Firestore rules using the Firebase CLI.
4. Test with two separate authenticated accounts: duplicate purchases, insufficient balance, concurrent purchase attempts, claim cooldowns, and ownership visibility.
5. Open the game in supported desktop and mobile browsers and visually inspect palace collision/entry, camera, vehicle driving, cabin visibility, and performance.
6. Before public launch, add legally licensed GLB/glTF vehicle and environment assets if photorealistic vehicles are a requirement, and document each asset's license.

## Checks
Run:
- `node --check district.js`
- `node --check district-core.js`
- `node --check functions/index.js`
- `node tests/v44_final_polish_test.js`
- `node tests/v43_palace_car_detail_test.js`
- `node tests/v42_palace_cabin_model_test.js`
- `node tests/v40_economy_security_test.js`
- `node tests/v40_world_economy_integration_test.js`
- `node tests/v33_core_test.js`

This is a final consolidated development handoff, not a claim that production deployment or visual multiplayer QA has already happened.
