/* The Squad v28 — الغرفة 3D التفاعلية (Three.js r128 من نفس CDN بتاع الكافيه القديم).
   حركة WASD + ماوس / جويستيك لمس، لاعبين حقيقيين عبر Firestore (world/main/players)، شات (world/main/msgs)، قايمة الموجودين، بلياردو وأركيد (سنيك) بيتلعبوا فعلاً. */
(()=>{
let ROOM='main',RN='';const HW=13,HD=10,HB=10,HF=16,STALE=25000,MOB=/Android|iPhone|iPad|Mobi/i.test(navigator.userAgent);
document.head.insertAdjacentHTML('beforeend',`<style>
#world{position:fixed;inset:0;z-index:100;background:#05070f;color:#eaf6ff;direction:rtl;touch-action:none;user-select:none}
#world[hidden]{display:none}#wc{position:absolute;inset:0;width:100%;height:100%;display:block}
#wtop{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));inset-inline:10px;display:flex;gap:8px;align-items:center;z-index:3}
#wtop button,#wact button,#wgame button{padding:9px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(10,14,30,.72);backdrop-filter:blur(10px);color:#fff;font:700 14px Cairo,sans-serif;cursor:pointer}
#wtop b{flex:1;text-align:center;font-size:14px;text-shadow:0 2px 8px #000}
#wusers{position:absolute;top:calc(58px + env(safe-area-inset-top,0px));inset-inline-start:10px;z-index:3;width:210px;max-height:46vh;overflow:auto;padding:8px;border-radius:18px;background:rgba(10,14,30,.8);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12)}
#wusers .wu{display:flex;align-items:center;gap:10px;padding:5px;border-radius:12px}#wusers u.av{width:38px;height:38px}#wusers b{font-size:14px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#wchat{position:absolute;bottom:calc(10px + env(safe-area-inset-bottom,0px));inset-inline-start:10px;width:min(340px,calc(100vw - 20px));z-index:3;border-radius:18px;background:rgba(10,14,30,.74);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);padding:8px}
#wmsgs{max-height:22vh;overflow:auto;font-size:13.5px;line-height:1.7;margin-bottom:6px}#wmsgs b{color:#7ff6ff}
#wchat .r{display:flex;gap:6px}#win{flex:1;min-width:0;border-radius:12px;padding:9px 12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#fff;font:14px Cairo}
#wsend{width:42px;border-radius:12px;border:0;background:linear-gradient(135deg,#f3d77a,#e6a23c);color:#1b1405;font-weight:800}
#wact{position:absolute;bottom:34%;left:50%;transform:translateX(-50%);z-index:3;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:min(94vw,520px)}
#wjoy{position:absolute;bottom:calc(34vh + 10px);inset-inline-end:22px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);z-index:3;touch-action:none}
#wjoy i{position:absolute;left:36px;top:36px;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#7ff6ff,#5c7cff);box-shadow:0 0 18px #3fe0ff99}
#wload{position:absolute;inset:0;display:grid;place-items:center;background:#05070f;z-index:5;font-weight:800}
#wgame{position:absolute;inset:0;z-index:6;background:rgba(3,5,14,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px}
#wgame[hidden]{display:none}#wgame canvas{max-width:100%;max-height:62vh;border-radius:14px;border:2px solid #3fe0ff88;touch-action:none;background:#0b3d2a}#wgame .gh{display:flex;gap:14px;align-items:center}#wgame p{margin:0;color:#9fb0d8;font-size:13px;text-align:center}
@media(min-width:800px){#wjoy{display:none}#wchat{width:360px}}@media(max-width:799px){#wchat.off{display:none}#wusers{width:170px}}
#wjump{position:absolute;bottom:calc(34vh + 24px);inset-inline-start:26px;z-index:3;width:62px;height:62px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(10,14,30,.7);color:#fff;font-size:24px;padding:0;touch-action:none}@media(min-width:800px){#wjump{display:none}}
#wlobby{position:fixed;inset:0;z-index:120;background:rgba(3,5,14,.88);display:flex;align-items:center;justify-content:center;direction:rtl;padding:12px;color:#eaf6ff}#wlobby[hidden]{display:none}
#wlobby .lb{width:min(420px,100%);max-height:92vh;overflow:auto;background:#0d1230;border:1px solid rgba(127,246,255,.25);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:10px;font-family:Cairo,sans-serif}
#wlobby h3{margin:0;font-size:18px}#wlobby .sec{display:flex;flex-direction:column;gap:7px;padding:10px;border-radius:14px;background:rgba(255,255,255,.05)}
#wlobby input{border-radius:10px;padding:9px 11px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#fff;font:14px Cairo,sans-serif}
#wlobby button,#wlook button.tg,#wlook .lr button{padding:9px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;font:700 13px Cairo,sans-serif;cursor:pointer}
#wlobby .big{background:linear-gradient(135deg,#f3d77a,#e6a23c);color:#1b1405;border:0}#wlobby .err{color:#ff8a8a;font-size:13px;min-height:16px}#wlobby .mr{padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.07);cursor:pointer;display:flex;justify-content:space-between;gap:8px}
#wlook{position:absolute;top:calc(60px + env(safe-area-inset-top,0px));inset-inline-end:10px;width:224px;max-height:calc(100% - 150px);overflow:auto;z-index:4;padding:10px;border-radius:18px;background:rgba(10,14,30,.86);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.14);font-family:Cairo,sans-serif}#wlook[hidden]{display:none}
#wlook p{margin:8px 0 4px;font-size:12px;color:#9fb0d8}#wlook div{display:flex;flex-wrap:wrap;gap:5px}#wlook .sw{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,.25);padding:0;cursor:pointer}#wlook .sw.on,#wlook .tg.on{outline:2px solid #7ff6ff}#wlook .tg{padding:6px 9px!important}#wlook .lr{margin-top:10px}
#wbtn{font-size:20px}</style>`);
document.body.insertAdjacentHTML('beforeend',`<div id="world" hidden><canvas id="wc"></canvas>
<div id="wtop"><button id="wx">✕ خروج</button><b id="wcnt"></b><button id="wcity" title="الحي المفتوح">🏙️</button><button id="wlk">👤</button><button id="wq" title="الجودة">✨</button><button id="wub">👥</button><button id="wcb">💬</button></div>
<div id="wusers" hidden></div>
<div id="wchat"><div id="wmsgs"></div><div class="r"><input id="win" maxlength="300" placeholder="اكتب للكل..." autocomplete="off"><button id="wsend">➤</button></div></div>
<div id="wact" hidden><button id="wdoor" hidden>🚪 اخرج للحي</button><button id="wpool" hidden>🎱 العب بلياردو</button><button id="warc" hidden>🐍 سنيك</button><button id="wpong" hidden>🏓 بونج ضد الكمبيوتر</button><button id="wmem" hidden>🃏 لعبة الذاكرة</button></div>
<button id="wjump">⤴</button><div id="wjoy"><i></i></div><div id="wgame" hidden><div class="gh"><b id="wgt"></b><span id="wsc"></span><button id="wgx">✕ إغلاق</button></div><canvas id="wg"></canvas><p id="wgm"></p></div>
<div id="wlook" hidden></div><div id="wload">بيحمّل الغرفة...</div></div>`);
document.body.insertAdjacentHTML('beforeend',`<div id="wlobby" hidden><div class="lb"><h3>🏛️ غرف The Squad</h3><button id="wlp" class="big">🌍 ادخل الغرفة العامة</button><button id="wlcity" class="big">🏙️ الحي المفتوح (برّه الكافيه)</button>
<div class="sec"><b>➕ إنشاء روم خاصة بباسورد</b><input id="wcn" maxlength="24" placeholder="اسم الروم"><input id="wcp" maxlength="30" placeholder="الباسورد (4 حروف على الأقل)" autocomplete="off"><button id="wcc">إنشاء الروم</button><div id="wci" hidden></div></div>
<div class="sec"><b>🔑 دخول روم بكود</b><input id="wjc" dir="ltr" maxlength="8" placeholder="الكود مثل p_ab12cd" autocomplete="off"><input id="wjp" maxlength="30" placeholder="الباسورد" autocomplete="off"><button id="wjj">دخول</button></div>
<div class="sec" id="wml" hidden></div><div id="wle" class="err"></div><button id="wlx">إغلاق</button></div></div>`);
$('#side>header').insertAdjacentHTML('afterbegin','<button id="wbtn" class="ic" title="الغرفة 3D">🏛️</button>');
const $w=s=>document.querySelector(s);
if(MOB)$w('#wchat').classList.add('off');
/* ---------- الحالة ---------- */
const P={x:0,z:6,yaw:0,moved:1,y:0,lv:0,jy:0,vy:0,air:0},K={},R={},LS={};let T,sc,cam,ren,ray,built=0,openW=0,raf=0,last=0,lastW=0,lastSent=0,pRef,unP,unM,jx=0,jy=0,G=null,PD={},sendT=0;
const O=[];/* عوائق مستطيلة [x,z,نصف العرض,نصف العمق] */
const POOL=[5,-2],ARC=[12.2,3.2],PORTAL=[-11.2,10.5];
const hsl=u=>hue(u)%360;
/* ---------- بناء المشهد ---------- */
const cvt=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);return t};
function box(w,h,d,col,x,y,z,basic,obs){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),basic?new THREE.MeshBasicMaterial({color:col}):new THREE.MeshLambertMaterial({color:col}));m.position.set(x,y,z);sc.add(m);if(obs)O.push([x,z,w/2,d/2]);return m}
function plane(w,h,map,x,y,z,ry,col){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial(map?{map}:{color:col}));m.position.set(x,y,z);m.rotation.y=ry||0;sc.add(m);return m}
function plant(x,z){const p=new THREE.Mesh(new THREE.CylinderGeometry(.3,.24,.5,10),new THREE.MeshLambertMaterial({color:0x2a1a12}));p.position.set(x,.25,z);sc.add(p);const l=new THREE.Mesh(new THREE.SphereGeometry(.6,10,8),new THREE.MeshLambertMaterial({color:0x1f7a3a}));l.position.set(x,1,z);sc.add(l);O.push([x,z,.35,.35])}
/* ---------- v28c: أدوات التجميع (كل المجسمات الثابتة بتتدمج في 2 ميش بس عشان الموبايل) ---------- */
const GC={},gk=(k,f)=>GC[k]||(GC[k]=f());
const gB=()=>gk('b',()=>new THREE.BoxGeometry(1,1,1).toNonIndexed()),
 gC=(n,t)=>gk('c'+n+'_'+(t||1),()=>new THREE.CylinderGeometry(t||1,1,1,n).toNonIndexed()),
 gS=(a,b)=>gk('s'+a+'_'+b,()=>new THREE.SphereGeometry(1,a,b).toNonIndexed()),
 gK=n=>gk('k'+n,()=>new THREE.CylinderGeometry(0,1,1,n).toNonIndexed()),
 gT=()=>gk('t',()=>new THREE.TorusGeometry(1,.08,6,32).toNonIndexed());
const mkb=()=>({p:[],n:[],c:[]});let TB={l:mkb(),b:mkb()},BASE=null;
let _C,_V,_N;
const TR=(x,y,z,rx,ry,rz,sx,sy,sz)=>new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,rz||0)),new THREE.Vector3(sx==null?1:sx,sy==null?1:sy,sz==null?1:sz));
function put(g,c,m,k){if(BASE)m=BASE.clone().multiply(m);const t=TB[k||'l'];_N.getNormalMatrix(m);_C.set(c);const p=g.attributes.position,nn=g.attributes.normal;
 for(let i=0;i<p.count;i++){_V.fromBufferAttribute(p,i).applyMatrix4(m);const yv=_V.y>Y2-.1?_V.y-Y2:_V.y,fa=k=='b'?1:.55+.45*Math.min(1,Math.max(0,yv/1.5));t.p.push(_V.x,_V.y,_V.z);_V.fromBufferAttribute(nn,i).applyMatrix3(_N).normalize();t.n.push(_V.x,_V.y,_V.z);t.c.push(_C.r*fa,_C.g*fa,_C.b*fa)}}
const B=(w,h,d,c,x,y,z,o)=>{o=o||{};put(gB(),c,TR(x,y,z,o.rx,o.ry,o.rz,w,h,d),o.k)};
const Cy=(r,h,c,x,y,z,o)=>{o=o||{};put(gC(o.n||10,o.t),c,TR(x,y,z,o.rx,o.ry,o.rz,r,h,r*(o.e||1)),o.k)};
const Sp=(r,c,x,y,z,o)=>{o=o||{};put(gS(o.a||8,o.b||6),c,TR(x,y,z,o.rx,o.ry,o.rz,r*(o.sx||1),r*(o.sy||1),r*(o.sz||1)),o.k)};
const Co=(r,h,c,x,y,z,o)=>{o=o||{};put(gK(o.n||8),c,TR(x,y,z,o.rx,o.ry,o.rz,r,h,r),o.k)};
const Tor=(r,c,x,y,z,o)=>{o=o||{};put(gT(),c,TR(x,y,z,o.rx==null?Math.PI/2:o.rx,o.ry,o.rz,r,r,r),o.k||'b')};
const IN=(m,f)=>{const pv=BASE;BASE=pv?pv.clone().multiply(m):m;f();BASE=pv};
let SHD=[];const by=()=>BASE?BASE.elements[13]:0,shadow=(x,z,w,d,y)=>SHD.push([x,z,w,d,(y||0)+by()]);
function flushSh(){if(!SHD.length)return;const p=[],uv=[];SHD.forEach(([x,z,w,d,y])=>{const a=x-w/2,b=x+w/2,c=z-d/2,e=z+d/2,yy=y+.03;[[a,c,0,0],[a,e,0,1],[b,e,1,1],[a,c,0,0],[b,e,1,1],[b,c,1,0]].forEach(([X,Z,u,v])=>{p.push(X,yy,Z);uv.push(u,v)})});
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 const t=cvt(128,128,(c,w,h)=>{const q=c.createRadialGradient(64,64,6,64,64,64);q.addColorStop(0,'rgba(0,0,0,.85)');q.addColorStop(.55,'rgba(0,0,0,.45)');q.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=q;c.fillRect(0,0,128,128)});
 const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,side:THREE.DoubleSide}));m.frustumCulled=false;sc.add(m);SHD=[]}
function flush(){[['l',THREE.MeshLambertMaterial],['b',THREE.MeshBasicMaterial]].forEach(([k,Mt])=>{const t=TB[k];if(!t.p.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(t.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(t.n,3));g.setAttribute('color',new THREE.Float32BufferAttribute(t.c,3));const m=new THREE.Mesh(g,new Mt({vertexColors:true}));m.frustumCulled=false;sc.add(m)});TB={l:mkb(),b:mkb()}}
/* ---------- الطابق العلوي والسلالم (الارتفاع بيتحسب من المكان + المستوى lv، فمفيش حاجة جديدة بتتبعت للسيرفر) ---------- */
const Y2=3.2,inSt=(x,z)=>x>=-8&&x<=-3&&z>=-6.9&&z<=-5.3,inMz=(x,z)=>x>=-3&&x<=10.5&&z>=-10&&z<=-5.4;
const Y3=7.4,inS3=(x,z)=>x>=.9&&x<=12.4&&z>=13.9&&z<=15.7,s3=x=>Math.max(0,Math.min(1,(12.4-x)/11.5)),LVD=r=>r>15?2:r>5?1:0;
const gY=(x,z,lv)=>lv!=1&&inS3(x,z)?s3(x)*Y3+.08:lv==2?Y3:inSt(x,z)?Math.max(0,Math.min(Y2,(x+8)*.64))+.08:(lv==1&&inMz(x,z)?Y2:0);
const POOL2=[7.8,-7.6];
/* ---------- بناء المشهد ---------- */
function build(){
 O.length=0;SHD=[];_C=new THREE.Color();_V=new THREE.Vector3();_N=new THREE.Matrix3();
 sc=new THREE.Scene();sc.background=new THREE.Color(0x060816);sc.fog=new THREE.Fog(0x060816,26,64);
 cam=new THREE.PerspectiveCamera(72,1,.1,100);ray=new THREE.Raycaster();
 ren=new THREE.WebGLRenderer({canvas:$w('#wc'),antialias:!MOB,powerPreference:'high-performance'});ren.setPixelRatio(Math.min(devicePixelRatio||1,MOB?1.25:1.75));
 const ani=Math.min(MOB?2:8,(ren.capabilities&&ren.capabilities.getMaxAnisotropy&&ren.capabilities.getMaxAnisotropy())||1);
 sc.add(new THREE.AmbientLight(0x8a90c8,.62));sc.add(new THREE.HemisphereLight(0x6a7cff,0x3a2212,.45));
 const pl=(c,i,d,x,y,z)=>{const l=new THREE.PointLight(c,i,d);l.position.set(x,y,z);sc.add(l)};
 pl(0xffa050,1.2,17,-9.5,3.6,-4);pl(0x3a6cff,1.3,16,5,3.4,-1.5);pl(0xff9a50,.9,16,-7,3.8,4);pl(0xb06cff,1,16,11,3.2,-1.5);pl(0xffb870,1,14,3,6.2,-7.6);if(!MOB){pl(0x3f8cff,.9,12,0,5.8,-7.6);pl(0xff8a50,.7,15,6,4,6);pl(0xff80d0,.8,13,-5,4.4,12.5);pl(0xff9a50,.7,14,8,10.6,10);pl(0x4a7cff,.6,14,-7,12,6)}pl(0xb0a0ff,.9,18,0,12.6,-2);
 /* --- خامات (Canvas) --- */
 const rep=(t,x,y)=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(x,y);t.anisotropy=ani;return t};
 const wood=rep(cvt(512,512,(g,w,h)=>{const n=8,ph=h/n;for(let i=0;i<n;i++){g.fillStyle=`hsl(${20+Math.random()*7} ${40+Math.random()*12}% ${20+Math.random()*10}%)`;g.fillRect(0,i*ph,w,ph);for(let j=0;j<28;j++){g.strokeStyle=Math.random()<.5?`rgba(15,7,3,${.08+Math.random()*.12})`:`rgba(150,90,45,${.05+Math.random()*.1})`;g.beginPath();const y=i*ph+Math.random()*ph;g.moveTo(0,y);g.lineTo(w,y+(Math.random()-.5)*6);g.stroke()}g.fillStyle='rgba(0,0,0,.5)';g.fillRect(Math.random()*w,i*ph,2,ph);g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,i*ph,w,2)}}),7,6.5);
 const wallT=rep(cvt(256,256,(g,w,h)=>{g.fillStyle='#161a33';g.fillRect(0,0,w,h);for(let i=0;i<8;i++){g.fillStyle=i%2?'#1a1f3d':'#141830';g.fillRect(i*32,0,32,h);g.fillStyle='rgba(120,140,255,.07)';g.fillRect(i*32,0,2,h)}for(let i=0;i<4;i++){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,i*64,w,2)}}),8,2);
 const rugT=cvt(256,256,(g,w,h)=>{g.fillStyle='#2b2d35';g.fillRect(0,0,w,h);for(let i=0;i<2600;i++){const v=40+Math.random()*60|0;g.fillStyle=`rgba(${v},${v},${v+8},.55)`;g.fillRect(Math.random()*w,Math.random()*h,2,5)}});
 const crownP=(g,x,y,s,c)=>{g.save();g.translate(x,y);g.scale(s,s);g.beginPath();g.moveTo(-40,30);g.lineTo(-48,-20);g.lineTo(-22,0);g.lineTo(0,-40);g.lineTo(22,0);g.lineTo(48,-20);g.lineTo(40,30);g.closePath();g.lineWidth=6;g.strokeStyle=c;g.shadowColor=c;g.shadowBlur=22;g.lineJoin='round';g.stroke();g.restore()};
 const neon=(g,s,x,y,f,c,b,al)=>{g.font=f;g.textAlign=al||'center';g.shadowColor=c;g.shadowBlur=b||24;g.fillStyle='#fff';g.strokeStyle=c;g.lineWidth=3;g.strokeText(s,x,y);g.fillText(s,x,y);g.shadowBlur=0};
 const F='800 90px Poppins,Arial,sans-serif';
 const tSquad=cvt(1024,512,(g,w,h)=>{crownP(g,330,130,2.6,'#6f9bff');g.save();g.translate(80,330);g.rotate(.05);neon(g,'The Squad',0,0,'800 150px Poppins,Arial,sans-serif','#3f7cff',28,'left');neon(g,'More Than Just a Game',10,92,'600 56px Poppins,Arial,sans-serif','#4f86ff',16,'left');g.restore()});
 const tScreen=cvt(1024,430,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'#101f6e');q.addColorStop(1,'#0a1038');g.fillStyle=q;g.fillRect(0,0,w,h);g.fillStyle='#16318f';g.beginPath();g.moveTo(0,h);for(let i=0;i<=16;i++)g.lineTo(i*64,h*.62-Math.abs(Math.sin(i*1.7))*95);g.lineTo(w,h);g.fill();g.fillStyle='#0b1a5a';g.beginPath();g.moveTo(0,h);for(let i=0;i<=16;i++)g.lineTo(i*64,h*.78-Math.abs(Math.sin(i*2.3+1))*70);g.lineTo(w,h);g.fill();crownP(g,w/2,95,1.5,'#cfe0ff');neon(g,'The Squad',w/2,225,'800 92px Poppins,Arial,sans-serif','#6f9bff',20);neon(g,'🎮  Play   •   Chat   •   Make Friends',w/2,340,'600 44px Arial,sans-serif','#6f9bff',10)});
 const tMenu=cvt(512,512,(g,w,h)=>{g.fillStyle='#0d0f18';g.fillRect(0,0,w,h);g.strokeStyle='#caa46a';g.lineWidth=5;g.strokeRect(8,8,w-16,h-16);g.fillStyle='#f3e3c6';g.font='700 44px Poppins,Arial,sans-serif';g.textAlign='left';g.fillText('The Squad Café',32,78);g.font='600 33px Arial,sans-serif';[['Espresso','2.5'],['Americano','3.0'],['Cappuccino','3.5'],['Latte','4.0'],['Mocha','4.0'],['Hot Chocolate','3.0'],['Iced Coffee','3.5']].forEach(([a,b],i)=>{g.fillStyle='#e8dcc4';g.textAlign='left';g.fillText(a,36,148+i*50);g.textAlign='right';g.fillText(b,w-36,148+i*50)})});
 const tFood=cvt(256,320,(g,w,h)=>{g.fillStyle='#0b0a10';g.fillRect(0,0,w,h);g.fillStyle='#ffd27a';g.shadowColor='#ff9a30';g.shadowBlur=18;g.font='700 62px Georgia,serif';g.textAlign='left';['Good','Food','Great','Friends'].forEach((s,i)=>g.fillText(s,24,70+i*68))});
 const tGaming=cvt(300,400,(g,w,h)=>{g.fillStyle='#070b1c';g.fillRect(0,0,w,h);g.strokeStyle='#3f8cff';g.lineWidth=5;g.shadowColor='#3f8cff';g.shadowBlur=16;g.strokeRect(10,10,w-20,h-20);neon(g,'GAMING',w/2,90,'700 52px Arial Narrow,Arial,sans-serif','#4f9bff',16);g.lineWidth=6;g.strokeStyle='#cfe4ff';g.beginPath();g.roundRect?g.roundRect(60,160,180,120,45):g.rect(60,160,180,120);g.stroke();g.beginPath();g.moveTo(105,195);g.lineTo(105,245);g.moveTo(80,220);g.lineTo(130,220);g.stroke();g.beginPath();g.arc(190,205,9,0,7);g.arc(212,232,9,0,7);g.stroke()});
 const tPS=cvt(512,160,(g,w,h)=>{g.fillStyle='rgba(0,0,0,0)';neon(g,'PLAY  ZONE',w/2,92,'800 78px Poppins,Arial,sans-serif','#3f8cff',22);neon(g,'PS • BILLIARDS • CHILL',w/2,138,'600 28px Arial,sans-serif','#b06cff',10)});
 const tPS_TV=cvt(512,288,(g,w,h)=>{const q=g.createLinearGradient(0,0,w,h);q.addColorStop(0,'#1a2f8a');q.addColorStop(1,'#6a2cc0');g.fillStyle=q;g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<6;i++)g.fillRect(40+i*76,150+(i%3)*18,50,80);neon(g,'LET\'S PLAY',w/2,110,'800 56px Arial,sans-serif','#7fb4ff',12)});
 const art=(c1,c2,t,sx)=>cvt(160,240,(g,w,h)=>{const q=g.createLinearGradient(0,0,w,h);q.addColorStop(0,c1);q.addColorStop(1,c2);g.fillStyle=q;g.fillRect(0,0,w,h);g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.arc(w/2+sx,95,34,0,7);g.fill();g.fillRect(w/2+sx-46,125,92,140);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=4;g.strokeRect(5,5,w-10,h-10);g.fillStyle='#fff';g.font='800 21px Arial,sans-serif';g.textAlign='center';g.shadowColor='#000';g.shadowBlur=6;g.fillText(t,w/2,222)});
 const tCity=cvt(1024,512,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'#150a3a');q.addColorStop(.6,'#2a1260');q.addColorStop(1,'#10153c');g.fillStyle=q;g.fillRect(0,0,w,h);for(let i=0;i<46;i++){const bw=40+Math.random()*60,bh=110+Math.random()*300,bx=Math.random()*w;g.fillStyle=`hsl(${230+Math.random()*50} 45% ${9+Math.random()*9}%)`;g.fillRect(bx,h-bh,bw,bh);for(let j=0;j<bh/14;j++)for(let k=0;k<bw/12;k++)if(Math.random()<.33){g.fillStyle=['#ffd27a','#7ff6ff','#ff6ad5','#fff'][Math.random()*4|0];g.globalAlpha=.55+Math.random()*.4;g.fillRect(bx+4+k*12,h-bh+6+j*14,5,7);g.globalAlpha=1}}[['#ff3fb4',170,230],['#3fe0ff',560,150],['#7aff6a',820,260]].forEach(([c,x,y])=>{g.fillStyle=c;g.shadowColor=c;g.shadowBlur=22;g.fillRect(x,y,70,24);g.shadowBlur=0})});
 const scrn=(c1,c2)=>cvt(128,80,(g,w,h)=>{const q=g.createLinearGradient(0,0,w,h);q.addColorStop(0,c1);q.addColorStop(1,c2);g.fillStyle=q;g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<7;i++)g.fillRect(Math.random()*100,Math.random()*60,12+Math.random()*16,6+Math.random()*12)});
 const sc1=scrn('#0a5a8a','#12c3ff'),sc2=scrn('#4a0a7a','#ff3fc8'),sc3=scrn('#0a2a6a','#3f6cff');
 const glT=cvt(128,128,(g,w,h)=>{const q=g.createRadialGradient(64,64,0,64,64,64);q.addColorStop(0,'rgba(255,255,255,1)');q.addColorStop(.25,'rgba(255,255,255,.45)');q.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=q;g.fillRect(0,0,128,128)});
 const outl=(c)=>cvt(256,160,(g,w,h)=>{g.strokeStyle=c;g.lineWidth=14;g.shadowColor=c;g.shadowBlur=24;g.strokeRect(22,22,w-44,h-44)});
 const pn=(w,h,map,x,y,z,ry,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h,o.sw||1,o.sh||1),o.lit?(o.ph?new THREE.MeshPhongMaterial({map,color:o.col||0xffffff,specular:0x7a7a99,shininess:60}):new THREE.MeshLambertMaterial({map,color:o.col||0xffffff})):new THREE.MeshBasicMaterial({map,transparent:!!(o.tr||o.add),depthWrite:!(o.tr||o.add),blending:o.add?THREE.AdditiveBlending:THREE.NormalBlending,opacity:o.op==null?1:o.op,color:o.col||0xffffff}));m.position.set(x,y,z);m.rotation.set(o.rx||0,ry||0,0);sc.add(m);return m};
 const glw=(x,y,z,c,s,op)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glT,color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:op==null?.6:op}));sp.position.set(x,y,z);sp.scale.set(s,s,1);sc.add(sp)};
 /* --- أرضية وجدران وسقف --- */
 pn(HW*2,HB+HF,wood,0,0,(HF-HB)/2,0,{lit:1,rx:-Math.PI/2,sw:26,sh:26,col:0xe6c8b0,ph:1});
 const wl=(w,x,y,z,ry)=>{const t=wallT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/3.2,2);pn(w,7,t,x,y,z,ry,{lit:1,sw:Math.ceil(w/2),sh:4})};
 wl(HW*2,0,3.5,-HD,0);wl(HW*2,0,3.5,HF,Math.PI);wl(HB+HF,-HW,3.5,(HF-HB)/2,Math.PI/2);wl(HB+HF,HW,3.5,(HF-HB)/2,-Math.PI/2);
 /* v29: سقف الدور الأرضي = بلاطة أرضية الدور الثالث (فيها فتحة السلم الجديد عند الحيطة الأمامية) */
 const carpT=cvt(128,128,(g,w,h)=>{g.fillStyle='#1c0b13';g.fillRect(0,0,w,h);for(let i=-4;i<9;i++){g.strokeStyle=i%2?'rgba(120,30,50,.28)':'rgba(217,164,65,.14)';g.lineWidth=2;g.beginPath();g.moveTo(i*16,0);g.lineTo(i*16+128,128);g.stroke();g.beginPath();g.moveTo(i*16+128,0);g.lineTo(i*16,128);g.stroke()}for(let i=0;i<500;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.05})`;g.fillRect(Math.random()*w,Math.random()*h,2,2)}});
 [[26,23.8,0,1.9],[13.9,2.2,-6.05,14.9]].forEach(([w,d,x,z])=>{B(w,.4,d,0x0b0d1c,x,7.2,z);const t=carpT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/2.2,d/2.2);pn(w,d,t,x,7.41,z,0,{lit:1,rx:-Math.PI/2,sw:Math.ceil(w/2),sh:Math.ceil(d/2),col:0xc8a0a8})});
 /* سقف: عوارض خشب + مواسير + إضاءة */
 for(let i=0;i<9;i++)B(.28,.3,HB+HF,0x3a2517,-11.5+i*2.9,6.82,(HF-HB)/2);B(HW*2,.14,.14,0x1a1b26,0,6.55,-3);B(HW*2,.14,.14,0x1a1b26,0,6.55,4);
 B(.12,.06,4,0xffffff,-9,6.95,-1,{k:'b',ry:.5});B(.12,.06,4,0xffffff,-5.5,6.95,-4,{k:'b',ry:.5});B(.12,.06,4,0xffffff,12,6.95,-2,{k:'b',ry:-.4});
 Tor(1.15,0xfff0d0,5,5.8,-2,{k:'b'});[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>Cy(.012,1.1,0x222,5+a*.8,6.3,-2+b*.8,{n:4}));glw(5,5.8,-2,0xffe0a0,4.5,.5);
 /* نيون محيط الغرفة */
 B(HW*2,.08,.1,0x2d8cff,0,6.35,-HD+.1,{k:'b'});B(.1,.08,HB+HF,0x8a5cff,-HW+.1,6.35,(HF-HB)/2,{k:'b'});B(.1,.08,HB+HF,0x2d8cff,HW-.1,6.35,(HF-HB)/2,{k:'b'});B(HW*2,.06,.08,0x8a5cff,0,.2,-HD+.1,{k:'b'});B(.08,.06,HB+HF,0x2d8cff,HW-.1,.15,(HF-HB)/2,{k:'b'});
 /* اللافتة الكبيرة + شاشة الصالة */
 pn(7.2,3.6,tSquad,-8,5,-HD+.06,0,{tr:1});B(.1,.1,5,0x3f7cff,-2.4,5.2,-HD+.1,{k:'b',rz:.6});
 pn(4.8,2.0,tScreen,4.2,1.95,-HD+.08,0);B(5,2.2,.12,0x070912,4.2,1.95,-HD+.04);B(5.05,.04,.04,0x3f6cff,4.2,3.07,-HD+.1,{k:'b'});
 [1.3,7.1].forEach(x=>{B(.5,1.5,.4,0x0d0f1b,x,.85,-HD+.3);Cy(.15,.04,0x15306a,x,1.3,-HD+.52,{rx:Math.PI/2,n:12,k:'b'});Cy(.09,.04,0x15306a,x,.7,-HD+.52,{rx:Math.PI/2,n:12,k:'b'})});O.push([1.3,-9.7,.3,.25,0],[7.1,-9.7,.3,.25,0]);
 [[-1.9,'#7a2cff','#18c0ff','HERO',0],[-.7,'#ff3f9a','#4a2cff','PLAY TOGETHER',8]].forEach(([x,a,b,t,s])=>pn(.95,1.45,art(a,b,t,s),x,2.0,-HD+.07,0));
 pn(2.5,2.8,tFood,11.2,4.7,-HD+.06,0);pn(2.3,3.1,tGaming,HW-.08,4.5,3.7,-Math.PI/2);glw(HW-.5,4.5,3.7,0x3f8cff,3.6,.25);
 /* v31: باب الحي (بوابة نيون في الحيطة الشمال) */
  {const tP=cvt(256,384,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'#2a1670');q.addColorStop(.55,'#0f6fb8');q.addColorStop(1,'#07263f');g.fillStyle=q;g.fillRect(0,0,w,h);g.globalAlpha=.35;for(let i=0;i<16;i++){const bh=60+(i*37%140);g.fillStyle=i%2?'#7ff6ff':'#c79bff';g.fillRect(14+i*14,h-bh,10,bh)}g.globalAlpha=1;g.fillStyle='#fff';g.font='800 64px sans-serif';g.textAlign='center';g.fillText('🏙️',w/2,150)}),
   tS=cvt(512,128,(g,w,h)=>{neon(g,'🏙️ الحي المفتوح',w/2,86,'800 56px Cairo,Arial,sans-serif','#3fe0ff',18)});
   pn(2.5,3.3,tP,-12.78,1.75,PORTAL[1],Math.PI/2);
   [-1,1].forEach(s=>{B(.28,3.7,.28,0x151a33,-12.6,1.85,PORTAL[1]+s*1.4);B(.07,3.5,.07,0x3fe0ff,-12.45,1.75,PORTAL[1]+s*1.4,{k:'b'})});
   B(.3,.28,3.1,0x151a33,-12.6,3.75,PORTAL[1]);B(.07,.07,2.8,0x3fe0ff,-12.45,3.58,PORTAL[1],{k:'b'});
   pn(2.9,.72,tS,-12.5,4.35,PORTAL[1],Math.PI/2,{tr:1});glw(-12.3,1.8,PORTAL[1],0x3fe0ff,4.5,.35)}
  /* شبابيك المدينة (يمين) */
 pn(11.6,4.6,tCity,HW-.05,3.9,-3.6,-Math.PI/2);for(let i=0;i<7;i++)B(.12,4.7,.12,0x080a14,HW-.1,3.9,-9.4+i*1.93);B(.14,.12,11.7,0x080a14,HW-.1,1.6,-3.6);B(.14,.12,11.7,0x080a14,HW-.1,6.2,-3.6);B(.14,.12,11.7,0x080a14,HW-.1,3.9,-3.6);
 /* --- الطابق العلوي (ميزانين) --- */
 B(13.5,.3,4.6,0x2c1b11,3.75,Y2-.15,-7.7);B(13.5,.1,.2,0x4a2c18,3.75,Y2+1.02,-5.4);B(13.5,.05,.05,0x3f8cff,3.75,Y2-.1,-5.28,{k:'b'});
 [-2.9,3.8,10.4].forEach(x=>{B(.4,Y2,.4,0x151829,x,Y2/2,-5.45);B(.04,Y2-.4,.04,0x3f8cff,x+.22,Y2/2,-5.2,{k:'b'});O.push([x,-5.45,.25,.25,0])});
 for(let i=0;i<14;i++)B(.04,1,.04,0x1a1b26,-2.7+i*.98,Y2+.5,-5.4);B(13.5,.04,.04,0xbfe0ff,3.75,Y2+.93,-5.4,{k:'b'});{const gl=new THREE.Mesh(new THREE.PlaneGeometry(13.5,.85),new THREE.MeshBasicMaterial({color:0x7ab4ff,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide}));gl.position.set(3.75,Y2+.5,-5.4);sc.add(gl)}
 /* السلالم */
 for(let i=0;i<16;i++){const tp=(i+1)*.2;B(.32,tp,1.6,0x5a3a20,-8+.3125*(i+.5),tp/2,-6.1);B(.02,.03,1.6,0x3f8cff,-8+.3125*i+.01,tp,-6.1,{k:'b'})}
 B(5.2,.07,.07,0x4a2c18,-5.5,2.4,-5.25,{rz:.5});B(5.2,.07,.07,0x4a2c18,-5.5,2.4,-6.95,{rz:.5});B(.04,1.1,.04,0x1a1b26,-3.05,Y2+.55,-5.3);
 O.push([-5.5,-5.2,2.6,.1,0],[-5.5,-8.5,2.6,1.475,0],[-3,-6.1,.3,.85,0]);
 /* ---------- أدوات أثاث ---------- */
 const sofa=(x,z,w,ry,c,c2,pc)=>{const sw=Math.abs(Math.sin(ry))>.7;shadow(x,z+.05,sw?1.9:w+.5,sw?w+.5:1.9);return sofa2(x,z,w,ry,c,c2,pc)},sofa2=(x,z,w,ry,c,c2,pc)=>IN(TR(x,0,z,0,ry,0),()=>{B(w,.42,1,c,0,.21,0);B(w,.66,.28,c,0,.75,.36);[-1,1].forEach(q=>B(.26,.62,1,c,q*(w/2-.13),.4,0));const n=Math.max(2,Math.round((w-.5)/.85)),cw=(w-.52)/n;for(let i=0;i<n;i++){B(cw-.04,.14,.84,c2,-w/2+.26+cw*(i+.5),.49,-.04);B(cw-.06,.5,.16,c2,-w/2+.26+cw*(i+.5),.8,.2,{rx:-.18})}if(pc!=null)B(.42,.42,.14,pc,-w/2+.55,.74,.05,{rz:.35})});
 const chair=(x,z,ry)=>(shadow(x,z,.9,.9),chair2(x,z,ry)),chair2=(x,z,ry)=>IN(TR(x,0,z,0,ry,0),()=>{Cy(.22,.05,0x1c2036,0,.5,0);B(.4,.5,.05,0x1c2036,0,.78,.2);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>Cy(.022,.5,0x111,a*.17,.25,b*.17,{n:5}))});
 const rtable=(x,z,r)=>{shadow(x,z,r*2+.8,r*2+.8);Cy(r,.06,0x6a4a2a,x,.78,z,{n:20});Cy(.07,.78,0x15151f,x,.39,z,{n:6});Cy(.4,.04,0x15151f,x,.02,z,{n:12});Cy(.09,.02,0xf2f2f2,x+r*.4,.83,z,{n:8});Cy(.07,.07,0xffffff,x+r*.4,.87,z+.05,{n:8});Cy(.09,.02,0xf2f2f2,x-r*.3,.83,z+r*.3,{n:8})};
 const stool=(x,z,y)=>{Cy(.24,.07,0x1a1d30,x,y,z,{n:10});Cy(.03,y,0x111,x,y/2,z,{n:5});Cy(.2,.03,0x111,x,.28,z,{n:8})};
 const plant=(x,z,s,y0,ob)=>{s=s||1;y0=y0||0;if(y0<Y2+.5)shadow(x,z,1.5*s,1.5*s,y0);Cy(.3*s,.5*s,0x2a1a12,x,y0+.25*s,z,{n:8,t:.85});Cy(.27*s,.04,0x0d0a08,x,y0+.5*s,z,{n:8});
  for(let i=0;i<16;i++){const a=i*2.4+x*3,tl=.12+(i%4)*.2,hh=.4+(i%3)*.13,gc=[0x1f7a3a,0x2a9a4a,0x17602e,0x35b05a][i%4];IN(TR(x,y0+.5*s,z,0,a,0),()=>IN(TR(.04*s,0,0,0,0,-tl),()=>Sp(1,gc,0,hh*s,0,{sx:.15*s,sy:hh*s,sz:.035*s,a:6,b:4})))}
  if(ob!==0)O.push([x,z,.3*s,.3*s,0])};
 const cup=(x,y,z)=>{Cy(.05,.07,0xffffff,x,y+.035,z,{n:8});Cy(.075,.01,0xe8e8f0,x,y,z,{n:8})};
 const poolT=(x,y,z,glow)=>{shadow(x,z,4.2,2.7,y);IN(TR(x,y,z,0,0,0),()=>{B(3.1,.3,1.7,0x1b1e34,0,.83,0);[[-1.3,-.65],[1.3,-.65],[-1.3,.65],[1.3,.65]].forEach(([a,b])=>B(.22,.7,.22,0x15182a,a,.35,b));B(2.6,.04,1.2,0x2a3fb8,0,.99,0);B(3.1,.1,.22,0x5a3a1c,0,1.04,-.74);B(3.1,.1,.22,0x5a3a1c,0,1.04,.74);B(.22,.1,1.7,0x5a3a1c,-1.44,1.04,0);B(.22,.1,1.7,0x5a3a1c,1.44,1.04,0);[[-1.35,-.7],[0,-.74],[1.35,-.7],[-1.35,.7],[0,.74],[1.35,.7]].forEach(([a,b])=>Cy(.08,.05,0x000000,a,1.01,b,{n:8}));[0xe53935,0xfdd835,0x1e88e5,0xffffff,0x8e24aa,0x43a047,0xff8f00].forEach((c,i)=>Sp(.045,c,.55+(i%3)*.1,1.05,-.15+i*.05,{a:6,b:5}));B(1.5,.02,.02,0xc8a060,-.6,1.05,.5,{ry:.2});B(3.1,.04,.04,0x2d8cff,0,.55,.86,{k:'b'});B(3.1,.04,.04,0x2d8cff,0,.55,-.86,{k:'b'})})};
 /* --- أرضيات إضافية: سجاد + توهج النيون --- */
 pn(5.8,4,rugT,-7.2,.025,3.6,0,{lit:1,rx:-Math.PI/2,col:0x9aa0b0});pn(3.4,2.4,rugT,4,.025,-6,0,{lit:1,rx:-Math.PI/2,col:0x7a7a90});
 pn(5.2,3.4,outl('#2d6cff'),POOL[0],.04,POOL[1],0,{add:1,rx:-Math.PI/2});pn(4.4,3,outl('#6a8cff'),POOL2[0],Y2+.04,POOL2[1],0,{add:1,rx:-Math.PI/2});
 /* --- البار (على الحيطة الشمال) --- */
 shadow(-11.3,-5,2,9.6);B(1.1,1.1,8.6,0x6a4125,-11.3,.55,-5);B(1.3,.08,8.8,0x8a5a32,-11.3,1.14,-5);B(.04,.07,8.6,0xff9a3c,-10.74,.15,-5,{k:'b'});B(.04,.05,8.8,0xffb060,-10.64,1.1,-5,{k:'b'});
 for(let i=0;i<7;i++){stool(-10.1,-8.6+i*1.2,.78);O.push([-10.1,-8.6+i*1.2,.3,.3,0])}
 O.push([-11.3,-5,.7,4.5,0]);
 [1.55,2.25,2.95].forEach((y,k)=>{B(.45,.06,8.2,0x5a3a20,-12.72,y,-5);for(let i=0;i<18;i++){const z=-8.8+i*.46+(k%2)*.1,c=[0xd8d0c0,0x3a6a8a,0xc4803a,0x7a2c2c,0x2a8a5a,0xe8e8f0][(i+k)%6];if((i+k)%3==0)Cy(.07,.2,c,-12.72,y+.13,z,{n:6});else if((i+k)%3==1)Cy(.045,.28,c,-12.72,y+.17,z,{n:6});else cup(-12.72,y+.03,z)}B(.04,.04,8.2,0xffa860,-12.5,y-.04,-5,{k:'b'})});
 B(.8,.5,1.3,0x14151f,-11.4,1.43,-2.4);B(.7,.04,1.15,0xffe0a0,-11.4,1.7,-2.4,{k:'b'});[[0,0],[.3,.2],[-.25,-.3]].forEach(([a,b],i)=>Sp(.09,[0xc89050,0xe8c070,0xa05a30][i],-11.4+a*.5,1.63,-2.4+b,{sy:.5}));
 B(.5,.45,.5,0x1c1d28,-11.4,1.6,-7);B(.3,.12,.3,0x888,-11.4,1.9,-7);B(.35,.3,.35,0x1c1d28,-11.3,1.4,-8.2);cup(-11.2,1.18,-4.2);cup(-11.2,1.18,-3.4);cup(-11.2,1.18,-6.2);
 pn(2.9,2.9,tMenu,-HW+.12,4.75,-5.4,Math.PI/2);
 [-8,-5.5,-3,-.5].forEach(z=>{Co(.28,.22,0x15151f,-11.2,4.7,z,{n:10});Cy(.008,1.5,0x111,-11.2,5.5,z,{n:4});Sp(.09,0xffe0a8,-11.2,4.55,z,{k:'b',a:6,b:5});glw(-11.2,4.4,z,0xffa850,1.6,.55)});
 /* --- منطقة الجلسة (يسار قدام): كنبات + ترابيزة + بين باج --- */
 sofa(-8,6.1,5,0,0x1b2142,0x252d58,0x2a58b8);sofa(-11.3,3.4,4.4,-Math.PI/2,0x1b2142,0x252d58,0x3a2a78);
 O.push([-8,6.1,2.6,.6,0],[-11.3,3.4,.6,2.3,0]);
 IN(TR(-8,0,3,0,0,0),()=>{B(1.9,.08,1.1,0x7a4a24,0,.46,0);B(1.7,.04,.9,0x4a2c18,0,.18,0);[[-.8,-.45],[.8,-.45],[-.8,.45],[.8,.45]].forEach(([a,b])=>B(.05,.42,.05,0x1a1a22,a,.24,b));cup(.4,.5,.2);cup(-.3,.5,-.1);B(.16,.04,.1,0x15151f,-.5,.52,.2,{ry:.4});plant(0,0,.3,.5,0)});O.push([-8,3,1,.6,0]);
 shadow(-4.4,3.4,2.8,2.8);Sp(.95,0x14172a,-4.4,.5,3.4,{sy:.55,a:10,b:8});O.push([-4.4,3.4,.95,.95,0]);
 /* --- منطقة الشاشة الكبيرة تحت الميزانين --- */
 sofa(2.1,-6.8,2.7,0,0x1b2142,0x252d58,0x2a58b8);sofa(5.8,-6.8,2.7,0,0x1b2142,0x252d58,0x3a2a78);O.push([2.1,-6.8,1.4,.6,0],[5.8,-6.8,1.4,.6,0]);
 IN(TR(4,0,-8.3,0,0,0),()=>{B(1.5,.07,.7,0x7a4a24,0,.4,0);B(.06,.4,.06,0x1a1a22,-.65,.2,0);B(.06,.4,.06,0x1a1a22,.65,.2,0);cup(.2,.44,0)});O.push([4,-8.3,.85,.4,0]);
 B(.06,3,.06,0x151515,.0,1.5,-6.4);Co(.35,.4,0x2a2a38,0,3.1,-6.4,{n:12});Sp(.1,0xffd890,0,2.95,-6.4,{k:'b',a:6,b:5});glw(0,2.8,-6.4,0xffb060,2.2,.5);O.push([0,-6.4,.2,.2,0]);
 /* --- بلياردو أرضي + عوائق --- */
 poolT(POOL[0],0,POOL[1]);O.push([POOL[0],POOL[1],1.6,.95,0]);B(2.6,.05,.1,0xffffff,POOL[0],4.6,POOL[1],{k:'b'});Cy(.01,2.2,0x222,POOL[0]-1.1,5.7,POOL[1],{n:4});Cy(.01,2.2,0x222,POOL[0]+1.1,5.7,POOL[1],{n:4});
 glw(POOL[0],3.6,POOL[1],0x3f6cff,2.8,.45);
 /* --- فوتبول (يمين قدام) --- */
 shadow(9.8,7.4,3.3,2);IN(TR(9.8,0,7.4,0,0,0),()=>{B(2.4,.5,1.2,0x14182c,0,.95,0);[[-1,-.5],[1,-.5],[-1,.5],[1,.5]].forEach(([a,b])=>B(.12,.7,.12,0x0d0f1a,a*1.05,.35,b*.5));B(2.1,.04,.95,0x1f7a3a,0,1.22,0);B(.04,.05,.95,0xffffff,0,1.25,0);for(let i=0;i<4;i++){const x=-.8+i*.53;B(.03,.03,1.7,0xcfd4dc,x,1.4,0);Cy(.04,.12,0x222,x,1.4,.9,{rx:Math.PI/2,n:6});for(let j=0;j<3;j++)B(.07,.2,.06,i%2?0xe53935:0x1e88e5,x,1.33,-.3+j*.3)}B(2.4,.04,.04,0x2d8cff,0,.4,.62,{k:'b'});B(2.4,.04,.04,0x2d8cff,0,.4,-.62,{k:'b'});});O.push([9.8,7.4,1.35,.75,0]);
 glw(9.8,.3,7.4,0x2d6cff,3,.3);
 /* --- طاولات دايرية وكراسي --- */
 rtable(8.4,3.4,1.0);[[0,-1.4],[1.4,0],[-1.4,0],[0,1.4]].forEach(([a,b],i)=>chair(8.4+a,3.4+b,Math.atan2(a,b)));O.push([8.4,3.4,1,1,0]);
 rtable(4.8,6.2,.85);chair(4.8,7.3,0);chair(3.7,6.2,-Math.PI/2);chair(5.9,6.2,Math.PI/2);O.push([4.8,6.2,.9,.9,0]);
 /* --- مكاتب الألعاب (يمين) + أركيد --- */
 [-4.6,-3,-1.4,.2].forEach((z,i)=>{shadow(11.9,z,2.2,2);B(.9,.06,1.5,0x1b1f33,12.2,.75,z);B(.06,.72,1.4,0x14162a,12.55,.36,z);B(.9,.03,.03,i%2?0xb06cff:0x2d8cff,12.2,.7,z+.7,{k:'b'});B(.9,.03,.03,i%2?0xb06cff:0x2d8cff,12.2,.7,z-.7,{k:'b'});
  [-.45,.45].forEach((d,k)=>{B(.05,.5,.8,0x0a0c18,12.55,1.25,z+d,{ry:-d*.5});pn(.74,.44,[sc1,sc2,sc3][(i+k)%3],12.52,1.25,z+d,-Math.PI/2-(-d*.5),{});});
  B(.3,.02,.9,0x1a1a28,12.0,.79,z);B(.3,.015,.8,[0x3fe0ff,0xff3fc8][i%2],11.99,.8,z,{k:'b'});B(.26,.55,.5,0x14162a,12.55,.3,z+.7);B(.02,.45,.04,0xff3fc8,12.41,.3,z+.7,{k:'b'});
  IN(TR(11.2,0,z,0,-Math.PI/2,0),()=>{B(.55,.12,.55,0x15151f,0,.5,0);B(.52,.9,.12,0x15151f,0,1.0,.3);B(.04,.7,.13,i%2?0xb06cff:0xe53935,.24,1.0,.3);B(.04,.7,.13,i%2?0xb06cff:0xe53935,-.24,1.0,.3);B(.32,.22,.1,0x15151f,0,1.55,.3);[-.3,.3].forEach(q=>B(.06,.05,.4,0x15151f,q,.72,-.05));Cy(.05,.4,0x888,0,.25,0,{n:6});B(.7,.04,.07,0x222,0,.1,0);B(.07,.04,.7,0x222,0,.1,0)});
  O.push([12.2,z,.5,.8,0]);glw(12.3,1.2,z,i%2?0xd04cff:0x3fc0ff,2,.28)});
 [[ARC[0],ARC[1]],[ARC[0],ARC[1]+2.2]].forEach(([x,z],i)=>{B(1,2.2,1,0x15122e,x,1.1,z);pn(.8,.6,cvt(128,96,(g,w,h)=>{g.fillStyle=i?'#3a0a6e':'#063a5a';g.fillRect(0,0,w,h);g.fillStyle=i?'#ff7ad9':'#7ff6ff';g.textAlign='center';g.font='800 22px monospace';g.fillText('ARCADE',w/2,54)}),x-.51,1.5,z,-Math.PI/2);B(.1,.15,1,i?0xff4fd8:0x3fe0ff,x-.5,2.15,z,{k:'b'});O.push([x,z,.55,.55,0])});
 /* --- نباتات --- */
 [[-12.3,8.6,1.3],[-1.8,8.8,1.4],[12.2,8.8,1.2],[12.2,-9.2,1.2],[-2.6,-8.8,1.2],[9.8,-8.9,1.2],[-12.3,.2,1],[7.2,-5.0,.9],[-5.8,8.6,1]].forEach(([x,z,s])=>plant(x,z,s));
 /* --- الميزانين: PlayStation + بلياردو + طاولة --- */
 pn(1.8,.6,tPS,1,Y2+3.0,-HD+.08,0,{tr:1});
 IN(TR(0,Y2,0,0,0,0),()=>{B(2.8,1.6,.1,0x0a0b14,0,1.65,-9.88);pn(2.6,1.45,tPS_TV,0,Y2+1.65,-9.81,0);B(2.4,.5,.4,0x15182a,0,.25,-9.65);B(.12,.45,.3,0xf2f2f6,-.5,.7,-9.65);B(.04,.4,.02,0x3fa0ff,-.43,.7,-9.5,{k:'b'});B(.12,.45,.3,0xf2f2f6,.5,.7,-9.65);B(.04,.4,.02,0x3fa0ff,.57,.7,-9.5,{k:'b'});B(2.4,.03,.04,0x3f8cff,0,.5,-9.45,{k:'b'})});
 IN(TR(0,Y2,0),()=>{sofa(.4,-7.4,3.6,0,0x1b2142,0x2a3568,0x2a58b8);B(1.4,.07,.7,0x7a4a24,.4,.4,-8.5);B(.06,.4,.06,0x1a1a22,-.2,.2,-8.5);B(.06,.4,.06,0x1a1a22,1,.2,-8.5);B(.18,.03,.1,0x3a3a50,.2,.45,-8.5,{ry:.3});B(.18,.03,.1,0x3a3a50,.6,.45,-8.45,{ry:-.3})});
 O.push([.4,-7.4,1.9,.6,1],[.4,-8.5,.8,.4,1],[0,-9.65,1.3,.3,1]);
 Sp(.8,0x14172a,-1.9,Y2+.45,-8.7,{sy:.6,a:10,b:8});O.push([-1.9,-8.7,.8,.8,1]);Sp(.7,0x2a1a4a,-1.7,Y2+.4,-6.6,{sy:.6,a:10,b:8});O.push([-1.7,-6.6,.7,.7,1]);
 IN(TR(0,Y2,0),()=>{rtable(4.3,-6.4,.7);[[-1.1,0],[1.1,0]].forEach(([a])=>chair(4.3+a,-6.4,a<0?-Math.PI/2:Math.PI/2))});O.push([4.3,-6.4,.9,.9,1]);
 poolT(POOL2[0],Y2,POOL2[1]);O.push([POOL2[0],POOL2[1],1.6,.95,1]);B(2.6,.05,.1,0xffffff,POOL2[0],Y2+1.9,POOL2[1],{k:'b'});glw(POOL2[0],Y2+3,POOL2[1],0x3f6cff,2.6,.4);
 [[-2.4,-9.3],[10,-9.3]].forEach(([x,z])=>plant(x,z,1,Y2,0));[[-2.4,-9.3],[10,-9.3]].forEach(([x,z])=>O.push([x,z,.4,.4,1]));plant(3.6,-5.5,.5,Y2+1.02,0);plant(7.2,-5.5,.5,Y2+1.02,0);plant(-1.2,-5.5,.5,Y2+1.02,0);
 [[1.2,-6.8],[4.3,-6.4],[8,-6]].forEach(([x,z])=>{Co(.28,.2,0x15151f,x,Y2+3.9,z,{n:10});Cy(.008,1.2,0x111,x,Y2+4.6,z,{n:4});Sp(.08,0xffd890,x,Y2+3.8,z,{k:'b',a:6,b:5});glw(x,Y2+3.65,z,0xffb060,1.7,.5)});
 /* --- شخصيات ثابتة (جالسة/واقفة) --- */
 npc({x:-12.2,z:-3.8,y:0,ry:-Math.PI/2,pose:'barista',h:30,s:1,hr:1,st:0});
 npc({x:-8.9,z:6.15,sit:.56,ry:0,pose:'phone',h:210,s:3,hr:2,st:1,dk:1});
 npc({x:-11.25,z:2.4,sit:.56,ry:-Math.PI/2,pose:'idle',h:280,s:0,hr:4,st:0});
 npc({x:2.1,z:-6.75,sit:.56,ry:0,pose:'idle',h:200,s:2,hr:0,st:1});npc({x:6.3,z:-6.75,sit:.56,ry:0,pose:'idle',h:330,s:1,hr:3,st:3});
 [[-4.6,0],[-1.4,1],[.2,2]].forEach(([z,i])=>npc({x:11.2,z,sit:.56,ry:-Math.PI/2,pose:'type',h:[190,300,20][i],s:[1,0,3][i],hr:[2,4,1][i],st:[1,2,0][i],hs:1}));
 npc({x:9.8,z:3.4,sit:.5,ry:Math.PI/2,pose:'idle',h:120,s:2,hr:1,st:2});
 npc({x:-.3,z:-7.35,sit:Y2+.56,ry:0,pose:'ctrl',h:260,s:1,hr:2,st:1});npc({x:1.2,z:-7.35,sit:Y2+.56,ry:0,pose:'ctrl',h:15,s:3,hr:3,st:2});
 npc({x:5.85,z:-7.6,y:Y2,ry:-Math.PI/2,pose:'cue',h:170,s:0,hr:1,st:0});npc({x:5.4,z:-6.4,sit:Y2+.5,ry:Math.PI/2,pose:'idle',h:310,s:2,hr:4,st:3});
 [[-10,-HD+.4,0x3f8cff],[-3,-HD+.4,0x3f8cff],[4,-HD+.4,0x3f8cff],[11,-HD+.4,0x3f8cff]].forEach(([x,z,c])=>glw(x,6.2,z,c,3.6,.28));
 [-6,0,6].forEach(z=>{glw(-HW+.4,6.2,z,0x8a5cff,3.4,.28);glw(HW-.4,6.2,z,0x3f8cff,3.4,.28)});
 [-8.5,-5,-1.5].forEach(z=>glw(-10.7,1.1,z,0xffa050,2.6,.4));
 glw(-8,5,-HD+.5,0x3f7cff,7.5,.32);glw(4.2,1.95,-HD+.7,0x3f6cff,6.4,.38);glw(HW-.6,3.9,-3.6,0xa060ff,9,.12);glw(1,Y2+3,-HD+.6,0x3f8cff,3.2,.4);glw(11.2,4.7,-HD+.5,0xffa840,3,.3);
 [[ARC[0],ARC[1],0x3fe0ff],[ARC[0],ARC[1]+2.2,0xff4fd8]].forEach(([x,z,c])=>glw(x-.8,1.6,z,c,2.2,.35));
 glw(POOL[0],1.1,POOL[1],0x3f6cff,4.2,.3);glw(POOL2[0],Y2+1.1,POOL2[1],0x3f6cff,3.8,.3);
 /* ================= v29 مرحلة 1: تفاصيل ودفا للدور الأرضي ================= */
 const wainX=(x,z,w)=>{B(w,1.2,.06,0x2a1a12,x,.6,z);B(w,.1,.1,0x4a2c18,x,1.25,z);B(w,.2,.09,0x120c08,x,.1,z);for(let i=0;i<Math.floor(w/1.7);i++)B(.07,1,.08,0x3a2416,x-w/2+.85+i*1.7,.7,z)};
 const wainZ=(x,z,w)=>{B(.06,1.2,w,0x2a1a12,x,.6,z);B(.1,.1,w,0x4a2c18,x,1.25,z);B(.09,.2,w,0x120c08,x,.1,z);for(let i=0;i<Math.floor(w/1.7);i++)B(.08,1,.07,0x3a2416,x,.7,z-w/2+.85+i*1.7)};
 wainX(0,-HD+.04,26);wainX(0,HF-.04,26);wainZ(HW-.04,3,26);wainZ(-HW+.04,8.7,14.6);
 [[0,-HD+.1],[0,HF-.1]].forEach(([x,z])=>B(26,.2,.2,0x2a1a12,x,6.9,z));B(.2,.2,26,0x2a1a12,-HW+.1,6.9,3);B(.2,.2,26,0x2a1a12,HW-.1,6.9,3);
 [[-10.2,-5,1.9,9.8,0xff9a3c,.5],[4.2,-8,7,3.4,0x3f6cff,.4],[11.8,.5,2.6,7,0x9a4cff,.35],[-6.5,12.4,8,5.6,0xff4fd8,.28],[9,10.4,5,4,0x3fe0ff,.25]].forEach(([x,z,w,d,c,o])=>pn(w,d,glT,x,.03,z,0,{add:1,rx:-Math.PI/2,col:c,op:o}));
 for(let i=0;i<24;i++){const x=-12+i*1.04,y=5.8-Math.sin((i%8)/8*Math.PI)*.5;Sp(.06,0xffd890,x,y,11.2,{k:'b',a:6,b:5});if(i%2==0)glw(x,y,11.2,0xffc070,.9,.5)}
 /* ================= الصالة الأمامية (امتداد جديد 6م) ================= */
 pn(7,4.8,rugT,-6.5,.027,12.4,0,{lit:1,rx:-Math.PI/2,col:0x8a6aa8});
 sofa(-6.5,14.9,5.6,0,0x2a1b42,0x3a2a5e,0xd9a441);sofa(-6.5,10.1,5.6,Math.PI,0x2a1b42,0x3a2a5e,0x2a58b8);
 IN(TR(-6.5,0,12.5,0,0,0),()=>{B(2.2,.08,1.1,0x7a4a24,0,.46,0);B(2,.04,.9,0x4a2c18,0,.18,0);[[-.9,-.45],[.9,-.45],[-.9,.45],[.9,.45]].forEach(([a,b])=>B(.05,.42,.05,0x1a1a22,a,.24,b));cup(.5,.5,.2);cup(-.4,.5,-.1)});
 O.push([-6.5,14.9,3,.6,0],[-6.5,10.1,3,.6,0],[-6.5,12.5,1.2,.65,0]);
 chair(-10.4,12.5,-Math.PI/2);chair(-2.6,12.5,Math.PI/2);O.push([-10.4,12.5,.45,.45,0],[-2.6,12.5,.45,.45,0]);
 rtable(5,10.8,.9);chair(5,12,0);chair(3.8,10.8,-Math.PI/2);chair(6.2,10.8,Math.PI/2);O.push([5,10.8,1,1,0]);
 rtable(9.6,9.6,1);[[0,-1.4],[1.4,0],[-1.4,0],[0,1.4]].forEach(([a,b])=>chair(9.6+a,9.6+b,Math.atan2(a,b)));O.push([9.6,9.6,1.1,1.1,0]);
 [[-12.3,15,1.3],[.4,12.6,1.1],[12.2,9.4,1.1],[-12.3,9.3,1]].forEach(([x,z,s])=>plant(x,z,s));
 [[-10.6,15.2],[-2.4,15.2]].forEach(([x,z])=>{Cy(.04,2.2,0x15151f,x,1.1,z,{n:5});Co(.32,.4,0x2a2a38,x,2.4,z,{n:10});Sp(.1,0xffd890,x,2.25,z,{k:'b',a:6,b:5});glw(x,2.2,z,0xffa850,1.8,.5);O.push([x,z,.25,.25,0])});
 pn(5.6,1.6,cvt(512,150,(g,w,h)=>{neon(g,'THE LOUNGE',w/2,98,'800 84px Poppins,Arial,sans-serif','#ff4fd8',22)}),-6.5,4.8,HF-.07,Math.PI,{tr:1});glw(-6.5,4.8,HF-.5,0xff4fd8,6,.3);
 [[-11.4,'#ff4f8a','#4a2cff','LEVEL UP',0],[-10.1,'#2cd0ff','#2a2c8a','GG WP',-6],[-2.9,'#ffb02c','#7a1a4a','CHILL',6],[-1.6,'#4aff9a','#1a5a8a','SQUAD',0]].forEach(([x,a,b,t,s])=>pn(.95,1.45,art(a,b,t,s),x,2.7,HF-.07,Math.PI));
 pn(10.8,4.6,tCity,HW-.05,3.9,10.6,-Math.PI/2);for(let i=0;i<6;i++)B(.12,4.7,.12,0x080a14,HW-.1,3.9,5.5+i*2.05);B(.14,.12,11,0x080a14,HW-.1,1.6,10.6);B(.14,.12,11,0x080a14,HW-.1,6.2,10.6);
 pn(11,4.6,tCity,-HW+.05,3.9,10.6,Math.PI/2);for(let i=0;i<6;i++)B(.12,4.7,.12,0x080a14,-HW+.1,3.9,5.5+i*2.05);B(.14,.12,11,0x080a14,-HW+.1,1.6,10.6);B(.14,.12,11,0x080a14,-HW+.1,6.2,10.6);
 npc({x:-7.9,z:14.9,sit:.56,ry:0,pose:'idle',h:40,s:1,hr:2,st:0});npc({x:-5.2,z:14.9,sit:.56,ry:0,pose:'phone',h:260,s:2,hr:3,st:1});npc({x:-6.5,z:10.2,sit:.56,ry:Math.PI,pose:'idle',h:170,s:3,hr:1,st:3,dk:1});
 /* ================= السلم الكبير للسينما (ملازق الحيطة الأمامية، من الأرضي للدور الثالث) ================= */
 for(let i=0;i<37;i++){const tp=(i+1)*.2,x=12.4-.3108*(i+.5);B(.3108,tp,1.8,0x5a3a20,x,tp/2,14.8);B(.03,.03,1.8,0xff3a6a,12.4-.3108*i,tp+.004,14.8,{k:'b'})}
 B(13.67,.07,.07,0x4a2c18,6.65,Y3/2+.95,13.85,{rz:-.571});B(13.67,.04,.04,0xff7a9a,6.65,Y3/2+1.0,13.82,{rz:-.571,k:'b'});
 for(let i=0;i<6;i++){const x=11.3-i*2,tp=((12.4-x)/.3108)*.2;B(.05,1,.05,0x1a1b26,x,tp+.5,13.85)}
 O.push([6.2,13.75,5.45,.08,9],[12.25,13.75,.75,.08,2],[.55,14.8,.1,.95,0]);
 pn(3.4,1.1,cvt(512,160,(g,w,h)=>{neon(g,'🎬 CINEMA ▲',w/2,104,'800 76px Poppins,Arial,sans-serif','#ff3a5a',22)}),9.8,3.4,HF-.07,Math.PI,{tr:1});glw(9.8,3.4,HF-.5,0xff3a5a,5,.3);pn(2.6,2.6,glT,11.2,.03,12.6,0,{add:1,rx:-Math.PI/2,col:0xff3a6a,op:.6});
 /* ================= الدور الثالث: سينما ================= */
 const wu=(w,x,z,ry,c)=>{const t=wallT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/3.2,2);pn(w,6.8,t,x,10.8,z,ry,{lit:1,sw:Math.ceil(w/2),sh:3,col:c||0x6a5a86})};
 wu(26,0,-HD,0,0x3a3050);wu(26,0,HF,Math.PI);wu(HB+HF,-HW,(HF-HB)/2,Math.PI/2);wu(HB+HF,HW,(HF-HB)/2,-Math.PI/2);
 pn(26,26,cvt(8,8,g=>{g.fillStyle='#07080f';g.fillRect(0,0,8,8)}),0,14.2,3,0,{rx:Math.PI/2});
 for(let i=0;i<70;i++)Sp(.035,0xcfd8ff,-12+(i*7.3)%24,14.1,-9+(i*5.9)%24,{k:'b',a:4,b:3});
 [[26,.06,.06,0xff3a5a,0,14.05,-HD+.1],[26,.06,.06,0xff3a5a,0,14.05,HF-.1],[.06,.06,26,0x8a5cff,-HW+.1,14.05,3],[.06,.06,26,0x8a5cff,HW-.1,14.05,3],[26,.05,.05,0xd9a441,0,7.55,HF-.1],[.05,.05,26,0xd9a441,-HW+.1,7.55,3],[.05,.05,26,0xd9a441,HW-.1,7.55,3]].forEach(([w,h,d,c,x,y,z])=>B(w,h,d,c,x,y,z,{k:'b'}));
 const idleT=cvt(1024,576,(g,w,h)=>{const q=g.createLinearGradient(0,0,w,h);q.addColorStop(0,'#0a1038');q.addColorStop(1,'#3a0f4a');g.fillStyle=q;g.fillRect(0,0,w,h);crownP(g,w/2,170,1.7,'#cfe0ff');neon(g,'THE SQUAD CINEMA',w/2,330,'800 74px Poppins,Arial,sans-serif','#6f9bff',20);g.font='700 40px Cairo,Arial,sans-serif';g.fillStyle='#e8dcc4';g.textAlign='center';neon(g,'Watch  ·  Relax  ·  Enjoy',w/2,392,'600 38px Poppins,Arial,sans-serif','#8fb0ff',10);g.fillText('اختار فيلم من قايمة السينما 🍿',w/2,448)});
 B(10.4,5.9,.25,0x050508,0,10.6,-HD+.14);B(10.4,.08,.08,0xd9a441,0,13.6,-HD+.3,{k:'b'});B(10.4,.08,.08,0xd9a441,0,7.62,-HD+.3,{k:'b'});
 const CINSCR=pn(9.6,5.4,idleT,0,10.6,-HD+.28,0);
 [-1,1].forEach(q=>{B(1.5,6.7,.55,0x6e0f1e,q*6.4,10.75,-HD+.4);B(1.5,.12,.6,0xd9a441,q*6.4,7.5,-HD+.4);for(let i=0;i<4;i++)B(.06,6.6,.58,0x4a0914,q*6.4-.55+i*.37,10.75,-HD+.42);B(.8,2.2,.7,0x0d0d12,q*8.2,8.7,-HD+.5);Cy(.28,.05,0x1a1a22,q*8.2,8.2,-HD+.88,{rx:Math.PI/2,n:14});Cy(.12,.05,0x1a1a22,q*8.2,9.1,-HD+.88,{rx:Math.PI/2,n:12})});
 B(14.4,.9,.6,0x7e1425,0,13.65,-HD+.4);B(14.4,.07,.62,0xd9a441,0,13.2,-HD+.4);
 B(15,.3,2.2,0x1a0d12,0,Y3+.15,-8.9);B(15,.05,.05,0xff3a5a,0,Y3+.25,-7.78,{k:'b'});O.push([0,-8.9,7.5,1.1,2]);
 glw(0,10.6,-HD+1,0x6a8cff,13,.2);glw(0,7.9,-8,0xff3a5a,10,.2);
 const cseat=(x,z)=>{shadow(x,z,1,1,Y3);IN(TR(x,Y3,z,0,0,0),()=>{B(.9,.38,.88,0x15151b,0,.3,0);B(.86,.14,.8,0x24242d,0,.52,.02);B(.86,.9,.2,0x15151b,0,.85,.36,{rx:-.12});B(.82,.4,.14,0x24242d,0,1.1,.4,{rx:-.12});B(.1,.5,.86,0x0b0b0f,-.5,.5,0);B(.1,.5,.86,0x0b0b0f,.5,.5,0);B(.86,.04,.04,0xd9a441,0,.74,-.4,{k:'b'})})};
 [-4.6,-2.8,-1,.8,2.6].forEach(z=>{[-8.8,-7.75,-6.7,-5.65,-4.6,-1.05,0,1.05,4.6,5.65,6.7,7.75,8.8].forEach(x=>cseat(x,z));O.push([-6.7,z,2.6,.5,2],[0,z,1.6,.5,2],[6.7,z,2.6,.5,2]);});[-3.2,3.2].forEach(x=>B(.04,.04,26,0xff3a5a,x,Y3+.03,3,{k:'b'}));
 [[-6.7,-1,1,2,1,0],[-5.65,-1,3,3,2,1],[0,-2.8,2,0,3,1],[1.05,-2.8,1,1,0,3],[6.7,.8,3,2,4,0],[7.75,.8,0,2,1,2],[-7.75,2.6,2,3,0,3],[5.65,-4.6,0,1,2,1]].forEach(([x,z,s,h,hr,st])=>npc({x,z,sit:Y3+.59,ry:0,pose:'idle',h:[200,320,40,150][h%4],s,hr,st}));
 shadow(11.9,8,2,6.4,Y3);B(1.2,1.1,6,0x3a1a14,11.9,Y3+.55,8);B(1.4,.08,6.2,0xd9a441,11.9,Y3+1.14,8);B(.04,.07,6,0xff3a3a,11.28,Y3+.2,8,{k:'b'});O.push([11.9,8,.8,3.1,2]);
 IN(TR(12,Y3+1.18,6.4),()=>{B(.9,.15,.9,0xb02020,0,.08,0);B(.8,.9,.8,0xfff0c0,0,.62,0);B(.84,.1,.84,0xb02020,0,1.12,0);for(let i=0;i<14;i++)Sp(.09,0xfff4c8,Math.sin(i*2.1)*.28,.95+Math.abs(Math.cos(i*1.7))*.1,Math.cos(i*2.1)*.28,{a:5,b:4})});
 [8.2,9.2,10.2].forEach((z,i)=>{B(.4,.7,.4,0x14151f,12.1,Y3+1.5,z);B(.3,.04,.04,[0xff3a3a,0x3fe0ff,0x7aff6a][i],11.88,Y3+1.75,z,{k:'b'})});
 pn(3.2,1.4,cvt(512,224,(g,w,h)=>{g.fillStyle='#0d0f18';g.fillRect(0,0,w,h);g.strokeStyle='#d9a441';g.lineWidth=5;g.strokeRect(8,8,w-16,h-16);g.fillStyle='#ffd27a';g.font='800 58px Poppins,Arial,sans-serif';g.textAlign='center';g.fillText('POPCORN',w/2,92);g.fillStyle='#e8dcc4';g.font='600 34px Arial,sans-serif';g.fillText('Drinks  •  Snacks  •  Candy',w/2,160)}),HW-.08,Y3+3.2,8,-Math.PI/2);glw(HW-.5,Y3+3.2,8,0xffa850,3.6,.3);
 npc({x:12.75,z:8.6,y:Y3,ry:Math.PI/2,pose:'barista',h:20,s:0,hr:1,st:0});
 [[2.4,'#ff3a5a','#3a0f4a','THE LAST ROUND',0],[3.9,'#2cd0ff','#1a2c6a','NEON NIGHTS',-8],[5.4,'#ffb02c','#7a1a1a','GAME ON',6]].forEach(([z,a,b,t,s])=>pn(1.5,2.2,art(a,b,t,s),-HW+.06,Y3+2.6,z+9,Math.PI/2));
 [[-10,'#6a4cff','#14123a','SQUAD',0],[-7.8,'#ff4f8a','#3a1450','NIGHT',4],[-5.6,'#2cffb0','#0a3a4a','FINAL',-4]].forEach(([x,a,b,t,s])=>pn(1.5,2.2,art(a,b,t,s),x,Y3+2.6,HF-.07,Math.PI));
 pn(7.4,2.2,cvt(768,220,(g,w,h)=>{neon(g,'THE SQUAD CINEMA',w/2,120,'800 84px Poppins,Arial,sans-serif','#ff3a5a',24);neon(g,'SHOWTIME',w/2,190,'600 44px Poppins,Arial,sans-serif','#ffb870',12)}),-5,Y3+4.9,HF-.07,Math.PI,{tr:1});glw(-5,Y3+4.9,HF-.5,0xff3a5a,8,.3);
 IN(TR(0,Y3,0),()=>{rtable(-9,11.5,.8);stool(-7.9,11.5,.7);stool(-10.1,11.5,.7);stool(-9,12.6,.7);rtable(-3.6,9.3,.8);stool(-2.5,9.3,.7);stool(-4.7,9.3,.7)});O.push([-9,11.5,1.1,1.1,2],[-3.6,9.3,1.1,1.1,2]);
 [[-1.5,6.2],[1.5,6.2]].forEach(([x,z])=>{Cy(.05,1,0xd9a441,x,Y3+.5,z,{n:8});Sp(.09,0xd9a441,x,Y3+1.02,z,{a:6,b:5})});B(3,.04,.04,0xb01030,0,Y3+.85,6.2);O.push([0,6.2,1.6,.15,2]);
 [[-9.5,13.2],[3,13.2]].forEach(([x,z])=>plant(x,z,1.1,Y3,0));
 /* ================= v30: تفاصيل الصورة المرجعية (لوبي + منطقة الألعاب + السينما) ================= */
 const gold='#f3d77a',tTotem=cvt(768,448,(g,w,h)=>{const q=g.createLinearGradient(0,0,w,h);q.addColorStop(0,'#10122a');q.addColorStop(1,'#07080f');g.fillStyle=q;g.fillRect(0,0,w,h);g.strokeStyle=gold;g.lineWidth=6;g.strokeRect(10,10,w-20,h-20);g.textAlign='left';[['PLAY','#ffffff'],['CHAT','#ffffff'],['MAKE FRIENDS','#f3d77a']].forEach(([t,c],i)=>neon(g,t,70,130+i*100,'800 86px Poppins,Arial,sans-serif',i==2?'#e6a23c':'#4f86ff',18,'left'));crownP(g,650,90,1.3,'#f3d77a')});
 /* لوبي: شاشة «PLAY · CHAT · MAKE FRIENDS» على عمود */
 {const x=-.2,z=12.4;shadow(x,z,3,1.2);B(1.4,.1,.7,0x14151f,x,.05,z);B(.12,1.1,.12,0x1b1c28,x,.6,z);B(2.8,1.75,.14,0x07080e,x,1.95,z);B(2.8,.05,.16,0xf3d77a,x,2.84,z,{k:'b'});B(2.8,.05,.16,0xf3d77a,x,1.07,z,{k:'b'});pn(2.6,1.52,tTotem,x,1.95,z-.08,Math.PI);glw(x,1.95,z-.5,0x4f86ff,3.6,.3);O.push([x,z,1.45,.3,0])}
 /* ألعاب: لافتة كبيرة فوق المكاتب + إضاءة RGB + تاج */
 {const tPlay=cvt(1024,512,(g,w,h)=>{const q=g.createLinearGradient(0,0,0,h);q.addColorStop(0,'#0c1a5a');q.addColorStop(1,'#050a22');g.fillStyle=q;g.fillRect(0,0,w,h);crownP(g,w/2,150,2,'#cfe0ff');neon(g,'THE SQUAD',w/2,300,'800 110px Poppins,Arial,sans-serif','#4f86ff',24);neon(g,'PLAY  ·  CHAT  ·  CONNECT',w/2,390,'600 44px Poppins,Arial,sans-serif','#8fb0ff',12)});
  const X=HW-.1,Z=-2.2;B(.16,2.5,5.1,0x06070d,X,4.2,Z);B(.18,.06,5.1,0x3f8cff,X-.01,5.47,Z,{k:'b'});B(.18,.06,5.1,0xb06cff,X-.01,2.93,Z,{k:'b'});pn(4.9,2.3,tPlay,X-.1,4.2,Z,-Math.PI/2);glw(X-.6,4.2,Z,0x3f6cff,6,.3);
  B(.12,.07,7.4,0x3f8cff,HW-.9,2.6,-2.2,{k:'b'});B(.12,.07,7.4,0xb06cff,HW-1.1,2.6,-2.2,{k:'b'});glw(HW-1,2.5,-4.5,0x3f8cff,2.6,.4);glw(HW-1,2.5,0,0xb06cff,2.6,.4);
  pn(2.6,7.6,glT,HW-1.4,.035,-2.2,0,{add:1,rx:-Math.PI/2,col:0x5a4cff,op:.55});
  [-4.6,-3,-1.4,.2].forEach((zz,i)=>{B(.2,.4,.06,i%2?0xb06cff:0x2d8cff,12.9,2.1,zz,{k:'b'})})}
 /* سينما: جلد أسود + إضاءة دافئة عمودية + لافتة «Good Vibes» + مصابيح ممرّات */
 {const tVibe=cvt(512,360,(g,w,h)=>{g.fillStyle='#0b0907';g.fillRect(0,0,w,h);g.strokeStyle='#8a6508';g.lineWidth=4;g.strokeRect(8,8,w-16,h-16);g.save();g.rotate(-.06);g.translate(30,0);g.fillStyle='#ffd27a';g.shadowColor='#ff9a30';g.shadowBlur=16;g.font='italic 700 64px Georgia,serif';g.textAlign='left';['Good Vibes','Good Friends','Great Movies'].forEach((t,i)=>g.fillText(t,20+i*10,100+i*86));g.restore()});
  B(.14,2.5,3.5,0x0a0807,HW-.12,Y3+3.4,1.6);B(.16,.05,3.5,0xd9a441,HW-.14,Y3+4.65,1.6,{k:'b'});pn(3.3,2.3,tVibe,HW-.2,Y3+3.4,1.6,-Math.PI/2);glw(HW-.7,Y3+3.4,1.6,0xffa040,4,.25);
  [-8.2,-5.6,-3,-.4,4.8].forEach(z=>{B(.07,4.8,.09,0xffb050,HW-.1,Y3+2.7,z,{k:'b'});glw(HW-.55,Y3+2.7,z,0xffa040,3,.2);B(.09,4.8,.07,0xffb050,-HW+.1,Y3+2.7,z,{k:'b'});glw(-HW+.55,Y3+2.7,z,0xffa040,3,.2)});
  for(let i=0;i<8;i++){const z=-6.5+i*1.4;B(.05,.04,.5,0xffb050,-11.1,Y3+.03,z,{k:'b'});B(.05,.04,.5,0xffb050,11.1,Y3+.03,z,{k:'b'})}
  B(.1,.1,26,0xffb050,0,13.95,-HD+.2,{k:'b'});}
 window.SQ3={THREE,sc,screen:CINSCR,idle:idleT,Y3};
 flush();flushSh();built=1}
/* ---------- لاعبين ---------- */
function labelTex(u,n){const c=document.createElement('canvas');c.width=320;c.height=112;const g=c.getContext('2d');const t=new THREE.CanvasTexture(c);const draw=()=>{g.clearRect(0,0,320,112);g.fillStyle='rgba(8,12,30,.82)';g.beginPath();g.roundRect?g.roundRect(4,8,312,96,48):g.rect(4,8,312,96);g.fill();g.strokeStyle='#7ff6ff';g.lineWidth=3;g.stroke();
  g.save();g.beginPath();g.arc(56,56,40,0,7);g.clip();if(PH[u]&&LS[u]&&LS[u].complete&&LS[u].naturalWidth){g.drawImage(LS[u],16,16,80,80)}else{g.fillStyle=`hsl(${hsl(u)} 60% 45%)`;g.fillRect(16,16,80,80);g.fillStyle='#fff';g.font='800 44px sans-serif';g.textAlign='center';g.fillText((n||'؟').trim().charAt(0),56,72)}g.restore();
  g.fillStyle='#fff';g.font='700 30px Cairo,sans-serif';g.textAlign='right';g.fillText(String(n||'عضو').slice(0,12),300,68);t.needsUpdate=true};
 draw();return{t,draw,ph:0}}
/* ---------- v28d: شخصية قابلة للتخصيص (محفوظة في looks/{uid} ومتبعتة للكل في حقل k) ---------- */
const SKC=[0xf1c9a5,0xd9a47a,0xb87b55,0xffdcc0,0x8d5a3c,0x5c3a26],HRC=[0x1a1320,0x3b2314,0x0d0d18,0x6b3fa0,0x8a4b1f,0xd9a441,0x9a2a2a],PNC=[0x2a2f4a,0x1a1a22,0x3b4a6b,0x5a4a3a,0x6b2a3a,0x2a5a4a],HUES=[0,25,50,120,170,200,230,270,310];
const HSN=['قصير','شوكي','كعكة','طويل','مجعّد','أصلع'],ACN=['🎧 سماعة','🕶 نضارة','🧔 دقن','🧢 كاب'];
const deflook=u=>{const h=hue(u);return{sk:h%4,hr:(h>>2)%5,st:h%4,c:hsl(u),pc:6,ac:(h%2==0?1:0)|(h%5==0?2:0)}};
const encLook=l=>[l.sk,l.hr,l.st,l.c,l.pc,l.ac].join('.');
function parseLook(k){if(typeof k!='string'||!k)return null;const a=k.split('.').map(Number);if(a.length!=6||a.some(x=>!Number.isFinite(x)))return null;const c=(v,m)=>Math.max(0,Math.min(m,Math.round(v)));return{sk:c(a[0],5),hr:c(a[1],6),st:c(a[2],5),c:c(a[3],359),pc:c(a[4],6),ac:c(a[5],15)}}
const lookOf=(u,k)=>parseLook(k)||deflook(u);
let MYK='',ED=null;
function rebuildAv(u){const r=R[u];if(!r||!r.obj||!sc)return;const p=r.obj.position.clone(),ry=r.obj.rotation.y;sc.remove(r.obj);r.obj=mkAvatar(u,r.n,lookOf(u,r.k));r.obj.position.copy(p);r.obj.rotation.y=ry}
/* ---------- شخصيات ثابتة (متجمّعة مع الغرفة) ---------- */
function npc(o){const sk=[0xf1c9a5,0xd9a47a,0xb87b55,0xffdcc0][o.s||0],hr=[0x1a1320,0x3b2314,0x0d0d18,0x6b3fa0,0x8a4b1f][o.hr||0],sh=new THREE.Color(`hsl(${o.h||200},62%,${o.dk?22:46}%)`).getHex(),acc=new THREE.Color(`hsl(${((o.h||200)+160)%360},85%,62%)`).getHex(),pa=0x20243c;
 const sit=o.sit!=null,y0=sit?o.sit+.1-.8:(o.y||0),AR={idle:[.05,.1,.05,.1],phone:[.15,.15,.65,1.3],ctrl:[.7,1,.7,1],type:[.55,.95,.55,.95],cue:[.95,.5,.45,.95],barista:[.1,.2,.3,1.1]}[o.pose||'idle'],st=o.st||0;
 IN(TR(o.x,y0,o.z,0,o.ry||0,0),()=>{
  [-1,1].forEach(q=>{
   IN(TR(q*.13,.8,0,sit?1.45:0,0,0),()=>{Cy(.095,.4,pa,0,-.2,0,{n:7,t:.95});IN(TR(0,-.4,0,sit?-1.45:0,0,0),()=>{Cy(.085,.38,pa,0,-.19,0,{n:7,t:.95});B(.2,.11,.32,0xeeeef4,0,-.36,-.05);B(.2,.03,.33,acc,0,-.405,-.05)})});
   IN(TR(q*.34,1.38,0,AR[q<0?0:2],0,0),()=>{Cy(.075,.3,sh,0,-.15,0,{n:7});IN(TR(0,-.3,0,AR[q<0?1:3],0,0),()=>{Cy(.065,.28,sh,0,-.14,0,{n:7});Sp(.08,sk,0,-.3,0,{a:6,b:5})})})});
  Cy(.275,.2,pa,0,.84,0,{n:8});Cy(.28,.62,sh,0,1.12,0,{n:8,t:.9});Sp(.2,sh,0,1.43,.02,{sy:.4,sz:1.1,a:8,b:5});Cy(.285,.05,acc,0,.81,0,{n:8});Cy(.07,.12,sk,0,1.5,0,{n:6});
  if(o.pose=='cue')B(.03,.03,1.5,0xc8a060,.34,.95,-.8,{rx:.12});
  IN(TR(0,1.67,0,o.pose=='phone'?.32:0,0,0,.9,.9,.9),()=>{Sp(.27,sk,0,0,0,{sy:1.06,a:10,b:8});[-1,1].forEach(q=>{Sp(.06,sk,q*.27,-.02,0,{sx:.6,a:6,b:5});Sp(.065,0xffffff,q*.1,.03,-.235,{sy:1.2,sz:.5,a:6,b:5});Sp(.035,0x15151c,q*.1,.03,-.262,{sy:1.2,sz:.5,a:6,b:5});B(.11,.02,.02,hr,q*.1,.12,-.245,{rz:q*.15});Sp(.04,0xff9a9a,q*.17,-.06,-.22,{sy:.7,sz:.4,a:5,b:4})});
   Sp(.03,sk,0,-.02,-.27,{a:5,b:4});Sp(.05,0x8a2b3b,0,-.12,-.245,{sx:1.5,sy:.45,sz:.5,a:6,b:4});
   Sp(.31,hr,0,.06,.09,{a:10,b:8});Sp(.2,hr,0,.2,-.12,{sy:.45,sz:.8,a:8,b:5});
   if(st==1)for(let i=0;i<5;i++)Co(.07,.24,hr,(i-2)*.11,.3-Math.abs(i-2)*.03,-.03,{n:5,rz:(2-i)*.25});else if(st==2)Sp(.12,hr,0,.38,.06,{a:6,b:5});else if(st==3)Sp(.28,hr,0,-.12,.15,{sy:1.3,sz:.8,a:8,b:6});
   if(o.hs){B(.6,.04,.04,0x222233,0,.28,0);[-1,1].forEach(q=>Cy(.09,.07,acc,q*.3,0,0,{rz:Math.PI/2,n:8}))}})})}
/* ---------- شخصية اللاعب (متحركة) ---------- */
function mkAvatar(u,n,lk){lk=lk||deflook(u);const gr=new THREE.Group(),h=hue(u),dtl=h%4,st=lk.st,L=(c,e)=>new THREE.MeshPhongMaterial(e?{color:c,emissive:c,emissiveIntensity:.18,shininess:30,specular:0x2a2a3a}:{color:c,shininess:30,specular:0x2a2a3a});
 const shirt=new THREE.Color(`hsl(${lk.c},68%,52%)`),dark=new THREE.Color(`hsl(${(lk.c+200)%360},35%,22%)`),acc=new THREE.Color(`hsl(${(lk.c+160)%360},85%,62%)`),pant=lk.pc<6?PNC[lk.pc]:dark;
 const skin=L(SKC[lk.sk]),hair=L(HRC[lk.hr]);
 const M=(g,m,x,y,z,p)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);(p||gr).add(o);return o};
 const sph=(r,m,x,y,z,sx,sy,sz,p)=>{const o=M(new THREE.SphereGeometry(r,14,10),m,x,y,z,p);o.scale.set(sx||1,sy||1,sz||1);return o};
 const sh=M(new THREE.CircleGeometry(.5,16),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.35,depthWrite:false}),0,.02,0);sh.rotation.x=-Math.PI/2;
 /* الجسم كله جوه pv (محوره عند الحوض) عشان الميل والاهتزاز */
 const pv=new THREE.Group();pv.position.y=.8;gr.add(pv);const P2=(g,m,x,y,z,p)=>M(g,m,x,y-.8,z,p||pv);const S2=(r,m,x,y,z,sx,sy,sz,p)=>sph(r,m,x,y-.8,z,sx,sy,sz,p||pv);
 /* رجلين: فخذ + ركبة + جزمة */
 const leg=sx=>{const g=new THREE.Group();g.position.set(sx*.13,.8,0);gr.add(g);M(new THREE.CylinderGeometry(.1,.09,.4,10),L(pant),0,-.2,0,g);const kn=new THREE.Group();kn.position.y=-.4;g.add(kn);M(new THREE.CylinderGeometry(.09,.08,.38,10),L(pant),0,-.19,0,kn);M(new THREE.BoxGeometry(.2,.11,.32),L(0xf2f2f6),0,-.36,-.05,kn);M(new THREE.BoxGeometry(.2,.03,.33),L(acc,1),0,-.405,-.05,kn);return{g,kn}};
 const lgL=leg(-1),lgR=leg(1);
 const torso=P2(new THREE.CylinderGeometry(.25,.28,.62,14),L(shirt,1),0,1.12,0);
 P2(new THREE.CylinderGeometry(.285,.285,.07,14),L(dark),0,.82,0);P2(new THREE.TorusGeometry(.19,.05,8,16),L(acc,1),0,1.42,0).rotation.x=Math.PI/2;
 if(dtl==1)P2(new THREE.BoxGeometry(.26,.14,.05),L(0xffffff),0,1.05,-.27);else if(dtl==2)P2(new THREE.CylinderGeometry(.2,.2,.1,14),L(acc,1),0,1.2,0);
 /* دراعات: كتف + كوع + إيد */
 const arm=sx=>{const g=new THREE.Group();g.position.set(sx*.34,1.38-.8,0);pv.add(g);M(new THREE.CylinderGeometry(.08,.07,.3,10),L(shirt,1),0,-.15,0,g);const fa=new THREE.Group();fa.position.y=-.3;g.add(fa);M(new THREE.CylinderGeometry(.07,.06,.28,10),L(shirt,1),0,-.14,0,fa);sph(.085,skin,0,-.3,0,1,1,1,fa);return{g,fa}};
 const arL=arm(-1),arR=arm(1);
 P2(new THREE.CylinderGeometry(.07,.08,.12,10),skin,0,1.46,0);
 const head=new THREE.Group();head.position.y=1.63-.8;head.scale.setScalar(.9);pv.add(head);
 sph(.27,skin,0,0,0,1,1.06,1,head);[-1,1].forEach(q=>sph(.06,skin,q*.27,-.02,0,.6,1,1,head));
 [-1,1].forEach(q=>{sph(.065,L(0xffffff),q*.1,.03,-.235,1,1.2,.5,head);sph(.035,L(0x15151c),q*.1,.03,-.265,1,1.1,.5,head);sph(.012,L(0xffffff),q*.09,.05,-.285,1,1,1,head);M(new THREE.BoxGeometry(.11,.02,.02),hair,q*.1,.12,-.245,head).rotation.z=q*.15;sph(.045,L(0xff7a9a),q*.17,-.06,-.215,1,.7,.4,head)});
 sph(.03,skin,0,-.02,-.27,1,1,1,head);sph(.05,L(0x8a2b3b),0,-.12,-.245,1.5,.45,.5,head);
 if(st!=5){const cap=M(new THREE.SphereGeometry(.295,16,12,0,Math.PI*2,0,Math.PI*.52),hair,0,.02,.03,head);cap.rotation.x=.25;
  if(st==1)for(let i=0;i<5;i++){const c=M(new THREE.ConeGeometry(.07,.24,6),hair,(i-2)*.11,.28-Math.abs(i-2)*.03,-.03,head);c.rotation.z=(2-i)*.25}
  else if(st==2){sph(.12,hair,0,.36,.04,1,1,1,head)}else if(st==3){sph(.28,hair,0,-.08,.12,1,1.2,.8,head)}
  else if(st==4){for(let i=0;i<9;i++){const q=i*.7;sph(.1,hair,Math.cos(q)*.2,.2+(i%3)*.05,Math.sin(q)*.2+.03,1,1,1,head)}sph(.2,hair,0,.22,.04,1,.8,1,head)}
  else{sph(.3,hair,0,.02,.06,1,1,.9,head)}}
 if(lk.ac&1){M(new THREE.TorusGeometry(.3,.025,8,20,Math.PI),L(0x1c2240),0,.04,0,head);[-1,1].forEach(q=>{const e=M(new THREE.CylinderGeometry(.09,.09,.07,12),L(acc,1),q*.3,0,0,head);e.rotation.z=Math.PI/2})}
 if(lk.ac&2)[-1,1].forEach(q=>M(new THREE.TorusGeometry(.075,.012,6,14),L(0x111111),q*.1,.03,-.275,head));
 if(lk.ac&4)sph(.2,hair,0,-.2,-.07,1,.6,.75,head);
 if(lk.ac&8){sph(.31,L(acc),0,.09,.02,1,.7,1,head);M(new THREE.BoxGeometry(.3,.03,.22),L(acc),0,.08,-.32,head)}
 const lb=labelTex(u,n),sp=new THREE.Sprite(new THREE.SpriteMaterial({map:lb.t,transparent:true,depthTest:false}));sp.scale.set(2.2,.77,1);sp.position.y=2.3;sp.renderOrder=9;gr.add(sp);
 [torso,head,sp].forEach(m=>{m.userData.uid=u});
 gr.userData={uid:u,lb,body:torso,head,sp,n,pv,sh,legL:lgL.g,legR:lgR.g,kneeL:lgL.kn,kneeR:lgR.kn,armL:arL.g,armR:arR.g,foreL:arL.fa,foreR:arR.fa,torso,k:0,run:0,ph:(h%100)/10};sc.add(gr);return gr}
function animAv(o,mv,t,run,air){const d=o.userData;if(!d||!d.legL)return;d.k+=((mv?1:0)-d.k)*.2;d.run+=((run?1:0)-d.run)*.15;const k=d.k,ph=t/(110-d.run*36),w=Math.sin(ph)*k*(.75+d.run*.45),b=Math.sin(t/600+d.ph);
 if(air){d.legL.rotation.x=.7;d.legR.rotation.x=-.25;d.kneeL.rotation.x=-.9;d.kneeR.rotation.x=-.5;d.armL.rotation.x=-2.5;d.armR.rotation.x=-2.3;d.foreL.rotation.x=.3;d.foreR.rotation.x=.3;d.pv.rotation.set(0,0,0);d.pv.position.y=.8;return}
 d.legL.rotation.x=w;d.legR.rotation.x=-w;d.kneeL.rotation.x=-Math.max(0,-w)*1.15;d.kneeR.rotation.x=-Math.max(0,w)*1.15;
 d.armL.rotation.x=-w*.9;d.armR.rotation.x=w*.9;const el=k*(.3+d.run*.8);d.foreL.rotation.x=el;d.foreR.rotation.x=el;
 d.pv.position.y=.8+Math.abs(Math.sin(ph))*k*(.035+d.run*.035)+b*.006;d.pv.rotation.z=Math.sin(ph)*k*.055;d.pv.rotation.x=d.run*k*.2;d.torso.rotation.y=w*.3;d.torso.scale.y=1+b*.014;d.head.position.y=.83+b*.01}
const hitList=()=>{const a=[];Object.values(R).forEach(r=>r.obj&&a.push(r.obj.userData.body,r.obj.userData.head,r.obj.userData.sp));if(me&&me.uid&&R[me.uid]&&R[me.uid].obj){}return a};
function loadPh(u){if(!PH[u]){phLoad(u);return}if(LS[u]&&LS[u].src==PH[u])return;const i=new Image();i.onload=()=>{const r=R[u];r&&r.obj&&r.obj.userData.lb.draw()};i.src=PH[u];LS[u]=i}
/* ---------- الشبكة ---------- */
const col=p=>db.collection(`world/${ROOM}/${p}`);
function sendPos(force){const n=Date.now();if(!pRef||(!force&&!P.moved&&n-lastSent<10000)||(!force&&n-lastSent<500))return;lastSent=n;P.moved=0;
 pRef.set({n:nm().slice(0,40),x:+P.x.toFixed(2),z:+P.z.toFixed(2),r:+(((P.yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI+P.lv*10).toFixed(2),c:hsl(me.uid),k:MYK||'',t:FV.serverTimestamp()}).catch(()=>{if(!sendT){sendT=1;toast('مقدرتش أبعت موقعي. انشر قواعد Firebase الجديدة (world)')}})}
function onPlayers(s){const ds=[];s.forEach(d=>ds.push([d.id,d.data()]));let ref=0;ds.forEach(([,v])=>{if(v.t&&v.t.toMillis)ref=Math.max(ref,v.t.toMillis())});if(!ref)ref=Date.now();
 const seen=new Set();ds.forEach(([u,v])=>{const live=u==me.uid||!v.t||!v.t.toMillis||ref-v.t.toMillis()<STALE;if(!live)return;seen.add(u);let r=R[u];if(!r){const lv0=LVD(v.r);r=R[u]={n:v.n,x:v.x,z:v.z,yaw:v.r-lv0*10,tx:v.x,tz:v.z,tyaw:v.r-lv0*10,lv:lv0,y:gY(v.x,v.z,lv0),sp:0,k:u==me.uid?MYK:(v.k||'')};r.obj=mkAvatar(u,v.n,lookOf(u,r.k));r.obj.position.set(v.x,r.y,v.z)}
  r.n=v.n;r.tx=v.x;r.tz=v.z;r.lv=LVD(v.r);r.tyaw=v.r-r.lv*10;if(u!=me.uid&&(v.k||'')!==(r.k||'')){r.k=v.k||'';rebuildAv(u)}if(u!=me.uid||1)loadPh(u)});
 Object.keys(R).forEach(u=>{if(!seen.has(u)){R[u].obj&&sc.remove(R[u].obj);delete R[u]}});users()}
function users(){const a=Object.keys(R);$w('#wcnt').textContent=`${RN?'🔒 '+RN+' · ':''}👥 ${a.length} في الغرفة`;$w('#wusers').innerHTML=a.map(u=>`<div class="wu">${av(u,R[u].n)}<b>${esc(R[u].n||'عضو')}${u==me.uid?' (أنت)':''}</b></div>`).join('')||'<p class="mu">لوحدك دلوقتي</p>'}
function onMsgs(s){const a=[];s.forEach(d=>a.push(d.data()));a.sort((x,y)=>(x.t&&x.t.toMillis?x.t.toMillis():Date.now())-(y.t&&y.t.toMillis?y.t.toMillis():Date.now()));const el=$w('#wmsgs');el.innerHTML=a.slice(-30).map(m=>`<div><b>${esc(m.n||'عضو')}:</b> ${esc(m.tx)}</div>`).join('');el.scrollTop=el.scrollHeight}
let lastMsg=0;function sendMsg(){const i=$w('#win'),tx=i.value.trim();if(!tx||Date.now()-lastMsg<700)return;lastMsg=Date.now();i.value='';col('msgs').add({u:me.uid,n:nm().slice(0,40),tx:tx.slice(0,300),t:FV.serverTimestamp()}).catch(()=>toast('مقدرتش أبعت الرسالة. انشر قواعد Firebase الجديدة'))}
/* ---------- الحركة والرسم ---------- */
const blocked=(x,z,lv)=>{if(Math.abs(x)>HW-.6||z>HF-.6||z<-HB+.6)return 1;if(lv==1&&!(inMz(x,z)||inSt(x,z)))return 1;return O.some(o=>(o[4]==9||o[4]==2&&lv==2||o[4]==lv)&&Math.abs(x-o[0])<o[2]+.35&&Math.abs(z-o[1])<o[3]+.35)};
function frame(t){raf=requestAnimationFrame(frame);const dt=Math.min((t-last)/1000||.016,.05);last=t;
 let mvg=0,run=0;if(!G&&!ED){let f=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0)-jy,s=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)+jx;const l=Math.hypot(f,s);
  if(l>.05){mvg=1;run=(K.shift||((jx||jy)&&l>.92))?1:0;if(l>1){f/=l;s/=l}const sp=(run?7:4.2)*dt,sy=Math.sin(P.yaw),cy=Math.cos(P.yaw),dx=(-sy*f+cy*s)*sp,dz=(-cy*f-sy*s)*sp;if(!blocked(P.x+dx,P.z,P.lv))P.x+=dx;if(!blocked(P.x,P.z+dz,P.lv))P.z+=dz;P.moved=1;if(P.lv<2&&inSt(P.x,P.z))P.lv=(P.x+8)*.64>1.6?1:0;else if(P.lv!=1&&inS3(P.x,P.z))P.lv=s3(P.x)>.5?2:0}
  if(K.q||K.e){P.yaw+=((K.q?1:0)-(K.e?1:0))*1.9*dt;P.moved=1}
  if((K[' ']||K.jump)&&!P.air){P.vy=5.4;P.air=1}K.jump=0}
 if(P.air){P.vy-=15*dt;P.jy+=P.vy*dt;if(P.jy<=0){P.jy=0;P.air=0;P.vy=0}}
 P.y+=(gY(P.x,P.z,P.lv)-P.y)*Math.min(1,dt*12);
 const me_=R[me.uid];if(me_&&me_.obj){me_.obj.position.set(P.x,P.y+P.jy,P.z);me_.obj.rotation.y=P.yaw;me_.x=P.x;me_.z=P.z;me_.obj.userData.sh.position.y=.02-P.jy;animAv(me_.obj,mvg,t,run,P.air)}
 Object.entries(R).forEach(([u,r])=>{if(u==me.uid||!r.obj)return;const ox=r.x,oz=r.z;r.x+=(r.tx-r.x)*Math.min(1,dt*8);r.z+=(r.tz-r.z)*Math.min(1,dt*8);r.sp+=(Math.hypot(r.x-ox,r.z-oz)/Math.max(dt,.001)-r.sp)*.2;r.y+=(gY(r.x,r.z,r.lv)-r.y)*Math.min(1,dt*10);animAv(r.obj,r.sp>.4,t,r.sp>5.4);r.obj.position.set(r.x,r.y,r.z);r.obj.rotation.y=r.tyaw});
 const sy=Math.sin(P.yaw),cy=Math.cos(P.yaw);let cx=P.x+sy*5,cz=P.z+cy*5;cx=Math.max(-HW+.5,Math.min(HW-.5,cx));cz=Math.max(-HB+.5,Math.min(HF-.5,cz));cam.position.set(cx,P.y+3.5+P.jy*.4,cz);cam.lookAt(P.x-sy*1.5,P.y+1.1,P.z-cy*1.5);if(ED){cam.position.set(P.x-sy*3.2,P.y+1.7,P.z-cy*3.2);cam.lookAt(P.x,P.y+1.1,P.z)}
 const dd=(x,z)=>Math.hypot(P.x-x,P.z-z),np=P.lv==1?dd(POOL2[0],POOL2[1])<3.6:P.lv==0?dd(POOL[0],POOL[1])<3.8:0,na=P.lv==0&&dd(ARC[0],ARC[1])<2.5,nb=P.lv==0&&dd(ARC[0],ARC[1]+2.2)<2.5,nm=P.lv==0&&dd(-8,3)<3,nd=P.lv==0&&dd(PORTAL[0],PORTAL[1])<2.6;$w('#wdoor').hidden=!nd;$w('#wpool').hidden=!np;$w('#warc').hidden=!na;$w('#wpong').hidden=!nb;$w('#wmem').hidden=!nm;$w('#wact').hidden=G||!(np||na||nb||nm||nd);
 if(t-lastW>1000){lastW=t;const sig=Object.keys(R).map(u=>u+(PH[u]?1:0)).join();Object.keys(R).forEach(u=>{if(PH[u]&&(!LS[u]||LS[u].src!=PH[u]))loadPh(u);else if(!PH[u])phLoad(u)});if(sig!=frame.sig){frame.sig=sig;users()}}
 sendPos();window.CINEMA&&CINEMA.tick&&CINEMA.tick(P,t);if(COMP){try{COMP.render()}catch(e){COMP=null;ren.render(sc,cam)}}else ren.render(sc,cam)}
function resize(){if(!ren)return;const w=innerWidth,h=innerHeight;ren.setSize(w,h,false);COMP&&COMP.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
/* ---------- إدخال ---------- */
document.addEventListener('keydown',e=>{if(!openW)return;const k=e.key.toLowerCase();if(e.target.tagName=='INPUT'){if(e.key=='Enter'&&e.target.id=='win'){sendMsg();if(!MOB)e.target.blur()}return}if(G&&G.key){G.key(k,e);return}if(k==' ')K.jump=1;K[k]=1;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault()});
document.addEventListener('keyup',e=>{K[e.key.toLowerCase()]=0});
let drag=null;const cv=$w('#wc');
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:Date.now(),id:e.pointerId};cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(!drag||e.pointerId!=drag.id)return;P.yaw-=(e.clientX-drag.x)*.006;drag.x=e.clientX;P.moved=1});
cv.addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;if(Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<7&&Date.now()-d.t<500)pick(e.clientX,e.clientY)});
function pick(x,y){if(!ray)return;const v=new THREE.Vector2(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(v,cam);const h=ray.intersectObjects(hitList(),false);const u=h&&h[0]&&h[0].object.userData.uid;if(u&&window.ACCTUI)ACCTUI.prof(u)}
const jy_=$w('#wjoy');jy_.addEventListener('pointerdown',e=>{jy_.setPointerCapture(e.pointerId);mv(e)});jy_.addEventListener('pointermove',e=>{e.buttons&&mv(e)});['pointerup','pointercancel'].forEach(n=>jy_.addEventListener(n,()=>{jx=jy=0;jy_.firstElementChild.style.transform=''}));
function mv(e){const r=jy_.getBoundingClientRect();let x=e.clientX-r.left-60,y=e.clientY-r.top-60;const l=Math.hypot(x,y);if(l>46){x*=46/l;y*=46/l}jx=x/46;jy=y/46;jy_.firstElementChild.style.transform=`translate(${x}px,${y}px)`}
/* ---------- الألعاب ---------- */
function openGame(k){G={};$w('#wgame').hidden=false;const c=$w('#wg'),set=s=>$w('#wsc').textContent=s;Object.keys(K).forEach(x=>K[x]=0);jx=jy=0;
 if(k=='pool'){$w('#wgt').textContent='🎱 بلياردو';$w('#wgm').textContent='اسحب من أي مكان بعيد عن الكورة البيضا وسيب عشان تضرب. حط كل الكور في الجيوب.';pool(c,set)}else if(k=='pong'){$w('#wgt').textContent='🏓 بونج';$w('#wgm').textContent='حرّك الطبلة بالماوس أو بصباعك (أو W/S). أول واحد يوصل 5 يكسب.';pong(c,set)}else if(k=='mem'){$w('#wgt').textContent='🃏 الذاكرة';$w('#wgm').textContent='اقلب كارتين وركّز: لو شبه بعض يفضلوا مفتوحين. خلّص كل الأزواج بأقل حركات.';mem(c,set)}else{$w('#wgt').textContent='🕹 سنيك';$w('#wgm').textContent='الأسهم أو WASD أو اسحب بصباعك. كل الأكل. متخبطش في نفسك.';snake(c,set)}}
function closeGame(){if(G&&G.stop)G.stop();G=null;$w('#wgame').hidden=true}
function pool(c,set){const g=c.getContext('2d'),TW=640,TH=340,Rr=11;c.width=TW;c.height=TH;const pk=[[0,0],[TW/2,0],[TW,0],[0,TH],[TW/2,TH],[TW,TH]];let B,cue,pot,aim=null,run=1,msg='';
 const rack=()=>{const cl=['#e53935','#fdd835','#1e88e5','#8e24aa','#fb8c00','#43a047'];B=[];let i=0;for(let a=0;a<3;a++)for(let b=0;b<=a;b++)B.push({x:440+a*Rr*1.9,y:TH/2+(b-a/2)*Rr*2.1,vx:0,vy:0,c:cl[i++]});cue={x:150,y:TH/2,vx:0,vy:0,c:'#fff'};pot=0;set('داخل: 0/6')};rack();
 const mov=()=>[cue,...B].some(b=>Math.abs(b.vx)+Math.abs(b.vy)>.05);
 const step=()=>{const A=[cue,...B];A.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.vx*=.989;b.vy*=.989;if(Math.abs(b.vx)+Math.abs(b.vy)<.05)b.vx=b.vy=0;if(b.x<Rr){b.x=Rr;b.vx=-b.vx*.9}if(b.x>TW-Rr){b.x=TW-Rr;b.vx=-b.vx*.9}if(b.y<Rr){b.y=Rr;b.vy=-b.vy*.9}if(b.y>TH-Rr){b.y=TH-Rr;b.vy=-b.vy*.9}});
  for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=A[i],b=A[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<Rr*2&&d>0){const nx=dx/d,ny=dy/d,o=(Rr*2-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;const p=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;a.vx-=p*nx;a.vy-=p*ny;b.vx+=p*nx;b.vy+=p*ny}}
  if(cue&&pk.some(p=>Math.hypot(cue.x-p[0],cue.y-p[1])<19)){cue.x=150;cue.y=TH/2;cue.vx=cue.vy=0;msg='الكورة البيضا وقعت!'}
  const n=B.length;B=B.filter(b=>!pk.some(p=>Math.hypot(b.x-p[0],b.y-p[1])<19));if(B.length<n){pot+=n-B.length;set(`داخل: ${pot}/6`);msg=pot==6?'كسبت! 🎉 اضغط على الشاشة للعب تاني':''}};
 const draw=()=>{g.fillStyle='#0f7a45';g.fillRect(0,0,TW,TH);g.strokeStyle='#4a2c12';g.lineWidth=10;g.strokeRect(0,0,TW,TH);g.fillStyle='#000';pk.forEach(p=>{g.beginPath();g.arc(p[0],p[1],19,0,7);g.fill()});
  [...B,cue].forEach(b=>{g.beginPath();g.arc(b.x,b.y,Rr,0,7);g.fillStyle=b.c;g.fill();g.strokeStyle='#0006';g.lineWidth=1;g.stroke()});
  if(aim&&!mov()){const dx=cue.x-aim.x,dy=cue.y-aim.y,l=Math.hypot(dx,dy)||1;g.strokeStyle='#fff9';g.setLineDash([6,6]);g.beginPath();g.moveTo(cue.x,cue.y);g.lineTo(cue.x+dx/l*Math.min(l*2,260),cue.y+dy/l*Math.min(l*2,260));g.stroke();g.setLineDash([]);g.strokeStyle='#fdd835';g.beginPath();g.moveTo(cue.x,cue.y);g.lineTo(aim.x,aim.y);g.stroke()}
  if(msg){g.fillStyle='#fff';g.font='700 22px Cairo,sans-serif';g.textAlign='center';g.fillText(msg,TW/2,TH/2-30)}};
 const loop=()=>{if(!run)return;step();step();draw();G.raf=requestAnimationFrame(loop)};
 const xy=e=>{const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*TW/r.width,y:(e.clientY-r.top)*TH/r.height}};
 c.onpointerdown=e=>{if(pot==6){rack();msg='';return}if(!mov()){aim=xy(e);c.setPointerCapture(e.pointerId)}};c.onpointermove=e=>{if(aim)aim=xy(e)};
 c.onpointerup=e=>{if(!aim)return;const a=xy(e),dx=cue.x-a.x,dy=cue.y-a.y,l=Math.hypot(dx,dy);aim=null;if(l<8)return;const sp=Math.min(l/9,17);cue.vx=dx/l*sp;cue.vy=dy/l*sp;msg=''};
 G={stop(){run=0;cancelAnimationFrame(G.raf);c.onpointerdown=c.onpointermove=c.onpointerup=null},poolState:()=>({pot,B:B.length})};G.api={shoot:(vx,vy)=>{cue.vx=vx;cue.vy=vy},state:()=>({pot,n:B.length,mov:mov()})};window.__pool=G.api;loop()}
function snake(c,set){const N=18,Z=20,g=c.getContext('2d');c.width=c.height=N*Z;let s,d,nd,f,sco,alive,hs=0;try{hs=+localStorage.sq_hs_snake||0}catch(e){}
 const food=()=>{let p;do{p=[Math.floor(Math.random()*N),Math.floor(Math.random()*N)]}while(s.some(x=>x[0]==p[0]&&x[1]==p[1]));return p};
 const reset=()=>{s=[[9,9],[8,9],[7,9]];d=nd=[1,0];f=food();sco=0;alive=1;set('النقاط: 0 · الأعلى: '+hs)};reset();
 const draw=()=>{g.fillStyle='#07261a';g.fillRect(0,0,N*Z,N*Z);g.fillStyle='#ff4f6e';g.fillRect(f[0]*Z+3,f[1]*Z+3,Z-6,Z-6);s.forEach((p,i)=>{g.fillStyle=i?'#34f0a1':'#eaffe9';g.fillRect(p[0]*Z+1,p[1]*Z+1,Z-2,Z-2)});if(!alive){g.fillStyle='#000a';g.fillRect(0,0,N*Z,N*Z);g.fillStyle='#fff';g.font='700 24px Cairo,sans-serif';g.textAlign='center';g.fillText('خسرت! اضغط للعب تاني',N*Z/2,N*Z/2)}};
 const tick=()=>{if(!alive)return;d=nd;const h=[s[0][0]+d[0],s[0][1]+d[1]];if(h[0]<0||h[1]<0||h[0]>=N||h[1]>=N||s.some(p=>p[0]==h[0]&&p[1]==h[1])){alive=0;if(sco>hs){hs=sco;try{localStorage.sq_hs_snake=hs}catch(e){}}set('النقاط: '+sco+' · الأعلى: '+hs);draw();return}s.unshift(h);if(h[0]==f[0]&&h[1]==f[1]){sco++;f=food();set('النقاط: '+sco+' · الأعلى: '+hs)}else s.pop();draw()};
 const dir=(x,y)=>{if(x!=-d[0]||y!=-d[1])nd=[x,y]};const M={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};
 let sx,sy;c.onpointerdown=e=>{if(!alive){reset();draw();return}sx=e.clientX;sy=e.clientY};c.onpointerup=e=>{if(sx==null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.hypot(dx,dy)<14)return;Math.abs(dx)>Math.abs(dy)?dir(dx>0?1:-1,0):dir(0,dy>0?1:-1)};
 const iv=setInterval(tick,115);G={stop(){clearInterval(iv);c.onpointerdown=c.onpointerup=null},key(k,e){if(M[k]){dir(...M[k]);e.preventDefault()}}};window.__snake={dir,state:()=>({sco,alive})};draw()}

function pong(c,set){const W=480,H=320,g=c.getContext('2d');c.width=W;c.height=H;c.style.background='#06122e';let py=H/2,ay=H/2,bx,by,vx,vy,ps=0,as=0,run=1,over=0,msg='';const PH=60,PW=10;
 const serve=d=>{bx=W/2;by=H/2;const a=(Math.random()-.5)*.8;vx=4.2*d;vy=4.2*Math.sin(a)};serve(1);set('أنت 0 : 0 الكمبيوتر');
 const loop=()=>{if(!run)return;
  if(!over){if(K.w||K.arrowup)py-=6;if(K.s||K.arrowdown)py+=6;py=Math.max(PH/2,Math.min(H-PH/2,py));
   ay+=Math.max(-3.6,Math.min(3.6,by-ay))*.92;ay=Math.max(PH/2,Math.min(H-PH/2,ay));bx+=vx;by+=vy;if(by<6){by=6;vy=-vy}if(by>H-6){by=H-6;vy=-vy}
   if(vx<0&&bx<26&&bx>10&&Math.abs(by-py)<PH/2+6){vx=Math.min(-vx*1.06,11);vy+=(by-py)*.09;bx=26}
   if(vx>0&&bx>W-26&&bx<W-10&&Math.abs(by-ay)<PH/2+6){vx=-Math.min(vx*1.04,11);vy+=(by-ay)*.07;bx=W-26}
   if(bx<-10){as++;serve(1);set(`أنت ${ps} : ${as} الكمبيوتر`)}if(bx>W+10){ps++;serve(-1);set(`أنت ${ps} : ${as} الكمبيوتر`)}
   if(ps>=5||as>=5){over=1;msg=ps>=5?'كسبت! 🎉 اضغط للعب تاني':'الكمبيوتر كسب. اضغط للعب تاني'}}
  g.fillStyle='#06122e';g.fillRect(0,0,W,H);g.strokeStyle='#3fe0ff55';g.setLineDash([8,8]);g.beginPath();g.moveTo(W/2,0);g.lineTo(W/2,H);g.stroke();g.setLineDash([]);
  g.fillStyle='#7ff6ff';g.fillRect(14,py-PH/2,PW,PH);g.fillStyle='#ff7ad9';g.fillRect(W-14-PW,ay-PH/2,PW,PH);g.fillStyle='#fff';g.beginPath();g.arc(bx,by,6,0,7);g.fill();
  if(msg){g.fillStyle='#fff';g.font='700 22px Cairo,sans-serif';g.textAlign='center';g.fillText(msg,W/2,H/2)}G.raf=requestAnimationFrame(loop)};
 const yy=e=>{const r=c.getBoundingClientRect();return(e.clientY-r.top)*H/r.height};
 c.onpointerdown=e=>{if(over){ps=as=0;over=0;msg='';serve(1);set('أنت 0 : 0 الكمبيوتر')}py=yy(e);c.setPointerCapture(e.pointerId)};c.onpointermove=e=>{if(e.buttons||e.pointerType=='mouse')py=yy(e)};
 G={stop(){run=0;cancelAnimationFrame(G.raf);c.onpointerdown=c.onpointermove=null;c.style.background=''}};window.__pong={state:()=>({ps,as,bx,over}),setBall:(x,y,a,b)=>{bx=x;by=y;vx=a;vy=b},setPad:y=>{py=y}};loop()}
function mem(c,set){const E=['🍕','🎮','🚀','🎧','🐱','⚽','🍩','🌟'],N=4,Z=88,g=c.getContext('2d');c.width=c.height=N*Z;c.style.background='#0b1236';let cards,open,lock,moves,done,hs=0;try{hs=+localStorage.sq_hs_mem||0}catch(e){}
 const reset=()=>{cards=[...E,...E].map((e,i)=>({e,id:i,up:0,ok:0}));for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]]}open=[];lock=0;moves=0;done=0;set('حركات: 0'+(hs?' · أفضل: '+hs:''));draw()};
 const draw=()=>{g.clearRect(0,0,N*Z,N*Z);cards.forEach((k,i)=>{const x=i%N*Z+5,y=Math.floor(i/N)*Z+5,w=Z-10;g.fillStyle=k.ok?'#0f6b4a':k.up?'#1d2a6b':'#2b3a8c';g.beginPath();g.roundRect?g.roundRect(x,y,w,w,14):g.rect(x,y,w,w);g.fill();g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';if(k.up||k.ok){g.font='40px sans-serif';g.fillText(k.e,x+w/2,y+w/2+3)}else{g.font='800 30px sans-serif';g.fillStyle='#7ff6ff';g.fillText('?',x+w/2,y+w/2)}});
  if(done){g.fillStyle='#000a';g.fillRect(0,0,N*Z,N*Z);g.fillStyle='#fff';g.font='700 24px Cairo,sans-serif';g.fillText('خلّصت في '+moves+' حركة 🎉',N*Z/2,N*Z/2-10);g.font='16px Cairo,sans-serif';g.fillText('اضغط للعب تاني',N*Z/2,N*Z/2+22)}};
 const flip=i=>{const k=cards[i];if(lock||k.up||k.ok)return;k.up=1;open.push(i);draw();if(open.length==2){moves++;const[a,b]=open;if(cards[a].e==cards[b].e){cards[a].ok=cards[b].ok=1;cards[a].up=cards[b].up=0;open=[];if(cards.every(x=>x.ok)){done=1;if(!hs||moves<hs){hs=moves;try{localStorage.sq_hs_mem=hs}catch(e){}}}}else{lock=1;setTimeout(()=>{if(!cards)return;cards[a].up=cards[b].up=0;open=[];lock=0;draw()},700)}set('حركات: '+moves+(hs?' · أفضل: '+hs:''));draw()}};
 c.onpointerdown=e=>{if(done){reset();return}const r=c.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*N),y=Math.floor((e.clientY-r.top)/r.height*N);if(x>=0&&y>=0&&x<N&&y<N)flip(y*N+x)};
 G={stop(){cards=null;c.onpointerdown=null;c.style.background=''}};window.__mem={state:()=>({moves,done,cards:cards&&cards.map(k=>k.e),ok:cards&&cards.filter(k=>k.ok).length}),flip};reset()}
$w('#wjump').onpointerdown=e=>{e.preventDefault();K.jump=1};
$w('#wpool').onclick=()=>openGame('pool');$w('#wpong').onclick=()=>openGame('pong');$w('#wmem').onclick=()=>openGame('mem');$w('#warc').onclick=()=>openGame('arc');$w('#wgx').onclick=closeGame;
/* ---------- دخول وخروج ---------- */
function enterRoom(id,name){ROOM=id||'main';RN=name||'';$w('#wlobby').hidden=true;openW=1;$w('#world').hidden=false;$w('#wload').hidden=false;loadThree(()=>{if(!openW)return;try{if(!built)build()}catch(e){console.error(e);$w('#wload').textContent='فشل بناء الغرفة: '+(e&&e.message||e)+' — ابعتلي الرسالة دي';return}
  resize();applyQ();$w('#wload').hidden=true;$w('#wusers').hidden=MOB;
  Promise.race([db.doc('looks/'+me.uid).get(),new Promise((_,j)=>setTimeout(j,1500))]).then(d=>{MYK=(d&&d.exists&&d.data()&&d.data().k)||''}).catch(()=>{MYK=''}).then(()=>{if(!openW)return;
   P.x=(Math.random()-.5)*4;P.z=6;P.yaw=0;P.moved=1;P.y=0;P.lv=0;P.jy=0;P.vy=0;P.air=0;pRef=db.doc(`world/${ROOM}/players/${me.uid}`);sendPos(1);
   window.CINEMA&&CINEMA.enter&&CINEMA.enter(ROOM);unP=col('players').onSnapshot(onPlayers,()=>toast('مقدرتش أقرا اللاعبين. انشر قواعد Firebase الجديدة'));unM=col('msgs').orderBy('t','desc').limit(40).onSnapshot(onMsgs,()=>{});
   last=performance.now();raf=requestAnimationFrame(frame)})})}
/* ---------- روم خاصة بباسورد: الباسورد بيتحوّل لـ SHA-256 (مع كود الروم) والقواعد بتقارنه بنسخة مش مقروءة لأي حد ---------- */
async function sha(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=0x811c9dc5,o='';for(let k=0;k<8;k++){for(let i=0;i<s.length;i++){h^=s.charCodeAt(i)+k;h=Math.imul(h,16777619)>>>0}o+=h.toString(16).padStart(8,'0')}return o}}
const newRid=()=>'p_'+Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>'abcdefghjkmnpqrstuvwxyz23456789'[b%31]).join('');
const sRooms=()=>{try{return JSON.parse(localStorage.sq_rooms||'[]')}catch(e){return[]}},saveRoom=(id,n)=>{try{localStorage.sq_rooms=JSON.stringify([{id,n},...sRooms().filter(x=>x.id!=id)].slice(0,8))}catch(e){}};
const lerr=m=>{$w('#wle').textContent=m||''};
function lobby(){lerr('');$w('#wci').hidden=true;const a=sRooms(),m=$w('#wml');m.hidden=!a.length;m.innerHTML=a.length?'<b>🕘 رومات دخلتها</b>'+a.map(x=>`<div class="mr" data-id="${esc(x.id)}"><span>🔒 ${esc(x.n)}</span><small dir="ltr">${esc(x.id)}</small></div>`).join(''):'';$w('#wlobby').hidden=false}
async function mkRoom(){lerr('');const n=$w('#wcn').value.trim(),pw=$w('#wcp').value;if(!n)return lerr('اكتب اسم الروم');if(pw.length<4)return lerr('الباسورد 4 حروف على الأقل');
 const id=newRid(),h=await sha(id+':'+pw);
 try{await db.doc('roomkeys/'+id).set({h,o:me.uid});await db.doc('rooms/'+id).set({n:n.slice(0,24),o:me.uid,t:FV.serverTimestamp()});await db.doc(`rooms/${id}/members/${me.uid}`).set({h,t:FV.serverTimestamp()})}catch(e){return lerr('مقدرتش أعمل الروم. انشر قواعد Firebase الجديدة')}
 saveRoom(id,n);const inv=`ادخل The Squad ← 🏛️ ← دخول روم بكود\nالكود: ${id}\nالباسورد: ${pw}`;const el=$w('#wci');el.hidden=false;
 el.innerHTML=`<div class="sec">✅ اتعمل الروم «${esc(n)}»<div>الكود: <b dir="ltr">${id}</b></div><div>الباسورد: <b>${esc(pw)}</b></div><button id="wcopy">📋 انسخ الدعوة وابعتها لصحابك</button><button id="wgo" class="big">ادخل الروم</button></div>`;
 $w('#wcopy').onclick=()=>{try{navigator.clipboard.writeText(inv);toast('اتنسخت الدعوة')}catch(e){prompt('انسخ الدعوة',inv)}};$w('#wgo').onclick=()=>enterRoom(id,n)}
async function joinRoom(id,pw){lerr('');id=(id||'').trim().toLowerCase();if(!/^p_[a-z0-9]{6}$/.test(id))return lerr('الكود غلط (بيبدأ بـ p_ وبعده 6 حروف/أرقام)');
 let rd;try{rd=await db.doc('rooms/'+id).get()}catch(e){return lerr('مقدرتش أقرا الروم. انشر قواعد Firebase الجديدة')}
 if(!rd.exists)return lerr('مفيش روم بالكود ده');
 const mr=db.doc(`rooms/${id}/members/${me.uid}`);let ok=0;try{ok=(await mr.get()).exists}catch(e){}
 if(!ok){if(!pw)return lerr('اكتب الباسورد');const h=await sha(id+':'+pw);try{await mr.set({h,t:FV.serverTimestamp()})}catch(e){return lerr('الباسورد غلط')}}
 const n=(rd.data()||{}).n||'روم';saveRoom(id,n);enterRoom(id,n)}
$w('#wlp').onclick=()=>enterRoom('main','');$w('#wcc').onclick=mkRoom;$w('#wjj').onclick=()=>joinRoom($w('#wjc').value,$w('#wjp').value);$w('#wlx').onclick=()=>{$w('#wlobby').hidden=true};
$w('#wml').onclick=e=>{const r=e.target.closest('.mr');if(r){$w('#wjc').value=r.dataset.id;joinRoom(r.dataset.id,'')}};
/* ---------- محرر الشخصية ---------- */
function lookUI(){const Lk=ED.lk,hx=c=>'#'+c.toString(16).padStart(6,'0'),sw=(k,arr)=>arr.map((c,i)=>`<button data-k="${k}" data-v="${i}" class="sw${Lk[k]==i?' on':''}" style="background:${hx(c)}"></button>`).join(''),
 hu=HUES.map(h=>`<button data-k="c" data-v="${h}" class="sw${Lk.c==h?' on':''}" style="background:hsl(${h} 68% 52%)"></button>`).join(''),
 tg=HSN.map((t,i)=>`<button data-k="st" data-v="${i}" class="tg${Lk.st==i?' on':''}">${t}</button>`).join(''),ac=ACN.map((t,i)=>`<button data-b="${1<<i}" class="tg${Lk.ac&(1<<i)?' on':''}">${t}</button>`).join('');
 $w('#wlook').innerHTML=`<b>👤 شخصيتك</b><p>البشرة</p><div>${sw('sk',SKC)}</div><p>الشعر</p><div>${tg}</div><p>لون الشعر</p><div>${sw('hr',HRC)}</div><p>التيشرت</p><div>${hu}</div><p>البنطلون</p><div>${sw('pc',PNC)}</div><p>إكسسوارات</p><div>${ac}</div><div class="lr"><button id="wlr">🎲</button><button id="wls">💾 حفظ</button><button id="wlc">إلغاء</button></div>`}
function applyLook(){MYK=encLook(ED.lk);const r=R[me.uid];if(r){r.k=MYK;rebuildAv(me.uid)}lookUI()}
function openLook(){if(!R[me.uid])return;ED={lk:Object.assign({},lookOf(me.uid,MYK)),orig:MYK};$w('#wlook').hidden=false;lookUI()}
function closeLook(rev){if(rev&&ED){MYK=ED.orig;const r=R[me.uid];if(r){r.k=MYK;rebuildAv(me.uid)}}ED=null;$w('#wlook').hidden=true}
async function saveLook(){const k=encLook(ED.lk);let okS=1;try{await db.doc('looks/'+me.uid).set({k})}catch(e){okS=0}MYK=k;ED=null;$w('#wlook').hidden=true;sendPos(1);toast(okS?'اتحفظت شخصيتك ✅':'اتطبّقت عندك بس. انشر قواعد Firebase الجديدة (looks)')}
$w('#wlook').onclick=e=>{const b=e.target.closest('button');if(!b||!ED)return;if(b.dataset.k)ED.lk[b.dataset.k]=+b.dataset.v;else if(b.dataset.b)ED.lk.ac^=+b.dataset.b;else if(b.id=='wls'){saveLook();return}else if(b.id=='wlc'){closeLook(1);return}else if(b.id=='wlr'){const q=n=>Math.random()*n|0;Object.assign(ED.lk,{sk:q(6),hr:q(7),st:q(6),c:HUES[q(9)],pc:q(7),ac:q(16)})}else return;applyLook()};
$w('#wlk').onclick=()=>ED?closeLook(1):openLook();
function leave(){window.CINEMA&&CINEMA.leave&&CINEMA.leave();openW=0;ED=null;$w('#wlook').hidden=true;closeGame();cancelAnimationFrame(raf);unP&&unP();unM&&unM();unP=unM=null;if(pRef){pRef.delete().catch(()=>{});pRef=null}Object.values(R).forEach(r=>r.obj&&sc&&sc.remove(r.obj));Object.keys(R).forEach(u=>delete R[u]);$w('#world').hidden=true}
$w('#wbtn').onclick=lobby;const goCity=o=>{leave();window.DISTRICT?DISTRICT.enter(o):toast('الحي لسه بيتحمّل، جرّب تاني')};$w('#wcity').onclick=$w('#wdoor').onclick=()=>goCity({from:'cafe'});$w('#wlcity').onclick=()=>{$w('#wlobby').hidden=true;window.DISTRICT?DISTRICT.enter({}):toast('الحي لسه بيتحمّل، جرّب تاني')};$w('#wx').onclick=leave;$w('#wub').onclick=()=>{const u=$w('#wusers');u.hidden=!u.hidden};$w('#wcb').onclick=()=>$w('#wchat').classList.toggle('off');$w('#wsend').onclick=()=>{sendMsg();$w('#win').blur()};
addEventListener('resize',resize);addEventListener('pagehide',()=>{pRef&&pRef.delete().catch(()=>{})});
document.addEventListener('visibilitychange',()=>{if(openW&&!document.hidden){P.moved=1;sendPos(1)}});
/* ---------- v29: مستوى الجودة (خفيف / متوسط / عالي ✨ فيه توهّج نيون Bloom على الكمبيوتر) ---------- */
let QL=(()=>{try{return localStorage.sq_q||'mid'}catch(e){return'mid'}})(),COMP=null;const QN={lo:'خفيف',mid:'متوسط',hi:'عالي ✨ (توهّج)'};
function loadScripts(a,cb){let i=0;const n=()=>{if(i>=a.length)return cb(1);const e=document.createElement('script');e.src=a[i++];e.onload=n;e.onerror=()=>cb(0);document.head.append(e)};n()}
function applyQ(){if(!ren)return;ren.setPixelRatio(Math.min(devicePixelRatio||1,QL=='lo'?1:MOB?1.25:1.75));
 if(QL!='hi'){COMP=null}else if(!COMP){const B3='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';
  loadScripts(['shaders/CopyShader.js','shaders/LuminosityHighPassShader.js','postprocessing/EffectComposer.js','postprocessing/RenderPass.js','postprocessing/ShaderPass.js','postprocessing/UnrealBloomPass.js'].map(x=>B3+x),ok=>{
   if(QL!='hi'||COMP)return;if(!ok||!THREE.EffectComposer||!THREE.UnrealBloomPass){toast('مقدرتش أحمّل التوهّج. رجعت للمتوسط');QL='mid';return}
   try{const sz=new THREE.Vector2();ren.getSize(sz);const c=new THREE.EffectComposer(ren);c.setSize(sz.x,sz.y);c.addPass(new THREE.RenderPass(sc,cam));c.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(sz.x,sz.y),.5,.65,.6));COMP=c}catch(e){console.error(e);COMP=null;QL='mid';toast('التوهّج مش شغّال على جهازك. رجعت للمتوسط')}})}
 resize()}
$w('#wq').onclick=()=>{QL=QL=='lo'?'mid':QL=='mid'?'hi':'lo';try{localStorage.sq_q=QL}catch(e){}applyQ();toast('الجودة: '+QN[QL])};
window.WORLD={enter:()=>enterRoom('main',''),leave,state:()=>({P,R:Object.keys(R),open:openW,RL:Object.fromEntries(Object.entries(R).map(([u,r])=>[u,r.lv]))}),nav:{blocked,gY,inS3,s3,inSt,Y3,bounds:[HW,HB,HF]}};
})();
