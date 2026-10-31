# The Squad v107 — Chat deletion controls

## Added
- Added `hiddenChats` to the signed-in user's private Firestore document allow-list. The list is bounded to 500 entries.
- Added per-user conversation hiding from the conversation menu. Hiding affects only the current user's inbox; it does not delete the other participant's chat or messages.
- Added a **المخفية** filter so a user can restore a hidden conversation.
- Hidden conversations are excluded from the main inbox/recent list and unread badges.
- Changed the message trash action to permanently delete the message document for all members. Existing Firestore rules permit deletion only by the message sender or the group admin, not an arbitrary group member or the other participant in a private chat.
- Existing `onChatMessageDeleted` Cloud Function removes attached Storage media when a message document is deleted.
- Bumped app build and service-worker cache to v107.

## Important behavior
- “حذف المحادثة من عندي” is an inbox hide, not a global conversation deletion. This is intentional so one user cannot erase another user's chat history.
- “حذف نهائي للجميع” removes the message document and cannot be undone. Storage cleanup depends on the `onChatMessageDeleted` Cloud Function being deployed and running.
- These Firestore and Cloud Functions changes are source changes only. They have NOT been deployed to Firebase.

## Validation
- JavaScript syntax: all 90 JavaScript files passed `node --check`.
- Node regression test files: 47/47 passed (excluding `fakefb.js` and `fakefb2.js`, which are browser mock libraries, not standalone tests).
- New v107 chat deletion static checks: 8/8 passed.
- Existing Python/Playwright browser tests could not be completed: Chromium is not installed in this environment; one local test also could not reach its expected emulator at 127.0.0.1:8765.
- Firebase Emulator, live account-to-account chat, Firestore rules enforcement, and Storage cleanup were NOT tested against a live Firebase project.
