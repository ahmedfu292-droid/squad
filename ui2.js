/* The Squad — ui2: الشريط الرئيسي (شات / تحديثات / العروض / مكالمات)، شاشة العروض (إعلانات + ChatGPT/Gemini)، اختيار الصور بمعاينة،
   اكتشاف وإدارة القنوات، إحصائيات المكالمات، الإعلانات. بيتحمّل آخر ملف (بعد settings.js).
   مبني فوق الملفات الحالية (بيغلّف الدوال بدل ما يعيد كتابتها) وما بيمسحش ولا بيعطّل أي ميزة قديمة. */
(()=>{
const $$=s=>[...document.querySelectorAll(s)];
IC.ai='M12 3l1.9 5.4L19.5 10l-5.6 1.7L12 17.5l-1.9-5.8L4.5 10l5.6-1.6zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z';
IC.phone2='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z';

/* ================= 1) الشريط الرئيسي: 4 شاشات ================= */
const nav=$('#nav'),btn=k=>nav.querySelector(`[data-go=${k}]`);
if(!btn('ai')){nav.insertAdjacentHTML('beforeend','<button data-go="ai"><i></i>AI</button>');btn('ai').querySelector('i').innerHTML=ic('ai')}
const L={home:'الشات',up:'التحديثات',ai:'العروض',calls:'المكالمات'};
['home','up','ai','calls'].forEach(k=>{const b=btn(k);if(!b)return;b.lastChild.textContent=L[k];nav.appendChild(b)});
['find','me'].forEach(k=>{const b=btn(k);b&&(b.hidden=true)}); /* موجودين لسه، والوصول ليهم من الهيدر: ➕ استكشاف / ⚙️ الإعدادات والملف الشخصي */
$('#gear').title='الإعدادات والملف الشخصي';$('#plus').title='استكشاف · جروب جديد · مجتمعات';

const go0=go;go=function(t){
 if(t!='ai')return go0(t);
 tab='ai';$$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go=='ai'));
 $('#home').hidden=true;$('#oth').hidden=false;viewAI()};

/* شارة الرسايل الغير مقروءة على «الشات» */
function badge(){const b=btn('home');if(!b||typeof me=='undefined'||!me)return;const m=U.mute||[],a=U.arch||[];
 const n=Object.values(C).reduce((s,c)=>s+(m.includes(c.id)||a.includes(c.id)?0:((c.un||{})[me.uid]||0)),0);
 let e=b.querySelector('.nb');if(!n){e&&e.remove();return}
 e||(e=document.createElement('b'),e.className='nb',b.appendChild(e));e.textContent=n>99?'99+':n}
const rh0=renderHome;renderHome=function(){rh0();badge()};

/* ================= 2) شاشة العروض: إعلانات المواقع التجارية + روابط ChatGPT و Gemini ================= */
const AIS=[['C','ChatGPT','محادثة ذكية من OpenAI. بيفتح في تبويب جديد.','https://chatgpt.com'],
           ['G','Gemini','مساعد Google الذكي. بيفتح في تبويب جديد.','https://gemini.google.com']];
let adc='';
const adList=()=>(window.SQUAD_ADS||[]).filter(a=>a&&a.t&&/^https:\/\//.test(a.url||''));
function adCard(a){return `<div class="u2c u2ad"><div class="im" style="${/^(https:\/\/|data:image\/)/.test(a.img||'')?`background-image:url(&quot;${esc(a.img)}&quot;)`:`background-image:${gcol(a.t)}`}"><span class="lb">إعلان</span></div><div class="bd"><b>${esc(a.t)}</b>${a.d?`<p>${esc(a.d)}</p>`:''}${a.price?`<span class="pr">${esc(a.price)}</span>`:''}<a class="pri" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer sponsored">${esc(a.btn||'زيارة الموقع')}</a></div></div>`}
function adBody(){const A=adList();if(!A.length)return `<div class="u2c u2empty"><b>مساحتك الإعلانية</b><p>لسه مفيش إعلانات. ضيف إعلانات مواقعك في ملف ads.js وهتظهر هنا مرتبة حسب التصنيف.</p></div>`;
 const cs=[...new Set(A.map(a=>a.cat||'عام'))],L=A.filter(a=>!adc||(a.cat||'عام')==adc);
 return (cs.length>1?`<div class="u2cats"><button data-u2a="" class="${adc?'':'on'}">الكل</button>${cs.map(c=>`<button data-u2a="${esc(c)}" class="${c==adc?'on':''}">${esc(c)}</button>`).join('')}</div>`:'')+`<div class="u2g" id="u2al">${L.map(adCard).join('')}</div>`}
function viewAI(){
 $('#oth').innerHTML=`<div class="u2h"><h4>الذكاء الاصطناعي</h4></div><div class="u2row2">${AIS.map(([l,n,d,u])=>`<a class="u2c u2ai" href="${u}" target="_blank" rel="noopener noreferrer"><div class="rbx">${l}</div><div><h3>${n}</h3><p>${d}</p></div><span class="pri go">افتح</span></a>`).join('')}</div>
 <div class="u2h"><h4>إعلانات المواقع التجارية</h4></div><div id="u2ab">${adBody()}</div>`}
$('#oth').addEventListener('click',e=>{const c=e.target.closest('[data-u2a]');if(!c||tab!='ai')return;adc=c.dataset.u2a;$('#u2ab').innerHTML=adBody()});

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

badge();
})();
