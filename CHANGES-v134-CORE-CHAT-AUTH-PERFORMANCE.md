# The Squad v134 — Core, Chat, Login & Performance

## Chat reliability
- Added per-conversation send locking to prevent accidental duplicate sends from rapid clicks / Enter key repeats.
- Send now verifies the current account is still a member of the target conversation before writing.
- The send control exposes a busy state while a write is in progress; drafts remain in the input/local draft storage if the write fails.
- Existing real-time message listener and last-100-message window are preserved.
- Enabled Firestore persistence where supported, with safe handling for multi-tab and unsupported-browser cases.

## Login reliability
- Prevented concurrent login attempts from Enter/button double activation.
- Added an accessible busy state and guaranteed button reset with `finally`, including failed sign-in attempts.
- Existing Firebase Auth methods, account ID login, username login, email login, and signup flow are preserved.

## Low-end performance
- Added a conservative low-end device heuristic using available deviceMemory / hardwareConcurrency hints.
- Low-end devices start at a lower render pixel ratio, disable antialiasing and real-time shadows, and reduce selected decorative animation update frequency.
- Existing adaptive resolution logic remains active and now uses low-end-aware floor/ceiling values.
- Core movement, network synchronization, and gameplay simulation cadence are not intentionally throttled.

## Validation
- JavaScript syntax checked for `app.js`, `auth.js`, and `district.js`.
- Static regression checks added for v134 behavior.
- Browser/Firebase live integration and visual performance still require deployment and real-device testing; no claim of live backend verification is made.
