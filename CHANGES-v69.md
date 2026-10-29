# The Squad v69 — performance-focused package

Built from the existing v68 package; this is a practical optimization pass, not a claim that every online feature is verified.

## Changes made
- Reduced the default renderer pixel-ratio cap for the 3D district and social room to lower GPU load on older computers.
- The social room now defaults to lightweight quality when `navigator.deviceMemory` reports 4 GB or less; a previously saved user quality choice is preserved.
- Reduced the district's multiplayer position-send frequency from about 10 to about 6.7 updates per second.
- Throttled coin proximity checks to run at most about 6 times per second instead of every animation frame.
- Updated `version.json` to identify the package as v69.

## Validation status
- Run the included JavaScript syntax and catalog/economy tests before deploying.
- Known v68 issue retained: one palace stair route test failed near x=69.1, z=378.9. It is not represented as fixed in this package.
- Live Firebase / emulator purchase-transfer tests and browser visual verification still need to be performed in the user's environment. Do not deploy rules to production without reviewing them and testing against a staging project first.

## Start
Open the `squad_v68` folder as the site root for local preview or deploy its contents to the existing static hosting target. Keep your current deployment as a rollback copy until the smoke test passes.
