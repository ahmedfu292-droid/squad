/* The Squad — شكل المحادثة: خلفية (جاهزة أو صورة من جهازك) ولون فقاعاتك. بيتحفظ على جهازك بس. بيتحمّل بعد theme.js */
(()=>{
const WP=[['hex','الافتراضي',null,null],
 ['n1','ليل','linear-gradient(160deg,#0b1030,#1b1340)','linear-gradient(160deg,#dfe6ff,#eadfff)'],
 ['n2','محيط','linear-gradient(160deg,#04283a,#0b4f6c)','linear-gradient(160deg,#d6f1fb,#c4e6f5)'],
 ['n3','غروب','linear-gradient(160deg,#2a0f3a,#7a2a5a)','linear-gradient(160deg,#ffe3ee,#f3d9ff)'],
 ['n4','غابة','linear-gradient(160deg,#08241c,#14532d)','linear-gradient(160deg,#dcf5e6,#c9ecd7)'],
 ['pl','سادة','linear-gradient(#0b111f,#0b111f)','linear-gradient(#e6ebf4,#e6ebf4)']];
const BB=[['def','افتراضي',null],['b1','بنفسجي','linear-gradient(135deg,#6d28d9,#4338ca)'],['b2','أخضر','linear-gradient(135deg,#059669,#047857)'],
 ['b3','وردي','linear-gradient(135deg,#db2777,#9d174d)'],['b4','برتقالي','linear-gradient(135deg,#ea580c,#c2410c)'],['b5','أزرق','linear-gradient(135deg,#2563eb,#1d4ed8)']];
let L={};try{L=JSON.parse(localStorage.look||'{}')}catch(e){}
const save=()=>{try{localStorage.look=JSON.stringify({wp:L.wp,bb:L.bb})}catch(e){}};
const st=document.createElement('style');st.id='lookcss';document.head.append(st);
function apply(){let s='';const w=WP.find(x=>x[0]==L.wp),b=BB.find(x=>x[0]==L.bb),img=localStorage.lookimg;
 if(L.wp=='img'&&img)s+=`.cv{background-image:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),url("${img}")!important;background-size:cover!important;background-position:center!important}html[data-theme=light] .cv{background-image:linear-gradient(rgba(255,255,255,.3),rgba(255,255,255,.3)),url("${img}")!important}`;
 else if(w&&w[2])s+=`.cv{background-image:${w[2]}!important;background-size:cover!important}html[data-theme=light] .cv{background-image:${w[3]}!important}`;
 if(b&&b[2])s+=`.m.me,.bu{background:${b[2]}!important;color:#fff!important;border-color:transparent!important}.m.me q{background:rgba(0,0,0,.25)!important;color:#eef2ff!important}.m.me small{color:#e0f7ff!important}.m.me .tm b.rd{color:#a5f3fc!important}`;
 st.textContent=s}
apply();
/* بيرجّع HTML اختيار الخلفية ولون الرسايل. شاشة الإعدادات (settings.js) هي اللي بتعرضه */
window.lookHtml=function(){const wp=L.wp||'hex',bb=L.bb||'def';
 return `<div class="box2"><h3>🖼 خلفية المحادثة</h3><div class="sw">${WP.map(x=>`<i data-wp="${x[0]}" class="${wp==x[0]?'on':''}" style="${x[2]?'background:'+x[2]:'background:var(--p3);color:var(--tx)'}">${x[1]}</i>`).join('')}<i data-wp="pick" class="${wp=='img'?'on':''}" style="background:var(--p3);color:var(--tx)">📷 صورتي</i></div><input type="file" id="wpf" accept="image/*" hidden>
 <h3>💬 لون رسايلك</h3><div class="sw">${BB.map(x=>`<i data-bb="${x[0]}" class="${bb==x[0]?'on':''}" style="${x[2]?'background:'+x[2]:'background:var(--p3);color:var(--tx)'}">${x[1]}</i>`).join('')}</div><p class="thm-t">الخلفية ولون الرسايل بيظهروا على جهازك إنت بس.</p></div>`};
$('#oth').addEventListener('click',e=>{const d=e.target.dataset;if(!d)return;
 if(d.wp=='pick')return $('#wpf').click();
 if(d.wp){L.wp=d.wp;save();apply();viewMe()}
 if(d.bb){L.bb=d.bb;save();apply();viewMe()}});
$('#oth').addEventListener('change',e=>{if(e.target.id!='wpf')return;const f=e.target.files[0];if(!f)return;
 shrink(f,1200,d=>{try{localStorage.lookimg=d}catch(x){return toast('الصورة كبيرة على التخزين، جرّب صورة تانية')}L.wp='img';save();apply();viewMe();toast('اتغيّرت الخلفية ✅')})});
})();
