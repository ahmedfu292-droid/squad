# The Squad v116 — Server phase finalization

- Preserved the 20 allowlisted country room IDs (`srv_eg` ... `srv_br`) and the legacy `main` room.
- Improved server picker accessibility with `aria-pressed` reflecting the selected country.
- Clarified live count semantics: a live count is shown only for the room currently subscribed to; other rooms explicitly say the count appears after joining. This avoids presenting stale or fabricated counts and avoids 20 extra Firestore listeners.
- Clear the locally cached count and timestamp when leaving a country room.
- Updated release metadata and Service Worker cache namespace to v116.

## Important architecture boundary
These are 20 logical Firestore rooms in one Firebase project, not 20 physical servers in 20 countries. No region-specific latency routing, server-side occupancy reservation, or hard 20-player capacity is implemented. A trustworthy hard capacity limit needs a server-authoritative allocator/transaction. This release does not claim that limit.
