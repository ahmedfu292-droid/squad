# ملاحظة
فولدر functions اتغير اسمه إلى firebase-functions عشان Cloudflare Pages بيرفض أي فولدر اسمه functions (رسالة: Pages functions are not supported).
محتواه ما اتغيرش، و firebase.json اتعدل يشاور على الاسم الجديد.
لنشر الـ Functions على Firebase: cd firebase-functions && npm install ثم firebase deploy --only functions
