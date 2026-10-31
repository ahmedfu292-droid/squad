# The Squad v62 — vehicle catalog and transparent architecture pass

- Expanded the in-game catalog to the 120 requested vehicle names across luxury sedans/SUVs/coupes, EVs, sports cars, and everyday cars.
- Added local GLB archetype loading for catalog cars: sedan, sport, supercar, and SUV. Each archetype uses its bundled GLB file and falls back to the procedural renderer if loading fails.
- Increased transparency and reduced depth-writing for the estate facade glazing so windows read as glass rather than opaque blue panels.
- Bumped service-worker cache and included the four local GLB assets in its precache list.

## Important limitations
- The four GLBs are lightweight generic category models, not 120 individually accurate manufacturer-specific meshes. Catalog labels are real model names, but visual fidelity varies by category until model-specific licensed GLBs are added.
- Loading the GLTFLoader still requires access to the configured CDN on first load.
- JavaScript syntax and archive integrity were checked. A real browser visual/drive/multiplayer test was not available in this environment, so this is a test build, not a verified final production release.
