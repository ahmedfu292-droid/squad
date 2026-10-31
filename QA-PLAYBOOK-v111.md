# The Squad v111 — Quality Engineering & Organization

## Purpose
This release raises the repeatability of local development checks. It does not claim live-service readiness or change gameplay/backend behavior beyond the release/cache marker.

## Run the local quality gate
From the project root, with Node.js installed:

```bash
node tests/run_quality_gate.js
```

The runner executes retained security, chat-rules, metadata, nearby-player, lazy-loading, quality-gate, and multiplayer-sync static tests.

## Syntax validation
Run from the project root:

```bash
find . -type f -name '*.js' -not -path './node_modules/*' -print0 | xargs -0 -n1 node --check
```

Some browser-only scripts can pass syntax validation without being executable in Node. Syntax checks are not browser integration tests.

## Release checklist
- [ ] Run `node tests/run_quality_gate.js`.
- [ ] Run the recursive JavaScript syntax command above.
- [ ] Test first-load and repeat-load of city/cafe in a real browser.
- [ ] Verify cache refresh after deployment.
- [ ] Verify Firestore rules and Storage rules in Firebase Emulator before publishing.
- [ ] Test two or more real signed-in users; never infer multiplayer success from static tests.
- [ ] Confirm `firebase-config.js` and `.firebaserc` remain unchanged.

## Known limitations
- The room capacity of 20 is not yet guaranteed by an authoritative allocator.
- Nearby-player filtering and lazy-loading require live browser/Firebase testing.
- The historical tests `v100`, `v101`, `v105`, `v106`, and `v107` include fixed old-version assertions; failures caused by stale version labels are recorded separately and should not be mistaken for current runtime regressions.
- `tests/run.py` is a Playwright browser suite and requires Python Playwright plus Chromium; it is not run by the Node quality gate.
- No paid service, deployment, Firebase write, or project setting was used by this release.
