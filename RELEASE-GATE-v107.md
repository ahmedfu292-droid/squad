# Release gate — v107

Status: NOT READY TO PUBLISH

Completed in source:
- Per-user conversation hiding and restore filter.
- Permanent deletion of an individual message by its sender, or by the group admin under the existing message-delete rule.
- Existing message-deletion trigger removes uploaded image/audio files when deployed.

Still required before calling chat security complete:
1. Confirm the intended Firebase project ID.
2. Run Firestore Rules tests in Firebase Emulator with two normal users and a group admin.
3. Verify one user cannot delete another user's private message, hide does not affect the other user's inbox, and restore works.
4. Deploy and verify the message-deletion Cloud Function, then confirm Storage media is removed.
5. Run browser tests in Chromium and real two-account end-to-end tests.

No live deployment has been made.
