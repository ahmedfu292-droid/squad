# The Squad v118 — Bank Loading & Mobile Performance

## Changes
- Bank opening now explicitly requests the authoritative `economyGet` state instead of showing stale zero balances when the initial load failed.
- Added a 12-second request deadline, a clear Arabic error state, and a retry action. The bank no longer leaves the player staring at an indefinite loading state.
- Deposit, withdrawal, bank transfer, and asset-transfer controls remain disabled while the bank state is loading.
- Preserved the existing Firebase Functions region (`europe-west1`), server-authoritative economy calls, and Firestore security rules.
- Kept the mobile renderer's existing 1.0 device-pixel-ratio cap; adaptive resolution now steps down sooner when sustained frame rate is low, while simulation and network updates continue normally.
- Set the city renderer to prefer high-performance GPU operation and avoid preserveDrawingBuffer overhead.

## Important deployment note
This client-side fix cannot deploy Firebase Functions. If the bank reports that `economyGet` is not deployed or times out, the `firebase-functions/` source must be deployed to the correct Firebase project separately. No Firebase project ID or security rules were changed in this package.

## Verification
- `node --check district.js`: PASS
- `tests/v40_economy_security_test.js`: PASS (17/17)
- `tests/v46_city_economy_upgrade_test.js`: PASS
- `tests/v50_environment_reflections_test.js`: PASS after retaining the established mobile DPR cap
- `tests/v84_vehicles_roads_water_test.js`: PASS
- `tests/v87_economy_guardrails_test.js`: PASS
- `tests/v90_world_performance_test.js`: PASS
- `tests/v117_luxury_fleet_test.js`: PASS

Several older repository tests already fail against the untouched v117 baseline (including fake Firebase fixtures and historical source-string assertions). They are not represented as passing here. This package does not claim real-device Android or live Firebase integration testing.
