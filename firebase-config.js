// قيم مشروع Firebase بتاعك (Project settings ← Your apps ← Web app)
const firebaseConfig = {
  apiKey: "AIzaSyCXZPZu6UwkFoDK5uXBc1I_910GCI_e7IE",
  authDomain: "chatapp-67eb6.firebaseapp.com",
  projectId: "chatapp-67eb6",
  storageBucket: "chatapp-67eb6.firebasestorage.app",
  messagingSenderId: "191159196724",
  appId: "1:191159196724:web:d6db5b85ad4adc28d37e61"
};

// ===== الإشعارات (انسخ القيمتين من الخطوات اللي بعتهالك) =====
const PUSH_WORKER = 'PUT-WORKER-URL-HERE';   // رابط الـ Worker بعد ما تنشره، مثال: https://squad-push.اسمك.workers.dev
const VAPID_KEY   = 'BL0WRGHYINUZiTDWdwRtbu68sLXy7_MnjeUDAHqriTAL32DLEXCPZsUwSneh0IOsWFTkVpHpXJnZ9a4BOMaqKq8';    // Firebase ← إعدادات المشروع ← Cloud Messaging ← Web Push certificates

// سيرفرات الاتصال للمكالمات. STUN مجاني كفاية لمعظم الشبكات.
// لو مكالمة فشلت على نت الموبايل: اعمل حساب مجاني على metered.ca أو Cloudflare Calls وضيف سيرفر TURN هنا.
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
  // { urls: 'turn:YOUR-TURN-HOST:443', username: 'USER', credential: 'PASS' }
];
