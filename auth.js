/* The Squad v26 — شاشة الدخول وإنشاء الحساب (خطوات) + الحسابات المحفوظة على شاشة الدخول.
   بيعتمد على app.js (auth, db, FV, OK, MAIL, AE, err, mode, toast, sheet)، stories.js (shrink)، acct.js (ACCT).
   تسجيل الحساب حقيقي: Firebase Auth + Firestore. رقم الهاتف بيتحفظ بس «من غير توثيق» (مفيش خدمة SMS متوصّلة). */
(()=>{
const AU=$('#auth'),CARD=AU.querySelector('.card');
/* ---------- بيانات ثابتة ---------- */
const flag=iso=>String.fromCodePoint(...[...iso].map(c=>127397+c.charCodeAt(0)));
// [iso, الاسم, مفتاح الدولة, أقل طول, أكبر طول] (الطول بدون صفر البداية)
const CTR=[['EG','مصر','20',10,10],['SA','السعودية','966',9,9],['AE','الإمارات','971',9,9],['KW','الكويت','965',8,8],['QA','قطر','974',8,8],['BH','البحرين','973',8,8],['OM','عُمان','968',8,8],['JO','الأردن','962',9,9],['LB','لبنان','961',7,8],['IQ','العراق','964',10,10],['SY','سوريا','963',9,9],['PS','فلسطين','970',9,9],['YE','اليمن','967',9,9],['LY','ليبيا','218',9,10],['TN','تونس','216',8,8],['DZ','الجزائر','213',9,9],['MA','المغرب','212',9,9],['SD','السودان','249',9,9],['SO','الصومال','252',7,9],['MR','موريتانيا','222',8,8],['TR','تركيا','90',10,10],['US','أمريكا وكندا','1',10,10],['GB','بريطانيا','44',10,10],['DE','ألمانيا','49',10,11],['FR','فرنسا','33',9,9],['IT','إيطاليا','39',9,10],['ES','إسبانيا','34',9,9],['NL','هولندا','31',9,9],['SE','السويد','46',7,10],['GR','اليونان','30',10,10],['CY','قبرص','357',8,8],['RU','روسيا','7',10,10],['AU','أستراليا','61',9,9],['BR','البرازيل','55',10,11],['IN','الهند','91',10,10],['PK','باكستان','92',10,10],['MY','ماليزيا','60',9,10],['ID','إندونيسيا','62',9,12],['CN','الصين','86',11,11],['JP','اليابان','81',9,10],['KR','كوريا الجنوبية','82',9,10]];
const RESERVED=['admin','administrator','squad','thesquad','support','official','root','system','moderator','help'];
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const MINAGE=13,UNRE=/^[a-z][a-z0-9_.]{2,19}$/;
const PVL=[['none','محدش'],['contacts','جهات الاتصال'],['all','الكل']];
Object.assign(AE,{'x-rules':'مقدرتش أحفظ بيانات الحساب. غالباً لازم تنشر ملف firestore.rules الجديد في Firebase الأول','x-un':'اسم المستخدم محجوز، اختار اسم تاني','x-nouser':'مفيش حساب بالاسم ده','x-net':'مفيش نت، حاول تاني'});

/* ---------- حالة الخطوات ---------- */
const W={step:0,name:'',un:'',email:'',ph:null,cc:'20',phone:'',d:'',m:'',y:'',bio:'',city:'',pvPhone:'none',pvBday:'none',sid:'',pw:'',pw2:''};
const STEPS=[['اسمك واسم المستخدم','ده اللي هيظهر لأصحابك'],['صورتك الشخصية','اختياري'],['الدولة ورقم الهاتف','اختار بلدك ورقمك المحلي'],['تاريخ ميلادك','وعمرك بيتحسب لوحده'],['نبذة عنك','وبيانات اختيارية'],['بيانات تسجيل الدخول','بريدك الإلكتروني وكلمة مروره ورقمك الرسمي']];
let unState='',unTimer=0;

const ageOf=(y,m,d)=>{if(!y||!m||!d)return null;const D=new Date(+y,+m-1,+d);if(D.getFullYear()!=+y||D.getMonth()!=+m-1||D.getDate()!=+d)return null;
 const n=new Date();let a=n.getFullYear()-D.getFullYear();if(n.getMonth()<D.getMonth()||(n.getMonth()==D.getMonth()&&n.getDate()<D.getDate()))a--;return D>n?-1:a};
const ctry=cc=>CTR.find(c=>c[2]==cc)||CTR[0];
const natPhone=(cc,raw)=>{let s=String(raw||'').replace(/[^\d]/g,'');s=s.replace(/^0+/,'');return s};
const strength=p=>Math.min(4,(p.length>=6)+(p.length>=10)+(/[A-Za-z]/.test(p)&&/\d/.test(p))+(/[^A-Za-z0-9]/.test(p)));
const rndSid=()=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return String(1e9+Math.floor(a[0]/4294967296*9e9))};
// Fail closed: network/rules errors must never make a reserved ID appear available.
const freeId=async n=>{try{const r=await callables.httpsCallable('checkAccountIdAvailability')({id:n});return !!r.data.available}catch(e){return false}};

/* ---------- التبديل بين دخول / حساب جديد ---------- */
function setM(m){mode=m;CARD.classList.toggle('signup',m=='up');
 $('#vin').hidden=m!='in';$('#vup').hidden=m!='up';
 document.querySelectorAll('.tb button').forEach(b=>b.classList.toggle('on',b.dataset.m==m));err('');
 if(m=='up')drawStep()}
$('.tb').onclick=e=>{const b=e.target.closest('[data-m]');b&&setM(b.dataset.m)};
$('#eye').onclick=()=>$('#pw').type=$('#pw').type=='password'?'text':'password';

/* ---------- الدخول ---------- */
async function doLogin(){err('');const raw=$('#lid').value.trim().replace(/^@/,'').toLowerCase(),pw=$('#pw').value;
 if(!raw)return err('اكتب رقمك الخاص أو اسم المستخدم');
 if(!pw)return err('اكتب كلمة السر');
 const go=$('#go');go.disabled=true;
 try{
  if(/^\d+$/.test(raw)){
   if(!OK(raw))throw{code:'x-fmt',m:'الرقم الخاص 10 أرقام وأول رقم مش صفر'};
   const r=await callables.httpsCallable('accountIdLogin')({id:raw,password:pw});
   await auth.signInWithCustomToken(r.data.token);
  }else if(raw.includes('@')){
   await auth.signInWithEmailAndPassword(raw,pw);
  }else{
   if(!UNRE.test(raw))throw{code:'x-fmt',m:'اسم المستخدم حروف إنجليزي وأرقام (3 إلى 20) وبيبدأ بحرف'};
   const r=await callables.httpsCallable('usernameLogin')({username:raw,password:pw});
   await auth.signInWithCustomToken(r.data.token);
  }}
 catch(e){err(e.m||AE[e.code]||'حصلت مشكلة، حاول تاني')}
 go.disabled=false}
$('#go').onclick=doLogin;
// Password recovery is available only for real email accounts; legacy synthetic IDs need manual recovery.
const resetBtn=document.getElementById('resetPassword');
if(resetBtn)resetBtn.onclick=async()=>{
 const email=String(document.getElementById('lid')?.value||'').trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return err('اكتب البريد الإلكتروني الحقيقي المرتبط بالحساب لاستلام رابط الاسترجاع. الحسابات القديمة التي تستخدم @squad.id تحتاج مسار استرجاع منفصل.');
 resetBtn.disabled=true;
 try{await auth.sendPasswordResetEmail(email);err('لو البريد مسجل، هيوصلك رابط استرجاع كلمة السر. راجع صندوق الوارد والرسائل غير المرغوب فيها.');}
 catch(e){err('تعذر إرسال الرابط حاليًا. لو البريد مرتبط بحساب، راجع إعدادات البريد وحاول تاني بعد شوية.');}
 finally{resetBtn.disabled=false;}
};
$('#pw').onkeydown=$('#lid').onkeydown=e=>{if(e.key=='Enter')doLogin()};

/* ---------- إنشاء الحساب (الكتابة الفعلية في قاعدة البيانات) ---------- */
window.signup=async function signup(n,pw,name,x){x=x||{};
 const loginEmail=String(x.email||'').trim().toLowerCase();
 const cr=await auth.createUserWithEmailAndPassword(loginEmail||MAIL(n),pw),u=cr.user,b=db.batch();
 const doc={sid:n,name,bio:x.bio||'',pins:[],created:FV.serverTimestamp(),pv:{phone:x.pvPhone||'none',bday:x.pvBday||'none'}};
 if(x.un)doc.un=x.un;if(x.city)doc.city=x.city;
 b.set(db.doc('users/'+u.uid),doc);
 b.set(db.doc('publicProfiles/'+u.uid),{name,bio:x.bio||'',...(x.un?{un:x.un}:{}),...(x.city?{city:x.city}:{})});
 b.set(db.doc('ids/'+n),{u:u.uid});
 if(x.un)b.set(db.doc('usernames/'+x.un),{u:u.uid});
 if(x.ph)b.set(db.doc('photos/'+u.uid),{ph:x.ph});
 if(x.phone)b.set(db.doc('phones/'+u.uid),{v:x.phone});
 if(x.bday)b.set(db.doc('bdays/'+u.uid),{v:x.bday});
 try{await b.commit()}catch(e){await u.delete().catch(()=>{});throw{code:e&&e.code=='permission-denied'?'x-rules':'x-taken'}}
 try{await u.updateProfile({displayName:name})}catch(e){}
 // Send verification for new real-email accounts. Signup remains usable while the user verifies;
 // enforcement is deferred until legacy-account migration and recovery are designed.
 if(loginEmail){try{await u.sendEmailVerification()}catch(e){console.warn('Email verification could not be sent',e)}}
 if(x.ph)PH[u.uid]=x.ph};

/* ---------- واجهة الخطوات ---------- */
const E=s=>document.getElementById(s);
function grab(){const g=id=>{const e=E(id);return e?e.value:undefined};
 const set=(k,v)=>{if(v!==undefined)W[k]=v};
 set('name',g('sn'));set('email',g('semail'));set('un',g('su')!==undefined?g('su').trim().replace(/^@/,'').toLowerCase():undefined);set('cc',g('scc'));set('phone',g('sph'));
 set('d',g('sd'));set('m',g('sm'));set('y',g('sy'));set('bio',g('sbio'));set('city',g('scity'));set('sid',g('ssid'));set('pw',g('sp1'));set('pw2',g('sp2'))}
const seg=(k,v)=>`<div class="seg" data-k="${k}">${PVL.map(([a,t])=>`<button type="button" class="${v==a?'on':''}" data-v="${a}">${t}</button>`).join('')}</div>`;
function body(i){
 if(i==0)return `<label>اسمك<input id="sn" maxlength="30" autocomplete="name" placeholder="الاسم اللي هيظهر لأصحابك" value="${esc(W.name)}"></label>
  <label>اسم المستخدم<div class="row ltr"><span class="pre">@</span><input id="su" maxlength="20" autocapitalize="none" spellcheck="false" autocomplete="off" placeholder="sara.m" value="${esc(W.un)}"></div><small id="sust" class="${unState}"></small></label>
  <p class="mu hint">حروف إنجليزي صغيرة وأرقام و _ و . (من 3 إلى 20) وبيبدأ بحرف. تقدر تدخل بيه بدل الرقم.</p>`;
 if(i==1)return `<div class="phs"><div class="phv" id="phv"><canvas id="cv" width="280" height="280"></canvas><span class="phe" id="phe">📷</span></div>
  <input type="range" id="zm" min="1" max="3" step=".01" value="1" hidden aria-label="تكبير">
  <p class="mu hint" id="phh">${W.ph?'اسحب الصورة لتظبيط القص، وكبّرها من الشريط':'مفيش صورة لسه'}</p>
  <div class="btns"><button type="button" id="pgal">🖼 من الجهاز</button><button type="button" id="pcam">📸 كاميرا</button>${W.ph?'<button type="button" id="prm">🗑 شيل</button>':''}</div>
  <input type="file" id="pfile" accept="image/*" hidden><input type="file" id="pfcam" accept="image/*" capture="user" hidden></div>
  <div id="camx" hidden><video id="cvid" autoplay playsinline muted></video><div class="btns"><button type="button" id="csnap" class="pri">التقط</button><button type="button" id="cflip">🔄</button><button type="button" id="cx">إلغاء</button></div></div>`;
 if(i==2){const o=CTR.map(c=>`<option value="${c[2]}"${c[2]==W.cc?' selected':''}>${flag(c[0])} ${c[1]} (+${c[2]})</option>`).join('');
  return `<label>الدولة<select id="scc">${o}</select></label>
  <label>رقم الهاتف<div class="row ltr"><span class="pre" id="scp">+${esc(W.cc)}</span><input id="sph" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="16" placeholder="1012345678" value="${esc(W.phone)}"></div></label>
  <p class="note">⚠️ الرقم بيتحفظ في حسابك بس ومش متوثّق (مفيش خدمة SMS متوصّلة لسه). مش بيظهر لأي حد غير لو إنت اخترت كده في الخطوة 5.</p>`}
 if(i==3){const Y=new Date().getFullYear(),dd=['<option value="">اليوم</option>'],mm=['<option value="">الشهر</option>'],yy=['<option value="">السنة</option>'];
  for(let d=1;d<=31;d++)dd.push(`<option${W.d==d?' selected':''}>${d}</option>`);MONTHS.forEach((t,k)=>mm.push(`<option value="${k+1}"${W.m==k+1?' selected':''}>${t}</option>`));
  for(let y=Y;y>=Y-100;y--)yy.push(`<option${W.y==y?' selected':''}>${y}</option>`);
  const a=ageOf(W.y,W.m,W.d);
  return `<div class="trio"><select id="sd" aria-label="اليوم">${dd.join('')}</select><select id="sm" aria-label="الشهر">${mm.join('')}</select><select id="sy" aria-label="السنة">${yy.join('')}</select></div>
  <div class="agebox" id="agb">${a!==null&&a>=0?'عمرك <b>'+a+'</b> سنة':'اختار تاريخ ميلادك'}</div>
  <p class="mu hint">لازم تكون ${MINAGE} سنة على الأقل. تاريخ ميلادك مش بيظهر لحد إلا لو إنت اخترت.</p>`}
 if(i==4)return `<label>نبذة عنك <small class="mu">(اختياري)</small><textarea id="sbio" maxlength="120" rows="3" placeholder="جملة تعرّف بيك أصحابك">${esc(W.bio)}</textarea></label>
  <label>المدينة أو البلد <small class="mu">(اختياري)</small><input id="scity" maxlength="40" placeholder="مثال: القاهرة" value="${esc(W.city)}"></label>
  <div class="pvb"><b>مين يشوف رقم هاتفك؟</b>${seg('pvPhone',W.pvPhone)}<b>مين يشوف تاريخ ميلادك؟</b>${seg('pvBday',W.pvBday)}<small class="mu">تقدر تغيّرهم بعدين من الإعدادات.</small></div>`;
 const s=strength(W.pw);
 return `<label>البريد الإلكتروني<input id="semail" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" value="${esc(W.email)}"></label>
  <label>رقمك الرسمي (10 أرقام)<div class="row"><input id="ssid" inputmode="numeric" maxlength="10" autocomplete="off" placeholder="5043817296" value="${esc(W.sid)}"><button id="srnd" class="ic" type="button" title="اقترح رقم متاح">🎲</button></div><small id="ssst"></small></label>
  <label>كلمة السر<div class="row"><input id="sp1" type="password" autocomplete="new-password" placeholder="6 حروف على الأقل" value="${esc(W.pw)}"><button id="seye" class="ic" type="button">👁</button></div><div class="pm"><i id="spm" style="width:${s*25}%"></i></div></label>
  <label>تأكيد كلمة السر<input id="sp2" type="password" autocomplete="new-password" placeholder="اكتبها تاني" value="${esc(W.pw2)}"></label>
  <p class="note">استخدم بريدًا تملكه. كلمة المرور تُدار بواسطة Firebase Authentication ولا نخزنها كنص داخل قاعدة بيانات المنصة. رقمك الرسمي معرّف للحساب وليس كلمة مرور.</p>`}
function drawStep(){const i=W.step,[t,s]=STEPS[i],V=E('vup');
 V.innerHTML=`<div class="stp">${STEPS.map((_,k)=>`<i class="${k<i?'dn':k==i?'cu':''}"></i>`).join('')}</div>
 <div class="sth"><span class="sn">${i+1}/${STEPS.length}</span><h2 class="ah2">${t}</h2><p class="mu sub">${s}</p></div>
 <div class="sbody" data-s="${i}">${body(i)}</div>
 <div class="nav2">${i?'<button type="button" id="sbk" class="gh">رجوع</button>':'<span></span>'}${i==1?'<button type="button" id="sskip" class="gh">تخطي</button>':''}<button type="button" id="snx" class="pri">${i==STEPS.length-1?'إنشاء الحساب':'التالي'}</button></div>`;
 err('');if(i==1)cvDraw();if(i==0)checkUn();if(i==5){if(!W.sid)suggest();else checkSid()}
 const f=V.querySelector('input:not([type=hidden]):not([type=file]),select');f&&matchMedia('(pointer:fine)').matches&&f.focus()}

/* ---------- تحقق كل خطوة ---------- */
function vStep(i){grab();
 if(i==0){if(!W.name.trim())return 'اكتب اسمك الأول';if(W.name.trim().length<2)return 'الاسم قصير';
  if(!UNRE.test(W.un))return 'اسم المستخدم من 3 لـ 20 حرف إنجليزي صغير أو أرقام أو _ أو . وبيبدأ بحرف';
  if(RESERVED.includes(W.un))return 'اسم المستخدم ده محجوز للنظام';
  if(unState=='bad')return 'اسم المستخدم محجوز، اختار اسم تاني'}
 if(i==2){const c=ctry(W.cc),n=natPhone(W.cc,W.phone);if(!n)return 'اكتب رقم هاتفك';if(!/^\d+$/.test(n))return 'الرقم لازم يكون أرقام بس';
  if(n.length<c[3]||n.length>c[4])return 'رقم '+c[1]+' لازم يكون '+(c[3]==c[4]?c[3]:c[3]+' لـ '+c[4])+' رقم بدون صفر البداية';
  if(W.cc=='20'&&!/^1[0125]/.test(n))return 'رقم موبايل مصر بيبدأ بـ 10 أو 11 أو 12 أو 15'}
 if(i==3){if(!W.d||!W.m||!W.y)return 'اختار اليوم والشهر والسنة';const a=ageOf(W.y,W.m,W.d);
  if(a===null)return 'التاريخ ده مش موجود في التقويم';if(a<0)return 'تاريخ الميلاد في المستقبل';
  if(a<MINAGE)return 'لازم تكون '+MINAGE+' سنة على الأقل عشان تعمل حساب';if(a>110)return 'راجع سنة الميلاد'}
 if(i==5){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(W.email))return 'اكتب بريد إلكتروني صحيح';if(!OK(W.sid))return 'الرقم الخاص لازم 10 أرقام وأول رقم مش صفر';if(W.pw.length<6)return 'كلمة السر 6 حروف على الأقل';
  if(W.pw!=W.pw2)return 'تأكيد كلمة السر مش زي الأولى'}
 return ''}
async function nextStep(){const i=W.step,m=vStep(i);if(m){err(m);return}
 if(i==0&&unState!='ok'){const r=await checkUn();if(r=='bad')return err('اسم المستخدم محجوز، اختار اسم تاني');if(r=='x')return err('مقدرتش أتأكد من اسم المستخدم. شوف النت أو انشر القواعد الجديدة')}
 if(i==1&&CV.img)W.ph=cvExport();
 if(i==STEPS.length-1)return finish();
 W.step++;drawStep()}
async function finish(){
 for(let i=0;i<STEPS.length-1;i++){const m=vStep(i);if(m){W.step=i;drawStep();return err(m)}}
 const b=E('snx');b.disabled=true;err('');
 try{
  if(!(await freeId(W.sid)))throw{code:'x-taken'};
  const mm=String(W.m).padStart(2,'0'),dd=String(W.d).padStart(2,'0');
  await signup(W.sid,W.pw,W.name.trim(),{email:W.email,un:W.un,bio:W.bio.trim(),city:W.city.trim(),ph:W.ph,phone:'+'+W.cc+natPhone(W.cc,W.phone),bday:`${W.y}-${mm}-${dd}`,pvPhone:W.pvPhone,pvBday:W.pvBday});
  Object.assign(W,{step:0,name:'',un:'',email:'',ph:null,phone:'',d:'',m:'',y:'',bio:'',city:'',sid:'',pw:'',pw2:''});CV.img=null}
 catch(e){const code=e&&e.code;if(code=='x-un'){W.step=0;drawStep();unState='bad';E('sust')&&(E('sust').textContent='❌ محجوز');}
  err(AE[code]||'حصلت مشكلة، حاول تاني');E('snx')&&(E('snx').disabled=false);return}}
E('vup').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
 if(t.id=='snx')nextStep();else if(t.id=='sbk'){grab();W.step=Math.max(0,W.step-1);drawStep()}
 else if(t.id=='sskip'){grab();W.step++;drawStep()}
 else if(t.id=='seye'){const p=E('sp1');p.type=p.type=='password'?'text':'password'}
 else if(t.id=='srnd')suggest();
 else if(t.closest('.seg')){const k=t.closest('.seg').dataset.k;W[k]=t.dataset.v;t.parentNode.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==t))}
 else if(t.id=='pgal')E('pfile').click();else if(t.id=='pfcam')openCam();else if(t.id=='prm'){W.ph=null;CV.img=null;drawStep()}
 else if(t.id=='csnap')snap();else if(t.id=='cflip'){cam.face=cam.face=='user'?'environment':'user';openCam(true)}else if(t.id=='cx')closeCam()});
E('vup').addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.tagName!='TEXTAREA'&&e.target.tagName!='BUTTON'){e.preventDefault();nextStep()}});
E('vup').addEventListener('input',e=>{const id=e.target.id;
 if(id=='su'){e.target.value=e.target.value.toLowerCase().replace(/[^a-z0-9_.@]/g,'').replace('@','');clearTimeout(unTimer);unState='';unTimer=setTimeout(checkUn,350)}
 else if(id=='ssid'){e.target.value=e.target.value.replace(/\D/g,'').slice(0,10);checkSid()}
 else if(id=='sph'){e.target.value=e.target.value.replace(/[^\d\s]/g,'')}
 else if(id=='sp1'){E('spm').style.width=strength(e.target.value)*25+'%'}
 else if(id=='sbio'){}
 if(id=='sd'||id=='sm'||id=='sy'){grab();const a=ageOf(W.y,W.m,W.d);E('agb').innerHTML=a!==null&&a>=0?'عمرك <b>'+a+'</b> سنة':'اختار تاريخ ميلادك'}
 grab()});
E('vup').addEventListener('change',e=>{const id=e.target.id;
 if(id=='scc'){E('scp').textContent='+'+e.target.value}
 if(id=='pfile'||id=='pfcam'){const f=e.target.files[0];e.target.value='';f&&loadFile(f)}
 grab()});

async function checkUn(){const el=E('sust'),u=(E('su')?E('su').value:W.un).trim().toLowerCase();if(!el)return;
 if(!u){el.textContent='';el.className='';unState='';return}
 if(!UNRE.test(u)){el.textContent='الاسم لازم 3 لـ 20 حرف/رقم وبيبدأ بحرف';el.className='';unState='';return}
 if(RESERVED.includes(u)){el.textContent='❌ محجوز للنظام';el.className='bad';return unState='bad'}
 unState='ok';el.textContent='سيتم تأكيد توفر الاسم عند إنشاء الحساب';el.className='ok';return 'ok'}
async function checkSid(){const el=E('ssst'),n=E('ssid')?E('ssid').value:'';if(!el)return;el.className='';el.textContent='';if(!n)return;
 if(!OK(n))return el.textContent='10 أرقام وأول رقم مش صفر';
 const f=await freeId(n);if(!E('ssid')||E('ssid').value!=n)return;el.textContent=f?'✅ الرقم متاح':'❌ الرقم محجوز';el.className=f?'ok':'bad'}
async function suggest(){for(let i=0;i<12;i++){const n=rndSid();if(await freeId(n)){W.sid=n;const e=E('ssid');if(e){e.value=n;checkSid()}return}}err('مقدرتش ألاقي رقم متاح، جرب تاني')}

/* ---------- الصورة: اختيار + قص + معاينة ---------- */
const CV={img:null,z:1,x:0,y:0,base:1,S:280};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function cvDraw(){const c=E('cv');if(!c)return;const g=c.getContext('2d'),S=CV.S;g.fillStyle='#15130c';g.fillRect(0,0,S,S);
 E('phe')&&(E('phe').hidden=!!CV.img);E('zm')&&(E('zm').hidden=!CV.img);if(!CV.img)return;
 const s=CV.base*CV.z,w=CV.img.width*s,h=CV.img.height*s;CV.x=clamp(CV.x,S-w,0);CV.y=clamp(CV.y,S-h,0);g.drawImage(CV.img,CV.x,CV.y,w,h)}
function cvSet(img){CV.img=img;CV.base=CV.S/Math.min(img.width,img.height);CV.z=1;CV.x=(CV.S-img.width*CV.base)/2;CV.y=(CV.S-img.height*CV.base)/2;
 const z=E('zm');if(z)z.value=1;E('phh')&&(E('phh').textContent='اسحب الصورة لتظبيط القص، وكبّرها من الشريط');cvDraw()}
function cvZoom(z){if(!CV.img)return;const S=CV.S,o=CV.base*CV.z,cx=(S/2-CV.x)/o,cy=(S/2-CV.y)/o;CV.z=clamp(z,1,3);const n=CV.base*CV.z;CV.x=S/2-cx*n;CV.y=S/2-cy*n;cvDraw()}
function cvExport(){const o=document.createElement('canvas');o.width=o.height=256;o.getContext('2d').drawImage(E('cv'),0,0,256,256);return o.toDataURL('image/jpeg',.85)}
function loadFile(f){if(!/^image\//.test(f.type))return err('اختار صورة بس');if(f.size>15e6)return err('الصورة كبيرة قوي (أقصى 15 ميجا)');err('');
 const u=URL.createObjectURL(f),i=new Image();i.onload=()=>{URL.revokeObjectURL(u);if(!E('cv'))return;cvSet(i)};i.onerror=()=>{URL.revokeObjectURL(u);err('مقدرتش أقرأ الصورة دي')};i.src=u}
let drag=null;
E('vup').addEventListener('pointerdown',e=>{if(e.target.id!='cv'||!CV.img)return;e.target.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,ox:CV.x,oy:CV.y,k:CV.S/e.target.getBoundingClientRect().width}});
E('vup').addEventListener('pointermove',e=>{if(!drag)return;CV.x=drag.ox+(e.clientX-drag.x)*drag.k;CV.y=drag.oy+(e.clientY-drag.y)*drag.k;cvDraw()});
['pointerup','pointercancel'].forEach(n=>E('vup').addEventListener(n,()=>drag=null));
E('vup').addEventListener('input',e=>{if(e.target.id=='zm')cvZoom(+e.target.value)});
E('vup').addEventListener('wheel',e=>{if(e.target.id!='cv'||!CV.img)return;e.preventDefault();const z=clamp(CV.z+(e.deltaY<0?.1:-.1),1,3);E('zm').value=z;cvZoom(z)},{passive:false});
/* الكاميرا: getUserMedia، ولو مش متاحة أو اتمنعت نفتح كاميرا الجهاز عن طريق الملف */
const cam={stream:null,face:'user'};
async function openCam(re){if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){return E('pfcam').click()}
 try{closeCam(1);cam.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:cam.face,width:{ideal:960},height:{ideal:960}},audio:false});
  const v=E('cvid');v.srcObject=cam.stream;E('camx').hidden=false;E('vup').querySelector('.phs').hidden=true}
 catch(e){closeCam();err(e&&e.name=='NotAllowedError'?'الكاميرا مش مسموحة. اسمح بيها من إعدادات المتصفح أو اختار من الجهاز':'مقدرتش أفتح الكاميرا، اختار صورة من الجهاز')}}
function closeCam(keep){if(cam.stream){cam.stream.getTracks().forEach(t=>t.stop());cam.stream=null}if(keep)return;const c=E('camx'),p=E('vup').querySelector('.phs');c&&(c.hidden=true);p&&(p.hidden=false)}
function snap(){const v=E('cvid');if(!v||!v.videoWidth)return err('الكاميرا لسه بتشتغل، استنى ثانية');const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;
 const g=c.getContext('2d');if(cam.face=='user'){g.translate(c.width,0);g.scale(-1,1)}g.drawImage(v,0,0);
 const i=new Image();i.onload=()=>{closeCam();cvSet(i)};i.src=c.toDataURL('image/jpeg',.92)}

/* ---------- الحسابات المحفوظة على شاشة الدخول + رجوع ---------- */
const nameOf=a=>a.name||a.un||a.sid||'حساب';
const avA=a=>a.th?`<u class="av" style="background:center/cover url('${a.th}')"></u>`:`<u class="av" style="--h:${hue(a.uid||a.slot)}">${esc((nameOf(a)||'؟').trim().charAt(0).toUpperCase())}</u>`;
function renderSaved(){const V=E('vacc'),L=ACCT.list().filter(a=>a.slot!=ACCT.slot);
 const back=ACCT.isAdding();E('abk').hidden=!back;
 if(!L.length){V.hidden=true;V.innerHTML='';return}
 V.hidden=false;V.innerHTML=`<div class="dv"><span>أو افتح حساب محفوظ</span></div><div class="sacc">${L.map(a=>`<button type="button" data-sl="${esc(a.slot)}">${avA(a)}<span><b>${esc(nameOf(a))}</b><small>${esc(a.un?'@'+a.un:a.sid||'')}</small></span><i>‹</i></button>`).join('')}</div>${ACCT.lockOn()?'<p class="mu hint">🔒 فتح الحساب المحفوظ محتاج PIN.</p>':''}`}
E('vacc').onclick=async e=>{const b=e.target.closest('[data-sl]');if(!b)return;if(window.ACCTUI&&!(await ACCTUI.askPin('افتح الحساب')))return;ACCT.switchTo(b.dataset.sl)};
E('abk').onclick=()=>ACCT.cancelAdd();
renderSaved();

/* ---------- تسجيل الحساب الحالي في قايمة الحسابات المحفوظة ---------- */
const small=(src,cb)=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=c.height=56;const g=c.getContext('2d'),m=Math.min(i.width,i.height);g.drawImage(i,(i.width-m)/2,(i.height-m)/2,m,m,0,0,56,56);cb(c.toDataURL('image/jpeg',.7))};i.onerror=()=>cb(null);i.src=src};
let lastSig='';
function syncMeta(){if(!me||!U.sid)return;const ph=PH[me.uid]||'',sig=[U.name,U.un,U.sid,ph.length].join('|');if(sig==lastSig)return;lastSig=sig;
 const put=th=>{const m={slot:ACCT.slot,uid:me.uid,sid:U.sid,name:U.name||me.displayName||'',un:U.un||''};if(th!==undefined)m.th=th;ACCT.upsert(m)};
 ph?small(ph,th=>put(th||undefined)):put(null)}
auth.onAuthStateChanged(u=>{
 if(!u){lastSig='';renderSaved();setM(mode);return}
 const ex=ACCT.byUid(u.uid);
 if(ex&&ex.slot!=ACCT.slot){toast('الحساب ده متضاف قبل كده، هنفتحه');auth.signOut().then(()=>ACCT.switchTo(ex.slot));return}
 ACCT.upsert({slot:ACCT.slot,uid:u.uid,sid:(u.email||'').split('@')[0],name:u.displayName||''});ACCT.done()});
setInterval(syncMeta,700);
})();
