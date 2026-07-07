// Halo: service worker
// Caches the app shell so it works fully offline once installed.
// All financial data lives in IndexedDB on the device, never here, never remote.
//
// IMPORTANT: bump CACHE_NAME every time you push a real update (e.g. v2, v3...).
// That's what makes the browser notice this file changed and refresh the cache.
// The page itself uses network-first below, so most updates show up without
// even needing a bump, but bumping is a safe belt-and-braces habit.

const CACHE_NAME = 'halo-cache-v32';
const APP_SHELL = [
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // The app page (index.html / navigations): always try the network first so
  // updates show up right away. Only fall back to the cached copy if offline.
  const isAppPage = req.mode === 'navigate' || req.url.endsWith('/index.html') || req.url.endsWith('/');
  if (isAppPage) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Everything else (icons, manifest, fonts, the OCR library from its CDN): cache-first, since these rarely change.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache same-origin ("basic") and opaque cross-origin responses (e.g. CDN scripts loaded
          // without CORS) alike, so the OCR library still works offline after its first download.
          if (res && (res.status === 200 || res.type === 'opaque')) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => new Response('', { status: 504 }));
    })
  );
});

