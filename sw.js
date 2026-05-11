// Sonara Service Worker v19
const CACHE = 'sonara-v19';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Jangan ganggu request blob: (audio dari IndexedDB) atau data:
  if (url.protocol === 'blob:' || url.protocol === 'data:') return;

  // Network-first untuk CDN
  if (url.hostname === 'cdn.tailwindcss.com' || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      fetch(e.request).then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first untuk asset lokal — KECUALI index.html (network-first supaya update cepet sampai)
  if (url.origin === self.location.origin) {
    const isHtml = url.pathname === '/' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
    if (isHtml) {
      // Network-first: coba ambil yang baru, kalau offline fallback ke cache
      e.respondWith(
        fetch(e.request).then((r) => {
          if (r.ok) {
            const copy = r.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return r;
        }).catch(() => caches.match(e.request) || caches.match('./index.html'))
      );
      return;
    }
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request).then((r) => {
        if (e.request.method === 'GET' && r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return r;
      }))
    );
  }
});
