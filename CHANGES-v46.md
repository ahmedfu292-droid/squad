# The Squad v46 — City crews, neon vehicle styling, and transfers

- Added visible autonomous engineer NPCs at six city work zones. They continuously patrol small routes and have high-visibility vests, hard hats, tools, and cyan site markers. This is an in-game ambient simulation, not a persistent offline city-building service.
- Added restrained per-car neon underglow and side accent strips while retaining existing body/interior/wheel details.
- Added bank-to-bank transfers by recipient Firebase UID. The server validates amount, prevents self-transfer, checks recipient account existence, and applies both sides within the Firestore transaction.
- Added ownership transfers for catalog cars, estates, and apartments, with server-side ownership and duplicate checks in a Firestore transaction.
- Added bank UI actions for money and asset transfers. Recipient needs to have opened the game at least once; the UID must be shared out-of-band.
- Existing project files and features were retained; this is an incremental upgrade. Real-world deployment, multi-account Firebase integration, and in-browser visual verification still require testing in the configured Firebase project/browser.
