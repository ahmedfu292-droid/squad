# The Squad v148 — Full Audit & Fix

- Preserved the four-folder project layout (`chanse1`–`chanse4`) and all existing feature files.
- Updated release metadata and service-worker cache namespace to v148.
- Updated release regression assertions to validate the current build/cache.
- Escaped dynamic report text and timestamps before inserting them into the admin dashboard.
- Made unavailable dashboard counts display as unavailable rather than zero; unknown service checks are shown as unverified.
- Corrected withdrawal accounting: approval for manual payout no longer increments total withdrawn. An admin must separately record that a manual transfer was completed before the amount is counted as withdrawn.
- Kept wallet operations server-authorized through the existing private admin UID mapping.

## Verification limits
Static checks and repository tests only. No browser visual test, Firebase emulator test, live deployment, or actual money transfer was performed.
