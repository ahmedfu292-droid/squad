/* The Squad v29 — سينما الدور الثالث: فيلم متزامن للكل، مكتبة أفلام محفوظة، رفع فيلم، و«شغّل لنفسي».
   الحالة في world/{room}/cinema/state، المكتبة في world/{room}/movies، والملفات في Firebase Storage (cinema/{room}/{uid}/...).
   الفيديو بيتعرض على شاشة السينما في الغرفة 3D (VideoTexture)، ولو الجهاز/السيرفر مش مسمّح بكده بيتحوّل تلقائي لملء الشاشة. */
(()=>{
const $c=s=>document.querySelector(s),MOBC=/Android|iPhone|iPad|Mobi/i.test(navigator.userAgent);
let ROOM='main',on=0,lvl=0,S=null,mode='sync',solo=null,vid=null,vtex=null,skew=0,cur='',full=0,texOK=1,retried=0,unS=null,unM=null,movies=[],lastChk=0,busy=0,hint='';
const FULL='position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;z-index:4;',HIDE='position:absolute;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none;';
document.head.insertAdjacentHTML('beforeend',`<style>
#wcinb{position:absolute;bottom:calc(34% + 52px);left:50%;transform:translateX(-50%);z-index:3;padding:10px 18px;border-radius:14px;border:1px solid rgba(255,58,90,.5);background:rgba(40,8,16,.82);backdrop-filter:blur(10px);color:#fff;font:800 14px Cairo,sans-serif;cursor:pointer}#wcinb[hidden]{display:none}
#wcin{position:absolute;top:calc(58px + env(safe-area-inset-top,0px));inset-inline-end:10px;width:min(370px,calc(100% - 20px));max-height:calc(100% - 130px);overflow:auto;z-index:8;padding:12px;border-radius:18px;background:rgba(14,8,18,.93);backdrop-filter:blur(14px);border:1px solid rgba(255,58,90,.35);color:#eaf6ff;font-family:Cairo,sans-serif;direction:rtl;display:flex;flex-direction:column;gap:8px}#wcin[hidden]{display:none}
#wcin h4{margin:0;display:flex;justify-content:space-between;align-items:center;font-size:16px}
#wcin button{padding:8px 11px;border-radius:11px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.09);color:#fff;font:700 13px Cairo,sans-serif;cursor:pointer}
#wcin input[type=text],#wcin input:not([type]){border-radius:10px;padding:8px 10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#fff;font:13px Cairo,sans-serif;width:100%;box-sizing:border-box}
#wcin .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}#wcin .sec{display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:12px;background:rgba(255,255,255,.05)}
#wcnow{font-size:13.5px;line-height:1.6;color:#ffd9de}#wce{color:#ff8a8a;font-size:12.5px;min-height:15px}#wcpr{height:6px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}#wcpr i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ff3a5a,#ffb870)}
#wcl .mv{display:flex;flex-direction:column;gap:5px;padding:8px;border-radius:10px;background:rgba(255,255,255,.06);margin-top:6px}#wcl .mv b{font-size:13.5px}#wcl .mv small{color:#9fb0d8}
#wcinv{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));inset-inline:10px;z-index:7;display:flex;gap:8px;justify-content:center}#wcinv[hidden]{display:none}#wcinv button{padding:9px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:rgba(10,14,30,.78);color:#fff;font:700 14px Cairo,sans-serif}
</style>`);
document.body.insertAdjacentHTML('beforeend','');
const root=$c('#world');
root.insertAdjacentHTML('beforeend',`<button id="wcinb" hidden>🎬 السينما</button>
<div id="wcinv" hidden><button id="wcvp">⏯</button><button id="wcvx">✕ رجوع للغرفة</button></div>
<div id="wcin" hidden>
 <h4><span>🍿 سينما The Squad</span><button id="wcx">✕</button></h4>
 <div id="wcnow">مفيش فيلم شغّال دلوقتي</div>
 <div class="row"><button id="wcb1">⏪ 10</button><button id="wcpp">⏯ شغّل / وقّف</button><button id="wcb2">10 ⏩</button><button id="wcfs">⛶ ملء الشاشة</button><button id="wcst">⏹ إيقاف للكل</button><button id="wcmd" hidden>👥 ارجع أتفرج مع الكل</button></div>
 <div class="row">🔊 <input id="wcvol" type="range" min="0" max="1" step="0.05" value="1" style="flex:1"></div>
 <div class="sec"><b>➕ أضف فيلم برابط مباشر (https)</b><input id="wct" maxlength="80" placeholder="اسم الفيلم"><input id="wcurl" dir="ltr" maxlength="1500" placeholder="https://.../film.mp4"><div class="row"><button id="wcua">إضافة للمكتبة</button></div></div>
 <div class="sec"><b>⬆️ ارفع فيلم من جهازك</b><input id="wcf" type="file" accept="video/*"><div class="row"><button id="wcu">ارفع للمكتبة (للكل)</button><button id="wclo">شغّله لنفسي بس (من غير رفع)</button></div><div id="wcpr" hidden><i></i></div></div>
 <div id="wce"></div>
 <div class="sec"><b>🎞 مكتبة الأفلام</b><div id="wcl"></div></div>
</div>`);
const path=d=>`world/${ROOM}/${d}`,sDoc=()=>db.doc(path('cinema/state'));
const err=m=>{$c('#wce').textContent=m||'';if(m&&typeof toast=='function'&&0)toast(m)};
const fmt=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const sMs=d=>d&&d.t&&d.t.toMillis?d.t.toMillis():Date.now();
function expPos(){if(!S)return 0;return S.pl?S.pos+Math.max(0,(Date.now()+skew-sMs(S))/1000):S.pos}
function wantPlay(){return on&&(lvl==2||full)}
/* ---------- الفيديو والتكستشر ---------- */
function ensureVid(){if(vid)return vid;vid=document.createElement('video');vid.playsInline=true;vid.setAttribute('playsinline','');vid.preload='auto';vid.style.cssText=HIDE;vid.volume=+$c('#wcvol').value;
 vid.addEventListener('loadeddata',()=>{bindTex();sync(1)});
 vid.addEventListener('error',()=>{if(!cur)return;if(vid.crossOrigin&&!retried){retried=1;texOK=0;const u=cur;vid.removeAttribute('crossorigin');vid.src=u;vid.load();return}err('مقدرتش أشغّل الفيلم ده (الرابط مش فيديو أو مش بيسمح بالتشغيل).')});
 vid.addEventListener('ended',()=>{if(mode=='sync'&&S&&S.u==me.uid&&S.pl)writeState({ti:S.ti,url:S.url,pl:false,pos:0})});
 root.append(vid);return vid}
function bindTex(){const SQ=window.SQ3;if(!SQ||!SQ.screen||!texOK||!vid)return;try{if(!vtex){vtex=new SQ.THREE.VideoTexture(vid);vtex.minFilter=SQ.THREE.LinearFilter;vtex.magFilter=SQ.THREE.LinearFilter;vtex.format=SQ.THREE.RGBFormat}SQ.screen.material.map=vtex;SQ.screen.material.needsUpdate=true}catch(e){texOK=0;console.error(e)}}
function unbindTex(){const SQ=window.SQ3;if(SQ&&SQ.screen&&SQ.idle){try{SQ.screen.material.map=SQ.idle;SQ.screen.material.needsUpdate=true}catch(e){}}}
function setFull(o){full=o;$c('#wcinv').hidden=!o;if(vid)vid.style.cssText=o?FULL:HIDE;if(!o)render();else sync(1)}
function load(url){const v=ensureVid();if(cur==url)return;cur=url;retried=0;texOK=!/^blob:/.test(url)?texOK:texOK;if(!/^blob:/.test(url))v.crossOrigin='anonymous';else v.removeAttribute('crossorigin');v.src=url;v.load();if(vtex){vtex.dispose&&vtex.dispose();vtex=null}}
function unload(){if(!vid||!cur)return;try{vid.pause()}catch(e){}vid.removeAttribute('src');vid.load();cur='';unbindTex();if(vtex){vtex.dispose&&vtex.dispose();vtex=null}}
function curTarget(){return mode=='solo'&&solo?{url:solo.url,pl:true,pos:0,solo:1}:S&&S.url?S:null}
/* مزامنة الفيديو مع الحالة */
function sync(force){if(!on)return;const T=curTarget();if(!T||!wantPlay()){if(vid&&cur&&!vid.paused)vid.pause();if(!T)unload();return}
 load(T.url);if(!vid||vid.readyState<1)return;
 if(T.solo){if(vid.paused&&!vid.ended)vid.play().catch(()=>{hint='اضغط «شغّل» عشان الفيلم يبدأ';render()});return}
 const e=expPos();if(T.pl){if(Math.abs(vid.currentTime-e)>(force?.4:1.5))try{vid.currentTime=e}catch(_){}if(vid.paused)vid.play().then(()=>{hint='';render()}).catch(()=>{hint='المتصفح منع التشغيل التلقائي: اضغط «شغّل / وقّف»';render()})}
 else{if(!vid.paused)vid.pause();if(Math.abs(vid.currentTime-S.pos)>.4)try{vid.currentTime=S.pos}catch(_){}}}
/* ---------- الكتابة ---------- */
function writeState(o){return sDoc().set({u:me.uid,n:nm().slice(0,40),ti:String(o.ti||'').slice(0,80),url:o.url||'',pl:!!o.pl,pos:Math.max(0,Math.min(99999,+o.pos||0)),t:FV.serverTimestamp()}).catch(()=>err('مقدرتش أغيّر حالة السينما. انشر قواعد Firebase الجديدة (v29).'))}
function measureSkew(){const a=Date.now();db.doc(path('cinema/clk_'+me.uid)).set({t:FV.serverTimestamp()}).then(()=>db.doc(path('cinema/clk_'+me.uid)).get()).then(d=>{const x=d.data(),b=Date.now();if(x&&x.t&&x.t.toMillis)skew=x.t.toMillis()-(a+b)/2}).catch(()=>{})}
/* ---------- الواجهة ---------- */
function render(){if(!on)return;const nowEl=$c('#wcnow');let h='';
 if(mode=='solo'&&solo)h=`👤 بتتفرج لنفسك: <b>${esc(solo.ti)}</b>`;else if(S&&S.url)h=`${S.pl?'▶':'⏸'} <b>${esc(S.ti||'فيلم')}</b> — شغّله ${esc(S.n||'عضو')} · ${fmt(expPos())}`;else h='مفيش فيلم شغّال دلوقتي';
 nowEl.innerHTML=h+(hint?`<br><small>${esc(hint)}</small>`:'');$c('#wcmd').hidden=mode!='solo';
 const mine=m=>m.u==me.uid;$c('#wcl').innerHTML=movies.length?movies.map(m=>`<div class="mv"><b>${esc(m.ti)}</b><small>رفعه ${esc(m.n||'عضو')}${m.sz?' · '+(m.sz/1048576).toFixed(0)+' MB':''}</small><div class="row"><button data-a="all" data-id="${m.id}">▶ شغّل للكل</button><button data-a="me" data-id="${m.id}">👤 لنفسي</button>${mine(m)?`<button data-a="del" data-id="${m.id}">🗑 حذف</button>`:''}</div></div>`).join(''):'<small>المكتبة فاضية. أضف رابط أو ارفع فيلم.</small>'}
function sub(){unS=sDoc().onSnapshot(d=>{S=d.exists?d.data():null;render();sync(1)},()=>{});
 unM=db.collection(path('movies')).onSnapshot(s=>{const a=[];s.forEach(d=>a.push({id:d.id,...d.data()}));a.sort((x,y)=>sMs(y)-sMs(x));movies=a;render()},()=>{})}
function playAll(m){writeState({ti:m.ti,url:m.url,pl:true,pos:0});mode='sync';solo=null;render()}
function playMe(url,ti){mode='solo';solo={url,ti};load(url);hint='';render();sync(1)}
function stopLocal(){mode='sync';solo=null;hint='';if(S&&S.url)load(S.url);else unload();render();sync(1)}
$c('#wcl').addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(!b)return;const m=movies.find(x=>x.id==b.dataset.id);if(!m)return;err('');
 if(b.dataset.a=='all')playAll(m);else if(b.dataset.a=='me')playMe(m.url,m.ti);else if(b.dataset.a=='del'){if(!confirm('تحذف «'+m.ti+'» من المكتبة؟'))return;
  db.doc(path('movies/'+m.id)).delete().then(()=>{if(m.sp&&window.firebase&&firebase.storage){try{firebase.storage().ref(m.sp).delete().catch(()=>{})}catch(_){}}}).catch(()=>err('مقدرتش أحذف الفيلم'))}});
function openP(o){$c('#wcin').hidden=!o;if(o){render();err('')}}
$c('#wcinb').onclick=()=>openP($c('#wcin').hidden);$c('#wcx').onclick=()=>openP(0);
$c('#wcvx').onclick=()=>setFull(0);$c('#wcfs').onclick=()=>{openP(0);setFull(1)};
$c('#wcvp').onclick=()=>ctlPlay();
function ctlPlay(){if(!vid)return;if(mode=='solo'){vid.paused?vid.play():vid.pause();return}
 if(!S||!S.url)return;if(S.pl&&vid.paused){vid.play().then(()=>{hint='';render()}).catch(()=>{});return}
 const p=expPos();writeState({ti:S.ti,url:S.url,pl:!S.pl,pos:p})}
$c('#wcpp').onclick=ctlPlay;
function seek(d){if(mode=='solo'&&vid){vid.currentTime=Math.max(0,vid.currentTime+d);return}if(!S||!S.url)return;writeState({ti:S.ti,url:S.url,pl:S.pl,pos:Math.max(0,expPos()+d)})}
$c('#wcb1').onclick=()=>seek(-10);$c('#wcb2').onclick=()=>seek(10);
$c('#wcst').onclick=()=>{if(mode=='solo'){stopLocal();return}if(S&&S.url)writeState({ti:'',url:'',pl:false,pos:0})};
$c('#wcmd').onclick=()=>{if(mode=='solo')stopLocal()};
$c('#wcvol').oninput=e=>{if(vid)vid.volume=+e.target.value};
$c('#wcua').onclick=()=>{err('');const ti=$c('#wct').value.trim(),url=$c('#wcurl').value.trim();
 if(!/^https:\/\//i.test(url)){err('الرابط لازم يبدأ بـ https:// (فيديو مباشر مثل mp4). روابط يوتيوب مش بتشتغل هنا.');return}
 const t2=ti||decodeURIComponent((url.split('?')[0].split('/').pop()||'فيلم').replace(/\.[^.]+$/,'')).slice(0,80)||'فيلم';
 db.collection(path('movies')).add({u:me.uid,n:nm().slice(0,40),ti:t2.slice(0,80),url:url.slice(0,1500),t:FV.serverTimestamp()}).then(()=>{$c('#wct').value='';$c('#wcurl').value=''}).catch(()=>err('مقدرتش أضيف الفيلم. انشر قواعد Firebase الجديدة (v29).'))};
function fileOK(){const f=$c('#wcf').files&&$c('#wcf').files[0];if(!f){err('اختار ملف فيديو الأول');return null}if(!/^video\//.test(f.type||'')){err('الملف لازم يكون فيديو (mp4 مثلًا)');return null}return f}
$c('#wclo').onclick=()=>{err('');const f=fileOK();if(!f)return;playMe(URL.createObjectURL(f),f.name.replace(/\.[^.]+$/,''))};
function ensureStorage(cb){if(window.firebase&&firebase.storage)return cb(1);const s=document.createElement('script');s.src='https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js';s.onload=()=>cb(!!(firebase.storage));s.onerror=()=>cb(0);document.head.append(s)}
$c('#wcu').onclick=()=>{err('');if(busy)return;const f=fileOK();if(!f)return;if(f.size>1500*1024*1024){err('الملف أكبر من 1.5 جيجا');return}
 const ti=($c('#wct').value.trim()||f.name.replace(/\.[^.]+$/,'')).slice(0,80);busy=1;$c('#wcu').disabled=true;const pr=$c('#wcpr');pr.hidden=false;pr.firstElementChild.style.width='0';
 const done=m=>{busy=0;$c('#wcu').disabled=false;pr.hidden=true;if(m)err(m)};
 ensureStorage(ok=>{if(!ok)return done('مقدرتش أحمّل Firebase Storage. اتأكد من النت.');
  const p=`cinema/${ROOM}/${me.uid}/${Date.now()}_${f.name.replace(/[^\w.\-]+/g,'_').slice(-60)}`;let task;try{task=firebase.storage().ref(p).put(f,{contentType:f.type})}catch(e){return done('Storage مش متفعّل في مشروعك: '+(e&&e.message||e))}
  task.on('state_changed',s=>{pr.firstElementChild.style.width=Math.round(s.bytesTransferred/s.totalBytes*100)+'%'},e=>done('فشل الرفع: '+((e&&e.code)||e)+' (اتأكد من تفعيل Storage ونشر storage.rules)'),()=>{
   task.snapshot.ref.getDownloadURL().then(url=>db.collection(path('movies')).add({u:me.uid,n:nm().slice(0,40),ti,url,sp:p,sz:f.size,t:FV.serverTimestamp()})).then(()=>{done();$c('#wct').value='';$c('#wcf').value=''}).catch(e=>done('الملف اترفع بس مقدرتش أسجّله في المكتبة: '+((e&&e.code)||e)))})})};
/* ---------- دورة الحياة ---------- */
window.CINEMA={
 enter(room){ROOM=room||'main';on=1;S=null;mode='sync';solo=null;movies=[];skew=0;full=0;hint='';ensureVid();measureSkew();sub();render()},
 leave(){on=0;unS&&unS();unM&&unM();unS=unM=null;openP(0);setFull(0);$c('#wcinb').hidden=true;try{unload()}catch(e){}if(vid){vid.remove();vid=null}cur='';S=null;solo=null;mode='sync';lvl=0},
 tick(P,t){if(!on)return;const nl=P.lv;if(nl!=lvl){const was=lvl;lvl=nl;$c('#wcinb').hidden=lvl!=2;if(lvl==2){if(S&&S.url&&S.pl)hint='فيه فيلم شغّال — بيتعرض على الشاشة الكبيرة';render();sync(1)}else if(was==2){openP(0);if(vid&&!vid.paused&&!full)vid.pause()}}
  if(t-lastChk>1500){lastChk=t;if(lvl==2||full){sync(0);if(!$c('#wcin').hidden)render()}}
  if(vtex&&vid&&vid.readyState>=2)vtex.needsUpdate=true},
 dbg(){return{on,mode,cur,exp:expPos(),lvl,full,tex:texOK,S}}};
})();
