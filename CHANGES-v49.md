# The Squad v49 — Automotive PBR & Night Lighting Pass

- Replaced the car body paint material with `MeshPhysicalMaterial` using metallic paint, clearcoat, and tuned roughness for tighter highlights.
- Improved glazing with a physically-based clearcoat/reflectivity setup while retaining the existing transparent windows.
- Changed tires, rims, wheel faces, and brake rotors to `MeshStandardMaterial` with material-specific metalness/roughness values.
- Added distinct LED-style headlamp signatures and rear lamp bars to improve car silhouettes at night.
- Preserved the existing procedural car geometry, controls, multiplayer synchronization, bank/economy code, buildings, and neon color cycling.

## Scope and limitations

This is a material and lighting improvement pass, not a replacement with imported high-detail vehicle assets. Environment reflections are still approximated by material highlights and scene lighting; no HDR environment map or reflection probe is bundled. Browser visual/performance testing on desktop and mobile remains necessary.
