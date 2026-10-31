# The Squad v109 — Stage 1B: Nearby Player Queries

- Built forward from v108; no existing project files were removed.
- District multiplayer now subscribes to a bounded X-coordinate query around the local player and filters nearby players on both X and Z.
- Query subscriptions refresh when the player crosses an 80m grid cell; old listeners are detached.
- Chat messages remain on the existing `district/main/msgs` path. Player writes and cleanup remain on `district/main/players/{uid}` for backward compatibility.
- `firestore.rules`, `firebase-config.js`, and `.firebaserc` are unchanged.

## Important limits

This is a read-scope optimization, not a secure 20-player room allocator. Firestore rules still permit only the existing `main` district room. The client query reduces the set of player documents listened to by X range, then filters Z locally; it does not guarantee a strict cap of 20 players or eliminate all distant reads. A server-authoritative allocator / cell-based write model requires a separately cost-reviewed backend step.

## Validation

Local mocked Firestore regression tests only. No live Firebase, Firestore emulator, browser multiplayer session, or production deployment was run.
