const CACHE_NAME = 'lernprogramm-v1';
const FILES_TO_CACHE = [
  "/scripts/js/sw.js",
  "/scripts/js/navigation.js",
  "/scripts/js/questionloader.js",
  "/scripts/js/rest.js",
  "/scripts/json/fragen.json",
  "/scripts/json/manifest.json",
  "/scripts/css/style.css",
  "/scripts/html/index.html",
  "/images/main_icon.png"
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell...');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Aktiviert');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Entferne alten Cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
