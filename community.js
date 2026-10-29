/* The Squad — المجتمعات: إنشاء، استكشاف، انضمام ومغادرة، أعضاء، غرف. المحادثة خاصة بأعضائها، والعرض العام في collection اسمه communities */
const CATS=['ألعاب','تقنية','رياضة','تعليم','عام'];let COM={},cf='',cq='';
const vf0=viewFind;viewFind=function(){vf0();$('#oth').insertAdjacentHTML('beforeend',`<div class="up-h"><h4>🌐 المجتمعات</h4></div><div class="box2"><input id="cmn" maxlength="40" placeholder="اسم المجتمع"><input id="cmd" maxlength="80" placeholder="وصف قصير"><select id="cmc" style="padding:12px;border-radius:14px;background:#0a0f2c;color:#eef1ff;border:1px solid var(--ln)">${CATS.map(c=>`<option>${c}</option>`).join('')}</select><button class="pri" data-cm="new">إنشاء مجتمع عام</button></div><input id="cms" placeholder="ابحث في المجتمعات..."><div class="row">${['',...CATS].map(c=>`<button data-cm="f" data-c="${c}">${c||'الكل'}</button>`).join('')}</div><div id="cml"></div>`);
 $('#cms').oninput=e=>{cq=e.target.value.trim().toLowerCase();cRender()};loadComm()};
async function loadComm(){const s=await db.collection('communities').limit(80).get().catch(()=>null),el=$('#cml');if(!s)return el&&(el.innerHTML='<p class="mu">مقدرتش أحمّل المجتمعات. اتأكد إن القواعد الجديدة اتنشرت</p>');
 COM={};s.forEach(d=>COM[d.id]={id:d.id,...d.data()});cRender()}
const cmCard=(c,room)=>{const m=!!C[c.id],own=c.ad==me.uid,b=(k,t,p)=>`<button data-cm="${k}" data-id="${c.id}"${p?' class="pri"':''}>${t}</button>`;
 return `<div><div class="wi"><u class="av" style="--h:${hue(c.id)}">${esc([...c.nm][0]||'؟')}</u><div><b>${esc(c.nm)}</b><span>${esc(c.cat||'عام')} · ${c.mc||1} عضو${c.ds?' · '+esc(c.ds):''}</span></div></div><div class="row" style="padding:0 8px 8px">${m?b('open','فتح',1)+b('mem','👥 الأعضاء')+(room?'':b('rooms','💬 الغرف'))+(own?(room?'':b('addroom','➕ غرفة'))+b('unpub','🚫 إلغاء النشر'):b('leave','🚪 غادر')):b('join','انضم',1)}</div></div>`};
function cRender(){const el=$('#cml');if(!el)return;const q=cq,l=Object.values(COM).filter(c=>!c.par&&(!cf||c.cat==cf)&&(!q||c.nm.toLowerCase().includes(q))).sort((a,b)=>(b.mc||0)-(a.mc||0));
 el.innerHTML=l.map(c=>cmCard(c)).join('')||'<p class="mu">مفيش مجتمعات هنا لسه. اعمل أول واحد 🙂</p>'}
async function mkCom(n,cat,ds,par){const id=Math.random().toString(36).slice(2,10);
 await db.doc('chats/'+id).set({type:'g',nm:n,ad:me.uid,members:[me.uid],names:{[me.uid]:nm()},seen:{},un:{},lt:FV.serverTimestamp(),last:null});
 const o={nm:n,cat,ds,ad:me.uid,mc:1};par&&(o.par=par);await db.doc('communities/'+id).set(o);return id}
document.addEventListener('click',async e=>{const d=e.target.dataset,k=d&&d.cm;if(!k)return;const id=d.id,c=COM[id];
 if(k=='f'){cf=d.c;cRender()}
 if(k=='new'){const n=$('#cmn').value.trim();if(!n)return toast('اكتب اسم المجتمع');try{const i=await mkCom(n,$('#cmc').value,$('#cmd').value.trim());go('home');openChat(i)}catch(x){toast('مقدرتش أعمل المجتمع. اتأكد إن القواعد اتنشرت')}}
 if(k=='join'){try{await db.doc('chats/'+id).update({members:FV.arrayUnion(me.uid),['names.'+me.uid]:nm()});db.doc('communities/'+id).update({mc:FV.increment(1)}).catch(()=>{});closeSh();go('home');openChat(id)}catch(x){toast('مقدرتش أنضم')}}
 if(k=='open'){closeSh();go('home');openChat(id)}
 if(k=='mem'){const m=C[id];m&&sheet('<h3>👥 أعضاء '+esc(m.nm)+' ('+m.members.length+')</h3>'+m.members.map(u=>`<div class="row"><span>${esc((m.names||{})[u]||'؟')}${u==m.ad?' 👑':''}${u==me.uid?' (أنت)':''}</span></div>`).join(''))}
 if(k=='rooms'){const r=Object.values(COM).filter(x=>x.par==id);sheet('<h3>💬 غرف '+esc(c?c.nm:'')+'</h3>'+(r.map(x=>cmCard(x,1)).join('')||'<p class="mu">مفيش غرف لسه</p>'))}
 if(k=='addroom')sheet(`<h3>➕ غرفة جديدة في ${esc(c.nm)}</h3><input id="rmn" maxlength="40" placeholder="اسم الغرفة"><button class="pri" data-cm="mkroom" data-id="${id}">إنشاء</button>`);
 if(k=='mkroom'){const n=$('#rmn').value.trim();if(!n)return;try{const i=await mkCom(n,c.cat,'',id);closeSh();await loadComm();go('home');openChat(i)}catch(x){toast('مقدرتش أعمل الغرفة')}}
 if(k=='leave'){if(!confirm('تغادر المجتمع؟'))return;try{await db.doc('chats/'+id).update({members:FV.arrayRemove(me.uid),['names.'+me.uid]:FV.delete()});db.doc('communities/'+id).update({mc:FV.increment(-1)}).catch(()=>{});closeSh();toast('غادرت المجتمع');cid==id&&closeChat();loadComm()}catch(x){toast('مقدرتش أغادر')}}
 if(k=='unpub'){if(!confirm('تشيل المجتمع من الاستكشاف؟ المحادثة هتفضل لأعضائها.'))return;await db.doc('communities/'+id).delete().then(()=>{closeSh();loadComm()}).catch(()=>toast('مقدرتش'))}});
