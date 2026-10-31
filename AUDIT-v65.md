# The Squad v65 — stable vehicle identity and lighter update checks

## Changes implemented
- Converted all 120 catalog vehicle IDs from positional `catalog_N` IDs to deterministic name-based IDs shared by client and Firebase Functions.
- Added compatibility migration for saved ownership: `catalog_N` ownership is translated to the stable ID and aliases are kept for older clients; newly purchased cars write both keys during rollout.
- Kept the 120 server-owned prices aligned with the 120 catalog entries.
- Replaced the old update checker (38 files every 2 minutes) with a single `version.json` manifest check every 8 minutes. Update `version.json`'s version on each deployment to trigger refresh.
- Kept four GLB archetype files and procedural fallback. This does not create 120 separate OEM-accurate GLB models; that remains future asset work.

## Checks
- `node --check` passed for every JavaScript file.
- Passed: v35 catalog, v37 luxury/spawn, v39 vehicle cabin, v40 economy security, v40 world/economy integration, v49 automotive PBR, and v50 environment-reflection tests.
- Known existing failure: `tests/v33_core_test.js` has a palace stair-navigation scenario that remains at ground level. It was not changed as part of this ID/polling patch.
- Browser tests requiring Playwright are unavailable in this environment. The test runner also could not bind port 8765 because it was already occupied; standalone relevant tests were run instead.
- No live Firebase/Cloudflare service was accessed or deployed. Live bank/purchase/multiplayer operations are not claimed as verified.
