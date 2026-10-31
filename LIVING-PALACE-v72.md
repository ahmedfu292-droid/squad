# The Squad — Living Palace v72

## Added in v72
- Renderer adaptation remains isolated from vehicle objects and assets.
- Added explicit vehicle guard, frustum-bounds culling helper, portal-aware room streamer, dynamic-shadow budget helper, animation LOD, optional static-mesh merge helper (requires Three.js BufferGeometryUtils), reusable material pool, and percentile-based frame-budget controller.
- Updated service-worker cache key and version manifest.
- Extended shared black/gold tokens, keyboard focus treatment, and reduced-motion loading treatment.

## Integration contract
The helpers are opt-in. Mark non-vehicle static objects with `userData.lpStatic = true`; attach conservative world-space bounds as `userData.lpCullBounds`; mark intended dynamic shadow casters with `userData.lpDynamicShadow = true`; mark vehicles using the project's existing vehicle metadata or `userData.lpVehicle = true`. Call culling/LOD/streaming from the world update loop rather than per UI frame. Do not call mesh merging on skinned, animated, transparent, morph-target, or vehicle meshes.

## Not falsely claimed as complete
The existing overlay is a lightweight screen-space atmospheric shader, not geometry-aware volumetric ray marching. The package does not contain authored production lightmap atlases, baked PBR environment assets, actual KTX2-compressed scene textures or Draco-compressed new models, a complete SSAO/selective-bloom pipeline, or validated portal visibility data for every room. Those require authored scene assets and visual QA on supported browsers/devices. Helpers/loaders are present where applicable, but the content pipeline is not complete.

## Deployment safety
Do not publish the package as production until Chromium/WebGL2 visual QA, live Firebase environment selection, multiplayer/economy integration, and device performance tests are completed. Keep the prior v69/v70/v71 archives as rollback points.
