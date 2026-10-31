# The Squad v58 — Visual Regression Fix

- Started from the latest v57 project archive, preserving all project files and configuration.
- Reverted the v56/v57 procedural vehicle and architecture overlay edits in `district.js` and restored the matching `district-core.js` from the original project archive, removing the extra roof/window/mullion details that could overlap existing meshes.
- This is a visual-regression rollback, not yet the requested high-realism asset pass. No external GLB assets could be downloaded in this runtime, so no claim is made that real vehicle/building models have been integrated.

## Validation
- `node --check district.js` passed.
- `node --check district-core.js` passed.
- Browser rendering/gameplay still requires testing on the user's hosted build; syntax checks do not prove the visual scene is correct.
