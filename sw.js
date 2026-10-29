/* الشبكة أولاً والكاش احتياطي. غيّر رقم النسخة لما ترفع تحديث */
const C='squad-v34',F=['./','index.html','squad.css','app.js','stories.js','calls.js','cafe.js','extras.js','games.js','channel.js','cafe2.js','community.js','plus.js','bot.js','cafe3.js','theme.js','look.js','chatx.js','settings.js','ads.js','accounts.js','acct.js','auth.js','auth.css','ui2.js','ui2.css','v27.css','profile.js','world.js','district-core.js','district.js','cinema.js','time.js','welcome.js','luxe.js','luxe.css','gold.css','push.js','firebase-config.js','icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','badge-96.png','manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!='GET'||new URL(e.request.url).origin!=location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});

/* إشعارات الموبايل (من الـ Worker عبر FCM). بتتخطى لو التطبيق مفتوح قدامك */
self.addEventListener('push',e=>{let j={};try{j=e.data.json()}catch(x){}const d=j.data||j;if(!d.title)return;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{if(cs.some(c=>c.visibilityState=='visible'&&c.focused))return;
  return self.registration.showNotification(d.title,{body:d.body||'',icon:'icon-192.png',badge:'badge-96.png',tag:d.cid||'squad',renotify:true,vibrate:d.kind=='call'?[300,150,300,150,300]:[120],requireInteraction:d.kind=='call',data:{cid:d.cid}})}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const cid=(e.notification.data||{}).cid;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{const c=cs[0];if(c){cid&&c.postMessage({cid});return c.focus()}return self.clients.openWindow('./'+(cid?'?c='+cid:''))}))});
