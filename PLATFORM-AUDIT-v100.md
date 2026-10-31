# The Squad v100 — Platform organization & audit

## Scope
Organized and audited the v99 package without adding a new product feature or changing Firebase configuration/rules. The only runtime edits are the version metadata and Service Worker cache namespace so the browser installs a fresh cache for this build.

## Findings and actions
1. **Stale Service Worker cache namespace:** `version.json` said build 99 while `sw.js` still used `squad-v98-chat-tools-assistants`. Bumped the cache namespace to `squad-v100-platform-audit` and build metadata to v100. This avoids reusing the old cache namespace on upgrade.
2. **Precache integrity:** checked all 64 paths in the Service Worker precache list; all 64 exist.
3. **Local HTML references:** checked local `src`/`href` references in `index.html`, `login-preview.html`, `services-hub.html`, and `app-preview.html`; zero missing local references.
4. **File preservation:** compared v99 input archive with v100 package: zero pre-existing files removed; five files added (audit report, upload list, test report, mobile checklist, new static regression test).
5. **Protected files:** byte-for-byte unchanged versus v99: `acct.js`, `firebase-config.js`, `.firebaserc`, `firestore.rules`, `storage.rules`, `chatx.js`, `community.js`, `calls.js`, `channel.js`. `auth.js` was already modified in v99 for the requested email signup flow; this audit does not revert that prior authorized change.

## Test results actually run
- Node syntax check: all 82 JavaScript files passed `node --check`.
- Historical Node regression scripts: 25 passed; 15 failed.
- New `tests/v100_platform_audit_test.js`: passed (64 precache paths, required HTML integration points, protected-file hashes).
- ZIP integrity: passed (`unzip -t`).
- Static HTML parsing and local reference audit: passed; no missing local references.

## Historical test failures
The 15 failing legacy tests are not silently counted as passes. Several assert hard-coded older release/cache identifiers (for example, v96 strings) and now fail after the version advances; others have assertions against older revisions. Each failure is retained in the test output and should be reviewed before treating the full historical suite as green. Two fake Firebase helper files are fixtures, not standalone tests, and were not counted.

## Not run / limitations
- Playwright browser tests could not launch because the Chromium executable is not installed in this environment.
- No real-device/mobile browser run, Lighthouse run, load/stress test, live Firebase Auth/Firestore/Storage test, or two-account messaging/call test was performed.
- No claim is made that production latency, responsiveness, or live chat correctness has been proven by this static audit.
- Firebase project remains `chatapp-67eb6` in `.firebaserc`; this is the project ID in the package, not confirmation that it is the user's intended production project.

## Recommended manual release gate
1. Deploy to a staging URL first.
2. Hard refresh / unregister old Service Worker once, then reload and verify build 100.
3. Test email signup/login, duplicate email, wrong password, password reset, and phone/country formatting.
4. Test two accounts for direct messages, groups, attachments, unread counts, block/report, and calls.
5. Test on Android Chrome and desktop Chrome; inspect console/network errors.
6. Run Lighthouse and a controlled concurrency/load test before public launch.
