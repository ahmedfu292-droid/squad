/* The Squad v30 — luxe.js: شريط جانبي (ديسكتوب) + لوحة الملف الشخصي + تاج الشعار. بيغلّف الدوال الموجودة (go/renderHome) من غير ما يمسح حاجة. بيتحمّل بعد ui2.js */
(()=>{
const CROWN='<svg class="lx-crown" viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M6 40 2 12l18 14L32 4l12 22L62 12l-4 28z"/></svg>';
const I={chat:'M21 12a8 8 0 0 1-11.7 7L3 21l2-5.6A8 8 0 1 1 21 12z',grp:'M17 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8',shop:'M6 6h15l-1.5 9h-12zM6 6 5 2H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',fr:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a3 3 0 0 0-2-2.8M16 3.2a3 3 0 0 1 0 5.6',file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',set:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',call:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'};
const sv=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${I[k]}"/></svg>`;
const app=document.getElementById('app'),side=document.getElementById('side');if(!app||!side)return;
/* تاج في الشعار */
const h2=side.querySelector('header h2');if(h2&&!side.querySelector('.lx-crown.hd')){h2.insertAdjacentHTML('beforebegin',CROWN.replace('class="lx-crown"','class="lx-crown hd"'));const o=side.querySelector('header .logo.sm');o&&(o.style.display='none')}
/* الشريط الجانبي */
const rail=document.createElement('nav');rail.id='lxrail';
rail.innerHTML=`<div class="lg">${CROWN}</div>
<button data-k="chat" class="on">${sv('chat')}الدردشة</button><button data-k="grp">${sv('grp')}المجموعات</button><button data-k="shop">${sv('shop')}المتجر</button><button data-k="fr">${sv('fr')}أصدقاء</button><button data-k="file">${sv('file')}الملفات</button><i class="sp"></i><button data-k="set">${sv('set')}الإعدادات</button>`;
app.insertBefore(rail,side);app.classList.add('lxon');
const nb=k=>document.querySelector(`#nav [data-go=${k}]`),tabB=f=>document.querySelector(`#tabs [data-f=${f}]`);
const act={chat(){window.go&&go('home');tabB('all')&&tabB('all').click()},grp(){window.go&&go('home');tabB('g')&&tabB('g').click()},
 shop(){window.go&&go('ai')},fr(){const p=document.getElementById('plus');p&&p.click()},file(){const b=document.getElementById('gear');b&&b.click()},set(){const b=document.getElementById('gear');b&&b.click()}};
rail.addEventListener('click',e=>{const b=e.target.closest('button[data-k]');if(!b)return;rail.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b));try{act[b.dataset.k]()}catch(x){console.error(x)}});
/* رقم الرسايل الغير مقروءة على الشريط */
const sync=()=>{const n=document.querySelector('#nav [data-go=home] .nb'),b=rail.querySelector('[data-k=chat]');let e=b.querySelector('.nb');if(!n){e&&e.remove();return}e||(e=document.createElement('b'),e.className='nb',b.appendChild(e));e.textContent=n.textContent};
/* لوحة الملف الشخصي في الشاشة الفاضية */
const emp=document.getElementById('empty');
function panel(){if(!emp||typeof me=='undefined'||!me||typeof av!='function')return;const nm=(U&&U.name)||me.displayName||'أنت',bio=(U&&U.bio)||'';
 const sig=nm+'|'+bio+'|'+(typeof PH!='undefined'&&PH[me.uid]||'');if(emp.dataset.sig==sig)return;emp.dataset.sig=sig;
 let p=emp.querySelector('.lxp');p||(p=document.createElement('div'),p.className='lxp',emp.appendChild(p));
 p.innerHTML=`<div class="ph">${av(me.uid,nm,1)}</div><h3>${esc(nm)}${CROWN}</h3><div class="st"><i></i>متصل الآن</div>
 <div class="bio"><b>أهلاً بيك في The Squad</b><span>${esc(bio)||'العب · دردش · واتعرّف على أصحاب جداد'}</span></div>
 <div class="acts"><button data-a="call">${sv('call')}<span>المكالمات</span></button><button data-a="chat">${sv('chat')}<span>المحادثات</span></button><button data-a="set">${sv('set')}<span>الإعدادات</span></button></div>`;
 p.querySelector('.acts').onclick=e=>{const b=e.target.closest('button');if(!b)return;({call:()=>window.go&&go('calls'),chat:()=>window.go&&go('home'),set:()=>document.getElementById('gear').click()})[b.dataset.a]()}}
if(typeof renderHome=='function'){const r0=renderHome;renderHome=function(){r0();try{panel();sync()}catch(e){console.error("luxe",e)}}}
setInterval(()=>{try{panel();sync()}catch(e){console.error("luxe",e)}},1500);
})();
