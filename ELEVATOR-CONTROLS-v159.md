# Elevator controls — v159

The city already contained moving lift cabins. v159 adds a player-facing control layer without replacing their geometry or changing the existing Firestore schema.

## Using a lift
1. Walk to the lift lobby inside a building.
2. Press **E** or select **استدعاء المصعد**.
3. Wait for the cabin to arrive and open its doors.
4. Choose a destination floor in the premium lift panel.
5. The avatar rides with the cabin and steps out after the destination doors open.

The panel supports mouse, touch, keyboard Escape to close, Arabic floor names, and responsive narrow-screen layout.

## Performance and cost
- Unused elevators retain the original deterministic automatic movement.
- A called elevator uses bounded smooth interpolation between known floor heights.
- UI updates only when lift state changes; it does not poll Firestore.
- Elevator controls do not add Firestore writes or new cloud services.
- Devices advertising Save-Data are placed in the existing conservative graphics profile. Adaptive pixel ratio and reduced update cadence remain in place.

## Multiplayer limitation
The existing presence protocol does not include an elevator field. To preserve its strict Firestore rules and avoid extra writes, the controlled ride is local to the player. Other players see the rider at the last lobby position until the destination position is published. A synchronized cabin for all players would require a separately reviewed multiplayer presence/rules change.

## Boarding safety
- Destination-floor controls remain disabled until the car is parked at the calling floor and the visible door animation is more than 92% open. The selection handler independently enforces the same condition.
- Leaving the district while riding restores the saved lobby position and clears ride state, avoiding a stuck player on re-entry.
