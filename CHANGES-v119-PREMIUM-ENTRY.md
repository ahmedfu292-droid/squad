# The Squad v119 — Premium Entry Screen

## What changed
- Replaced the mandatory pull-the-lamp login interaction with a login form that appears automatically when the authentication screen opens.
- Reworked the entry screen into a restrained dark-premium visual system with warm champagne-gold accents, a clearer brand lockup, a focused login card, and improved form hierarchy.
- Rebuilt the small-screen layout so the brand and login form appear immediately without the previous large blank/lamp area pushing the form down the page.
- Added safe-area spacing and a compact landscape layout for mobile devices.
- Kept authentication behavior and account creation logic in the existing `auth.js` / `acct.js`; this update changes presentation and reveal behavior only.
- Preserved the v118 bank/performance work and Firebase rules/functions source.
- Updated the service-worker cache key and precache list so the new stylesheet is fetched.

## Verification
- `node --check auth-scene.js`: PASS
- `node --check sw.js`: PASS
- `index.html` includes the new stylesheet after `auth.css`.
- ZIP integrity checked after packaging.

## Not claimed
- No live GitHub deployment was performed.
- No physical Android device or cross-browser visual test was performed in this environment.
- This is a focused entry-screen redesign, not a complete redesign of every page in the platform.
