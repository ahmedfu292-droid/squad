# The Squad v128 — Living City & Expanded Showroom

- Added instanced boulevard hangout furniture (benches, planters and foliage) along existing wide roads to create social micro-plazas.
- Expanded both existing showroom layouts to a 3×3 premium display featuring Cadillac Escalade-V, Range Rover SV, BMW X6 M Competition, Mercedes-AMG G 63, Ferrari SF90, Bugatti Chiron, Rolls-Royce Phantom, McLaren 750S and Mercedes-Benz S-Class.
- Kept the existing city blocks, palace, villas, roads, collision map, account/economy IDs, Firebase rules and multiplayer systems intact.
- Added cache-busting release metadata for v128.

## Performance notes
- New city props use InstancedMesh rather than one draw call per component.
- This is a code-level optimization, not a measured FPS claim. Browser/device profiling is still required.

## Vehicle asset note
- Vehicle meshes remain procedural game models with distinct proportions; they are not OEM CAD/scan assets or manufacturer-licensed replicas.
