/* The Squad — المظهر: تلقائي / داكن / فاتح. بيتحمّل بعد plus.js. التطبيق الأساسي ما اتغيّرش */
(()=>{
const root=document.documentElement,mq=matchMedia('(prefers-color-scheme: light)');
const pref=()=>localStorage.theme||'dark',eff=()=>pref()=='auto'?(mq.matches?'light':'dark'):pref();
function apply(){const e=eff();root.dataset.theme=e;root.style.colorScheme=e;
 document.querySelectorAll('meta[name=theme-color]').forEach(m=>m.content=e=='light'?'#f6f1e4':'#050505');
 document.querySelectorAll('meta[name=color-scheme]').forEach(m=>m.content=e);
 const b=document.getElementById('thm');b&&(b.textContent=e=='light'?'🌙':'☀️')}
function setTheme(t){try{localStorage.theme=t}catch(e){}apply();typeof tab!='undefined'&&tab=='me'&&viewMe()}
mq.addEventListener&&mq.addEventListener('change',()=>pref()=='auto'&&apply());
$('#gear').insertAdjacentHTML('afterend','<button id="thm" class="ic" title="الوضع الفاتح / الداكن"></button>');
$('#thm').onclick=()=>setTheme(eff()=='light'?'dark':'light');
/* اختيار المظهر في تبويب حسابي */
/* بيرجّع HTML اختيار المظهر. شاشة الإعدادات (settings.js) هي اللي بتعرضه */
window.themeHtml=function(){const p=pref();
 return `<div class="box2"><h3>🎨 المظهر</h3><div class="thm">${[['auto','تلقائي'],['dark','داكن'],['light','فاتح']].map(([k,t])=>`<button data-th="${k}" class="${p==k?'on':''}">${t}</button>`).join('')}</div><p class="thm-t">«تلقائي» بيمشي على إعداد جهازك.</p></div>`};
$('#oth').addEventListener('click',e=>{const t=e.target.dataset.th;t&&setTheme(t)});
apply();
})();
