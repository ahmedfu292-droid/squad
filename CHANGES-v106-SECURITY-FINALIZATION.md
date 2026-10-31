# The Squad v106 — Security Finalization

## Source changes
- Username mappings are no longer client-readable. New mappings contain only `{u}`; legacy mappings may still physically contain `sid`, but Firestore rules deny all client reads.
- Numeric ID index documents are no longer client-readable. Client ID availability, ID lookup, numeric-ID sign-in, and username sign-in now use rate-limited callable Cloud Functions.
- Username/password and private-ID/password sign-in are verified through Firebase Authentication on the server; the callable returns a Firebase custom token and never returns the private SID or account email.
- Username claiming/renaming is performed by a trusted callable; client profile updates cannot alter `un`.
- Group and private-chat unread increments are server-authoritative through an idempotent message-created trigger. Clients can only clear their own unread count.
- New chat images/audio upload to private Storage paths with 5 MiB caps. Storage reads require chat membership and direct-chat block checks. Message deletion cleans up uploaded media.
- Existing base64 message media remains readable for backward compatibility; this build does not bulk-migrate historical messages.
- Automatic update reload is deferred while chat, city, typing, or an active call is in progress.
- Added regression coverage and preserved the city, cafe, economy, cars, properties, palace, and existing modules.

## Files changed
- `auth.js`, `accounts.js`, `app.js`, `calls.js`, `index.html`, `sw.js`, `version.json`
- `firestore.rules`, `storage.rules`
- `firebase-functions/index.js`, `firebase-functions/package.json` (existing dependencies retained)
- `tests/*` historical version assertions updated to validate the current build; new `tests/v106_security_finalization_test.js`
- Added `storage-cors.json` and release/test documentation.

## Important compatibility notes
- Old username mappings with `sid` are intentionally left in place for server-side compatibility; they are not client-readable.
- Existing accounts continue to use their Firebase Auth email internally. Users can sign in with email, private ID, or username after the Functions are deployed.
- Legacy base64 images/audio continue to display. New media uses Storage.
