# The Squad v114 — PWA install experience

- Added a contextual install button when the browser emits `beforeinstallprompt`.
- Added an accessible Arabic label and safe-area-aware placement.
- Removes the install button after successful installation or `appinstalled`.
- Bumped the Service Worker cache namespace and build marker to v114.
- Updated the release quality-gate test to validate the v114 release marker and install prompt.

No Firebase configuration or rules were changed. The browser controls whether installation is eligible; this does not force installation and does not provide offline multiplayer.
