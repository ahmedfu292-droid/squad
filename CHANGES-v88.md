# The Squad v88 — Multiplayer Sync Guard

## What changed
- Added defensive validation for incoming player snapshots: bounded finite coordinates, valid server timestamps, and stale/future timestamp rejection.
- Added defensive validation for remote vehicle state: known vehicle catalog key, bounded finite coordinates, yaw, and speed.
- Added defensive validation and sanitization for chat messages, including control-character removal, a 200-character cap, and rejection of empty/stale/future messages.
- Added validation before sending local player and vehicle state, retaining the existing 550 ms movement-write throttle and 15-second unchanged-state heartbeat.
- Added a small live network status indicator (connecting/online/offline/error) and browser online/offline reconnect handling.
- Preserved existing remote player/car interpolation and the current Firestore data schema.
- Updated the service-worker cache namespace and project version to v88.

## Explicitly untouched
- No Firebase console setting, deployment, Firestore rule, Storage rule, Firebase config, or Cloud Function was changed.
- Existing chat/social modules, account modules, and all four original GLB vehicle models remain byte-for-byte identical to v87.

## Security boundary
These are client-side validation and resilience improvements, not server-authoritative anti-cheat. A modified client can still attempt forged movement/chat writes within the existing Firestore rules. Strong movement authority, server-side rate limits, and authoritative vehicle ownership/proximity need a separately approved backend/rules design.
