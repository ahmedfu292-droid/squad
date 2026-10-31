# The Squad v99 — Core Platform Finalization

## Implemented
- Registration now collects a real email address and uses it as the Firebase Authentication email; the password remains managed by Firebase Authentication.
- Existing login accepts email + password. Legacy private-ID / username login remains routed through the previous synthetic `@squad.id` identity for backward compatibility.
- Country selection and country calling code + local phone validation remain part of registration. The generated official/private account ID remains exactly 10 digits, non-zero first digit.
- Added a standalone Services Hub linked from the social shell: ChatGPT, Claude, Google Gemini, Amazon, Noon, eBay, Jumia Egypt, Google Play Games and Steam. External links open in a new tab.
- No Firebase config, Firestore rules, Storage rules, chat engine or call engine changes.

## Important limitations
- Existing accounts created with synthetic `@squad.id` Firebase identities are not automatically migrated to real email identities. Their legacy login remains supported; email login applies to newly registered accounts.
- Email verification, SMS/phone OTP, password reset, and duplicate-account migration were not added because they require additional Firebase/Auth flow and potentially provider configuration.
- The ten-digit account ID is an account identifier, not an official government identity number. No government-ID verification is performed.
- Services Hub links out to third-party websites; it does not embed their accounts, provide shopping checkout, or install games inside The Squad.
- Firebase project remains whatever is already configured in `.firebaserc` / `firebase-config.js`; not changed in this build.
