# The Squad v129 — Living World Expansion

## Added
- Added up to 10 compact transit hubs beside selected existing boulevard-side social plaza points.
- Each hub includes an instanced canopy, metal supports, translucent glass panel, bench, route sign and map panel.
- Reuses the v128 plaza placement data, so hubs are positioned relative to existing road-side plaza locations rather than changing the authored city layout.
- All new components use InstancedMesh to keep draw-call growth controlled.

## Preservation
- No existing buildings, palace, villas, roads, parks, showroom plots, or vehicle definitions were removed or repositioned.
- Existing v126/v127 vehicle profiles and v128 social plaza furniture remain in place.

## Validation
- `node --check district.js` passed.
- All Node `*_test.js` files passed after updating legacy version assertions to accept forward-compatible builds.
- Automated checks verify v129 build metadata, transit hub geometry markers, and service-worker cache version.

## Not yet verified
- Browser rendering, visual overlap/placement, real FPS, mobile memory usage, and multiplayer behavior still require runtime testing on target devices.
