# The Squad v71 — Living Palace Engine milestone

## Implemented in this package
- Added `living-palace-engine.js`, installed against the existing Three.js r128 renderer prototype after its current dynamic loader resolves.
- Added a transparent WebGL2 atmospheric overlay for both 3D world canvases: restrained light shafts, layered atmospheric haze, subtle flame-like shimmer, grain and vignette.
- Added an adaptive render-scale / effects tier controller driven by measured renderer frame rate. It changes renderer pixel ratio without touching scene materials.
- Added opt-in runtime helpers for object distance LOD, `InstancedMesh` construction and worker-backed spatial visibility / A* grid path queries.
- Added `living-palace-worker.js` and service-worker cache entries for the Living Palace runtime files.
- Unified world UI styling around black / warm gold / dark-red-alert design tokens.
- Kept the v70 login lamp and Verlet pull-cord interaction.

## Explicit technical boundaries (not claimed complete)
- The atmospheric shader is a screen-space approximation, not physically integrated volumetric ray marching through the 3D scene.
- Existing world bloom remains the project's current optional UnrealBloomPass in the interior high-quality setting. No new selective bloom masks or SSAO pass has been integrated.
- No baked lightmap atlas, KTX2/Basis texture set or Draco-compressed replacement models were present in the source assets; therefore none were fabricated or applied.
- Existing static interior geometry is already batched by the legacy scene builder in places. The new LOD / InstancedMesh APIs are opt-in and are not automatically applied to unknown objects. True room portal occlusion/streaming needs explicit room boundaries and asset segmentation.
- The worker provides spatial visibility and grid pathfinding APIs; the existing multiplayer movement simulation has not been moved wholesale into a worker because its authoritative player/network state is currently coupled to the main-thread game loop.
- Browser visual testing, real-device frame profiling, multiplayer soak testing and Cloudflare deployment verification remain required.

## Protected files
- All four `assets/models/squad-luxury-*.glb` files are byte-identical to v69.
- `assets/vehicles/` is unchanged.
- `firestore.rules`, `storage.rules`, `.firebaserc` and `firebase.json` are byte-identical to v69.
- No source changes were made to `district.js`, `district-core.js`, the vehicle catalog or vehicle material construction.

## Deployment
Upload the contents of `squad_v68/` as the static site root (not the enclosing ZIP directory). Keep `firebase-functions/` as a separate backend deployment and do not expose Firebase rule files as public website assets. Before production, verify the intended Firebase project ID in `firebase-config.js` and `.firebaserc` against the owner's selected project.
