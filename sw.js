const CACHE_NAME = 'naohai-disc-v1';
const ASSETS = [
  './index.html',
  './portraits/nezha.png',
  './portraits/aobing.png',
  './portraits/lutong.png',
  './portraits/hetong.png',
  './portraits/shengongbao.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return res;
    })).catch(() => caches.match('./index.html'))
  );
});
