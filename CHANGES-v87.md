# The Squad v87 — Economy & Multiplayer Guardrails

## Changes
- Fixed the city map coin registry: the map now exposes the generated 115 coin pickups instead of an empty array. This restores coin rendering and collection.
- Server coin claims now reject IDs outside the actual map range (0–114), instead of accepting arbitrary IDs up to 1000.
- Added transaction-backed economy action throttling: 250 ms minimum spacing and at most 40 economy actions per rolling minute per account.
- Added safe-integer overflow guards for wallet and bank credits, deposits, withdrawals, and transfers.
- Preserved existing rewards, prices, job cooldown, ownership schema, Firebase rules, chat, accounts, and original vehicle assets.

## Security limitations not solved by this release
- App Check is not enforced because the current client does not initialize Firebase App Check with a verified provider/key. Enabling enforcement without configuring the client would block legitimate players.
- Coin pickup requests still do not prove player proximity to the pickup on the server. True anti-cheat requires server-authoritative movement or short-lived server-issued pickup proofs.
- Multiplayer player positions and chat writes remain client-originated Firestore writes governed by the existing rules; these rules were intentionally preserved.
- Firebase Functions and real multi-account online tests require deployment/emulator credentials and were not run against the user's Firebase project.
