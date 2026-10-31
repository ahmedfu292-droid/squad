# The Squad v104 — Security & Stability Hardening

## Changes in this build

1. `users/{uid}` is now a private account document: direct client reads are restricted to its owner. The `sid`, private preferences and legacy account fields are no longer exposed through the public user-document read rule.
2. Added `publicProfiles/{uid}` as a small public projection containing only `name`, `bio`, `un`, and `city`. Signup, profile editing, username changes, city updates, profile search, and blocked-user labels now use/synchronize this projection.
3. Username records are still exact-get only for signed-in users, with list disabled. They retain the legacy `sid` lookup field for compatibility with existing username login flows; this is not a bulk-readable collection, but it is not a substitute for a rate-limited server lookup.
4. Chat metadata writes are narrowed: read receipts and typing markers can only change the acting member's own map entry; last-message preview is tied to the authenticated sender and bounded; private-chat unread counters are constrained to self-reset or +1 for the other participant. Group unread counters remain limited to member keys but are not yet individually transaction-validated.
5. Group-admin chat-document updates are restricted to membership/name metadata and a one-member size change rather than arbitrary document mutation.
6. New chat image/audio payloads have MIME/data-URL shape checks and retain the 200 KB Firestore field cap. Existing messages remain readable; media migration to Storage is intentionally not attempted in this build because tokenized download URLs can bypass private-chat access expectations unless a secure authenticated media delivery path is implemented.
7. Service-worker cache/version is advanced to `v104-final-hardening`.
8. Historical release tests that pinned the project to v96/v101 cache markers were updated to assert the current v104 marker; old test files remain present.

## Important remaining limitations / external prerequisites

- Firestore rules were statically reviewed but **not compiled or executed in Firebase Emulator** in this environment. Do not deploy these rules until emulator validation and a two-account test pass.
- Existing users receive their `publicProfiles` projection the next time they sign in and their own private user document snapshot is loaded. Until then, public profile search may show a fallback for those accounts.
- `ids/{sid}` remains exact-get only for signed-in users (no list) because the current account-number discovery and legacy sign-in flow depend on it. Username records also retain the legacy `sid` field for compatibility. A rate-limited callable lookup is a future hardening requirement.
- Group unread counters can still be manipulated by a group member within the member list. Private one-to-one unread counters have stricter checks.
- Images/audio are still stored inline in Firestore (bounded); old and new media have not been migrated to Storage.
- App Check, TURN credentials, Push Worker URL, secure email-verification enforcement, legacy account recovery, and Cloudflare Durable Objects are not activated by source changes alone. They require project configuration/secrets and live tests.
- No live Firebase Auth, Firestore, Storage, call, notification, or two-account tests were run. No production deployment was performed.

## Preservation

The source Firebase project configuration and economy Functions were not changed. Existing chat, calls, social, city, cafe, world and vehicle modules were retained. No original project file was deleted.
