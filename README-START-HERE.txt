THE SQUAD v69 — START HERE

1) Unzip this package.
2) The website source is in the squad_v68 folder. Use that folder as the static-site root.
3) Do not replace live Firebase rules blindly. The package includes Firestore/Storage rules and Firebase config; review and test them on a staging project first.
4) Preview the site and check login, 3D room, movement, car buying/transfers, and chat before production deployment.
5) A known palace-stairs navigation test remains failing; this package does not claim it is fixed.
6) Keep the previous deployment as rollback until the new build passes your real-device tests.

What changed in v69: lower default 3D rendering load, lightweight default on devices reporting <=4 GB memory, slower position writes, and throttled coin checks.
