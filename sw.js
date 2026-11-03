/* The Squad v160: cache only real, verified local entry assets. Other same-origin
   assets are cached on first successful fetch. HTML and release metadata are network-first. */
const C='squad-v187-call-network';
const F=[
  "./",
  "ads.js",
  "app.js",
  "auth.css",
  "auth.js",
  "badge-96.png",
  "community.js",
  "district-core.js",
  "gold.css",
  "living-palace-premium.css",
  "look.js",
  "luxe.js",
  "manifest.json",
  "push.js",
  "squad.css",
  "theme.js",
  "time.js",
  "ui2.js",
  "v27.css",
  "apple-touch-icon.png",
  "assets/design/auth-login-v121.png",
  "auth-scene.js",
  "cafe2.js",
  "district.js",
  "extras.js",
  "living-palace.css",
  "premium-refinement-v89.css",
  "profile.js",
  "stage4-chat-ui.css",
  "stage4-extras.js",
  "stories.js",
  "world.js",
  "accounts.js",
  "acct.js",
  "admin-monitor.css",
  "admin-monitor.js",
  "auth-v121.css",
  "bot.js",
  "cafe.js",
  "cafe3.js",
  "calls.js",
  "chatx.js",
  "icon-192.png",
  "index.html",
  "living-palace-engine.js",
  "luxe.css",
  "performance-v144.css",
  "plus.js",
  "quality-polish-v120.css",
  "services-hub.html",
  "settings.js",
  "social-expansion.css",
  "social-expansion.js",
  "social-feed.js",
  "stage4-chat-ui.js",
  "app-preview.html",
  "auth-v119.css",
  "channel.js",
  "cinema.js",
  "english-ui-v152.js",
  "firebase-config.js",
  "games.js",
  "icon.svg",
  "platform-redesign-v151.css",
  "stage4-extras.css",
  "tokens.css",
  "ui2.css",
  "welcome.js",
  "index.html",
  "sw.js",
  "v149-scroll-repair.css",
  "v160-aurora.css",
  "v160-aurora.js",
  "v162-global-hub.css",
  "v162-global-hub.js",
  "v163-community-evolution.css",
  "v163-community-evolution.js",
  "v164-platform-expansion.css",
  "v164-platform-expansion.js",
  "v165-squad-universe.css",
  "v165-squad-universe.js",
  "v166-global-connect.css",
  "v168-universe-integration.css",
  "v170-personal-vault.css",
  "v171-achievements.css",
  "v172-events-hub.css",
  "v166-global-connect.js",
  "v168-universe-integration.js",
  "v170-personal-vault.js",
  "v171-achievements.js",
  "v172-events-hub.js",
  "v173-shared-events.css",
  "v175-startup-recovery.js",
  "v173-shared-events.js",
  "v178-civilization.css",
  "v178-civilization.js",
  "v179-living-universe.css",
  "v179-living-universe.js",
  "v180-city-life.css",
  "v180-city-life.js",
  "v181-world-systems.css",
  "v181-world-systems.js",
  "v182-cloud-sync.js",
  "v184-universe-suite.js",
  "v185-universe-cloud-sync.js",
  "v186-control-center.js",
  "v187-call-network.js",
  "v184-universe-suite.css",
  "v185-universe-stability.css",
  "v186-control-center.css",
  "version.json",
  "visual-refresh-v158.css"
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(C);
  await Promise.allSettled(F.map(async p=>{try{const response=await fetch(p,{cache:'reload'});if(response.ok)await cache.put(p,response)}catch(_){}}));
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('squad-')&&key!==C).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||request.headers.has('range'))return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const page=request.mode==='navigate'||url.pathname.endsWith('.html')||url.pathname==='/'||url.pathname.endsWith('/');
  const version=url.pathname.endsWith('/version.json')||url.pathname==='/version.json';
  if(page||version){
    event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(C).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request).then(hit=>hit||caches.match('index.html').then(index=>index||caches.match('./')))));
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(C).then(cache=>cache.put(request,copy));}return response;})));
});
self.addEventListener('push',event=>{let payload={};try{payload=event.data.json()}catch(_){}const data=payload.data||payload;if(!data.title)return;
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{if(clients.some(client=>client.visibilityState==='visible'&&client.focused))return;
  return self.registration.showNotification(data.title,{body:data.body||'',icon:'icon-192.png',badge:'badge-96.png',tag:data.cid||'squad',renotify:true,vibrate:data.kind==='call'?[300,150,300,150,300]:[120],requireInteraction:data.kind==='call',data:{cid:data.cid}})}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();const cid=(event.notification.data||{}).cid;
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{const client=clients[0];if(client){if(cid)client.postMessage({cid});return client.focus();}return self.clients.openWindow('./'+(cid?'?c='+encodeURIComponent(cid):''));}));
});
