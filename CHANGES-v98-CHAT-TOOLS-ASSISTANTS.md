# The Squad v98 — Chat tools & assistants

## Implemented in this package
- Added social-chat management menu: pin/unpin conversation (`users/{uid}.pins`), mute/unmute (`users/{uid}.mute`), archive/unarchive (`users/{uid}.arch`). Uses existing Firestore user document and array transforms; no new collections or rules.
- Added Archived filter to the social messages screen.
- Added assistant launcher cards in the social messages screen and exported the existing assistant open function as `window.SquadOpenAssistant`.
- Added matching assistant cards and Archived tab to `app-preview.html`.
- Added separate `stage4-extras.js` and `stage4-extras.css` to keep enhancements isolated.
- Existing assistant engine in `bot.js` remains local/rule-based. No external AI API or backend was added.

## Extra polish
- Management controls are in a custom in-app modal, not browser alert/confirm.
- Conversation cards show pinned and muted indicators.
- Responsive assistant launcher cards for mobile.

## Files changed
- `stage4-chat-ui.js`
- `ui2.js`
- `bot.js`
- `index.html`
- `sw.js`
- `version.json`
- `app-preview.html`

## New files
- `stage4-extras.js`
- `stage4-extras.css`
- `CHANGES-v98-CHAT-TOOLS-ASSISTANTS.md`
- `TEST-REPORT-v98.txt`
- `GITHUB-UPLOAD-v98.txt`
- `MOBILE-TEST-v98.txt`

## Not changed
- `auth.js`, `acct.js`, `firebase-config.js`, `.firebaserc`, `firestore.rules`, `storage.rules`
- `chatx.js`, `community.js`, `calls.js`, `channel.js`, `app.js`
- No Firebase rules, functions, or new collections.

## AI capability boundary
The two assistant identities are exposed in the social platform. Their current response engine is the pre-existing local rules/knowledge-base implementation. They are not equivalent to ChatGPT and do not have live web research, broad reasoning, or a hosted LLM. True ChatGPT-class behavior requires an approved AI provider and a server-side secret; never put an API key in browser JavaScript. No such provider was connected in this build.
