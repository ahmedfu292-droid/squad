# The Squad — Stage 4 v97: Social chat integration

## Design reference and comparison
Approved visual target: the two-panel generated mockup supplied in this conversation. The implementation uses its dark near-black surfaces, thin gold borders, violet outgoing bubbles, rounded conversation cards, message counter, tab row, search field, and responsive chat layout.

**Honest visual comparison:** this is a first implementation of the approved visual direction, not a pixel-identical reproduction. The mockup is a flattened generated image rather than editable design specs, so exact font metrics, component dimensions, spacing and icon paths cannot be measured. The live social feed still uses the existing card structure; its sidebar/profile arrangement and rich media imagery do not yet match every pixel of the left mockup panel. The new CSS restyles the existing chat surface, but no screenshot-based browser comparison was possible in this environment.

## Files changed
- `ui2.js` — conversation filters (All / Private / Groups / Pinned), search integration, and public-only privacy control in the post composer.
- `social-feed.js` — adds “Send in message” to the post overflow menu; changes publishing validation to public-only while the followers feed limitation remains unresolved.
- `stage4-chat-ui.js` — new presentation/bridge layer. Reads existing conversation data and delegates opening/sending to existing app chat functions. It does not create a parallel message database.
- `stage4-chat-ui.css` — new Dark Room gold/violet styling for social message list and existing chat screen.
- `index.html` — loads the new stylesheet and bridge layer.
- `app-preview.html` — adds an interactive chat mock screen with list tabs, search, loading/empty/error previews, bubbles, voice/photo examples and local send interaction.
- `sw.js` — new cache key and precache entries for the Stage 4 UI assets.
- `version.json` — version/build updated to v97.
- `STAGE4-REPORT-v97.md`, `GITHUB-UPLOAD-v97.txt`, `MOBILE-TEST-v97.txt`, `RULES-PLAYGROUND-v97.txt` — handoff documents.

## JavaScript changes disclosed before editing
Planned: `app.js`, `ui2.js`, `social-feed.js`. After inspecting the existing code, `app.js` did not need modification: its global `openChat`, `send`, and conversation state were already callable from the new layer. `profile.js` also did not need modification because the existing profile view already exposes the Message entry point. Actual JS changes: `ui2.js`, `social-feed.js`, plus new `stage4-chat-ui.js`.

## Existing engine preservation
- `chatx.js`, `community.js`, `calls.js`, and `channel.js` unchanged.
- `auth.js`, `acct.js`, `firebase-config.js`, `.firebaserc`, `firestore.rules`, and `storage.rules` unchanged.
- Existing `app.js` message storage, send, reply, reaction, voice-note, image, edit/delete and call wiring retained. Existing features are not represented as newly verified capabilities.

## What is real vs preview-only
- Real integration: conversation list reads existing `C` chat state; opening a conversation delegates to existing `openChat`; send-in-message uses existing chat list and `send` function to send a post link; existing unread count is reused; post composer exposes only public; publishing rejects followers visibility.
- Preview-only: the new `app-preview.html` is a local visual prototype; its sample conversations and message send are not connected to Firebase. Loading/empty/error states in preview are examples, not evidence of live backend state handling.
- Existing message engine capabilities (voice, images, replies, reactions, edit/delete and calls) were preserved, but not live-tested in this run. Arbitrary document/file attachments, group lifecycle dialogs and pin/unpin management are not newly implemented here.

## Stage 3 open items recorded
1. Exact Firebase project ID in both `.firebaserc` and `firebase-config.js`: **`chatapp-67eb6`**. Storage bucket: `chatapp-67eb6.firebasestorage.app`. Web app ID: `1:191159196724:web:d6db5b85ad4adc28d37e61`. This is the project the code currently points to; owner confirmation is still required before rules are pasted or live deployment is treated as production.
2. Followers-only posts remain excluded from the implemented feed query due to Firestore Rules/query constraints. Composer now offers only **الكل / public** and publishing validation rejects `followers`.
3. Follow the separate `RULES-PLAYGROUND-v97.txt` document for manual rule tests, paste and rollback. No Firebase rules were changed in Stage 4.

## Tests actually run
- `node --check` on all 81 JavaScript files: passed, zero syntax errors.
- Inline scripts extracted from `app-preview.html`: passed syntax check (2 scripts).
- `python tests/ui2_harness.py`: command exited successfully.
- `python tests/run.py`: not completed; Playwright Chromium executable is missing in this environment.
- `python -m unittest discover`: not valid as a suite here; tests start their own local server at import and collided on port 8766, and browser tests require the missing Chromium binary.
- Not tested: real browser rendering, mobile browser, Firebase Auth/Firestore, message send against live accounts, calls, file upload, Rules Playground, network offline behavior, exact pixel comparison.

## Deletions
No files deleted. Existing legacy modules and rules remain in the package.
