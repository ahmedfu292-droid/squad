# The Squad v83 — Photoreal City Materials

## City visual upgrade
- Replaced the procedural filler-building Lambert finish with physically based standard materials.
- Added deterministic facade roughness and bump maps for subtle panel seams, surface grain and varied reflection response.
- Added a dedicated city reflection probe with a skyline and warm window lighting; it is separate from the vehicle reflection cubemap.
- Added PBR material batches for architectural stone plinths, anodized metal reveals, balcony rails and selected glass panels.
- Added soft directional shadows on supported desktop WebGL2 devices; mobile devices keep shadows disabled and use a lower pixel-ratio cap.
- Kept the city geometry batched to avoid one draw call per facade detail.

## Protected areas
- Vehicle models, vehicle geometry and vehicle material definitions were not edited.
- Chat, Firebase configuration/rules, economy and district-core logic were not edited.
- All v82 project files are retained; only v83 documentation and test files are added.

## Validation scope
- JavaScript syntax checks and all project test suites are run in the project root.
- ZIP integrity and file-by-file comparison against v82 are checked.
- No live browser/WebGL screenshot, device FPS benchmark, multiplayer session or Firebase deployment test is claimed.
