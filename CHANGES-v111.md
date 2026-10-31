# The Squad v111 — Quality Engineering & Organization

- Added `tests/run_quality_gate.js` as a repeatable one-command Node test runner.
- Added `tests/v111_quality_gate_test.js` for release metadata, cache version, protected files, lazy-loader continuity, and retained multiplayer modules.
- Updated two historical tests to validate forward-compatible build numbers rather than fail solely because the release number advanced.
- Added `QA-PLAYBOOK-v111.md` with repeatable local validation and a release checklist.
- Added `TEST-REPORT-v111.txt` with exact executed results and limitations.
- Advanced `version.json` and Service Worker cache identifier to v111.

No existing gameplay feature or project file was intentionally removed. Firebase config/project selection and Firestore/Storage rules remain byte-for-byte unchanged from v110.
