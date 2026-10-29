/* The Squad — الدفعة 1: الدخول بالرقم، القايمة، الشات الخاص والجروبات */
/* v26: كل حساب محفوظ ليه نسخة Firebase باسم خانته (acct.js). الخانة الأساسية '' = النسخة الافتراضية القديمة، فحسابك الحالي ما بيتأثرش. */
const fbApp=firebase.initializeApp(firebaseConfig,(window.ACCT&&ACCT.slot)||undefined);
const auth=fbApp.auth(),db=fbApp.firestore(),FV=firebase.firestore.FieldValue;
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{}); // يفضل مسجّل دخول

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hue=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
const PH={},PQ={};
function phLoad(id){if(PQ[id])return;PQ[id]=1;const done=p=>{if(p){PH[id]=p;renderHome();tab=='me'&&viewMe();window.hdr&&cid&&hdr()}};
 db.doc('photos/'+id).get().then(s=>s.exists?done(s.data().ph):db.doc('users/'+id).get().then(u=>done(u.exists&&u.data().ph))).catch(()=>{})}
const av=(id,n,g)=>{const a=g?'':` data-u="${id}"`;return PH[id]?`<u class="av"${a} style="background:center/cover url('${PH[id]}')"></u>`:(phLoad(id),`<u class="av"${a} style="--h:${hue(id)}">${cart(id)}</u>`)};
/* v27: المحادثة الخاصة صورتها = صورة الطرف التاني (مش رقم المحادثة). الجروب بيفضل بصورته الافتراضية */
const peerOf=c=>c&&c.type=='p'?(c.members||[]).find(x=>x!=me.uid):null;
const avc=(c,n)=>c.type=='p'&&peerOf(c)?av(peerOf(c),n):av(c.id,n,1);
function cart(id){const h=hue(id),s=String(id),sk=['#f1c9a5','#d9a47a','#b87b55','#ffdcc0'][h%4],hr=['#1a1320','#3b2314','#0d0d18','#6b3fa0','#8a4b1f'][(h>>2)%5],cl=`hsl(${h} 70% 50%)`,st=(h+s.length)%3;
 return `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="hsl(${h} 55% 22%)"/><path d="M10 100c2-22 16-30 40-30s38 8 40 30z" fill="${cl}"/><rect x="43" y="60" width="14" height="16" fill="${sk}"/><path d="M34 76q16 10 32 0" stroke="#0005" stroke-width="3" fill="none"/><ellipse cx="50" cy="46" rx="20" ry="23" fill="${sk}"/>${st==0?`<path d="M29 46c-3-24 11-32 24-30 14 2 20 13 18 30-4-10-12-15-22-15s-16 5-20 15z" fill="${hr}"/>`:st==1?`<path d="M28 44c-2-20 8-30 24-29 15 1 22 11 20 29-6-8-10-14-24-12-8 1-16 4-20 12z" fill="${hr}"/>`:`<path d="M28 42c0-17 10-26 24-26s22 9 22 26z" fill="${hr}"/><rect x="24" y="40" width="52" height="5" rx="2.5" fill="${hr}"/>`}<circle cx="42" cy="48" r="2.7" fill="#111"/><circle cx="58" cy="48" r="2.7" fill="#111"/><circle cx="43" cy="47" r=".9" fill="#fff"/><circle cx="59" cy="47" r=".9" fill="#fff"/><path d="M43 57q7 6 14 0" stroke="#7a2b3b" stroke-width="2.4" fill="none" stroke-linecap="round"/>${h%2?`<path d="M27 46c-2-25 44-25 46 0" stroke="#1c2240" stroke-width="4" fill="none"/><rect x="23" y="42" width="7" height="14" rx="3" fill="#3fe0ff"/><rect x="70" y="42" width="7" height="14" rx="3" fill="#3fe0ff"/>`:''}${h%5==0?`<g stroke="#111" stroke-width="2" fill="none"><circle cx="42" cy="48" r="7"/><circle cx="58" cy="48" r="7"/><path d="M49 48h2"/></g>`:''}</svg>`}
const OK=n=>/^[1-9]\d{9}$/.test(n),MAIL=n=>n+'@squad.id';
const ms=t=>t&&t.toMillis?t.toMillis():Date.now();
const hm=d=>d.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'});
const fmt=t=>{const d=t&&t.toDate?t.toDate():new Date(Date.now());return d.toDateString()==new Date(Date.now()).toDateString()?hm(d):d.toLocaleDateString('ar-EG',{day:'numeric',month:'short'})};
const IC={plus:'M12 5v14M5 12h14',send:'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',mic:'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4',img:'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',smile:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',back:'M5 12h14M12 5l7 7-7 7',more:'M12 5h.01M12 12h.01M12 19h.01',home:'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',compass:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16 8l-2 6-6 2 2-6z',updates:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 12h.01M12 7a5 5 0 1 0 5 5',user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'};
const ic=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${IC[k]}"/></svg>`;
[['#plus','plus'],['#snd','send'],['#vn','mic'],['#ph','img'],['#em','smile'],['#bk','back'],['#mn','more']].forEach(([s,k])=>$(s).innerHTML=ic(k));
document.querySelectorAll('#nav button').forEach((b,i)=>b.querySelector('i').innerHTML=ic(['home','updates','compass','user'][i]));

let me,U={},C={},cid=null,M={},reply=null,sel=null,tab='home',flt='all',stick=0,lastMark='',tt=0;
let unU,unC,unM,booted=0;
const nm=()=>U.name||me.displayName||'عضو';
const cname=c=>c.type=='g'?c.nm:((c.names||{})[c.members.find(x=>x!=me.uid)]||'محادثة');
const toast=t=>{const e=$('#ts');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2200)};
const sheet=h=>{$('#sh .box').innerHTML=h;$('#sh').hidden=false};
const closeSh=()=>$('#sh').hidden=true;
$('#sh').onclick=e=>{if(e.target.id=='sh')closeSh()};

/* ---------- الدخول والتسجيل ---------- */
/* v26: الواجهة والمنطق اتنقلوا لـ auth.js (خطوات التسجيل + الدخول بالرقم أو اسم المستخدم + الحسابات المحفوظة). هنا بس اللي الملفات التانية معتمدة عليه. */
let mode='in';
const AE={'auth/invalid-credential':'الرقم أو كلمة السر غلط','auth/wrong-password':'كلمة السر غلط','auth/user-not-found':'الحساب مش موجود','auth/email-already-in-use':'الرقم ده محجوز، اختار رقم تاني','auth/weak-password':'كلمة السر ضعيفة (6 حروف على الأقل)','auth/too-many-requests':'محاولات كتير، استنى شوية','auth/network-request-failed':'مفيش نت','x-name':'اكتب اسمك الأول','x-taken':'الرقم اتحجز لحظتها، اختار رقم تاني'};
const err=m=>{const e=$('#aerr');e&&(e.textContent=m)};

auth.onAuthStateChanged(u=>{
 $('#splash').classList.add('off');
 [unU,unC,unM].forEach(f=>f&&f());unU=unC=unM=null;booted=0;cid=null;C={};M={};closeSh();
 $('#app').classList.remove('in');$('#chat').classList.remove('open');
 me=u;$('#auth').hidden=!!u;$('#app').hidden=!u;if(!u)return;
 unU=db.doc('users/'+u.uid).onSnapshot(s=>{if(!s.exists)return;U=s.data();if(!booted){booted=1;start()}if(tab=='me')viewMe()},e=>toast('مشكلة في الاتصال'))});

/* ---------- القايمة ---------- */
function start(){
 const j=new URLSearchParams(location.search).get('j');
 unC=db.collection('chats').where('members','array-contains',me.uid).onSnapshot(s=>{
  s.docChanges().forEach(ch=>{if(ch.type!='modified'||ch.doc.metadata.hasPendingWrites)return;const c=ch.doc.data();
   if(c.last&&c.last.u!=me.uid&&document.hidden&&localStorage.nb!='0'&&!(U.mute||[]).includes(ch.doc.id)&&!localStorage.pushOn&&window.Notification&&Notification.permission=='granted')new Notification(c.type=='g'?c.nm:c.last.n,{body:localStorage.np=='0'?'رسالة جديدة':c.type=='g'?c.last.n+': '+c.last.tx:c.last.tx,icon:'icon-192.png'})});
  const had=C[cid];C={};s.forEach(d=>C[d.id]={id:d.id,...d.data()});
  renderHome();if(cid){if(C[cid])hdr();else if(had)closeChat()}},()=>toast('مشكلة في تحميل المحادثات'));
 if(j){join(j);history.replaceState(0,'',location.pathname)}
  window.startStories&&startStories();window.startCalls&&startCalls();
 go('home')}
function renderHome(){
 if(tab!='home')return;
 const q=$('#q').value.trim().toLowerCase(),pins=U.pins||[];
 let l=Object.values(C).map(c=>({c,n:cname(c),s:0}));
 if(flt=='p')l=l.filter(x=>x.c.type=='p');if(flt=='g')l=l.filter(x=>x.c.type=='g');if(flt=='pin')l=l.filter(x=>pins.includes(x.c.id));
 if(q)l=l.map(x=>({...x,s:x.n.toLowerCase().startsWith(q)?2:x.n.toLowerCase().includes(q)?1:0})).filter(x=>x.s);
 l.sort((a,b)=>b.s-a.s||pins.includes(b.c.id)-pins.includes(a.c.id)||ms(b.c.lt)-ms(a.c.lt));
 $('#list').innerHTML=l.map(({c,n})=>{const u=(c.un||{})[me.uid]||0,ls=c.last;
  return `<div class="wi${c.id==cid?' on':''}" data-id="${c.id}">${avc(c,n)}<div><b>${pins.includes(c.id)?'📌 ':''}${esc(n)}</b><span>${ls?esc((ls.u==me.uid?'أنت: ':c.type=='g'?ls.n+': ':'')+ls.tx):'ابدأ المحادثة'}</span></div><em>${ls?fmt(c.lt):''}${u?`<i>${u>99?'99+':u}</i>`:''}</em></div>`}).join('')||'<p class="es">لسه مفيش محادثات.<br>دوّر على صاحبك برقمه من تبويب استكشاف.</p>';
 $('#recent').innerHTML=Object.values(C).filter(c=>c.type=='p').sort((a,b)=>ms(b.lt)-ms(a.lt)).slice(0,8).map(c=>`<div data-id="${c.id}">${avc(c,cname(c))}<span>${esc(cname(c))}</span></div>`).join('')}
$('#list').onclick=$('#recent').onclick=e=>{const w=e.target.closest('[data-id]');w&&openChat(w.dataset.id)};
$('#q').oninput=renderHome;
$('#tabs').onclick=e=>{if(!e.target.dataset.f)return;flt=e.target.dataset.f;document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b==e.target));renderHome()};
function go(t){tab=t;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go==t));
 $('#home').hidden=t!='home';$('#oth').hidden=t=='home';t=='home'?renderHome():t=='up'?viewUp():t=='find'?viewFind():viewMe()}
$('#nav').onclick=e=>{const b=e.target.closest('[data-go]');b&&go(b.dataset.go)};
$('#plus').onclick=()=>go('find');

/* ---------- استكشاف: بحث برقم، جروب جديد، دخول بكود ---------- */
function viewFind(){
 $('#oth').innerHTML=`<div class="box2"><h3>🔎 دوّر على حد برقمه</h3><input id="fq" inputmode="numeric" maxlength="10" placeholder="الرقم (10 أرقام)"><button class="pri" data-act="find">بحث</button><div id="fr"></div></div>
 <div class="box2"><h3>👥 جروب جديد</h3><input id="gn" maxlength="40" placeholder="اسم الجروب"><button class="pri" data-act="newg">إنشاء</button></div>
 <div class="box2"><h3>🔑 ادخل جروب بكود</h3><input id="gc" placeholder="كود الجروب"><button data-act="join">دخول</button></div>`}
async function find(){const n=$('#fq').value.trim(),r=$('#fr');
 if(!OK(n))return toast('الرقم 10 أرقام');
 const s=await db.doc('ids/'+n).get().catch(()=>null);if(!s||!s.exists)return r.innerHTML='<p class="mu">مفيش حد بالرقم ده</p>';
 const u=s.data().u;if(u==me.uid)return r.innerHTML='<p class="mu">ده رقمك إنت 🙂</p>';
 const x=(await db.doc('users/'+u).get().catch(()=>null))?.data()||{};
 r.innerHTML=`<div class="wi">${av(u,x.name)}<div><b>${esc(x.name||'عضو')}</b><span>${esc(x.bio||'')}</span></div><button data-act="prof" data-u="${u}">الملف</button><button class="pri" data-act="dm" data-u="${u}" data-n="${esc(x.name||'عضو')}">راسله</button></div>`}
async function dm(u,n){const id=[me.uid,u].sort().join('_'),r=db.doc('chats/'+id);let ok=false;
 try{ok=(await r.get()).exists}catch(e){}
 if(!ok){try{await r.set({type:'p',members:[me.uid,u].sort(),names:{[me.uid]:nm(),[u]:n},seen:{},un:{},lt:FV.serverTimestamp(),last:null})}catch(e){return toast('مقدرتش أبدأ المحادثة')}}
 go('home');openChat(id)}
async function newGroup(){const n=$('#gn').value.trim();if(!n)return toast('اكتب اسم الجروب');
 const id=Math.random().toString(36).slice(2,10);
 try{await db.doc('chats/'+id).set({type:'g',nm:n,ad:me.uid,members:[me.uid],names:{[me.uid]:nm()},seen:{},un:{},lt:FV.serverTimestamp(),last:null})}catch(e){return toast('مقدرتش أعمل الجروب')}
 go('home');openChat(id)}
async function join(id){id=(id||'').trim().toLowerCase();if(!id)return;
 try{await db.doc('chats/'+id).update({members:FV.arrayUnion(me.uid),['names.'+me.uid]:nm()});go('home');openChat(id)}catch(e){toast('الكود غلط أو الجروب مش موجود')}}
$('#oth').onclick=e=>{const d=e.target.dataset;if(d.act=='find')find();if(d.act=='newg')newGroup();if(d.act=='join')join($('#gc').value);if(d.act=='dm')dm(d.u,d.n);
 if(d.act=='cp'){navigator.clipboard.writeText(d.v).then(()=>toast('اتنسخ ✅'))}
 if(d.act=='notif')enablePush();if(d.act=='photo')$('#phf').click();
 if(d.act=='out')auth.signOut();if(d.act=='sv')saveMe();if(d.act=='pwd')chPw()};

/* ---------- حسابي ---------- */
function viewMe(){$('#oth').innerHTML=`<div class="pf"><div class="pw">${av(me.uid,nm())}<button class="cam" data-act="photo">📷</button></div><h3>${esc(nm())}</h3><div class="num">${esc(U.sid||'')}</div><button data-act="cp" data-v="${esc(U.sid||'')}">📋 انسخ رقمي</button><p class="mu">اديه لأصحابك عشان يضيفوك.</p><input type="file" id="phf" accept="image/*" hidden></div>
 <div class="box2"><h3>✏️ تعديل الملف الشخصي</h3><input id="mn" maxlength="40" value="${esc(nm())}" placeholder="الاسم"><input id="mb" maxlength="120" value="${esc(U.bio||'')}" placeholder="نبذة عنك"><button class="pri" data-act="sv">حفظ</button></div>
 <div class="mlist"><button data-act="pwd"><span>🔒 الأمان وكلمة السر</span><i>‹</i></button><button data-act="notif"><span>🔔 الإشعارات</span><i>‹</i></button><button data-act="out" class="red"><span>🚪 تسجيل الخروج</span><i>‹</i></button></div>`;
 $('#phf').onchange=e=>{const f=e.target.files[0];f&&shrink(f,200,d=>db.doc('photos/'+me.uid).set({ph:d}).then(()=>{PH[me.uid]=d;viewMe();renderHome();toast('اتغيّرت الصورة ✅')}).catch(()=>toast('مقدرتش أحفظ الصورة. انشر القواعد الجديدة')))}}
async function saveMe(){const n=$('#mn').value.trim();if(!n)return toast('اكتب اسمك');
 await db.doc('users/'+me.uid).update({name:n,bio:$('#mb').value.trim()}).catch(()=>toast('مقدرتش أحفظ'));
 await me.updateProfile({displayName:n}).catch(()=>{});
 const b=db.batch();Object.keys(C).forEach(id=>b.update(db.doc('chats/'+id),{['names.'+me.uid]:n}));await b.commit().catch(()=>{});toast('اتحفظ ✅')}
async function chPw(){const o=prompt('كلمة السر الحالية'),n=o&&prompt('كلمة السر الجديدة (6 حروف على الأقل)');if(!n||n.length<6)return;
 try{await me.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(me.email,o));await me.updatePassword(n);toast('كلمة السر اتغيّرت ✅')}catch(e){toast('كلمة السر الحالية غلط')}}

/* ---------- الشات ---------- */
function openChat(id){cid=id;reply=null;sel=null;stick=1;lastMark='';M={};unM&&unM();$('#rp').hidden=true;
 $('#app').classList.add('in');$('#chat').classList.add('open');$('#in').value=localStorage['d_'+id]||'';autosize();hdr();renderHome();$('#ms').innerHTML='';
 unM=db.collection(`chats/${id}/messages`).orderBy('t').limitToLast(100).onSnapshot(s=>{M={};s.forEach(d=>M[d.id]=d.data());draw();mark()},()=>toast('مش قادر أحمّل الرسايل'))}
function closeChat(){unM&&unM();unM=null;cid=null;$('#app').classList.remove('in');$('#chat').classList.remove('open');renderHome()}
$('#bk').onclick=closeChat;
function hdr(){const c=C[cid];if(!c)return;const ty=Object.entries(c.ty||{}).some(([u,t])=>u!=me.uid&&Date.now()-ms(t)<5000);
 $('#ct').innerHTML=`${avc(c,cname(c))}<div><b>${esc(cname(c))}</b><small class="${ty?'ty':''}">${ty?'بيكتب...':c.type=='g'?c.members.length+' عضو':'محادثة خاصة'}</small></div>`;if(ty)setTimeout(hdr,5200);window.cbUpdate&&cbUpdate()}
function draw(){const c=C[cid];if(!c)return;const o=c.members.filter(x=>x!=me.uid),el=$('#ms'),bot=el.scrollHeight-el.scrollTop-el.clientHeight<140;let day='',h='';
 Object.entries(M).forEach(([id,m])=>{const d=m.t&&m.t.toDate?m.t.toDate():new Date(Date.now()),ds=d.toDateString();
  if(ds!=day){day=ds;h+=`<div class="dy">${esc(d.toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'}))}</div>`}
  const mine=m.u==me.uid,rd=mine&&m.t&&o.length&&o.every(x=>c.seen&&c.seen[x]&&ms(c.seen[x])>=ms(m.t)),rc={};Object.values(m.r||{}).forEach(e=>rc[e]=(rc[e]||0)+1);
  const body=m.del?'<p class="dl">🚫 الرسالة اتمسحت</p>':m.im?`<img class="ph" src="${esc(m.im)}" data-a="img">`:m.au?`<audio controls src="${esc(m.au)}"></audio>`:`<p>${esc(m.tx)}</p>`;
  const txt=!m.del&&!m.im&&!m.au;
  h+=`<div class="m${mine?' me':''}${sel==id?' sel':''}" data-id="${id}">${!mine&&c.type=='g'?`<small style="--h:${hue(m.u)}">${esc(m.n)}</small>`:''}${m.fw?'<small class="fw">↪️ محوّلة</small>':''}${m.rp?`<q>${esc(m.rp.n)}: ${esc(m.rp.tx)}</q>`:''}${body}<div class="rx">${Object.entries(rc).map(([e,n])=>`<span>${e}${n>1?' '+n:''}</span>`).join('')}</div><span class="tm">${m.ed?'معدّلة':''}<span>${m.t?hm(d):'⏳'}</span>${mine&&m.t?`<b class="${rd?'rd':''}">${rd?'✓✓':'✓'}</b>`:''}</span>
  <div class="ac">${['❤️','😂','🔥','👍','😮'].map(e=>`<i data-a="x" data-e="${e}">${e}</i>`).join('')}${m.del?'':'<i data-a="rp" title="رد">↩</i>'}${txt?'<i data-a="cp" title="نسخ">📋</i><i data-a="fw" title="تحويل">↪️</i>':''}${mine&&txt?'<i data-a="ed" title="تعديل">✏️</i>':''}${(mine&&!m.del)||(!mine&&c.ad==me.uid)?'<i data-a="dl" title="مسح">🗑</i>':''}</div></div>`});
 el.innerHTML=h||'<div class="es">ابدأ أول رسالة 👋</div>';if(stick||bot){el.scrollTop=1e9;stick=0}}
function mark(){const c=C[cid];if(!c||document.hidden)return;const l=Object.entries(M).pop();if(!l)return;
 if(l[1].u==me.uid&&!((c.un||{})[me.uid]))return;if(lastMark==l[0])return;lastMark=l[0];
 db.doc('chats/'+cid).update((U.pv||{}).rr===false?{['un.'+me.uid]:0}:{['un.'+me.uid]:0,['seen.'+me.uid]:FV.serverTimestamp()}).catch(()=>{})}
document.addEventListener('visibilitychange',()=>{lastMark='';cid&&mark()});

$('#ms').onclick=async e=>{const el=e.target.closest('.m');if(!el||e.target.tagName=='AUDIO')return;
 const id=el.dataset.id,m=M[id],a=e.target.dataset.a,ref=db.doc(`chats/${cid}/messages/${id}`);
 if(!a||a=='img'&&sel!=id){sel=sel==id?null:id;return draw()}
 if(a=='img')return sheet(`<img class="full" src="${esc(m.im)}">`);
 sel=null;
 if(a=='x'){const em=e.target.dataset.e;ref.update({['r.'+me.uid]:(m.r||{})[me.uid]==em?FV.delete():em}).catch(()=>{})}
 if(a=='rp'){reply={n:m.n,tx:(m.im?'📷 صورة':m.au?'🎤 رسالة صوتية':m.tx).slice(0,60)};$('#rp').hidden=false;$('#rp span').textContent='رد على '+m.n+': '+reply.tx;$('#in').focus()}
 if(a=='cp'){navigator.clipboard.writeText(m.tx||'');toast('اتنسخ ✅')}
 if(a=='ed'){const t=(prompt('عدّل الرسالة',m.tx)||'').trim();if(t&&t!=m.tx)ref.update({tx:t.slice(0,2000),ed:true}).catch(()=>toast('مقدرتش أعدّل'))}
 if(a=='dl'&&confirm('تمسح الرسالة للجميع؟'))(m.u==me.uid?ref.update({del:true,tx:'',im:FV.delete(),au:FV.delete(),ed:FV.delete()}):ref.delete()).catch(()=>toast('مقدرتش أمسح'));
 if(a=='fw')sheet('<h3>↪️ حوّل لـ</h3>'+Object.values(C).map(c=>`<button data-fw="${c.id}" data-m="${id}">${esc(cname(c))}</button>`).join(''));
 draw()};
$('#xr').onclick=()=>{reply=null;$('#rp').hidden=true};

async function send(o){const c=C[cid];if(!c)return;const id=o.cid||cid;delete o.cid;const t=C[id];
 const b=db.batch(),m=db.collection(`chats/${id}/messages`).doc(),pv=o.tx||(o.im?'📷 صورة':'🎤 رسالة صوتية');
 b.set(m,{u:me.uid,n:nm(),t:FV.serverTimestamp(),...(id==cid&&reply?{rp:reply}:{}),...o});
 const up={last:{tx:pv.slice(0,80),u:me.uid,n:nm()},lt:FV.serverTimestamp(),['seen.'+me.uid]:FV.serverTimestamp(),['ty.'+me.uid]:FV.delete()};
 t.members.filter(x=>x!=me.uid).forEach(x=>up['un.'+x]=FV.increment(1));
 b.update(db.doc('chats/'+id),up);
 try{await b.commit();window.pushNotify&&pushNotify('msg',id,pv)}catch(e){toast('الرسالة ماتبعتتش — نصّك لسه محفوظ، جرّب تاني');return false}
 reply=null;$('#rp').hidden=true;stick=1;return true}
$('#snd').onclick=async()=>{const tx=$('#in').value.trim(),target=cid;if(!tx||!target)return;const ok=await send({tx:tx.slice(0,2000),cid:target});if(ok&&cid===target&&$('#in').value.trim()===tx){$('#in').value='';localStorage.removeItem('d_'+target);autosize()}};
function autosize(){const t=$('#in');t.style.height='auto';t.style.height=Math.min(120,t.scrollHeight)+'px'}
$('#in').oninput=e=>{autosize();const v=e.target.value;v?localStorage['d_'+cid]=v:localStorage.removeItem('d_'+cid);
 if(cid&&Date.now()-tt>2500){tt=Date.now();db.doc('chats/'+cid).update({['ty.'+me.uid]:FV.serverTimestamp()}).catch(()=>{})}};
$('#in').onkeydown=e=>{if(e.key=='Enter'&&!e.shiftKey&&innerWidth>899&&localStorage.es!='0'){e.preventDefault();$('#snd').click()}};

/* صور وصوت وإيموجي */
$('#ph').onclick=()=>cid&&$('#pf').click();
$('#pf').onchange=e=>{[...e.target.files].slice(0,5).forEach(f=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas'),s=Math.min(1,900/Math.max(i.width,i.height));c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);
 let q=.7,d=c.toDataURL('image/jpeg',q);while(d.length>190000&&q>.3){q-=.1;d=c.toDataURL('image/jpeg',q)}send({im:d})};i.src=URL.createObjectURL(f)});e.target.value=''};
let rec,ch,rt;
$('#vn').onclick=async()=>{if(!cid)return;if(rec&&rec.state=='recording')return rec.stop();
 const s=await navigator.mediaDevices.getUserMedia({audio:true}).catch(()=>0);if(!s)return toast('المايك مش متاح');
 ch=[];rec=new MediaRecorder(s,{audioBitsPerSecond:24000});rec.ondataavailable=e=>ch.push(e.data);
 rec.onstop=()=>{s.getTracks().forEach(t=>t.stop());$('#vn').classList.remove('rec');clearTimeout(rt);const r=new FileReader();r.onload=()=>send({au:r.result});r.readAsDataURL(new Blob(ch,{type:rec.mimeType}))};
 rec.start();$('#vn').classList.add('rec');rt=setTimeout(()=>rec.stop(),30000);toast('بيسجّل... اضغط تاني للإرسال')};
const EM='😂 🤣 😍 🥰 😎 🤩 😭 😡 🥶 🤯 🙄 😏 🤝 👏 🙏 💪 🔥 💯 ✨ 🎉 ❤️ 💔 👀 😴 🤡 💀 👑 🍕 ☕ ⚽ 🎮 🚀 🌹 😅 🤔 🫡 👍 😮 🥳 😇'.split(' ');
$('#em').onclick=()=>cid&&sheet('<div class="gr">'+EM.map(e=>`<i data-e="${e}">${e}</i>`).join('')+'</div>');

/* قايمة المحادثة (⋮) */
$('#mn').onclick=$('#ct').onclick=()=>{const c=C[cid];if(!c)return;const pin=(U.pins||[]).includes(cid),ad=c.ad==me.uid;
 sheet(`<h3>${esc(cname(c))}</h3><button data-s="pin">${pin?'📍 إلغاء التثبيت':'📌 ثبّت المحادثة'}</button>`+(c.type=='g'?
  `<button data-s="link">🔗 انسخ رابط الدعوة</button><button data-s="code">انسخ الكود: ${esc(c.id)}</button><h4>الأعضاء</h4>`+
  c.members.map(u=>`<div class="row"><span>${esc((c.names||{})[u]||'؟')}${u==c.ad?' 👑':''}</span>${ad&&u!=me.uid?`<button data-s="kick" data-u="${u}">طرد</button>`:''}</div>`).join('')+
  (ad?`<input id="an" inputmode="numeric" maxlength="10" placeholder="ضيف عضو برقمه"><button data-s="add">➕ إضافة</button>`:'')+
  (ad?'':'<button data-s="leave">🚪 اخرج من الجروب</button>'):''))};
$('#sh').addEventListener('click',async e=>{const d=e.target.dataset,c=C[cid];
 if(d.e){const i=$('#in');i.value+=d.e;i.dispatchEvent(new Event('input'));return}
 if(d.fw){const m=M[d.m];if(m&&m.tx){const ok=await send({tx:m.tx,fw:true,cid:d.fw});if(ok)toast('اتحوّلت ✅')}return closeSh()}
 if(!d.s||!c)return;
 const ref=db.doc('chats/'+cid);
 if(d.s=='pin'){await db.doc('users/'+me.uid).update({pins:(U.pins||[]).includes(cid)?FV.arrayRemove(cid):FV.arrayUnion(cid)}).catch(()=>{});closeSh()}
 if(d.s=='link'){navigator.clipboard.writeText(location.origin+location.pathname+'?j='+cid);toast('اتنسخ ✅')}
 if(d.s=='code'){navigator.clipboard.writeText(cid);toast('اتنسخ ✅')}
 if(d.s=='kick'){await ref.update({members:FV.arrayRemove(d.u),['names.'+d.u]:FV.delete()}).catch(()=>toast('مقدرتش'));closeSh()}
 if(d.s=='leave'){await ref.update({members:FV.arrayRemove(me.uid),['names.'+me.uid]:FV.delete()}).catch(()=>toast('مقدرتش'));closeSh();closeChat()}
 if(d.s=='add'){const n=$('#an').value.trim();if(!OK(n))return toast('الرقم 10 أرقام');
  const s=await db.doc('ids/'+n).get().catch(()=>null);if(!s||!s.exists)return toast('مفيش حد بالرقم ده');
  const u=s.data().u,x=(await db.doc('users/'+u).get().catch(()=>null))?.data()||{};
  await ref.update({members:FV.arrayUnion(u),['names.'+u]:x.name||'عضو'}).then(()=>toast('اتضاف ✅')).catch(()=>toast('مقدرتش أضيفه'));closeSh()}});

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
