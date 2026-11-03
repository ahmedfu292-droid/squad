/* Kill-switch: يشيل أي Service Worker قديم بيعرض نسخة قديمة من The Squad على الجذر.
   النسخة الحقيقية الجديدة بتشتغل من site/sw.js */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  try{const k=await caches.keys();await Promise.all(k.map(x=>caches.delete(x)))}catch(_){}
  try{await self.registration.unregister()}catch(_){}
  try{const cs=await self.clients.matchAll({type:'window'});cs.forEach(c=>c.navigate(c.url))}catch(_){}
})()));
self.addEventListener('fetch',()=>{});
