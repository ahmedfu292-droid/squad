/* The Squad v29b — زر تثبيت التطبيق + صوت ترحيب بالإنجليزي كل ما تفتح الموقع. */
(()=>{
let dp=null;const IOS=/iPad|iPhone|iPod/.test(navigator.userAgent),STAND=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
function btn(){if(STAND||document.getElementById('wins'))return;const h=document.querySelector('#side>header');if(!h)return;h.insertAdjacentHTML('afterbegin','<button id="wins" class="ic" title="تثبيت التطبيق" style="font-size:18px">📲</button>');
 document.getElementById('wins').onclick=async()=>{if(dp){dp.prompt();try{await dp.userChoice}catch(e){}dp=null;return}
  await SquadDialog.alert(IOS?'على الآيفون: افتح الموقع في Safari، اضغط زر المشاركة، ثم «إضافة إلى الشاشة الرئيسية».':'لو مفيش نافذة تثبيت: افتح قائمة المتصفح (⋮) واختار «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».')}}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;btn()});addEventListener('appinstalled',()=>{const b=document.getElementById('wins');b&&b.remove()});
/* الترحيب الصوتي */
let said=0,pend=null;const nameNow=()=>{try{return (typeof U!='undefined'&&U&&U.name)||(typeof me!='undefined'&&me&&me.displayName)||''}catch(e){return ''}};const SS=window.speechSynthesis;
function say(name){if(!SS||said)return;const q=[];const latin=/[A-Za-z]/.test(name||'')&&!/[\u0600-\u06FF]/.test(name||'');
 const mk=(t,l)=>{const u=new SpeechSynthesisUtterance(t);u.lang=l;u.rate=.95;const v=(SS.getVoices()||[]).find(x=>x.lang&&x.lang.toLowerCase().startsWith(l.slice(0,2).toLowerCase()));if(v)u.voice=v;return u};
 q.push(mk('Hello','en-US'));if(name)q.push(mk(name,latin?'en-US':'ar-EG'));q.push(mk('Welcome to The Squad, by the developer Ahmed Fouad.','en-US'));
 try{SS.cancel();q.forEach(u=>SS.speak(u));said=1}catch(e){}}
function tryWelcome(){const n=nameNow();say(n);
 setTimeout(()=>{if(SS&&(SS.speaking||SS.pending))return;/* المتصفح منع الصوت من غير لمسة: هنقولها أول ما تلمس الشاشة */
  said=0;if(!pend){pend=()=>{document.removeEventListener('pointerdown',pend,true);pend=null;const n2=nameNow();say(n2)};document.addEventListener('pointerdown',pend,true)}},1500)}
let tries=0;const iv=setInterval(()=>{btn();tries++;if(typeof me!='undefined'&&me&&me.uid&&typeof U!='undefined'&&(U.name||tries>40)){clearInterval(iv);setTimeout(tryWelcome,600)}else if(tries>240)clearInterval(iv)},500);
window.SQWELCOME={say:()=>{said=0;tryWelcome()}};
})();
