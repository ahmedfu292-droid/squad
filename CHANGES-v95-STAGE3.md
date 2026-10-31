# The Squad v95 — Stage 3

## Added
- `social-feed.js`: Firestore-backed post creation, batched public personal feed, public trending fallback, likes, comments/replies, saves, follow/unfollow, hide, block, reports, soft-delete and image upload.
- Firebase Storage compat SDK script in `index.html`.
- Dark Room UI integration in `ui2.js` and `squad.css`.
- New v95 Firestore and Storage rules appended after the untouched v94 rule body.
- Version and service-worker cache updated to v95.
- `app-preview.html` now shows the v95 image/privacy limits and local simulated publishing state.

## Feed limits
- Follow cap: 300 accounts; 10 `in` queries maximum per page, each containing up to 30 UIDs.
- Display page: 10 posts total. Each of up to 10 chunks prefetches up to 10 documents into a local buffer; the merged buffer is sorted and only 10 are displayed per scroll. Chunk cursors use `startAfter`.
- Personal feed query: public posts from followed accounts only.
- If no personal posts exist, the fallback loads up to 10 public posts ordered by `likeCount` and `createdAt`.
- Follower-only posts are protected and can be fetched by authorized direct document access, but are not discoverable in the batched `in` feed query without a fan-out/index service.

## Security and privacy limitations
- Firestore Rules are not filters. The public-only list query is deliberate so list access can be proven by the query.
- Block and hide suppress posts in the current user's feed; public list queries remain public by design.
- Delete is soft delete (`status=deleted`) and image removal is best-effort. Subcollection cleanup is not guaranteed without a backend process.
- Follow counts use Firestore aggregate count queries where available; no mutable public counters are stored.

## Protected
`auth.js`, `acct.js`, `calls.js`, `firebase-config.js`, `.firebaserc`, `firebase.json`, and Firebase Functions files are unchanged. Original v94 Firestore and Storage rule bodies are preserved; additions are marked with v95 comments.

## Project target warning
The existing `firebase-config.js` and `.firebaserc` in v94 point to `chatapp-67eb6`. These files were intentionally not changed. Confirm the target project before pasting rules or testing.

## Verification
See `TEST-REPORT-v95.txt`. No Firebase Rules Emulator or live Firebase project access was available; do not treat static tests as proof of live rule behavior.
