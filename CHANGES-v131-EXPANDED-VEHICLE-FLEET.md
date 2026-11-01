# The Squad v131 — Expanded Vehicle Fleet

- Added 12 dedicated model profiles: Lamborghini Urus, Ferrari Purosangue, Aston Martin DBX707, Bentley Bentayga, Land Rover Defender 130, Porsche 911 GT3 RS, Chevrolet Corvette C8 Z06, Koenigsegg Jesko, Pagani Huayra, Ford Mustang Dark Horse, Audi RS6 Avant, and Porsche Taycan.
- Added distinct procedural body-silhouette families for performance SUVs, squared luxury SUVs, sports coupes, and grand-tourer/sport-sedan forms.
- Added original front/rear fascia, lighting, grille, lower intake, rocker, and aero details for the additional models.
- Kept existing city structures, palace, villas, roads, social spaces, and existing car catalog entries intact.
- These are original stylized procedural game meshes inspired by broad vehicle classes and proportions. They are not manufacturer OEM CAD, exact replicas, or officially licensed brand assets.

## Validation
- `node --check district-core.js`
- `node --check district.js`
- Existing v117, v126, v127, v128, and v129 vehicle/city regression tests.
- New `tests/v131_expanded_brand_vehicle_test.js` validates all 12 profiles, dimensions, unique style identifiers, and generated body/glass geometry.
- Browser rendering, mobile FPS, and real multiplayer performance still require in-game testing.
