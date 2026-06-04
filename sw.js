const CACHE='danduwufang-v4';
const ASSETS=['index.html','manifest.json'];
const FONT_ORIGINS=['db.onlinewebfonts.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  const isFont=FONT_ORIGINS.some(o=>url.hostname===o);
  if(isFont){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>{
      if(r)return r;
      return fetch(e.request).then(resp=>{if(resp.ok)c.put(e.request,resp.clone());return resp;}).catch(()=>new Response('',{status:503}));
    })));
  }else{
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});
