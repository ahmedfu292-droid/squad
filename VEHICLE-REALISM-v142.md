# The Squad v142 — Maximum Procedural Vehicle Detail Pass

## What changed
- Improved procedural body bevel quality and edge smoothing for catalog vehicles.
- Added layered glass/trim details, window pillars, door shut lines, mirror glass, wiper accents, and additional lamp lenses.
- Added fender-arch lips, tire sidewall rings, rim-edge rings, valve stems, and higher-detail tread/rotor details on non-low-end devices.
- Added cockpit screen layers, console trim, seat bolsters, and stitching accents.
- Kept the existing catalog, pricing, ownership IDs, purchase flow, driving physics, wheel steering, door hinge interaction, and existing procedural brand identity kits.
- Added a device-tier gate so the most expensive tire details are skipped on low-memory/mobile devices.
- Bumped the service-worker cache key to v142.

## Verification
- `node --check chanse2/district.js` — passed.
- `node --check chanse1/district-core.js` — passed.
- `node --check chanse2/sw.js` — passed.
- `node chanse2/tests/v142_vehicle_realism_pass_test.js` — passed 11/11.
- `node tests-v140-dealerships.js` — passed.
- ZIP integrity checked after packaging.

## Honest limitations
These are detailed procedural Three.js models, not manufacturer CAD, photogrammetry, or 123 exact OEM replicas. Visual browser QA, real-device performance testing, and live Firebase/deployment testing have not been performed in this package.
