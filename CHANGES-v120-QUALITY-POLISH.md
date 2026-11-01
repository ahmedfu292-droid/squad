# The Squad v120 — Quality & Polish Pass

## Scope
This release focuses on refinement and stabilization only. No new product features were added.

## Changes
- Added `quality-polish-v120.css` as a small, separately scoped finishing layer.
- Corrected the mobile social navigation layout: the existing mobile navigation contains six destinations, while its grid previously reserved five columns. It now allocates six equal columns and styles the existing Services shortcut consistently.
- Improved keyboard focus visibility, disabled-control affordance, touch behavior, small-screen text sizing, and reduced-motion handling.
- Added safe-area spacing around the mobile social shell and navigation.
- Updated the service-worker cache key and precache list for the new stylesheet.
- Updated `version.json` to build 120.
- Preserved the existing account, chat, bank, economy, city, and Firebase source files; no Firebase rules or project identifiers were changed.

## Verification performed
- `node --check` passed for all root JavaScript files and `firebase-functions/*.js`.
- Passed targeted tests:
  - `v40_economy_security_test.js`
  - `v46_city_economy_upgrade_test.js`
  - `v50_environment_reflections_test.js`
  - `v88_multiplayer_sync_test.js`
  - `v90_world_performance_test.js`
  - `v102_security_recovery_test.js`
  - `v103_chat_rules_static_test.js`
  - `v104_chat_metadata_hardening_test.js`
  - `v109_nearby_player_query_test.js`
- HTML audit: no duplicate IDs found in `index.html`.
- Local resource audit: no missing local `src`/`href` references found in `index.html`.
- ZIP integrity check passed after packaging.

## Known limitations
- The repository's entire historical test collection is not green. Several older tests fail on legacy version-string assumptions or historical fixtures/source assertions; they were not silently marked as passing.
- No real Android device, iOS device, or cross-browser visual test was performed.
- No live GitHub Pages deployment or Firebase Functions deployment was performed.
- The package does not claim to complete a full visual redesign of every screen or to verify live backend connectivity.
