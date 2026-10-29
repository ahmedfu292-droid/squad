# The Squad v48 — UHD-style city surface pass

- Upgraded the city ground from a diffuse-only material to a restrained specular Phong material for stronger nighttime surface highlights.
- Added deterministic wet-asphalt microtexture and cool edge glints to road areas in the existing city texture.
- Added low-opacity road-edge light strips to improve street readability at night without introducing real-time reflection probes or costly screen-space effects.
- Kept the existing procedural building/car geometry, gameplay, Firebase files, and prior features intact.

## Scope note
This is an in-engine visual pass, not a complete UHD asset replacement. Buildings and cars remain procedural meshes; true high-detail imported vehicle/building assets and physically based environment reflections are not included in this iteration. Browser visual/performance testing is still required.
