# The Squad v132 — Luxury Cockpit & Interactive Vehicles

- Enhanced procedural vehicle cabins with seat bolsters, trim accents, seat belts, air vents, cup holders, and driver pedals.
- Added separate hinged door panels to non-bike vehicle meshes.
- Press `E` while driving to toggle the hinged door panels open/closed; the existing `E` exit prompt remains available when not driving.
- Kept existing vehicle profiles, city structures, palace, villas, roads, social spaces, and multiplayer vehicle state unchanged.
- These are procedural game details, not OEM interior scans or exact manufacturer CAD assets.

## Validation
- `node --check district.js`
- `node tests/v39_vehicle_cabin_test.js`
- `node tests/v132_cockpit_interaction_test.js`
- Browser visual verification and device FPS testing remain necessary.
