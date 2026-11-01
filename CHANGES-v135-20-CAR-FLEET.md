# The Squad v135 — 20-Car Fleet Detail Upgrade

## Vehicle work
- Added a lightweight model-specific exterior detail pass for 20 flagship vehicle profiles already present in the v134 catalog.
- Added differentiated trim, bonnet accents, front splitters, rear diffusers, roof rails, side details, rear lighting and selected model-specific aero cues.
- Kept the existing procedural body profiles, vehicle IDs, catalog, showroom, ownership, customization, driving physics and multiplayer integration intact.
- No external game mods, copied game assets, manufacturer logos or third-party model files were added.

## Accuracy and performance
- These remain original procedural game meshes inspired by broad vehicle design cues; they are not OEM CAD, licensed assets or exact manufacturer replicas.
- Detail additions use a small number of shared materials and simple meshes. Actual browser/WebGL visual QA and mobile FPS testing are still required.

## Validation
- `node --check district-core.js`
- `node --check district.js`
- Targeted v126, v131, v134 and v135 fleet regression tests.
