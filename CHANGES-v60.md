# The Squad v60 — bundled GLB SUV prototype

- Added `assets/models/squad-luxury-suv.glb`, a locally bundled, custom-built generic SUV mesh with separate body, glazing, trim, lights, door handles, roof rails, tires, and wheel hubs.
- Added a Three.js r128-compatible GLTFLoader path for vehicles whose catalog archetype is `suv`. The existing procedural car remains visible if the loader or GLB asset fails.
- The GLB model is scaled to each SUV archetype's existing dimensions. Vehicle physics, network state, and collision code remain in `district-core.js` unchanged.
- Existing Three.js rendering settings and project files are retained.

## Important limitations

- This is an original, lightweight custom GLB model, not a downloaded OEM/manufacturer car model and not a photoreal scan. It is a geometry upgrade/prototype intended to replace the generic SUV appearance; the non-SUV catalog cars still use the project's procedural geometry.
- The loader script is fetched from the Three.js r128 CDN; the GLB itself is bundled locally.
- Static syntax checks and ZIP integrity can be run offline, but this environment has no external DNS/network access and no browser automation available for a full in-browser visual/performance test. Test a separate copy before replacing the live site.
