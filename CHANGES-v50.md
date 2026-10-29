# The Squad v50 — Environment Reflection Pass

- Added a lightweight procedural cubemap generated at runtime, so it does not depend on external downloads or add large texture files.
- Applied environment sampling to automotive paint, glazing, and wheel-rim materials; increased clearcoat response on the paint.
- Kept the existing vehicle geometry, neon selection, and mobile pixel-ratio caps intact.
- This is a stylized local environment reflection, not a scanned HDRI or ray-traced reflection. High-detail replacement vehicle/building meshes still require separately licensed GLB/GLTF assets and visual QA in a browser.

## Checks
- `node --check district.js`
- `node tests/v50_environment_reflections_test.js`
- Previous feature regression tests run separately.
