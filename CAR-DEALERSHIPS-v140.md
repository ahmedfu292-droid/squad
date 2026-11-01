# The Squad v140 — Five luxury dealerships

- Replaced the two legacy showroom map entries with five dedicated dealership buildings.
- Each dealership is three floors tall and has an elevator, display plinths, floor signage, sales staff, reception staff, and a floor manager.
- Added a new access road along the dealership district.
- Organized the 20 requested global marques into five groups of four.
- Reworked the in-game car shop to start with a 20-brand selector instead of dumping the full vehicle list on screen.

## Important limitations
- The 123 stable catalog IDs and server price entries are retained internally to preserve existing player ownership and economy compatibility. They are no longer presented as one giant list; players browse by brand. This is not a destructive removal of legacy inventory.
- Several brands currently have few or no matching model entries (for example Jeep). Those require new catalog records and matching server-side price entries before they can be purchased.
- The vehicles and dealership architecture are procedural Three.js assets. No licensed OEM GLB/GLTF vehicle models or high-fidelity employee character assets were included in the source archive, so this version does not claim photorealistic manufacturer-authentic vehicles or humans.
- Static JavaScript syntax and district data checks passed. No live browser, Firebase, or visual GPU test was performed.
