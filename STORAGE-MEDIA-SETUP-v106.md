# Chat media Storage setup — v106

New chat image and audio messages upload to `chat-media/{chatId}/{ownerUid}/{fileName}`. Storage rules permit access only to current chat members and block direct-chat media when either participant has blocked the other. Files are capped at 5 MiB.

The client uses Firebase Storage `getBlob()` so media is fetched through authenticated Storage Rules rather than saving public download-token URLs in Firestore. Browser cross-origin reads require the bucket CORS configuration in `storage-cors.json`.

Do not remove old `im` / `au` fields or old message records. Older messages still use their existing base64 data and remain supported. Historical migration is a separate resumable task and is not performed automatically in v106.
