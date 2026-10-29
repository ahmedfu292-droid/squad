/* The Squad — كافيه 3D: يُحمَّل بعد calls.js ويستبدل غرفة المكالمة. حد 6 مشاركين، نافذة هولوجرام للكاميرا فوق كل شخصية */
const MAXP=6;
document.head.insertAdjacentHTML('beforeend',`<style>
#cvv{position:absolute!important;inset:0!important;display:block!important;pointer-events:none;overflow:hidden;z-index:2}
#cvv video{position:absolute!important;left:0;top:0;width:150px!important;height:112px!important;object-fit:cover;border-radius:14px;pointer-events:auto;cursor:pointer;transform-origin:50% 100%;
 border:1.5px solid #7ff6ff;box-shadow:0 0 14px #3fe0ffcc,0 0 38px #8a5cff88,inset 0 0 18px #3fe0ff55;opacity:.93;background:#061030}
#cvv video.vo{display:none!important}
#call.noholo #cvv{opacity:0}
#c3d{touch-action:none}
</style>`);
$('.cbar').insertAdjacentHTML('beforeend','<button id="chol" class="ic" title="إخفاء/إظهار نوافذ الكاميرا">🫥</button>');
$('#chol').onclick=()=>$('#call').classList.toggle('noholo');
$('#cvv').onclick=e=>{const v=e.target.closest('video');v&&v.classList.toggle('sm')};

/* حد 6: اللي يدخل بعد الستة الأوائل يخرج تلقائياً */
const onSig0=onSig;
onSig=async function(s){await onSig0(s);if(!CALL)return;
 const o=Object.values(CALL.P).sort((a,b)=>ms(a.t)-ms(b.t));
 if(o.length>MAXP&&o.findIndex(x=>x.u==me.uid)>=MAXP){toast('الغرفة ممتلئة (6 أشخاص)');leave()}};

/* الكافيه */
let az=0,rad=10;
function init3d(){if(R3)return;const c=$('#c3d');R3=new THREE.WebGLRenderer({canvas:c,antialias:true});R3.setPixelRatio(Math.min(devicePixelRatio,1.5));
 S3=new THREE.Scene();S3.background=new THREE.Color(0x060a1c);S3.fog=new THREE.Fog(0x060a1c,14,40);
 K3=new THREE.PerspectiveCamera(55,1,.1,200);az=0;rad=10;
 S3.add(new THREE.AmbientLight(0xffffff,.7));const L=new THREE.PointLight(0xb08cff,1.4,40);L.position.set(0,5,0);S3.add(L);
 const mat=(c,e)=>new THREE.MeshStandardMaterial({color:c,roughness:.6,emissive:e||0,emissiveIntensity:.5}),add=(m,x,y,z)=>{m.position.set(x,y,z);S3.add(m);return m};
 add(new THREE.Mesh(new THREE.CircleGeometry(16,48),mat(0x0b1230)),0,-1.2,0).rotation.x=-Math.PI/2;
 add(new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,.14,40),mat(0x1b2a6b,0x1b2a6b)),0,-.5,0);
 add(new THREE.Mesh(new THREE.CylinderGeometry(.22,.4,.7,16),mat(0x121c42)),0,-.88,0);
 const rg=add(new THREE.Mesh(new THREE.TorusGeometry(4.6,.03,8,96),new THREE.MeshBasicMaterial({color:0x3fe0ff})),0,-1.18,0);rg.rotation.x=Math.PI/2;
 /* نافذة كبيرة على مدينة */
 add(new THREE.Mesh(new THREE.PlaneGeometry(34,9),new THREE.MeshBasicMaterial({color:0x14134a})),0,3,-15);
 for(let i=0;i<30;i++){const h=1+Math.random()*6;add(new THREE.Mesh(new THREE.BoxGeometry(1.1,h,1),mat(0x121c42,i%3?0x1b2a6b:0x8a5cff)),-16+i*1.1,h/2-1.4,-14.5)}
 for(let i=-2;i<=2;i++)add(new THREE.Mesh(new THREE.BoxGeometry(.12,9,.12),mat(0x3fe0ff,0x3fe0ff)),i*7,3,-14.8);
 const g=new THREE.BufferGeometry(),a=new Float32Array(900);for(let i=0;i<900;i++)a[i]=(Math.random()-.5)*60;g.setAttribute('position',new THREE.BufferAttribute(a,3));S3.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:.1})));
 /* تحكم بالسحب والتقريب (لمس وماوس) */
 const P=new Map();let pd=0;
 c.onpointerdown=e=>{c.setPointerCapture(e.pointerId);P.set(e.pointerId,e);pd=0};
 c.onpointerup=c.onpointercancel=e=>P.delete(e.pointerId);
 c.onpointermove=e=>{const p=P.get(e.pointerId);if(!p)return;
  if(P.size==1)az-=(e.clientX-p.clientX)*.006;
  else if(P.size==2){const o=[...P.values()].find(q=>q.pointerId!=e.pointerId),d=Math.hypot(e.clientX-o.clientX,e.clientY-o.clientY);if(pd)rad=Math.min(16,Math.max(5,rad-(d-pd)*.03));pd=d}
  P.set(e.pointerId,e)};
 c.onwheel=e=>{e.preventDefault();rad=Math.min(16,Math.max(5,rad+e.deltaY*.01))};
 (function loop(){if(!CALL){R3.dispose();R3=null;return}requestAnimationFrame(loop);t3+=.016;
  const w=c.clientWidth,h=c.clientHeight;if(c.width!=w||c.height!=h){R3.setSize(w,h,false);K3.aspect=w/h;K3.updateProjectionMatrix()}
  K3.position.set(rad*Math.sin(az),2.8,rad*Math.cos(az));K3.lookAt(0,0,0);
  sync();R3.render(S3,K3);holo(w,h)})()}

function sync(){const ids=Object.keys(CALL.P).sort((a,b)=>(a==me.uid?-1:b==me.uid?1:a<b?-1:1)).slice(0,MAXP),k=ids.join();
 if(k!=sig3){sig3=k;AV.forEach((o,u)=>{if(!ids.includes(u)){S3.remove(o);S3.remove(o.userData.chair);AV.delete(u)}});
  ids.forEach(u=>{if(!AV.has(u)){const o=mkAv(u,CALL.P[u].nm||'؟');S3.add(o);AV.set(u,o);
   const ch=new THREE.Mesh(new THREE.BoxGeometry(1.1,.2,1.1),new THREE.MeshStandardMaterial({color:0x2a1b6b,emissive:0x8a5cff,emissiveIntensity:.4}));S3.add(ch);o.userData.chair=ch}});
  const n=ids.length,R=n==1?0:2.6;ids.forEach((u,i)=>{const o=AV.get(u),a=Math.PI+2*Math.PI*i/n;
   o.position.set(R*Math.sin(a),-.15,R*Math.cos(a));o.userData.base=o.position.y;o.rotation.y=n==1?0:a+Math.PI;o.userData.ry=o.rotation.y;
   o.userData.chair.position.set(1.0*(R||0)*0+(R+.05)*Math.sin(a),-1.05,(R+.05)*Math.cos(a))})}
 AV.forEach((o,u)=>{const lv=level(u);o.position.y=o.userData.base+Math.sin(t3*1.5+o.position.x)*.03+(lv>.06?.05:0);o.rotation.y=o.userData.ry+Math.sin(t3+o.position.x)*.08;
  o.userData.mouth.scale.y=1+lv*9;o.userData.glow.material.opacity=lv>.06?.22:0})}

/* نوافذ الفيديو الهولوجرام: بتتحرك فوق رأس الشخصية وبتتبعها */
function holo(w,h){const V=new THREE.Vector3();
 document.querySelectorAll('#cvv video').forEach(v=>{const u=v.id=='lv'?me.uid:v.id.slice(2),o=AV.get(u);
  if(!o){v.style.visibility='hidden';return}v.style.visibility='visible';
  V.set(o.position.x,o.position.y+1.5,o.position.z).project(K3);const d=K3.position.distanceTo(o.position),s=Math.min(1.3,Math.max(.55,9/d))*(v.classList.contains('sm')?.5:1);
  v.style.transform=`translate(${(V.x*.5+.5)*w-75}px,${(-V.y*.5+.5)*h-112}px) scale(${s})`;v.style.zIndex=1000-(d*10|0)})}
