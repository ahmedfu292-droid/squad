# The Squad v147 — Admin Platform Wallet

- Added admin-only platform wallet ledger view to the existing Control Center.
- Added server-authorized earning entries, balance tracking, withdrawal requests, and approve/reject workflow.
- Added transaction history and masked/no payout destination storage in this build.
- Supported method labels: Vodafone Cash, bank transfer, and other approved provider.
- Important: this is a ledger and withdrawal-request workflow, NOT an automatic payment gateway. “Approve” records approval for manual payout only.
- Admin authorization remains tied to the existing private Firebase ID mapping `ids/1000000000` so the existing account/login architecture is not broken. `10000000000` is displayed as the platform wallet label, not used as an authentication credential.
- Deployment required: deploy Firebase Cloud Functions from `chanse4/firebase-functions` and confirm the authorized admin mapping before use.
- No real payment destination phone numbers or payout secrets are included in source code.
