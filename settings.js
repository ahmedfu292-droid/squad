/* The Squad — إعدادات الحساب (على نظام واتساب بهوية The Squad). بيتحمّل آخر ملف بعد chatx.js.
   بيستبدل شاشة «المزيد» القديمة (viewMe) بشاشة إعدادات فيها أقسام. بيعتمد على:
   app.js (saveMe، enablePush من push.js)، theme.js (themeHtml)، look.js (lookHtml)، chatx.js (الأرشيف والكتم)، games.js (قايمة الحظر BL).
   الخصوصية متطبقة في firestore.rules (الصورة وآخر ظهور). تفاصيل كل خيار في تقرير التسليم. */
(()=>{
const PVD={photo:'all',ls:'all',st:'c',rr:true,phone:'none',bday:'none'};           // الافتراضي لو مفيش اختيار
const pv=k=>{const v=(U.pv||{})[k];return v===undefined?PVD[k]:v};
const lp=(k,d=true)=>localStorage[k]===undefined?d:localStorage[k]!=='0';   // تفضيلات الجهاز
const LBL={all:'الكل',contacts:'جهات الاتصال',none:'مفيش حد',c:'جهات الاتصال بس',p:'العالم كله'};
let SV='home',BLN={};

/* ---------- حفظ الخصوصية ---------- */
async function setPv(k,v){try{await db.doc('users/'+me.uid).update({['pv.'+k]:v});if(k=='ls'&&v!='none')beat(true)}catch(e){toast('مقدرتش أحفظ. انشر firestore.rules الجديدة الأول')}}

/* ---------- مكوّنات الواجهة ---------- */
const row=(to,ic,t,sub,vl,cls='')=>`<button class="st-row ${cls}" data-sx="go" data-s2="${to}"><span class="ch">${ic}</span><span class="tt"><b>${t}</b>${sub?`<small>${sub}</small>`:''}</span>${vl?`<span class="vl">${vl}</span>`:'<span class="cv2">‹</span>'}</button>`;
const tg=(key,ic,t,sub,on)=>`<button class="st-row tg" data-sx="tg" data-k="${key}"><span class="ch">${ic}</span><span class="tt"><b>${t}</b>${sub?`<small>${sub}</small>`:''}</span><span class="sw2" role="switch" aria-checked="${!!on}"></span></button>`;
const opts=(k,cur,list)=>`<div class="st-list">${list.map(([v,t,s])=>`<button class="opt" data-sx="pv" data-k="${k}" data-v="${v}" role="radio" aria-checked="${cur==v}"><i></i><span>${t}${s?`<small>${s}</small>`:''}</span></button>`).join('')}</div>`;
const top=t=>`<div class="st-top"><button class="ic" data-sx="back" title="رجوع">${ic('back')}</button><h3>${t}</h3></div>`;
const sec=t=>`<div class="st-sec">${t}</div>`;
const pushCfg=()=>typeof PUSH_WORKER!='undefined'&&PUSH_WORKER&&!/^PUT/.test(PUSH_WORKER);
const nName=id=>{const c=C[id];return c?cname(c):'محادثة'};

/* ---------- الشاشات ---------- */
const S={
 home:()=>`<button class="st-me" data-sx="go" data-s2="profile">${av(me.uid,nm())}<span><b>${esc(nm())}</b><span>${esc(U.bio||'ضيف نبذة عنك')}</span><em>${esc(U.sid||'')}${U.un?' · @'+esc(U.un):''}</em></span><span class="cv2" style="color:var(--mu);font-size:22px">‹</span></button>
  <div class="st-sec">الحساب</div><div class="st-list">
  ${row('privacy','🔒','الخصوصية','آخر ظهور: '+LBL[pv('ls')]+' · الصورة: للكل')}
  ${row('accounts','👥','الحسابات','التبديل بين حساباتك وإضافة حساب',(window.ACCT?ACCT.list().length:'')||'')}
  ${row('security','🛡','الأمان وكلمة السر','تغيير كلمة السر ورقمك الخاص')}
  ${row('notif','🔔','الإشعارات',lp('nb')?'إشعارات المتصفح شغّالة':'إشعارات المتصفح مقفولة')}</div>
  <div class="st-sec">التطبيق</div><div class="st-list">
  ${row('chats','💬','المحادثات','الخلفية ولون الرسايل والأرشيف وزر Enter')}
  ${row('groups','👥','المجموعات','جروباتك: كتم وخروج')}
  ${row('look','🎨','المظهر واللغة','الوضع الغامق/الفاتح واللغة')}</div>
  <div class="st-list" style="margin-top:14px"><button class="st-row red" data-sx="out"><span class="ch">🚪</span><span class="tt"><b>تسجيل الخروج</b></span><span></span></button></div>`,

 profile:()=>{const has=!!PH[me.uid],d=U.created&&U.created.toDate?U.created.toDate().toLocaleDateString('ar-EG',{year:'numeric',month:'long',day:'numeric'}):'';
  return top('الملف الشخصي')+`<div class="st-pf"><div class="pw">${av(me.uid,nm())}<button class="cam" data-sx="photo" title="تغيير الصورة">📷</button></div>
  <div class="num">${esc(U.sid||'')}</div><div class="acts"><button data-act="cp" data-v="${esc(U.sid||'')}">📋 انسخ رقمي</button>${has?'<button data-sx="rmph">🗑 شيل الصورة</button>':''}</div>
  <p class="st-note">رقمك هو هويتك. اديه لأصحابك عشان يضيفوك.${d?'<br>الحساب اتعمل في '+d+'.':''}</p><input type="file" id="sphf" accept="image/*" hidden></div>
  <div class="box2"><h3>✏️ بياناتك</h3><input id="mn" maxlength="40" value="${esc(nm())}" placeholder="الاسم"><input id="mb" maxlength="120" value="${esc(U.bio||'')}" placeholder="نبذة عنك"><button class="pri" data-act="sv">حفظ</button></div>`+(window.ACCTUI?ACCTUI.profile():'')},

 privacy:()=>top('الخصوصية')+
  sec('مين يشوف آخر ظهورك')+opts('ls',pv('ls'),[['all','الكل'],['contacts','جهات الاتصال'],['none','مفيش حد']])+
  `<p class="st-note">لو قفلت آخر ظهورك إنت كمان مش هتشوف آخر ظهور حد.</p>`+
  `<p class="st-note">📷 صورتك الشخصية بتظهر لكل أعضاء The Squad، وده عشان كل واحد يعرف صحابه. رقم الهاتف وتاريخ الميلاد لسه مخفيين إلا لو اخترت غير كده.</p>`+
  sec('جمهور حالاتك (الافتراضي)')+opts('st',pv('st'),[['c','جهات الاتصال بس'],['p','العالم كله']])+
  `<p class="st-note">ده الاختيار اللي بيظهر أول ما تعمل حالة جديدة، وتقدر تغيّره في كل حالة.</p>`+
  sec('مين يشوف رقم هاتفك')+opts('phone',pv('phone'),[['none','مفيش حد'],['contacts','جهات الاتصال'],['all','الكل']])+
  sec('مين يشوف تاريخ ميلادك (وعمرك)')+opts('bday',pv('bday'),[['none','مفيش حد'],['contacts','جهات الاتصال'],['all','الكل']])+
  `<p class="st-note">رقم الهاتف وتاريخ الميلاد افتراضياً مخفيين عن الكل. الإخفاء مطبّق في قواعد قاعدة البيانات نفسها مش في الواجهة بس.</p>`+
  sec('المحادثات')+`<div class="st-list">${tg('rr','✓✓','تأكيد القراءة','لو قفلته الناس مش هتشوف إنك قريت رسايلهم',pv('rr'))}
  ${row('blocked','🚫','المحظورين',Object.keys(BL).length?Object.keys(BL).length+' محظور':'مفيش حد')}</div>`,

 blocked:()=>{const ids=Object.keys(BL);ids.forEach(id=>BLN[id]===undefined&&(BLN[id]=null,db.doc('publicProfiles/'+id).get().then(s=>{BLN[id]=s.exists?s.data().name||'عضو':'عضو';SV=='blocked'&&tab=='me'&&render(true)}).catch(()=>{BLN[id]='عضو'})));
  return top('المحظورين')+(ids.length?`<div class="st-list">${ids.map(id=>`<div class="st-row" style="cursor:default"><span class="ch">🚫</span><span class="tt"><b>${esc(BLN[id]||'...')}</b></span><button class="pri" style="padding:7px 14px;font-size:13px" data-sx="unblock" data-id="${esc(id)}">إلغاء الحظر</button></div>`).join('')}</div>`:`<div class="st-list"><div class="st-empty">مفيش حد محظور.<br>تقدر تحظر من زر ⚠️ جوه أي محادثة خاصة.</div></div>`)+
  `<p class="st-note">الحظر بيخفي رسايل الشخص عندك إنت.</p>`},

 security:()=>top('الأمان وكلمة السر')+`<div class="box2"><h3>🔑 تغيير كلمة السر</h3>
  <input id="pw0" type="password" autocomplete="current-password" placeholder="كلمة السر الحالية"><input id="pw1" type="password" autocomplete="new-password" placeholder="كلمة السر الجديدة (6 حروف على الأقل)"><input id="pw2" type="password" autocomplete="new-password" placeholder="أكّد كلمة السر الجديدة"><button class="pri" data-sx="pwd">تغيير</button></div>
  <div class="st-list" style="margin-top:12px"><button class="st-row" data-act="cp" data-v="${esc(U.sid||'')}"><span class="ch">🔢</span><span class="tt"><b>رقمك الخاص</b><small style="direction:ltr;text-align:start;letter-spacing:.12em">${esc(U.sid||'')}</small></span><span class="vl">نسخ</span></button></div>
  <p class="st-note warn">مفيش إيميل ولا تليفون مربوط بالحساب، فلو نسيت كلمة السر مش هنقدر نرجّع حسابك. احفظها في مكان أمان.</p>
  <div class="st-list" style="margin-top:12px"><button class="st-row red" data-sx="out"><span class="ch">🚪</span><span class="tt"><b>تسجيل الخروج</b><small>من الجهاز ده بس</small></span><span></span></button></div>`,

 accounts:()=>window.ACCTUI?ACCTUI.page(top,sec):top('الحسابات'),

 notif:()=>{const perm=window.Notification?Notification.permission:'unsupported',on=localStorage.pushOn&&perm=='granted',cfg=pushCfg(),mu=U.mute||[];
  return top('الإشعارات')+sec('إشعارات الموبايل (حتى والتطبيق مقفول)')+`<div class="st-list"><button class="st-row" data-sx="push"><span class="ch">📲</span><span class="tt"><b>إشعارات الجهاز ده</b><small>${!cfg?'لسه مش جاهزة: محتاجة Worker (PUSH_WORKER في firebase-config.js)':on?'شغّالة على الجهاز ده':'مش متفعّلة'}</small></span><span class="vl">${on?'✅':cfg?'فعّلها':''}</span></button></div>`+
  (perm=='denied'?'<p class="st-note warn">المتصفح حاجب الإشعارات للموقع ده. افتح إعدادات الموقع في المتصفح وسمح بيها.</p>':'')+
  sec('إشعارات المتصفح')+`<div class="st-list">${tg('nb','🔔','إشعار برسالة جديدة','لما التطبيق يكون في الخلفية',lp('nb'))}${tg('np','👁','إظهار نص الرسالة','لو قفلتها بيظهر «رسالة جديدة» بس',lp('np'))}</div>
  <p class="st-note">إشعارات المتصفح بتشتغل لما الموقع مفتوح في تبويب. لما تفعّل إشعارات الجهاز فوق، هي اللي بتشتغل بدالها.</p>`+
  sec('محادثات مكتومة ('+mu.length+')')+(mu.length?`<div class="st-list">${mu.map(id=>`<div class="st-row" style="cursor:default"><span class="ch">🔕</span><span class="tt"><b>${esc(nName(id))}</b></span><button class="pri" style="padding:7px 14px;font-size:13px" data-sx="unmute" data-id="${esc(id)}">إلغاء الكتم</button></div>`).join('')}</div>`:`<div class="st-list"><div class="st-empty">مفيش محادثات مكتومة.<br>اكتم من قايمة ⋮ جوه أي محادثة.</div></div>`)},

 chats:()=>{const ar=(U.arch||[]).length;
  return top('المحادثات')+`<div class="st-list">${tg('es','↵','Enter بيرسل الرسالة','على الكمبيوتر (Shift+Enter سطر جديد)',lp('es'))}
  <button class="st-row" data-sx="arch"><span class="ch">🗄</span><span class="tt"><b>المحادثات المؤرشفة</b><small>${ar?ar+' محادثة':'مفيش'}</small></span><span class="cv2">‹</span></button></div>`+(window.lookHtml?window.lookHtml():'')},

 groups:()=>{const g=Object.values(C).filter(c=>c.type=='g').sort((a,b)=>ms(b.lt)-ms(a.lt)),mu=U.mute||[];
  return top('المجموعات')+(g.length?`<div class="st-list">${g.map(c=>{const ad=c.ad==me.uid,m=mu.includes(c.id);return `<div class="st-row" style="cursor:default"><span class="ch">👥</span><span class="tt"><b>${esc(c.nm)}${ad?' 👑':''}</b><small>${c.members.length} عضو · ${ad?'إنت المشرف':'عضو'}${m?' · 🔕 مكتوم':''}</small></span><span style="display:flex;gap:6px"><button class="ic" title="فتح" data-sx="gopen" data-id="${esc(c.id)}">💬</button><button class="ic" title="${m?'إلغاء الكتم':'كتم'}" data-sx="gmute" data-id="${esc(c.id)}">${m?'🔔':'🔕'}</button>${ad?'':`<button class="ic" title="خروج" data-sx="gleave" data-id="${esc(c.id)}">🚪</button>`}</span></div>`}).join('')}</div>`:`<div class="st-list"><div class="st-empty">مفيش جروبات لسه.</div></div>`)+
  `<div class="st-list" style="margin-top:12px"><button class="st-row" data-sx="newg"><span class="ch">➕</span><span class="tt"><b>جروب جديد أو الدخول بكود</b><small>من تبويب استكشاف</small></span><span class="cv2">‹</span></button></div>
  <p class="st-note">إدارة الأعضاء (الإضافة والطرد) من قايمة ⋮ جوه الجروب.</p>`},

 look:()=>top('المظهر واللغة')+(window.themeHtml?window.themeHtml():'')+
  `<div class="st-list" style="margin-top:12px"><button class="st-row" data-sx="lang"><span class="ch">🌐</span><span class="tt"><b>اللغة</b><small>${localStorage.lang=='en'?'English (النصوص الثابتة بس)':'العربية'}</small></span><span class="vl">${localStorage.lang=='en'?'عربي':'English'}</span></button></div>`
};

/* ---------- العرض ---------- */
function render(force){
 const el=$('#oth'),a=document.activeElement;
 if(!force&&a&&el.contains(a)&&/^(INPUT|TEXTAREA)$/.test(a.tagName)&&a.type!='checkbox')return;   // ما نمسحش اللي بيتكتب
 const y=el.scrollTop;el.innerHTML=(S[SV]||S.home)();el.scrollTop=y}
viewMe=function(){render()};
const go1=go;go=function(t){if(t=='me')SV='home';go1(t)};

/* ---------- الأحداث ---------- */
$('#oth').addEventListener('click',async e=>{const b=e.target.closest('[data-sx]');if(!b||tab!='me')return;const d=b.dataset,k=d.sx;
 if(k=='go'){SV=d.s2;render(true);$('#oth').scrollTop=0}
 else if(k=='back'){SV='home';render(true);$('#oth').scrollTop=0}
 else if(k=='pv'){setPv(d.k,d.v==='true'?true:d.v)}
 else if(k=='tg'){const kk=d.k;
  if(kk=='rr')setPv('rr',!pv('rr'));
  else{const nv=!lp(kk);
   if(kk=='nb'&&nv&&window.Notification){if(Notification.permission=='denied')toast('المتصفح حاجب الإشعارات للموقع ده');else if(Notification.permission=='default')await Notification.requestPermission()}
   localStorage[kk]=nv?'1':'0';render(true)}}
 else if(k=='push'){if(!pushCfg())return toast('محتاجة Worker الأول (PUSH_WORKER في firebase-config.js)');await enablePush();render(true)}
 else if(k=='unmute'){await db.doc('users/'+me.uid).update({mute:FV.arrayRemove(d.id)}).catch(()=>toast('مقدرتش'))}
 else if(k=='unblock'){await db.doc(`users/${me.uid}/blocked/${d.id}`).delete().then(()=>toast('اتشال الحظر')).catch(()=>toast('مقدرتش'))}
 else if(k=='arch'){go('home');const t=document.querySelector('#tabs [data-f=arch]');t&&t.click()}
 else if(k=='gopen'){go('home');openChat(d.id)}
 else if(k=='gmute'){const m=(U.mute||[]).includes(d.id);await db.doc('users/'+me.uid).update({mute:m?FV.arrayRemove(d.id):FV.arrayUnion(d.id)}).then(()=>toast(m?'الإشعارات رجعت 🔔':'اتكتم 🔕')).catch(()=>toast('مقدرتش. انشر القواعد الجديدة'))}
 else if(k=='gleave'){if(!await SquadDialog.confirm('تخرج من الجروب؟'))return;await db.doc('chats/'+d.id).update({members:FV.arrayRemove(me.uid),['names.'+me.uid]:FV.delete()}).then(()=>toast('خرجت من الجروب')).catch(()=>toast('مقدرتش'))}
 else if(k=='newg'){go('find')}
 else if(k=='lang'){localStorage.lang=localStorage.lang=='en'?'ar':'en';location.reload()}
 else if(k=='photo'){$('#sphf').click()}
 else if(k=='rmph'){if(!await SquadDialog.confirm('تشيل صورتك؟'))return;const bt=db.batch();bt.delete(db.doc('photos/'+me.uid));bt.update(db.doc('users/'+me.uid),{ph:FV.delete()});
  await bt.commit().then(()=>{delete PH[me.uid];PQ[me.uid]=0;renderHome();render(true);toast('اتشالت الصورة')}).catch(()=>db.doc('photos/'+me.uid).delete().then(()=>{delete PH[me.uid];render(true)}).catch(()=>toast('مقدرتش')))}
 else if(k=='pwd')chPw2();
 else if(k=='out'){if(!(window.ACCTUI?await ACCTUI.askPin('تسجيل الخروج'):true))return;if(await SquadDialog.confirm('تسجّل خروج؟'))await ACCT.remove(ACCT.slot)}});
window.stRender=()=>{tab=='me'&&render(true)};
$('#oth').addEventListener('change',e=>{if(e.target.id!='sphf')return;const f=e.target.files[0];if(!f)return;
 shrink(f,200,d=>db.doc('photos/'+me.uid).set({ph:d}).then(()=>{PH[me.uid]=d;renderHome();render(true);window.hdr&&cid&&hdr();toast('اتغيّرت الصورة ✅')}).catch(()=>toast('مقدرتش أحفظ الصورة. انشر القواعد الجديدة')))});

async function chPw2(){const o=$('#pw0').value,n=$('#pw1').value,n2=$('#pw2').value;
 if(!o)return toast('اكتب كلمة السر الحالية');if(n.length<6)return toast('الجديدة 6 حروف على الأقل');if(n!=n2)return toast('التأكيد مش زي الجديدة');if(n==o)return toast('الجديدة زي القديمة');
 try{await me.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(me.email,o));await me.updatePassword(n);['#pw0','#pw1','#pw2'].forEach(s=>$(s).value='');toast('كلمة السر اتغيّرت ✅')}
 catch(x){toast(x.code=='auth/too-many-requests'?'محاولات كتير، استنى شوية':x.code=='auth/weak-password'?'كلمة السر ضعيفة':'كلمة السر الحالية غلط')}}

/* ---------- نقل الصورة القديمة (كانت جوه ملف المستخدم) لمستند الصور المحمي بالخصوصية ---------- */
let migrated=0;
function migrate(){if(migrated||!U.ph)return;migrated=1;const ph=U.ph,b=db.batch();
 b.set(db.doc('photos/'+me.uid),{ph});b.update(db.doc('users/'+me.uid),{ph:FV.delete()});b.commit().then(()=>{PH[me.uid]=ph}).catch(()=>{migrated=0})}

/* ---------- آخر ظهور ---------- */
let LSd={},lsU=null,lsFor=null;
function beat(force){if(!me||document.hidden||(!force&&pv('ls')==='none'))return;db.doc('presence/'+me.uid).set({t:FV.serverTimestamp()}).catch(()=>{})}
setInterval(beat,60000);
document.addEventListener('visibilitychange',beat);
function stopLs(){lsU&&lsU();lsU=null;lsFor=null}
function paintLs(){const c=C[cid];if(!c||c.type!='p')return;const o=c.members.find(x=>x!=me.uid),el=document.querySelector('#ct small');
 if(!el||el.classList.contains('ty')||pv('ls')==='none')return;const t=LSd[o];if(!t||t<0)return;
 const on=Date.now()-t<100000;el.classList.toggle('on',on);
 el.textContent=on?'متصل الآن':new Date(t).toDateString()==new Date(Date.now()).toDateString()?'آخر ظهور اليوم '+hm(new Date(t)):'آخر ظهور '+new Date(t).toLocaleDateString('ar-EG',{day:'numeric',month:'short'})}
function lsHdr(){const c=C[cid];if(!c||c.type!='p'){stopLs();return}const o=c.members.find(x=>x!=me.uid);
 if(lsFor!=o||(!lsU&&pv('ls')!=='none')){stopLs();lsFor=o;if(pv('ls')!=='none')lsU=db.doc('presence/'+o).onSnapshot(s=>{LSd[o]=s.exists?ms(s.data().t):0;paintLs()},()=>{LSd[o]=-1})}
 paintLs()}
const hd1=hdr;hdr=function(){hd1();lsHdr()};
setInterval(()=>{cid?paintLs():stopLs()},30000);

/* تشغيل أول مرة بعد تسجيل الدخول وتحميل ملف المستخدم (بنستنى بدل ما نلفّ start عشان ما نعتمدش على ترتيب التحميل) */
let ready=0;
setInterval(()=>{if(me&&booted&&U.sid&&!ready){ready=1;migrate();beat()}},500);
auth.onAuthStateChanged(u=>{if(!u){stopLs();LSd={};migrated=0;ready=0;SV='home';BLN={}}});
})();
