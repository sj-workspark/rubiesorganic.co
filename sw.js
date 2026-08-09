const CACHE_NAME = 'rubies-organic-shell-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/offline.js',
  '/manifest.webmanifest',
  '/style.css',
  '/javascript.js',
  '/shop.js',
  '/contact.js',
  '/script.js',
  '/logistics.js',
  '/rubiesorganic.webp',
  '/backgroundimg.png',
  '/rubiesorganicoilimg.png',
  '/coconutgari.jpg',
  '/granula.jpg',
  '/freshcoconutwaterbottles.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/offline.html').then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request.url, copy));
          }
          return response;
        })
        .catch(() => caches.match('/offline.html'));
    })
  );
});
