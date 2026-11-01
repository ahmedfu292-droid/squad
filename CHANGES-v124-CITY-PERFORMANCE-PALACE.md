# The Squad v124 — City performance and palace polish

- Enabled bounding-sphere frustum culling for merged static city geometry batches.
- Reduced procedural ground-map texture generation on mobile (1280px texture and fewer decorative pixels) while retaining desktop texture resolution.
- Reworked adaptive pixel ratio to recover gradually after FPS improves instead of remaining permanently reduced.
- Added low-cost gold/marble floor accents, column details and warm royal-suite finish to the main palace interior.
- Added a dedicated G-Class grille/bumper/light treatment to its existing procedural mesh.

## Important limitations
- Vehicle bodies remain procedural meshes; no licensed OEM GLB assets are bundled. This is not a claim of exact manufacturer geometry.
- No live browser/WebGL or physical-device FPS test was performed in this build environment.
- Firebase configuration and Firestore/Storage rules were not edited.
