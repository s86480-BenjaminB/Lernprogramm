const CACHE_NAME = 'lernapp-cache-v1';

const urlsToCache = [
  '/index.html',
  '/scripts/css/style.css',
  '/scripts/js/navigation.js',
  '/scripts/js/rest.js',
  '/scripts/js/questionloader.js',
  '/scripts/json/fragen.json',
  '/scripts/json/manifest.json',
  '/images/main_icon.png',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn(`⚠️ Konnte ${url} nicht cachen:`, err);
        }
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      // Wenn offline + fetch fehlschlägt
      return fetch(event.request).catch(() => {
        const req = event.request;

        // Mathefragen fallback
        if (req.url.includes('fragen.json')) {
          return caches.match('/scripts/json/fragen.json');
        }

        // HTML-Fallback für index.html
        if (req.destination === 'document') {
          return caches.match('/scripts/html/index.html');
        }

        return new Response('Offline – keine passende Ressource gefunden.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

