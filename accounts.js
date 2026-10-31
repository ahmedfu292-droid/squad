/* The Squad v26 — شاشة «الحسابات» في الإعدادات + بيانات الملف الشخصي الإضافية + عرض ملف عضو.
   بيتحمّل قبل ui2.js وبعد settings.js. settings.js بيستدعي ACCTUI.page / ACCTUI.profile ويعرّض window.stRender.
   بيعتمد على: acct.js (ACCT)، app.js (auth, db, FV, me, U, PH, av, esc, toast, sheet, closeSh, $, OK). */
(()=>{
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const CTR=[['EG','مصر','20'],['SA','السعودية','966'],['AE','الإمارات','971'],['KW','الكويت','965'],['QA','قطر','974'],['BH','البحرين','973'],['OM','عُمان','968'],['JO','الأردن','962'],['LB','لبنان','961'],['IQ','العراق','964'],['SY','سوريا','963'],['PS','فلسطين','970'],['YE','اليمن','967'],['LY','ليبيا','218'],['TN','تونس','216'],['DZ','الجزائر','213'],['MA','المغرب','212'],['SD','السودان','249'],['TR','تركيا','90'],['US','أمريكا وكندا','1'],['GB','بريطانيا','44'],['DE','ألمانيا','49'],['FR','فرنسا','33'],['IT','إيطاليا','39'],['ES','إسبانيا','34']];
const flag=iso=>String.fromCodePoint(...[...iso].map(c=>127397+c.charCodeAt(0)));
const UNRE=/^[a-z][a-z0-9_.]{2,19}$/,RESERVED=['admin','administrator','squad','thesquad','support','official','root','system','moderator','help'];
const ageOf=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||'');if(!m)return null;const D=new Date(+m[1],+m[2]-1,+m[3]),n=new Date();let a=n.getFullYear()-D.getFullYear();if(n.getMonth()<D.getMonth()||(n.getMonth()==D.getMonth()&&n.getDate()<D.getDate()))a--;return a};
const nameOf=a=>a.name||(a.un?'@'+a.un:'')||a.sid||'حساب';
const avA=a=>a.th?`<u class="av" style="background:center/cover url('${a.th}')"></u>`:`<u class="av" style="--h:${hue(a.uid||a.slot)}">${esc(String(nameOf(a)).trim().charAt(0).toUpperCase()||'؟')}</u>`;
const idl=a=>(a.un?'<bdi>@'+esc(a.un)+'</bdi> · ':'')+'<bdi>'+esc(a.sid||'')+'</bdi>';
const rerender=()=>window.stRender&&window.stRender();
let BUSY=0;

/* ---------- طلب الـ PIN (لو القفل شغّال) ---------- */
function askPin(title){return new Promise(res=>{
 if(!ACCT.lockOn())return res(true);
 const draw=msg=>{const w=ACCT.waitMs();
  sheet(`<h3>🔒 ${esc(title||'تأكيد')}</h3><p class="mu">اكتب PIN قفل الحسابات</p><input id="pinq" type="password" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="PIN" style="width:100%;box-sizing:border-box;text-align:center;letter-spacing:8px;font-size:22px"><p id="pinm" class="mu" style="color:var(--bad);min-height:20px">${esc(msg||(w?'استنى '+Math.ceil(w/1000)+' ثانية وحاول تاني':''))}</p><div style="display:flex;gap:8px"><button class="pri" id="pinok" style="flex:1">تأكيد</button><button id="pinno">إلغاء</button></div>`);
  const i=$('#pinq');i.focus();let done=0;
  const ok=async()=>{if(done)return;const v=i.value;if(v.length<4)return $('#pinm').textContent='PIN من 4 أرقام على الأقل';done=1;
   if(await ACCT.lockCheck(v)){closeSh();res(true)}else{done=0;const w2=ACCT.waitMs();draw(w2?'محاولات كتير، استنى '+Math.ceil(w2/1000)+' ثانية':'الـ PIN غلط')}};
  $('#pinok').onclick=ok;$('#pinno').onclick=()=>{closeSh();res(false)};i.onkeydown=e=>{if(e.key=='Enter')ok()}};
 draw()})}
/* إعداد PIN جديد (مرتين) */
function newPin(){return new Promise(res=>{
 sheet(`<h3>🔒 قفل الحسابات</h3><p class="mu">اختار PIN من 4 لـ 8 أرقام. هيتطلب لما تبدّل أو تفتح حساب محفوظ أو تشيله.</p><input id="pn1" type="password" inputmode="numeric" maxlength="8" placeholder="PIN" style="width:100%;box-sizing:border-box;text-align:center;letter-spacing:8px;font-size:22px"><input id="pn2" type="password" inputmode="numeric" maxlength="8" placeholder="أكّد الـ PIN" style="width:100%;box-sizing:border-box;text-align:center;letter-spacing:8px;font-size:22px;margin-top:8px"><p id="pnm" class="mu" style="color:var(--bad);min-height:20px"></p><div style="display:flex;gap:8px"><button class="pri" id="pnok" style="flex:1">تفعيل</button><button id="pnno">إلغاء</button></div>`);
 $('#pn1').focus();
 $('#pnok').onclick=async()=>{const a=$('#pn1').value,b=$('#pn2').value;if(!/^\d{4,8}$/.test(a))return $('#pnm').textContent='PIN أرقام بس، من 4 لـ 8';if(a!=b)return $('#pnm').textContent='التأكيد مش زي الـ PIN';
  await ACCT.lockSet(a);closeSh();res(true)};
 $('#pnno').onclick=()=>{closeSh();res(false)}})}

/* ---------- شاشة الحسابات ---------- */
function page(top,sec){const L=ACCT.list(),cur=L.find(a=>a.slot==ACCT.slot)||{slot:ACCT.slot,uid:me.uid,sid:U.sid,name:U.name,un:U.un},oth=L.filter(a=>a.slot!=ACCT.slot);
 const lock=ACCT.lockOn();
 return top('الحسابات')+
 sec('الحساب الحالي')+`<div class="st-list"><div class="st-row" style="cursor:default">${av(me.uid,nameOf(cur))}<span class="tt"><b>${esc(nameOf(cur))}</b><small>${idl(cur)}</small></span><span class="vl" style="color:var(--ok)">نشط</span></div>
  <button class="st-row red" data-ax="outone"><span class="ch">🚪</span><span class="tt"><b>تسجيل الخروج من الحساب ده</b><small>بيتشال من الجهاز ومن القايمة. الحساب نفسه بيفضل موجود</small></span><span></span></button></div>`+
 sec('حساباتك المحفوظة ('+oth.length+')')+(oth.length?`<div class="st-list">${oth.map(a=>`<div class="st-row" style="cursor:default">${avA(a)}<span class="tt"><b>${esc(nameOf(a))}</b><small>${idl(a)}</small></span><button class="pri" style="padding:7px 14px;font-size:13px" data-ax="sw" data-sl="${esc(a.slot)}">تبديل</button><button style="padding:7px 12px;font-size:13px;color:var(--bad)" data-ax="rm" data-sl="${esc(a.slot)}" title="إزالة من القايمة">إزالة</button></div>`).join('')}</div>`:`<p class="st-note">مفيش حسابات تانية محفوظة على الجهاز ده.</p>`)+
 `<div class="st-list" style="margin-top:12px"><button class="st-row" data-ax="add"><span class="ch">➕</span><span class="tt"><b>إضافة حساب</b><small>سجّل دخول أو اعمل حساب جديد من غير ما تخرج من الحالي</small></span><span class="cv2">‹</span></button></div>`+
 sec('الحماية')+`<div class="st-list"><button class="st-row tg" data-ax="lock"><span class="ch">🔒</span><span class="tt"><b>قفل التبديل بين الحسابات</b><small>${lock?'شغّال: PIN مطلوب للتبديل والإزالة':'مقفول: أي حد ماسك الجهاز يقدر يبدّل'}</small></span><span class="sw2" role="switch" aria-checked="${lock}"></span></button></div>
 <div class="st-list" style="margin-top:12px"><button class="st-row red" data-ax="outall"><span class="ch">⛔</span><span class="tt"><b>تسجيل الخروج من كل الحسابات</b><small>بيفصل كل الحسابات من الجهاز ده</small></span><span></span></button></div>
 <p class="st-note">كل حساب محفوظ بجلسة Firebase الرسمية على الجهاز، ومفيش كلمات سر بتتخزّن. رسايل وبيانات كل حساب منفصلة تماماً، ومحادثات حساب ما بتظهرش جوه التاني.<br>الإشعارات بتوصل للحساب المفتوح بس. الـ PIN بيمنع حد من فتح حساب محفوظ من جوه التطبيق، لكنه مش بديل لقفل شاشة الجهاز نفسه.${ACCT.nsOk?'':'<br><b>تنبيه:</b> المتصفح ده مانع فصل التخزين المحلي بين الحسابات، فسجل المكالمات والمسودات ممكن تتشارك.'}</p>`}

/* ---------- ملف شخصي: بيانات إضافية ---------- */
let PRIV={loaded:0,phone:'',bday:''};
async function loadPriv(){if(PRIV.loaded||!me)return;PRIV.loaded=1;
 const g=async p=>{try{const s=await db.doc(p+'/'+me.uid).get();return s.exists?s.data().v||'':''}catch(e){return ''}};
 PRIV.phone=await g('phones');PRIV.bday=await g('bdays');rerender()}
function profile(){loadPriv();const a=ageOf(PRIV.bday),m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(PRIV.bday||'')||[],Y=new Date().getFullYear();
 let cc='20',nat='';const ph=PRIV.phone||'';if(ph){const c=CTR.slice().sort((x,y)=>y[2].length-x[2].length).find(c=>ph.startsWith('+'+c[2]));if(c){cc=c[2];nat=ph.slice(c[2].length+1)}else nat=ph.replace(/^\+/,'')}
 const dd=['<option value="">يوم</option>'],mm=['<option value="">شهر</option>'],yy=['<option value="">سنة</option>'];
 for(let d=1;d<=31;d++)dd.push(`<option${+m[3]==d?' selected':''}>${d}</option>`);MONTHS.forEach((t,k)=>mm.push(`<option value="${k+1}"${+m[2]==k+1?' selected':''}>${t}</option>`));for(let y=Y;y>=Y-100;y--)yy.push(`<option${+m[1]==y?' selected':''}>${y}</option>`);
 return `<div class="box2"><h3>🪪 بيانات إضافية</h3>
  ${U.un?`<div class="st-note" style="margin:0 0 8px">اسم المستخدم: <b style="direction:ltr;unicode-bidi:embed">@${esc(U.un)}</b> (مش بيتغيّر)</div>`:`<input id="axun" dir="ltr" maxlength="20" autocapitalize="none" placeholder="اختار اسم مستخدم (a-z و 0-9 و _ .)"><button data-ax="claim">حجز اسم المستخدم</button>`}
  <input id="axcity" maxlength="40" placeholder="المدينة أو البلد (اختياري)" value="${esc(U.city||'')}">
  <div style="display:flex;gap:6px;direction:ltr"><select id="axcc" style="flex:0 0 42%">${CTR.map(c=>`<option value="${c[2]}"${c[2]==cc?' selected':''}>${flag(c[0])} ${c[1]} +${c[2]}</option>`).join('')}</select><input id="axph" type="tel" inputmode="tel" maxlength="16" placeholder="رقم الهاتف" value="${esc(nat)}"></div>
  <small class="mu">رقم الهاتف غير موثّق (مفيش خدمة SMS متوصّلة). ${PRIV.phone?'':'مفيش رقم محفوظ.'}</small>
  <div style="display:grid;grid-template-columns:.8fr 1.2fr 1fr;gap:6px"><select id="axd">${dd.join('')}</select><select id="axm">${mm.join('')}</select><select id="axy">${yy.join('')}</select></div>
  <small class="mu">${a!==null&&a>=0?'عمرك '+a+' سنة':'تاريخ الميلاد غير محدد'}. مين يشوفهم: من «الخصوصية».</small>
  <button class="pri" data-ax="savex">حفظ البيانات الإضافية</button></div>`}
async function saveExtra(){if(BUSY)return;BUSY=1;
 try{const city=$('#axcity').value.trim(),cc=$('#axcc').value,raw=$('#axph').value.replace(/[^\d]/g,'').replace(/^0+/,''),d=$('#axd').value,mo=$('#axm').value,y=$('#axy').value;
  if(raw&&(raw.length<6||raw.length>13))return toast('رقم الهاتف غير صحيح');if(cc=='20'&&raw&&!/^1[0125]\d{8}$/.test(raw))return toast('رقم موبايل مصر 10 أرقام وبيبدأ بـ 10 أو 11 أو 12 أو 15');
  let bday='';if(d||mo||y){if(!(d&&mo&&y))return toast('كمّل تاريخ الميلاد');const t=new Date(+y,+mo-1,+d);if(t.getDate()!=+d||t.getMonth()!=+mo-1)return toast('التاريخ مش موجود');const a=ageOf(`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`);if(a<13||a>110)return toast('العمر لازم يكون من 13 لـ 110');bday=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
  const b=db.batch();b.update(db.doc('users/'+me.uid),city?{city}:{city:FV.delete()});
  raw?b.set(db.doc('phones/'+me.uid),{v:'+'+cc+raw}):b.delete(db.doc('phones/'+me.uid));
  bday?b.set(db.doc('bdays/'+me.uid),{v:bday}):b.delete(db.doc('bdays/'+me.uid));
  await b.commit();PRIV.phone=raw?'+'+cc+raw:'';PRIV.bday=bday;toast('اتحفظت ✅');rerender()}
 catch(e){toast(e&&e.code=='permission-denied'?'مقدرتش أحفظ. انشر firestore.rules الجديدة':'مقدرتش أحفظ')}
 finally{BUSY=0}}
async function claimUn(){const u=($('#axun').value||'').trim().toLowerCase();if(!UNRE.test(u))return toast('الاسم 3 لـ 20 حرف إنجليزي صغير/رقم/_/. وبيبدأ بحرف');if(RESERVED.includes(u))return toast('الاسم ده محجوز للنظام');
 try{await fbApp.functions('europe-west1').httpsCallable('claimUsername')({username:u});toast('اتحجز @'+u+' ✅');rerender()}
 catch(e){toast(e&&e.code==='functions/already-exists'?'الاسم محجوز':'مقدرتش أحجز الاسم دلوقتي')}}

/* ---------- الأحداث ---------- */
async function onClick(e){const b=e.target.closest('[data-ax]');if(!b)return;const k=b.dataset.ax,sl=b.dataset.sl;
 if(k=='sw'){if(await askPin('تبديل الحساب'))ACCT.switchTo(sl)}
 else if(k=='rm'){if(!(await askPin('إزالة حساب')))return;const a=ACCT.list().find(x=>x.slot==sl);if(!await SquadDialog.confirm('تشيل «'+(a?nameOf(a):'الحساب')+'» من الجهاز ده؟ الحساب نفسه مش هيتمسح.'))return;await ACCT.remove(sl);toast('اتشال من القايمة');rerender()}
 else if(k=='add'){ACCT.addNew()}
 else if(k=='outone'){if(!(await askPin('تسجيل الخروج')))return;if(!await SquadDialog.confirm('تسجّل خروج من الحساب ده؟'))return;await ACCT.remove(ACCT.slot)}
 else if(k=='outall'){if(!(await askPin('الخروج من كل الحسابات')))return;if(!await SquadDialog.confirm('تسجّل خروج من كل الحسابات على الجهاز ده؟'))return;await ACCT.removeAll()}
 else if(k=='lock'){if(ACCT.lockOn()){if(!(await askPin('إيقاف القفل')))return;ACCT.lockOff();toast('القفل اتقفل');rerender()}else if(await newPin()){toast('القفل اشتغل 🔒');rerender()}}
 else if(k=='savex')saveExtra();else if(k=='claim')claimUn()}
document.addEventListener('click',onClick);
document.addEventListener('change',e=>{if(e.target.id=='axcc'){}});

/* ---------- ملف عضو (من نتيجة البحث) ---------- */
async function profSheet(u){
 const g=async p=>{try{const s=await db.doc(p+'/'+u).get();return s.exists?s.data():null}catch(e){return null}};
 const x=(await g('users'))||{},ph=await g('phones'),bd=await g('bdays');if(!PH[u])av(u,x.name);
 const a=bd?ageOf(bd.v):null,ok=x.un?'@'+x.un:'';
 sheet(`<div class="pfcard">${av(u,x.name)}<h3 style="margin:10px 0 2px">${esc(x.name||'عضو')}</h3>${ok?`<div class="mu" style="direction:ltr">${esc(ok)}</div>`:''}<p>${esc(x.bio||'')}</p>
  <div class="st-list" style="text-align:start">${x.sid?`<div class="st-row" style="cursor:default"><span class="ch">🔢</span><span class="tt"><b>الرقم الخاص</b><small>${esc(x.sid)}</small></span></div>`:''}${x.city?`<div class="st-row" style="cursor:default"><span class="ch">📍</span><span class="tt"><b>${esc(x.city)}</b></span></div>`:''}${a!==null&&a>=0?`<div class="st-row" style="cursor:default"><span class="ch">🎂</span><span class="tt"><b>${a} سنة</b></span></div>`:''}${ph?`<div class="st-row" style="cursor:default"><span class="ch">📞</span><span class="tt"><b style="direction:ltr;unicode-bidi:embed">${esc(ph.v)}</b><small>غير موثّق</small></span></div>`:''}</div>
  ${u!=me.uid?`<button class="pri" style="margin-top:12px" id="pfd">💬 ابدأ محادثة</button>`:''}<button class="gh2" style="margin-top:8px" id="pfx">إغلاق</button></div>`);$('#pfx').onclick=closeSh;const pd=$('#pfd');pd&&(pd.onclick=()=>{closeSh();dm(u,x.name||'عضو')})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act=prof]');b&&profSheet(b.dataset.u)});

window.ACCTUI={page,profile,askPin,prof:profSheet};
auth.onAuthStateChanged(()=>{PRIV={loaded:0,phone:'',bday:''}});
})();
