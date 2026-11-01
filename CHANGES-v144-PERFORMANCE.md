# The Squad v144 — Performance and stability pass

## Implemented
- Service worker now uses network-first for HTML/version metadata and cache-first for versioned static assets. Cached JS/CSS/images no longer trigger an extra network request on every hit.
- Versioned cache key bumped to v144 so the new strategy does not reuse stale v143 cache entries.
- Added an automatic lightweight visual profile for devices reporting <=4 CPU cores, <=4 GB device memory, or Save-Data enabled. It reduces expensive blur/backdrop effects and decorative motion without removing app features.
- Removed the unused Manrope Google Fonts family request; Cairo, IBM Plex Sans Arabic, and Sora remain.
- Existing city low-end rendering and adaptive resolution code is preserved.

## Audit findings / next priorities
1. Add pagination and bounded queries to social feed, chat history, stories, and member discovery; verify every Firestore listener is unsubscribed when a screen closes.
2. Move large media to responsive WebP/AVIF variants with thumbnails, lazy loading, and upload-size limits.
3. Add automated Firebase Emulator tests for auth, chat membership, economy, purchases, transfers, and abuse/rate limits.
4. Profile city/cafe 3D scenes on a real low-end laptop; reduce draw calls and shadow casters only where measurements show a bottleneck.
5. Add server-side monitoring for failed writes, function latency, storage errors, and client JS exceptions.
6. Add accessibility pass: keyboard navigation, focus visibility, contrast, and reduced-motion coverage.

## Verification boundaries
This is a source/static optimization pass. Syntax and static regression checks are run in this build. It is not a browser Lighthouse run, live Firebase load test, real-user performance measurement, or deployment. The low-power profile is based on browser-reported device hints, which are not available on every browser.
