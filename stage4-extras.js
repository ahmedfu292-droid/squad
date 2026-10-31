/* The Squad v98 — social chat utilities + assistant launchers. Existing chat engines remain authoritative. */
(()=>{'use strict';
 const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const meSafe=()=>typeof me!=='undefined'&&me&&typeof db!=='undefined'&&typeof FV!=='undefined';
 const openDialog=(html)=>window.SquadOpenModal?window.SquadOpenModal(html):null;
 function assistantTiles(){const host=$('.dr-message-list');if(!host||host.querySelector('.s4-assistants'))return;const n=document.createElement('section');n.className='s4-assistants';n.innerHTML=`<div class="s4-assist-head"><b>مساعدوك</b><small>اختار المساعد المناسب</small></div><div class="s4-assist-grid"><button data-s4-assistant="gen"><span>✦</span><b>مساعد The Squad</b><small>مساعدة عامة وتنظيم وأفكار</small></button><button data-s4-assistant="game"><span>🎮</span><b>مساعد الألعاب</b><small>ترشيحات ونصائح واختبارات</small></button></div>`;host.prepend(n)}
 function decorate(){assistantTiles();}
 const mo=new MutationObserver(decorate);mo.observe(document.body,{childList:true,subtree:true});decorate();
 document.addEventListener('click',async e=>{
  const a=e.target.closest('[data-s4-assistant]');if(a){if(typeof window.SquadOpenAssistant==='function')window.SquadOpenAssistant(a.dataset.s4Assistant);else window.toast&&toast('المساعد لسه بيحمّل');return}
  const m=e.target.closest('[data-s4-menu]');if(!m)return;e.preventDefault();e.stopPropagation();
  if(!meSafe())return window.toast&&toast('سجّل الدخول الأول');
  const id=m.dataset.s4Menu,c=(typeof C!=='undefined'&&C[id])||{},arch=(U.arch||[]).includes(id),mute=(U.mute||[]).includes(id),pin=(U.pin||[]).includes(id)||(U.pins||[]).includes(id),hidden=(U.hiddenChats||[]).includes(id);
  const title=c.type==='g'?(c.nm||'الجروب'):((c.names||{})[(c.members||[]).find(x=>x!==me.uid)]||'المحادثة');
  const modal=openDialog(`<h3>إدارة المحادثة</h3><p>${esc(title)}</p><div class="s4-manage-actions"><button data-s4-do="pin" data-id="${esc(id)}">${pin?'إلغاء التثبيت':'تثبيت المحادثة'} 📌</button><button data-s4-do="mute" data-id="${esc(id)}">${mute?'إلغاء الكتم':'كتم الإشعارات'} 🔕</button><button data-s4-do="arch" data-id="${esc(id)}">${arch?'إلغاء الأرشفة':'نقل للأرشيف'} 🗄</button><button data-s4-do="hide" data-id="${esc(id)}">${hidden?'إظهار المحادثة':'حذف المحادثة من عندي'} ${hidden?'↩':'🗑'}</button></div><button class="dr-secondary" data-close-modal>إغلاق</button>`);
  if(!modal)return;
  modal.querySelectorAll('[data-s4-do]').forEach(b=>b.addEventListener('click',async()=>{const k=b.dataset.s4Do,field=k==='pin'?'pins':k==='mute'?'mute':'arch',on=(U[field]||[]).includes(id);try{if(k==='hide'){const isHidden=(U.hiddenChats||[]).includes(id);await db.doc('users/'+me.uid).update({hiddenChats:isHidden?FV.arrayRemove(id):FV.arrayUnion(id)});if(!isHidden&&typeof closeChat==='function'&&typeof cid!=='undefined'&&cid===id)closeChat();modal.hidden=true;window.toast&&toast(isHidden?'تم إظهار المحادثة':'اتشالت المحادثة من قائمتك فقط؛ الرسائل لم تُحذف');if(typeof drRender==='function'&&typeof drRoute!=='undefined'&&drRoute==='messages')drRender();return}await db.doc('users/'+me.uid).update({[field]:on?FV.arrayRemove(id):FV.arrayUnion(id)});if(k==='arch'&&!on&&typeof closeChat==='function'&&typeof cid!=='undefined'&&cid===id)closeChat();modal.hidden=true;window.toast&&toast(k==='pin'?(on?'اتلغى التثبيت':'اتثبتت المحادثة'):k==='mute'?(on?'الإشعارات رجعت':'تم كتم الإشعارات'):(on?'اتشالت من الأرشيف':'اتنقلت للأرشيف'));if(typeof drRender==='function'&&typeof drRoute!=='undefined'&&drRoute==='messages')drRender();}catch(err){window.toast&&toast('تعذر تحديث المحادثة. راجع صلاحيات الحساب وقواعد Firestore')}}));
 });
})();
