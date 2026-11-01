# The Squad v136 — Progressive vehicle driving

## Included
- Progressive throttle and rolling resistance instead of instant arcade-like speed changes.
- Brake input that slows the car before reverse is engaged.
- Speed-sensitive steering geometry based on vehicle wheelbase.
- Collision response stops the vehicle instead of bouncing it backward.
- Dedicated touch brake button for mobile; Space acts as brake while driving on keyboard.
- Existing W/S and A/D (or arrow keys) driving controls remain supported.
- Updated service-worker cache key and project version to v136.

## Validation
- JavaScript syntax checks passed for `district-core.js` and `district.js`.
- 64 project test files passed in a merged working copy of the four source folders.
- Focused v136 test covers throttle, steering, braking, and reverse.

## Important asset limitation
This release improves vehicle handling and controls. The 20 fleet vehicles remain the project's custom procedural meshes. The licensed GLB manifest still awaits authorized 3D assets; no GTA/Car Parking/OEM model files were added or falsely represented as included.

## Archive structure
The four `chanse1`–`chanse4` folders are file groups, not four separate deployable sites. Merge their contents into one project directory before deployment, preserving relative paths.
