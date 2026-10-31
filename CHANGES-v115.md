# The Squad v115 — Live Server Status

- Adds live player count for the country server currently entered, sourced from its existing `world/srv_{country}/players` snapshot.
- Other country servers explicitly show that their count is unavailable until entered; no fake counts and no 20 extra listeners.
- Clears in-memory count on leaving to avoid stale status.
- Bumps Service Worker cache and version marker.

No Firestore schema/rules, Firebase config, project alias, or paid service changed.
