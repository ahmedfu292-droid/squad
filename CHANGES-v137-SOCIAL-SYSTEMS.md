# The Squad v137 — Social systems and login-scene verification

## Added in v137
- Added friend discovery against publicProfiles.
- Added incoming friend requests with accept/reject and re-request after rejection.
- Added reciprocal friend records after acceptance.
- Added live unread notification subscriptions and mark-as-read behavior.
- Added private group-room creation from the accepted-friends list. Rooms are created as group chats with the creator as initial admin, then friends are added one at a time using the existing chat membership rules.
- Added a compact social entry in the social dashboard and links to existing project systems.
- Added Firestore rules for friendRequests, friends and notifications.

## Existing systems reused (not represented as newly built)
- Character appearance editor: existing `look.js` and settings integration.
- Cars, car ownership, bank/wallet and estates: existing `district.js` and Firebase callable economy actions.
- Car customization: existing v133 vehicle customization files.
- Community rooms: existing `community.js` and `communities`/`chats` integration.
- Group games: existing `games.js`.
- Pull-cord login intro: existing `auth-scene.js`, `auth-v121.css` and the lamp markup in `index.html`; retained without changing the authentication flow.

## Deployment note
The Firestore rules file has changed. Deploy the updated `firestore.rules` together with the site files before testing friend requests, notifications, and private rooms. Do not deploy only the HTML/JS files.

## Safety and compatibility
- No existing chat/auth/economy functions were replaced.
- The new module is isolated in `social-expansion.js` and `social-expansion.css`.
- Private rooms use existing chats and are readable only to chat members under the existing chat rules.
- Test with two separate accounts to validate request, acceptance, reciprocal friend list and notifications.

## Scope not completed in this release
- A full furniture/interior editor for owned homes and buildings is not included yet; current property systems cover purchase/ownership and related management.
- The current multiplayer mini-game is XO. Additional mini-games are not included in v137.
- No live Firebase deployment was performed. Firestore rule changes must be deployed by the project owner.
