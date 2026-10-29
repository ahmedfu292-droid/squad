/* The Squad — الدفعة 3: أرشفة وكتم المحادثات + تثبيت رسالة. بيتحمّل بعد look.js */
(()=>{
const upd=o=>db.doc('users/'+me.uid).update(o);
/* ---- أرشفة وكتم ---- */
$('#tabs').insertAdjacentHTML('beforeend','<button data-f="arch">المؤرشفة</button>');
const rh=renderHome;renderHome=function(){
 const all=C,a=U.arch||[];
 C=Object.fromEntries(Object.entries(all).filter(([id])=>flt=='arch'?a.includes(id):(!a.includes(id)||id==cid)));
 try{rh()}finally{C=all}
 if(tab!='home')return;
 if(flt=='arch')document.querySelectorAll('#list [data-bot]').forEach(e=>e.remove());
 const m=U.mute||[];document.querySelectorAll('#list [data-id]').forEach(el=>{if(m.includes(el.dataset.id)){const b=el.querySelector('b');b&&!b.dataset.mu&&(b.dataset.mu=1,b.insertAdjacentText('beforeend',' 🔕'))}})};
const addMenu=()=>{const c=C[cid],box=$('#sh .box');if(!c||!box||box.querySelector('[data-ax]'))return;
 const ar=(U.arch||[]).includes(cid),mu=(U.mute||[]).includes(cid);
 box.insertAdjacentHTML('beforeend',`<button data-ax="arch">${ar?'📤 إلغاء الأرشفة':'🗄 أرشف المحادثة'}</button><button data-ax="mute">${mu?'🔔 إلغاء الكتم':'🔕 اكتم الإشعارات'}</button>`)};
['#mn','#ct'].forEach(s=>$(s).addEventListener('click',addMenu));
$('#sh').addEventListener('click',async e=>{const k=e.target.dataset.ax;if(!k||!cid)return;const id=cid,f=k=='arch'?'arch':'mute',on=(U[f]||[]).includes(id);
 try{await upd({[f]:on?FV.arrayRemove(id):FV.arrayUnion(id)})}catch(x){return toast('مقدرتش. انشر القواعد الجديدة')}
 closeSh();toast(k=='arch'?(on?'اتشالت من الأرشيف':'اتأرشفت 🗄'):(on?'الإشعارات رجعت 🔔':'اتكتمت 🔕'));
 if(k=='arch'&&!on)closeChat();setTimeout(renderHome,400)});
/* ---- تثبيت رسالة ---- */
document.head.insertAdjacentHTML('beforeend','<style>#pmb{display:flex;align-items:center;gap:8px;padding:7px 14px;background:var(--p2);border-bottom:1px solid var(--ln);cursor:pointer;font-size:13.5px}#pmb span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#pmb button{color:var(--mu);padding:0 6px}.m.hl{animation:hl 1.5s}@keyframes hl{0%,70%{box-shadow:0 0 0 3px var(--c1)}}</style>');
$('#ms').insertAdjacentHTML('beforebegin','<div id="pmb" hidden></div>');
const canPin=c=>!!c&&(c.type=='p'||c.ad==me.uid);
const hd0=hdr;hdr=function(){hd0();const c=C[cid],p=c&&c.pm,b=$('#pmb');if(!b)return;
 if(!p){b.hidden=true;return}
 b.hidden=false;b.innerHTML=`<b>📌</b><span>${esc(p.n)}: ${esc(p.tx)}</span>${canPin(c)?'<button data-pmx="1">✕</button>':''}`};
const dr=draw;draw=function(){dr();if(!canPin(C[cid]))return;
 document.querySelectorAll('#ms .m').forEach(el=>{const ac=el.querySelector('.ac');ac&&!el.querySelector('.dl')&&!ac.querySelector('[data-a=pn]')&&ac.insertAdjacentHTML('beforeend','<i data-a="pn" title="تثبيت">📌</i>')})};
$('#ms').addEventListener('click',e=>{if(e.target.dataset.a!='pn')return;e.stopPropagation();
 const el=e.target.closest('.m'),m=el&&M[el.dataset.id],c=C[cid];if(!m||!canPin(c))return;
 const tx=(m.im?'📷 صورة':m.au?'🎤 رسالة صوتية':m.tx||'').slice(0,80);sel=null;
 db.doc('chats/'+cid).update({pm:{id:el.dataset.id,tx,n:m.n||''}}).then(()=>toast('اتثبتت 📌')).catch(()=>toast('مقدرتش أثبّت. انشر القواعد الجديدة'));draw()},true);
$('#pmb').onclick=e=>{const c=C[cid];if(!c||!c.pm)return;
 if(e.target.dataset.pmx){db.doc('chats/'+cid).update({pm:FV.delete()}).catch(()=>toast('مقدرتش'));return}
 const el=document.querySelector(`#ms .m[data-id="${CSS.escape(c.pm.id)}"]`);
 if(!el)return toast('الرسالة قديمة ومش في آخر 100 رسالة');
 el.scrollIntoView({block:'center'});el.classList.add('hl');setTimeout(()=>el.classList.remove('hl'),1600)};
})();
