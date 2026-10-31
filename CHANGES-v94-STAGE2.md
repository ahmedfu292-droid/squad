# The Squad v94 — Stage 2 Social Platform

- Feed-first social shell with desktop 3-column layout and mobile 5-slot bottom navigation (Home, Videos, Create, Explore, Profile).
- Messages and calls remain a separate upper/side entry to existing legacy modules.
- Story rail, mock feed cards, comments sheet, create-post preview, profile shell, video-feed visual, and messages entry UI.
- `tokens.css` is the central token source for the new Dark Room social UI. Social styles were added to existing `squad.css`; no extra platform stylesheet was layered on top.
- Removed AI tab / AI offers screen injection from `ui2.js`; AI entry now routes to existing Explore instead of an AI page.
- Added independent `app-preview.html` with local mock data and no Firebase scripts.
- Dialogs: The Dark Room modal helper is in `ui2.js`; native dialogs replaced in approved files and the three account-removal/logout confirms in `accounts.js`.
- Protected files unchanged: auth.js, acct.js, calls.js, Firebase config/rules.

## Scope truth
Feed posts, reactions, follows, post creation, profile statistics and short-video content in this stage are presentation/demo only. Existing chat, calls, stories, channels, city, cafe, community, and cinema logic is retained; existing chat/call/story entry points are reachable. No Firestore schema or rules were added.
