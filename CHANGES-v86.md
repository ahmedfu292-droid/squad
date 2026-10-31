# The Squad v86 — Camera Collision & Stability

## What changed
- Added a swept follow-camera collision check in `district-core.js`. The camera now samples the complete player-to-camera segment against the existing spatial collision grid and shortens its distance before the first wall, instead of checking only the final camera point.
- Integrated the new collision helper into the city camera in `district.js`.
- Bumped the service-worker cache and `version.json` to `v86-camera-collision-stability`.
- Added `tests/v86_camera_collision_stability_test.js` for wall-crossing, clear-road distance, minimum distance, and stair-flight geometry regression checks.
- Updated older version assertions to expect the v86 cache/version.

## Preserved
- No files from v85 were removed.
- Firebase project/configuration and Firestore/Storage rules were not changed.
- Chat, community, calls, channel and account modules were not changed.
- All four original GLB vehicle model files were not changed.
- Existing city, palace, vehicle, economy and gameplay source remains in place except the two camera integration files above.

## Validation
- 72 JavaScript files passed `node --check`.
- 33 standalone Node test suites passed.
- 2 browser-harness fixtures (`fakefb.js`, `fakefb2.js`) were not run standalone because they require a browser `window` environment.
- Existing `v33_core_test.js` passed 87/87, including stair ascent and elevator checks.
- ZIP integrity verified after packaging.
- Live browser/WebGL and real-device FPS testing were not available in this environment.
