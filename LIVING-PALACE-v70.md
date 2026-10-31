# The Squad v70 — Living Palace foundation

## Included in this milestone
- Added a single shared design-token layer for the Living Palace identity (deep black, warm gold, dark red reserved for alerts).
- Added a WebGL2 login environment shader with a warm lamp cone, architectural silhouette, glow, restrained grain and dust.
- Added a Verlet-style hanging lamp cord with pointer/touch dragging; pulling it reveals the existing login/register UI.
- Added a low-cost adaptive render scale for the login scene and a reduced-motion path.
- Kept Firebase authentication, Firestore, Functions, economy, city and vehicle source files intact. No vehicle geometry, materials, paint, reflections, shaders or catalog data were edited.

## Deliberate scope boundary
This is the first implementation milestone, not the complete graphics/engine rewrite. The existing world still uses its current Three.js r128 pipeline. Volumetric fog, full god rays, candle heat distortion, selective bloom/SSAO, baked lightmaps, KTX2/Basis, Draco, occlusion streaming, workers and a global frame-budget quality controller require separate integration against the world and district render loops. They are not claimed as implemented here.

## Validation
- JavaScript syntax checks are run on all project JS files.
- Existing car catalog and Firebase rules are preserved byte-for-byte in this package relative to v69.
- Browser visual and WebGL2 hardware testing remains required on desktop and mobile.
