/* The Squad — سجل المكالمات (محفوظ على الجهاز) + معرض صور المحادثة + تبويب المكالمات في الشريط */
let CL=[];try{CL=JSON.parse(localStorage.clog||'[]')}catch(e){}
const svL2=()=>{try{localStorage.clog=JSON.stringify(CL.slice(0,50))}catch(e){}};
const enter0=enter;enter=async function(id,mic,call){
 CL.unshift({id,n:call.g?call.gn:(call.from==me.uid?(C[call.cid]?cname(C[call.cid]):'مكالمة'):call.fn),cid:call.cid,v:!!call.vid,g:!!call.g,o:call.from==me.uid,t:Date.now(),d:0});svL2();return enter0(id,mic,call)};
const leave0=leave;leave=function(q){const c=CALL;leave0(q);if(c){const e=CL.find(x=>x.id==c.id);e&&(e.d=(Date.now()-c.t0)/1000|0,svL2());tab=='calls'&&viewCalls()}};
const decline0=decline;decline=function(c){CL.unshift({id:c.id,n:c.g?c.gn:c.fn,cid:c.cid,v:!!c.vid,g:!!c.g,o:false,x:1,t:Date.now(),d:0});svL2();decline0(c)};
const go0=go;go=function(t){if(t!='calls')return go0(t);tab='calls';document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go=='calls'));$('#home').hidden=true;$('#oth').hidden=false;viewCalls()};
function viewCalls(){const f=s=>s>=60?(s/60|0)+' د':s+' ث';
 $('#oth').innerHTML='<div class="up-h"><h4>سجل المكالمات (على الجهاز ده)</h4></div>'+(CL.map((e,i)=>`<div class="wi" data-cl="${i}"><u class="av" style="--h:${hue(e.cid||e.id)}">${esc([...e.n][0]||'؟')}</u><div><b>${esc(e.n)}</b><span>${e.x?'❌ مرفوضة':e.o?'📤 صادرة':'📥 واردة'} · ${e.v?'فيديو':'صوت'}${e.g?' · جماعية':''}${e.d?' · '+f(e.d):''} · ${ago({toMillis:()=>e.t})}</span></div><button class="pri">فتح</button></div>`).join('')||'<p class="es">مفيش مكالمات لسه.<br>افتح محادثة واضغط أيقونة التليفون.</p>')}
$('#oth').addEventListener('click',e=>{const w=e.target.closest('[data-cl]');if(tab!='calls'||!w)return;const c=CL[w.dataset.cl];if(c&&C[c.cid]){go('home');openChat(c.cid)}else toast('المحادثة دي مش موجودة')});
document.querySelector('#nav [data-go=up]').insertAdjacentHTML('beforebegin','<button data-go="calls"><i></i>المكالمات</button>');
document.querySelector('#nav [data-go=calls] i').innerHTML=ic('phone');
/* المعرض: صور المحادثة المفتوحة */
$('#cla').insertAdjacentHTML('beforebegin','<button id="gal" class="ic" title="المعرض">🖼</button>');
$('#gal').onclick=()=>{const im=Object.values(M).filter(m=>m.im&&!m.del);
 sheet('<h3>🖼 معرض المحادثة</h3>'+(im.length?'<div class="gr">'+im.map(m=>`<img src="${esc(m.im)}" data-gi="1" style="width:100%;border-radius:10px">`).join('')+'</div>':'<p class="mu">مفيش صور في آخر 100 رسالة</p>'))};
$('#sh').addEventListener('click',e=>{if(e.target.dataset.gi)sheet(`<img class="full" src="${esc(e.target.src)}">`)});
