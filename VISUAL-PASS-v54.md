# The Squad — Visual pass v54

This update preserves the existing project structure and all existing files.

Changes:
- Rebalanced city lighting with a brighter neutral fill, warmer key light, and less saturated purple fog.
- Reduced renderer pixel ratio to improve frame rate and memory use on older computers.
- Adjusted city road/base colors for better contrast and readability.
- Added lightweight body surfacing details to the existing procedural cars: door seams, hood creases, side vents, sill trim, and a layered front splitter.
- Refined car paint/glass material values without adding large external assets.
- Tuned driving acceleration/braking for more controlled movement in dense streets.
- Removed a duplicated map redraw condition.

Limitations:
- These are procedural geometry improvements, not OEM-accurate licensed car meshes.
- For truly realistic production vehicles, add licensed GLB/GLTF models and map them to the existing car keys while preserving current gameplay/economy integrations.
- Live Firebase deployment is not performed by this archive edit.
