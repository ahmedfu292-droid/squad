/* The Squad — إضافات: شاشة الدخول (ميل 3D + قوة كلمة السر + هزّة الخطأ + تذكير الرقم)، بحث وتمييز الرسايل، روابط، تحويل منشورات القنوات ورابطها، ستيكرز الحالات */
document.head.insertAdjacentHTML('beforeend',`<style>
#auth .card{transition:transform .15s ease-out}#auth .card.shake{animation:shk .4s}@keyframes shk{20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
#pws{height:5px;border-radius:5px;background:#ffffff14;overflow:hidden;margin-top:6px}#pws i{display:block;height:100%;width:0;transition:width .25s,background .25s}
.mc{padding:8px;border-bottom:1px solid #ffffff14}#msres{max-height:50vh;overflow:auto}
@media(prefers-reduced-motion:reduce){#auth .card.shake{animation:none}}</style>`);
/* دخول */
const card=$('#auth .card'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!reduce&&matchMedia('(pointer:fine)').matches){$('#auth').addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`});$('#auth').addEventListener('pointerleave',()=>card.style.transform='')}
$('#pw').closest('.row').insertAdjacentHTML('afterend','<div id="pws"><i></i></div>');
$('#pw').addEventListener('input',e=>{const p=e.target.value,s=Math.min(4,(p.length>=6)+(p.length>=10)+(/[A-Za-z]/.test(p)&&/\d/.test(p))+(/[^A-Za-z0-9]/.test(p))),i=$('#pws i');i.style.width=(mode=='up'?s*25:0)+'%';i.style.background=['#ff4f6e','#ff4f6e','#ffb703','#3fe0ff','#1fcf7a'][s]});
new MutationObserver(()=>{if($('#aerr').textContent){card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake')}}).observe($('#aerr'),{childList:true,characterData:true,subtree:true});
const su0=signup;signup=async function(...a){await su0(...a);localStorage.newacc=a[0]};
setInterval(()=>{const n=localStorage.newacc;if(n&&me&&U.sid&&!$('#app').hidden){localStorage.removeItem('newacc');
 sheet(`<h3>🎉 أهلاً بيك في The Squad</h3><p class="mu">رقمك هو</p><h2 style="letter-spacing:4px">${esc(n)}</h2><p class="mu">مفيش إيميل ولا تليفون مربوط بالحساب، فلو نسيت الرقم أو كلمة السر مش هنقدر نرجّع حسابك. احفظهم دلوقتي.</p><button class="pri" data-cpn="${esc(n)}">📋 انسخ الرقم</button>`)}},1500);
$('#sh').addEventListener('click',e=>{const n=e.target.dataset.cpn;n&&navigator.clipboard.writeText(n).then(()=>toast('اتنسخ ✅'))});
/* الشات: روابط + تمييز ⭐ + بحث */
let ST2=[];try{ST2=JSON.parse(localStorage.stars||'[]')}catch(e){}
const isSt=id=>ST2.includes(cid+'|'+id);
const draw2=draw;draw=function(){draw2();document.querySelectorAll('#ms .m').forEach(el=>{const ac=el.querySelector('.ac');ac&&!ac.querySelector('[data-a=st]')&&ac.insertAdjacentHTML('beforeend',`<i data-a="st" title="تمييز">${isSt(el.dataset.id)?'⭐':'☆'}</i>`);
 const p=el.querySelector(':scope>p');p&&!p.dataset.l&&(p.dataset.l=1,p.innerHTML=p.innerHTML.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#7ff6ff">$1</a>'))})};
$('#ms').addEventListener('click',e=>{if(e.target.dataset.a!='st')return;const el=e.target.closest('.m'),k=cid+'|'+el.dataset.id;ST2=isSt(el.dataset.id)?ST2.filter(x=>x!=k):[...ST2,k].slice(-300);localStorage.stars=JSON.stringify(ST2)},true);
$('#cla').insertAdjacentHTML('beforebegin','<button id="msr" class="ic" title="بحث في المحادثة">🔍</button>');
function msr(){const q=($('#msq')||{value:''}).value.trim().toLowerCase(),st=$('#mst')&&$('#mst').checked,l=Object.entries(M).filter(([id,m])=>m.tx&&!m.del&&(!q||m.tx.toLowerCase().includes(q))&&(!st||isSt(id))).reverse().slice(0,40);
 $('#msres').innerHTML=l.map(([id,m])=>`<div class="mc"><b>${esc(m.n||'')}</b> ${isSt(id)?'⭐':''}<p>${esc(m.tx)}</p><small>${m.t?fmt(m.t):''}</small></div>`).join('')||'<p class="mu">مفيش نتايج في آخر 100 رسالة</p>'}
$('#msr').onclick=()=>{if(!cid)return;sheet('<h3>🔍 بحث في المحادثة</h3><input id="msq" placeholder="اكتب كلمة..."><label><input type="checkbox" id="mst"> ⭐ المميزة بس</label><div id="msres"></div>');$('#msq').oninput=$('#mst').onchange=msr;msr()};
/* القنوات: تحويل منشور لمحادثة + فتح بالرابط */
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('[data-fp]');if(!a)return;const t=a.dataset.fp;if(!t)return toast('تحويل المنشورات النصية بس');
 $('#chv').insertAdjacentHTML('beforeend',`<div id="fwp" style="position:absolute;inset:0;background:#050816f2;overflow:auto;padding:14px;z-index:5"><h3>↪️ حوّل لـ</h3>${Object.values(C).map(c=>`<button data-fc="${c.id}">${esc(cname(c))}</button>`).join('')}<button id="fwx">إلغاء</button></div>`);
 $('#fwp').onclick=async ev=>{if(ev.target.id=='fwx')return $('#fwp').remove();const c=ev.target.dataset.fc;if(!c)return;const o=cid;cid=c;await send({tx:t.slice(0,2000),fw:true});cid=o;$('#fwp').remove();toast('اتحوّل ✅')}});
const ch0=new URLSearchParams(location.search).get('ch');if(ch0){let n=0;const t=setInterval(()=>{if(typeof CH!='undefined'&&CH[ch0]&&me){clearInterval(t);openCh(ch0);history.replaceState(0,'',location.pathname)}else if(++n>40)clearInterval(t)},500)}
/* الحالات: صف ستيكرز إيموجي بيتضاف للنص */
const ns0=newStory;newStory=function(){ns0();const b=$('#bgs');b&&b.insertAdjacentHTML('beforebegin','<div class="gr" id="stk">'+['🔥','😂','❤️','😎','🎉','💯','🥳','😍','🙏','✨','🎮','🚀'].map(e=>`<i data-st="${e}">${e}</i>`).join('')+'</div>');
 $('#stk').onclick=e=>{const s=e.target.dataset.st;s&&($('#stx').value+=s)}};
