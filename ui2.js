/* The Squad — ui2: الشريط الرئيسي (شات / تحديثات / العروض / مكالمات)، شاشة العروض (إعلانات + ChatGPT/Gemini)، اختيار الصور بمعاينة،
   اكتشاف وإدارة القنوات، إحصائيات المكالمات، الإعلانات. بيتحمّل آخر ملف (بعد settings.js).
   مبني فوق الملفات الحالية (بيغلّف الدوال بدل ما يعيد كتابتها) وما بيمسحش ولا بيعطّل أي ميزة قديمة. */
(()=>{
const $$=s=>[...document.querySelectorAll(s)];
IC.ai='M12 3l1.9 5.4L19.5 10l-5.6 1.7L12 17.5l-1.9-5.8L4.5 10l5.6-1.6zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z';
IC.phone2='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z';

/* ================= 1) الشريط الرئيسي: 4 شاشات ================= */
const nav=$('#nav'),btn=k=>nav.querySelector(`[data-go=${k}]`);
const L={home:'الرسائل',up:'الحالات',calls:'المكالمات'};
['home','up','calls'].forEach(k=>{const b=btn(k);if(b){b.lastChild.textContent=L[k];}});
['find','me'].forEach(k=>{const b=btn(k);b&&(b.hidden=false)});
$('#gear').title='الإعدادات';$('#plus').title='استكشاف';
const go0=go;go=function(t){if(t==='ai')return go0('find');return go0(t)};
function badge(){const b=btn('home');if(!b||typeof me=='undefined'||!me)return;const m=U.mute||[],a=U.arch||[];const n=Object.values(C).reduce((s,c)=>s+((U.hiddenChats||[]).includes(c.id)||m.includes(c.id)||a.includes(c.id)?0:((c.un||{})[me.uid]||0)),0);let e=b.querySelector('.nb');if(!n){e&&e.remove();return}e||(e=document.createElement('b'),e.className='nb',b.appendChild(e));e.textContent=n>99?'99+':n;['#dr-unread','#dr-top-count'].forEach(sel=>{const x=$(sel);if(x){x.textContent=n>99?'99+':n;x.hidden=!n}})}
const rh0=renderHome;renderHome=function(){rh0();badge()};
/* ================= 3) هيدر الشات: قايمة ⋮ فيها المعرض والألعاب والبحث والحظر ================= */
const MI=[['gal','🖼','معرض صور المحادثة'],['msr','🔍','بحث في المحادثة'],['gm','🎮','ألعاب'],['blk','⚠️','حظر وإبلاغ']];
const addMenu=()=>{const box=$('#sh .box');if(!C[cid]||!box||box.querySelector('[data-u2m]'))return;
 box.insertAdjacentHTML('beforeend',MI.filter(([id])=>document.getElementById(id)).map(([id,i,t])=>`<button class="u2m" data-u2m="${id}"><span>${i}</span><b>${t}</b></button>`).join(''))};
['#mn','#ct'].forEach(s=>$(s).addEventListener('click',addMenu));
$('#sh').addEventListener('click',e=>{const b=e.target.closest('[data-u2m]');if(!b)return;const id=b.dataset.u2m;closeSh();setTimeout(()=>{const t=document.getElementById(id);t&&t.click()},60)});

/* ================= 4) الصور: اختيار من المعرض/الملفات/الكاميرا + معاينة قبل الإرسال ================= */
document.body.insertAdjacentHTML('beforeend','<input type="file" id="u2f1" accept="image/*" multiple hidden><input type="file" id="u2f2" accept="image/*" capture="environment" hidden>');
let PQ2=[];const MAXP=6;
const comp=f=>new Promise((res,rej)=>{const i=new Image(),u=URL.createObjectURL(f);
 i.onload=()=>{URL.revokeObjectURL(u);let mx=900;for(let k=0;k<5;k++){const c=document.createElement('canvas'),s=Math.min(1,mx/Math.max(i.width,i.height));c.width=Math.max(1,i.width*s);c.height=Math.max(1,i.height*s);
  c.getContext('2d').drawImage(i,0,0,c.width,c.height);let q=.72,d=c.toDataURL('image/jpeg',q);while(d.length>190000&&q>.3){q-=.1;d=c.toDataURL('image/jpeg',q)}
  if(d.length<=190000)return res(d);mx*=.75}rej()};
 i.onerror=()=>{URL.revokeObjectURL(u);rej()};i.src=u});
function picker(){sheet(`<h3>📷 إرسال صورة</h3><div class="u2sp"><button data-u2p="gal">🖼 من المعرض / الملفات</button><button data-u2p="cam">📸 كاميرا</button></div>`)}
function preview(){
 if(!PQ2.length)return picker();
 sheet(`<h3>معاينة قبل الإرسال</h3><div class="u2p u2pv ${PQ2.length==1?'u2one':''}">${PQ2.map((f,i)=>`<div><img src="${f.u}"><button data-u2p="rm" data-i="${i}" title="شيل">✕</button></div>`).join('')}</div>
 <input id="u2cap" maxlength="500" placeholder="أضف تعليق (اختياري)"><div class="u2sp" style="margin-top:10px"><button data-u2p="add"${PQ2.length>=MAXP?' disabled':''}>➕ زوّد صور</button><button class="pri" data-u2p="send">إرسال (${PQ2.length})</button></div>`)}
const clearQ=()=>{PQ2.forEach(f=>URL.revokeObjectURL(f.u));PQ2=[]};
$('#ph').onclick=()=>{if(!cid)return;clearQ();picker()};
['#u2f1','#u2f2'].forEach(s=>$(s).onchange=e=>{const fs=[...e.target.files].filter(f=>/^image\//.test(f.type));e.target.value='';
 const room=MAXP-PQ2.length;fs.slice(0,room).forEach(f=>PQ2.push({f,u:URL.createObjectURL(f)}));if(fs.length>room)toast('أقصى عدد '+MAXP+' صور');preview()});
$('#sh').addEventListener('click',async e=>{const a=e.target.dataset.u2p;if(!a)return;
 if(a=='gal')return $('#u2f1').click();if(a=='cam')return $('#u2f2').click();
 if(a=='add')return $('#u2f1').click();
 if(a=='rm'){PQ2.splice(+e.target.dataset.i,1).forEach(f=>URL.revokeObjectURL(f.u));return preview()}
 if(a=='send'){const b=e.target,cap=($('#u2cap')||{value:''}).value.trim(),to=cid,list=PQ2.slice();if(!to||!list.length)return;
  b.disabled=true;b.textContent='بيتبعت...';let fail=0;
  for(let i=0;i<list.length;i++){try{const d=await comp(list[i].f);await send({im:d,cid:to,...(i==0&&cap?{tx:cap}:{})})}catch(x){fail++}}
  clearQ();closeSh();toast(fail?`${fail} صورة ماتبعتتش (كبيرة أو مش مدعومة)`:'اتبعتت ✅')}});
new MutationObserver(()=>{if($('#sh').hidden&&PQ2.length)clearQ()}).observe($('#sh'),{attributes:true,attributeFilter:['hidden']});
/* التعليق تحت الصورة + فتح الصورة بالحجم الكامل */
const dr0=draw;draw=function(){dr0();$$('#ms .m').forEach(el=>{const m=M[el.dataset.id];
 if(m&&m.im&&m.tx&&!m.del&&!el.querySelector('.cap')){const i=el.querySelector('img.ph');i&&i.insertAdjacentHTML('afterend',`<p class="cap">${esc(m.tx)}</p>`)}})};

/* ================= 5) القنوات: اكتشاف + تصنيفات + بحث + أغلفة ================= */
const CATS2=['الكل','أخبار','تقنية','ألعاب','رياضة','تعليم','ترفيه','عام'];let chq='',chc='';
const gcol=id=>`linear-gradient(135deg,hsl(${hue(id)} 70% 42%),hsl(${(hue(id)+55)%360} 70% 28%))`;
const cvBg=c=>c.cv&&/^data:image\//.test(c.cv)?`url('${c.cv}')`:gcol(c.id);
const chCard=(c,f)=>{const own=c.o==me.uid;
 return `<div class="u2c u2k" data-ch="${c.id}"><div class="u2cv" style="background-image:${cvBg(c)}">${c.cat?`<span class="tg">${esc(c.cat)}</span>`:''}</div><div class="av2" style="--h:${hue(c.id)}">${esc([...c.nm][0]||'؟')}</div>
 <div class="bd"><b>${esc(c.nm)}${VFB(c)}</b><p>${esc(c.ds||'')}</p><div class="ft"><span>${c.fc||0} متابع</span>${own?`<button class="pri" data-cp="${c.id}">＋ منشور</button>`:`<button data-fo="${c.id}" class="${f?'':'pri'}">${f?'متابَع ✓':'تابع'}</button>`}</div></div></div>`};
function chBody(){
 const fol=U.follow||[],q=chq.toLowerCase(),all=Object.values(CH).filter(c=>(!chc||c.cat==chc)&&(!q||(c.nm||'').toLowerCase().includes(q)||(c.ds||'').toLowerCase().includes(q)))
  .sort((a,b)=>(b.off?1:0)-(a.off?1:0)||(b.fc||0)-(a.fc||0));
 const mine=all.filter(c=>fol.includes(c.id)||c.off||c.o==me.uid),rest=all.filter(c=>!mine.includes(c));
 if(q||chc)return `<div class="u2h"><h4>النتائج</h4><small>${all.length}</small></div>`+(all.length?`<div class="u2g">${all.map(c=>chCard(c,fol.includes(c.id))).join('')}</div>`:'<p class="es">مفيش قنوات بالشكل ده.</p>');
 return (mine.length?`<div class="u2h"><h4>قنواتي ومتابعاتي</h4></div><div class="u2row">${mine.map(c=>chCard(c,fol.includes(c.id))).join('')}</div>`:'')+
  `<div class="u2h"><h4>اكتشف قنوات</h4></div>`+(rest.length?`<div class="u2g">${rest.map(c=>chCard(c,0)).join('')}</div>`:'<p class="es">لسه مفيش قنوات جديدة. اعمل أول قناة ✨</p>')}
const vu0=viewUp;viewUp=function(){
 const f=document.activeElement,keep=f&&f.id=='u2q'?f.selectionStart:-1,sc=$('#oth').scrollTop;vu0();if(tab!='up')return;
 const o=$('#oth'),nc=o.querySelector('[data-nc]'),hd=nc&&nc.closest('.up-h');
 if(hd){let n=hd;while(n){const nx=n.nextElementSibling;n.remove();n=nx}}
 o.insertAdjacentHTML('beforeend',`<div class="u2h"><h4>القنوات</h4><button data-nc="1">＋ قناة جديدة</button></div><div class="u2s"><input id="u2q" placeholder="ابحث في القنوات..." value="${esc(chq)}"></div>
  <div class="u2cats">${CATS2.map(c=>`<button data-u2c="${c=='الكل'?'':c}" class="${(c=='الكل'?'':c)==chc?'on':''}">${c}</button>`).join('')}</div><div id="u2cl">${chBody()}</div>`);
 o.scrollTop=sc;if(keep>=0){const i=$('#u2q');i&&(i.focus(),i.setSelectionRange(keep,keep))}};
$('#oth').addEventListener('input',e=>{if(e.target.id!='u2q')return;chq=e.target.value.trim();$('#u2cl').innerHTML=chBody()});
$('#oth').addEventListener('click',e=>{const c=e.target.closest('[data-u2c]');if(!c||tab!='up')return;e.stopPropagation();chc=c.dataset.u2c;
 $$('.u2cats button').forEach(b=>b.classList.toggle('on',b==c));$('#u2cl').innerHTML=chBody()},true);

/* قناة جديدة: تصنيف اختياري (بيتسجّل بعد الإنشاء مباشرة) */
const nc0=newChannel;newChannel=function(){nc0();const b=$('#cmk');if(!b)return;
 b.insertAdjacentHTML('beforebegin',`<select id="u2ct">${CATS2.slice(1).map(c=>`<option>${c}</option>`).join('')}</select>`);
 b.onclick=async()=>{const n=$('#cn').value.trim();if(!n)return toast('اكتب اسم القناة');b.disabled=true;
  try{const r=await db.collection('channels').add({nm:n,ds:$('#cd').value.trim(),o:me.uid,on:nm(),fc:0,t:FV.serverTimestamp()});
   await r.update({cat:$('#u2ct').value}).catch(()=>{});closeSh();setTimeout(()=>openCh(r.id),450)}catch(e){b.disabled=false;toast('مقدرتش أعمل القناة')}}};

/* صفحة القناة: غلاف + معلومات + إدارة المالك + معاينة صورة المنشور */
const oc0=openCh;openCh=function(id){oc0(id);decorate(id)};
function decorate(id){const v=$('#chv'),c=CH[id];if(!v||v.hidden||!c)return;
 v.querySelectorAll('.u2banner,.u2info').forEach(x=>x.remove());
 $('#chf').insertAdjacentHTML('beforebegin',`<div class="u2banner" style="background-image:${cvBg(c)}"></div><div class="u2info"><div class="av2" style="--h:${hue(id)}">${esc([...c.nm][0]||'؟')}</div><p>${esc(c.ds||'')}${c.cat?' · '+esc(c.cat):''}</p></div>`);
 const own=c.o==me.uid;
 if(own&&!$('#chmg')){$('#chsh').insertAdjacentHTML('beforebegin','<button class="ic" id="chmg" title="إدارة القناة">⚙️</button>');$('#chmg').onclick=()=>manage(id)}
 if(own){let pIm=null;const pv=()=>{const o=$('#u2pv');o&&o.remove();$('#chi').textContent=pIm?'✅':'🖼';
   pIm&&$('#chv footer').insertAdjacentHTML('beforebegin',`<div class="u2pvc" id="u2pv"><img src="${pIm}"><span class="mu" style="flex:1">معاينة الصورة قبل النشر</span><button class="ic" id="u2px" title="شيل الصورة">✕</button></div>`)};
  $('#chfi').onchange=e=>{const f=e.target.files[0];e.target.value='';f&&shrink(f,900,d=>{pIm=d;pv()})};
  $('#chv').onclick=e=>{if(e.target.id=='u2px'){pIm=null;pv()}};
  $('#chs').onclick=async()=>{const t=$('#chx').value.trim();if(!t&&!pIm)return;const o={t:FV.serverTimestamp()};t&&(o.tx=t);pIm&&(o.im=pIm);
   await db.collection(`channels/${id}/posts`).add(o).then(()=>{$('#chx').value='';pIm=null;pv()}).catch(()=>toast('مقدرتش أنشر. اتأكد إن القواعد اتنشرت'))}}}
document.addEventListener('click',e=>{const i=e.target;if(i.tagName=='IMG'&&i.closest&&i.closest('#chf'))sheet(`<img class="full" src="${esc(i.src)}">`)});
function manage(id){const c=CH[id];if(!c)return;let cv=null;
 sheet(`<h3>⚙️ إدارة القناة</h3><input id="mgn" maxlength="40" value="${esc(c.nm)}" placeholder="اسم القناة"><input id="mgd" maxlength="120" value="${esc(c.ds||'')}" placeholder="وصف قصير" style="margin-top:8px">
  <select id="mgc" style="margin-top:8px"><option value="">بدون تصنيف</option>${CATS2.slice(1).map(x=>`<option${c.cat==x?' selected':''}>${x}</option>`).join('')}</select>
  <div class="u2pvc" id="mgp">${c.cv?`<img src="${esc(c.cv)}"><span class="mu">الغلاف الحالي</span>`:''}</div><input type="file" id="mgf" accept="image/*" hidden>
  <div class="u2sp" style="margin-top:10px"><button id="mgph">🖼 صورة الغلاف</button><button class="pri" id="mgsv">حفظ</button></div>`);
 $('#mgph').onclick=()=>$('#mgf').click();
 $('#mgf').onchange=e=>{const f=e.target.files[0];f&&shrink(f,640,d=>{cv=d;$('#mgp').innerHTML=`<img src="${d}"><span class="mu">غلاف جديد (قبل الحفظ)</span>`})};
 $('#mgsv').onclick=async()=>{const n=$('#mgn').value.trim();if(!n)return toast('اكتب اسم القناة');const o={nm:n,ds:$('#mgd').value.trim(),cat:$('#mgc').value};cv&&(o.cv=cv);
  $('#mgsv').disabled=true;try{await db.doc('channels/'+id).update(o);closeSh();toast('اتحفظ ✅');setTimeout(()=>{const nb=$('#chnm');nb&&(nb.innerHTML=esc(n)+VFB(CH[id]||c));decorate(id)},500)}
  catch(e){$('#mgsv').disabled=false;toast('مقدرتش أحفظ')}}}

/* ================= 6) المكالمات: ملخّص فوق السجل (الغرفة 3D والكاميرا والمايك ما اتغيّروش) ================= */
const vc0=viewCalls;viewCalls=function(){vc0();if(tab!='calls')return;
 const n=CL.length,x=CL.filter(e=>e.x).length,s=CL.reduce((a,e)=>a+(e.d||0),0),t=s>=3600?(s/3600).toFixed(1)+' س':s>=60?(s/60|0)+' د':s+' ث';
 $('#oth').insertAdjacentHTML('afterbegin',`<div class="u2call"><div class="u2c"><b>${n}</b><small>مكالمات</small></div><div class="u2c"><b class="${x?'u2cx':''}">${x}</b><small>مرفوضة</small></div><div class="u2c"><b>${t}</b><small>إجمالي الوقت</small></div></div>`)};

/* ===== v94 Social shell: presentation layer, existing services remain intact ===== */
const drIcons={heart:'<svg viewBox="0 0 24 24"><path d="M20.5 8.8c0 5-8.5 11-8.5 11s-8.5-6-8.5-11a4.5 4.5 0 0 1 8.5-1.2 4.5 4.5 0 0 1 8.5 1.2Z"/></svg>',comment:'<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.2A2.5 2.5 0 0 1 4 14.5z"/></svg>',share:'<svg viewBox="0 0 24 24"><path d="M12 15V3m-5 5 5-5 5 5M5 13v7h14v-7"/></svg>',save:'<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg>'};
const drPosts=[{id:'p1',name:'ليلى منصور',initial:'ل',time:'منذ 12 دقيقة',text:'ليلة هادئة في المدينة… الإضاءة الذهبية والتفاصيل المعمارية بتخلي كل زاوية لها حكاية.',media:'city',likes:248,comments:32},{id:'p2',name:'عمر فؤاد',initial:'ع',time:'منذ ساعة',text:'أجمل وقت للقهوة هو لما تجمعك الصدفة بأصحابك. نشوفكم في الكافيه الليلة.',media:'cafe',likes:96,comments:14}];
let drRoute='feed',drLikes=new Set(),drSaves=new Set(),drComments={p1:[],p2:[]};
const drScreen=$('#dr-screen');
function drPost(p){return `<article class="dr-post" data-post="${p.id}"><header class="dr-post-head"><span class="dr-avatar">${p.initial}</span><div><b>${p.name}</b><small>${p.time} · عام</small></div><button class="dr-more" data-post-menu="${p.id}" aria-label="المزيد">⋯</button></header><div class="dr-post-copy">${p.text}</div><div class="dr-post-media ${p.media}"><span class="media-label">THE SQUAD · ${p.media==='city'?'CITY LIGHTS':'PRIVATE LOUNGE'}</span></div><div class="dr-post-stats"><span>${p.likes+(drLikes.has(p.id)?1:0)} إعجاب</span><span>${(p.comments||0)+((drComments[p.id]||[]).length)} تعليق</span></div><div class="dr-post-actions"><button data-like="${p.id}" class="${drLikes.has(p.id)?'active':''}">${drIcons.heart} إعجاب</button><button data-comments="${p.id}">${drIcons.comment} تعليق</button><button data-share="${p.id}">${drIcons.share} مشاركة</button><button data-save="${p.id}" class="${drSaves.has(p.id)?'active':''}">${drIcons.save} حفظ</button></div></article>`}
function drStories(){return `<div class="dr-stories"><button class="dr-story mine" data-create-story><span class="dr-story-ring"><span>＋</span></span>قصتك</button>${[['مريم','م'],['يوسف','ي'],['نور','ن'],['سارة','س']].map(([n,i])=>`<button class="dr-story" data-story="${n}"><span class="dr-story-ring"><span>${i}</span></span>${n}<small>حالة جديدة</small></button>`).join('')}</div>`}
function drRender(){if(!drScreen)return;const title={feed:['الرئيسية','أحدث ما يشاركه مجتمعك'],videos:['الفيديوهات','مقاطع قصيرة — معاينة واجهة'],explore:['استكشاف','اكتشف المساحات والأشخاص'],profile:['حسابي','ملفك الشخصي'],messages:['الرسائل','محادثاتك ومكالماتك'] ,create:['إنشاء','شارك لحظة مع مجتمعك']}[drRoute]||['الرئيسية',''];$('#dr-title').textContent=title[0];$('#dr-subtitle').textContent=title[1];
 if(drRoute==='feed'){drScreen.innerHTML=drStories()+`<div class="dr-feed"><div class="dr-empty dr-loading">جارٍ تحميل الفيد…</div></div>`;window.SquadSocial&&window.SquadSocial.startFeed();}
 else if(drRoute==='videos')drScreen.innerHTML=`<div class="dr-video-feed"><div class="dr-video-view"><div><small>THE SQUAD · VIDEO 01</small></div><div class="dr-video-actions"><button>♡</button><button data-video-comments>◯</button><button>↗</button><button>＋</button></div><div class="dr-video-caption"><b>@squad.creator</b><p>لقطة من أضواء المدينة — نموذج واجهة للفيديوهات.</p><small>المقطع تجريبي وليس فيديو منشورًا.</small></div></div><div class="dr-video-view cafe"><div><small>THE SQUAD · VIDEO 02</small></div><div class="dr-video-actions"><button>♡</button><button data-video-comments>◯</button><button>↗</button><button>＋</button></div><div class="dr-video-caption"><b>@night.coffee</b><p>تفاصيل الكافيه في أجواء المساء.</p><small>نموذج بصري ثانٍ للتنقل الرأسي.</small></div></div></div>`;
 else if(drRoute==='explore')drScreen.innerHTML=`<div class="dr-feed"><div class="dr-panel" style="padding:18px"><h3>استكشف The Squad</h3><p style="color:var(--dr-muted)">الأقسام الموجودة في المشروع</p><div class="dr-shortcut" data-hub="city"><i>⌂</i><span>المدينة المفتوحة<small>افتح عالم المدينة</small></span></div><div class="dr-shortcut" data-hub="cafe"><i>◈</i><span>الكافيه<small>ادخل الكافيه ثلاثي الأبعاد</small></span></div><div class="dr-shortcut" data-hub="cinema"><i>▣</i><span>السينما<small>افتح مساحة السينما</small></span></div><div class="dr-shortcut" data-social="messages"><i>✉</i><span>المحادثات<small>انتقل للرسائل</small></span></div></div><div class="dr-empty"><strong>استكشاف الأشخاص</strong>النتائج الحقيقية هتظهر بعد ربط الفيد الاجتماعي ببياناته.</div></div>`;
 else if(drRoute==='profile')drScreen.innerHTML=`<div class="dr-panel" style="padding:14px"><div class="dr-profile-cover"><span class="dr-profile-avatar">${(typeof U!=='undefined'&&U.name||'أ').slice(0,1)}</span></div><h2>${typeof U!=='undefined'&&U.name?esc(String(U.name)):'حسابي'}</h2><small style="color:var(--dr-muted)">ملفك على The Squad</small><div class="dr-profile-stats"><span><b>0</b>منشورات</span><span><b>0</b>متابعون</span><span><b>0</b>يتابع</span></div><div class="dr-post-actions"><button class="dr-primary">متابعة</button><button class="dr-secondary" data-social="messages">رسالة</button></div><div class="dr-post-actions"><button class="active">منشورات</button><button>فيديوهات</button><button>محفوظ</button></div><div class="dr-empty">مفيش منشورات لعرضها في المعاينة الحقيقية.</div></div>`;if(window.SquadSocial&&typeof me!=='undefined'&&me){window.SquadSocial.profileStats(me.uid).then(x=>{const n=document.querySelectorAll('.dr-profile-stats b');if(n.length===3){n[0].textContent=x.posts;n[1].textContent=x.followers;n[2].textContent=x.following}}).catch(()=>{})}
 else if(drRoute==='messages'){const list=typeof C!=='undefined'?Object.values(C).filter(c=>!(U.hiddenChats||[]).includes(c.id)).sort((a,b)=>ms(b.lt)-ms(a.lt)):[];drScreen.innerHTML=`<div class="dr-message-list"><input class="dr-field" id="dr-chat-search" placeholder="ابحث في المحادثات"><div class="s4-filterbar"><button class="on" data-chat-filter="all">الكل</button><button data-chat-filter="private">خاص</button><button data-chat-filter="groups">جروبات</button><button data-chat-filter="pinned">مثبتة</button><button data-chat-filter="archived">الأرشيف</button></div><div id="dr-chat-list">${list.map(c=>`<button class="dr-conversation" data-open-chat="${c.id}"><span class="dr-avatar">${esc((c.type=='g'?c.nm:cname(c)).slice(0,1))}</span><span><b>${esc(c.type=='g'?c.nm:cname(c))}</b><small>${esc(c.last&&c.last.tx||'ابدأ المحادثة')}</small></span><small>${(c.un||{})[me.uid]||''}</small></button>`).join('')||'<div class="dr-empty"><strong>لسه مفيش محادثات</strong>ابدأ محادثة مع أصحابك من استكشاف.</div>'}</div><button class="dr-conversation" data-open-calls><span class="dr-avatar">☎</span><span><b>المكالمات</b><small>سجل المكالمات الموجود</small></span></button></div>`;const q=$('#dr-chat-search');q&&q.addEventListener('input',()=>$$('#dr-chat-list .dr-conversation').forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q.value.toLowerCase())));}
 else if(drRoute==='create')drCreate();}
function drCreate(){drScreen.innerHTML=`<div class="dr-panel" style="padding:17px"><h3>إنشاء منشور</h3><textarea class="dr-field" id="dr-post-text" rows="5" maxlength="2000" placeholder="إيه الجديد عندك؟"></textarea><div class="dr-create-tools"><label class="dr-secondary">إضافة صور (حتى 4 صور، 2MB للصورة) <input id="dr-media" type="file" accept="image/jpeg,image/png,image/webp" multiple></label></div><input type="hidden" id="dr-privacy" value="public"><div class="dr-privacy-note">🌐 النشر متاح للكل حاليًا</div><h4>معاينة قبل النشر</h4><div class="dr-create-preview" id="dr-create-preview">هيظهر نص منشورك هنا.</div><button class="dr-primary" data-preview-post>تحديث المعاينة</button><button class="dr-secondary" data-publish-post>نشر فعلي</button><p style="color:var(--dr-muted);font-size:11px">JPEG / PNG / WebP فقط. الحد الأقصى 4 صور، 2MB للصورة.</p></div>`}
function drRouteTo(r){drRoute=r;$('#app').classList.add('social-mode');document.querySelectorAll('[data-social]').forEach(b=>b.classList.toggle('active',b.dataset.social===r));drRender()}
function drModal(html){let el=$('#dr-overlay');if(!el){document.body.insertAdjacentHTML('beforeend','<div id="dr-overlay" class="dr-modal-backdrop" hidden><div class="dr-modal"></div></div>');el=$('#dr-overlay');el.addEventListener('click',e=>{if(e.target===el)el.hidden=true})}el.querySelector('.dr-modal').innerHTML=html;el.hidden=false;return el}
window.SquadOpenModal=drModal;
window.SquadDialog={confirm:async(message)=>new Promise(resolve=>{const e=drModal(`<h3>تأكيد</h3><p>${String(message).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</p><div class="dr-modal-actions"><button class="dr-secondary" data-answer="no">إلغاء</button><button class="dr-primary" data-answer="yes">تأكيد</button></div>`);e.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{e.hidden=true;resolve(b.dataset.answer==='yes')})}),prompt:async(message,initial='')=>new Promise(resolve=>{const e=drModal(`<h3>${String(message).replace(/[&<>]/g,'')}</h3><input class="dr-field" id="dr-dialog-input" value="${String(initial).replace(/[&<>"']/g,'')}" autofocus><div class="dr-modal-actions"><button class="dr-secondary" data-answer="no">إلغاء</button><button class="dr-primary" data-answer="yes">متابعة</button></div>`);e.querySelector('input').focus();e.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{const v=e.querySelector('input').value;e.hidden=true;resolve(b.dataset.answer==='yes'?v:null)})}),alert:async(message)=>new Promise(resolve=>{const e=drModal(`<h3>تنبيه</h3><p>${String(message).replace(/[&<>]/g,'')}</p><div class="dr-modal-actions"><button class="dr-primary" data-answer="yes">حسنًا</button></div>`);e.querySelector('[data-answer]').onclick=()=>{e.hidden=true;resolve()}})};
$('#app').addEventListener('click',async e=>{const b=e.target.closest('[data-social]');if(b){const r=b.dataset.social;if(r==='messages'){drRouteTo('messages')}else drRouteTo(r);return}
 const hub=e.target.closest('[data-hub]');if(hub){e.preventDefault();$('#app').classList.remove('social-mode');const k=hub.dataset.hub;const old=document.querySelector(`#squadHub [data-hub="${k}"]`);if(old)old.click();else if(k==='cinema'&&window.CINEMA&&CINEMA.enter)CINEMA.enter();return}
 const open=e.target.closest('[data-open-chat]');if(open){$('#app').classList.remove('social-mode');openChat(open.dataset.openChat);return}
 if(e.target.closest('[data-open-legacy]')){$('#app').classList.remove('social-mode');$('#side').style.display='';$('#chat').style.display='';go('home');return}
 if(e.target.closest('[data-open-calls]')){$('#app').classList.remove('social-mode');go('calls');return}
 const like=e.target.closest('[data-like]');if(like){window.SquadSocial?.toggleLike(like.dataset.like).catch(x=>toast(x.message||'فشل الإعجاب'));return}
 const save=e.target.closest('[data-save]');if(save){window.SquadSocial?.toggleSave(save.dataset.save).catch(x=>toast(x.message||'فشل الحفظ'));return}
 const share=e.target.closest('[data-share]');if(share){const id=share.dataset.share;drModal(`<h3>مشاركة المنشور</h3><p>رابط تجريبي للمنشور ${id}</p><button class="dr-primary" data-copy-post="${id}">نسخ الرابط</button>`);return}
 const cm=e.target.closest('[data-comments]');if(cm){window.SquadSocial?.commentsModal(cm.dataset.comments).catch(x=>toast(x.message||'فشل تحميل التعليقات'));return}
 if(e.target.closest('[data-copy-post]')){navigator.clipboard?.writeText(location.href+'#'+e.target.dataset.copyPost);$('#dr-overlay').hidden=true;return}
 if(e.target.closest('[data-story]')){$('#app').classList.remove('social-mode');go('up');return}
 if(e.target.closest('[data-create-story]')){drModal('<h3>قصتك</h3><p>إنشاء الحالة الفعلية موجود في قسم الحالات الحالي.</p><button class="dr-primary" data-open-stories>فتح الحالات</button>');return}
 if(e.target.closest('[data-open-stories]')){$('#dr-overlay').hidden=true;$('#app').classList.remove('social-mode');go('up');return}
 if(e.target.closest('[data-preview-post]')){$('#dr-create-preview').textContent=$('#dr-post-text').value||'هيظهر نص منشورك هنا.';return}
 if(e.target.closest('[data-publish-post]')){const b=e.target.closest('[data-publish-post]'),files=[...($('#dr-media')?.files||[])];b.disabled=true;b.textContent='جارٍ النشر…';try{await window.SquadSocial.publish($('#dr-post-text').value,files,$('#dr-privacy').value);drRouteTo('feed');toast('تم نشر المنشور ✅')}catch(x){toast(x.message||'فشل النشر')}finally{b.disabled=false;b.textContent='نشر فعلي'}return}
 if(e.target.closest('[data-social-more]')){window.SquadSocial?.loadMore();return}
 if(e.target.closest('[data-close-modal]'))$('#dr-overlay').hidden=true;
});
// Style existing live chat with Dark Room tokens without replacing its messaging logic.
const drOpenLegacy=openChat,drCloseLegacy=closeChat;openChat=function(id){$('#app').classList.remove('social-mode');$('#app').classList.add('dr-legacy-chat');return drOpenLegacy(id)};closeChat=function(){const r=drCloseLegacy();$('#app').classList.remove('dr-legacy-chat');return r};
// Start social home after successful auth; legacy chat/calls remain reachable from message center.
const authObserver=()=>{if(typeof me!=='undefined'&&me&&$('#app')&&!$('#app').hidden){drRouteTo('feed');}};
const appObserver=new MutationObserver(authObserver);appObserver.observe($('#app'),{attributes:true,attributeFilter:['hidden']});

badge();
})();
