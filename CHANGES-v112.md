# The Squad v112 — Country Rooms & Offline Shell

## Added
- 20 country-labelled public rooms in the 3D cafe lobby. Each maps to a distinct Firestore `world/srv_<code>` room.
- Firestore `roomOk()` permits only the explicit country room codes, preserving existing `main` and private-room behavior.
- Offline status banner; cached app shell can be opened after a successful online visit.
- Service worker cache version bumped to v112.

## Important limits
- These are logical rooms in the same Firebase project, NOT 20 geographically separate physical servers.
- This change does not enforce a 20-player capacity per room. That requires trusted allocation/capacity control.
- Offline mode opens cached interface/assets only. Firebase login, messages, live presence, calls and multiplayer need internet.
- New Firestore rules must be deployed by the project owner before country rooms can read/write.
