# The Squad v133 — Vehicle Customization Studio

- Added an in-city vehicle customization panel accessible from the new wrench button.
- Supports per-vehicle body paint palettes, rim finishes, small ride-height adjustment, and underglow visibility.
- Custom paint and rim materials are cloned per vehicle to avoid recoloring other vehicles that share cached geometry/materials.
- Saves each vehicle's appearance locally per signed-in user in browser localStorage.
- Existing city, buildings, vehicle catalog, ownership, driving, multiplayer and economy systems are preserved.

## Scope and limitations
- Appearance settings are local to the current browser/device; they are not synchronized to other players or stored in the account backend.
- Ride-height adjustment is a small visual offset, not a suspension/handling physics modification.
- This is a visual customization feature, not a claim of OEM-licensed vehicle geometry.
