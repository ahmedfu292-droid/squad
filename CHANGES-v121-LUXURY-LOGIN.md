# The Squad v121 — Luxury Login Screen

## Scope
Only the login/intro experience was changed. Existing platform, game, social, chat, bank, economy, Firebase configuration, Firebase Functions, and security rules were preserved from v120.

## Login changes
- Restored the interactive lamp pull-cord intro from v118; the login form does not appear until the cord is pulled.
- After the pull, the supplied luxury login artwork is shown as the scene background.
- The real, existing HTML login/register form is overlaid on the artwork; authentication behavior remains in the existing auth.js/acct.js files.
- Added responsive styling for desktop, mobile, small screens, and landscape phones.
- Added the new artwork and stylesheet to the service-worker precache and bumped cache/version to v121.

## Checks performed
- `node --check auth-scene.js` passed.
- `node --check sw.js` passed.
- Confirmed the new artwork exists and is 1672 × 941.
- Confirmed index.html references the new login stylesheet and the service worker precaches the image.
- ZIP integrity check passed after packaging.

## Not performed
- No live deployment.
- No real Android/iOS device visual test.
- No end-to-end authentication test against a live Firebase project.
