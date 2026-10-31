# Final gate before The Squad city & cafe development

Do not publish or deploy this package yet.

Required gates:
1. Run `firebase emulators:exec --only firestore "node tests/security-emulator-v104.js"` after adding the Firebase Rules Unit Testing dependency and fixture data.
2. Test with two real test accounts: private profile isolation, public profile display, account-number lookup, username login, direct chat, block in both directions, read receipts, unread counts, group join/leave/admin kick.
3. Test existing accounts that have no `publicProfiles` document; verify sign-in migration creates it and profile search works.
4. Confirm the Firebase project configured in `.firebaserc` is the intended project before any deployment.
5. Configure App Check, TURN, Push Worker and budget alerts in the relevant consoles; do not place secret TURN credentials in client JavaScript.
6. Decide and implement authenticated Storage media delivery before migrating Firestore base64 attachments.
7. Run browser, mobile, accessibility, Lighthouse and load tests.

Only after these gates pass should the project move to city/cafe feature development.
