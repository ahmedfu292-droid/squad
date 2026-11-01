# The Squad v143 — VIP Chauffeur Convoy

- Added a VIP chauffeur route selector using the city’s existing named destinations.
- Requesting the convoy spawns a lead limousine-class car plus two escort cars.
- A simple visible procedural driver figure is attached to the lead vehicle.
- The lead car opens its hinged doors briefly, then drives toward the selected destination.
- Escort vehicles follow the lead car; the player’s position and camera follow the lead vehicle during the trip.
- The chauffeur can be stopped from the same entourage panel; normal player control returns.

## Limits
This is a client-side NPC simulation in the current district session. Navigation uses direct steering with a basic blocked-position check, not a full road/pathfinding graph. Convoy state is not synchronized as independent multiplayer NPC vehicles and is not persistent. Visual/browser QA and live deployment were not performed.
