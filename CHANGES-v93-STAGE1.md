# The Squad v93 — The Dark Room / Stage 1

- المرحلة الحالية هي شاشة الدخول فقط. لا يوجد تنفيذ للمرحلة 2 ولا أدوات ذكاء اصطناعي جديدة.
- اكتملت حالات العرض العشر: قبل الشد، أثناء الشد، العتبة، الوميض، الكارت، الخطأ، التحميل، النجاح، حساب جديد، وتبديل الحسابات.
- `login-preview.html` معاينة مستقلة بلا Firebase أو استدعاء auth.js، وتحتوي أزرار تبديل الحالات. تستخدم `auth.css` المحلي للحفاظ على نفس الخطوط والأبعاد والستايل.
- `auth-scene.js` و`auth.css` هما طبقة العرض فقط. لم يتم تعديل `auth.js` أو `acct.js` أو `accounts.js` أو ملفات Firebase أو قواعدها.
- تم الحفاظ على IDs الموجودة في شاشة الدخول.
- لم يتم تعديل أي اختبار قديم.

## الاختبارات القديمة ذات توقع الإصدار السابق

لم يتم تعديل أي ملف داخل `tests/`. الاختبارات التالية ما زالت تتوقع اسم الكاش/الإصدار `v90-premium-world-experience` أو `squad-v90-premium-world-experience`، بينما الإصدار الحالي v93 لتحديث الكاش: `v72_living_palace_engine_test.js`, `v73_premium_design_test.js`, `v74_city_expansion_test.js`, `v80_city_life_test.js`, `v81_neighborhood_realism_test.js`, `v82_living_city_test.js`, `v83_photoreal_city_test.js`, `v84_vehicles_roads_water_test.js`, `v85_realism_drive_water_test.js`, `v86_camera_collision_stability_test.js`, `v87_economy_guardrails_test.js`, `v88_multiplayer_sync_test.js`. فشلها هنا متعلق بتوقع تسمية v90 القديمة وليس بفحص شاشة الدخول. ملفا `fakefb.js` و`fakefb2.js` أدوات مساعدة للاختبارات وليسا اختبارين مستقلين للتشغيل المباشر.
