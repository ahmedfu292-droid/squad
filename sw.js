/* The Squad: Service Worker مبسّط. من غير كاش، عشان مفيش ملفات قديمة تتعرض تاني. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  try{const k=await caches.keys();await Promise.all(k.map(x=>caches.delete(x)))}catch(_){}
  await self.clients.claim();
})()));
