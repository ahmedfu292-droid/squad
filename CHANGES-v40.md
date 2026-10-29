# The Squad v40 — Online economy integration

- Added Firebase Functions compat SDK to the page.
- Wired coin pickups, job rewards, bank deposits/withdrawals, vehicle purchases, apartment/estate purchases, and estate staff hiring to authenticated callable functions.
- Applied server-owned wallet/bank/ownership state to the game UI and removed localStorage ownership reads as the authority.
- Removed local-only bank interest from the displayed account to prevent balances appearing that the server did not actually credit.
- Returned coin claim cooldown data from the server so the client can reflect server cooldowns.
- Added `firebase.json` and `.firebaserc` to make the Functions and Firestore rules deployment target explicit (`chatapp-67eb6`). Review this target before deploying.
- Added setup and production caveats in `ECONOMY-BACKEND-SETUP-v40.md`.

## Validation
- Syntax checks pass for changed JavaScript files.
- Core world, catalog, chat reliability, estate arrival, cabin, luxury, and economy-source tests are run before packaging.

## Still needs owner-side deployment / final production validation
- Functions are source code only until deployed by the project owner.
- Deploy Firestore rules and Functions, test with two signed-in accounts, and configure App Check before public launch.
- Job payout endpoint currently rate-limits requests but does not validate trusted player proximity/movement.
- Existing locally saved wallet balances are intentionally not imported; localStorage can be edited by players.
- Real branded 3D vehicle assets still require licensed GLB/glTF files; the current vehicle geometry remains procedural.
