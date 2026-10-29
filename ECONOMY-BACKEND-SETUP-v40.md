# The Squad v40 — Server-authoritative economy integration

## What's included
- Firebase callable Functions v2 in `functions/index.js`: `economyGet` and `economyAction`.
- Client now loads the Firebase Functions compat SDK and uses callable actions for coin collection, job rewards, bank deposits/withdrawals, catalog-car purchases, apartment/estate purchases, and hiring estate staff.
- Server-owned wallet/bank and ownership maps are applied to the UI; localStorage is no longer the authority after the server state loads.
- Firestore rules deny direct client reads/writes to `/economy/{uid}`. Cloud Functions use Admin SDK transactions.
- Client no longer displays locally fabricated daily bank interest.

## Owner deployment steps (you said you'll upload the rules)
1. Review `firestore.rules` and deploy it to the intended Firebase project.
2. From this project folder run `cd functions && npm install`.
3. Run `npm run lint` from `functions/`.
4. Deploy functions with Firebase CLI: `firebase deploy --only functions` (make sure the CLI is targeting the correct project).
5. Test with two authenticated accounts and the Firebase Emulator Suite before public release.
6. Configure Firebase App Check and then enable enforcement after confirming the app is registered.

## Important production limits
- I have not deployed anything to your live Firebase project, and the callable endpoints have not been verified against your deployed project. The UI's economy will show an error until `economyGet`/`economyAction` are deployed in region `europe-west1` and the signed-in user can call them.
- Server-side job rewards are rate-limited but do not yet verify trusted server-observed player proximity/movement; treat them as a prototype reward loop until anti-cheat validation is added.
- The economy starts with zero server wallet/bank balances and intentionally does not import old localStorage balances, because local values are editable by users. Decide on a trusted migration/grant policy before launch.
- App Check enforcement is not enabled in code yet; configure the app and test before turning it on.
- Catalog cars remain procedural archetypes until properly licensed GLB/glTF vehicle assets are added.
