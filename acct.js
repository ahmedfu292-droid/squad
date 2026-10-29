/* The Squad v26 — محرّك الحسابات المتعددة. بيتحمّل بعد firebase-config.js وقبل app.js.
   الفكرة: كل حساب محفوظ له «خانة» (slot) = نسخة Firebase مستقلة باسمها، والمكتبة نفسها بتحفظ جلسته على الجهاز.
   - مفيش ولا كلمة سر بتتخزّن (لا نص عادي ولا مشفّر). اللي بيتحفظ هو جلسة Firebase الرسمية لكل خانة.
   - التبديل = تغيير الخانة النشطة + إعادة تحميل الصفحة، فمفيش أي بيانات في الذاكرة بتتسرّب من حساب للتاني.
   - مفاتيح localStorage الخاصة بالحساب (سجل المكالمات، المسودات، الخلفية...) بتتفصل بسابقة الخانة.
   - قفل التبديل (PIN) اختياري: بيتخزّن مشتق PBKDF2 مع salt، مش الرقم نفسه. */
(()=>{
const RL=window.localStorage;
const DEV=['theme','lang','nb','np','pushOn','sqSlot','sqAccts','sqLock','sqLockN','sqLockT','sqAdd','sqPrev'];   // مفاتيح الجهاز (مش بتتفصل)
let slot='';try{slot=RL.getItem('sqSlot')||''}catch(e){}
const pre=slot?slot+'~':'';
const key=k=>(!pre||DEV.includes(k))?k:pre+k;

/* فصل localStorage: لو الخانة مش الأساسية، كل مفتاح خاص بالحساب بياخد سابقة الخانة */
let nsOk=!pre;
if(pre){
 try{
  const px=new Proxy({},{
   get(t,k){if(typeof k!='string')return undefined;
    if(k=='getItem')return n=>RL.getItem(key(String(n)));
    if(k=='setItem')return(n,v)=>RL.setItem(key(String(n)),String(v));
    if(k=='removeItem')return n=>RL.removeItem(key(String(n)));
    if(k=='clear')return()=>{Object.keys(RL).filter(x=>x.startsWith(pre)).forEach(x=>RL.removeItem(x))};
    if(k=='key')return i=>{const a=Object.keys(RL).filter(x=>x.startsWith(pre)).map(x=>x.slice(pre.length));return a[i]??null};
    if(k=='length')return Object.keys(RL).filter(x=>x.startsWith(pre)).length;
    const v=RL.getItem(key(k));return v===null?undefined:v},
   set(t,k,v){RL.setItem(key(String(k)),String(v));return true},
   deleteProperty(t,k){RL.removeItem(key(String(k)));return true},
   has(t,k){return RL.getItem(key(String(k)))!==null}
  });
  Object.defineProperty(window,'localStorage',{configurable:true,get:()=>px});
  nsOk=window.localStorage===px;
 }catch(e){nsOk=false}
}

const rd=k=>{try{return JSON.parse(RL.getItem(k)||'null')}catch(e){return null}};
const list=()=>{const a=rd('sqAccts');return Array.isArray(a)?a:[]};
const save=a=>{try{RL.setItem('sqAccts',JSON.stringify(a))}catch(e){}};
const newSlot=()=>'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const reload=()=>{location.href=location.pathname};

/* تطبيق Firebase لخانة تانية (للخروج منها فقط، من غير ما نبدّل الحساب الحالي) */
async function otherApp(sl){
 const nm=sl||'[DEFAULT]';
 try{return firebase.app(nm)}catch(e){return firebase.initializeApp(firebaseConfig,sl||undefined)}}

/* ---------- قفل التبديل (PIN) ---------- */
const b64=u=>btoa(String.fromCharCode(...new Uint8Array(u))),ub64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function kdf(pin,salt,it){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);
 return new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:it,hash:'SHA-256'},k,256))}
const lockOn=()=>!!rd('sqLock');
async function lockSet(pin){const s=crypto.getRandomValues(new Uint8Array(16)),it=150000,h=await kdf(pin,s,it);
 RL.setItem('sqLock',JSON.stringify({s:b64(s),h:b64(h),i:it}));RL.removeItem('sqLockN');RL.removeItem('sqLockT')}
function lockOff(){RL.removeItem('sqLock');RL.removeItem('sqLockN');RL.removeItem('sqLockT')}
const waitMs=()=>Math.max(0,(+RL.getItem('sqLockT')||0)-Date.now());
async function lockCheck(pin){const L=rd('sqLock');if(!L)return true;if(waitMs())return false;
 const h=await kdf(pin,ub64(L.s),L.i);let d=0;const g=ub64(L.h);for(let i=0;i<g.length;i++)d|=g[i]^h[i];
 if(!d){RL.removeItem('sqLockN');RL.removeItem('sqLockT');return true}
 const n=(+RL.getItem('sqLockN')||0)+1;RL.setItem('sqLockN',n);if(n>=5){RL.setItem('sqLockT',Date.now()+30000*Math.min(8,n-4))}
 return false}

/* ---------- العمليات ---------- */
const A={
 slot,nsOk,list,lockOn,lockSet,lockOff,lockCheck,waitMs,newSlot,
 upsert(m){const a=list(),i=a.findIndex(x=>x.uid==m.uid);
  if(i>=0)a[i]={...a[i],...m,slot:a[i].slot};else a.push({...m,t:Date.now()});save(a);return a},
 byUid(uid){return list().find(x=>x.uid==uid)},
 isAdding(){return RL.getItem('sqAdd')=='1'},
 /* التبديل لحساب محفوظ */
 switchTo(sl){RL.setItem('sqSlot',sl);RL.removeItem('sqAdd');RL.removeItem('sqPrev');reload()},
 /* فتح شاشة دخول/تسجيل لحساب تاني من غير ما نمسح الحالي */
 addNew(){RL.setItem('sqPrev',slot);RL.setItem('sqAdd','1');RL.setItem('sqSlot',newSlot());reload()},
 cancelAdd(){const p=RL.getItem('sqPrev')||'';RL.removeItem('sqAdd');RL.removeItem('sqPrev');RL.setItem('sqSlot',p);reload()},
 done(){RL.removeItem('sqAdd');RL.removeItem('sqPrev')},
 wipe(sl){if(!sl){Object.keys(RL).filter(x=>/^(d_.*|clog|bh|nts|avc|look|lookimg|stars|seen|newacc)$/.test(x)).forEach(x=>RL.removeItem(x));return}Object.keys(RL).filter(x=>x.startsWith(sl+'~')).forEach(x=>RL.removeItem(x))},
 /* إزالة حساب من القايمة + إنهاء جلسته على الجهاز (الحساب نفسه ما بيتمسحش من السيرفر) */
 async remove(sl){const a=list(),m=a.find(x=>x.slot==sl);
  try{const ap=await otherApp(sl);await ap.auth().signOut()}catch(e){}
  save(a.filter(x=>x.slot!=sl));A.wipe(sl);return m},
 async removeAll(){const a=list();
  for(const m of a){try{const ap=await otherApp(m.slot);await ap.auth().signOut()}catch(e){}A.wipe(m.slot)}
  try{const ap=await otherApp(slot);await ap.auth().signOut()}catch(e){}
  save([]);RL.removeItem('sqSlot');RL.removeItem('sqAdd');RL.removeItem('sqPrev');A.lockOff();reload()}
};
window.ACCT=A;
})();
