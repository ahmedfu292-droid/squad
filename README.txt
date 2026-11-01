The Squad v137 — divided into four folders

This archive contains the v137 update. The original project files remain distributed among chanse1, chanse2, chanse3, and chanse4. These are four file groups, NOT four independently deployable websites. Extract the ZIP and merge the contents of all four chanse folders into one project directory, preserving relative paths, then deploy that merged directory.

v137 additions:
- Friend search and friend requests (accept/reject and retry after rejection).
- Live unread notification panel.
- Private group-room creation from accepted friends.
- New social dashboard entry for these functions.
- Firestore rules for the new friend and notification collections.

Existing systems retained and linked:
- Avatar appearance editor in Settings > Appearance.
- Car dealership, wallet/bank, property and apartment purchases in the 3D city.
- Vehicle paint/rim/ride/neon customization in the city workshop (near/inside an owned car).
- Community rooms and existing XO multiplayer game.
- Pull-cord lamp login intro and original authentication logic.

Important limitations:
- The existing mini-game implementation includes XO; a broader collection of mini-games has not been added in v137.
- Properties and apartments can be purchased/managed, but a full furniture/interior-building editor is not implemented yet.
- Live friend/notification/room behavior requires the updated Firestore rules to be deployed. No Firebase deployment was performed here.
- Browser/device end-to-end testing was not available. See chanse4/TEST-REPORT-v137.txt.

Do not replace only index.html. Deploy the complete merged project and the updated firestore.rules together.

v138: Added Supervillain Mansion to the wealthy district at 20,000,000 game coins. Deploy the updated chanse4/firebase-functions/index.js as well as the web files. The provided GTA V YMAP/XML is not directly loadable by the Three.js city; the website version is a native Three.js adaptation, not a direct YMAP import. See chanse4/CHANGES-v138-SUPERVILLAIN-MANSION.md and TEST-REPORT-v138.txt.

v139: Added a server-authoritative shared bank vault robbery mission (one global attempt per server hour), fictional mission equipment, assistants, security upgrades, and low-end city render/fog tuning. Deploy both the updated web files and chanse4/firebase-functions/index.js; see chanse4/CHANGES-v139-BANK-ROBBERY-PERFORMANCE.md.


v147 ADMIN PLATFORM WALLET:
See CHANGES-v147-ADMIN-PLATFORM-WALLET.md. Deploy Firebase Functions before using wallet actions. This feature tracks earnings and withdrawal requests only; it does not transfer real money automatically.


The Squad v148: full audit fixes. See CHANGES-v148-FULL-AUDIT-FIX.md.
