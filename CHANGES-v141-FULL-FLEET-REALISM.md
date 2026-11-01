# The Squad v141 — Full Fleet Realism Pass

## Scope
- Preserves all 123 catalog entries, stable vehicle keys, ownership, and server-authoritative purchase prices.
- Adds a lightweight fleet-wide exterior detailing pass to every catalog car: layered front intake/grille, metallic trim, headlamp/DRL accents, hood creases, rocker/sill detail, rear lighting, and archetype-aware SUV roof rails / sport rear aero.
- Keeps the existing procedural cabin for catalog cars: dashboard, instrument/infotainment screens, steering wheel, front/rear seats, console, trim, belts, and pedals.
- Keeps individually hinged door panels and the existing in-car E-key open/close interaction.
- Stops loading generic archetype GLBs over the procedural car body. Those GLBs were replacing the generated cabin and hinged doors. Optional licensed per-vehicle GLB loading remains available only when an authorised asset is supplied.
- Bumps the service-worker cache key and build number to v141.

## Important accuracy note
These are original procedural game models with improved detail, not 123 photorealistic OEM-accurate replicas. No manufacturer CAD or licensed 1:1 vehicle assets are included. The motorcycle remains a separate motorcycle model and does not have car doors/cabin.

## Verification
- JavaScript syntax checks passed for `chanse1/district-core.js` and `chanse2/district.js`.
- Programmatic inspection found 123 catalog entries and valid body/glass geometry for all 123.
- v140 dealership regression test passed.
- v141 fleet test passed: catalog retention, universal detail marker, cabin, hinged doors, and version bump.
- ZIP integrity checked after packaging.
- No browser visual test, live Firebase test, or deployment was performed.
