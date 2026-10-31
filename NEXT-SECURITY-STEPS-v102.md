# Next security work (not yet implemented)
1. Design private account-number mapping with a trusted backend/Cloud Function; migrate `sid` out of public `users/{uid}` without exposing email or breaking legacy sign-in.
2. Replace public pre-auth ID/username probing with authenticated or server-mediated reservation and availability checks.
3. Add chat rules for block enforcement and field-level updates (`seen`, `un`, `ty`, reactions), backed by emulator tests for every app write path.
4. Add Storage upload/download paths and a resumable, verifiable migration for historical message images/audio; retain old data until migration is confirmed.
5. Enable App Check in monitoring mode, validate traffic, then enforce after supported clients are updated.
6. Configure TURN and push Worker using user-owned credentials; do not hardcode secrets in client files.
7. Add automated browser tests, two-account integration tests, and cost/load measurements.
