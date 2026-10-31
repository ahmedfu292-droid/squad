# The Squad v65 — stable vehicle IDs and lighter update polling

- Replaced positional `catalog_1`…`catalog_120` client keys with deterministic name-based IDs.
- Server-owned prices now use the same stable IDs, generated from the catalog's Latin names.
- Added backward-compatible ownership migration: legacy `catalog_N` owned flags are mapped to stable IDs and both aliases are retained so old clients remain compatible during rollout. New purchases also write the legacy alias.
- Reduced automatic update-check polling from 38 files every 2 minutes to 5 core files every 8 minutes. This is a safe incremental reduction; it is not yet a single-manifest deployment system or a bundled build.
- No production service was accessed or deployed.
