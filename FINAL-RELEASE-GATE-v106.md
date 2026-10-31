# v106 Release Gate — Do not publish yet

## Required deployment dependencies
1. The Cloud Functions additions require deploying the `firebase-functions` codebase. Firebase Cloud Functions deployment generally requires the Firebase project to be on the Blaze billing plan. Confirm budget alerts and spending limits before any upgrade/deployment.
2. Deploy Firestore and Storage rules only after running the Firebase Emulator Suite tests and reviewing expected access for old accounts.
3. Apply `storage-cors.json` to the Firebase Storage bucket before browser `getBlob()` media reads can be validated from the production origin.
4. App Check still needs a real web provider/site key and enforcement rollout. It is not enabled by this source package.
5. TURN credentials and the Push Worker URL are external configuration items; placeholders remain in the project.

## Data migration
- Existing `usernames/{name}` docs may still contain legacy `sid`. Client reads are denied. The server functions use only `u` and Firebase Auth; no client response includes `sid`.
- Existing base64 chat media remains readable. New chat media is stored in Storage. A separate resumable migration of historical media is still required before removing legacy base64 support.
- Do not delete old `usernames`, `ids`, user, chat, or message documents as part of cleanup.

## Must-pass live tests
- Existing account login by email, private ID and username.
- New account registration, duplicate username/ID rejection, username change.
- Unauthenticated and authenticated attempts to read `users/{uid}`, `usernames/{name}`, and `ids/{sid}`.
- Private chat block from both directions, group membership, receipts, typing and unread counters.
- Duplicate delivery/idempotency of message-created trigger.
- Storage media read by members, denied for non-members and blocked direct peers; upload size/type validation.
- Delete message removes corresponding Storage object.
- Auto-update during an active call and while the city is open.
- Two-device mobile/browser tests and load tests.

## Release decision
NOT APPROVED until the above service-backed checks pass. This ZIP is a source hardening package; it does not deploy itself or change the live Firebase project.

## Additional configuration notes
- Configure a Firestore TTL policy on `authRateLimits.expiresAt` to expire rate-limit records. The source writes expiration timestamps, but the TTL policy itself is a Console setting.
- The Cloud Functions use region `europe-west1`; the web client calls the same region.
- Functions currently set `enforceAppCheck: false` intentionally because a real App Check web site key has not been supplied/configured. Do not turn enforcement on until the web provider is registered and valid tokens are confirmed.
