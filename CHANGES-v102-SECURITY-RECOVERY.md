# The Squad v102 — Security & Recovery Foundation

## Implemented
- Password recovery control added to the login screen. It sends Firebase Auth password-reset email only when the user enters a syntactically valid real email address.
- New registrations using a real email now attempt to send Firebase email verification after the Firestore account batch succeeds.
- ID availability lookup now fails closed: a read/network/rules error is treated as unavailable, never as a free ID. This prevents a failed lookup from falsely approving an identifier.
- Version manifest and service-worker cache namespace advanced together to v102.
- Existing Firebase configuration, project alias, Firestore rules, Storage rules, chat, calls, and game modules were preserved unchanged.

## Important limitations
- Email verification is sent but is not yet enforced as a login gate. Enforcing it safely requires a migration plan for legacy `@squad.id` accounts and a verified recovery path.
- Password reset works for real email accounts only. Legacy synthetic-email accounts still need a separate account recovery/migration workflow.
- The private account number (`sid`) remains in the public-readable user document and identifier lookup remains available before signup. This is NOT fully fixed in v102 because a safe fix needs coordinated migration and server-side reservation/lookup; changing the rules alone would break signup and existing login.
- Chat block enforcement and per-field authorization have NOT been deployed. The current chat schema uses nested `seen`, `un`, and `ty` maps, so rule hardening must be tested against every existing write path before replacing production rules.
- Message media remains base64 in Firestore. No automatic migration was attempted to avoid breaking old messages or losing media.
- App Check, TURN, push worker deployment, room sharding, server-authoritative movement, and lazy 3D loading remain pending.

## Deployment safety
Do not upload new Firebase rules from this release. `firestore.rules`, `storage.rules`, `.firebaserc`, and `firebase-config.js` were intentionally preserved. Do not change Firebase project selection until the live project is confirmed in the Firebase console.
