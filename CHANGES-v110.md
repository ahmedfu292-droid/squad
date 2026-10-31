# The Squad v110 — Stage 2A: Lazy loading

- `index.html`: removed eager loading of `world.js`, `district-core.js`, and `district.js`; added a deduplicating on-demand script loader.
- `index.html`: city/cafe home shortcuts now load their modules on first use.
- `world.js`: entering the city loads the district core and city module on demand.
- `district.js`: returning to the cafe loads the cafe/world module on demand.
- `sw.js`: removed city/world scripts and four vehicle GLB files from install-time precache. They are fetched when needed and cached after first successful request.
- `version.json`: build 110.

No files or existing features were deleted. `firebase-config.js`, `.firebaserc`, Firestore rules, and Storage rules were not changed.

This is Stage 2A only: the GLB models already load on demand from the vehicle feature; this release stops precaching them at install. Three.js is already dynamically loaded by the existing city/world loaders and was not converted to a new loader.
