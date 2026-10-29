/* The Squad — الإشعارات للموبايل: تسجيل الجهاز + طلب الإرسال من الـ Worker */
const PUSH_URL=typeof PUSH_WORKER!='undefined'?PUSH_WORKER:'',VK=typeof VAPID_KEY!='undefined'?VAPID_KEY:'';
const hx=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].slice(0,12).map(b=>b.toString(16).padStart(2,'0')).join('');
async function enablePush(quiet){
 try{
  if(!PUSH_URL||!VK||VK.startsWith('PUT'))return quiet||toast('حط رابط الـ Worker ومفتاح VAPID في firebase-config.js الأول');
  if(!window.Notification||!navigator.serviceWorker||!('PushManager' in window))return quiet||toast('جهازك مش بيدعم الإشعارات. على الآيفون: مشاركة ← إضافة للشاشة الرئيسية وافتحه من هناك');
  if(Notification.permission!='granted'){if(quiet)return;if(await Notification.requestPermission()!='granted')return toast('لازم تسمح بالإشعارات')}
  const reg=await navigator.serviceWorker.ready,t=await firebase.messaging(fbApp).getToken({vapidKey:VK,serviceWorkerRegistration:reg});
  if(!t)return quiet||toast('مقدرتش أجيب توكن الإشعارات');
  await db.doc(`users/${me.uid}/dev/${await hx(t)}`).set({tk:t,ua:navigator.userAgent.slice(0,80),t:FV.serverTimestamp()});
  localStorage.pushOn=1;quiet||toast('الإشعارات اتفعلت 🔔')
 }catch(e){console.warn(e);quiet||toast('حصلت مشكلة في الإشعارات')}}
async function pushNotify(k,cid,body){if(!PUSH_URL||!auth.currentUser)return;
 fetch(PUSH_URL,{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+await auth.currentUser.getIdToken()},body:JSON.stringify({k,cid,body})}).catch(()=>{})}
auth.onAuthStateChanged(u=>{if(u&&window.Notification&&Notification.permission=='granted')setTimeout(()=>enablePush(1),3000)});
function openFrom(id){let n=0;const t=setInterval(()=>{if(typeof C!='undefined'&&C[id]){clearInterval(t);go('home');openChat(id)}else if(++n>40)clearInterval(t)},250)}
if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',e=>e.data&&e.data.cid&&openFrom(e.data.cid));
const pc0=new URLSearchParams(location.search).get('c');if(pc0){openFrom(pc0);history.replaceState(0,'',location.pathname)}
