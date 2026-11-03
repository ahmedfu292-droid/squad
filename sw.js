/* The Squad v160: cache only real, verified local entry assets. Other same-origin
   assets are cached on first successful fetch. HTML and release metadata are network-first. */
const C='squad-v187-call-network';
const F=[
  "./",
  "chanse1/ads.js",
  "chanse1/app.js",
  "chanse1/auth.css",
  "chanse1/auth.js",
  "chanse1/badge-96.png",
  "chanse1/community.js",
  "chanse1/district-core.js",
  "chanse1/gold.css",
  "chanse1/living-palace-premium.css",
  "chanse1/look.js",
  "chanse1/luxe.js",
  "chanse1/manifest.json",
  "chanse1/push.js",
  "chanse1/squad.css",
  "chanse1/theme.js",
  "chanse1/time.js",
  "chanse1/ui2.js",
  "chanse1/v27.css",
  "chanse2/apple-touch-icon.png",
  "chanse2/assets/design/auth-login-v121.png",
  "chanse2/auth-scene.js",
  "chanse2/cafe2.js",
  "chanse2/district.js",
  "chanse2/extras.js",
  "chanse2/living-palace.css",
  "chanse2/premium-refinement-v89.css",
  "chanse2/profile.js",
  "chanse2/stage4-chat-ui.css",
  "chanse2/stage4-extras.js",
  "chanse2/stories.js",
  "chanse2/world.js",
  "chanse3/accounts.js",
  "chanse3/acct.js",
  "chanse3/admin-monitor.css",
  "chanse3/admin-monitor.js",
  "chanse3/auth-v121.css",
  "chanse3/bot.js",
  "chanse3/cafe.js",
  "chanse3/cafe3.js",
  "chanse3/calls.js",
  "chanse3/chatx.js",
  "chanse3/icon-192.png",
  "chanse3/index.html",
  "chanse3/living-palace-engine.js",
  "chanse3/luxe.css",
  "chanse3/performance-v144.css",
  "chanse3/plus.js",
  "chanse3/quality-polish-v120.css",
  "chanse3/services-hub.html",
  "chanse3/settings.js",
  "chanse3/social-expansion.css",
  "chanse3/social-expansion.js",
  "chanse3/social-feed.js",
  "chanse3/stage4-chat-ui.js",
  "chanse4/app-preview.html",
  "chanse4/auth-v119.css",
  "chanse4/channel.js",
  "chanse4/cinema.js",
  "chanse4/english-ui-v152.js",
  "chanse4/firebase-config.js",
  "chanse4/games.js",
  "chanse4/icon.svg",
  "chanse4/platform-redesign-v151.css",
  "chanse4/stage4-extras.css",
  "chanse4/tokens.css",
  "chanse4/ui2.css",
  "chanse4/welcome.js",
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
  return self.registration.showNotification(data.title,{body:data.body||'',icon:'chanse3/icon-192.png',badge:'chanse1/badge-96.png',tag:data.cid||'squad',renotify:true,vibrate:data.kind==='call'?[300,150,300,150,300]:[120],requireInteraction:data.kind==='call',data:{cid:data.cid}})}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();const cid=(event.notification.data||{}).cid;
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{const client=clients[0];if(client){if(cid)client.postMessage({cid});return client.focus();}return self.clients.openWindow('./'+(cid?'?c='+encodeURIComponent(cid):''));}));
});
