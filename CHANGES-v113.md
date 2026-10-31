# The Squad v113 — Offline UX refinement

## Changes
- Country-server buttons are disabled while the browser reports offline.
- The selected server remains saved locally; the lobby remains viewable.
- The join button is disabled offline and explains that network access is required.
- Online/offline events refresh the country-server lobby state.
- Service Worker cache key advanced to `squad-v113-offline-ux` and navigation fallback gained an additional `/index.html` cache lookup.
- Existing server paths and Firebase configuration/rules were not changed in this stage.

## Limitations
- This does not provide offline login, messaging, multiplayer, or a complete offline game.
- A previously visited page and assets must already be cached by the browser.
- Real device airplane-mode and installed-PWA behavior still require browser/device testing after deployment.
