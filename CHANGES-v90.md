# The Squad v90 — Premium World Experience

- Added adaptive 3D render resolution based on sustained frame-rate bands, while keeping simulation and network updates running at their existing cadence.
- Pauses the animation loop while the page is backgrounded and resumes safely when visible again.
- Clears held movement inputs when pausing to prevent stuck movement after tab/app switching.
- Includes v89 responsive premium UI refinements.
- No Firebase configuration, Firestore/Storage rules, Cloud Functions, chat/account modules, or original vehicle models were changed.
- Added working home-screen launch cards for existing destinations; these call the existing world and navigation entry points rather than adding mock sections.
