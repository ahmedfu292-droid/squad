/* The Squad — التحديثات: الحالات + القنوات + الحساب الرسمي (رقمه 1000000000) */
const rulesWarn=()=>{clearTimeout(rulesWarn.t);rulesWarn.t=setTimeout(()=>toast('الحالات والقنوات محتاجة قواعد firestore.rules الجديدة. انشرها في Firebase'),400)};
const OFFICIAL='1000000000';
/* التوثيق نوعين منفصلين: off = توثيق يدوي للقناة الرسمية بس (بيتحط من حساب The Squad الرسمي)،
   وتوثيق الوصول = fc (عدد المتابعين اللي بيتحسب من مستندات channels/{id}/followers) لما يوصل 5000. */
const VF_MIN=5000;
const VFB=c=>c.off?' <i class="vf" title="القناة الرسمية">✔</i>':(c.fc||0)>=VF_MIN?' <i class="vf" title="قناة موثّقة: 5000 متابع أو أكتر">✔</i>':'';
/* متابعة / إلغاء متابعة: مستند متابع واحد لكل مستخدم + تعديل العداد ±1 في نفس الـ batch، والقواعد بتفرض الاتنين مع بعض */
async function toggleFollow(id){
 const c=CH[id];if(!c)throw new Error('no channel');if(c.o==me.uid){toast('دي قناتك');return}
 const fr=db.doc(`channels/${id}/followers/${me.uid}`),s=await fr.get(),has=!!(s&&s.exists),inList=(U.follow||[]).includes(id),
  b=db.batch(),ur=db.doc('users/'+me.uid),cr=db.doc('channels/'+id);
 if(has){b.delete(fr);b.update(cr,{fc:FV.increment(-1)});b.update(ur,{follow:FV.arrayRemove(id)})}
 else if(inList){b.update(ur,{follow:FV.arrayRemove(id)})} /* متابعة قديمة من قبل نظام العدّ: بتتشال من قايمتك بس */
 else{b.set(fr,{t:FV.serverTimestamp()});b.update(cr,{fc:FV.increment(1)});b.update(ur,{follow:FV.arrayUnion(id)})}
 await b.commit()}
const BG=['linear-gradient(135deg,#7a4dff,#2f8cff)','linear-gradient(135deg,#ff4fd8,#8a5cff)','linear-gradient(135deg,#ff8a5c,#ff2d55)','linear-gradient(135deg,#1fcf7a,#2f8cff)','linear-gradient(135deg,#ffb703,#ff5ca8)','linear-gradient(135deg,#0b1030,#3fe0ff)'];
let ST={},CH={},sa={},sb={},sc={},unS=[],unCh=null,SEEN={};
try{SEEN=JSON.parse(localStorage.seen||'{}')}catch(e){}
const ago=t=>{const m=(Date.now()-ms(t))/6e4|0;return m<1?'الآن':m<60?m+' د':(m/60|0)+' س'};
const live=()=>Object.values(ST).filter(s=>s.exp>Date.now()).sort((a,b)=>ms(a.t)-ms(b.t));
const shrink=(f,max,cb)=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas'),s=Math.min(1,max/Math.max(i.width,i.height));c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);
 let q=.75,d=c.toDataURL('image/jpeg',q);while(d.length>230000&&q>.3){q-=.1;d=c.toDataURL('image/jpeg',q)}cb(d)};i.src=URL.createObjectURL(f)};

function startStories(){
 unS.forEach(f=>f());ST={};sa={};sb={};sc={};CH={};
 const mix=()=>{ST={...sa,...sb,...sc};tab=='up'&&viewUp()};
 const lis=(q,o)=>q.onSnapshot(s=>{for(const k in o)delete o[k];s.forEach(d=>o[d.id]={id:d.id,...d.data()});mix()},rulesWarn);
 unS=[lis(db.collection('stories').where('u','==',me.uid).limit(50),sa),
  lis(db.collection('stories').where('to','array-contains',me.uid).limit(150),sb),
  lis(db.collection('stories').where('vis','==','p').limit(150),sc),
  db.collection('channels').limit(60).onSnapshot(s=>{CH={};s.forEach(d=>CH[d.id]={id:d.id,...d.data()});tab=='up'&&viewUp()},rulesWarn)];
 db.collection('stories').where('u','==',me.uid).get().then(s=>s.forEach(d=>d.data().exp<Date.now()&&d.ref.delete())).catch(()=>{});
 if(U.sid==OFFICIAL)db.doc('channels/squad').get().then(s=>{if(!s.exists)return db.doc('channels/squad').set({nm:'The Squad',ds:'القناة الرسمية لـ The Squad',o:me.uid,on:'The Squad',off:true,fc:0,t:FV.serverTimestamp()})}).catch(()=>{})}
auth.onAuthStateChanged(u=>{if(!u){unS.forEach(f=>f());unS=[];unCh&&unCh();unCh=null}});

/* ---------- تبويب التحديثات ---------- */
function viewUp(){
 const by={};live().forEach(s=>(by[s.u]=by[s.u]||[]).push(s));
 const unseen=l=>l.some(s=>!SEEN[s.id]),mineL=by[me.uid]||[];
 const row=(u,l)=>{const s=l[l.length-1];return `<div class="wi" data-su="${u}"><u class="av ring${unseen(l)?' new':''}" style="--h:${hue(u)}">${esc([...s.n][0]||'؟')}</u><div><b>${esc(s.n)}${s.off?' <i class="vf">✔</i>':''}</b><span>${ago(s.t)} · ${l.length} حالة</span></div></div>`};
 const ot=Object.entries(by).filter(([u])=>u!=me.uid),off=ot.filter(([,l])=>l[0].off),
  ct=ot.filter(([,l])=>!l[0].off&&l.some(s=>(s.to||[]).includes(me.uid))),wd=ot.filter(([,l])=>!l[0].off&&!l.some(s=>(s.to||[]).includes(me.uid)));
 const fol=U.follow||[],all=Object.values(CH).sort((a,b)=>(b.off?1:0)-(a.off?1:0)||(b.fc||0)-(a.fc||0));
 const chr=(c,f)=>`<div class="wi" data-ch="${c.id}"><u class="av" style="--h:${hue(c.id)}">${esc([...c.nm][0]||'؟')}</u><div><b>${esc(c.nm)}${VFB(c)}</b><span>${c.fc||0} متابع · ${esc(c.ds||'')}</span></div>${c.o==me.uid?`<button data-cp="${c.id}" class="pri">＋ منشور</button>`:`<button data-fo="${c.id}" class="${f?'':'pri'}">${f?'متابَع':'تابع'}</button>`}</div>`;
 $('#oth').innerHTML=`<div class="wi" data-su="${me.uid}"><u class="av ring plb${unseen(mineL)&&mineL.length?' new':''}" style="--h:${hue(me.uid)}" data-sn="1">${esc([...nm()][0]||'؟')}</u><div><b>حالتي</b><span>${mineL.length?mineL.length+' حالة · '+ago(mineL[mineL.length-1].t):'اضغط على + عشان تنزّل حالة'}</span></div></div>
 ${off.length?'<div class="up-h"><h4>الحساب الرسمي</h4></div>'+off.map(([u,l])=>row(u,l)).join(''):''}
 ${ct.length?'<div class="up-h"><h4>تحديثات أصحابك</h4></div>'+ct.map(([u,l])=>row(u,l)).join(''):''}
 ${wd.length?'<div class="up-h"><h4>🌍 حالات من العالم</h4></div>'+wd.map(([u,l])=>row(u,l)).join(''):''}
 ${!ot.length&&!mineL.length?'<p class="es">مفيش حالات لسه. كن أول واحد 🙂</p>':''}
 <div class="up-h"><h4>القنوات</h4><button data-nc="1">＋ قناة</button></div>
 ${all.filter(c=>fol.includes(c.id)||c.off||c.o==me.uid).map(c=>chr(c,fol.includes(c.id))).join('')}
 ${all.filter(c=>!fol.includes(c.id)&&!c.off&&c.o!=me.uid).length?'<div class="up-h"><h4>اكتشف قنوات</h4></div>'+all.filter(c=>!fol.includes(c.id)&&!c.off&&c.o!=me.uid).map(c=>chr(c,0)).join(''):''}`}

$('#oth').addEventListener('click',e=>{if(tab!='up'&&tab!='find')return;const d=e.target.dataset,w=e.target.closest('[data-su]');
 if(d.fo){e.stopPropagation();const f=(U.follow||[]).includes(d.fo);
  toggleFollow(d.fo).catch(()=>toast('مقدرتش. اتأكد إن القواعد الجديدة اتنشرت'));return}
 if(d.cp){e.stopPropagation();return newPost(d.cp)}
 if(d.sn){e.stopPropagation();return newStory()}
 if(d.nc)return newChannel();
 const c=e.target.closest('[data-ch]');if(c)return openCh(c.dataset.ch);
 if(w){const u=w.dataset.su;(u==me.uid&&!(live().some(s=>s.u==u)))?newStory():openStory(u)}});

/* ---------- حالة جديدة ---------- */
function newStory(){
 let kind='t',bg=0,im=null;
 sheet(`<h3>حالة جديدة</h3><div class="tb"><button data-sk="t" class="on">✍️ نص</button><button data-sk="i">🖼 صورة</button></div><div class="sp" id="sp" style="background:${BG[0]}"><textarea id="stx" rows="4" maxlength="200" placeholder="اكتب حالتك..."></textarea></div><div class="gr bgs" id="bgs">${BG.map((b,i)=>`<i data-bg="${i}" style="background:${b}">.</i>`).join('')}</div>
 <select id="svs" style="padding:12px;border-radius:14px;background:#0a0f2c;color:#eef1ff;border:1px solid var(--ln)"><option value="c">👥 جهات اتصالي بس</option><option value="p">🌍 العالم كله</option></select>${U.sid==OFFICIAL?'<p class="mu">حسابك الرسمي: كل حالاتك بتظهر للعالم كله باسم The Squad ✔</p>':''}<input type="file" id="sfi" accept="image/*" hidden><button class="pri" id="spost">نشر</button>`);
 $('#svs').value=(U.pv||{}).st||'c';
 const sp=$('#sp'),tx=$('#stx'),setK=k=>{kind=k;document.querySelectorAll('[data-sk]').forEach(b=>b.classList.toggle('on',b.dataset.sk==k));$('#bgs').hidden=k=='i';
  sp.querySelector('img')&&sp.querySelector('img').remove();if(k=='i'&&im)sp.insertAdjacentHTML('afterbegin',`<img src="${im}">`);sp.style.background=k=='t'?BG[bg]:'#000';tx.placeholder=k=='t'?'اكتب حالتك...':'اكتب تعليق (اختياري)'};
 document.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>b.dataset.sk=='i'?$('#sfi').click():(im=null,setK('t')));
 $('#sfi').onchange=e=>{const f=e.target.files[0];if(f)shrink(f,900,d=>{im=d;setK('i')})};
 $('#bgs').onclick=e=>{if(e.target.dataset.bg){bg=+e.target.dataset.bg;if(kind=='t')sp.style.background=BG[bg]}};
 $('#spost').onclick=async()=>{const t=tx.value.trim();if(kind=='t'&&!t)return toast('اكتب حاجة الأول');if(kind=='i'&&!im)return toast('اختار صورة');
  const off=U.sid==OFFICIAL,to=[...new Set(Object.values(C).filter(c=>c.type=='p').map(c=>c.members.find(x=>x!=me.uid)))].slice(0,200);
  const o={u:me.uid,n:off?'The Squad':nm(),k:kind,tx:t,bg:kind=='t'?bg:0,vis:off?'p':$('#svs').value,to,t:FV.serverTimestamp(),exp:Date.now()+864e5};
  if(kind=='i')o.im=im;if(off)o.off=true;
  $('#spost').disabled=true;
  try{await db.collection('stories').add(o);closeSh();toast('اتنشرت ✅')}catch(e){toast('مقدرتش أنشر الحالة');$('#spost').disabled=false}}}

/* ---------- عارض الحالات ---------- */
let svL=[],svI=0;
function openStory(u){svL=live().filter(s=>s.u==u);if(!svL.length)return;const k=svL.findIndex(s=>!SEEN[s.id]);svI=k<0?0:k;
 if(!$('#sv')){document.body.insertAdjacentHTML('beforeend','<div id="sv"></div>');$('#sv').onclick=svClick;
  $('#sv').addEventListener('animationend',e=>e.target.tagName=='B'&&svNext());
  ['pointerdown','pointerup','pointerleave'].forEach(ev=>$('#sv').addEventListener(ev,e=>{if(e.target.closest('.bd'))$('#sv').classList.toggle('hold',ev=='pointerdown')}))}
 $('#sv').hidden=false;svShow()}
function svShow(){const s=svL[svI],mine=s.u==me.uid;SEEN[s.id]=1;localStorage.seen=JSON.stringify(Object.fromEntries(Object.keys(SEEN).slice(-300).map(k=>[k,1])));
 if(!mine)db.doc(`stories/${s.id}/views/${me.uid}`).set({n:nm(),t:FV.serverTimestamp()},{merge:true}).catch(()=>{});
 $('#sv').className='';
 $('#sv').innerHTML=`<div class="pb">${svL.map((x,k)=>`<i class="${k<svI?'d':k==svI?'a':''}"><b></b></i>`).join('')}</div>
 <div class="hd"><button class="ic" data-x="c">✕</button><u class="av" style="--h:${hue(s.u)}">${esc([...s.n][0]||'؟')}</u><b>${esc(s.n)}${s.off?' <i class="vf">✔</i>':''}</b><small>${ago(s.t)}</small></div>
 <div class="bd" data-x="t" style="background:${s.k=='t'?BG[s.bg||0]:'#000'}">${s.k=='i'?`<img src="${esc(s.im)}">`:''}${s.tx?`<p class="${s.k=='i'?'cap':''}">${esc(s.tx)}</p>`:''}</div>
 <div class="ft">${mine?`<button data-x="v">👁 مين شاف الحالة</button><button data-x="del">🗑 مسح</button>`:['❤️','😂','🔥','👍','😮'].map(e=>`<i data-x="r" data-e="${e}">${e}</i>`).join('')+'<input id="srp" placeholder="رد على الحالة..." maxlength="200"><button data-x="s" class="pri">إرسال</button>'}</div>`;
 if(tab=='up')viewUp()}
function svNext(){if(svI<svL.length-1){svI++;svShow()}else svClose()}
function svClose(){$('#sv')&&($('#sv').hidden=true,$('#sv').innerHTML='')}
async function svClick(e){const x=e.target.closest('[data-x]');if(!x)return;const k=x.dataset.x,s=svL[svI];
 if(k=='c')return svClose();
 if(k=='t'){const r=$('#sv').getBoundingClientRect();return e.clientX<r.left+r.width/2?svNext():(svI>0?(svI--,svShow()):svShow())}
 if(k=='r'){db.doc(`stories/${s.id}/views/${me.uid}`).set({n:nm(),t:FV.serverTimestamp(),r:x.dataset.e},{merge:true}).then(()=>toast('وصل تفاعلك '+x.dataset.e)).catch(()=>{})}
 if(k=='s'){const v=$('#srp').value.trim();if(!v)return;await db.doc(`stories/${s.id}/views/${me.uid}`).set({n:nm(),t:FV.serverTimestamp(),rp:v},{merge:true}).catch(()=>{});$('#srp').value='';toast('اتبعت الرد ✅')}
 if(k=='del'){if(!await SquadDialog.confirm('تمسح الحالة؟'))return;await db.doc('stories/'+s.id).delete().catch(()=>{});delete sa[s.id];delete ST[s.id];svL.splice(svI,1);if(!svL.length)return svClose();svI=Math.min(svI,svL.length-1);svShow()}
 if(k=='v'){const q=await db.collection(`stories/${s.id}/views`).get().catch(()=>null);
  sheet(`<h3>👁 ${q?q.size:0} مشاهدة</h3>`+(q?q.docs.map(d=>{const v=d.data();return `<div class="mc"><b>${esc(v.n)} ${v.r||''}</b>${v.rp?`<p>${esc(v.rp)}</p>`:''}</div>`}).join(''):'')||'<p class="mu">لسه محدش شاف</p>')}}

/* ---------- القنوات ---------- */
function newChannel(){sheet(`<h3>📢 قناة جديدة</h3><input id="cn" maxlength="40" placeholder="اسم القناة"><input id="cd" maxlength="120" placeholder="وصف قصير"><button class="pri" id="cmk">إنشاء</button>`);
 $('#cmk').onclick=async()=>{const n=$('#cn').value.trim();if(!n)return toast('اكتب اسم القناة');
  try{const r=await db.collection('channels').add({nm:n,ds:$('#cd').value.trim(),o:me.uid,on:nm(),fc:0,t:FV.serverTimestamp()});
   closeSh();openCh(r.id)}catch(e){toast('مقدرتش أعمل القناة')}}}
function openCh(id){const c=CH[id];if(!c)return;unCh&&unCh();const own=c.o==me.uid;
 sheet(`<h3>${esc(c.nm)}${VFB(c)}</h3><p class="mu">${esc(c.ds||'')} · ${c.fc||0} متابع</p>${own?`<textarea id="chtx" rows="3" maxlength="1500" placeholder="اكتب منشور للمتابعين..." style="width:100%;border-radius:16px;padding:12px;background:#0a0f2c;color:#eef1ff;border:1px solid var(--ln)"></textarea><input type="file" id="chfi" accept="image/*" hidden><div class="row"><button id="chph">🖼 صورة</button><button class="pri" id="chpost">نشر</button></div>`:''}<div id="chp" style="display:grid;gap:8px"></div>`);
 unCh=db.collection(`channels/${id}/posts`).orderBy('t','desc').limit(30).onSnapshot(s=>{const el=$('#chp');if(!el)return;
  el.innerHTML=s.docs.map(d=>{const p=d.data();return `<div class="mc">${p.im?`<img src="${esc(p.im)}">`:''}${p.tx?`<p>${esc(p.tx)}</p>`:''}<small>${p.t?fmt(p.t):'⏳'}</small>${own?`<button data-cd="${d.id}" data-cc="${id}">🗑 مسح</button>`:''}</div>`}).join('')||'<p class="mu">لسه مفيش منشورات</p>'},()=>{});
 if(own){let im=null;$('#chph').onclick=()=>$('#chfi').click();$('#chfi').onchange=e=>{const f=e.target.files[0];f&&shrink(f,900,d=>{im=d;$('#chph').textContent='✅ صورة'})};
  $('#chpost').onclick=async()=>{const t=$('#chtx').value.trim();if(!t&&!im)return;const o={t:FV.serverTimestamp()};if(t)o.tx=t;if(im)o.im=im;
   await db.collection(`channels/${id}/posts`).add(o).then(()=>{$('#chtx').value='';im=null;$('#chph').textContent='🖼 صورة'}).catch(()=>toast('مقدرتش أنشر'))}}}
$('#sh').addEventListener('click',e=>{const d=e.target.dataset;if(d.cd)db.doc(`channels/${d.cc}/posts/${d.cd}`).delete().catch(()=>toast('مقدرتش أمسح'))});

function newPost(id){let im=null;sheet(`<h3>📢 منشور جديد</h3><textarea id="npt" rows="4" maxlength="1500" placeholder="اكتب المنشور..." style="width:100%;border-radius:16px;padding:12px;background:#0a0f2c;color:#eef1ff;border:1px solid var(--ln)"></textarea><input type="file" id="npf" accept="image/*" hidden><div class="row"><button id="npi">🖼 صورة</button><button class="pri" id="npp">نشر</button></div>`);
 $('#npi').onclick=()=>$('#npf').click();$('#npf').onchange=e=>{const f=e.target.files[0];f&&shrink(f,900,d=>{im=d;$('#npi').textContent='✅ صورة'})};
 $('#npp').onclick=async()=>{const t=$('#npt').value.trim();if(!t&&!im)return toast('اكتب حاجة الأول');const o={t:FV.serverTimestamp()};if(t)o.tx=t;if(im)o.im=im;$('#npp').disabled=true;
  try{await db.collection(`channels/${id}/posts`).add(o);closeSh();toast('اتنشر ✅')}catch(e){$('#npp').disabled=false;toast('مقدرتش أنشر. اتأكد إن القواعد اتنشرت')}}}
