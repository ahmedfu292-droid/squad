/* The Squad — القنوات زي واتساب: بتظهر في تبويب التحديثات وتتفتح كشاشة كاملة فيها المنشورات والمتابعة، والمالك ينشر منها */
document.head.insertAdjacentHTML('beforeend',`<style>
#chv{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:#050816;color:#eef1ff}
#chv header{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0b1236;border-bottom:1px solid #ffffff14}
#chv header>div{flex:1;min-width:0}#chv header small{display:block;color:#8d9ad8}
#chf{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
#chf .cp{align-self:flex-start;max-width:min(560px,92%);background:#ffffff0f;border:1px solid #ffffff17;border-radius:18px 18px 18px 6px;padding:10px 12px}
#chf .cp img{max-width:100%;border-radius:12px;display:block;margin-bottom:6px}#chf .cp p{margin:0;white-space:pre-wrap;word-break:break-word}
#chf .cp small{color:#8d9ad8;display:block;margin-top:4px}
#chv footer{display:flex;gap:8px;align-items:flex-end;padding:10px;background:#0b1236;border-top:1px solid #ffffff14}
#chv footer textarea{flex:1;border-radius:16px;padding:10px;background:#ffffff0f;color:#eef1ff;border:1px solid #ffffff1f}
#chv footer .ro{flex:1;text-align:center;color:#8d9ad8}
</style>`);
let unC2=null,chId=null,chIm=null;
function openCh(id){const c=CH[id];if(!c)return toast('القناة لسه بتتحمّل، جرّب تاني');chId=id;chIm=null;unC2&&unC2();
 let v=$('#chv');v||(document.body.insertAdjacentHTML('beforeend','<div id="chv"></div>'),v=$('#chv'));v.hidden=false;
 const own=c.o==me.uid;
 v.innerHTML=`<header><button class="ic" id="chb">${ic('back')}</button><u class="av" style="--h:${hue(id)}">${esc([...c.nm][0]||'؟')}</u><div><b id="chnm">${esc(c.nm)}${VFB(c)}</b><small id="chn"></small></div><button class="ic" id="chsh" title="مشاركة">🔗</button>${own?'':'<button id="chfo"></button>'}</header>
 <div id="chf"></div>
 <footer>${own?'<button class="ic" id="chi">🖼</button><textarea id="chx" rows="1" maxlength="1500" placeholder="اكتب منشور للمتابعين..."></textarea><button class="ic pri" id="chs">'+ic('send')+'</button>':'<span class="ro">القناة للقراءة فقط · '+esc(c.ds||'')+'</span>'}</footer><input type="file" id="chfi" accept="image/*" hidden>`;
 $('#chb').onclick=chClose;$('#chsh').onclick=()=>{navigator.clipboard.writeText(location.origin+location.pathname+'?ch='+id);toast('اتنسخ رابط القناة ✅')};
 const info=()=>{const k=CH[id]||c,f=(U.follow||[]).includes(id);$('#chn').textContent=(k.fc||0)+' متابع';const nb=$('#chnm');nb&&(nb.innerHTML=esc(k.nm)+VFB(k));const b=$('#chfo');b&&(b.textContent=f?'متابَع ✓':'تابع',b.className=f?'':'pri')};info();
 const fo=$('#chfo');fo&&(fo.onclick=()=>{const f=(U.follow||[]).includes(id);toggleFollow(id).then(()=>setTimeout(info,500)).catch(()=>toast('مقدرتش. اتأكد إن القواعد الجديدة اتنشرت'))});
 unC2=db.collection(`channels/${id}/posts`).orderBy('t','desc').limit(50).onSnapshot(s=>{const f=$('#chf');if(!f)return;
  f.innerHTML=s.docs.reverse().map(d=>{const p=d.data();return `<div class="cp">${p.im?`<img src="${esc(p.im)}">`:''}${p.tx?`<p>${esc(p.tx)}</p>`:''}<small>${p.t?fmt(p.t):'⏳'} · <a data-fp="${esc(p.tx||'')}">↪️</a>${own?` · <a data-dp="${d.id}">🗑</a>`:''}</small></div>`}).join('')||'<p class="mu" style="text-align:center">لسه مفيش منشورات</p>';f.scrollTop=1e9;info()},()=>toast('مقدرتش أحمّل المنشورات'));
 $('#chf').onclick=e=>{const d=e.target.dataset.dp;d&&confirm('تمسح المنشور؟')&&db.doc(`channels/${id}/posts/${d}`).delete().catch(()=>toast('مقدرتش أمسح'))};
 if(own){$('#chi').onclick=()=>$('#chfi').click();$('#chfi').onchange=e=>{const f=e.target.files[0];f&&shrink(f,900,d=>{chIm=d;$('#chi').textContent='✅'})};
  $('#chs').onclick=async()=>{const t=$('#chx').value.trim();if(!t&&!chIm)return;const o={t:FV.serverTimestamp()};t&&(o.tx=t);chIm&&(o.im=chIm);
   await db.collection(`channels/${id}/posts`).add(o).then(()=>{$('#chx').value='';chIm=null;$('#chi').textContent='🖼'}).catch(()=>toast('مقدرتش أنشر. اتأكد إن القواعد اتنشرت'))}}}
function chClose(){unC2&&unC2();unC2=null;chId=null;const v=$('#chv');v&&(v.hidden=true,v.innerHTML='')}
auth.onAuthStateChanged(u=>u||chClose());
/* القنوات بتظهر في تبويب التحديثات بس (زي واتساب). اتشالت من قايمة المحادثات */
