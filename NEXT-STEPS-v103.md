# Remaining security work after v103

1. Build a callable/server-side account-ID resolver and migrate `sid` out of public-readable `users/{uid}` documents without breaking old accounts or account switching.
2. Update all client modules that currently read `U.sid` / `users/{uid}.sid`; keep the ID available only to the owner and trusted backend paths.
3. Migrate images/audio to Firebase Storage with resumable upload, ownership checks, old-message fallback, and cleanup policy.
4. Split chat summary writes into explicit per-user fields and verify `seen`, `un`, and `ty` ownership in rules; couple `last`/`lt` to message creation.
5. Add emulator tests for block/unblock, private/group chat, message size boundaries, reactions, and account-ID lookup.
6. Add TURN configuration, App Check, push worker deployment, and billing alerts only after credentials/configuration are supplied and tested.
