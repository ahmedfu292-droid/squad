/* The Squad — XO لحظي + حظر وإبلاغ + تبديل اللغة (عربي/English) */
let BL={},unBL=null,unG=null,G=null;
auth.onAuthStateChanged(u=>{unBL&&unBL();BL={};u&&(unBL=db.collection(`users/${u.uid}/blocked`).onSnapshot(s=>{BL={};s.forEach(d=>BL[d.id]=1);cid&&draw()},()=>{}))});
const draw0=draw;draw=function(){Object.keys(M).forEach(k=>BL[M[k].u]&&delete M[k]);draw0()};
$('#cla').insertAdjacentHTML('beforebegin','<button id="gm" class="ic" title="XO">🎮</button><button id="blk" class="ic" title="حظر وإبلاغ">⚠️</button>');
/* XO */
const WL=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],gref=()=>db.doc('games/'+cid);
const win=b=>{for(const[a,c,d]of WL)if(b[a]!=' '&&b[a]==b[c]&&b[a]==b[d])return b[a];return b.includes(' ')?'':'-'};
const canPlay=g=>g&&!g.w&&((g.turn=='x'&&g.x==me.uid)||(g.turn=='o'&&(g.o==me.uid||(!g.o&&g.x!=me.uid))));
function xoDraw(open){if(!open&&($('#sh').hidden||!$('#xo')))return;const g=G;
 const st=!g?'ابدأ لعبة جديدة':g.w=='-'?'تعادل 🤝':g.w?((g.w=='X'?g.x:g.o)==me.uid?'كسبت 🎉':'الخصم كسب'):canPlay(g)?'دورك ('+(g.turn=='x'?'X':'O')+')':'استنى الخصم...';
 sheet(`<h3>❌⭕ XO</h3><p class="mu">${st}</p><div id="xo" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${[...(g?g.b:' '.repeat(9))].map((ch,i)=>`<button data-xn="${i}" style="height:76px;font-size:34px">${ch==' '?'':ch}</button>`).join('')}</div><button class="pri" data-xnew="1">لعبة جديدة</button>`)}
$('#gm').onclick=()=>{if(!cid)return;unG&&unG();unG=gref().onSnapshot(s=>{G=s.exists?s.data():null;xoDraw()},()=>toast('مقدرتش أفتح اللعبة. تأكد إن القواعد الجديدة اتنشرت'));xoDraw(1)};
/* حظر وإبلاغ */
$('#blk').onclick=()=>{const c=C[cid];if(!c)return;const o=c.type=='p'?c.members.find(x=>x!=me.uid):'';
 sheet('<h3>⚠️ حظر وإبلاغ</h3>'+(o?`<button data-bk="${o}">${BL[o]?'✅ إلغاء الحظر':'🚫 حظر (بيخفي رسايله عندك)'}</button>`:'')+['إساءة','سبام','محتوى غير لائق','انتحال'].map(w=>`<button data-rp="${w}" data-tg="${o}">🚩 إبلاغ: ${w}</button>`).join(''))};
$('#sh').addEventListener('click',async e=>{const d=e.target.dataset;
 if(d.xn!=null&&G&&canPlay(G)&&G.b[+d.xn]==' '){const i=+d.xn,s=G.turn=='x'?'X':'O',b=G.b.slice(0,i)+s+G.b.slice(i+1),u={b,turn:G.turn=='x'?'o':'x',w:win(b)};if(s=='O'&&!G.o)u.o=me.uid;gref().update(u).catch(()=>toast('الحركة ماتبعتتش'))}
 if(d.xnew)gref().set({b:' '.repeat(9),x:me.uid,o:'',turn:'x',w:'',t:FV.serverTimestamp()}).catch(()=>toast('مقدرتش أبدأ اللعبة'));
 if(d.bk){const r=db.doc(`users/${me.uid}/blocked/${d.bk}`);(BL[d.bk]?r.delete():r.set({t:FV.serverTimestamp()})).then(closeSh).catch(()=>toast('مقدرتش'))}
 if(d.rp)db.collection('reports').add({u:me.uid,tg:d.tg||'',cid,why:d.rp,t:FV.serverTimestamp()}).then(()=>{closeSh();toast('وصل البلاغ ✅')}).catch(()=>toast('مقدرتش أبعت البلاغ'))});
/* English (للنصوص الثابتة فقط) */
const EN={'الرئيسية':'Home','المكالمات':'Calls','التحديثات':'Updates','استكشاف':'Explore','حسابي':'Me','المزيد':'More','الكل':'All','المحادثات':'Chats','المجموعات':'Groups','المثبتة':'Pinned','دخول':'Sign in','حساب جديد':'Sign up','إنشاء الحساب':'Create account','اختار محادثة':'Pick a chat','كلمة السر':'Password','اسمك':'Your name','نشر':'Post','تابع':'Follow','متابَع':'Following','لعبة جديدة':'New game','اكتب رسالة...':'Type a message...','ابحث عن محادثة أو جروب...':'Search chats or groups...','6 حروف على الأقل':'At least 6 characters'};
const tr=n=>{const t=n.nodeValue.trim(),p=n.parentNode;if(!t||!EN[t])return;if(t=='دخول'&&p&&p.closest&&!p.closest('#auth')){p.closest('[data-act=join]')&&(n.nodeValue=n.nodeValue.replace(t,'Join'));return}n.nodeValue=n.nodeValue.replace(t,EN[t])};
const sweep=r=>{if(r.nodeType==3)return tr(r);const w=document.createTreeWalker(r,4);let n;while(n=w.nextNode())tr(n);r.querySelectorAll('[placeholder]').forEach(i=>EN[i.placeholder]&&(i.placeholder=EN[i.placeholder]))};
$('#gear').insertAdjacentHTML('afterend','<button id="lg2" class="ic" title="Language">🌐</button>');
$('#lg2').onclick=()=>{localStorage.lang=localStorage.lang=='en'?'ar':'en';location.reload()};
if(localStorage.lang=='en'){document.documentElement.lang='en';document.documentElement.dir='ltr';sweep(document.body);new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(sweep))).observe(document.body,{childList:true,subtree:true})}
