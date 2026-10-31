# Security work remaining — v101

Critical migration work is deliberately not faked in this build.

1. Private SID migration: create owner-only private identity records; change signup/login/username resolution; backfill existing users; then deny broad reads of SID-bearing user docs and deny public ID enumeration. Must be emulator-tested with old and new accounts.
2. Chat authorization: represent per-user receipt state in per-user documents or validate map diffs; enforce block edges in message create/read rules; validate reaction keys and message ownership; preserve group-admin behavior.
3. Media migration: upload new media to Storage with strict MIME/size/path rules; migrate old base64 attachments in batches; verify message references; retain rollback until counts match.
4. Account recovery: add Firebase email verification and password reset UX; phone OTP is a separate provider/cost decision. Legacy synthetic emails cannot receive recovery messages and need an explicit migration/recovery path.
5. App Check: register web app, deploy enforcement in monitor-first mode, verify Auth/Firestore/Storage/Functions traffic, then enforce.
6. Infrastructure: configure TURN and Push Worker with real secrets; add budget alerts and quotas; do not commit credentials.
