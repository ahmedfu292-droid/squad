# The Squad v123 — Vehicle prototype & city performance

- Added a dedicated lightweight BMW M 1000 RR-style motorcycle mesh, wheel geometry, handling profile, showroom catalog entry and server-side economy price mapping (`catalog_121`).
- Added a fifth bespoke Ferrari F80-inspired silhouette/signature alongside the existing Cadillac Escalade-V, Range Rover SV, BMW X6 M Competition and Mercedes-AMG G 63 brand-specific vehicle treatments.
- The five car treatments are custom procedural game meshes, **not OEM-authentic licensed scans/models**.
- Reduced mobile GPU/CPU load by lowering initial pixel ratio and throttling non-essential city/NPC/fountain animation work on mobile.
- Existing catalog order and IDs 1–120 remain unchanged. Firebase security rules were not modified.

## Validation

- JavaScript syntax checks and project test suite run after patching; see `TEST-REPORT-v123.txt`.
- Real-device Android/iOS rendering, live Firebase transactions and deployment were not performed in this environment.
