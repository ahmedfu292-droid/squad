# The Squad v139 — Bank Heist + Performance Pass

## Bank gameplay
- Added a shared server-side vault at `worldState/bankVault`, separate from every player's personal bank account.
- Vault refills to 50,000 game coins at the start of each server-hour window.
- A single successful or failed attempt consumes the global robbery slot for that hour.
- Added purchasable fictional mission equipment (1,800 coins), assistants (2,500 coins), and five shared security upgrade levels (5,000 coins per next level).
- Robbery requirements, hourly lock, success calculation, payout, equipment consumption, and wallet credit are validated in the Firebase transaction.
- Personal bank deposit/withdraw/transfer behavior remains separate and unchanged.

## Performance / atmosphere
- Lowered initial and adaptive render pixel-ratio ceilings for low-end devices (including 4 GB RAM class hardware).
- Moved the city fog farther out (150–560) to reduce the heavy cloudy/hazy appearance.
- Bumped service-worker cache and build metadata to v139.

## Verification
- JavaScript syntax checks and the focused v139 static regression test are run in this package.
- This is not a live Firebase test: deployment, Firestore transaction contention, and real browser FPS still require validation after deployment.
- The visual fog adjustment is a source-level change; an actual screenshot from the user's device is still needed to identify any separate cloud object or graphics-driver artifact.
