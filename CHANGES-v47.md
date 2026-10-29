# The Squad v47 — visual and vehicle materials upgrade

- Added an in-game neon selector for blue, pink, green, gold and white lighting. It updates the player's existing cars and remote player car objects currently rendered in the district.
- Added subtle neon side strips to procedural vehicle models and made underglow color configurable.
- Updated vehicle paint to physically based standard materials with metallic paint and adjustable roughness; improved glass material roughness/transparency for a more convincing stylized reflection response.
- Enabled ACES filmic tone mapping and sRGB output encoding when supported by the bundled Three.js renderer.
- Added low-intensity blue and warm accent lights to the night city and reduced the renderer pixel-ratio cap slightly to help performance.
- Preserved all v46 files and gameplay features; added one regression test file.

## Limits
These changes improve the existing procedural assets; they do not import new high-poly vehicle meshes or a real reflection-probe/HDR environment. Visual appearance depends on the bundled Three.js version and device GPU. Browser-based visual QA and live Firebase deployment tests remain to be performed.
