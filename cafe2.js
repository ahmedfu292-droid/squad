/* The Squad — الكافيه: ردود فعل، تخصيص الشخصية، مشاركة الشاشة، وتسجيل المكالمة (يتحفظ على جهازك) */
document.head.insertAdjacentHTML('beforeend',`<style>.fx{position:absolute;z-index:5;font-size:34px;pointer-events:none;animation:fxu 2.2s ease-out forwards}@keyframes fxu{to{transform:translateY(-90px);opacity:0}}
#rxb,#cpn{position:absolute;bottom:84px;left:50%;transform:translateX(-50%);z-index:6;display:flex;gap:8px;align-items:center;padding:8px 12px;border-radius:18px;background:#0b1236ee;border:1px solid #3fe0ff55}
#cpn{flex-direction:column;gap:6px}#cpn div{display:flex;gap:6px}#cpn i{width:26px;height:26px;border-radius:50%;border:2px solid #fff6;cursor:pointer}
#rxb button{font-size:24px;background:none;border:0}.cbar .on{box-shadow:0 0 14px #ff4f6e}</style>`);
$('.cbar').insertAdjacentHTML('beforeend','<button id="crx" class="ic" title="ردود فعل">😀</button><button id="cpk" class="ic" title="شخصيتي">🎨</button><button id="cshr" class="ic" title="مشاركة الشاشة">🖥</button><button id="crec" class="ic" title="تسجيل">⏺</button>');
$('#call').insertAdjacentHTML('beforeend','<div id="rxb" hidden>'+['👋','👏','❤️','😂','🔥','👍'].map(e=>`<button data-rx="${e}">${e}</button>`).join('')+'</div><div id="cpn" hidden></div>');
/* ردود الفعل */
function react(u,e){const o=AV.get(u);if(!o||!K3)return;const c=$('#c3d'),V=new THREE.Vector3(o.position.x,o.position.y+.9,o.position.z).project(K3),s=document.createElement('span');s.className='fx';s.textContent=e;
 s.style.cssText=`left:${(V.x*.5+.5)*c.clientWidth}px;top:${(-V.y*.5+.5)*c.clientHeight}px`;$('#call').append(s);setTimeout(()=>s.remove(),2200)}
$('#crx').onclick=()=>{$('#cpn').hidden=true;$('#rxb').hidden=!$('#rxb').hidden};
$('#rxb').onclick=e=>{const x=e.target.dataset.rx;if(!x||!CALL)return;react(me.uid,x);sg(`e_${me.uid}_${Date.now()}`,{k:'e',e:x})};
const onSig2=onSig;onSig=async function(s){await onSig2(s);s.docChanges().forEach(c=>{if(c.type!='added')return;const x=c.doc.data();if(x.k!='e'||x.u==me.uid||Date.now()-ms(x.t)>8000)return;
 x.e=='REC'?toast(((CALL&&CALL.P[x.u])||{}).nm+' بدأ تسجيل المكالمة 🔴'):react(x.u,x.e)})};
/* تخصيص الشخصية: لون الملابس والبشرة والشعر، بيتشاف عند الكل */
const SK=[0xf1c9a5,0xd9a47a,0xb87b55,0xffdcc0],HR=[0x1a1320,0x3b2314,0x0d0d18,0x6b3fa0];let AVC={};try{AVC=JSON.parse(localStorage.avc||'{}')}catch(e){}
function paint(o,cs){if(!o||!cs)return;const k=JSON.stringify(cs);if(o.userData.cs==k)return;o.userData.cs=k;const[b,h,r]=o.children,c=new THREE.Color().setHSL((cs.h||0)/360,.7,.55);
 b.material.color.copy(c);b.material.emissive.copy(c);h.material.color.setHex(SK[cs.s||0]);r.material.color.setHex(HR[cs.r||0])}
setInterval(()=>{if(CALL)AV.forEach((o,u)=>paint(o,(CALL.P[u]||{}).cs))},500);
const enter2=enter;enter=async function(a,b,c){await enter2(a,b,c);CALL&&sg('p_'+me.uid,{k:'p',nm:nm(),cs:AVC})};
const savAv=()=>{localStorage.avc=JSON.stringify(AVC);CALL&&sg('p_'+me.uid,{k:'p',nm:nm(),cs:AVC})};
$('#cpk').onclick=()=>{$('#rxb').hidden=true;const p=$('#cpn');p.hidden=!p.hidden;if(p.hidden)return;
 p.innerHTML=`<input type="range" id="cph" min="0" max="359" value="${AVC.h??hue(me.uid)}"><div>${SK.map((c,i)=>`<i data-sk="${i}" style="background:#${c.toString(16)}"></i>`).join('')}</div><div>${HR.map((c,i)=>`<i data-hr="${i}" style="background:#${c.toString(16).padStart(6,'0')}"></i>`).join('')}</div>`;
 $('#cph').oninput=e=>{AVC.h=+e.target.value;savAv()};p.onclick=e=>{const d=e.target.dataset;if(d.sk!=null){AVC.s=+d.sk;savAv()}if(d.hr!=null){AVC.r=+d.hr;savAv()}}};
/* مشاركة الشاشة (بتظهر في نافذة الهولوجرام بدل الكاميرا) */
$('#cshr').onclick=async()=>{if(!CALL)return;if(CALL.cam){camOff();$('#cshr').classList.remove('on');return}
 if(!navigator.mediaDevices.getDisplayMedia)return toast('مشاركة الشاشة مش مدعومة في المتصفح ده (أغلب متصفحات الموبايل مش بتدعمها)');
 const m=await navigator.mediaDevices.getDisplayMedia({video:true}).catch(()=>null);if(!m)return toast('اتلغت المشاركة');const t=m.getVideoTracks()[0];
 CALL.cam=m;CALL.out.addTrack(t);Object.entries(CALL.pcs).forEach(([id,pc])=>{pc.addTrack(t,CALL.out);offer(id)});
 const v=document.createElement('video');v.id='lv';v.muted=v.autoplay=v.playsInline=true;v.srcObject=m;$('#cvv').prepend(v);$('#cshr').classList.add('on');t.onended=()=>{CALL&&CALL.cam==m&&camOff();$('#cshr').classList.remove('on')}};
/* تسجيل المكالمة: مشهد الكافيه + صوت الكل، بيتحفظ كملف على جهازك. بيتبعت إشعار للباقيين */
let REC=null;
$('#crec').onclick=()=>{if(!CALL)return;if(REC)return REC.stop();if(!window.MediaRecorder||!$('#c3d').captureStream)return toast('التسجيل مش مدعوم في المتصفح ده');
 const AC=CALL.AC,d=AC.createMediaStreamDestination(),ch=[];AC.createMediaStreamSource(CALL.mic).connect(d);
 document.querySelectorAll('#cvv video').forEach(v=>{const s=v.srcObject;v.id!='lv'&&s&&s.getAudioTracks().length&&AC.createMediaStreamSource(s).connect(d)});
 const st=new MediaStream([...$('#c3d').captureStream(24).getVideoTracks(),...d.stream.getAudioTracks()]),mt='video/webm;codecs=vp8,opus';
 REC=new MediaRecorder(st,MediaRecorder.isTypeSupported(mt)?{mimeType:mt}:{});REC.ondataavailable=e=>e.data.size&&ch.push(e.data);
 REC.onstop=()=>{REC=null;$('#crec').classList.remove('on');$('#crec').textContent='⏺';if(!ch.length)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(ch,{type:'video/webm'}));a.download='squad-call-'+Date.now()+'.webm';a.click();toast('اتحفظ التسجيل على جهازك ✅')};
 REC.start(1000);$('#crec').classList.add('on');$('#crec').textContent='⏹';sg(`e_${me.uid}_${Date.now()}`,{k:'e',e:'REC'});toast('🔴 بيسجّل. التسجيل مش بيشمل نوافذ الكاميرا الهولوجرام')};
const leave3=leave;leave=function(q){REC&&REC.stop();leave3(q)};
