/* The Squad v29b — ساعة السيرفر: بيصحّح Date.now() بفرق ساعة جهازك عن السيرفر (من هيدر Date بتاع موقعك نفسه).
   كده التوقيتات (آخر ظهور، الكتابة، المكالمات، الستوري) تطلع صح حتى لو ساعة الموبايل غلط أو إنت في السعودية/أي بلد.
   عرض الساعة نفسه بيستخدم منطقة جهاز كل واحد، فكل واحد يشوف الوقت بتاعه صح. */
(()=>{if(window.__SQT)return;const real=Date.now.bind(Date);let skew=0;window.__SQT={get skew(){return skew},real};
Date.now=()=>real()+skew;
async function sync(){try{const a=real(),r=await fetch(location.pathname+'?_t='+a,{method:'HEAD',cache:'no-store'}),b=real(),h=r.headers.get('date');if(!h)return;const s=Date.parse(h);if(!isFinite(s))return;skew=Math.round(s+500-(a+b)/2)}catch(e){}}
sync();setInterval(sync,6e5);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});window.__SQT.sync=sync})();
