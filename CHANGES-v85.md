# The Squad v85 — Realism Drive & Water

- Added restrained lane paint, road-edge lines, and reflective road studs to wider/longer roads.
- Car front wheels now visually steer with the steering input; brake lamps respond to deceleration/braking.
- Added four low-count tire-spray particles per car, enabled only when the vehicle is moving through a mapped wet patch.
- Fountain ripple rings now have independent materials so their expansion/fade animation is correct; water mesh tessellation is reduced on mobile.
- Added drive-state flags for steering and braking in the vehicle physics core.
- Preserved the vehicle silhouettes and original GLB models; no changes to chat, Firebase rules/configuration, or economy.

Validation: run all `tests/*_test.js` from `squad_v68`, plus `node --check` on all JavaScript files. Automated tests do not replace live WebGL visual/performance testing.
