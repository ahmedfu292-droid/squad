/* The Squad v32 — «الحي»: مدينة كبيرة (480×480) بمباني حقيقية جوّاها أدوار وسلالم وأسانسيرات (Three.js r128). المنطق (الفيزياء/الشبكة) في district-core.js.
   DISTRICT.enter({from:'cafe'|''}) / DISTRICT.leave() */
(()=>{
const DC=window.DC;if(!DC){console.warn('district-core.js مش متحمّل');return}
const MOB=/Android|iPhone|iPad|Mobi/i.test(navigator.userAgent),MP=DC.MAP,q=s=>document.querySelector(s);
document.head.insertAdjacentHTML('beforeend',`<style>
#dst{position:fixed;inset:0;z-index:100;background:#0d0828;color:#eaf6ff;direction:rtl;touch-action:none;user-select:none;-webkit-user-select:none}
#dst[hidden]{display:none}#dstC{position:absolute;inset:0;width:100%;height:100%;display:block}
#dstTop{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));inset-inline:10px;display:flex;gap:8px;align-items:center;z-index:3}
#dst button{padding:9px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(10,14,30,.72);backdrop-filter:blur(10px);color:#fff;font:700 14px Cairo,sans-serif;cursor:pointer}
#dstTop b{flex:1;text-align:center;font-size:14px;text-shadow:0 2px 8px #000}#dstNet{font:700 10px Cairo,sans-serif;color:#ffd66b;padding:4px 7px;border:1px solid #ffffff22;border-radius:20px;background:#071323bb;white-space:nowrap}#dstNet[data-state=online]{color:#69f0b5}#dstNet[data-state=error],#dstNet[data-state=offline]{color:#ff8b8b}
#dstEstate{position:absolute;inset:0;z-index:7;background:rgba(2,5,15,.88);display:grid;place-items:center;padding:16px}#dstEstate[hidden]{display:none}.estatePanel{width:min(94vw,760px);max-height:86vh;overflow:auto;padding:18px;border-radius:22px;background:linear-gradient(145deg,#111b32,#080d1c);border:1px solid #d9a441aa;box-shadow:0 20px 70px #000a}.estatePanel h3{margin:0 0 6px;color:#f1d48a}.estateGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:14px 0}.estateCard{padding:12px;border:1px solid #ffffff22;border-radius:15px;background:#ffffff08}.estateCard b{display:block;color:#ffe3a0}.estateCard small{display:block;color:#b8c6df;margin:5px 0 9px}.estateCard button{width:100%}.estateCard .owned{border-color:#4de0a5;color:#4de0a5}#dstCoin{padding:8px 12px;border-radius:14px;background:rgba(10,14,30,.72);border:1px solid rgba(255,215,90,.5);font:800 14px Cairo,sans-serif;color:#ffd75a}
#dstCars{position:absolute;inset:0;z-index:8;background:rgba(2,5,15,.92);display:grid;place-items:center;padding:14px;backdrop-filter:blur(9px)}#dstCars[hidden]{display:none}.carShopPanel{width:min(96vw,1040px);max-height:90vh;overflow:auto;padding:20px;border-radius:24px;background:linear-gradient(145deg,#17243b,#080d19 65%,#171522);border:1px solid #d9b66b;box-shadow:0 24px 80px #000c}.carShopPanel h3{margin:0 0 6px;color:#ffe3a0;font-size:23px}.carShopLead{color:#b9c7df;font-size:13px;line-height:1.8}.carShopGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:15px 0}.carShopCard{padding:13px;border:1px solid #d9b66b55;border-radius:17px;background:linear-gradient(145deg,#ffffff0b,#ffffff03);min-width:0}.carShopCard .carGlyph{height:56px;display:grid;place-items:center;font-size:34px;background:linear-gradient(135deg,#26354d,#0a1020);border-radius:12px;margin-bottom:9px}.carShopCard b{display:block;color:#ffe3a0;font-size:14px;line-height:1.5}.carShopCard small{display:block;color:#b9c7df;margin:5px 0 10px}.carShopCard .price{color:#f3d58c;font-weight:800;margin:8px 0}.carShopCard button{width:100%}.carShopCard .owned{border-color:#4de0a5!important;color:#75f0bd!important}
#dstApts{position:absolute;inset:0;z-index:7;background:rgba(2,5,15,.9);display:grid;place-items:center;padding:16px;backdrop-filter:blur(8px)}#dstApts[hidden]{display:none}.aptPanel{width:min(94vw,820px);max-height:88vh;overflow:auto;padding:20px;border-radius:24px;background:linear-gradient(145deg,#17243b,#080d19);border:1px solid #d9b66b;box-shadow:0 24px 80px #000b}.aptPanel h3{margin:0 0 7px;color:#ffe3a0;font-size:22px}.aptLead{color:#b9c7df;font-size:13px;line-height:1.8}.aptGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:16px 0}.aptCard{padding:14px;border:1px solid #d9b66b55;border-radius:17px;background:linear-gradient(145deg,#ffffff0b,#ffffff03);box-shadow:inset 0 1px #ffffff0a}.aptCard .aptIcon{font-size:27px}.aptCard b{display:block;color:#ffe3a0;margin:5px 0}.aptCard small{display:block;color:#b9c7df;line-height:1.7;margin:6px 0 12px}.aptCard button{width:100%}.aptCard .owned{border-color:#4de0a5!important;color:#75f0bd!important}.aptMeta{display:flex;justify-content:space-between;gap:8px;color:#f4d48c;font-size:12px;margin:8px 0}
#dstMap{position:absolute;top:calc(58px + env(safe-area-inset-top,0px));inset-inline-end:10px;width:112px;height:112px;border-radius:16px;border:1px solid rgba(255,255,255,.18);z-index:3}
#dstUsers{position:absolute;top:calc(58px + env(safe-area-inset-top,0px));inset-inline-start:10px;z-index:3;width:200px;max-height:40vh;overflow:auto;padding:8px;border-radius:18px;background:rgba(10,14,30,.8);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12)}
#dstUsers .wu{display:flex;align-items:center;gap:10px;padding:5px}#dstUsers u.av{width:34px;height:34px}#dstUsers b{font-size:13px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#dstChat{position:absolute;bottom:calc(10px + env(safe-area-inset-bottom,0px));inset-inline-start:10px;width:min(340px,calc(100vw - 20px));z-index:3;border-radius:18px;background:rgba(10,14,30,.74);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);padding:8px}
#dstChat.off{display:none}#dstMsgs{max-height:22vh;overflow:auto;font-size:13.5px;line-height:1.7;margin-bottom:6px}#dstMsgs b{color:#7ff6ff}
#dstChat .r{display:flex;gap:6px}#dstIn{flex:1;min-width:0;border-radius:12px;padding:9px 12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#fff;font:14px Cairo,sans-serif}
#dstSend{width:42px;padding:0!important;background:linear-gradient(135deg,#f3d77a,#e6a23c)!important;color:#1b1405!important}
#dstAct{position:absolute;bottom:38%;left:50%;transform:translateX(-50%);z-index:3}
#dstAct button{font-size:16px;padding:12px 20px;border-color:#3fe0ff;box-shadow:0 0 18px #3fe0ff66}
#dstEmo{position:absolute;top:calc(178px + env(safe-area-inset-top,0px));inset-inline-end:10px;z-index:3;display:flex;flex-direction:column;gap:6px}
#dstEmo button{width:44px;height:44px;padding:0;font-size:20px}
#dstJump,#dstRun{position:absolute;z-index:3;width:60px;height:60px;border-radius:50%!important;padding:0!important;font-size:22px!important}
#dstJump{bottom:calc(34vh + 150px);inset-inline-end:30px}#dstRun{bottom:calc(34vh + 150px);inset-inline-end:104px}#dstRun.on{background:#3fe0ff!important;color:#06122e!important}
#dstJoy{position:absolute;bottom:calc(34vh + 10px);inset-inline-end:22px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);z-index:3;touch-action:none}
#dstJoy i{position:absolute;left:36px;top:36px;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#7ff6ff,#5c7cff);box-shadow:0 0 18px #3fe0ff99}
@media (pointer:fine){#dstJoy,#dstJump,#dstRun{display:none}}
#dstBank{position:absolute;inset:0;z-index:6;background:radial-gradient(ellipse at 50% 15%,rgba(41,58,94,.78),rgba(2,5,14,.94) 68%);display:grid;place-items:center;padding:14px;backdrop-filter:blur(9px)}#dstBank[hidden]{display:none}.bk{width:min(94vw,510px);max-height:88vh;overflow:auto;padding:22px;border-radius:25px;background:linear-gradient(145deg,#18253d 0%,#0b1120 62%,#151326 100%);border:1px solid #d9b66b;box-shadow:0 24px 80px #000b, inset 0 1px #fff2;text-align:center;line-height:1.9;position:relative}.bk:before{content:'♛  THE SQUAD PRIVATE BANK  ♛';display:block;color:#e9cd8a;font:700 10px Arial,sans-serif;letter-spacing:2px;padding:0 0 12px;border-bottom:1px solid #d9b66b44;margin-bottom:14px}.bk h3{margin:0 0 12px;color:#ffe6a2;font-size:24px;text-shadow:0 2px 12px #d9a44133}.bk b{color:#ffe6a2}.bk small{color:#b9c7df}.bb{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0}.bk button{border-color:#d9b66b55!important;background:linear-gradient(145deg,#23334f,#111b2e)!important}.bk button:hover{border-color:#ffe6a2!important;filter:brightness(1.15)}#bkInfo{padding:12px;border:1px solid #ffffff18;border-radius:16px;background:linear-gradient(135deg,#ffffff0c,#ffffff03);line-height:2.1}#bkLog{font-size:13px;color:#cfe;margin:12px 0;min-height:40px;padding:10px;border-radius:14px;background:#02081788;text-align:right}#bkLog div{padding:3px 0;border-bottom:1px solid #ffffff0d}
#dstLoad{position:absolute;inset:0;display:grid;place-items:center;background:#0d0828;z-index:5;font-weight:800;text-align:center;padding:20px}
#dstLoad[hidden]{display:none}
</style>`);
document.body.insertAdjacentHTML('beforeend',`<div id="dst" hidden><canvas id="dstC"></canvas>
<div id="dstTop"><button id="dstX">✕ خروج</button><button id="dstCafe">☕</button><button id="dstNeon" title="تغيير لون نيون العربيات">💡 نيون</button><b id="dstCnt"></b><span id="dstNet" data-state="connecting">● اتصال...</span><span id="dstCoin">🪙 0</span><button id="dstUb">👥</button><button id="dstCb">💬</button></div>
<canvas id="dstMap" width="224" height="224"></canvas><div id="dstUsers" hidden></div>
<div id="dstEmo"><button data-e="wave">👋</button><button data-e="dance">💃</button><button data-e="heart">❤️</button><button data-e="laugh">😂</button></div>
<div id="dstChat"><div id="dstMsgs"></div><div class="r"><input id="dstIn" maxlength="200" placeholder="اكتب للكل..." autocomplete="off"><button id="dstSend">➤</button></div></div>
<div id="dstAct" hidden><button id="dstDoor"></button> <button id="dstBk" hidden>🏦 افتح الحساب</button></div><div id="dstBank" hidden><div class="bk"><h3>🏦 بنك The Squad</h3><div id="bkInfo"></div><div class="bb"><button data-b="d5">⬆️ إيداع 5</button><button data-b="d50">⬆️ إيداع 50</button><button data-b="d500">⬆️ إيداع 500</button><button data-b="da">⬆️ إيداع الكل</button><button data-b="w5">⬇️ سحب 5</button><button data-b="w50">⬇️ سحب 50</button><button data-b="w500">⬇️ سحب 500</button><button data-b="wa">⬇️ سحب الكل</button></div><div id="bkLog"></div><div class="bb"><button id="bkTransfer">💸 تحويل فلوس</button><button id="bkAsset">🎁 تحويل ملكية</button></div><small>التحويل يحتاج معرّف اللاعب (UID) من حسابه داخل اللعبة.</small><button id="bkX">إغلاق</button></div></div>
<button id="dstRun">🏃</button><button id="dstJump">⤴</button><div id="dstJoy"><i></i></div><div id="dstLoad">بيحمّل الحي...</div></div>`);
if(MOB)q('#dstChat').classList.add('off');
document.head.insertAdjacentHTML('beforeend','<style>#dstTp{position:absolute;inset:0;z-index:6;background:rgba(3,5,14,.8);display:grid;place-items:center}#dstTp[hidden]{display:none}.tp{width:min(92vw,360px);max-height:80vh;overflow:auto;padding:16px;border-radius:22px;background:#10142a;border:1px solid #3fe0ff88;text-align:center}.tp h3{margin:0 0 8px;color:#7ff6ff}.tp button{display:block;width:100%;margin:6px 0}</style>');
q('#dst').insertAdjacentHTML('beforeend','<div id="dstTp" hidden><div class="tp"><h3>📍 روح على...</h3><div id="tpL"></div><button id="tpX">إغلاق</button></div></div>');
q('#dstTop').insertAdjacentHTML('beforeend','<button id="dstTpB">📍</button><button id="dstHubB">✨ الخدمات</button>');
q('#dstTpB').onclick=()=>{q('#tpL').innerHTML=MP.buildings.map((b,i)=>'<button data-i="'+i+'">'+NAMES[b.id]+'</button>').join('')+'<button data-i="o">🧗 الأوبي</button><button data-i="f">⛲ النافورة</button><button data-i="s">🏁 نقطة البداية</button>';q('#dstTp').hidden=false};
q('#tpX').onclick=()=>q('#dstTp').hidden=true;
q('#dst').insertAdjacentHTML('beforeend','<div id="dstEstate" hidden><div class="estatePanel"><h3>🏡 مجموعة العقارات الفاخرة</h3><div>امتلك فيلا أو قصرًا جبليًا، ثم انتقل إليه من أي مكان في المدينة. الملكية محفوظة على هذا الجهاز والحساب الحالي.</div><div id="dstEstateGrid" class="estateGrid"></div><button id="dstEstateClose">إغلاق</button></div></div>');
q('#dst').insertAdjacentHTML('beforeend','<div id="dstApts" hidden><div class="aptPanel"><h3>🏙️ The Squad Residences</h3><div class="aptLead">مجموعة شقق سكنية راقية داخل برج المدينة. اختر الوحدة حسب المساحة والطابق والإطلالة، ثم انتقل إلى شقتك من داخل العالم. الأسعار والملكية تجريبية ومحفوظة محليًا في هذه النسخة.</div><div id="dstAptGrid" class="aptGrid"></div><button id="dstAptClose">إغلاق</button></div></div>');
q('#dst').insertAdjacentHTML('beforeend','<div id="dstCars" hidden><div class="carShopPanel"><h3>🚘 Luxury Motor Gallery</h3><div class="carShopLead">اختَر من 52 موديلًا إضافيًا من سيارات الإنتاج الحقيقية بالاسم. شراء السيارة يضيفها إلى جراجك المحلي ويستدعيها إلى ساحة المعرض لتقدر تركبها وتقودها. شكل السيارات الإضافية الحالي هيكل فئوي برمجي؛ الموديلات الأصلية التفصيلية تحتاج ملفات 3D مرخّصة غير موجودة في الأرشيف.</div><div id="dstCarShopGrid" class="carShopGrid"></div><button id="dstCarShopClose">إغلاق</button></div></div>');
q('#dst').insertAdjacentHTML('beforeend','<div id="dstHub" hidden style="position:absolute;inset:0;z-index:6;background:rgba(2,5,15,.82);display:grid;place-items:center;padding:16px;backdrop-filter:blur(8px)"><div class="estatePanel"><h3>✨ خدمات المدينة الفاخرة</h3><div class="aptLead">اختار المكان اللي عايز تديره أو تزوره.</div><div class="estateGrid"><div class="estateCard"><b>🏡 العقارات والقصور</b><small>شراء العقارات الجبلية والانتقال إلى الممتلكات.</small><button id="dstEstateB">فتح العقارات</button></div><div class="estateCard"><b>🏢 الشقق والبنتهاوس</b><small>اختيار وحدة سكنية داخل برج المدينة.</small><button id="dstAptB">فتح الشقق</button></div><div class="estateCard"><b>🚘 معرض السيارات</b><small>شراء واستدعاء موديلات السيارات الإضافية.</small><button id="dstCarShopB">فتح المعرض</button></div></div><button id="dstHubClose">إغلاق</button></div></div>');
q('#dst').insertAdjacentHTML('beforeend','<div id="dstEntourage" hidden style="position:absolute;inset:0;z-index:12;background:#02050feF;display:grid;place-items:center;padding:14px"><div class="estatePanel"><h3>🛡️ الحراسة الخاصة والموكب الملكي</h3><p>اشترِ حارسًا شخصيًا من رصيدك عبر نظام تعيين الحراس الحالي، واجعله يتبعك. الموكب ميزة استعراضية داخل جلستك الحالية.</p><div class="estateGrid"><div class="estateCard"><b>🛡️ الحراس الشخصيون</b><small id="bodyguardInfo">اختَر عقارًا تملكه لتعيين الحارس بسعر 2,500 عملة.</small><div id="bodyguardChoices"></div><button id="bodyguardFollow">👣 تشغيل / إيقاف اتباعي</button></div><div class="estateCard"><b>🚘 موكب السيارات الفاخرة</b><small>ثلاث سيارات مرافقة تتبعك بصريًا في العالم الحالي.</small><button id="convoyToggle">🚘 تشغيل الموكب</button></div></div><button id="dstEntourageClose">إغلاق</button></div></div>');
q('#dstTop').insertAdjacentHTML('beforeend','<button id="dstEntourageB">🛡️ موكبي</button>');
q('#tpL').onclick=e=>{const i=e.target.dataset&&e.target.dataset.i;if(i==null)return;let x,z,yw=0;if(i=='o'){x=MP.plats[0].x-3.5;z=MP.plats[0].z;yw=-Math.PI/2}else if(i=='f'){x=0;z=8}else if(i=='s'){x=MP.spawn.x;z=MP.spawn.z}else{const b=MP.buildings[+i],w=b.W(0,b.hd+3);x=w[0];z=w[1];yw=b.dir>0?0:Math.PI;if(b.id=='palace'&&!ADM){x=0;z=262;yw=Math.PI}}Object.assign(P,DC.newP(x,z));P.yaw=yw;q('#dstTp').hidden=true;net&&net.send(P,EM,1)};

/* ---------- الحالة ---------- */
let ENV_CUBE=null,CITY_ENV_CUBE=null,WG=null,NPCS_=[],lastNpc=0,lastCoinCheck=0,NEON_PALETTE=[0x20cfff,0xff2bd6,0x5cff7a,0xffb52e,0xffffff],NEON_INDEX=0,sc,cam,ren,ray,built=0,openD=0,raf=0,last=0,lastSend=0,lastSlow=0,lastMap=0,net=null,MYK='',EM='',emT=0,jx=0,jy=0,runT=0,ME=null,camD=6.2,camH=3.3,sig='',got=new Set(),seen=null;
const P=DC.newP(MP.spawn.x,MP.spawn.z),K={},R={},coinObjs=[],pulse=[],GEO={},EMS={},DOORS=[];let fountainTop=null,drag=null,nearDoor=null;
// v40: authoritative multiplayer economy. Browser cache is display-only; writes go through callable Functions.
let ECON=null, ECON_READY=false, ECON_BUSY=false;
function economyClient(){try{if(!window.firebase||!firebase.functions||!me||!me.uid)return null;return firebase.app().functions('europe-west1')}catch(e){return null}}
function applyEconomy(st){if(!st)return;W=Math.max(0,Number(st.wallet)||0);BANK.bal=Math.max(0,Number(st.bank)||0);OWN=st.cars||{};OWN_ESTATES=st.estates||{};OWN_APTS=st.apartments||{};OWN_STAFF={};Object.entries(st.staff||{}).forEach(([k,v])=>{const m=k.match(/^(.*)_(guard|servant)$/);if(!m)return;OWN_STAFF[m[1]]=OWN_STAFF[m[1]]||{guards:0,servants:0};OWN_STAFF[m[1]][m[2]==='guard'?'guards':'servants']=Number(v)||0});ECON=st;ECON_READY=true;coinUI();if(q('#dstBank')&&!q('#dstBank').hidden)bankUI();if(q('#dstEstate')&&!q('#dstEstate').hidden)estateUI();if(q('#dstApts')&&!q('#dstApts').hidden)aptUI();if(q('#dstCars')&&!q('#dstCars').hidden)carShopUI()}
async function economyLoad(){const f=economyClient();if(!f){toast('لازم تسجيل الدخول وتفعيل Firebase Functions للعب بالأونلاين');return false}try{const r=await f.httpsCallable('economyGet')({});applyEconomy(r.data);return true}catch(e){ECON_READY=false;toast('تعذر تحميل حساب اللعبة من السيرفر. راجع إعدادات Firebase Functions.');console.error('economyGet',e);return false}}
async function economyAction(action,data={}){if(ECON_BUSY)return null;const f=economyClient();if(!f){toast('اقتصاد الأونلاين غير متاح: تأكد من تسجيل الدخول وإعداد Firebase Functions');return null}ECON_BUSY=true;try{const r=await f.httpsCallable('economyAction')({action,...data});applyEconomy(r.data.state);return r.data}catch(e){toast((e&&e.message)||'حصل خطأ في عملية الاقتصاد');console.error('economyAction',action,e);return null}finally{ECON_BUSY=false}}
const ESTATE_CATALOG=[
 {id:'villa_ridge',name:'فيلا Ridge الزجاجية',price:85000,x:-48,z:-292,desc:'فيلا زجاجية بإطلالة جبلية وحديقة خاصة',color:0x9fb8c9,size:1},
 {id:'villa_pines',name:'فيلا Pine Crest',price:125000,x:-18,z:-320,desc:'فيلا عصرية بين الأشجار وممر خاص',color:0xd8c5a4,size:1.1},
 {id:'mansion_summit',name:'قصر Summit',price:420000,x:20,z:-315,desc:'قصر مرتفع بمدخل ملكي وشرفات واسعة',color:0xd8d9df,size:1.35},
 {id:'estate_royal',name:'قصر Royal Heights',price:780000,x:52,z:-290,desc:'قصر كبير بحديقة وبوابة خاصة',color:0xbca27c,size:1.55},
 {id:'chalet_overlook',name:'شاليه Overlook',price:56000,x:78,z:-325,desc:'منزل جبلي هادئ مع تراس مطل',color:0x6d8e9b,size:.85},
 {id:'villa_emerald',name:'فيلا Emerald',price:185000,x:-205,z:390,desc:'فيلا واسعة بواجهة زجاجية وحديقة خاصة في حي الأغنياء',color:0x6fae9b,size:1.2},
 {id:'villa_azure',name:'فيلا Azure',price:220000,x:-135,z:390,desc:'فيلا عصرية متعددة الطوابق مع موقف خاص',color:0x7ba6d8,size:1.25},
 {id:'villa_skyline',name:'فيلا Skyline',price:275000,x:-65,z:390,desc:'فيلا فاخرة بإضاءة محيطية وشرفات واسعة',color:0x9fb8c9,size:1.3},
 {id:'mansion_goldcrest',name:'قصر Gold Crest',price:950000,x:65,z:390,desc:'قصر ملكي بمدخل خاص وأجنحة فاخرة',color:0xd8c08a,size:1.6},
 {id:'mansion_royalgardens',name:'قصر Royal Gardens',price:1250000,x:135,z:390,desc:'قصر كبير بحدائق وممر سيارات خاص',color:0xc8b38b,size:1.7},
 {id:'villa_palm',name:'فيلا Palm Residence',price:315000,x:205,z:390,desc:'فيلا راقية بتصميم استوائي داخل حي الأغنياء',color:0x86a58b,size:1.35}
];
const ESTATE_KEY=()=> 'sq_estates_'+me.uid;
let OWN_ESTATES={};
let BODYGUARDS=[],BODYGUARD_FOLLOW=false,CONVOY=[],CONVOY_ON=false;
function estateLoad(){/* Ownership comes only from economyGet/economyAction. */}
function estateSave(){try{localStorage[ESTATE_KEY()]=JSON.stringify(OWN_ESTATES)}catch(e){}}
function entourageUI(){const choices=q('#bodyguardChoices');if(!choices)return;const owned=ESTATE_CATALOG.filter(a=>!!OWN_ESTATES[a.id]);choices.innerHTML=owned.length?owned.map(a=>'<button data-bodyguard-estate="'+a.id+'">تعيين حارس من '+a.name+' · 2,500 🪙</button>').join(''):'<small>لازم تملك فيلا أو قصرًا أولًا.</small>';q('#bodyguardInfo').textContent='الحراس المتاحون: '+BODYGUARDS.length+' · السعر 2,500 عملة لكل حارس';q('#bodyguardFollow').textContent=BODYGUARD_FOLLOW?'⏸ إيقاف اتباع الحراس':'👣 خليهم يمشوا وراك';q('#convoyToggle').textContent=CONVOY_ON?'⏸ إيقاف الموكب':'🚘 تشغيل الموكب'}
async function hirePersonalGuard(estateId){const a=ESTATE_CATALOG.find(x=>x.id===estateId);if(!a||!OWN_ESTATES[estateId])return toast('امتلك العقار أولًا');const r=await economyAction('hireStaff',{estateId,kind:'guard'});if(!r)return;const o=mkAv('personal_guard_'+Date.now(),'الحارس الشخصي','');o.position.set(P.x-2,0,P.z-2);o.userData=o.userData||{};o.userData.personalBodyguard={phase:BODYGUARDS.length*2.2,estateId};sc.add(o);BODYGUARDS.push(o);entourageUI();toast('🛡️ تم تعيين الحارس الشخصي!')}
function toggleConvoy(){if(!CONVOY.length){const keys=['bugatti','rolls','rr'];for(let i=0;i<keys.length;i++){const key=DC.CS[keys[i]]?keys[i]:Object.keys(DC.CS)[i];const cr=DC.spawnCar(key,P.x+(i+1)*4,P.z+7,Math.PI);if(!cr)continue;cr.v=0;cr.sale=-1;const obj=mkCar(cr);sc.add(obj);CARO[cr.id]=obj;CONVOY.push({car:cr,obj,index:i,key})}}CONVOY_ON=!CONVOY_ON;entourageUI();toast(CONVOY_ON?'🚘 الموكب الفاخر جاهز ويتبعك في جلستك':'تم إيقاف الموكب')}
function animateEntourage(dt,t){if(BODYGUARD_FOLLOW){BODYGUARDS.forEach((o,i)=>{const g=o.userData&&o.userData.personalBodyguard;if(!g)return;const ang=P.yaw+Math.PI+(i%2?-.55:.55),tx=P.x+Math.sin(ang)*(2.2+Math.floor(i/2)*1.1),tz=P.z+Math.cos(ang)*(2.2+Math.floor(i/2)*1.1),a=Math.min(1,dt*3.4);o.position.x+=(tx-o.position.x)*a;o.position.z+=(tz-o.position.z)*a;o.rotation.y=Math.atan2(P.x-o.position.x,P.z-o.position.z);anim(o,Math.hypot(tx-o.position.x,tz-o.position.z)>.15,t,false,false,'')})}if(CONVOY_ON){CONVOY.forEach(({car,obj,index})=>{const back=9+index*6,side=(index===1?3:index===2?-3:0),ang=P.yaw,tx=P.x-Math.sin(ang)*back+Math.cos(ang)*side,tz=P.z-Math.cos(ang)*back-Math.sin(ang)*side,a=Math.min(1,dt*2.2);car.x+=(tx-car.x)*a;car.z+=(tz-car.z)*a;car.yaw=P.yaw;obj.position.set(car.x,car.y||0,car.z);obj.rotation.y=car.yaw+Math.PI/2;syncCar(car,dt)})}}
function estateUI(){estateLoad();staffLoad();q('#dstEstateGrid').innerHTML=ESTATE_CATALOG.map(a=>{const own=!!OWN_ESTATES[a.id],st=OWN_STAFF[a.id]||{guards:0,servants:0};return '<div class="estateCard"><b>'+a.name+'</b><small>'+a.desc+'</small><small>السعر: '+fmt(a.price)+' 🪙</small><button data-estate="'+a.id+'" class="'+(own?'owned':'')+'">'+(own?'🚪 انتقل للعقار':'🛒 شراء العقار')+'</button>'+(own?'<div class="aptMeta"><span>🛡️ حراس '+st.guards+'/3</span><span>🧹 خدم '+st.servants+'/3</span></div><div class="bb"><button data-staff="'+a.id+'" data-kind="guard">تعيين حارس · 2,500</button><button data-staff="'+a.id+'" data-kind="servant">تعيين خادم · 1,800</button></div>':'<small>امتلك العقار أولًا لتعيين الحراس والخدم.</small>')+'</div>'}).join('')}
async function estateAction(id){const a=ESTATE_CATALOG.find(x=>x.id===id);if(!a)return;if(!OWN_ESTATES[id]){const r=await economyAction('buyEstate',{id});if(!r)return;estateUI();toast('🏡 مبروك! أصبحت مالك '+a.name);return}Object.assign(P,DC.newP(a.x,a.z));P.yaw=Math.PI;q('#dstEstate').hidden=true;net&&net.send(P,EM,1);toast('🏡 وصلت إلى '+a.name)}
const STAFF_KEY=()=>'sq_estate_staff_'+me.uid;let OWN_STAFF={};
function staffLoad(){}
function staffSave(){}
function spawnEstateStaff(a,kind,index){if(!sc)return;const isGuard=kind==='guard',x=a.x+(isGuard?-8:8),z=a.z+(isGuard?8:7),o=mkAv('estate_'+a.id+'_'+kind+'_'+index,isGuard?'حارس '+a.name:'خادم '+a.name,'');o.position.set(x,0,z);o.rotation.y=isGuard?Math.PI:0;o.userData=o.userData||{};o.userData.squadStaff={estateId:a.id,kind,index,cx:x,cz:z,phase:index*.9+(isGuard?0:2.2),homeX:a.x,homeZ:a.z};sc.add(o);NPCS_.push(o)}
function animateEngineers(t){for(const g of AUTO_ENGINEERS){const e=g.userData.engineer,a=t*e.speed+e.phase;g.position.x=e.cx+Math.cos(a)*e.rx;g.position.z=e.cz+Math.sin(a*.8)*e.rz;g.rotation.y=-a+Math.PI/2;g.children[0].position.y=.78+Math.abs(Math.sin(a*4))*.035}}
function animateEstateStaff(t){for(const o of NPCS_){const s=o&&o.userData&&o.userData.squadStaff;if(!s)continue;const a=t*.00028+s.phase,rx=s.kind==='guard'?7:4.2,rz=s.kind==='guard'?5:3.3;o.position.x=s.cx+Math.cos(a)*rx;o.position.z=s.cz+Math.sin(a)*rz;o.rotation.y=Math.atan2(Math.sin(a),Math.cos(a))+(s.kind==='guard'?Math.PI/2:0)}}
function restoreEstateStaff(){const exists=(id,kind,i)=>NPCS_.some(o=>{const s=o&&o.userData&&o.userData.squadStaff;return s&&s.estateId===id&&s.kind===kind&&s.index===i});ESTATE_CATALOG.forEach(a=>{const st=OWN_STAFF[a.id]||{guards:0,servants:0};for(let i=0;i<Math.min(3,st.guards||0);i++)if(!exists(a.id,'guard',i))spawnEstateStaff(a,'guard',i);for(let i=0;i<Math.min(3,st.servants||0);i++)if(!exists(a.id,'servant',i))spawnEstateStaff(a,'servant',i)})}
async function staffAction(id,kind){const a=ESTATE_CATALOG.find(x=>x.id===id);if(!a||!['guard','servant'].includes(kind))return;if(!OWN_ESTATES[id])return toast('لازم تمتلك العقار الأول');const r=await economyAction('hireStaff',{estateId:id,kind});if(!r)return;const st=OWN_STAFF[id]||{guards:1,servants:1};spawnEstateStaff(a,kind,Math.max(0,(st[kind==='guard'?'guards':'servants']||1)-1));estateUI();toast(kind==='guard'?'🛡️ تم تعيين حارس للعقار':'🧹 تم تعيين خادم للعقار')}
const APT_CATALOG=[{id:'apt_classic',name:'شقة Classic',price:18000,floor:1,icon:'🏠',desc:'وحدة أنيقة بتصميم دافئ ومساحة عملية.'},{id:'apt_skyline',name:'شقة Skyline',price:36000,floor:2,icon:'🌆',desc:'طابق أعلى وإطلالة على أضواء المدينة.'},{id:'apt_signature',name:'شقة Signature',price:65000,floor:3,icon:'✨',desc:'تشطيبات راقية ومساحة استقبال أوسع.'},{id:'apt_penthouse',name:'بنتهاوس Royal',price:110000,floor:3,icon:'👑',desc:'أعلى فئة سكنية متاحة في برج الشقق.'}];
const APT_KEY=()=>'sq_apartments_'+me.uid;let OWN_APTS={};
function aptLoad(){/* Ownership comes only from economyGet/economyAction. */}
function aptSave(){try{localStorage[APT_KEY()]=JSON.stringify(OWN_APTS)}catch(e){}}
function aptUI(){aptLoad();q('#dstAptGrid').innerHTML=APT_CATALOG.map(a=>{const own=!!OWN_APTS[a.id];return '<div class="aptCard"><div class="aptIcon">'+a.icon+'</div><b>'+a.name+'</b><div class="aptMeta"><span>الطابق '+a.floor+'</span><span>'+fmt(a.price)+' 🪙</span></div><small>'+a.desc+'</small><button data-apt="'+a.id+'" class="'+(own?'owned':'')+'">'+(own?'🚪 ادخل شقتك':'🛒 شراء الوحدة')+'</button></div>'}).join('')}
async function aptAction(id){const a=APT_CATALOG.find(x=>x.id===id);if(!a)return;if(!OWN_APTS[id]){const r=await economyAction('buyApartment',{id});if(!r)return;aptUI();toast('🏢 مبروك! أصبحت مالك '+a.name);return}const b=MP.buildings.find(x=>x.id==='flats');if(!b)return toast('الشقق غير متاحة حاليًا');const pos=b.W(a.id==='apt_penthouse'?3:0, a.id==='apt_penthouse'?-2:0);Object.assign(P,DC.newP(pos[0],pos[1]),{y:a.floor*b.fh+.25,yaw:b.dir>0?Math.PI:0});q('#dstApts').hidden=true;net&&net.send(P,EM,1);toast('🏙️ وصلت إلى '+a.name)}
function carShopUI(){q('#dstCarShopGrid').innerHTML=DC.CAR_CATALOG.map((row,i)=>{const key='catalog_'+(i+1),own=!!OWN[key],type=({sedan:'سيدان فاخرة',sport:'رياضية',super:'سوبر/هايبر كار',suv:'دفع رباعي'})[row[1]]||row[1];return '<div class="carShopCard"><div class="carGlyph">'+(row[1]==='suv'?'🚙':row[1]==='sedan'?'🚘':'🏎️')+'</div><b>'+row[0]+'</b><small>'+type+'</small><div class="price">'+fmt(row[2])+' 🪙</div><button data-catalog-car="'+i+'" class="'+(own?'owned':'')+'">'+(own?'🔑 استدعاء سيارتك':'🛒 شراء السيارة')+'</button></div>'}).join('')}
function catalogSpawnSpot(){const b=MP.buildings.find(x=>x.id==='showroom'),base=b?b.W(0,b.hd+6):{0:0,1:0};const bx=b?base[0]:-125,bz=b?base[1]:300;for(let row=0;row<5;row++)for(let col=-2;col<=2;col++){const x=bx+col*5.7,z=bz-row*5.8;if(!DC.blocked(x,z,0))return{x,z}}return null}
async function carShopAction(i){i=+i;if(!Number.isInteger(i)||i<0||i>=DC.CAR_CATALOG.length)return;const row=DC.CAR_CATALOG[i],key='catalog_'+(i+1);if(!OWN[key]){const r=await economyAction('buyCar',{id:key});if(!r)return;carShopUI();toast('🎉 اتضافت '+row[0]+' لجراجك')}let car=MP.cars.find(c=>c.key===key&&c.sale===-1);const spot=catalogSpawnSpot();if(!spot)return toast('مفيش مساحة فاضية في ساحة المعرض دلوقتي');if(!car){car=DC.spawnCar(key,spot.x,spot.z,0);if(!car)return toast('تعذّر استدعاء السيارة');const obj=mkCar(car);sc.add(obj);CARO[car.id]=obj;syncCar(car)}else{car.x=spot.x;car.z=spot.z;car.y=0;car.yaw=0;car.v=0;DC.parkDyn(car);syncCar(car)}q('#dstCars').hidden=true;toast('🚘 '+row[0]+' جاهزة عند المعرض — اقترب منها واضغط زر القيادة')}
const EMJ={wave:'👋',dance:'💃',heart:'❤️',laugh:'😂'};
const gm=(k,f)=>GEO[k]||(GEO[k]=f());
const cvt=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)};
const Lm=(c,e)=>new THREE.MeshLambertMaterial(e?{color:c,emissive:c,emissiveIntensity:.18}:{color:c}),Bm=(c,o)=>new THREE.MeshBasicMaterial(Object.assign({color:c},o||{}));
const mesh=(g,m,x,y,z,p)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);(p||sc).add(o);return o};
const bx=(w,h,d,m,x,y,z,p)=>mesh(gm('b'+w+'_'+h+'_'+d,()=>new THREE.BoxGeometry(w,h,d)),m,x,y,z,p);
function loadT(cb){if(window.THREE)return cb(1);const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=()=>cb(1);s.onerror=()=>cb(0);document.head.append(s)}
/* Optional locally bundled GLB fleet archetypes. Physics remains in district-core; GLB replaces only the rendered shell. */
let SQUAD_GLB_PROMISES={};
function loadSquadModel(G,c,R){if(!c||!c.archetype)return;const archetype=['sedan','sport','super','suv'].includes(c.archetype)?c.archetype:null;if(!archetype)return;
 function begin(){if(!window.GLTFLoader){if(document.querySelector('script[data-squad-gltf]'))return;const s=document.createElement('script');s.dataset.squadGltf='1';s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.js';s.onload=()=>{if(window.GLTFLoader)loadIt()};s.onerror=()=>{};document.head.appendChild(s)}else loadIt()}
 function loadIt(){if(!window.GLTFLoader)return;if(!SQUAD_GLB_PROMISES[archetype]){SQUAD_GLB_PROMISES[archetype]=new Promise((resolve,reject)=>{try{const l=new THREE.GLTFLoader();l.load(new URL('assets/models/squad-luxury-'+archetype+'.glb',document.baseURI).href,g=>resolve(g.scene),undefined,reject)}catch(e){reject(e)}})}SQUAD_GLB_PROMISES[archetype].then(src=>{if(!G||!G.parent)return;const m=src.clone(true);m.rotation.x=-Math.PI/2;const base={sedan:[5.0,1.9,1.3],sport:[4.5,1.95,1.12],super:[4.7,1.98,1.1],suv:[4.5,1.95,1.7]}[archetype];m.scale.set(c.L/base[0],c.W/base[1],c.H/base[2]);const glbWheels=[];m.traverse(o=>{if(o.isMesh){o.castShadow=archetype==='suv';o.receiveShadow=archetype==='suv';if(o.material){o.material=o.material.clone();const nm=(o.name+' '+(o.material.name||'')).toLowerCase();if(/wheel|tire|tyre/.test(nm)&&!/(wheel_hub|hubcap|alloy_wheel_detail)/.test(nm))glbWheels.push(o);if(o.material.color&&/(glass|windshield|window)/.test(nm)){o.material=new THREE.MeshPhysicalMaterial({color:0x233746,metalness:.18,roughness:.12,transparent:true,opacity:.46,depthWrite:false,clearcoat:1,clearcoatRoughness:.05,reflectivity:.95,envMap:ENV_CUBE,envMapIntensity:.7});}else if(o.material.color&&/(tire|rubber)/.test(nm)){o.material=new THREE.MeshStandardMaterial({color:0x111216,metalness:.01,roughness:.88});}else if(o.material.color&&/(wheel|rim|alloy|chrome|metal|hub)/.test(nm)){o.material=new THREE.MeshStandardMaterial({color:0xc5c9d0,metalness:.88,roughness:.23,envMap:ENV_CUBE,envMapIntensity:.65});}else if(o.material.color&&/(body|hood|roof|door|fender|lower_body|hatch)/.test(nm)){o.material=new THREE.MeshPhysicalMaterial({color:col,metalness:.42,roughness:.24,clearcoat:1,clearcoatRoughness:.1,reflectivity:.95,envMap:ENV_CUBE,envMapIntensity:.8});}if(o.material.transparent&&o.material.opacity<.9)o.material.depthWrite=false}}});G.clear();G.add(m);G.userData.wheels=glbWheels;G.userData.r=Math.max(.22,c.r||.32);if(R)R.userData.wheels=glbWheels;}).catch(()=>{/* Procedural vehicle remains the safe fallback if loading fails. */})}
 begin()}
function fac(base,seed,st){st=st||'grid';let s=seed;const r=()=>(s=(s*16807)%2147483647)/2147483647,a=document.createElement('canvas'),e=document.createElement('canvas');a.width=a.height=e.width=e.height=128;
 const ga=a.getContext('2d'),ge=e.getContext('2d');ga.fillStyle=base;ga.fillRect(0,0,128,128);ge.fillStyle='#000';ge.fillRect(0,0,128,128);
 const win=(x,y,w,h,lit,dk)=>{ga.fillStyle=lit?'#ffe9a8':(dk||'#0c1126');ga.fillRect(x,y,w,h);if(lit){ge.fillStyle=r()<.8?'#ffcf70':'#7ff6ff';ge.fillRect(x,y,w,h)}};
 if(st=='tall'){for(let i=0;i<6;i++){win(i*21+4,6,13,52,r()<.6);win(i*21+4,70,13,52,r()<.6)}}
 else if(st=='strip'){for(let j=0;j<4;j++){ga.fillStyle='rgba(0,0,0,.25)';ga.fillRect(0,j*32+6,128,20);for(let i=0;i<8;i++)win(i*16+1,j*32+8,14,16,r()<.7)}}
 else if(st=='arch'){for(let i=0;i<3;i++)for(let j=0;j<2;j++){const x=i*42+8,y=j*64+12,lit=r()<.65;win(x,y+13,26,38,lit);ga.fillStyle=lit?'#ffe9a8':'#0c1126';ga.beginPath();ga.arc(x+13,y+13,13,Math.PI,0);ga.fill();if(lit){ge.fillStyle='#ffcf70';ge.beginPath();ge.arc(x+13,y+13,13,Math.PI,0);ge.fill()}ga.fillStyle='rgba(120,100,60,.5)';ga.fillRect(x-3,y+51,32,4)}}
 else if(st=='brick'){ga.fillStyle='rgba(0,0,0,.2)';for(let y=0;y<128;y+=8){ga.fillRect(0,y,128,1);for(let x=(y/8%2)*8;x<128;x+=16)ga.fillRect(x,y,1,8)}for(let i=0;i<2;i++)for(let j=0;j<2;j++){win(i*64+16,j*64+12,28,34,r()<.6,'#1a1226');ga.fillStyle='#e8d8c0';ga.fillRect(i*64+13,j*64+46,34,4)}}
 else if(st=='glass'){for(let i=0;i<4;i++)for(let j=0;j<4;j++){const lit=r()<.5;ga.fillStyle='#aebbd8';ga.fillRect(i*32,j*32,32,32);win(i*32+2,j*32+2,28,28,lit,'#5a78b8')}}
 else{for(let i=0;i<4;i++)for(let j=0;j<4;j++)win(i*32+7,j*32+8,18,16,r()<.62)}
 const rough=document.createElement('canvas'),bump=document.createElement('canvas');rough.width=rough.height=bump.width=bump.height=128;
 const gr=rough.getContext('2d'),gb=bump.getContext('2d');gr.fillStyle=st==='glass'?'#353535':'#b8b8b8';gr.fillRect(0,0,128,128);gb.fillStyle='#808080';gb.fillRect(0,0,128,128);
 for(let y=0;y<128;y+=8){gr.fillStyle='rgba(20,24,30,.13)';gr.fillRect(0,y,128,1);gb.fillStyle='rgba(18,18,18,.24)';gb.fillRect(0,y,128,1)}
 for(let x=0;x<128;x+=32){gr.fillStyle='rgba(20,24,30,.10)';gr.fillRect(x,0,1,128);gb.fillStyle='rgba(18,18,18,.2)';gb.fillRect(x,0,1,128)}
 for(let i=0;i<360;i++){const x=(i*47)%128,y=(i*71)%128,v=st==='glass'?10:24;gr.fillStyle=`rgba(255,255,255,${v/255})`;gr.fillRect(x,y,1+(i%3),1);gb.fillStyle=i%2?'rgba(255,255,255,.13)':'rgba(0,0,0,.13)';gb.fillRect(x,y,1,1)}
 return(ru,rv)=>{const mk=c=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(ru,rv);t.anisotropy=4;return t};return{map:mk(a),emi:mk(e),rough:mk(rough),bump:mk(bump)}}}
const glowT=()=>gm('glow',()=>cvt(64,64,g=>{const r=g.createRadialGradient(32,32,2,32,32,32);r.addColorStop(0,'rgba(255,240,180,1)');r.addColorStop(1,'rgba(255,240,180,0)');g.fillStyle=r;g.fillRect(0,0,64,64)}));
const glowS=(x,y,z,c,s,o)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowT(),color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:o||.6}));sp.position.set(x,y,z);sp.scale.set(s,s,1);sc.add(sp);return sp};
function textTex(t,w,h,font,col,bg){return cvt(w,h,(g)=>{if(bg){g.fillStyle=bg;g.beginPath();g.roundRect?g.roundRect(4,4,w-8,h-8,h/3):g.rect(4,4,w-8,h-8);g.fill();g.strokeStyle=col;g.lineWidth=3;g.stroke()}g.font=font;g.textAlign='center';g.textBaseline='middle';g.shadowColor=col;g.shadowBlur=16;g.fillStyle='#fff';g.strokeStyle=col;g.lineWidth=3;g.strokeText(t,w/2,h/2);g.fillText(t,w/2,h/2)})}

/* ---------- بناء المدينة (مباني الشارع الرئيسي بتفاصيلها جوّه وبرّه، والباقي مدمّج في مجسّمات قليلة عشان الأداء) ---------- */
const NAMES={cafe:'☕ الكافيه',hall:'🎬 القاعة',flats:'🏢 الشقق',shop:'🛍️ السوق',arcade:'🕹️ الأركيد',bank:'🏦 بنك The Squad',kiosk:'🥤 الكشك',gym:'💪 الجيم',lab:'🧪 المعمل',palace:'👑 قصر المدير',showroom:'🏎️ معرض السيارات'};
const PAL={cafe:[0x3fe0ff,0x6b3a2a,0xb89a70,0x2a1a14],hall:[0xff7ad9,0x5a1e50,0x4a2a44,0x2a0f2a],flats:[0xffb02c,0xb8683a,0xd6c0a0,0x3a2418],shop:[0x4aff9a,0x1f6a5a,0xdcdce8,0x123a30],arcade:[0x8a5cff,0x2e1a7a,0x2a1a5a,0x160a40],bank:[0xffd75a,0xd9d0a8,0xe8dfc8,0x8a7a4a],kiosk:[0xff7a5c,0xc0422a,0xd9d0c0,0x5a1a10],gym:[0x5cff7a,0x17502a,0x2a2a36,0x0a2a14],lab:[0x7ff6ff,0xcfd8ee,0xe8eef8,0x6a7a9a],palace:[0xd9b66b,0x101a2c,0xc9d3e5,0x07111f],showroom:[0x3fe0ff,0x20243a,0xd8dbe8,0x0a0f22]};
const hsl=(h,s,l)=>{s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))};return(f(0)<<16)|(f(8)<<8)|f(4)};
const MG={},FC=[[1,0,0,0,0,-1,0,1,0],[-1,0,0,0,0,1,0,1,0],[0,1,0,1,0,0,0,0,-1],[0,-1,0,1,0,0,0,0,1],[0,0,1,1,0,0,0,1,0],[0,0,-1,-1,0,0,0,1,0]];
const mg=k=>MG[k]||(MG[k]={p:[],n:[],c:[],u:[],i:[],v:0});
function mbox(kind,cx,cy,cz,w,h,d,col,uvs){const g=mg(kind),hs=[w/2,h/2,d/2],cr=((col>>16)&255)/255,cg=((col>>8)&255)/255,cb=(col&255)/255;
 for(let fi=0;fi<6;fi++){const f=FC[fi],hn=Math.abs(f[0])*hs[0]+Math.abs(f[1])*hs[1]+Math.abs(f[2])*hs[2],hr=Math.abs(f[3])*hs[0]+Math.abs(f[4])*hs[1]+Math.abs(f[5])*hs[2],hu=Math.abs(f[6])*hs[0]+Math.abs(f[7])*hs[1]+Math.abs(f[8])*hs[2],b0=g.v,sd=fi!=2&&fi!=3&&uvs;
  for(let q=0;q<4;q++){const a=(q==0||q==3)?-1:1,b=q<2?-1:1;g.p.push(cx+f[0]*hn+f[3]*hr*a+f[6]*hu*b,cy+f[1]*hn+f[4]*hr*a+f[7]*hu*b,cz+f[2]*hn+f[5]*hr*a+f[8]*hu*b);g.n.push(f[0],f[1],f[2]);g.c.push(cr,cg,cb);g.u.push(sd&&a>0?2*hr/uvs:0,sd&&b>0?2*hu/uvs:0)}
  g.i.push(b0,b0+1,b0+2,b0,b0+2,b0+3);g.v+=4}}
const WM={};
function flush(){const base={lit:new THREE.MeshLambertMaterial({vertexColors:true}),emi:new THREE.MeshBasicMaterial({vertexColors:true}),glass:new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:.26,depthWrite:false,emissive:0x1a2a3a})};
 for(const k in MG){const g=MG[k];if(!g.v)continue;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(g.p,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(g.n,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(g.c,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(g.u,2));
  geo.setIndex(new THREE.BufferAttribute(g.v>65000?new Uint32Array(g.i):new Uint16Array(g.i),1));const o=new THREE.Mesh(geo,base[k]||WM[k]);if(k=='glass'||k==='pbrGlass')o.renderOrder=2;o.frustumCulled=false;if(ren&&ren.shadowMap&&ren.shadowMap.enabled){o.castShadow=k.startsWith('win')||k==='lit'||k==='pbrStone'||k==='pbrMetal';o.receiveShadow=true}sc.add(o)}}

/* ---------- مجسّمات العربيات (مقطع جانبي حقيقي + عجلات + إضاءة) ---------- */
const CARG={},CARM={};
function carGeo(key){if(CARG[key])return CARG[key];const sp=DC.carShape(key),c=DC.CS[key],mkS=pts=>{const sh=new THREE.Shape();pts.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));return sh};
 const D=c.W*.86,bt=.1,body=new THREE.ExtrudeGeometry(mkS(sp.body),{depth:D,bevelEnabled:true,bevelThickness:bt,bevelSize:.07,bevelSegments:3,curveSegments:1});body.translate(0,0,-D/2);
 const DG=D+2*bt+.05,glass=new THREE.ExtrudeGeometry(mkS(sp.glass),{depth:DG,bevelEnabled:false});glass.translate(0,0,-DG/2);
 const quad=(a,b,w)=>{const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),g=new THREE.BoxGeometry(len,.03,w);g.rotateZ(Math.atan2(dy,dx));g.translate((a[0]+b[0])/2-dy/len*.04,(a[1]+b[1])/2+dx/len*.04,0);return g};
 return CARG[key]={body,glass,ws:quad(sp.ws[0],sp.ws[1],c.W*.74),rw:quad(sp.rw[0],sp.rw[1],c.W*.7),tire:(()=>{const g=new THREE.CylinderGeometry(c.r,c.r,.32,32);g.rotateX(Math.PI/2);return g})(),rim:(()=>{const g=new THREE.CylinderGeometry(c.r*.62,c.r*.62,.34,24);g.rotateX(Math.PI/2);return g})(),well:new THREE.BoxGeometry(sp.ra*2,sp.ra*1.05,D*.98)}}
const cm=(k,f)=>CARM[k]||(CARM[k]=f());
function mkCar(cr){const key=cr.key,c=DC.CS[key],g=carGeo(key),G=new THREE.Group(),wr=cr.wr,D=c.W*.86,bt=.1,col=wr?0x2a2a30:c.c;
 /* v49: physically-based automotive finish; clearcoat adds a tighter showroom highlight while keeping the existing low-cost procedural geometry. */
 const paint=cm('p'+col,()=>new THREE.MeshPhysicalMaterial({color:col,metalness:wr?.16:.78,roughness:wr?.68:.2,clearcoat:wr?.05:.92,clearcoatRoughness:.12,reflectivity:.9,envMap:ENV_CUBE,envMapIntensity:wr?.18:.65})),dark=cm('dk',()=>new THREE.MeshStandardMaterial({color:0x090b10,metalness:.22,roughness:.42})),glassM=cm('gl'+wr,()=>new THREE.MeshPhysicalMaterial({color:wr?0x1a1a1a:0x0c1c2c,metalness:.28,roughness:.09,transparent:!wr,opacity:wr?1:.48,depthWrite:!!wr,clearcoat:.9,clearcoatRoughness:.06,reflectivity:1,envMap:ENV_CUBE,envMapIntensity:.45})),tire=cm('tr',()=>new THREE.MeshStandardMaterial({color:0x0c0c10,metalness:.02,roughness:.86})),rim=cm('rm'+key,()=>new THREE.MeshStandardMaterial({color:key=='rolls'||key=='bugatti'?0xd9d9e6:0xbfc3cf,metalness:.92,roughness:.2,envMap:ENV_CUBE,envMapIntensity:.5})),
  hl=cm('hl',()=>new THREE.MeshBasicMaterial({color:0xfff6d6})),tl=cm('tl',()=>new THREE.MeshBasicMaterial({color:0xff1a1a})),chrome=cm('ch',()=>new THREE.MeshPhongMaterial({color:0xd0d4de,shininess:150,specular:0xffffff}));
 G.add(new THREE.Mesh(g.body,paint));G.add(new THREE.Mesh(g.glass,glassM));G.add(new THREE.Mesh(g.ws,glassM));G.add(new THREE.Mesh(g.rw,glassM));
 /* Procedural cabin: visible dashboard, seats, console and steering wheel behind the glazing. */
 if(!wr){
  const interior=cm('int'+key,()=>new THREE.MeshPhongMaterial({color:0x171922,shininess:24}));
  const leather=cm('leather'+key,()=>new THREE.MeshPhongMaterial({color:(key==='rolls'||key==='limo')?0x342b25:0x252832,shininess:35}));
  const seam=cm('seam'+key,()=>new THREE.MeshBasicMaterial({color:(key==='ferrari'||key==='bugatti')?0xd7b15a:0x6c829b}));
  const cab=(w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);G.add(o);return o};
  const yFloor=Math.max(c.gc+.2,c.bl-.34), zSeat=c.W*.24;
  cab(c.L*.42,.09,c.W*.66,interior,-.05,yFloor,0);
  /* Two front seats and two rear seats, with distinct backrests and headrests. */
  [-1,1].forEach(side=>{
   const z=side*zSeat;
   cab(c.L*.16,.13,c.W*.22,leather,c.xft-.18,yFloor+.13,z);
   const back=cab(c.L*.13,c.H*.29,c.W*.22,leather,c.xft-.34,yFloor+.31,z);back.rotation.z=-.08;
   cab(c.L*.075,.11,c.W*.17,leather,c.xft-.37,yFloor+.51,z);
   cab(c.L*.12,.11,c.W*.20,leather,c.xrr+.24,yFloor+.13,z);
   cab(c.L*.11,c.H*.20,c.W*.20,leather,c.xrr+.14,yFloor+.28,z);
   cab(c.L*.07,.035,c.W*.18,seam,c.xft-.18,yFloor+.20,z);
  });
  /* Dashboard follows the front bulkhead; console and instrument binnacle add depth. */
  cab(c.L*.12,.15,c.W*.69,interior,c.xfw-.03,yFloor+.28,0);
  cab(c.L*.08,.075,c.W*.26,seam,c.xfw-.09,yFloor+.37,0);
  cab(c.L*.25,.08,c.W*.11,interior,.02,yFloor+.16,0);
  cab(c.L*.14,.12,c.W*.12,leather,-.12,yFloor+.22,0);
  /* Instrument cluster, center infotainment, vents, gear selector and rear-view mirror. */
  const displayMat=cm('display'+key,()=>new THREE.MeshBasicMaterial({color:0x42cfff}));
  cab(c.L*.055,.065,c.W*.19,displayMat,c.xfw-.115,yFloor+.405,0);
  [-1,1].forEach(side=>cab(c.L*.018,.018,c.W*.09,chrome,c.xfw-.12,yFloor+.42,side*c.W*.235));
  cab(c.L*.055,.045,c.W*.11,displayMat,.02,yFloor+.235,0);
  const shifter=cab(c.L*.025,.13,c.W*.035,chrome,.18,yFloor+.28,0);shifter.rotation.z=-.12;
  cab(c.L*.08,.035,c.W*.12,interior,c.xfw-.12,yFloor+.31,0);
  cab(c.L*.025,.055,c.W*.16,leather,c.xfw-.19,yFloor+.51,0);
  const steering=new THREE.Mesh(new THREE.TorusGeometry(Math.max(.105,c.W*.075),.025,8,20),leather);
  steering.position.set(c.xfw-.03,yFloor+.39,-c.W*.22);steering.rotation.y=Math.PI/2;G.add(steering);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.04,10),seam);hub.rotation.z=Math.PI/2;hub.position.set(c.xfw-.03,yFloor+.39,-c.W*.22);G.add(hub);
  /* Door armrests and metallic trim are intentionally low-poly for mobile performance. */
  [-1,1].forEach(side=>{cab(c.L*.36,.055,.035,leather,-.02,yFloor+.20,side*c.W*.39);cab(c.L*.25,.018,.025,seam,-.02,yFloor+.24,side*c.W*.405)});
 }
 const wheels=[],half=c.W/2-.2;
 [[c.wf,1],[c.wf,-1],[c.wr,1],[c.wr,-1]].forEach(([x,sd])=>{const w=new THREE.Group();w.position.set(x,c.r,sd*half);w.add(new THREE.Mesh(g.tire,tire));w.add(new THREE.Mesh(g.rim,rim));
  /* Custom wheel face: metallic lip, brake rotor, hub and six lightweight spokes. */
  const faceZ=sd*.176,faceMat=cm('wheelFace'+key,()=>new THREE.MeshStandardMaterial({color:0xe1e5ed,metalness:.9,roughness:.22})),rotorMat=cm('rotor',()=>new THREE.MeshStandardMaterial({color:0x555b66,metalness:.78,roughness:.34}));
  const lip=new THREE.Mesh(new THREE.TorusGeometry(c.r*.53,.022,6,20),faceMat);lip.position.z=faceZ;w.add(lip);
  const rotor=new THREE.Mesh(new THREE.CylinderGeometry(c.r*.43,c.r*.43,.018,16),rotorMat);rotor.rotation.x=Math.PI/2;rotor.position.z=sd*.12;w.add(rotor);
  for(let j=0;j<6;j++){const spoke=new THREE.Mesh(new THREE.BoxGeometry(c.r*.48,.035,.025),faceMat);spoke.position.set(0,0,faceZ);spoke.rotation.z=j*Math.PI/3;w.add(spoke)}
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(c.r*.12,c.r*.12,.04,12),faceMat);hub.rotation.x=Math.PI/2;hub.position.z=sd*.205;w.add(hub);
  /* Small lug nuts and a ventilated brake rotor help the wheels read as real game assets. */
  const lugMat=cm('lug'+key,()=>new THREE.MeshPhongMaterial({color:0x737b89,shininess:120}));
  for(let lug=0;lug<5;lug++){const a=lug*Math.PI*2/5;const nut=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.012,c.r*.025),6,5),lugMat);nut.position.set(Math.cos(a)*c.r*.22,Math.sin(a)*c.r*.22,sd*.208);w.add(nut)}
  G.add(w);wheels.push(w)});
 [c.wf,c.wr].forEach(x=>{const m=new THREE.Mesh(g.well,dark);m.position.set(x,c.r+.25,0);G.add(m)});
 const bx_=(w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);G.add(o);return o},L2=c.L/2,hf=c.hbF;
 [-1,1].forEach(s=>{bx_(.08,.13,.5,wr?dark:hl,L2-.03,hf-.22,s*c.W*.3);bx_(.08,.05,.6,tl,-L2+.01,c.hbR-.28,s*c.W*.32);bx_(.1,.1,.18,paint,c.xfw-.05,c.bl+.06,s*(c.W/2+.04))});
 /* Exterior bodywork: mirror stems/housings, door handles, side skirts, grille slats and license plate. */
 [-1,1].forEach(side=>{
  const stem=bx_(.16,.045,.045,chrome,c.xfw-.22,c.bl+.2,side*(c.W*.48));stem.rotation.y=side*.16;
  const mirror=bx_(.22,.13,.2,paint,c.xfw-.16,c.bl+.25,side*(c.W*.56));mirror.rotation.y=side*.12;
  bx_(c.L*.22,.055,.045,chrome,0,c.bl+.12,side*(c.W*.505));
  bx_(c.L*.68,.075,.08,dark,0,c.r+.14,side*(c.W*.48));
 });
 const frontGrille=bx_(.12,.24,c.W*.28,dark,L2+.025,c.bl-.12,0);
 for(let sl=-2;sl<=2;sl++)bx_(.035,.018,c.W*.25,chrome,L2+.095,c.bl-.19+sl*.045,0);
 bx_(.045,.12,c.W*.3,chrome,L2+.09,c.bl-.31,0);
 bx_(.08,.16,c.W*.24,tl,-L2-.025,c.bl-.16,0);
 /* v44: brake calipers and wheel arch highlight add depth without expensive textures. */
 const caliperMat=cm('caliper'+key,()=>new THREE.MeshPhongMaterial({color:(key==='ferrari'||key==='bugatti')?0xc52b32:0x8b2730,shininess:70}));
  const sidewall=cm('sidewall'+key,()=>new THREE.MeshStandardMaterial({color:0x17191d,metalness:.01,roughness:.94}));
  wheels.forEach(w=>{[-1,1].forEach(side=>{const cal=new THREE.Mesh(new THREE.BoxGeometry(c.r*.18,c.r*.38,.07),caliperMat);cal.position.set(c.r*.36,0,side*.13);w.add(cal);
    /* Molded sidewall/rim-edge grooves and drilled rotor dimples add readable tire and brake detail. */
    const groove=new THREE.Mesh(new THREE.TorusGeometry(c.r*.91,.012,4,28),sidewall);groove.position.z=side*.151;w.add(groove);
    for(let h=0;h<6;h++){const a=h*Math.PI/3,drill=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.012,c.r*.018),5,4),dark);drill.position.set(Math.cos(a)*c.r*.34,Math.sin(a)*c.r*.34,side*.132);w.add(drill)}
  });});
 /* Cabin-visible belt accents and rear headrest details remain lightweight primitives. */
 if(!wr){const belt=cm('belt'+key,()=>new THREE.MeshLambertMaterial({color:0x8a795f}));[-1,1].forEach(side=>{const b=bx_(c.L*.1,.025,.025,belt,c.xft-.27,c.gc+.55,side*c.W*.24);b.rotation.z=.25});}

 bx_(.06,.1,c.W*.5,tl,-L2,c.hbR-.3,0);
 /* v49: separate LED headlamp signatures and rear light bar improve silhouette readability at night. */
 const ledWhite=cm('ledWhite',()=>new THREE.MeshBasicMaterial({color:0xdff6ff})),ledRed=cm('ledRed',()=>new THREE.MeshBasicMaterial({color:0xff183c}));
 const lampLens=cm('lampLens',()=>new THREE.MeshPhysicalMaterial({color:0xdce8ef,metalness:.12,roughness:.08,clearcoat:1,clearcoatRoughness:.035,transparent:true,opacity:.34,depthWrite:false,envMap:ENV_CUBE,envMapIntensity:.55}));
 const tailLens=cm('tailLens',()=>new THREE.MeshPhysicalMaterial({color:0x9e1425,metalness:.18,roughness:.16,clearcoat:1,transparent:true,opacity:.72,emissive:0x240008,envMap:ENV_CUBE,envMapIntensity:.35}));
 [-1,1].forEach(side=>{const head=bx_(.045,.075,c.W*.19,ledWhite,L2+.035,c.gc+.28,side*c.W*.285);head.userData.squadHeadlamp=true;const lens=bx_(.025,.115,c.W*.225,lampLens,L2+.064,c.gc+.28,side*c.W*.285);lens.userData.squadLampLens=true;const rear=bx_(.04,.07,c.W*.2,ledRed,-L2-.04,c.gc+.3,side*c.W*.29);rear.userData.squadTailLamp=true;bx_(.022,.105,c.W*.225,tailLens,-L2-.065,c.gc+.3,side*c.W*.29)});
 bx_(.025,.045,c.W*.56,ledRed,-L2-.045,c.gc+.37,0);
 const grille=cm('gr',()=>new THREE.MeshPhongMaterial({color:0x151518,shininess:60}));bx_(.06,.2,c.W*.5,grille,L2+.005,c.gc+.42,0);
 [-1,1].forEach(s=>[(c.xfw+c.xrr)/2+.35,(c.xfw+c.xrr)/2-.9].forEach(x=>bx_(.025,c.hbF-.25-c.gc,.02,dark,x,(c.bl+c.gc)/2-.1,s*(D/2+bt+.01))));
 /* Extra exterior cues shared by the whole fleet: mirrors, door handles, grille bars, plate and exhausts. */
 const mirror=cm('mirror',()=>new THREE.MeshPhongMaterial({color:0x222a38,shininess:125,specular:0x9fb7d8}));
 const metal=cm('metal',()=>new THREE.MeshPhongMaterial({color:0xaeb8c8,shininess:145,specular:0xffffff}));
 [-1,1].forEach(side=>{
   bx_(.18,.09,.12,dark,c.xfw-.05,c.bl+.07,side*(c.W/2+.1));
   bx_(.22,.13,.18,mirror,c.xfw-.12,c.bl+.14,side*(c.W/2+.17));
   /* Flush handles and lower rocker trim are scaled per vehicle archetype. */
   bx_(.22,.035,.035,metal,(c.xfw+c.xrr)/2,c.bl-.06,side*(c.W/2+.035));
   bx_(c.L*.48,.045,.035,dark,0,c.gc+.13,side*(c.W/2+.035));
 });
 for(let k=0;k<5;k++)bx_(.025,.025,c.W*.31,metal,L2+.045,c.gc+.34+(k-2)*.055,0);
 bx_(.035,.14,c.W*.25,metal,L2+.04,c.gc+.12,0);
 bx_(.035,.11,c.W*.24,dark,-L2-.035,c.gc+.12,0);
 [-1,1].forEach(side=>{const ex= new THREE.Mesh(new THREE.CylinderGeometry(.045,.055,.12,8),metal);ex.rotation.x=Math.PI/2;ex.position.set(-L2+.12,c.gc+.08,side*c.W*.25);G.add(ex)});
 /* v117: model-specific front/rear signatures for the requested flagship SUVs. */
 if(c.brandStyle==='cadillac'){
   const grilleChrome=cm('cadGrilleChrome',()=>new THREE.MeshStandardMaterial({color:0xb8bec8,metalness:.94,roughness:.19,envMap:ENV_CUBE,envMapIntensity:.8}));
   bx_(.08,.34,c.W*.43,dark,L2+.075,c.gc+.48,0);
   for(let i=-4;i<=4;i++)bx_(.035,.31,.035,grilleChrome,L2+.125,c.gc+.48,i*c.W*.047);
   const crest=bx_(.045,.22,.16,grilleChrome,L2+.16,c.gc+.48,0);crest.rotation.x=Math.PI/2;
   [-1,1].forEach(side=>{bx_(.05,.28,.08,grilleChrome,L2+.055,c.gc+.52,side*c.W*.39);bx_(.035,.22,.045,ledWhite,L2+.09,c.gc+.52,side*c.W*.39)});
   bx_(.035,.07,c.W*.72,chrome,L2+.04,c.gc+.2,0);
 } else if(c.brandStyle==='range-rover'){
   const rrChrome=cm('rrGrilleChrome',()=>new THREE.MeshStandardMaterial({color:0x9ea7b2,metalness:.9,roughness:.24,envMap:ENV_CUBE,envMapIntensity:.7}));
   bx_(.07,.24,c.W*.46,dark,L2+.07,c.gc+.43,0);
   for(let i=-3;i<=3;i++)bx_(.035,.018,c.W*.43,rrChrome,L2+.12,c.gc+.43+i*.032,0);
   [-1,1].forEach(side=>{bx_(.04,.16,.06,ledWhite,L2+.07,c.gc+.52,side*c.W*.39);bx_(.08,.045,.07,chrome,c.xfw-.1,c.bl+.22,side*c.W*.51)});
   bx_(c.L*.34,.035,.035,chrome,0,c.bl+.08,c.W*.505);
 } else if(c.brandStyle==='bmw-x6m'){
   const kidney=cm('bmwKidney',()=>new THREE.MeshStandardMaterial({color:0x090c12,metalness:.72,roughness:.24}));
   [-1,1].forEach(side=>{bx_(.10,.29,c.W*.105,kidney,L2+.065,c.gc+.47,side*c.W*.115);for(let j=-2;j<=2;j++)bx_(.025,.24,.018,chrome,L2+.12,c.gc+.47+j*.045,side*c.W*.115)});
   [-1,1].forEach(side=>{bx_(.045,.08,.22,ledWhite,L2+.07,c.gc+.59,side*c.W*.34);bx_(.12,.045,.08,chrome,c.xft-.05,c.bl+.13,side*c.W*.51)});
   for(let side of [-1,1]){const tip=new THREE.Mesh(new THREE.CylinderGeometry(.055,.06,.14,10),chrome);tip.rotation.x=Math.PI/2;tip.position.set(-L2-.04,c.gc+.16,side*c.W*.34);G.add(tip)}
   bx_(c.L*.23,.045,.035,dark,-L2+.18,c.hbR+.06,0);
 } else if(c.brandStyle==='g63'){
   const gChrome=cm('g63Chrome',()=>new THREE.MeshStandardMaterial({color:0xb6bdc8,metalness:.9,roughness:.22}));
   bx_(.08,.42,c.W*.39,dark,L2+.075,c.gc+.55,0);
   for(let j=-3;j<=3;j++)bx_(.035,.35,.025,gChrome,L2+.13,c.gc+.55,j*c.W*.052);
   const star=new THREE.Mesh(new THREE.TorusGeometry(.105,.018,6,18),gChrome);star.position.set(L2+.15,c.gc+.55,0);star.rotation.y=Math.PI/2;G.add(star);
   [-1,1].forEach(side=>{bx_(.045,.22,.07,ledWhite,L2+.06,c.gc+.62,side*c.W*.39);bx_(c.L*.25,.10,.12,dark,(c.xfw+c.xrr)/2,c.gc+.12,side*(c.W*.53));bx_(.07,.12,.07,gChrome,c.xfw-.15,c.H-.04,side*c.W*.48)});
   const spare=new THREE.Mesh(new THREE.TorusGeometry(c.r*.63,.10,8,24),tire);spare.position.set(-L2-.10,c.bl+.18,0);spare.rotation.y=Math.PI/2;G.add(spare);
   const spareHub=new THREE.Mesh(new THREE.CylinderGeometry(c.r*.38,c.r*.38,.12,16),rim);spareHub.position.set(-L2-.13,c.bl+.18,0);spareHub.rotation.z=Math.PI/2;G.add(spareHub);
   bx_(c.L*.72,.045,.04,gChrome,0,c.gc+.15,0);
 }
 if(key=='rolls'){const gold=cm('gold',()=>new THREE.MeshPhongMaterial({color:0xd9a441,shininess:150,specular:0xffeeaa,emissive:0x3a2a08}));bx_(.12,.8,.7,chrome,L2+.04,c.gc+.62,0);bx_(.14,.7,.5,gold,L2+.05,c.gc+.62,0);const st=new THREE.Mesh(new THREE.ConeGeometry(.07,.28,8),gold);st.position.set(L2-.28,hf+.2,0);st.rotation.z=-1.3;G.add(st);bx_(c.L*.9,.03,.04,gold,0,c.hbF*.9,D/2+bt+.012);bx_(c.L*.9,.03,.04,gold,0,c.hbF*.9,-D/2-bt-.012)}
 if(key=='ferrari'){bx_(.4,.05,c.W*.92,dark,-L2+.15,c.hbR+.38,0);[-1,1].forEach(s=>bx_(.06,.34,.05,dark,-L2+.2,c.hbR+.2,s*c.W*.35));bx_(c.L*.55,.01,.3,chrome,.3,c.hbF+.02,0).material=cm('wh',()=>new THREE.MeshBasicMaterial({color:0xffffff}))}
 if(key=='bugatti'){bx_(c.L*.8,.012,.3,dark,.1,c.H-.01,0);const hs=new THREE.Mesh(new THREE.TorusGeometry(.26,.05,8,16,Math.PI),dark);hs.rotation.set(0,Math.PI/2,Math.PI);hs.position.set(L2+.03,c.gc+.45,0);G.add(hs);bx_(.05,.14,.14,new THREE.MeshBasicMaterial({color:0xff2020}),L2+.06,c.gc+.5,0);bx_(c.L*.38,.2,.012,cm('bc',()=>new THREE.MeshPhongMaterial({color:0x7ff6ff,shininess:140,emissive:0x0a3a4a})),-.2,c.H*.52,D/2+bt+.012)}
 if(!wr){const ug=new THREE.Mesh(new THREE.PlaneGeometry(c.L*1.12,c.W*1.12),new THREE.MeshBasicMaterial({color:NEON_PALETTE[NEON_INDEX],transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false}));ug.rotation.x=-Math.PI/2;ug.position.y=.045;ug.userData.squadNeon=true;G.add(ug);const stripMat=new THREE.MeshBasicMaterial({color:NEON_PALETTE[NEON_INDEX]});[-1,1].forEach(side=>{const strip=new THREE.Mesh(new THREE.BoxGeometry(c.L*.72,.018,.025),stripMat);strip.position.set(0,c.r+.18,side*(c.W*.51));strip.userData.squadNeon=true;G.add(strip)})}
 /* Premium neon underglow, restrained so paint and body contours remain readable. */
 if(!wr){const neonColor=key==='ferrari'||key==='bugatti'?0xff284d:key==='limo'||key==='rolls'?0xffd46b:0x36dfff;const underMat=cm('underNeon'+key,()=>new THREE.MeshBasicMaterial({color:neonColor,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false}));const under=new THREE.Mesh(new THREE.PlaneGeometry(c.L*.72,c.W*.72),underMat);under.rotation.x=-Math.PI/2;under.position.set(0,Math.max(.045,c.r*.24),0);G.add(under);const stripMat=cm('trimNeon'+key,()=>new THREE.MeshBasicMaterial({color:neonColor}));[-1,1].forEach(side=>{const strip=new THREE.Mesh(new THREE.BoxGeometry(c.L*.52,.018,.018),stripMat);strip.position.set(0,c.bl+.04,side*c.W*.475);G.add(strip)});}
 G.userData.wheels=wheels;G.userData.r=c.r;
 if(wr==1){G.rotation.z=.05;G.userData.tilt=1}
 const R=new THREE.Group();R.add(G);if(wr==2){G.rotation.x=Math.PI;G.position.y=c.H}
 if(wr){const fl=glowS(0,0,0,0xff7a1a,2.4,.8);fl.position.set(c.L*.3,c.hbF+.5,0);R.add(fl)}
 /* v85: brake lamps react to deceleration; low-count wheel spray appears only when moving through mapped wet patches. */
 const brakeMat=new THREE.MeshStandardMaterial({color:0x70101a,emissive:0x360008,emissiveIntensity:.35,roughness:.3,metalness:.08});
 const brakeLights=[];[-1,1].forEach(side=>{const lamp=new THREE.Mesh(new THREE.BoxGeometry(.035,.075,c.W*.16),brakeMat.clone());lamp.position.set(-L2-.055,c.bl-.12,side*c.W*.27);R.add(lamp);brakeLights.push(lamp)});
 const sprayMat=new THREE.MeshBasicMaterial({color:0xc9eaff,transparent:true,opacity:0,depthWrite:false});const spray=[];
 for(let i=0;i<4;i++){const drop=new THREE.Mesh(new THREE.SphereGeometry(.035,6,5),sprayMat.clone());drop.position.set(-c.L*.22,c.r*.18,(i%2?1:-1)*(c.W*.43));drop.visible=false;R.add(drop);spray.push(drop)}
 R.userData.brakeLights=brakeLights;R.userData.spray=spray;R.userData.wheels=wheels;R.userData.r=c.r;if(c.catalog&&!c.brandSpecific)loadSquadModel(G,c,R);return R}
const LIFTS=[],SLIDERS=[],CARO=[],REMOTE_CARS={},AUTO_ENGINEERS=[],FOUNTAIN_DROPS=[],FOUNTAIN_RIPPLES=[],WET_PATCHES=[];let fountainWaterSurface=null;
function build(){
 sc=new THREE.Scene();sc.background=new THREE.Color(0x0d0828);sc.fog=new THREE.Fog(0x0d0828,90,400);
 cam=new THREE.PerspectiveCamera(64,1,.1,800);
 ren=new THREE.WebGLRenderer({canvas:q('#dstC'),antialias:!MOB});
 /* Lightweight procedural cubemap: actual environment reflections without downloading large HDR files. */
 if(!ENV_CUBE){const faces=[];for(let f=0;f<6;f++){const cv=document.createElement('canvas');cv.width=cv.height=128;const cx=cv.getContext('2d'),gr=cx.createLinearGradient(0,0,0,128);gr.addColorStop(0,'#182b50');gr.addColorStop(.48,'#33415a');gr.addColorStop(.5,'#f3c77a');gr.addColorStop(.54,'#101827');gr.addColorStop(1,'#050914');cx.fillStyle=gr;cx.fillRect(0,0,128,128);for(let j=0;j<24;j++){cx.fillStyle=j%4===0?'rgba(65,210,255,.85)':'rgba(255,190,95,.62)';cx.fillRect((j*37+f*19)%124,48+(j*13)%55,2+(j%3),3+(j%5)*2)}faces.push(cv)}ENV_CUBE=new THREE.CubeTexture(faces);ENV_CUBE.needsUpdate=true;}
 /* City-only reflection probe: warm window lights and a cool skyline, isolated from car materials. */
 if(!CITY_ENV_CUBE){const faces=[];for(let f=0;f<6;f++){const cv=document.createElement('canvas');cv.width=cv.height=256;const cx=cv.getContext('2d'),gr=cx.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#263b58');gr.addColorStop(.38,'#68778a');gr.addColorStop(.49,'#d8a66e');gr.addColorStop(.52,'#202b3c');gr.addColorStop(1,'#080e19');cx.fillStyle=gr;cx.fillRect(0,0,256,256);for(let x=0;x<256;x+=17){const h=22+(x*29+f*13)%62;cx.fillStyle='#101a29';cx.fillRect(x,145-h,12,h+45);for(let y=154-h;y<145;y+=9)for(let wx=x+3;wx<x+10;wx+=5){cx.fillStyle=((x+y+f)%4===0)?'#f5c77d':'#42566b';cx.fillRect(wx,y,2,3)}}for(let j=0;j<22;j++){cx.fillStyle=j%3?'rgba(255,199,120,.48)':'rgba(130,207,230,.38)';cx.fillRect((j*43+f*19)%252,108+(j*17)%70,2+(j%4),3+(j%5))}faces.push(cv)}CITY_ENV_CUBE=new THREE.CubeTexture(faces);CITY_ENV_CUBE.needsUpdate=true;}
 ren.setPixelRatio(Math.min(devicePixelRatio||1,MOB?1.0:1.25));ren.shadowMap.enabled=!MOB&&!!ren.capabilities.isWebGL2;ren.shadowMap.type=THREE.PCFSoftShadowMap;if('outputEncoding' in ren && THREE.sRGBEncoding)ren.outputEncoding=THREE.sRGBEncoding;if('toneMapping' in ren && THREE.ACESFilmicToneMapping!==undefined){ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.08}ray=new THREE.Raycaster();
 sc.add(new THREE.HemisphereLight(0xb4bcff,0x17243b,1.05));sc.add(new THREE.AmbientLight(0x526a9b,.28));const cityGlow=new THREE.PointLight(0x287dff,.55,260);cityGlow.position.set(0,36,0);sc.add(cityGlow);const warmGlow=new THREE.PointLight(0xffa34d,.35,190);warmGlow.position.set(-95,22,80);sc.add(warmGlow);const sun=new THREE.DirectionalLight(0xffd2a8,.62);sun.position.set(-80,120,60);if(ren.shadowMap.enabled){sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.near=1;sun.shadow.camera.far=360;sun.shadow.camera.left=-190;sun.shadow.camera.right=190;sun.shadow.camera.top=190;sun.shadow.camera.bottom=-190;sun.shadow.bias=-.00018;sun.shadow.normalBias=.025}sc.add(sun);
 /* الأرض: بلوكات + شوارع + حدايق */
 const S=2048,B2=DC.BOUND*2+20,k=S/B2,X=x=>(x+B2/2)*k,Z=z=>(z+B2/2)*k;
 const gt=cvt(S,S,g=>{g.fillStyle='#2b2630';g.fillRect(0,0,S,S);g.fillStyle='#141c34';g.fillRect(X(-DC.CITY),Z(-DC.CITY),DC.CITY*2*k,DC.CITY*2*k);let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let i=0;i<5000;i++){g.fillStyle=r()<.5?'#18213c':'#10172c';g.fillRect(r()*S,r()*S,3+r()*8,3+r()*8)}
  MP.parks.forEach(p=>{g.fillStyle='#173d30';g.fillRect(X(p.x0),Z(p.z0),(p.x1-p.x0)*k,(p.z1-p.z0)*k);g.fillStyle='#1d4a38';for(let i=0;i<260;i++)g.fillRect(X(p.x0+r()*(p.x1-p.x0)),Z(p.z0+r()*(p.z1-p.z0)),3+r()*6,3+r()*6)});
  MP.roads.forEach(o=>{g.fillStyle='#3a4068';g.fillRect(X(o.cx-o.hw-1.2),Z(o.cz-o.hd-1.2),(o.hw*2+2.4)*k,(o.hd*2+2.4)*k)});
  MP.roads.forEach(o=>{g.fillStyle='#202642';g.fillRect(X(o.cx-o.hw),Z(o.cz-o.hd),o.hw*2*k,o.hd*2*k);
   /* UHD-style wet asphalt microtexture: fine aggregate, subtle tire sheen and lane-edge reflections. */
   g.save();g.beginPath();g.rect(X(o.cx-o.hw),Z(o.cz-o.hd),o.hw*2*k,o.hd*2*k);g.clip();
   for(let j=0;j<180;j++){const px=X(o.cx-o.hw)+r()*o.hw*2*k,py=Z(o.cz-o.hd)+r()*o.hd*2*k;g.fillStyle=j%5===0?'rgba(115,155,210,.12)':'rgba(3,7,18,.12)';g.fillRect(px,py,2+r()*14,1+r()*2)}
   g.fillStyle='rgba(90,165,255,.18)';if(o.hw>o.hd){g.fillRect(X(o.cx-o.hw),Z(o.cz-o.hd),o.hw*2*k,Math.max(1,.07*k));g.fillRect(X(o.cx-o.hw),Z(o.cz+o.hd)-Math.max(1,.07*k),o.hw*2*k,Math.max(1,.07*k))}else{g.fillRect(X(o.cx-o.hw),Z(o.cz-o.hd),Math.max(1,.07*k),o.hd*2*k);g.fillRect(X(o.cx+o.hw)-Math.max(1,.07*k),Z(o.cz-o.hd),Math.max(1,.07*k),o.hd*2*k)}g.restore()});
  g.fillStyle='#363c68';g.beginPath();g.arc(X(0),Z(0),9*k,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.4)';for(let x=-DC.CITY;x<DC.CITY;x+=4)g.fillRect(X(x),Z(-.12),2*k,.24*k);MP.XS.forEach(xc=>{const ZL=xc?DC.CITY:DC.BOUND;for(let z=-ZL;z<ZL;z+=4)g.fillRect(X(xc-.12),Z(z),.24*k,2*k)});MP.ZS.forEach(zc=>{for(let x=-DC.CITY;x<DC.CITY;x+=4)g.fillRect(X(x),Z(zc-.12),2*k,.24*k)});
  g.fillStyle='rgba(255,255,255,.55)';MP.buildings.forEach(b=>{const w=b.W(0,b.hd+.6);g.fillRect(X(w[0]-2.5),Z(w[1]-.2+(b.dir<0?-.4:0)),5*k,.5*k)})});
 const gndMat=new THREE.MeshPhongMaterial({map:gt,color:0xffffff,specular:0x202a46,shininess:18});const gnd=mesh(new THREE.PlaneGeometry(B2,B2),gndMat,0,0,0);gnd.rotation.x=-Math.PI/2;
 /* v84: physically textured asphalt overlays. A reusable aggregate texture drives both color and shallow bump; UV density is scaled per road segment. */
 const asphaltCanvas=document.createElement('canvas');asphaltCanvas.width=asphaltCanvas.height=256;const ag=asphaltCanvas.getContext('2d');ag.fillStyle='#292b2e';ag.fillRect(0,0,256,256);
 let asphaltSeed=841;const ar=()=>{asphaltSeed=(asphaltSeed*16807)%2147483647;return asphaltSeed/2147483647};
 for(let i=0;i<19000;i++){const v=24+Math.floor(ar()*54),a=.12+ar()*.42;ag.fillStyle=`rgba(${v},${v+1},${v+3},${a})`;const x=ar()*256,y=ar()*256;ag.fillRect(x,y,ar()<.16?2:1,ar()<.12?2:1)}
 for(let i=0;i<34;i++){ag.strokeStyle=`rgba(7,9,12,${.08+ar()*.14})`;ag.lineWidth=.4+ar()*.9;ag.beginPath();let x=ar()*256,y=ar()*256;ag.moveTo(x,y);for(let j=0;j<4;j++){x+=(ar()-.5)*22;y+=(ar()-.5)*18;ag.lineTo(x,y)}ag.stroke()}
 const asphaltTex=new THREE.CanvasTexture(asphaltCanvas);asphaltTex.wrapS=asphaltTex.wrapT=THREE.RepeatWrapping;asphaltTex.anisotropy=Math.min(8,ren.capabilities.getMaxAnisotropy?ren.capabilities.getMaxAnisotropy():4);if(THREE.sRGBEncoding)asphaltTex.encoding=THREE.sRGBEncoding;
 const asphaltMat=new THREE.MeshStandardMaterial({map:asphaltTex,bumpMap:asphaltTex,bumpScale:.045,color:0xffffff,metalness:.035,roughness:.91});
 const puddleMat=new THREE.MeshPhysicalMaterial({color:0x53616b,metalness:.24,roughness:.12,clearcoat:1,clearcoatRoughness:.045,transparent:true,opacity:.25,depthWrite:false});
 MP.roads.forEach((o,i)=>{const horizontal=o.hw>o.hd,w=horizontal?o.hw*2:o.hd*2,d=horizontal?o.hd*2:o.hw*2,geo=new THREE.PlaneGeometry(w,d),uv=geo.attributes.uv;for(let n=0;n<uv.count;n++){uv.setXY(n,uv.getX(n)*w/18,uv.getY(n)*d/18)}uv.needsUpdate=true;geo.computeVertexNormals();const road=new THREE.Mesh(geo,asphaltMat);road.rotation.x=-Math.PI/2;road.position.set(o.cx,.014,o.cz);road.receiveShadow=true;sc.add(road);
  /* Scattered thin puddles catch street lights without a costly screen-space reflection pass. */
  for(let j=0;j<(MOB?1:4);j++){const px=o.cx+(ar()-.5)*Math.max(1,w-5),pz=o.cz+(ar()-.5)*Math.max(1,d-3),r=.35+ar()*1.35,pg=new THREE.CircleGeometry(r,12),pm=new THREE.Mesh(pg,puddleMat);pm.rotation.x=-Math.PI/2;pm.rotation.z=ar()*Math.PI;pm.scale.set(1.5,.55,1);pm.position.set(px,.022+j*.0002,pz);sc.add(pm);WET_PATCHES.push({x:px,z:pz,rx:r*1.5,rz:r*.55})}
 });
 /* v85: lane paint and reflective studs are batched into two meshes to avoid thousands of draw calls. */
 const lanePaint=new THREE.MeshStandardMaterial({color:0xd8d5c8,roughness:.88,metalness:0,transparent:true,opacity:.72});
 const roadStudMat=new THREE.MeshStandardMaterial({color:0xc7d6df,metalness:.72,roughness:.24,emissive:0x15212b,emissiveIntensity:.22});
 const lanePos=[],laneIdx=[],studPos=[],studIdx=[];
 const addRoadQuad=(pos,idx,x,z,w,d,y)=>{const b=pos.length/3;pos.push(x-w/2,y,z-d/2,x-w/2,y,z+d/2,x+w/2,y,z+d/2,x+w/2,y,z-d/2);idx.push(b,b+1,b+2,b,b+2,b+3)};
 MP.roads.forEach(o=>{const horizontal=o.hw>o.hd,halfWidth=horizontal?o.hd:o.hw,length=horizontal?o.hw*2:o.hd*2;if(halfWidth<2.7||length<18)return;
   const step=MOB?18:12,seg=MOB?1.65:2.25;
   for(let u=-length/2+5;u<length/2-2;u+=step){if(horizontal){addRoadQuad(lanePos,laneIdx,o.cx+u,o.cz,seg,.075,.027);addRoadQuad(lanePos,laneIdx,o.cx+u,o.cz+halfWidth*.73,seg,.052,.027);addRoadQuad(lanePos,laneIdx,o.cx+u,o.cz-halfWidth*.73,seg,.052,.027)}else{addRoadQuad(lanePos,laneIdx,o.cx,o.cz+u,.075,seg,.027);addRoadQuad(lanePos,laneIdx,o.cx+halfWidth*.73,o.cz+u,.052,seg,.027);addRoadQuad(lanePos,laneIdx,o.cx-halfWidth*.73,o.cz+u,.052,seg,.027)}}
   const count=Math.min(MOB?7:14,Math.floor(length/12));for(let i=0;i<count;i++){const u=-length/2+4+i*(length-8)/Math.max(1,count-1);[-1,1].forEach(side=>addRoadQuad(studPos,studIdx,horizontal?o.cx+u:o.cx+side*(halfWidth*.84),horizontal?o.cz+side*(halfWidth*.84):o.cz+u,.13,.085,.036))}
 });
 const addBatchedRoadMesh=(positions,indices,material)=>{if(!positions.length)return;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,material);mesh.frustumCulled=true;sc.add(mesh)};
 addBatchedRoadMesh(lanePos,laneIdx,lanePaint);addBatchedRoadMesh(studPos,studIdx,roadStudMat);
 /* Soft wet-road glints: restrained emissive strips add night depth without expensive real-time reflections. */
 MP.roads.forEach((o,i)=>{const wide=o.hw>o.hd,edge=new THREE.MeshBasicMaterial({color:i%3===0?0x3fe0ff:0x8aa8ff,transparent:true,opacity:.12,depthWrite:false});[-1,1].forEach(side=>{const w=wide?o.hw*2:o.hd*2,d=.09,plane=new THREE.Mesh(new THREE.PlaneGeometry(wide?w:d,wide?d:w),edge);plane.rotation.x=-Math.PI/2;plane.position.set(wide?o.cx:o.cx+side*(o.hw-.18),.025,wide?o.cz+side*(o.hd-.18):o.cz);sc.add(plane)})});
 /* v74: premium city streetscape — raised stone sidewalks, curbs, lane paint and marked crossings. All details are batched with the existing city meshes. */
 MP.roads.forEach((o,i)=>{const horizontal=o.hw>o.hd,sidewalk=0x49484b,curb=0xb7a88d;
  [-1,1].forEach(side=>{if(horizontal){const z=o.cz+side*(o.hd+2.15);mbox('lit',o.cx,0.035,z,o.hw*2,.12,2.5,sidewalk);mbox('lit',o.cx,.105,o.cz+side*(o.hd+.82),o.hw*2,.16,.22,curb)}else{const x=o.cx+side*(o.hw+2.15);mbox('lit',x,.035,o.cz,2.5,.12,o.hd*2,sidewalk);mbox('lit',o.cx+side*(o.hw+.82),.105,o.cz,.22,.16,o.hd*2,curb)}});
 });
 /* Crisp dashed lane dividers on the major boulevards. */
 [0,350,420].forEach(z=>{for(let x=-270;x<=270;x+=18)mbox('emi',x,.052,z,8,.018,.12,0xd8d3c5)});
 [-240,-180,-120,-60,0,60,120,180,240].forEach(x=>{for(let z=-270;z<=270;z+=18)mbox('emi',x,.052,z,.12,.018,8,0xd8d3c5)});
 /* Crosswalks at the busiest downtown junctions. */
 [-180,-60,60,180].forEach(x=>[-185,-45,45,185].forEach(z=>{
  for(let j=-2;j<=2;j++){mbox('emi',x+j*1.25,.058,z-6.1,.72,.025,1.1,0xe8e3d8);mbox('emi',x+j*1.25,.058,z+6.1,.72,.025,1.1,0xe8e3d8);mbox('emi',x-6.1,.058,z+j*1.25,1.1,.025,.72,0xe8e3d8);mbox('emi',x+6.1,.058,z+j*1.25,1.1,.025,.72,0xe8e3d8)}
 }));
 /* Downtown fountain square: a restrained stone ring and radial paving joints. */
 for(let r=1;r<=3;r++){const d=7+r*2.1;mbox('lit',0,.025,-d, d*2,.035,.055,0x77716a);mbox('lit',0,.025,d,d*2,.035,.055,0x77716a);mbox('lit',-d,.025,0,.055,.035,d*2,0x77716a);mbox('lit',d,.025,0,.055,.035,d*2,0x77716a)}
 /* Royal District gateway — the approach to the villas and The Squad palace. */
 {const gold=0xd9b66b,stone=0x34343a,glass=0x8c7750;
  [-18,18].forEach(x=>{mbox('lit',x,4.1,270,1.5,8.2,1.5,stone);mbox('lit',x,8.25,270,2.0,.35,2.0,gold);mbox('emi',x,4.3,269.18,.12,6.8,.08,gold);mbox('emi',x,1.2,269.1,.75,.12,.08,glass)});
  mbox('lit',0,8.15,270,37,.8,1.6,stone);mbox('emi',0,8.2,269.12,34,.16,.12,gold);
  const sign=textTex('THE SQUAD  •  ROYAL DISTRICT',1024,128,'800 58px Arial,sans-serif','#f0d18b','rgba(8,10,16,.94)');const panel=mesh(new THREE.PlaneGeometry(27,3.35),Bm(0xffffff,{map:sign,transparent:true,depthWrite:false}),0,6.1,269.05);panel.rotation.y=0;
  [-1,1].forEach(side=>{for(let j=0;j<3;j++){const x=side*(24+j*5);mbox('emi',x,1.2,270,.12,2.2,.12,0xe6bd72)}})
 }
 /* Park furniture: benches, low planters and warm marker lights, placed away from the walking lanes. */
 [[-210,-150],[-90,-150],[90,150],[210,150],[-210,150],[210,-150]].forEach(([x,z],i)=>{
  mbox('lit',x,.42,z,2.5,.18,.72,0x594536);mbox('lit',x,.72,z-.28,2.5,.5,.12,0x332b27);mbox('lit',x,.72,z+.28,2.5,.5,.12,0x332b27);
  [-1,1].forEach(side=>mbox('lit',x+side*1.05,.24,z,.12,.48,.12,0xc0a36e));
  mbox('lit',x+3,.18,z,1.1,.36,1.1,0x344b3b);mbox('emi',x+3,.52,z,.12,.25,.12,0xffd58b)
 });
 /* v80: City life layer — landscaped neighborhood squares, transit shelters and a Royal Boulevard promenade.
    All props are decorative, batched through the existing mesh buckets, and do not alter vehicle meshes or physics. */
 const plazaParks=MP.parks.filter(p=>(p.x1-p.x0)>=40&&(p.z1-p.z0)>=24);
 plazaParks.forEach((p,i)=>{let x=(p.x0+p.x1)/2,z=(p.z0+p.z1)/2,bestClearance=-1;
  for(let cx=p.x0+10;cx<=p.x1-10;cx+=2)for(let cz=p.z0+9;cz<=p.z1-9;cz+=2){let clearance=Infinity;for(const tr of MP.trees)clearance=Math.min(clearance,Math.hypot(tr.x-cx,tr.z-cz));if(clearance>bestClearance){bestClearance=clearance;x=cx;z=cz}}
  /* Stone plaza pad with a champagne border and a compact water feature. */
  mbox('lit',x,.045,z,Math.min(22,p.x1-p.x0-8),.09,Math.min(18,p.z1-p.z0-8),0x55545a);
  mbox('emi',x,.098,z,Math.min(19,p.x1-p.x0-11),.018,.09,0xc5a66b);
  mbox('emi',x,.098,z,.09,.018,Math.min(15,p.z1-p.z0-11),0xc5a66b);
  const basin=mesh(new THREE.CylinderGeometry(2.35,2.55,.32,20),Lm(0x77736c),x,.23,z);
  const water=mesh(new THREE.CylinderGeometry(2.08,2.08,.035,24),new THREE.MeshPhongMaterial({color:0x3d91a0,transparent:true,opacity:.78,shininess:100,emissive:0x082b32}),x,.405,z);
  const ring=mesh(new THREE.TorusGeometry(2.28,.055,6,32),Lm(0xd8bd82),x,.43,z);ring.rotation.x=Math.PI/2;
  mesh(new THREE.CylinderGeometry(.22,.32,1.05,8),Lm(0x9b927e),x,.92,z);
  const orb=mesh(new THREE.SphereGeometry(.42,10,8),Bm(0xffd58b),x,1.62,z);glowS(x,1.72,z,0xffd58b,4.2,.42);
  /* Four compact benches and raised planters define a clear pedestrian loop. */
  [[-7,0,0],[7,0,Math.PI],[0,-6,Math.PI/2],[0,6,-Math.PI/2]].forEach(([dx,dz,rot],j)=>{
   const bx=x+dx,bz=z+dz;mbox('lit',bx,.42,bz,2.35,.16,.62,0x594536);mbox('lit',bx,.72,bz-.22,2.35,.42,.12,0x352c27);mbox('lit',bx,.72,bz+.22,2.35,.42,.12,0x352c27);
   [-.92,.92].forEach(side=>mbox('lit',bx+side,.23,bz,.1,.46,.1,0xc5a66b));
  });
  [[-8,-7],[8,-7],[-8,7],[8,7]].forEach(([dx,dz],j)=>{
   const px=x+dx,pz=z+dz;mbox('lit',px,.22,pz,2.0,.44,1.5,0x344a3d);mbox('lit',px,.49,pz,1.72,.16,1.2,0x20382f);
   for(let n=0;n<3;n++)mbox('lit',px- .5+n*.5,.85+(n%2)*.12,pz,.38,.8,.38,[0x286b4a,0x347e55,0x245b42][(n+j)%3]);
  });
  /* Low warm bollards mark the square corners without adding dynamic lights. */
  [[-10,-8],[10,-8],[-10,8],[10,8]].forEach(([dx,dz])=>{mbox('lit',x+dx,.48,z+dz,.22,.9,.22,0x514b43);mbox('emi',x+dx,.92,z+dz,.18,.12,.18,0xffd58b)});
 });
 /* Royal Boulevard: planted edge beds, gold inlays and gateway approach markers. */
 for(let x=-250;x<=250;x+=25){
  [-1,1].forEach(side=>{const z=350+side*10.1;mbox('lit',x,.16,z,9,.32,1.25,0x343e35);mbox('lit',x,.38,z,8.4,.18,.9,0x243c30);
   for(let j=0;j<3;j++)mbox('lit',x-2.5+j*2.5,.78+(j%2)*.12,z,.85,.82,.85,j%2?0x34784f:0x285d40);
   mbox('emi',x,.12,z+side*.72,8,.035,.045,0xd8b66b);
  });
 }
 /* Transit shelters in selected park edges: glass canopy, bench, route marker and warm lighting. */
 [[30,58],[150,58],[-30,128],[210,80]].forEach(([x,z],i)=>{
  const steel=0x6d747d,glassMat=new THREE.MeshPhysicalMaterial({color:0x91b6c0,metalness:.12,roughness:.16,transparent:true,opacity:.2,depthWrite:false,clearcoat:.8});
  [-1,1].forEach(side=>{mbox('lit',x+side*2.1,1.35,z,.12,2.7,.12,steel);mbox('lit',x+side*2.1,1.35,z+1.5,.12,2.7,.12,steel)});
  mbox('lit',x,2.78,z+.75,4.5,.18,2.2,0x303743);mbox('emi',x,2.9,z+.75,4.25,.045,2.0,0xd9b66b);
  const back=mesh(new THREE.PlaneGeometry(4.1,2.1),glassMat,x,1.48,z+1.48);back.rotation.y=0;
  mbox('lit',x,.55,z-.15,2.6,.18,.62,0x54463b);mbox('lit',x,.78,z-.15,2.6,.28,.12,0x332b27);
  mbox('lit',x+2.75,1.35,z-.1,.5,2.7,.5,0x283548);mbox('emi',x+2.75,1.85,z-.37,.36,.52,.04,0xd8b66b);
  glowS(x-1.8,2.8,z+.75,0xffd58b,2.8,.28);
 });
 /* Traffic signal heads at the central arterial crossings; no gameplay collision or car edits. */
 [-180,-60,60,180].forEach(x=>[-185,-45,45,185].forEach(z=>{
  [[-7.4,-7.4],[7.4,7.4]].forEach(([dx,dz],i)=>{
   const sx=x+dx,sz=z+dz;mbox('lit',sx,2.1,sz,.14,4.2,.14,0x34383c);mbox('lit',sx,4.05,sz,.72,1.25,.42,0x15191e);
   [0,1,2].forEach(k=>mbox('emi',sx,4.42-k*.36,sz-.22,.2,.2,.06,[0xc83d35,0xd9b66b,0x4bb879][k]));
  });
 }));
 const out=mesh(new THREE.PlaneGeometry(2400,2400),Lm(0x0a0620),0,-.06,0);out.rotation.x=-Math.PI/2;
 /* سور المدينة */
 [[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b])=>{const L=DC.BOUND*2+2;mbox('emi',a*DC.BOUND,.15,b*DC.BOUND,a?.3:L,.3,b?.3:L,0x3fe0ff);mbox('glass',a*DC.BOUND,5,b*DC.BOUND,a?.2:L,10,b?.2:L,0x5fd0ff)});
 /* نجوم + قمر */
 {const p=[];for(let i=0;i<700;i++){const a=Math.random()*Math.PI*2,e=.06+Math.random()*1.3,r=700;p.push(Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,Math.sin(a)*Math.cos(e)*r)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));sc.add(new THREE.Points(g,new THREE.PointsMaterial({size:2.2,color:0xffffff,fog:false})))}
 mesh(new THREE.SphereGeometry(22,16,12),Bm(0xfff4d6,{fog:false}),-260,230,-500);
 /* مباني الخلفية: فلاتر بتنور بالليل */
 const FS=['grid','tall','strip','glass','brick'];FS.forEach((st,i)=>{const t=fac('#9aa3c8',31+i*17,st)(1,1);WM['win'+i]=new THREE.MeshStandardMaterial({vertexColors:true,map:t.map,emissive:0xffffff,emissiveMap:t.emi,emissiveIntensity:.58,roughnessMap:t.rough,bumpMap:t.bump,bumpScale:st==='glass'?.008:.026,metalness:st==='glass'?.42:.14,roughness:st==='glass'?.24:.82,envMap:CITY_ENV_CUBE,envMapIntensity:st==='glass'?.62:.22});});
 const pbrTex=base=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,128,128);for(let i=0;i<700;i++){const x=(i*37)%128,y=(i*71)%128;g.fillStyle=i%2?'rgba(255,255,255,.045)':'rgba(0,0,0,.055)';g.fillRect(x,y,1+(i%3),1)}for(let y=0;y<128;y+=16){g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,y,128,1)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t};
 const stoneTex=pbrTex('#77736b'),metalTex=pbrTex('#777f88'),glassTex=pbrTex('#9db8c4');
 WM.pbrStone=new THREE.MeshStandardMaterial({vertexColors:true,map:stoneTex,metalness:.08,roughness:.88,bumpMap:stoneTex,bumpScale:.035,envMap:CITY_ENV_CUBE,envMapIntensity:.14});
 WM.pbrMetal=new THREE.MeshStandardMaterial({vertexColors:true,map:metalTex,metalness:.82,roughness:.28,envMap:CITY_ENV_CUBE,envMapIntensity:.72});
 WM.pbrGlass=new THREE.MeshPhysicalMaterial({vertexColors:true,map:glassTex,metalness:.38,roughness:.16,clearcoat:1,clearcoatRoughness:.08,transparent:true,opacity:.48,depthWrite:false,envMap:CITY_ENV_CUBE,envMapIntensity:.82});
 MP.fillers.forEach((o,idx)=>{const i=FS.indexOf(o.st),c=hsl(o.hue,o.sat,o.lig+18);mbox('win'+i,o.cx,o.h/2,o.cz,o.hw*2,o.h,o.hd*2,c,14);
  mbox('lit',o.cx,o.h+.3,o.cz,o.hw*2+.4,.6,o.hd*2+.4,0x2a2f4a);mbox('emi',o.cx,4.2,o.cz,o.hw*2+.12,.22,o.hd*2+.12,hsl(o.hue,90,60));
  if(o.h>20){mbox('lit',o.cx+o.hw*.3,o.h+1.2,o.cz-o.hd*.2,o.hw*.5,1.2,o.hd*.4,0x3a3f5a);
   /* Premium skyline silhouettes: rooftop mechanical screens, antenna masts and a thin crown line. */
   mbox('lit',o.cx-o.hw*.42,o.h+.72,o.cz+o.hd*.34,o.hw*.28,1.35,o.hd*.22,0x303746);
   mbox('lit',o.cx+o.hw*.38,o.h+.48,o.cz-o.hd*.3,o.hw*.22,.9,o.hd*.28,0x414653);
   mbox('emi',o.cx,o.h+.68,o.cz-o.hd*.48,o.hw*1.35,.09,.09,hsl(o.hue,75,67));
   if(o.h>45){mbox('emi',o.cx,o.h+4,o.cz,.35,3.6,.35,0xff3a3a);mbox('lit',o.cx,o.h+2.1,o.cz,.9,.12,.9,0x6a7182);mbox('emi',o.cx,o.h+5.9,o.cz,.16,.16,.16,0xffd58b)}}});
 /* v83: PBR architectural finish — textured stone plinths, metal reveals and varied balcony rhythms. */
 MP.fillers.forEach((o,idx)=>{const w=o.hw*2,h=o.h,front=o.cz+o.hd+.17,style=idx%5;const stone=[0x77736b,0x8a8174,0x666b70,0x9a8d79,0x6f7779][style];
  mbox('pbrStone',o.cx,.34,front,w+.18,.68,.34,stone);mbox('pbrMetal',o.cx,.78,front+.19,w*.82,.055,.055,[0xb49a70,0x8798a2,0x9b9b9b,0xc0a36e,0x778c9c][style]);
  const bays=Math.max(2,Math.min(7,Math.floor(w/5.2)));for(let j=1;j<bays;j++){const x=o.cx-w*.43+j*(w*.86/bays);mbox('pbrMetal',x,Math.min(h*.54,18),front+.22,.055,Math.min(h*.9,30),.07,0x87939a)}
  if(h>14&&(style===1||style===4)){const y=Math.min(7.2,h*.38);for(let j=0;j<Math.min(3,Math.floor(w/8));j++){const x=o.cx-w*.28+j*w*.28;mbox('pbrMetal',x,y,front+.62,Math.min(4,w*.22),.065,.82,0xb8a27b);for(let k=-2;k<=2;k++)mbox('pbrMetal',x+k*.42,y+.48,front+.98,.035,.9,.035,0xaeb8bd)}}
  if(h>22&&style===2)mbox('pbrGlass',o.cx,Math.min(h*.64,24),front+.12,w*.72,Math.min(5,h*.22),.055,0x9fc4d0);
 });
 /* v81: Distinct neighborhood architecture — a restrained podium, framed entrances, facade fins and roof crowns.
    District character is derived from each block's position; all detail stays in the batched mesh buckets. */
 const districtStyle=(o)=>{const d=Math.hypot(o.cx,o.cz),q=o.cx<0?(o.cz<0?'heritage':'garden'):(o.cz<0?'financial':'residential');
  if(d<92)return 'financial';if(d>190&&o.cx>0)return 'innovation';if(q==='heritage')return 'heritage';if(q==='garden')return 'garden';if(q==='residential')return 'residential';return 'innovation'};
 MP.fillers.forEach((o,idx)=>{const style=districtStyle(o),w=o.hw*2,d=o.hd*2,h=o.h;
  const metal=style==='heritage'?0xb99a70:style==='garden'?0x78927c:style==='residential'?0xb8a58b:style==='innovation'?0x77aeb8:0xc5a66b;
  const stone=style==='heritage'?0x625044:style==='garden'?0x40594b:style==='residential'?0x5b5147:style==='innovation'?0x344d58:0x343c4b;
  const glass=style==='heritage'?0x9a8066:style==='garden'?0x789b8b:style==='residential'?0x9b8a72:style==='innovation'?0x4c8792:0x7798ad;
  /* Raised street-level podium and a clearly readable entry bay on the front elevation. */
  mbox('lit',o.cx,.42,o.cz+o.hd+.12,w+.34,.84,.34,stone);
  mbox('lit',o.cx,Math.min(3.2,h*.22),o.cz+o.hd+.34,Math.min(5.4,w*.42),Math.min(4.8,h*.34),.12,glass);
  mbox('emi',o.cx,Math.min(3.25,h*.22),o.cz+o.hd+.43,Math.min(5.05,w*.39),.075,.035,metal);
  mbox('lit',o.cx,Math.min(5.15,h*.34),o.cz+o.hd+.72,Math.min(6.2,w*.52),.18,.95,metal);
  /* Vertical pilasters and a mid-height belt give each block a different silhouette. */
  [-1,1].forEach(side=>{mbox('lit',o.cx+side*(o.hw-.34),Math.min(h*.48,12),o.cz+o.hd+.08,.22,Math.min(h*.86,24),.2,metal);
   if(w>17)mbox('emi',o.cx+side*(o.hw-.72),Math.min(h*.48,12),o.cz+o.hd+.19,.055,Math.min(h*.72,20),.045,glass)});
  if(h>18){const beltY=Math.min(h*.58,24);mbox('lit',o.cx,beltY,o.cz+o.hd+.12,w+.18,.22,.22,metal);
   if(style==='financial'||style==='innovation'){for(let j=-1;j<=1;j++)mbox('emi',o.cx+j*w*.22,h+.42,o.cz,.12,.1,d*.42>0?0.12:.12,metal)}
   mbox('lit',o.cx,h+.55,o.cz,w*.34,.28,d*.34,stone);mbox('emi',o.cx,h+.72,o.cz,w*.27,.06,d*.27,metal);
  }else{mbox('lit',o.cx,h+.35,o.cz,w+.35,.28,d+.35,metal)}
  /* Small warm entrance lights are emissive meshes, not additional dynamic lights. */
  [-1,1].forEach(side=>mbox('emi',o.cx+side*Math.min(3.2,w*.28),1.95,o.cz+o.hd+.48,.12,.42,.06,style==='garden'?0xd4e3ad:0xffd58b));
 });
 /* v81 neighborhood gateways: low-profile illuminated district markers at the four urban approaches. */
 [[-210,-115,'OLD TOWN',0xc5a47b],[-210,115,'GARDEN QUARTER',0x8eaf8d],[210,-115,'FINANCIAL DISTRICT',0xd9b66b],[210,115,'RESIDENCE PARK',0x9ab8c7]].forEach(([x,z,label,color])=>{
  mbox('lit',x,.8,z,1.05,1.6,.72,0x252b35);mbox('emi',x,1.56,z+.38,.82,.075,.06,color);
  const sign=textTex(label,512,96,'800 34px Arial,sans-serif','#'+color.toString(16).padStart(6,'0'),'rgba(8,12,20,.92)');
  const board=mesh(new THREE.PlaneGeometry(5.4,1.02),Bm(0xffffff,{map:sign,transparent:true,depthWrite:false,side:THREE.DoubleSide}),x,2.65,z+.39);
  board.rotation.y=0;glowS(x,2.5,z+.2,color,2.4,.18);
 });
 /* v82: Living commercial streets — illuminated shopfronts, canopies, display glazing and pedestrian details. */
 let shopCount=0;
 MP.fillers.forEach((o,idx)=>{
  const style=districtStyle(o),w=o.hw*2,h=o.h;
  const commercial=(style==='financial'||style==='heritage'||style==='innovation')&&w>13&&idx%3===0;
  if(commercial&&shopCount<18){
   const x=o.cx,z=o.cz+o.hd+.58,sw=Math.min(w*.72,12.5),tone=[0xd9b66b,0x8fc6cf,0xc59a78,0x9dbb91][shopCount%4];
   /* A recessed glass shop bay, warm fascia and slim projecting canopy. */
   mbox('lit',x,1.65,z,sw,2.65,.16,0x18222c);
   mbox('glass',x,1.62,z+.105,sw*.88,2.15,.045,0x78a9b5);
   mbox('lit',x,3.18,z+.3,sw+.55,.42,.78,0x34313a);
   mbox('emi',x,3.2,z+.71,sw*.94,.11,.055,tone);
   mbox('lit',x,.32,z+.28,sw+.6,.18,1.05,0x62564a);
   [-1,1].forEach(side=>{mbox('lit',x+side*(sw*.43),1.55,z+.3,.12,2.65,.18,tone);mbox('emi',x+side*(sw*.43),2.95,z+.42,.08,.24,.06,0xffd58b)});
   if(shopCount%2===0){mbox('lit',x,3.55,z+.72,sw*.72,.16,.9,0x252a32);mbox('emi',x,3.58,z+1.18,sw*.62,.055,.045,tone)}
   if(shopCount<10){
    const label=['ATELIER','GOLD LINE','NOVA','ROYAL MARKET','MAISON','CITY EDITION','LUMIÈRE','THE GALLERY','URBAN LUXE','SQUARE'][shopCount];
    const tex=textTex(label,512,96,'800 38px Arial,sans-serif','#'+tone.toString(16).padStart(6,'0'),'rgba(8,12,20,.96)');
    const board=mesh(new THREE.PlaneGeometry(Math.min(8.5,sw*.78),1.05),Bm(0xffffff,{map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide}),x,4.25,z+.76);board.rotation.y=0;
   }
   /* Planter and paired warm bollards frame the shop without blocking its doorway. */
   [-1,1].forEach(side=>{const px=x+side*(sw*.56);mbox('lit',px,.22,z+.7,.72,.44,.72,0x35483c);mbox('lit',px,.55,z+.7,.52,.28,.52,0x47714f);mbox('emi',px,.9,z+.7,.12,.12,.12,0xffd58b)});
   shopCount++;
  }
  /* Residential streets receive low garden walls, mail pillars and warm porch markers. */
  if(style==='residential'&&idx%4===1&&w>12){
   const x=o.cx,z=o.cz+o.hd+1.05,wall=Math.min(w*.72,13);
   mbox('lit',x,.48,z,wall,.72,.28,0x514c43);
   [-1,1].forEach(side=>{mbox('lit',x+side*(wall*.52),.82,z,.46,1.2,.46,0x777064);mbox('emi',x+side*(wall*.52),1.48,z,.28,.12,.28,0xffd58b)});
   mbox('lit',x-wall*.28,.72,z+.2,.68,1.15,.58,0x303b43);mbox('emi',x-wall*.28,.98,z+.51,.42,.28,.06,0xd9b66b);
   for(let j=-2;j<=2;j++)mbox('lit',x+j*1.25,.82,z+.52,.62,.66,.48,j%2?0x2d6043:0x39744d);
  }
 });
 /* v82: Civic garden squares — framed paving, planted corners, benches and sculptural light markers in larger parks. */
 let civicCount=0;
 MP.parks.forEach((p,idx)=>{
  const pw=p.x1-p.x0,pd=p.z1-p.z0;if(p.obby||pw<24||pd<24||civicCount>=6)return;
  const x=p.x0+pw*.5,z=p.z0+pd*.5,span=Math.min(13,pw*.34,pd*.34),edge=0xd0b98e;
  /* Perimeter inlays keep the park's existing trees and paths clear. */
  mbox('lit',x,.045,z-span,span*2,.07,.12,edge);mbox('lit',x,.045,z+span,span*2,.07,.12,edge);
  mbox('lit',x-span,.045,z,.12,.07,span*2,edge);mbox('lit',x+span,.045,z,.12,.07,span*2,edge);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{
   const px=x+a*(span+2),pz=z+b*(span+2);mbox('lit',px,.22,pz,2.2,.42,2.2,0x35483c);
   mbox('lit',px,.62,pz,1.5,.42,1.5,0x47714f);mbox('emi',px,.92,pz,.16,.12,.16,0xffd58b);
  });
  [[-span*.6,0],[span*.6,0]].forEach(([dx,dz])=>{const bx=x+dx,bz=z+dz;mbox('lit',bx,.42,bz,2.5,.16,.68,0x594536);mbox('lit',bx,.76,bz-.25,2.5,.48,.12,0x352c27);mbox('lit',bx,.76,bz+.25,2.5,.48,.12,0x352c27)});
  mbox('lit',x,.72,z,1.25,1.35,1.25,0x514b43);mbox('emi',x,1.48,z,1.05,.12,1.05,0xd9b66b);glowS(x,1.65,z,0xffd58b,3.2,.3);
  civicCount++;
 });
 /* v82: Pedestrian rhythm along the central shopping corridors — paired low lamps and tactile paving at selected corners. */
 [[-180,-115],[-120,-115],[-60,-115],[60,-115],[120,-115],[180,-115],[-180,115],[-120,115],[60,115],[120,115],[180,115]].forEach(([x,z],i)=>{
  [-1,1].forEach(side=>{const px=x+side*8.4;mbox('lit',px,.55,z, .24,1.1,.24,0x44464b);mbox('emi',px,1.12,z,.34,.14,.34,i%3===0?0xd9b66b:0xffd58b)});
  for(let j=-2;j<=2;j++)mbox('lit',x+j*1.1,.065,z+6.8,.72,.035,.5,0xaaa18e);
 });
 /* المعالم */
 const NPCS=[];
 MP.buildings.forEach(b=>{const pal=PAL[b.id],acc=pal[0],fc=pal[1],fl=pal[2],{hw,hd,n,fh}=b,TT=DC.T,DWl=b.dw||DC.DW,DHl=DC.DH,gt2=Math.min(fh-.9,4.6),ry0=b.dir>0?0:Math.PI;
  const wp=(u,v,w,d,y0,y1,col,kind)=>{const p=b.W(u,v);mbox(kind||'lit',p[0],(y0+y1)/2,p[1],w,y1-y0,d,col)};
  wp(0,0,hw*2,hd*2,-.06,.02,fl);
  const run=(u,v,w,d,y0)=>{wp(u,v,w,d,y0,y0+.9,fc);wp(u,v,w,d,y0+.9,y0+gt2,0xaadfff,'glass');wp(u,v,w,d,y0+gt2,y0+fh,fc)};
  for(let k=0;k<n;k++){const y0=k*fh;run(0,-hd+TT/2,hw*2,TT,y0);run(-hw+TT/2,0,TT,hd*2,y0);run(hw-TT/2,0,TT,hd*2,y0);
   if(k==0){const fw=hw-DWl;[-1,1].forEach(s=>run(s*(DWl+fw/2),hd-TT/2,fw,TT,y0));wp(0,hd-TT/2,DWl*2,TT,DHl,fh,fc)}else run(0,hd-TT/2,hw*2,TT,y0);
   const np=Math.max(2,Math.round(hw*2/6));for(let i=0;i<=np;i++){const u=-hw+i*hw*2/np;wp(u,-hd+.25,.5,.5,y0,y0+fh,0x2a2f4a);wp(u,hd-.25,.5,.5,y0,y0+fh,0x2a2f4a)}
   const nq=Math.max(1,Math.round(hd*2/7));for(let i=1;i<nq;i++){const v=-hd+i*hd*2/nq;wp(-hw+.25,v,.5,.5,y0,y0+fh,0x2a2f4a);wp(hw-.25,v,.5,.5,y0,y0+fh,0x2a2f4a)}
   /* Premium architectural finish: fine champagne-gold mullions and floor reveal strips. */
   [-.76,.76].forEach(t=>wp(t*hw,hd+.035,.09,.075,y0+.85,y0+fh-.32,acc,'emi'));
   wp(0,hd+.045,hw*2-1.2,.075,y0+fh-.34,y0+fh-.25,acc,'emi');
   if(b.id==='bank'||b.id==='flats'||b.id==='palace'||b.id==='showroom'){
    [-.48,0,.48].forEach(t=>{if(k===0&&Math.abs(t)<.16)return;wp(t*hw,hd+.04,.045,.055,y0+1.05,y0+fh-.65,0xe4c77d,'emi')});
    wp(0,-hd-.045,hw*2-1.2,.07,y0+fh-.34,y0+fh-.25,acc,'emi')
   }
  }
  for(let k=1;k<=n;k++){const y=k*fh;b.slabs[k].forEach(r=>wp((r.u0+r.u1)/2,(r.v0+r.v1)/2,r.u1-r.u0,r.v1-r.v0,y-.3,y,k==n?pal[3]:fl));
   wp(0,hd+.04,hw*2+.3,.12,y-.28,y-.12,acc,'emi');wp(0,-hd-.04,hw*2+.3,.12,y-.28,y-.12,acc,'emi');wp(-hw-.04,0,.12,hd*2+.3,y-.28,y-.12,acc,'emi');wp(hw+.04,0,.12,hd*2+.3,y-.28,y-.12,acc,'emi')}
  wp(0,0,hw*2+.8,hd*2+.8,n*fh,n*fh+.35,pal[3]);[[0,hd+.4,hw*2+.8,.2],[0,-hd-.4,hw*2+.8,.2],[hw+.4,0,.2,hd*2+.8],[-hw-.4,0,.2,hd*2+.8]].forEach(a=>wp(a[0],a[1],a[2],a[3],n*fh+.3,n*fh+.9,fc));
  /* أضوية السقف الداخلية */
  for(let k=0;k<n;k++){const ceil=b.slabs[k+1],y=(k+1)*fh-.34;for(let u=-hw+3;u<hw-1;u+=6)for(let v=-hd+3;v<hd-1;v+=6){if(ceil.some(r=>u>r.u0+.8&&u<r.u1-.8&&v>r.v0+.8&&v<r.v1-.8))wp(u,v,1.8,.7,y-.04,y+.04,0xfff2d0,'emi')}}
  /* السلالم */
  b.stairs.forEach(s=>{const st=fh/s.sh;for(let j=1;j<=s.sh;j++){const p=b.W(s.uc,s.vS-(j-.5)*DC.SR);mbox('lit',p[0],s.k*fh+j*st/2,p[1],2.2,j*st,DC.SR,j%2?0xd6dcf0:0xc4cbe4)}
   [-1.1,1.1].forEach(du=>{const a=b.W(s.uc+du,s.vS),c=b.W(s.uc+du,s.vE);mbox('emi',(a[0]+c[0])/2,s.k*fh+fh*.5+1.05,(a[1]+c[1])/2,du?.06:.06,.06,Math.abs(s.vS-s.vE),acc)})});
  /* الأثاث */
  b.items.forEach(it=>{const kd=it.f.indexOf('g')>=0?'glass':(it.f.indexOf('e')>=0||it.f.indexOf('h')>=0)?'emi':'lit';mbox(kd,it.x,it.y+it.h/2,it.z,it.w,it.h,it.d,it.c)});
  b.signs.forEach(sg=>{const wpx=512,hpx=Math.max(64,Math.round(512*sg.h/sg.w)),fs=Math.min(Math.round(hpx*.55),Math.floor(900/Math.max(4,sg.text.length))),tx=textTex(sg.text,wpx,hpx,'800 '+fs+'px Cairo,Arial,sans-serif',sg.col);
   const o=mesh(new THREE.PlaneGeometry(sg.w,sg.h),Bm(0xffffff,{map:tx,transparent:true,depthWrite:false,side:THREE.DoubleSide}),sg.x,sg.y,sg.z);o.rotation.y=sg.ry});
  b.npcs.forEach((a,i)=>{const o=mkAv('npc_'+b.id+i,a.name,'');o.position.set(a.x,a.y,a.z);o.rotation.y=a.ry;NPCS.push(o)});
  /* الباب: إطار نيون + زجاج بيتفتح لما حد يقرّب */
  const d0=b.W(0,hd);const fr=(u,w,h,y)=>wp(u,hd+.03,w,.14,y,y+h,acc,'emi');fr(-DWl-.08,.16,DHl+.12,0);fr(DWl+.08,.16,DHl+.12,0);fr(0,DWl*2+.4,.16,DHl);
  const gm_=new THREE.MeshLambertMaterial({color:0x9fe8ff,transparent:true,opacity:.3,depthWrite:false,emissive:0x1a3a4a}),dp=[-1,1].map(s=>mesh(new THREE.BoxGeometry(DWl-.05,DHl-.08,.06),gm_,0,DHl/2,0));
  SLIDERS.push({b,x:d0[0],z:d0[1],o:0,upd:o=>{[-1,1].forEach((s,i)=>{const p=b.W(s*(DWl/2+o*(DWl-.1)),hd+.08);dp[i].position.x=p[0];dp[i].position.z=p[1]})}});SLIDERS[SLIDERS.length-1].upd(0);
  wp(0,hd+1.8,hw*2+8,5.2,-.02,.1,0x2c3358);wp(0,hd+1.8,DWl*2+1.2,5.2,.1,.14,acc,'emi');
  const rg=mesh(new THREE.RingGeometry(.9,1.25,28),Bm(new THREE.Color(acc),{transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false}),0,.2,0);{const p=b.W(0,hd+2.2);rg.position.set(p[0],.2,p[1])}rg.rotation.x=-Math.PI/2;pulse.push(rg);
  if(fh-DHl>=1.2){const tx=textTex(NAMES[b.id],512,Math.round(512*(fh-DHl-.3)/6),'800 54px Cairo,Arial,sans-serif','#'+acc.toString(16).padStart(6,'0')),p=b.W(0,hd+.1);const o=mesh(new THREE.PlaneGeometry(6,fh-DHl-.3),Bm(0xffffff,{map:tx,transparent:true,depthWrite:false}),p[0],DHl+(fh-DHl)/2,p[1]);o.rotation.y=ry0}
  /* أسانسير: شافت + كابينة متحركة + أبواب زجاج */
  if(b.lift){const L=b.lift,top=n*fh,cu=(L.u0-.3+L.u1)/2,wd=L.u1-L.u0+.3;
   wp(L.u0-.15,(L.v0+L.v1+.3)/2,.3,L.v1+.3-L.v0,0,top,0x2a2f4a);
   for(let f=0;f<n;f++)wp(cu,L.v1+.15,wd,.3,f*fh+2.7,(f+1)*fh,0x2a2f4a);
   const cab=new THREE.Group();cab.rotation.y=ry0;cab.position.set(L.x,0,L.z);sc.add(cab);const gl2=new THREE.MeshLambertMaterial({color:0x9fe8ff,transparent:true,opacity:.28,depthWrite:false,emissive:0x1a3a4a}),dk=Lm(0x2a2f4a);
   mesh(new THREE.BoxGeometry(2.5,.12,2.5),dk,0,-.06,0,cab);mesh(new THREE.BoxGeometry(2.5,.1,2.5),dk,0,2.75,0,cab);mesh(new THREE.BoxGeometry(1.6,.05,1.6),Bm(0xfff2d0),0,2.68,0,cab);
   [[-1.22,0,.06,2.4],[1.22,0,.06,2.4],[0,-1.22,2.4,.06]].forEach(a=>{const o=mesh(new THREE.BoxGeometry(a[2]==.06?.06:a[2],2.7,a[3]==.06?.06:a[3]),gl2,a[0],1.35,a[1],cab)});
   [[-1.22,-1.22],[1.22,-1.22],[-1.22,1.22],[1.22,1.22]].forEach(a=>mesh(new THREE.BoxGeometry(.1,2.75,.1),Bm(acc),a[0],1.35,a[1],cab));
   const ds=[];for(let f=0;f<n;f++){const mt=Bm(0xff5050),ind=mesh(new THREE.BoxGeometry(.9,.1,.06),mt,0,0,0),pa=[-1,1].map(()=>mesh(new THREE.BoxGeometry(wd/2-.04,2.62,.05),gl2,0,f*b.fh+1.35,0));const ip=b.W(cu,L.v1+.34);ind.position.set(ip[0],f*fh+2.85,ip[1]);ds.push({f,pa,mt,ind,o:0,on:false})}
   LIFTS.push({b,L,cab,cu,wd,ds})}
  /* ديكور السطح */
  const G=new THREE.Group();G.position.set(b.cx,n*fh+.9,b.cz);G.rotation.y=ry0;sc.add(G);const cy=(a,c,h,m,x,y,z,nn)=>mesh(new THREE.CylinderGeometry(a,c,h,nn||16),m,x,y,z,G);
  if(b.id=='cafe'){cy(2.4,1.8,3.2,Lm(0xf2f2f6),0,1.6,0);cy(2.5,2.5,.2,Lm(0x5a3418),0,3.2,0);mesh(new THREE.TorusGeometry(1.1,.28,8,16),Lm(0xf2f2f6),2.4,1.7,0,G);glowS(b.cx,n*fh+4,b.cz,0x3fe0ff,9,.35)}
  else if(b.id=='hall'){const c=mesh(new THREE.ConeGeometry(1,1,4,1,false,Math.PI/4),Lm(0x701e3a),0,1.9,0,G);c.scale.set(hw*1.414,3.8,hd*1.414);glowS(b.cx,n*fh+6,b.cz,0xff7ad9,12,.3)}
  else if(b.id=='flats'){cy(1.4,1.4,2.4,Lm(0x6a6a7a),hw*.45,1.2,-hd*.4,12);cy(.07,.07,5,Lm(0x999999),-hw*.4,2.5,-hd*.3,6);glowS(b.cx-b.dir*hw*.4,n*fh+4.2,b.cz-b.dir*hd*.3,0xff3a3a,1.8,.9)}
  else if(b.id=='shop'){mesh(new THREE.BoxGeometry(hw*1.4,3,.3),Lm(0x10201e),0,2.4,-hd*.4,G);const o=mesh(new THREE.PlaneGeometry(hw*1.3,2.6),Bm(0xffffff,{map:textTex('🛍️ عروض اليوم',512,130,'800 54px Cairo,Arial,sans-serif','#4aff9a'),transparent:true,depthWrite:false}),0,2.4,-hd*.4+.2,G)}
  else if(b.id=='arcade'){mesh(new THREE.TorusGeometry(3,.22,8,32),Bm(0x8a5cff),0,4,0,G);mesh(new THREE.PlaneGeometry(4.2,1.7),Bm(0xffffff,{map:textTex('🕹️ GAME',320,130,'800 70px Poppins,Arial,sans-serif','#ff7ad9'),transparent:true,depthWrite:false}),0,4,.05,G);glowS(b.cx,n*fh+5,b.cz,0x8a5cff,12,.4)}
  else if(b.id=='bank'){const dm=mesh(new THREE.SphereGeometry(4,22,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshLambertMaterial({color:0xd9a441,emissive:0x8a5a10,emissiveIntensity:.5}),0,0,0,G);cy(.3,.3,1.4,Bm(0xffd75a),0,4.6,0,8);
   for(let i=0;i<6;i++){const u=-hw+3+i*(hw*2-6)/5;if(Math.abs(u)<3.2)continue;const p=b.W(u,hd+1.4);mesh(new THREE.CylinderGeometry(.5,.5,n*fh,16),Lm(0xf0e8d0),p[0],n*fh/2,p[1])}
   wp(0,hd+1.4,hw*1.9,2.2,0,.3,0xcfc6a0);wp(0,hd+1.4,hw*1.8,1.8,.3,.55,0xe0d8b8);wp(0,hd+1.4,hw*1.9,2.2,n*fh,n*fh+.5,0xe8dfc0);glowS(b.cx,n*fh+5,b.cz,0xffd75a,12,.35)}
  else if(b.id=='kiosk'){const c=mesh(new THREE.ConeGeometry(2.6,1,12),Lm(0xffb02c),0,1.8,0,G);cy(.07,.07,1.8,Lm(0xcccccc),0,.9,0,6);for(let i=0;i<6;i++)mbox('lit',b.cx+(i-2.5)*.9,3.9,b.cz+b.dir*(hd+.6),.85,.12,1.4,i%2?0xffffff:0xd02a2a)}
  else if(b.id=='gym'){const m=Bm(0x5cff7a);cy(.2,.2,5,m,0,2.8,0,10).rotation.z=Math.PI/2;[-2.5,2.5].forEach(x=>cy(1.3,1.3,.6,m,x,2.8,0,18).rotation.z=Math.PI/2);glowS(b.cx,n*fh+4,b.cz,0x5cff7a,10,.35)}
  else if(b.id=='lab'){mesh(new THREE.SphereGeometry(2.4,16,10),Bm(0x7ff6ff,{transparent:true,opacity:.35}),0,2.4,0,G);const ds=mesh(new THREE.ConeGeometry(1.9,1,16),Lm(0xdde4f4),hw*.5,1.2,-hd*.3,G);ds.rotation.x=Math.PI;cy(.06,.06,3.2,Lm(0x888888),-hw*.5,1.6,-hd*.3,6);glowS(b.cx,n*fh+4,b.cz,0x7ff6ff,10,.3)}
  /* لافتة السطح الكبيرة */
  {const w=Math.min(hw*2-2,14),tx=textTex(NAMES[b.id],512,Math.round(512*2/w),'800 58px Cairo,Arial,sans-serif','#'+acc.toString(16).padStart(6,'0')),p=b.W(0,hd-.7);mesh(new THREE.PlaneGeometry(w,2),Bm(0xffffff,{map:tx,transparent:true,depthWrite:false}),p[0],n*fh+2.2,p[1]).rotation.y=ry0;wp(0,hd-.75,w,.12,n*fh+.3,n*fh+1.2,0x1a1f3a)}
 });
 MP.cars.forEach(cr=>{const o=mkCar(cr);sc.add(o);CARO[cr.id]=o;syncCar(cr)});
 /* أرض القصر وساحة الحوادث */
 {const E=MP.estate;E.items.forEach(it=>{const kd=it.f.indexOf('g')>=0?'glass':(it.f.indexOf('e')>=0||it.f.indexOf('h')>=0)?'emi':'lit';mbox(kd,it.x,it.y+it.h/2,it.z,it.w,it.h,it.d,it.c)});
  E.signs.forEach(sg=>{const wpx=512,hpx=Math.max(64,Math.round(512*sg.h/sg.w)),fs=Math.min(Math.round(hpx*.55),Math.floor(900/Math.max(4,sg.text.length))),tx=textTex(sg.text,wpx,hpx,'800 '+fs+'px Cairo,Arial,sans-serif',sg.col);
   const o=mesh(new THREE.PlaneGeometry(sg.w,sg.h),Bm(0xffffff,{map:tx,transparent:true,depthWrite:false,side:THREE.DoubleSide}),sg.x,sg.y,sg.z);o.rotation.y=sg.ry});
  E.npcs.forEach((a,i)=>{const o=mkAv('npc_est'+i,a.name,'');o.position.set(a.x,a.y,a.z);o.rotation.y=a.ry;NPCS.push(o)});
  const gm2=new THREE.MeshLambertMaterial({color:0x1a1d30,emissive:0xd9b66b,emissiveIntensity:.28}),gp=[-1,1].map(()=>mesh(new THREE.BoxGeometry(6.2,4.6,.3),gm2,0,2.3,270));
  SLIDERS.push({b:{fh:99},adm:1,x:0,z:270,o:0,upd:o=>{gp.forEach((m,i)=>{m.position.x=(i?1:-1)*(3.2+o*6)})}});SLIDERS[SLIDERS.length-1].upd(0)}
 /* Mountain horizon + luxury buyable homes: low draw-call primitive architecture for balanced performance. */
 {const mountainMat=[0x202c42,0x29384e,0x34465b].map(c=>new THREE.MeshLambertMaterial({color:c}));
  [[-240,-365,120,92],[ -125,-390,150,120],[20,-382,180,138],[175,-390,155,118],[285,-360,110,88]].forEach((a,i)=>{const m=mesh(new THREE.ConeGeometry(a[2],a[3],7),mountainMat[i%3],a[0],a[3]*.45-2,a[1]);m.rotation.y=i*.43;m.scale.z=1.65});
  ESTATE_CATALOG.forEach((a,i)=>{const G=new THREE.Group();G.position.set(a.x,0,a.z);sc.add(G);const s=a.size,base=new THREE.MeshLambertMaterial({color:a.color}),dark=new THREE.MeshLambertMaterial({color:0x182235}),glass=new THREE.MeshLambertMaterial({color:0x8ad9ef,transparent:true,opacity:.42,emissive:0x16354b});
   const add=(geo,mat,x,y,z)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);G.add(o);return o};
   add(new THREE.BoxGeometry(15*s,.35,13*s),dark,0,.18,0);/* Open-front palace shell: side/back walls frame a visible furnished interior instead of a solid placeholder block. */
   add(new THREE.BoxGeometry(.42*s,4.2*s,8*s),base,-5.29*s,2.3*s,0);add(new THREE.BoxGeometry(.42*s,4.2*s,8*s),base,5.29*s,2.3*s,0);add(new THREE.BoxGeometry(11*s,4.2*s,.42*s),base,0,2.3*s,-3.79*s);
   add(new THREE.BoxGeometry(2.15*s,4.2*s,.42*s),base,-4.42*s,2.3*s,3.79*s);add(new THREE.BoxGeometry(2.15*s,4.2*s,.42*s),base,4.42*s,2.3*s,3.79*s);add(new THREE.BoxGeometry(6.2*s,.62*s,.42*s),base,0,4.12*s,3.79*s);
   add(new THREE.BoxGeometry(10.5*s,.16*s,7.45*s),new THREE.MeshLambertMaterial({color:0x9b8e7c}),0,.16*s,0);
   /* Interior lounge: marble feature wall, sofa blocks, coffee table, rug, chandelier and warm fixtures. */
   const intDark=new THREE.MeshPhongMaterial({color:0x302b31,shininess:35}),ivorySeat=new THREE.MeshPhongMaterial({color:0xe0d5c4,shininess:25}),rugMat=new THREE.MeshLambertMaterial({color:0x6d4c3d}),lampMat=new THREE.MeshBasicMaterial({color:0xffd88b}),trim=new THREE.MeshLambertMaterial({color:0xb9a47b});
   add(new THREE.BoxGeometry(5.4*s,.045*s,3.2*s),rugMat,0,.27*s,-.05*s);
   add(new THREE.BoxGeometry(3.2*s,.42*s,.72*s),ivorySeat,0,.55*s,-1.45*s);add(new THREE.BoxGeometry(3.2*s,.85*s,.2*s),ivorySeat,0,.86*s,-1.78*s);
   [-1,1].forEach(side=>{add(new THREE.BoxGeometry(.22*s,.65*s,.8*s),ivorySeat,side*1.48*s,.68*s,-1.45*s);add(new THREE.BoxGeometry(1.05*s,.38*s,.62*s),ivorySeat,side*2.35*s,.52*s,-.2*s);add(new THREE.BoxGeometry(.12*s,.72*s,.7*s),ivorySeat,side*2.82*s,.76*s,-.2*s)});
   add(new THREE.BoxGeometry(1.9*s,.12*s,1.0*s),trim,0,.48*s,.15*s);add(new THREE.BoxGeometry(1.65*s,.08*s,.78*s),intDark,0,.57*s,.15*s);
   add(new THREE.BoxGeometry(2.8*s,1.65*s,.12*s),intDark,0,2.25*s,-3.52*s);add(new THREE.BoxGeometry(2.55*s,1.4*s,.035*s),glass,0,2.25*s,-3.43*s);
   add(new THREE.CylinderGeometry(.08*s,.12*s,.22*s,8),trim,0,3.7*s,0);add(new THREE.SphereGeometry(.28*s,10,8),lampMat,0,3.55*s,0);
   [-1,1].forEach(side=>{add(new THREE.BoxGeometry(.12*s,.5*s,.12*s),trim,side*3.25*s,3.75*s,2.9*s);add(new THREE.SphereGeometry(.12*s,8,6),lampMat,side*3.25*s,3.45*s,2.9*s)});
   add(new THREE.BoxGeometry(11.5*s,.3,8.5*s),dark,0,4.55*s,0);add(new THREE.BoxGeometry(8.5*s,2.2*s,.12),glass,0,2.8*s,4.06*s);add(new THREE.BoxGeometry(.25*s,2.5*s,.2),new THREE.MeshLambertMaterial({color:0xd9a441}),0,2.6*s,4.15*s);add(new THREE.BoxGeometry(4*s,.25,2.6*s),dark,0,1.05*s,6*s);add(new THREE.BoxGeometry(1.3*s,1.2*s,.2),glass,-2.8*s,2.7*s,4.15*s);add(new THREE.BoxGeometry(1.3*s,1.2*s,.2),glass,2.8*s,2.7*s,4.15*s);
   for(let j=0;j<4;j++){const lamp=new THREE.Mesh(new THREE.SphereGeometry(.12*s,8,6),new THREE.MeshBasicMaterial({color:0xffd98a}));lamp.position.set((j-1.5)*2*s,.55*s,6.25*s);G.add(lamp)}
   /* Expanded palace interior: marble reception desk, console, bookcases and staircase. */
   const marble=new THREE.MeshPhongMaterial({color:0xd8d0c3,shininess:95}),wood=new THREE.MeshLambertMaterial({color:0x493126}),goldGlow=new THREE.MeshBasicMaterial({color:0xffd58a});
   add(new THREE.BoxGeometry(2.9*s,.9*s,.62*s),wood,-3.35*s,.72*s,2.25*s);add(new THREE.BoxGeometry(3.05*s,.1*s,.7*s),trim,-3.35*s,1.2*s,2.25*s);add(new THREE.BoxGeometry(2.55*s,.05*s,.46*s),marble,-3.35*s,1.27*s,2.25*s);
   /* Decorative bookcase and evenly spaced shelves on the rear wall. */
   add(new THREE.BoxGeometry(2.4*s,2.25*s,.22*s),wood,3.45*s,1.45*s,-3.42*s);
   for(let sh=0;sh<4;sh++){add(new THREE.BoxGeometry(2.25*s,.075*s,.26*s),trim,3.45*s,.55*s+sh*.52*s,-3.26*s);for(let bk=0;bk<6;bk++)add(new THREE.BoxGeometry(.22*s,.28*s,.12*s),new THREE.MeshLambertMaterial({color:[0x6b3432,0x27465b,0x94743b][(bk+sh)%3]}),(2.5+bk*.36)*s,.73*s+sh*.52*s,-3.28*s)}
   /* Open stair run with individual treads and a gold handrail. */
   for(let st=0;st<7;st++)add(new THREE.BoxGeometry(1.35*s,.12*s,.42*s),marble,4.0*s,(st+.5)*.22*s,1.0*s+st*.48*s);
   add(new THREE.BoxGeometry(.08*s,1.65*s,.08*s),trim,4.72*s,.95*s,2.45*s);
   /* Upstairs bedroom vignette: bed frame, mattress, pillows, nightstands and wall art. */
   if(i===2||i===3){
    add(new THREE.BoxGeometry(3.6*s,.3*s,3.8*s),wood,-2.5*s,.48*s,-.35*s);add(new THREE.BoxGeometry(3.45*s,.24*s,3.55*s),ivorySeat,-2.5*s,.72*s,-.35*s);
    add(new THREE.BoxGeometry(3.7*s,.95*s,.22*s),wood,-2.5*s,1.05*s,-2.22*s);
    [-1,1].forEach(side=>{add(new THREE.BoxGeometry(1.05*s,.22*s,.75*s),ivorySeat,-2.5*s+side*.78*s,.92*s,-1.65*s);add(new THREE.BoxGeometry(.65*s,.48*s,.55*s),wood,-4.8*s+side*.0,.62*s,-.25*s);add(new THREE.BoxGeometry(.55*s,.06*s,.45*s),trim,-4.8*s,.9*s,-.25*s)});
    add(new THREE.BoxGeometry(1.5*s,1.1*s,.1*s),trim,1.9*s,2.35*s,-3.48*s);add(new THREE.BoxGeometry(1.32*s,.92*s,.04*s),glass,1.9*s,2.35*s,-3.4*s);
   }
   if(i===2||i===3){add(new THREE.BoxGeometry(3*s,2.5*s,2.6*s),base,0,5.6*s,-1*s);add(new THREE.BoxGeometry(3.2*s,.25,2.8*s),dark,0,6.9*s,-1*s)}
   /* Estate arrival sequence: low-cost driveway, perimeter rails, gate pillars and stylized guards. */
   const gold=new THREE.MeshLambertMaterial({color:0xd9b66b}),stone=new THREE.MeshLambertMaterial({color:0x59647a}),pathMat=new THREE.MeshLambertMaterial({color:0x30394a}),skin=new THREE.MeshLambertMaterial({color:0xb7a18c}),uniform=new THREE.MeshLambertMaterial({color:0x111827});
   add(new THREE.BoxGeometry(4.8*s,.09,9*s),pathMat,0,.08,10.4*s);
   /* Side fences intentionally leave the front gate and central driveway open. */
   [-1,1].forEach(side=>{add(new THREE.BoxGeometry(.18*s,.75*s,9*s),stone,side*7.2*s,.48*s,1.6*s);for(let k=0;k<7;k++)add(new THREE.BoxGeometry(.1*s,.95*s,.1*s),gold,side*7.2*s,.48*s,(k-3)*1.35*s+1.6*s)});
   [-1,1].forEach(side=>{add(new THREE.BoxGeometry(.55*s,2.2*s,.55*s),stone,side*3.15*s,1.1*s,7.5*s);add(new THREE.BoxGeometry(.62*s,.16*s,.62*s),gold,side*3.15*s,2.25*s,7.5*s)});
   add(new THREE.BoxGeometry(5.7*s,.13*s,.2*s),gold,0,1.05*s,7.5*s);
   [-1,1].forEach(side=>{const gx=side*2.45*s;add(new THREE.CylinderGeometry(.22*s,.27*s,1.05*s,7),uniform,gx,.65*s,6.65*s);add(new THREE.SphereGeometry(.25*s,8,6),skin,gx,1.35*s,6.65*s);add(new THREE.BoxGeometry(.65*s,.16*s,.3*s),gold,gx,1.0*s,6.65*s)});
   /* Palace-grade facade: columns, cornice bands, upper balcony, roof pavilion and garden pool. */
   const ivory=new THREE.MeshLambertMaterial({color:0xe3d8c3}),roof=new THREE.MeshLambertMaterial({color:0x202638}),water=new THREE.MeshPhongMaterial({color:0x43c9ef,transparent:true,opacity:.72,shininess:110,emissive:0x07384a});
   /* Main entrance portico with visible column bases/capitals and a triangular pediment. */
   [-1,1].forEach(side=>{const px=side*2.25*s;add(new THREE.BoxGeometry(.82*s,.22*s,.82*s),trim,px,.22*s,4.28*s);add(new THREE.CylinderGeometry(.24*s,.3*s,2.5*s,10),ivory,px,1.58*s,4.28*s);add(new THREE.CylinderGeometry(.34*s,.34*s,.18*s,10),trim,px,2.88*s,4.28*s);add(new THREE.BoxGeometry(.95*s,.18*s,.95*s),ivory,px,3.0*s,4.28*s)});
   add(new THREE.BoxGeometry(6.5*s,.28*s,.55*s),trim,0,3.18*s,4.24*s);
   add(new THREE.CylinderGeometry(0,3.5*s,1.15*s,3),ivory,0,3.85*s,4.1*s).rotation.z=Math.PI;
   /* Layered roofline, corner pilasters and raised central pavilion. */
   add(new THREE.BoxGeometry(11.9*s,.18*s,8.9*s),trim,0,4.72*s,0);
   [-1,1].forEach(side=>{add(new THREE.BoxGeometry(.28*s,3.8*s,.3*s),ivory,side*5.2*s,2.35*s,3.9*s);add(new THREE.BoxGeometry(.46*s,.16*s,.4*s),trim,side*5.2*s,4.25*s,3.9*s)});
   add(new THREE.BoxGeometry(4.1*s,1.55*s,3.6*s),base,0,5.35*s,-.55*s);add(new THREE.BoxGeometry(4.35*s,.2*s,3.85*s),trim,0,6.18*s,-.55*s);add(new THREE.ConeGeometry(2.55*s,1.65*s,4),roof,0,7.05*s,-.55*s).rotation.y=Math.PI/4;
   /* Balcony balustrade along the front, separated into short stone rails. */
   add(new THREE.BoxGeometry(7.7*s,.12*s,.22*s),trim,0,4.25*s,4.32*s);
   for(let k=0;k<13;k++){const bx=(k-6)*.59*s;add(new THREE.BoxGeometry(.09*s,.42*s,.09*s),ivory,bx,4.02*s,4.32*s)}
   /* A side garage wing and marked parking bays make the estate usable, not just decorative. */
   add(new THREE.BoxGeometry(4.1*s,2.65*s,4.2*s),base,7.35*s,1.45*s,-1.0*s);add(new THREE.BoxGeometry(3.35*s,1.9*s,.14*s),dark,7.35*s,1.12*s,1.13*s);add(new THREE.BoxGeometry(3.5*s,.16*s,.22*s),trim,7.35*s,2.12*s,1.16*s);
   for(let k=0;k<3;k++)add(new THREE.BoxGeometry(.035*s,.035*s,3.6*s),trim,(k-1)*1.45*s,.145*s,11.7*s);
   /* Reflecting pool and clipped garden beds on the right side of the approach. */
   add(new THREE.BoxGeometry(3.5*s,.18*s,5.1*s),ivory,8.0*s,.13*s,7.0*s);add(new THREE.BoxGeometry(3.12*s,.035*s,4.7*s),water,8.0*s,.235*s,7.0*s);
   [-1,1].forEach(side=>{add(new THREE.BoxGeometry(1.15*s,.22*s,3.6*s),new THREE.MeshLambertMaterial({color:0x244b39}),side*8.3*s,.18*s,10.7*s);for(let j=0;j<3;j++)add(new THREE.SphereGeometry(.32*s,7,5),new THREE.MeshLambertMaterial({color:j%2?0x397a50:0x285d42}),side*8.3*s,.42*s,9.5*s+j*1.15*s)});
   /* v44 architectural pass: framed windows, wall sconces, balcony rails and entry planters. */
   const windowFrame=new THREE.MeshPhongMaterial({color:0xc8b88f,shininess:75}),windowGlow=new THREE.MeshBasicMaterial({color:0xffd99a}),windowDark=new THREE.MeshPhysicalMaterial({color:0x27475a,metalness:.12,roughness:.1,transparent:true,opacity:.32,depthWrite:false,clearcoat:1,clearcoatRoughness:.06,reflectivity:.8});
   [-1,1].forEach(side=>{
    /* Tall side windows with layered frames read clearly from the street. */
    for(let wi=0;wi<2;wi++){
     const wx=side*5.31*s, wz=(-1.9+wi*3.25)*s;
     add(new THREE.BoxGeometry(.06*s,1.65*s,1.12*s),windowFrame,wx,2.55*s,wz);
     add(new THREE.BoxGeometry(.075*s,1.42*s,.88*s),windowDark,wx+side*.045*s,2.55*s,wz);
     add(new THREE.BoxGeometry(.09*s,1.5*s,.045*s),trim,wx+side*.09*s,2.55*s,wz);
     add(new THREE.BoxGeometry(.09*s,.045*s,.9*s),trim,wx+side*.09*s,2.55*s,wz);
     /* Cross-mullions and sill give the windows a more crafted palace facade. */
     add(new THREE.BoxGeometry(.09*s,.055*s,.9*s),trim,wx+side*.095*s,2.55*s,wz);
     add(new THREE.BoxGeometry(.1*s,.08*s,1.22*s),ivory,wx+side*.1*s,1.72*s,wz);
     add(new THREE.BoxGeometry(.1*s,.055*s,.9*s),trim,wx+side*.1*s,2.08*s,wz);
    }
    /* Warm wall lanterns flanking the front portico. */
    const lx=side*4.0*s;
    add(new THREE.BoxGeometry(.22*s,.42*s,.16*s),trim,lx,2.35*s,4.12*s);
    add(new THREE.BoxGeometry(.13*s,.27*s,.1*s),windowGlow,lx,2.35*s,4.22*s);
    add(new THREE.BoxGeometry(.42*s,.09*s,.26*s),trim,lx,2.61*s,4.12*s);
    /* Decorative balcony balusters continue beyond the center span. */
    add(new THREE.BoxGeometry(2.0*s,.12*s,.2*s),trim,side*4.9*s,4.25*s,4.3*s);
    for(let k=0;k<4;k++)add(new THREE.BoxGeometry(.07*s,.38*s,.07*s),ivory,side*(4.15+k*.48)*s,4.03*s,4.3*s);
   });
   /* Front steps and paired planters make the arrival route feel intentional. */
   for(let st=0;st<3;st++)add(new THREE.BoxGeometry((5.6-st*.55)*s,.13*s,.38*s),ivory,0,.12*s+st*.12*s,4.85*s+st*.36*s);
   [-1,1].forEach(side=>{
    add(new THREE.BoxGeometry(.72*s,.48*s,.72*s),trim,side*4.0*s,.32*s,5.55*s);
    add(new THREE.CylinderGeometry(.25*s,.32*s,.55*s,8),stone,side*4.0*s,.78*s,5.55*s);
    add(new THREE.SphereGeometry(.43*s,8,6),new THREE.MeshLambertMaterial({color:0x2f7549}),side*4.0*s,1.18*s,5.55*s);
   });
   /* Warm path lights, kept deliberately low-poly for balanced performance. */
   [-1,1].forEach(side=>{for(let k=0;k<3;k++){const lx=side*5.5*s,lz=(k-1)*3.2*s+9*s;add(new THREE.CylinderGeometry(.07*s,.1*s,.8*s,6),stone,lx,.4*s,lz);add(new THREE.SphereGeometry(.14*s,8,6),new THREE.MeshBasicMaterial({color:0xffdf9b}),lx,.86*s,lz)}});
   /* v59 precision architecture pass: front glazing, champagne frames, roof seams, stone joints and a measured arrival court. */
   const v59Glass=new THREE.MeshPhysicalMaterial({color:0x294b60,metalness:.12,roughness:.09,transparent:true,opacity:.34,depthWrite:false,clearcoat:1,clearcoatRoughness:.05,reflectivity:.9,emissive:0x02070b});
   const v59Alu=new THREE.MeshStandardMaterial({color:0xb7a16e,metalness:.82,roughness:.24});
   const v59Stone=new THREE.MeshStandardMaterial({color:0xd5c8b0,metalness:.05,roughness:.78});
   /* Recessed front windows are layered, not painted-on rectangles. */
   [-1,1].forEach(side=>{
    for(let row=0;row<2;row++){
     const wy=(row?3.15:1.95)*s, wz=4.02*s;
     add(new THREE.BoxGeometry(1.22*s,1.02*s,.075*s),v59Stone,side*3.72*s,wy,wz);
     add(new THREE.BoxGeometry(1.04*s,.84*s,.055*s),v59Glass,side*3.72*s,wy,wz+.055*s);
     add(new THREE.BoxGeometry(.045*s,.88*s,.06*s),v59Alu,side*3.72*s,wy,wz+.09*s);
     add(new THREE.BoxGeometry(1.08*s,.045*s,.06*s),v59Alu,side*3.72*s,wy,wz+.09*s);
     add(new THREE.BoxGeometry(1.08*s,.045*s,.06*s),v59Alu,side*3.72*s,wy,wz+.09*s);
    }
   });
   /* Fine standing-seam roof: narrow raised ribs and a crisp fascia catch highlights at oblique angles. */
   for(let rib=-5;rib<=5;rib++){
    add(new THREE.BoxGeometry(.035*s,.045*s,7.9*s),v59Alu,rib*1.02*s,4.91*s,0);
   }
   add(new THREE.BoxGeometry(12.05*s,.11*s,.16*s),v59Alu,0,4.83*s,4.38*s);
   add(new THREE.BoxGeometry(12.05*s,.11*s,.16*s),v59Alu,0,4.83*s,-4.38*s);
   /* Stone courses and recessed shadow lines give the facade scale and depth. */
   for(let course=0;course<5;course++){
    const yy=(.72+course*.72)*s;
    add(new THREE.BoxGeometry(10.6*s,.025*s,.055*s),v59Stone,0,yy,4.015*s);
   }
   /* Entry paving is individually jointed; markings align to the driveway axis. */
   const paving=new THREE.MeshStandardMaterial({color:0x535a64,roughness:.88});
   for(let row=0;row<7;row++){
    const zz=(7.1+row*1.18)*s;
    add(new THREE.BoxGeometry(5.0*s,.025, .025),v59Alu,0,.145,zz);
    for(let col=-2;col<=2;col++) add(new THREE.BoxGeometry(.022,.026,1.12*s),v59Stone,col*.98*s,.15,zz+.55*s);
   }
   /* Two low landscape beds with layered foliage and discreet path markers. */
   [-1,1].forEach(side=>{
    add(new THREE.BoxGeometry(1.15*s,.22,5.9*s),paving,side*8.9*s,.12,8.8*s);
    for(let plant=0;plant<5;plant++){
     const px=side*8.9*s, pz=(6.6+plant*1.1)*s;
     add(new THREE.SphereGeometry(.34*s,7,5),new THREE.MeshLambertMaterial({color:plant%2?0x376f4b:0x28563d}),px,.42*s,pz);
     add(new THREE.SphereGeometry(.2*s,6,4),new THREE.MeshLambertMaterial({color:0x4e8c5b}),px+.12*s,.63*s,pz+.08*s);
    }
   });
  });
 }
 /* Autonomous city engineering crews: patrol active work zones and make the city feel continuously maintained. */
 {const skin= Lm(0xc99b79),uniform=Lm(0x24344a),vest=new THREE.MeshBasicMaterial({color:0xb9ff28}),helmet=new THREE.MeshPhongMaterial({color:0xffc928,shininess:90}),boot=Lm(0x111622),tool=Lm(0x8ba4bd);
  const sites=[[-38,-30],[34,-28],[-45,38],[42,34],[4,-54],[58,4]];
  sites.forEach(([cx,cz],i)=>{const g=new THREE.Group();const part=(geo,mat,x,y,z)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);g.add(o);return o};
   part(new THREE.CylinderGeometry(.18,.22,.62,7),uniform,0,.78,0);part(new THREE.SphereGeometry(.17,8,6),skin,0,1.2,0);part(new THREE.BoxGeometry(.4,.27,.25),vest,0,.83,0);part(new THREE.SphereGeometry(.19,8,6),helmet,0,1.37,0);part(new THREE.BoxGeometry(.08,.4,.08),boot,-.11,.25,0);part(new THREE.BoxGeometry(.08,.4,.08),boot,.11,.25,0);part(new THREE.BoxGeometry(.06,.48,.06),tool,.28,.75,.04);
   g.position.set(cx,0,cz);g.userData.engineer={cx,cz,phase:i*1.13,rx:2.5+(i%3),rz:1.8+(i%2),speed:.00012+(i%3)*.000025};sc.add(g);AUTO_ENGINEERS.push(g);
   const marker=new THREE.Mesh(new THREE.TorusGeometry(1.15,.035,5,20),new THREE.MeshBasicMaterial({color:0x39e8ff,transparent:true,opacity:.72}));marker.rotation.x=Math.PI/2;marker.position.set(cx,.045,cz);sc.add(marker);
  });
 }
 flush();
 /* أشجار وأعمدة إنارة (Instanced) */
 {const N=MP.trees.length,tg=new THREE.CylinderGeometry(.2,.28,1.4,6),c1=new THREE.ConeGeometry(1.25,2.4,7),c2=new THREE.ConeGeometry(.95,2,7),mt=new THREE.MeshLambertMaterial({color:0x3a2418}),ml=new THREE.MeshLambertMaterial({color:0xffffff}),I1=new THREE.InstancedMesh(tg,mt,N),I2=new THREE.InstancedMesh(c1,ml,N),I3=new THREE.InstancedMesh(c2,ml,N),m4=new THREE.Matrix4(),col=[0x1f7a5a,0x2a8a4a,0x4a3aa0].map(c=>new THREE.Color(c));
  MP.trees.forEach((t,i)=>{[[I1,.7],[I2,2.2],[I3,3.5]].forEach(([I,y])=>{m4.makeScale(t.s,t.s,t.s);m4.setPosition(t.x,y*t.s,t.z);I.setMatrixAt(i,m4)});I2.setColorAt(i,col[i%3]);I3.setColorAt(i,col[i%3])});[I1,I2,I3].forEach(I=>{I.frustumCulled=false;sc.add(I)});
  const M=MP.lamps.length,pg=new THREE.CylinderGeometry(.07,.1,4.2,6),hg=new THREE.SphereGeometry(.3,10,8),cg=new THREE.CylinderGeometry(.15,.15,.12,8),P1=new THREE.InstancedMesh(pg,Lm(0x4d4b50),M),P2=new THREE.InstancedMesh(hg,Bm(0xffe9a8),M),P3=new THREE.InstancedMesh(cg,Lm(0xc6a15b),M);
  MP.lamps.forEach((l,i)=>{m4.makeTranslation(l.x,2.1,l.z);P1.setMatrixAt(i,m4);m4.makeTranslation(l.x,4.3,l.z);P2.setMatrixAt(i,m4);m4.makeTranslation(l.x,.55,l.z);P3.setMatrixAt(i,m4)});[P1,P2,P3].forEach(I=>{I.frustumCulled=false;sc.add(I)})}
 /* النافورة */
 {const F=MP.fountain;bx(F.hw*2,F.top,F.hd*2,Lm(0x6a7090),F.cx,F.top/2,F.cz);bx(F.hw*2-1,.05,F.hd*2-1,Bm(0x3fb8ff),F.cx,F.top+.02,F.cz);
  const rim=mesh(new THREE.TorusGeometry(F.hw-.48,.09,8,48),Lm(0xd9b66b),F.cx,F.top+.08,F.cz);rim.rotation.x=Math.PI/2;
  const innerRim=mesh(new THREE.TorusGeometry(Math.max(1,F.hw-1.05),.035,6,48),Bm(0x9fe8ff),F.cx,F.top+.1,F.cz);innerRim.rotation.x=Math.PI/2;
  mesh(new THREE.CylinderGeometry(.35,.5,1.9,12),Lm(0x8a90b0),F.cx,F.top+.9,F.cz);fountainTop=mesh(new THREE.SphereGeometry(.42,16,12),new THREE.MeshPhysicalMaterial({color:0xbcefff,metalness:.08,roughness:.07,clearcoat:1,transparent:true,opacity:.62,emissive:0x062a38}),F.cx,F.top+2.1,F.cz);glowS(F.cx,F.top+2,F.cz,0x7ff6ff,5,.22);
  /* Animated fountain basin: a gently rippling physical water sheet, arcing jets, falling droplets and impact rings. */
  const basinWaterMat=new THREE.MeshPhysicalMaterial({color:0x4e9eaa,metalness:.18,roughness:.105,clearcoat:1,clearcoatRoughness:.035,transparent:true,opacity:.84,side:THREE.DoubleSide,envMap:CITY_ENV_CUBE,envMapIntensity:.48});
  fountainWaterSurface=mesh(new THREE.CircleGeometry(Math.max(1,F.hw-.72),MOB?24:48),basinWaterMat,F.cx,F.top+.105,F.cz);fountainWaterSurface.rotation.x=-Math.PI/2;fountainWaterSurface.userData.baseY=F.top+.105;
  const jetMat=new THREE.MeshPhysicalMaterial({color:0xb9efff,metalness:.02,roughness:.08,clearcoat:1,transparent:true,opacity:.5,depthWrite:false,emissive:0x092b3b,side:THREE.DoubleSide});
  const dropGeo=new THREE.SphereGeometry(.042,7,6),dropMat=new THREE.MeshBasicMaterial({color:0xd7f5ff,transparent:true,opacity:.82,depthWrite:false});
  for(let j=0;j<(MOB?5:8);j++){const a=j*(Math.PI*2/(MOB?5:8)),curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(F.cx,F.top+2.18,F.cz),new THREE.Vector3(F.cx+Math.cos(a)*1.2,F.top+2.65,F.cz+Math.sin(a)*1.2),new THREE.Vector3(F.cx+Math.cos(a)*2.05,F.top+.14,F.cz+Math.sin(a)*2.05));sc.add(new THREE.Mesh(new THREE.TubeGeometry(curve,14,.026,5,false),jetMat));
   for(let k=0;k<(MOB?3:6);k++){const drop=new THREE.Mesh(dropGeo,dropMat);sc.add(drop);FOUNTAIN_DROPS.push({mesh:drop,angle:a,phase:k/(MOB?3:6)+j*.037,range:1.95,height:.62+((j+k)%3)*.12})}}
  const rippleMat=new THREE.MeshBasicMaterial({color:0xb6edff,transparent:true,opacity:.34,depthWrite:false,side:THREE.DoubleSide});
  for(let i=0;i<(MOB?4:8);i++){const ring=mesh(new THREE.TorusGeometry(.12,.012,4,20),rippleMat.clone(),F.cx,F.top+.13,F.cz);ring.rotation.x=Math.PI/2;FOUNTAIN_RIPPLES.push({mesh:ring,phase:i/(MOB?4:8),angle:i*(Math.PI*2/(MOB?4:8))})}
  /* Low-count champagne bollards finish the central pedestrian plaza. */
  [[F.cx-F.hw-1,F.cz-F.hd-1],[F.cx+F.hw+1,F.cz-F.hd-1],[F.cx-F.hw-1,F.cz+F.hd+1],[F.cx+F.hw+1,F.cz+F.hd+1]].forEach(([x,z])=>{mesh(new THREE.CylinderGeometry(.16,.2,.85,8),Lm(0x30394b),x,.425,z);mesh(new THREE.CylinderGeometry(.17,.17,.08,8),Lm(0xd9b66b),x,.72,z);mesh(new THREE.SphereGeometry(.12,8,6),Bm(0xffe9a8),x,.91,z)})}
 /* الأوبي */
 MP.plats.forEach((p,i)=>{bx(p.hw*2,p.top,p.hd*2,Lm(new THREE.Color('hsl('+(i*30)+',65%,45%)')),p.x,p.top/2,p.z);bx(p.hw*2-.2,.07,p.hd*2-.2,Bm(new THREE.Color('hsl('+(i*30)+',90%,65%)')),p.x,p.top+.04,p.z)});
 {const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:textTex('🧗 أوبي — اطلع لآخر منصة 🪙',640,128,'800 46px Cairo,Arial,sans-serif','#ff7ad9'),transparent:true,depthWrite:false}));sp.scale.set(9,1.8,1);sp.position.set(MP.plats[0].x+4,5,MP.plats[0].z-4);sc.add(sp)}
 /* العملات */
 {const cg=new THREE.CylinderGeometry(.34,.34,.08,18);cg.rotateX(Math.PI/2);const cm=new THREE.MeshLambertMaterial({color:0xffc83a,emissive:0xffa000,emissiveIntensity:.7});
  MP.coins.forEach((c,i)=>{const m=mesh(cg,cm,c.x,c.y,c.z);m.userData.y=c.y;m.userData.i=i;coinObjs.push(m);if(i==0)m.add(glowS(0,0,0,0xffd75a,2,.6))})}
 NPCS_=NPCS;restoreEstateStaff();WG=null;
 resize()}


/* ---------- الشخصية (نفس شكل الغرفة: بشرة/شعر/لبس من الـ look المحفوظ) ---------- */
const SKC=[0xf1c9a5,0xd9a47a,0xb87b55,0xffdcc0,0x8d5a3c,0x5c3a26],HRC=[0x1a1320,0x3b2314,0x0d0d18,0x6b3fa0,0x8a4b1f,0xd9a441,0x9a2a2a],PNC=[0x2a2f4a,0x1a1a22,0x3b4a6b,0x5a4a3a,0x6b2a3a,0x2a5a4a];
const parseLook=k=>{if(typeof k!='string'||!k)return null;const a=k.split('.').map(Number);if(a.length!=6||a.some(x=>!Number.isFinite(x)))return null;const c=(v,m)=>Math.max(0,Math.min(m,Math.round(v)));return{sk:c(a[0],5),hr:c(a[1],6),st:c(a[2],5),c:c(a[3],359),pc:c(a[4],6),ac:c(a[5],15)}};
const defLook=u=>{const h=hue(u);return{sk:h%4,hr:(h>>2)%5,st:h%4,c:h%360,pc:6,ac:(h%2==0?1:0)|(h%5==0?2:0)}};
function labelSprite(n){const c=document.createElement('canvas');c.width=320;c.height=112;const g=c.getContext('2d');g.fillStyle='rgba(8,12,30,.82)';g.beginPath();g.roundRect?g.roundRect(4,16,312,80,40):g.rect(4,16,312,80);g.fill();g.strokeStyle='#7ff6ff';g.lineWidth=3;g.stroke();g.fillStyle='#fff';g.font='700 34px Cairo,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(String(n||'عضو').slice(0,14),160,57);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));sp.scale.set(2.2,.77,1);sp.position.y=2.3;sp.renderOrder=9;return sp}
function mkAv(u,n,k){const lk=parseLook(k)||defLook(u),g=new THREE.Group(),skin=Lm(SKC[lk.sk]),hair=Lm(HRC[lk.hr]),
 shirt=new THREE.Color('hsl('+lk.c+',68%,52%)'),dark=new THREE.Color('hsl('+((lk.c+200)%360)+',35%,22%)'),acc=new THREE.Color('hsl('+((lk.c+160)%360)+',85%,62%)'),pant=lk.pc<6?PNC[lk.pc]:dark;
 const cyl=(a,b,h,m,x,y,z,p)=>mesh(gm('c'+a+'_'+b+'_'+h,()=>new THREE.CylinderGeometry(a,b,h,10)),m,x,y,z,p),sph=(r,m,x,y,z,sx,sy,sz,p)=>{const o=mesh(gm('s'+r,()=>new THREE.SphereGeometry(r,12,9)),m,x,y,z,p);o.scale.set(sx||1,sy||1,sz||1);return o};
 const sh=mesh(gm('sh',()=>new THREE.CircleGeometry(.5,16)),Bm(0,{transparent:true,opacity:.35,depthWrite:false}),0,.03,0,g);sh.rotation.x=-Math.PI/2;
 const pv=new THREE.Group();pv.position.y=.8;g.add(pv);
 const leg=sx=>{const l=new THREE.Group();l.position.set(sx*.13,.8,0);g.add(l);cyl(.1,.09,.4,Lm(pant),0,-.2,0,l);const kn=new THREE.Group();kn.position.y=-.4;l.add(kn);cyl(.09,.08,.38,Lm(pant),0,-.19,0,kn);bx(.2,.11,.32,Lm(0xf2f2f6),0,-.36,-.05,kn);bx(.2,.03,.33,Lm(acc,1),0,-.405,-.05,kn);return{l,kn}};
 const lL=leg(-1),lR=leg(1),torso=cyl(.25,.28,.62,Lm(shirt,1),0,1.12-.8,0,pv);cyl(.285,.285,.07,Lm(dark),0,.02,0,pv);
 const arm=sx=>{const a=new THREE.Group();a.position.set(sx*.34,.58,0);pv.add(a);cyl(.08,.07,.3,Lm(shirt,1),0,-.15,0,a);const fa=new THREE.Group();fa.position.y=-.3;a.add(fa);cyl(.07,.06,.28,Lm(shirt,1),0,-.14,0,fa);sph(.085,skin,0,-.3,0,1,1,1,fa);return{a,fa}};
 const aL=arm(-1),aR=arm(1);cyl(.07,.08,.12,skin,0,.66,0,pv);
 const head=new THREE.Group();head.position.y=.83;head.scale.setScalar(.9);pv.add(head);sph(.27,skin,0,0,0,1,1.06,1,head);
 [-1,1].forEach(s=>{sph(.06,skin,s*.27,-.02,0,.6,1,1,head);sph(.065,Lm(0xffffff),s*.1,.03,-.235,1,1.2,.5,head);sph(.035,Lm(0x15151c),s*.1,.03,-.265,1,1.1,.5,head)});sph(.05,Lm(0x8a2b3b),0,-.12,-.245,1.5,.45,.5,head);
 if(lk.st!=5){const cap=mesh(gm('cap',()=>new THREE.SphereGeometry(.295,14,10,0,Math.PI*2,0,Math.PI*.52)),hair,0,.02,.03,head);cap.rotation.x=.25;
  if(lk.st==1)for(let i=0;i<5;i++){const c=mesh(gm('cone',()=>new THREE.ConeGeometry(.07,.24,6)),hair,(i-2)*.11,.28-Math.abs(i-2)*.03,-.03,head);c.rotation.z=(2-i)*.25}
  else if(lk.st==2)sph(.12,hair,0,.36,.04,1,1,1,head);else if(lk.st==3)sph(.28,hair,0,-.08,.12,1,1.2,.8,head);
  else if(lk.st==4)for(let i=0;i<9;i++){const a=i*.7;sph(.1,hair,Math.cos(a)*.2,.2+(i%3)*.05,Math.sin(a)*.2+.03,1,1,1,head)}}
 if(lk.ac&1)[-1,1].forEach(s=>{const e=cyl(.09,.09,.07,Lm(acc,1),s*.3,0,0,head);e.rotation.z=Math.PI/2});
 if(lk.ac&2)[-1,1].forEach(s=>mesh(gm('gl',()=>new THREE.TorusGeometry(.075,.012,6,14)),Lm(0x111111),s*.1,.03,-.275,head));
 if(lk.ac&4)sph(.2,hair,0,-.2,-.07,1,.6,.75,head);
 if(lk.ac&8){sph(.31,Lm(acc),0,.09,.02,1,.7,1,head);bx(.3,.03,.22,Lm(acc),0,.08,-.32,head)}
 const sp=labelSprite(n);g.add(sp);[torso,head,sp].forEach(m=>{m.userData.uid=u});
 g.userData={uid:u,legL:lL.l,legR:lR.l,kneeL:lL.kn,kneeR:lR.kn,armL:aL.a,armR:aR.a,foreL:aL.fa,foreR:aR.fa,pv,head,torso,k:0,run:0,ph:(hue(u)%100)/10,n,sp};sc.add(g);return g}
function disp(o){sc&&sc.remove(o);o.traverse(c=>{const m=c.material;if(m){m.map&&m.map.dispose();m.dispose&&m.dispose()}})}
function anim(o,mv,t,run,air,e){const d=o.userData;d.k+=((mv?1:0)-d.k)*.2;d.run+=((run?1:0)-d.run)*.15;const k=d.k,ph=t/(110-d.run*36),w=Math.sin(ph)*k*(.75+d.run*.45),b=Math.sin(t/600+d.ph);
 d.pv.rotation.set(0,0,0);d.armL.rotation.z=d.armR.rotation.z=0;
 if(air){d.legL.rotation.x=.7;d.legR.rotation.x=-.25;d.kneeL.rotation.x=-.9;d.kneeR.rotation.x=-.5;d.armL.rotation.x=-2.5;d.armR.rotation.x=-2.3;d.foreL.rotation.x=d.foreR.rotation.x=.3;d.pv.position.y=.8;return}
 d.legL.rotation.x=w;d.legR.rotation.x=-w;d.kneeL.rotation.x=-Math.max(0,-w)*1.15;d.kneeR.rotation.x=-Math.max(0,w)*1.15;d.armL.rotation.x=-w*.9;d.armR.rotation.x=w*.9;
 d.foreL.rotation.x=d.foreR.rotation.x=k*(.3+d.run*.8);d.pv.position.y=.8+Math.abs(Math.sin(ph))*k*(.035+d.run*.035)+b*.006;d.pv.rotation.z=Math.sin(ph)*k*.055;d.pv.rotation.x=d.run*k*.2;
 if(!mv&&e=='wave'){d.armR.rotation.x=-2.7;d.armR.rotation.z=-.3+Math.sin(t/110)*.35;d.foreR.rotation.x=-.4}
 else if(!mv&&e=='dance'){const s=Math.sin(t/180);d.pv.position.y=.8+Math.abs(s)*.12;d.pv.rotation.z=s*.18;d.pv.rotation.y=Math.sin(t/360)*.6;d.armL.rotation.x=-2.4+s*.5;d.armR.rotation.x=-2.4-s*.5;d.legL.rotation.x=s*.4;d.legR.rotation.x=-s*.4}
 else if(!mv&&(e=='heart'||e=='laugh'))d.pv.position.y=.8+Math.abs(Math.sin(t/140))*.1}
function setEmote(a,e){if(a.em==e)return;a.em=e;if(a.emSp){a.obj.remove(a.emSp);a.emSp=null}if(!e||!EMJ[e])return;
 const m=EMS[e]||(EMS[e]=new THREE.SpriteMaterial({map:cvt(128,128,g=>{g.font='96px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(EMJ[e],64,70)}),transparent:true,depthTest:false}));
 const s=new THREE.Sprite(m);s.scale.set(.9,.9,1);s.position.y=2.95;s.renderOrder=10;a.obj.add(s);a.emSp=s}
function bubble(a,tx){if(a.bub){a.obj.remove(a.bub.sp);a.bub.sp.material.map.dispose();a.bub.sp.material.dispose()}
 const t=String(tx).length>34?String(tx).slice(0,33)+'…':String(tx),c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.roundRect?g.roundRect(4,4,504,80,30):g.rect(4,4,504,80);g.fill();g.fillStyle='#10142a';g.font='700 34px Cairo,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,256,46);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));sp.scale.set(3.6,.68,1);sp.position.y=3.55;sp.renderOrder=11;a.obj.add(sp);a.bub={sp,t:performance.now()+6500}}

/* ---------- البنك ---------- */
let BANK={bal:0,t:Date.now(),log:[]};
function bankUI(){
 q('#bkInfo').innerHTML=`<div>👛 محفظتك: <b>${W}</b> 🪙</div><div>🏦 رصيد البنك: <b>${BANK.bal}</b> 🪙</div><small>الرصيد محفوظ على السيرفر، ولا تُحتسب فوائد محلية غير مؤكدة.</small>`;q('#bkLog').innerHTML=BANK.log.map(x=>`<div>${esc(x)}</div>`).join('')||'<div class="mu">مفيش عمليات لسه</div>'}
async function bankOp(k){const dep=k[0]==='d',all=k===(dep?'da':'wa'),amount=({d5:5,d50:50,d500:500,w5:5,w50:50,w500:500})[k]||0;const r=await economyAction(dep?'bankDeposit':'bankWithdraw',{amount:all?'all':amount});if(!r)return;BANK.log.unshift(dep?'⬆️ إيداع تم':'⬇️ سحب تم');BANK.log=BANK.log.slice(0,6);bankUI()}
async function bankTransferUI(){const targetUid=await SquadDialog.prompt('اكتب UID الخاص بالمستلم:');if(!targetUid)return;const amount=Number(await SquadDialog.prompt('المبلغ المراد تحويله من رصيد البنك:'));if(!Number.isSafeInteger(amount)||amount<=0)return toast('اكتب مبلغًا صحيحًا');const r=await economyAction('bankTransfer',{targetUid:targetUid.trim(),amount});if(r){BANK.log.unshift('💸 تحويل بنكي: '+amount);BANK.log=BANK.log.slice(0,6);bankUI();toast('تم التحويل البنكي بنجاح')}}
async function assetTransferUI(){const targetUid=await SquadDialog.prompt('اكتب UID الخاص بالمستلم:');if(!targetUid)return;const kind=await SquadDialog.prompt('نوع الملكية: car للسيارة، estate للعقار، apartment للشقة');if(!['car','estate','apartment'].includes(kind))return toast('نوع ملكية غير صالح');const id=await SquadDialog.prompt('اكتب معرّف الأصل، مثل catalog_1 أو villa_ridge أو apt_classic');if(!id)return;const r=await economyAction('transferAsset',{targetUid:targetUid.trim(),kind,id:id.trim()});if(r){toast('تم نقل الملكية بنجاح');if(kind==='car')carShopUI();if(kind==='estate')estateUI();if(kind==='apartment')aptUI()}}
const bankOpen=()=>{q('#dstBank').hidden=false;bankUI()},bankClose=()=>{q('#dstBank').hidden=true};

/* ---------- الشبكة ---------- */
function onPlayers(m){if(!sc||!openD)return;
 for(const u in m){const v=m[u];if(!v||typeof v.x!=='number'||!Number.isFinite(v.x)||Math.abs(v.x)>DC.BOUND||typeof v.z!=='number'||!Number.isFinite(v.z)||Math.abs(v.z)>DC.BOUND||typeof v.y!=='number'||!Number.isFinite(v.y)||v.y< -5||v.y>65||typeof v.r!=='number'||!Number.isFinite(v.r))continue;let r=R[u];const tm=v.t&&v.t.toMillis?v.t.toMillis():Date.now();
  if(!r){r=R[u]={obj:mkAv(u,v.n,v.k),x:v.x,y:v.y||0,z:v.z,yaw:v.r||0,sp:0,n:v.n,k:v.k,em:''};r.obj.position.set(r.x,r.y,r.z)}
  else if(v.k!=r.k||v.n!=r.n){const p=r.obj.position.clone(),em=r.em;disp(r.obj);r.obj=mkAv(u,v.n,v.k);r.obj.position.copy(p);r.k=v.k;r.n=v.n;r.em='';r.emSp=null;r.bub=null}
  r.tx=v.x;r.ty=v.y||0;r.tz=v.z;r.tyaw=v.r||0;r.tm=tm;setEmote(r,v.e||'');
  const car=v.car&&DC.CS[v.car.key]&&Number.isFinite(v.car.x)&&Math.abs(v.car.x)<=DC.BOUND&&Number.isFinite(v.car.z)&&Math.abs(v.car.z)<=DC.BOUND&&Number.isFinite(v.car.y)&&v.car.y>=-5&&v.car.y<=65&&Number.isFinite(v.car.yaw)&&Number.isFinite(v.car.v)?v.car:null;let rc=REMOTE_CARS[u];
  if(car){if(!rc||rc.key!==car.key){if(rc)disp(rc.obj);const proto={id:-1,key:car.key,x:car.x,z:car.z,y:car.y||0,yaw:car.yaw||0,wr:0,v:car.v||0};rc=REMOTE_CARS[u]={key:car.key,obj:mkCar(proto),tx:car.x,ty:car.y||0,tz:car.z,tyaw:car.yaw||0,v:car.v||0};sc.add(rc.obj)}
   rc.tx=car.x;rc.ty=car.y||0;rc.tz=car.z;rc.tyaw=car.yaw||0;rc.v=car.v||0;
  }else if(rc){disp(rc.obj);delete REMOTE_CARS[u]}
 }
 for(const u in R)if(!m[u]){disp(R[u].obj);delete R[u];if(REMOTE_CARS[u]){disp(REMOTE_CARS[u].obj);delete REMOTE_CARS[u]}}
 users()}
function users(){const a=Object.keys(R),s=a.map(u=>u+(R[u].n||'')).join();q('#dstCnt').textContent='🏙️ الحي · 👥 '+(a.length+1);if(s==sig)return;sig=s;
 q('#dstUsers').innerHTML=[me.uid].concat(a).map(u=>`<div class="wu">${av(u,u==me.uid?nm():R[u].n)}<b>${esc(u==me.uid?nm():R[u].n||'عضو')}${u==me.uid?' (أنت)':''}</b></div>`).join('')}
function onMsgs(a){const el=q('#dstMsgs');el.innerHTML=a.slice(-30).map(m=>`<div><b>${esc(m.n||'عضو')}:</b> ${esc(m.tx)}</div>`).join('');el.scrollTop=el.scrollHeight;
 const first=!seen;seen=seen||new Set();a.forEach(m=>{if(seen.has(m.id))return;seen.add(m.id);if(first)return;const av_=m.u==me.uid?ME:R[m.u];if(av_&&av_.obj)bubble(av_,m.tx)})}
function say(){const i=q('#dstIn'),tx=i.value.trim();if(!tx||!net)return;if(net.say(tx))i.value=''}
function doEmote(e){EM=e;emT=performance.now()+3500;net&&net.send(P,EM,1);ME&&setEmote(ME,EM)}

/* ---------- العملات (بترجع بعد 5 دقايق) + المحفظة ---------- */
let DRV=null,ADM=0,OWN={},lastJob=0,W=0,STAMP={};const RESP=3e5,ckey=()=>'sq_dc2_'+me.uid,fmt=n=>(+n).toLocaleString('en-US'),coinUI=()=>{q('#dstCoin').textContent='🪙 '+fmt(W)+(BANK.bal?' · 🏦 '+fmt(BANK.bal):'')};
function saveCoins(){try{localStorage[ckey()]=JSON.stringify({w:W,t:STAMP})}catch(e){}}
function loadCoins(){got=new Set();W=0;STAMP={};ADM=isAdm()?1:0;DC.gateOpen(ADM);ownLoad();BANK={bal:0,t:Date.now(),log:[]};coinUI();economyLoad().then(ok=>{if(!ok)return;coinObjs.forEach((m,i)=>{const claimed=ECON&&ECON.coinClaims&&Number(ECON.coinClaims[i]);const cooling=claimed&&Date.now()-claimed<RESP;m.visible=!cooling;if(cooling)got.add(i)});restoreEstateStaff();coinUI()})}
const isAdm=()=>/^1000000000@/.test(me.email||'')||me.sid=='1000000000',okey=()=>'sq_cars_'+me.uid;
function ownLoad(){/* Vehicle ownership comes only from the server. */}
function syncCar(c,dt){const o=CARO[c.id];if(!o)return;const speed=Math.abs(c.v||0),now=performance.now();o.position.set(c.x,c.y+(speed>2?Math.sin(now*.018)*Math.min(.022,speed*.00045):0),c.z);o.rotation.y=c.yaw+Math.PI/2;
 if(o.userData.wheels){const a=dt?c.v*dt/o.userData.r:0;o.userData.wheels.forEach((w,i)=>{if(dt)w.rotation.z-=a;if(i<2)w.rotation.y=Math.max(-.32,Math.min(.32,(c.steer||0)*.28))})}
 const braking=!!c.braking;(o.userData.brakeLights||[]).forEach(l=>{const m=l.material;m.emissiveIntensity=braking?2.1:.35;m.color.setHex(braking?0xff2636:0x70101a)});
 const wet=WET_PATCHES.some(p=>{const dx=(c.x-p.x)/Math.max(.2,p.rx+1),dz=(c.z-p.z)/Math.max(.2,p.rz+1);return dx*dx+dz*dz<1});
 (o.userData.spray||[]).forEach((d,i)=>{const active=wet&&speed>4;d.visible=active;if(active){const phase=now*.012+i*1.7;d.position.x=-DC.CS[c.key].L*.22-speed*.012*(1+i%2);d.position.y=DC.CS[c.key].r*.18+Math.abs(Math.sin(phase))*.12;d.scale.setScalar(.65+Math.abs(Math.sin(phase))*.8);d.material.opacity=Math.min(.52,speed*.018)}})
}
const canDrive=c=>!c.wr&&(ADM||OWN[c.key]);
function nearCar(){if(DRV)return null;let b=null,bd=1e9;for(const c of MP.cars){if(c.wr)continue;const d=Math.hypot(P.x-c.x,P.z-c.z),r=DC.CS[c.key].L/2+2.4;if(d<r&&Math.abs(P.y-c.y)<2&&d<bd){bd=d;b=c}}return b}
function getIn(c){DRV=c;DC.carHold(c,1);P.yaw=c.yaw;ME&&ME.obj&&(ME.obj.visible=false);net&&net.send(P,EM,1,{key:c.key,x:c.x,y:c.y,z:c.z,yaw:c.yaw,v:c.v});toast('🚗 '+DC.CS[c.key].n+' — W/S للسرعة وA/D للتوجيه، E للنزول')}
function getOut(){const c=DRV;if(!c)return;DRV=null;c.v=0;const rx=Math.cos(c.yaw),rz=-Math.sin(c.yaw),W2=DC.CS[c.key].W/2+1;let ok=0;for(const sd of [-1,1,-2,2]){const x=c.x+rx*W2*Math.sign(sd)*(Math.abs(sd)>1?1.6:1),z=c.z+rz*W2*Math.sign(sd)*(Math.abs(sd)>1?1.6:1);if(!DC.blocked(x,z,c.y)){Object.assign(P,DC.newP(x,z),{y:c.y,yaw:c.yaw});ok=1;break}}if(!ok)Object.assign(P,DC.newP(c.x,c.z),{y:c.y+1.2,yaw:c.yaw});DC.parkDyn(c);ME&&ME.obj&&(ME.obj.visible=true);syncCar(c);net&&net.send(P,EM,1,null)}
async function doJob(o){const ids={'باريستا':'cafe','كاشير':'shop','مدرب':'gym','موظف بنك':'bank','فني معمل':'lab','مشرف أركيد':'arcade','بائع فشار':'hall','مندوب مبيعات':'showroom','بائع':'kiosk'};const jobId=ids[o.n];if(!jobId)return toast('الوظيفة دي لسه مش مربوطة بمكافأة السيرفر');const r=await economyAction('job',{jobId});if(r)toast('💼 خلّصت شيفت '+o.n)}
async function buyCar(o){const c=MP.sale[+o.t.slice(3)];if(!c)return;if(OWN[c.key])return toast('✅ إنت مالك '+c.n+' بالفعل');const id=String(c.key).startsWith('catalog_')?c.key:'catalog_'+(MP.sale.indexOf(c)+1);const r=await economyAction('buyCar',{id});if(r)toast('🎉 مبروك! اشتريت '+c.n)}
function respawn(){const now=Date.now();let ch=0;Object.keys(STAMP).forEach(i=>{if(now-STAMP[i]>=RESP){delete STAMP[i];got.delete(+i);coinObjs[i]&&(coinObjs[i].visible=true);ch=1}});if(ch)saveCoins()}
async function pickCoins(){const h=DC.nearCoins(P,MP.coins,got);if(!h.length||ECON_BUSY)return;let claimed=0;for(const i of h){const r=await economyAction('claimCoin',{coinId:i});if(!r)continue;got.add(i);STAMP[i]=Date.now();coinObjs[i]&&(coinObjs[i].visible=false);claimed+=i===0?5:1}if(claimed)toast('🪙 +'+claimed+' (رصيدك '+W+')')}

/* ---------- الحلقة ---------- */
let renderSkip=0,frameBudgetAt=0,frameBudgetN=0,adaptiveDpr=0;
function frame(t){raf=requestAnimationFrame(frame);const dt=Math.min((t-last)/1000||.016,.05);last=t;
 /* v90: adapt render resolution conservatively on sustained slow frames; simulation/network logic keeps its normal cadence. */
 frameBudgetN++;if(t-frameBudgetAt>=2200){const fps=frameBudgetN*1000/Math.max(1,t-frameBudgetAt);frameBudgetAt=t;frameBudgetN=0;
  if(ren&&ren.setPixelRatio){const target=fps<28?(MOB?.72:.85):fps<42?(MOB?.82:1.0):(MOB?1.0:1.25);if(!adaptiveDpr)adaptiveDpr=Math.min(devicePixelRatio||1,MOB?1.0:1.25);const next=Math.min(adaptiveDpr,target);if(Math.abs(next-(ren.getPixelRatio?ren.getPixelRatio():next))>.08){ren.setPixelRatio(next);resize()}}
 }

 let f=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0)-jy,s=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)+jx;const l=Math.hypot(f,s);if(l<.08){f=s=0}
 const run=!!(K.shift||runT||((jx||jy)&&l>.92));if(K.q||K.e)P.yaw+=((K.q?1:0)-(K.e?1:0))*1.9*dt;
 DC.tick(Date.now());animateEngineers(t);animateEstateStaff(t);animateEntourage(dt,t);if(DRV){DC.drive(DRV,{f,s},dt);P.x=DRV.x;P.z=DRV.z;P.y=DRV.y;P.yaw=DRV.yaw;P.vy=0;P.on=1;P.moved=Math.abs(DRV.v)>.05?1:0;syncCar(DRV,dt)}else DC.step(P,{f,s,run,jump:K.jump?1:0},dt);K.jump=0;worldAnim(t,dt);if(P.moved&&EM&&t>emT-3300){EM='';net&&net.send(P,'',1);ME&&setEmote(ME,'')}
 if(EM&&t>emT){EM='';net&&net.send(P,'',1);ME&&setEmote(ME,'')}
 if(ME){ME.obj.position.set(P.x,P.y,P.z);ME.obj.rotation.y=P.yaw;anim(ME.obj,P.moved&&(f||s),t,run,!P.on,EM);if(ME.bub&&t>ME.bub.t){ME.obj.remove(ME.bub.sp);ME.bub=null}}
 if(net&&t-lastSend>1000){lastSend=t;net.send(P,EM,0,DRV?{key:DRV.key,x:DRV.x,y:DRV.y,z:DRV.z,yaw:DRV.yaw,v:DRV.v}:null)}
 for(const u in REMOTE_CARS){const c=REMOTE_CARS[u],a=Math.min(1,dt*12);c.obj.position.x+=(c.tx-c.obj.position.x)*a;c.obj.position.y+=(c.ty-c.obj.position.y)*a;c.obj.position.z+=(c.tz-c.obj.position.z)*a;let da=c.tyaw-(c.obj.rotation.y-Math.PI/2);da=Math.atan2(Math.sin(da),Math.cos(da));c.obj.rotation.y+=da*a;}
 for(const u in R){const r=R[u],o=r.obj,ox=r.x,oz=r.z,a=Math.min(1,dt*8);r.x+=(r.tx-r.x)*a;r.z+=(r.tz-r.z)*a;r.y+=(r.ty-r.y)*Math.min(1,dt*10);
  r.sp+=(Math.hypot(r.x-ox,r.z-oz)/Math.max(dt,.001)-r.sp)*.2;let d=r.tyaw-r.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));r.yaw+=d*Math.min(1,dt*10);
  o.position.set(r.x,r.y,r.z);o.rotation.y=r.yaw;anim(o,r.sp>.4,t,r.sp>5.4,Math.abs(r.ty-r.y)>.25&&r.ty>.3,r.em);if(r.bub&&t>r.bub.t){o.remove(r.bub.sp);r.bub=null}}
 coinObjs.forEach(m=>{if(m.visible){m.rotation.y=t/400;m.position.y=m.userData.y+Math.sin(t/500+m.userData.i)*.1}});
 if(fountainTop)fountainTop.position.y=MP.fountain.top+2.1+Math.sin(t/300)*.12;
 if(fountainWaterSurface&&fountainWaterSurface.geometry&&fountainWaterSurface.geometry.attributes.position){const a=fountainWaterSurface.geometry.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),z=a.getY(i);a.setZ(i,Math.sin(t*.0028+x*2.7+z*1.8)*.012+Math.sin(t*.0019-z*3.1)*.007)}a.needsUpdate=true;fountainWaterSurface.geometry.computeVertexNormals()}
 FOUNTAIN_DROPS.forEach(d=>{const phase=(t*.00072+d.phase)%1,rad=d.range*phase,fall=MP.fountain.top+2.16+d.height*phase-2.85*phase*phase;d.mesh.position.set(MP.fountain.cx+Math.cos(d.angle)*rad,Math.max(MP.fountain.top+.13,fall),MP.fountain.cz+Math.sin(d.angle)*rad);const sca=.55+Math.sin(Math.PI*phase)*.72;d.mesh.scale.set(.72*sca,1.15*sca,.72*sca);d.mesh.visible=fall>MP.fountain.top+.14});
 FOUNTAIN_RIPPLES.forEach(r=>{const phase=(t*.00048+r.phase)%1,rad=.18+phase*1.55;r.mesh.position.set(MP.fountain.cx+Math.cos(r.angle)*rad,MP.fountain.top+.125,MP.fountain.cz+Math.sin(r.angle)*rad);r.mesh.scale.setScalar(.45+phase*1.15);r.mesh.material.opacity=.3*(1-phase)});
 pulse.forEach((r,i)=>{r.material.opacity=.45+.3*Math.sin(t/300+i);r.scale.setScalar(1+.08*Math.sin(t/300+i))});
 if(t-lastCoinCheck>160){lastCoinCheck=t;pickCoins()}
 /* الكاميرا: ورا اللاعب، وتقرّب لو في حيطة ورا */
 const sy=Math.sin(P.yaw),cy=Math.cos(P.yaw);
 let dd=DRV?Math.max(camD,9.5):camD;dd=DC.cameraDistance(P,sy,cy,dd,1.6,.35);let cyy=P.y+camH*(dd/camD)+.4;const bd=DC.near(P.x,P.z,-.3);if(bd){const fi=Math.min(bd.n-1,Math.floor((P.y+.2)/bd.fh));cyy=Math.min(cyy,(fi+1)*bd.fh-.6)}
 cam.position.set(P.x+sy*dd,Math.max(cyy,P.y+.9),P.z+cy*dd);cam.lookAt(P.x-sy*1.5,P.y+1.2,P.z-cy*1.5)
 if(t-lastSlow>250){lastSlow=t;nearDoor=null;let nb_=0,best=null,rank={car:4,cafe3d:3,job:2};
  for(const b of MP.buildings)for(const o of b.spots)if(Math.hypot(P.x-o.x,P.z-o.z)<o.r&&Math.abs(P.y-o.y)<2.2){if(o.t=='bank')nb_=1;else{const k=o.t.slice(0,3)=='car'?'car':o.t,r=rank[k]||0;if(r&&(!best||r>best.r))best={r,k,o}}}
  if(best){const o=best.o;if(best.k=='car'){const c=MP.sale[+o.t.slice(3)];nearDoor={id:'buy',o};q('#dstDoor').textContent=OWN[c.key]?'✅ مملوكة: '+c.n:'🛒 اشترِ '+c.n+' ('+fmt(c.p)+')'}else if(best.k=='job'){nearDoor={id:'job',o};q('#dstDoor').textContent='💼 اشتغل '+o.n+' (+'+fmt(o.pay)+')'}else{nearDoor={id:'cafe'};q('#dstDoor').textContent='☕ ادخل غرفة الكافيه'}}
  if(DRV){nearDoor={id:'out'};q('#dstDoor').textContent='🚪 انزل من العربية (E)';nb_=0}else{const nc=nearCar();if(nc){const sl=nc.sale>=0?MP.sale[nc.sale]:null;if(canDrive(nc)){nearDoor={id:'drive',c:nc};q('#dstDoor').textContent='🚗 اركب '+DC.CS[nc.key].n+' (E)'}else if(sl){nearDoor={id:'buy',o:{t:'car'+nc.sale}};q('#dstDoor').textContent=OWN[sl.key]?'✅ مملوكة: '+sl.n:'🛒 اشترِ '+sl.n+' ('+fmt(sl.p)+')'}}}
  q('#dstAct').hidden=!(nearDoor||nb_);q('#dstDoor').hidden=!nearDoor;q('#dstBk').hidden=!nb_;
  respawn();
  const now=Date.now();for(const u in R)if(R[u].tm&&now-R[u].tm>60000){disp(R[u].obj);delete R[u];users()}}
 if(t-lastMap>140){lastMap=t;drawMap()}
 if(!document.hidden){renderSkip=(renderSkip+1)%((ren.getPixelRatio&&ren.getPixelRatio()<.8)?2:1);if(!renderSkip)ren.render(sc,cam)}}
function worldAnim(t,dt){const a=Math.min(1,dt*7);
 SLIDERS.forEach(s=>{let nr=0;if(s.adm&&!ADM)nr=0;else if(Math.hypot(P.x-s.x,P.z-s.z)<4.2&&P.y<s.b.fh*.5+1)nr=1;else for(const u in R){const r=R[u];if(Math.hypot(r.x-s.x,r.z-s.z)<4.2&&r.y<s.b.fh*.5+1){nr=1;break}}
  const nv=s.o+((nr?1:0)-s.o)*a;if(Math.abs(nv-s.o)>.0005){s.o=nv;s.upd(nv)}});
 LIFTS.forEach(l=>{const L=l.L;l.cab.position.y=L.y;l.ds.forEach(d=>{const op=L.doors[d.f].open?1:0;d.o+=(op-d.o)*a;[-1,1].forEach((sg,i)=>{const p=l.b.W(l.cu+sg*(l.wd/4+d.o*1.05),L.v1+.34);d.pa[i].position.x=p[0];d.pa[i].position.z=p[1]});if(op!=d.on){d.on=op;d.mt.color.setHex(op?0x5cff7a:0xff5050)}})});
 if(t-lastNpc>120){lastNpc=t;NPCS_.forEach((o,i)=>anim(o,false,t+i*400,0,false,i%5==0?'wave':''))}}
function drawMap(){const c=q('#dstMap'),g=c.getContext('2d'),S=c.width,V=150,k=S/V,X=x=>(x-P.x)*k+S/2,Z=z=>(z-P.z)*k+S/2,vis=(x,z,r)=>Math.abs(x-P.x)<V/2+r&&Math.abs(z-P.z)<V/2+r;g.clearRect(0,0,S,S);g.fillStyle='rgba(10,14,30,.88)';g.fillRect(0,0,S,S);
 g.fillStyle='#1d5a44';MP.parks.forEach(o=>{g.fillRect(X(o.x0),Z(o.z0),(o.x1-o.x0)*k,(o.z1-o.z0)*k)});
 g.fillStyle='#2e3560';MP.roads.forEach(o=>g.fillRect(X(o.cx-o.hw),Z(o.cz-o.hd),o.hw*2*k,o.hd*2*k));
 g.fillStyle='#4a4f86';MP.fillers.forEach(o=>{if(vis(o.cx,o.cz,40))g.fillRect(X(o.cx-o.hw),Z(o.cz-o.hd),o.hw*2*k,o.hd*2*k)});
 MP.buildings.forEach(b=>{g.fillStyle='#'+PAL[b.id][0].toString(16).padStart(6,'0');g.globalAlpha=.8;g.fillRect(X(b.cx-b.hw),Z(b.cz-b.hd),b.hw*2*k,b.hd*2*k);g.globalAlpha=1});
 g.fillStyle='#3fb8ff';g.fillRect(X(-3),Z(-3),6*k,6*k);g.fillStyle='#ff7ad9';MP.plats.forEach(p=>g.fillRect(X(p.x-1.2),Z(p.z-1.2),2.4*k,2.4*k));
 g.fillStyle='#ffd75a';MP.coins.forEach((c2,i)=>{if(!got.has(i)&&vis(c2.x,c2.z,0)&&Math.abs(c2.y-.9-P.y)<2){g.beginPath();g.arc(X(c2.x),Z(c2.z),3,0,7);g.fill()}});
 g.fillStyle='#ff7ad9';for(const u in R){g.beginPath();g.arc(X(R[u].x),Z(R[u].z),5,0,7);g.fill()}
 g.save();g.translate(S/2,S/2);g.rotate(-P.yaw);g.fillStyle='#7ff6ff';g.beginPath();g.moveTo(0,-11);g.lineTo(8,8);g.lineTo(-8,8);g.closePath();g.fill();g.restore()}
function resize(){if(!ren)return;const w=innerWidth,h=innerHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}

/* v90: stop the animation loop while the game is backgrounded; restart cleanly on return. */
let gamePaused=false;
function pauseGame(){if(!openD||gamePaused)return;gamePaused=true;cancelAnimationFrame(raf);Object.keys(K).forEach(k=>K[k]=0);jx=jy=0;last=performance.now()}
function resumeGame(){if(!openD||!gamePaused||document.hidden)return;gamePaused=false;last=performance.now();raf=requestAnimationFrame(frame)}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();else resumeGame()});
window.addEventListener('pagehide',pauseGame);window.addEventListener('pageshow',resumeGame);
/* ---------- دخول وخروج ---------- */
function enter(o){o=o||{};if(openD)return;openD=1;const ld=q('#dstLoad');q('#dst').hidden=false;ld.hidden=false;ld.textContent='بيحمّل الحي...';
 loadT(ok=>{if(!openD)return;if(!ok){ld.textContent='مقدرتش أحمّل Three.js. اتأكد من النت وجرّب تاني';return}
  try{if(!built){build();built=1}}catch(e){console.error(e);ld.textContent='فشل بناء الحي: '+(e&&e.message||e)+' — ابعتلي الرسالة دي';return}
  resize();loadCoins();ld.hidden=true;q('#dstUsers').hidden=MOB;
  const cafe=MP.buildings.find(b=>b.id=='cafe'),from=o.from=='cafe';if(from){const w=cafe.W(-cafe.hw+2.3,-3),c=cafe.W(0,-3);Object.assign(P,DC.newP(w[0],w[1]));P.yaw=Math.atan2(-(c[0]-w[0]),-(c[1]-w[1]))}else{Object.assign(P,DC.newP(MP.spawn.x,MP.spawn.z));P.yaw=0}
  Promise.race([db.doc('looks/'+me.uid).get(),new Promise((_,j)=>setTimeout(j,1500))]).then(d=>{MYK=(d&&d.exists&&d.data()&&d.data().k)||''}).catch(()=>{MYK=''}).then(()=>{if(!openD)return;
   ME={obj:mkAv(me.uid,nm(),MYK),em:''};seen=null;sig='';EM='';
   net=new DC.Net({db,FV,room:'main',uid:me.uid,getPosition:()=>P,name:nm,hue:hue(me.uid)%360,look:()=>MYK,onPlayers,onMsgs,onStatus:(st)=>{const el=q('#dstNet');if(el){el.dataset.state=st;el.textContent=st==='online'?'● متصل':st==='connecting'?'● جاري الاتصال':st==='offline'?'● غير متصل':'● مشكلة اتصال'}},onError:(w,e)=>{console.warn('district',w,e);if(w!='send')toast('مشكلة اتصال في الحي ('+w+'). راجع اتصال الإنترنت وقواعد المشروع الحالية')}});
   net.start();net.send(P,'',1);users();last=performance.now();raf=requestAnimationFrame(frame)})})}
function leave(){if(!openD)return;if(DRV)getOut();openD=0;gamePaused=false;bankClose();cancelAnimationFrame(raf);net&&net.stop();net=null;Object.keys(R).forEach(u=>{disp(R[u].obj);delete R[u]});Object.keys(REMOTE_CARS).forEach(u=>{disp(REMOTE_CARS[u].obj);delete REMOTE_CARS[u]});ME&&disp(ME.obj);ME=null;EM='';jx=jy=0;Object.keys(K).forEach(k=>K[k]=0);q('#dst').hidden=true}
const toCafe=async()=>{leave();try{if(window.SQUAD_LOAD_WORLD)await SQUAD_LOAD_WORLD();window.WORLD&&WORLD.enter()}catch(e){console.error(e);toast('تعذر تحميل الكافيه. حاول مرة أخرى')}};

/* ---------- إدخال ---------- */
document.addEventListener('keydown',e=>{if(!openD)return;const k=e.key.toLowerCase();if(e.target.tagName=='INPUT'){if(e.key=='Enter'&&e.target.id=='dstIn'){say();if(!MOB)e.target.blur()}return}
 if(k=='e'&&!e.repeat){const b=q('#dstDoor');if(b&&!b.hidden)b.click()}
 if(k==' ')K.jump=1;K[k]=1;if(k=='enter')q('#dstIn').focus();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault()});
document.addEventListener('keyup',e=>{K[e.key.toLowerCase()]=0});addEventListener('blur',()=>Object.keys(K).forEach(k=>K[k]=0));
const cv=q('#dstC');
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:Date.now(),id:e.pointerId};cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(!drag||e.pointerId!=drag.id)return;P.yaw-=(e.clientX-drag.x)*.006;camH=Math.max(1.6,Math.min(7,camH-(e.clientY-drag.y)*.015));drag.x=e.clientX;drag.y=e.clientY});
cv.addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;if(Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<7&&Date.now()-d.t<500)pick(e.clientX,e.clientY)});
cv.addEventListener('wheel',e=>{camD=Math.max(3.5,Math.min(11,camD+e.deltaY*.005));e.preventDefault()},{passive:false});
function pick(x,y){if(!ray||!cam)return;ray.setFromCamera(new THREE.Vector2(x/innerWidth*2-1,-(y/innerHeight)*2+1),cam);const l=[];for(const u in R){const d=R[u].obj.userData;l.push(d.torso,d.head,d.sp)}
 const h=ray.intersectObjects(l,false),u=h&&h[0]&&h[0].object.userData.uid;if(u&&window.ACCTUI)ACCTUI.prof(u)}
const jyE=q('#dstJoy');function mvJ(e){const r=jyE.getBoundingClientRect();let x=e.clientX-r.left-60,y=e.clientY-r.top-60;const l=Math.hypot(x,y);if(l>46){x*=46/l;y*=46/l}jx=x/46;jy=y/46;jyE.firstElementChild.style.transform=`translate(${x}px,${y}px)`}
jyE.addEventListener('pointerdown',e=>{jyE.setPointerCapture(e.pointerId);mvJ(e)});jyE.addEventListener('pointermove',e=>{e.buttons&&mvJ(e)});['pointerup','pointercancel'].forEach(n=>jyE.addEventListener(n,()=>{jx=jy=0;jyE.firstElementChild.style.transform=''}));
q('#dstJump').onpointerdown=e=>{e.preventDefault();K.jump=1};q('#dstRun').onclick=()=>{runT=!runT;q('#dstRun').classList.toggle('on',runT)};
document.querySelectorAll('#dstEmo button').forEach(b=>b.onclick=()=>doEmote(b.dataset.e));
q('#dstEntourageB').onclick=()=>{entourageUI();q('#dstEntourage').hidden=false};q('#dstEntourageClose').onclick=()=>q('#dstEntourage').hidden=true;q('#bodyguardChoices').onclick=e=>{const b=e.target.closest('[data-bodyguard-estate]');if(b)hirePersonalGuard(b.dataset.bodyguardEstate)};q('#bodyguardFollow').onclick=()=>{BODYGUARD_FOLLOW=!BODYGUARD_FOLLOW;entourageUI();toast(BODYGUARD_FOLLOW?'الحراس هيمشوا وراك':'تم إيقاف اتباع الحراس')};q('#convoyToggle').onclick=toggleConvoy;q('#dstX').onclick=leave;q('#dstCafe').onclick=toCafe;q('#dstNeon').onclick=()=>{NEON_INDEX=(NEON_INDEX+1)%NEON_PALETTE.length;const color=NEON_PALETTE[NEON_INDEX];const update=o=>{if(!o)return;o.traverse(n=>{if(n.userData&&n.userData.squadNeon&&n.material&&n.material.color)n.material.color.setHex(color)})};CARO.forEach(update);Object.values(REMOTE_CARS).forEach(r=>update(r&&r.obj));q('#dstNeon').textContent=['💡 أزرق','💡 وردي','💡 أخضر','💡 ذهبي','💡 أبيض'][NEON_INDEX];toast('تم تغيير لون نيون العربيات')};q('#dstHubB').onclick=()=>q('#dstHub').hidden=false;q('#dstHubClose').onclick=()=>q('#dstHub').hidden=true;q('#dstEstateB').onclick=()=>{q('#dstHub').hidden=true;estateUI();q('#dstEstate').hidden=false};q('#dstEstateClose').onclick=()=>q('#dstEstate').hidden=true;q('#dstEstateGrid').onclick=e=>{const st=e.target.closest('[data-staff]');if(st){staffAction(st.dataset.staff,st.dataset.kind);return}const b=e.target.closest('[data-estate]');if(b)estateAction(b.dataset.estate)};q('#dstAptB').onclick=()=>{q('#dstHub').hidden=true;aptUI();q('#dstApts').hidden=false};q('#dstAptClose').onclick=()=>q('#dstApts').hidden=true;q('#dstAptGrid').onclick=e=>{const b=e.target.closest('[data-apt]');if(b)aptAction(b.dataset.apt)};q('#dstCarShopB').onclick=()=>{q('#dstHub').hidden=true;carShopUI();q('#dstCars').hidden=false};q('#dstCarShopClose').onclick=()=>q('#dstCars').hidden=true;q('#dstCarShopGrid').onclick=e=>{const b=e.target.closest('[data-catalog-car]');if(b)carShopAction(b.dataset.catalogCar)};q('#dstUb').onclick=()=>{const u=q('#dstUsers');u.hidden=!u.hidden};q('#dstCb').onclick=()=>q('#dstChat').classList.toggle('off');q('#dstSend').onclick=()=>{say();q('#dstIn').blur()};
q('#dstDoor').onclick=()=>{if(!nearDoor)return;if(nearDoor.id=='cafe')toCafe();else if(nearDoor.id=='job')doJob(nearDoor.o);else if(nearDoor.id=='buy')buyCar(nearDoor.o);else if(nearDoor.id=='drive')getIn(nearDoor.c);else if(nearDoor.id=='out')getOut()};q('#dstBk').onclick=bankOpen;q('#bkX').onclick=bankClose;q('#bkTransfer').onclick=bankTransferUI;q('#bkAsset').onclick=assetTransferUI;document.querySelectorAll('#dstBank [data-b]').forEach(b=>b.onclick=()=>bankOp(b.dataset.b));
addEventListener('resize',resize);addEventListener('pagehide',()=>{if(openD&&net)try{db.doc('district/main/players/'+me.uid).delete()}catch(e){}});
document.addEventListener('visibilitychange',()=>{if(openD&&!document.hidden&&net)net.send(P,EM,1)});
addEventListener('online',()=>{if(openD&&net){q('#dstNet').dataset.state='connecting';q('#dstNet').textContent='● إعادة الاتصال...';net.send(P,EM,1,DRV?{key:DRV.key,x:DRV.x,y:DRV.y,z:DRV.z,yaw:DRV.yaw,v:DRV.v}:null)}});addEventListener('offline',()=>{if(openD){q('#dstNet').dataset.state='offline';q('#dstNet').textContent='● غير متصل'}});
window.DISTRICT={enter,leave,state:()=>({P,R:Object.keys(R),open:openD,got:[...got],near:nearDoor&&nearDoor.id,em:EM,wallet:W,bank:BANK.bal,bld:(DC.near(P.x,P.z,-.3)||{}).id,lifts:LIFTS.length}),__K:K,__w:n=>{W=n;coinUI()},__drv:()=>DRV&&DRV.key,__own:k=>{OWN[k]=1},__tp:(x,z,y)=>Object.assign(P,DC.newP(x,z),{y:y||0}),estates:()=>ESTATE_CATALOG.map(a=>({id:a.id,name:a.name,price:a.price,owned:!!OWN_ESTATES[a.id]}))};
})();
