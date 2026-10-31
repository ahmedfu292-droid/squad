# The Squad v103 — Chat Privacy & Rules Hardening

## Changes
- Firestore username and account-ID document `get` lookups now require authentication (list remains denied).
- Private direct-message reads, creates, updates, and deletes are denied when either participant has blocked the other.
- Message create validation now checks sender display-name length, text type/length, image/audio string size (200,000 characters each), optional forward flag, and reply map shape/length.
- Message reactions can only be changed under the acting user's own reaction key.
- Existing Firebase project selection, Firebase config, Storage rules, chat client modules, and legacy records were preserved.

## Important limitations
- This does NOT make `users/{uid}.sid` private: the current client and several existing modules still read it. A safe migration requires moving the SID into a private document and replacing all direct client lookups with a trusted server-side resolver while preserving legacy account access.
- `ids/{sid}` still maps an ID to a UID for authenticated lookup; authenticated enumeration is not fully prevented. A callable resolver with abuse protection is the next required step.
- Group-level block semantics are not changed; this rule change enforces blocks for private direct chats only.
- Chat summary maps (`un`, `seen`, `ty`) still need a coordinated client/rules migration to enforce per-member field updates without breaking message send/read flows.
- Image/audio are still stored as base64 in Firestore; this patch caps new payloads but does not migrate old media to Storage.
- Firestore rules were not deployed and no live database was modified.
