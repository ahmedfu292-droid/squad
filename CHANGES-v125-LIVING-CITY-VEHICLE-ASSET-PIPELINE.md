# The Squad v125 — Living City + Licensed Vehicle Asset Pipeline

## City additions
- Added instanced boulevard streetlights along existing major roads.
- Added instanced traffic-signal poles, housings and red/amber/green lenses at existing major crosswalk junctions.
- Kept all existing buildings, roads, parks, palace, villas, showroom placements and collision data unchanged.
- Used instancing to limit draw-call growth; no dynamic point lights were added.

## Vehicle asset pipeline
- Added optional loader for manufacturer-specific GLB assets at `assets/models/licensed/<vehicle-key>.glb`.
- The current procedural vehicle remains the fallback when no asset is supplied or a model fails to load.
- Model axes must be X=length/front, Y=up, Z=width, with the origin at the ground centre.
- Only install models for which the project owner has the appropriate commercial/game redistribution licence. Brand names or model names do not grant permission to use OEM CAD, logos, or third-party 3D models.
- No licensed OEM models were bundled or claimed in this release.

## Known limitation
This release adds city infrastructure and an asset-ready pipeline, not actual licensed manufacturer geometry. The latter requires authorised GLB files and their licence records. Browser/WebGL and device FPS testing remains required.
- Corrected the Ferrari SF90 procedural detail profile identifier so the catalog entry no longer uses an F80-labelled treatment.
- Updated stale catalogue assertions to the actual 123-car catalog (including the motorcycle category); no catalog entries or server prices were changed.
