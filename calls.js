/* The Squad — مكالمات فردية (في الخاص) وجماعية (في الجروبات) بغرفة 3D. WebRTC + إشارات عبر Firestore */
const ICE=typeof ICE_SERVERS!='undefined'?ICE_SERVERS:[{urls:'stun:stun.l.google.com:19302'}];
IC.phone='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z';
IC.video='M23 7l-7 5 7 5zM1 5h15v14H1z';
$('#cla').innerHTML=ic('phone');$('#clv').innerHTML=ic('video');
document.body.insertAdjacentHTML('beforeend',`<div id="call" hidden><canvas id="c3d"></canvas><div class="ctop"><b id="cnm"></b><small id="cti">00:00</small></div><div id="cvv"></div><div class="cbar"><button id="cmic" class="ic" title="المايك">🎙</button><button id="ccam" class="ic" title="الكاميرا">📷</button><button id="cend" class="ic" title="إنهاء">⛔</button></div></div>
<div id="inc" hidden><div class="ib"><u class="av" id="iav"></u><h3 id="inm"></h3><p class="mu" id="ity"></p><div class="ia"><button id="ino" class="ic" title="رفض">✕</button><button id="iok" class="ic" title="رد">✓</button></div></div></div>`);

let CALL=null,CM={},unCl=null,incId=null;
function startCalls(){unCl&&unCl();unCl=db.collection('calls').where('to','array-contains',me.uid).limit(20).onSnapshot(s=>{CM={};s.forEach(d=>CM[d.id]={id:d.id,...d.data()});watch()},()=>{})}
auth.onAuthStateChanged(u=>{if(!u){unCl&&unCl();unCl=null;CALL&&leave(true)}});

const media=()=>navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}}).catch(()=>null);

/* ---------- بدء ورد ورفض ---------- */
async function startCall(vid){
 const c=C[cid];if(!c)return;if(CALL)return toast('انت في مكالمة بالفعل');
 const mic=await media();if(!mic)return toast('لازم تسمح للمايك');
 const id=db.collection('calls').doc().id,call={from:me.uid,fn:nm(),to:c.members.filter(x=>x!=me.uid),cid:c.id,gn:cname(c),g:c.type=='g',vid:!!vid,st:'ring',t:FV.serverTimestamp(),dec:{}};
 try{await db.doc('calls/'+id).set(call)}catch(e){mic.getTracks().forEach(t=>t.stop());return toast('مقدرتش أبدأ المكالمة')}
 window.pushNotify&&pushNotify('call',c.id,vid?'مكالمة فيديو':'مكالمة صوتية');
 await enter(id,mic,call);vid&&camOn();
 setTimeout(()=>{if(CALL&&CALL.id==id&&Object.keys(CALL.P).length<2){toast('مفيش رد');leave()}},45000)}
async function accept(c){hideInc();if(CALL)return;const mic=await media();if(!mic)return toast('لازم تسمح للمايك');
 await db.doc('calls/'+c.id).update({st:'live'}).catch(()=>{});await enter(c.id,mic,c);c.vid&&camOn()}
let decline=c=>{hideInc();db.doc('calls/'+c.id).update({['dec.'+me.uid]:true}).catch(()=>{})};
function hideInc(){$('#inc').hidden=true;incId=null}
$('#cla').onclick=()=>startCall(false);$('#clv').onclick=()=>startCall(true);
$('#iok').onclick=()=>CM[incId]&&accept(CM[incId]);$('#ino').onclick=()=>CM[incId]&&decline(CM[incId]);

function watch(){
 const ring=Object.values(CM).find(c=>c.st=='ring'&&!(c.dec||{})[me.uid]&&Date.now()-ms(c.t)<45000);
 if(ring&&!CALL&&incId!=ring.id){incId=ring.id;$('#iav').style.setProperty('--h',hue(ring.from));$('#iav').textContent=[...ring.fn][0]||'؟';
  $('#inm').textContent=ring.g?ring.gn+' — '+ring.fn:ring.fn;$('#ity').textContent=(ring.g?'مكالمة جماعية ':'مكالمة ')+(ring.vid?'فيديو':'صوتية')+' 📞';$('#inc').hidden=false;navigator.vibrate&&navigator.vibrate([300,150,300])}
 if(incId&&(!CM[incId]||CM[incId].st=='end'||(CM[incId].dec||{})[me.uid]||CALL))hideInc();
 cbUpdate()}
function cbUpdate(){const el=$('#cb');if(!el)return;const c=Object.values(CM).find(x=>x.g&&x.cid==cid&&!CALL&&Date.now()-ms(x.t)<864e5);
 if(!c){el.hidden=true;return}el.hidden=false;el.innerHTML='<span>📞 فيه مكالمة جماعية شغالة في الجروب</span><button class="pri">انضم</button>';el.onclick=()=>accept(c)}

/* ---------- الدخول للمكالمة والإشارات ---------- */
async function enter(id,mic,call){
 const AC=new (window.AudioContext||window.webkitAudioContext)();AC.resume();
 CALL={id,call,mic,out:new MediaStream(mic.getTracks()),pcs:{},mine:[],AC,an:{},cam:null,t0:Date.now(),P:{}};window.SQUAD_CALL_ACTIVE=true;
 const a=AC.createAnalyser();a.fftSize=256;AC.createMediaStreamSource(mic).connect(a);CALL.an[me.uid]=a;
 $('#call').hidden=false;$('#cnm').textContent=call.g?call.gn:(call.from==me.uid?(C[call.cid]?cname(C[call.cid]):'مكالمة'):call.fn);
 $('#cmic').className='ic';$('#ccam').className='ic';
 CALL.ti=setInterval(()=>{const s=(Date.now()-CALL.t0)/1000|0,p=n=>String(n).padStart(2,'0');$('#cti').textContent=p(s/60|0)+':'+p(s%60)+(Object.keys(CALL.P).length>1?' · '+Object.keys(CALL.P).length+' مشارك':' · بيرن...')},1000);
 await sg('p_'+me.uid,{k:'p',nm:nm()});
 CALL.u=db.collection(`calls/${id}/sig`).onSnapshot(onSig,()=>{});
 CALL.cu=db.doc('calls/'+id).onSnapshot(s=>{if(!CALL)return;if(!s.exists)return leave(true);const d=s.data();
  if(!d.g&&d.from==me.uid&&d.to.every(u=>(d.dec||{})[u])){toast('رفض المكالمة ❌');leave()}},()=>{});
 loadThree(init3d)}
const sg=(id,o)=>{CALL.mine.push(id);return db.doc(`calls/${CALL.id}/sig/${id}`).set({u:me.uid,t:FV.serverTimestamp(),...o})};
function mk(id){const pc=new RTCPeerConnection({iceServers:ICE});CALL.pcs[id]=pc;CALL.out.getTracks().forEach(t=>pc.addTrack(t,CALL.out));
 pc.onicecandidate=e=>e.candidate&&sg(`i_${me.uid}_${id}_${Math.random().toString(36).slice(2,7)}`,{to:id,k:'i',d:JSON.stringify(e.candidate)});
 pc.ontrack=e=>{if(!CALL)return;let v=$('#rv'+id);if(!v){v=document.createElement('video');v.id='rv'+id;v.autoplay=v.playsInline=true;$('#cvv').append(v)}
  const s=e.streams[0];v.srcObject=s;
  if(e.track.kind=='audio'&&!CALL.an[id]){const a=CALL.AC.createAnalyser();a.fftSize=256;CALL.AC.createMediaStreamSource(s).connect(a);CALL.an[id]=a}
  const u=()=>v.classList.toggle('vo',!s.getVideoTracks().some(t=>!t.muted&&t.readyState=='live'));u();s.onaddtrack=s.onremovetrack=u;e.track.onmute=e.track.onunmute=u};
 return pc}
async function offer(id){const pc=CALL.pcs[id]||mk(id);if(pc.signalingState!='stable')return;
 await pc.setLocalDescription(await pc.createOffer());sg(`o_${me.uid}_${id}_${Date.now()}`,{to:id,k:'o',d:JSON.stringify(pc.localDescription)})}
function drop(id){const pc=CALL.pcs[id];pc&&pc.close();delete CALL.pcs[id];delete CALL.an[id];const v=$('#rv'+id);v&&v.remove();
 if(!CALL.call.g){toast('المكالمة خلصت');leave()}}
async function onSig(s){if(!CALL)return;const P={};s.forEach(d=>{const x=d.data();if(x.k=='p')P[x.u]=x});CALL.P=P;
 const ch=s.docChanges().sort((a,b)=>'oai'.indexOf(a.doc.data().k)-'oai'.indexOf(b.doc.data().k));
 for(const c of ch){if(!CALL)return;const x=c.doc.data(),id=x.u;if(id==me.uid)continue;
  try{
   if(x.k=='p'){if(c.type=='removed')drop(id);else if(!CALL.pcs[id]&&me.uid>id)offer(id);continue}
   if(c.type=='removed'||x.to!=me.uid||(x.t&&x.t.toMillis()<CALL.t0-30000))continue;
   let pc=CALL.pcs[id];
   if(x.k=='o'){pc=pc||mk(id);await pc.setRemoteDescription(JSON.parse(x.d));await pc.setLocalDescription(await pc.createAnswer());sg(`a_${me.uid}_${id}_${Date.now()}`,{to:id,k:'a',d:JSON.stringify(pc.localDescription)})}
   else if(pc&&x.k=='a'&&pc.signalingState=='have-local-offer')await pc.setRemoteDescription(JSON.parse(x.d));
   else if(pc&&x.k=='i')await pc.addIceCandidate(JSON.parse(x.d)).catch(()=>{});
  }catch(e){console.warn(e)}}}

/* ---------- كاميرا ومايك وخروج ---------- */
async function camOn(){if(!CALL||CALL.cam)return;const m=await navigator.mediaDevices.getUserMedia({video:{width:480,height:360}}).catch(()=>null);if(!m)return toast('الكاميرا مش متاحة');
 const t=m.getVideoTracks()[0];CALL.cam=m;CALL.out.addTrack(t);Object.entries(CALL.pcs).forEach(([id,pc])=>{pc.addTrack(t,CALL.out);offer(id)});
 const v=document.createElement('video');v.id='lv';v.muted=v.autoplay=v.playsInline=true;v.srcObject=m;$('#cvv').prepend(v);$('#ccam').classList.add('on')}
function camOff(){if(!CALL||!CALL.cam)return;CALL.cam.getTracks().forEach(t=>{t.stop();CALL.out.removeTrack(t)});CALL.cam=null;
 Object.entries(CALL.pcs).forEach(([id,pc])=>{pc.getSenders().filter(s=>s.track&&s.track.kind=='video').forEach(s=>pc.removeTrack(s));offer(id)});
 const v=$('#lv');v&&v.remove();$('#ccam').classList.remove('on')}
$('#ccam').onclick=()=>CALL&&(CALL.cam?camOff():camOn());
$('#cmic').onclick=()=>{if(!CALL)return;const t=CALL.mic.getAudioTracks()[0];t.enabled=!t.enabled;$('#cmic').classList.toggle('off',!t.enabled);$('#cmic').textContent=t.enabled?'🎙':'🔇'};
$('#cend').onclick=()=>leave();
function leave(quiet){if(!CALL)return;const c=CALL;CALL=null;window.SQUAD_CALL_ACTIVE=false;clearInterval(c.ti);c.u&&c.u();c.cu&&c.cu();
 Object.values(c.pcs).forEach(p=>p.close());c.mic.getTracks().forEach(t=>t.stop());c.cam&&c.cam.getTracks().forEach(t=>t.stop());c.AC.close().catch(()=>{});
 const alone=Object.keys(c.P).filter(u=>u!=me.uid).length==0||!c.call.g;
 Promise.all(c.mine.map(i=>db.doc(`calls/${c.id}/sig/${i}`).delete().catch(()=>{}))).then(()=>alone&&!quiet&&db.doc('calls/'+c.id).delete().catch(()=>{}));
 $('#call').hidden=true;$('#cvv').innerHTML='';$('#cmic').textContent='🎙';AV.forEach(o=>S3&&S3.remove(o));AV.clear();sig3='';cbUpdate()}
addEventListener('pagehide',()=>CALL&&leave());

/* ---------- الغرفة ثلاثية الأبعاد ---------- */
let R3,S3,K3,AV=new Map(),sig3='',t3=0;
function loadThree(cb){if(window.THREE)return cb();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=cb;document.head.append(s)}
function label(tx){const cn=document.createElement('canvas');cn.width=256;cn.height=64;const k=cn.getContext('2d');k.font='bold 30px Cairo,sans-serif';k.textAlign='center';k.lineWidth=6;k.strokeStyle='#000b';k.strokeText(tx,128,42);k.fillStyle='#fff';k.fillText(tx,128,42);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cn),transparent:true}));s.scale.set(3.2,.8,1);s.position.y=-1.15;return s}
function mkAv(u,name){const h=hue(u),M=(c,e)=>new THREE.MeshStandardMaterial({color:c,roughness:.5,...(e?{emissive:c,emissiveIntensity:.35}:{})}),g=new THREE.Group(),
 add=(m,x,y,z)=>{m.position.set(x,y,z);g.add(m);return m},sk=[0xf1c9a5,0xd9a47a,0xb87b55,0xffdcc0][h%4],hr=[0x1a1320,0x3b2314,0x0d0d18,0x6b3fa0][(h>>2)%4],cl=new THREE.Color().setHSL(h/360,.7,.55);
 add(new THREE.Mesh(new THREE.CylinderGeometry(.4,.52,.8,20),M(cl,1)),0,-.4,0);
 add(new THREE.Mesh(new THREE.SphereGeometry(.42,24,18),M(sk)),0,.28,0);
 add(new THREE.Mesh(new THREE.SphereGeometry(.45,24,16,0,Math.PI*2,0,Math.PI*.52),M(hr)),0,.34,-.02);
 [-.15,.15].forEach(x=>add(new THREE.Mesh(new THREE.SphereGeometry(.05,10,10),M(0x111111)),x,.3,.39));
 g.userData.mouth=add(new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),M(0x8a2b3b)),0,.14,.4);
 [-.47,.47].forEach(x=>{const e=add(new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.12,16),M(0x3fe0ff,1)),x,.3,0);e.rotation.z=Math.PI/2});
 g.userData.glow=add(new THREE.Mesh(new THREE.SphereGeometry(1.15,20,20),new THREE.MeshBasicMaterial({color:0x34f0a1,transparent:true,opacity:0})),0,0,0);
 g.add(label(name+(u==me.uid?' (أنت)':'')));g.userData.u=u;return g}
function init3d(){if(R3){return}const c=$('#c3d');R3=new THREE.WebGLRenderer({canvas:c,antialias:true});S3=new THREE.Scene();S3.background=new THREE.Color(0x060a1c);
 K3=new THREE.PerspectiveCamera(55,1,.1,200);K3.position.set(0,2.4,9);K3.lookAt(0,0,0);
 S3.add(new THREE.AmbientLight(0xffffff,.85));const L=new THREE.PointLight(0x9ab8ff,1.2,60);L.position.set(0,6,8);S3.add(L);
 const g=new THREE.BufferGeometry(),a=new Float32Array(2700);for(let i=0;i<2700;i++)a[i]=(Math.random()-.5)*90;g.setAttribute('position',new THREE.BufferAttribute(a,3));S3.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:.12})));
 for(let i=0;i<26;i++){const h=1+Math.random()*5,b=new THREE.Mesh(new THREE.BoxGeometry(1.4,h,1.4),new THREE.MeshStandardMaterial({color:0x121c42,emissive:0x1b2a6b,emissiveIntensity:.4}));b.position.set(-19+i*1.5,h/2-4.5,-14);S3.add(b)}
 [3.4,4.6,5.8].forEach((r,i)=>{const o=new THREE.Mesh(new THREE.TorusGeometry(r,.025,8,96),new THREE.MeshBasicMaterial({color:i%2?0x8a5cff:0x3fe0ff}));o.rotation.x=Math.PI/2;o.position.y=-1.5;S3.add(o)});
 const pl=new THREE.Mesh(new THREE.IcosahedronGeometry(1,2),new THREE.MeshBasicMaterial({color:0x3fe0ff,wireframe:true,transparent:true,opacity:.5}));pl.position.set(0,3.4,-6);pl.userData.spin=1;S3.add(pl);
 (function loop(){if(!CALL){R3.dispose();R3=null;return}requestAnimationFrame(loop);t3+=.016;
  const w=c.clientWidth,h=c.clientHeight;if(c.width!=w||c.height!=h){R3.setSize(w,h,false);K3.aspect=w/h;K3.updateProjectionMatrix()}
  sync();pl.rotation.y+=.01;R3.render(S3,K3)})()}
function level(u){const a=CALL.an[u];if(!a)return 0;const d=new Uint8Array(a.frequencyBinCount);a.getByteFrequencyData(d);return d.reduce((s,x)=>s+x,0)/d.length/255}
function sync(){const ids=Object.keys(CALL.P).sort((a,b)=>(a==me.uid?-1:b==me.uid?1:a<b?-1:1)),sg2=ids.join();
 if(sg2!=sig3){sig3=sg2;AV.forEach((o,u)=>{if(!CALL.P[u]){S3.remove(o);AV.delete(u)}});
  ids.forEach(u=>{if(!AV.has(u)){const o=mkAv(u,CALL.P[u].nm||'؟');S3.add(o);AV.set(u,o)}});
  const n=ids.length;ids.forEach((u,i)=>{const o=AV.get(u);if(n==1)o.position.set(0,0,0);else if(n==2)o.position.set(i?1.7:-1.7,0,0);
   else{const ag=2*Math.PI*i/n,R=Math.max(2.8,n*.75);o.position.set(R*Math.sin(ag),0,R*Math.cos(ag)-R+1.5)}})}
 AV.forEach((o,u)=>{const lv=level(u),by=Math.sin(t3*1.5+o.position.x)*.12;o.position.y=by;o.rotation.y=Math.sin(t3+o.position.x)*.3;
  const sc=1+lv*.5;o.scale.set(sc,sc,sc);o.userData.mouth.scale.y=1+lv*9;o.userData.glow.material.opacity=lv>.06?.22:0})}
