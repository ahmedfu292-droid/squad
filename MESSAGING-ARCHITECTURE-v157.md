# The Squad Chat — v157 Zero-Cost Foundations

## Applied

- Firestore local persistence remains enabled where supported.
- The live chat listener still loads only the latest 100 messages rather than the entire history.
- New chat images are browser-compressed to at most 180,000 data-URL characters and sent in the existing `im` message field.
- New voice notes use low-bitrate browser Opus where supported, are capped at 30 seconds, and are sent in the existing `au` field under 180,000 characters.
- The existing Firestore rules already validate `im` and `au` as bounded base64 data URLs (200,000 characters), so no rules upload is required for these two changes.
- Existing legacy `imPath` / `auPath` messages retain their old Storage loader. New uploads no longer create Storage paths.
- Unread badges derive a one-message fallback from chat summary timestamps if the optional server trigger is not available.

## Deliberately not represented as complete

The current application does not use Erlang, XMPP/FunXMPP, or Signal Protocol. It does not have millions of concurrent connections. It uses Firebase Authentication + Cloud Firestore listeners, with the free-tier quotas documented by Firebase. The message body and summary text are not end-to-end encrypted.

## Next safe architecture stages

1. Replace Firebase Storage use for social posts and Cinema with an authenticated Cloudflare R2 Worker. Every upload/read/delete must verify Firebase ID tokens and the existing Firestore rules/ownership semantics before touching R2. Never expose an unrestricted bucket endpoint.
2. Replace Firebase callable functions with a Cloudflare Worker only after implementing and testing every callable used by Auth, username/account lookup, Economy, and Admin. Keep critical authorization and economy operations server-side; do not move them into untrusted browser code.
3. Add Signal-compatible E2EE as a separate opt-in migration: device identity keys, signed prekeys, one-time prekeys, Double Ratchet sessions, group sender keys, key-change warnings, encrypted attachments and previews, and recovery/multi-device design. Do not enable until interoperability and adversarial tests pass.
4. Add quota telemetry and client-side upload limits before any larger user rollout. Spark quotas are hard ceilings, not a promise of unlimited traffic.

## Important account/project check

The current `firebase-config.js` targets `chatapp-67eb6`. Historical setup notes mention `the-squad-e36e7`. v157 leaves this untouched. Verify the correct project before deploying rules or connecting a production domain.
