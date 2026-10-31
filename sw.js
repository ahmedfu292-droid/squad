/* The Squad v109: كاش أسرع مع تحديث آمن للملفات الثابتة.
   صفحات HTML وملف الإصدار: الشبكة أولاً.
   ملفات CSS/JS/الأيقونات والنماذج: الكاش أولاً بعد التثبيت.
   ملفات المعاينة محفوظة بالمشروع لكنها ليست ضمن التحميل المسبق. */
const C='squad-v117-luxury-fleet-city';
const F=[
 './','index.html','manifest.json','version.json','services-hub.html','stage4-chat-ui.js','stage4-chat-ui.css','stage4-extras.js','stage4-extras.css','tokens.css','squad.css','app.js','social-feed.js','stories.js','calls.js',
 'cafe.js','extras.js','games.js','channel.js','cafe2.js','community.js','plus.js','bot.js','cafe3.js',
 'theme.js','look.js','chatx.js','settings.js','ads.js','accounts.js','acct.js','auth.js','auth.css',
 'auth-scene.js','ui2.js','ui2.css','v27.css','premium-refinement-v89.css','profile.js',
 'cinema.js','time.js','welcome.js','luxe.js','luxe.css','gold.css','push.js','firebase-config.js',
 'icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','badge-96.png',
 'manifest.json','living-palace.css','living-palace-premium.css','living-palace.js',
 'living-palace-engine.js','living-palace-worker.js','version.json'
];
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const c=await caches.open(C);
 // فشل تحميل ملف اختياري واحد لا يمنع تثبيت بقية الكاش.
 await Promise.allSettled(F.map(async p=>{try{const r=await fetch(p,{cache:'reload'});if(r.ok)await c.put(p,r)}catch(_){}}));
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('squad-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const q=e.request;
 if(q.method!=='GET')return;
 const u=new URL(q.url);
 if(u.origin!==self.location.origin)return;
 const isPage=q.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname==='/'||u.pathname.endsWith('/');
 if(isPage||u.pathname.endsWith('/version.json')||u.pathname==='/version.json'){
  e.respondWith(fetch(q).then(r=>{if(r.ok){const copy=r.clone();caches.open(C).then(c=>c.put(q,copy))}return r}).catch(()=>caches.match(q).then(r=>r||caches.match('index.html').then(x=>x||caches.match('./').then(y=>y||caches.match('/index.html'))))));
  return;
 }
 e.respondWith(caches.match(q).then(hit=>{
  if(hit){fetch(q).then(r=>{if(r.ok)caches.open(C).then(c=>c.put(q,r))}).catch(()=>{});return hit}
  return fetch(q).then(r=>{if(r.ok){const copy=r.clone();caches.open(C).then(c=>c.put(q,copy))}return r});
 }));
});

/* إشعارات الموبايل (من الـ Worker عبر FCM). بتتخطى لو التطبيق مفتوح قدامك */
self.addEventListener('push',e=>{let j={};try{j=e.data.json()}catch(x){}const d=j.data||j;if(!d.title)return;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{if(cs.some(c=>c.visibilityState=='visible'&&c.focused))return;
  return self.registration.showNotification(d.title,{body:d.body||'',icon:'icon-192.png',badge:'badge-96.png',tag:d.cid||'squad',renotify:true,vibrate:d.kind=='call'?[300,150,300,150,300]:[120],requireInteraction:d.kind=='call',data:{cid:d.cid}})}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const cid=(e.notification.data||{}).cid;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{const c=cs[0];if(c){cid&&c.postMessage({cid});return c.focus()}return self.clients.openWindow('./'+(cid?'?c='+cid:''))}))});

/* v113: fallback ثابت لصفحة التطبيق عند فتح الأيقونة دون اتصال. */
