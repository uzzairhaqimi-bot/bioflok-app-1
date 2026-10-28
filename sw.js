// Service Worker — App Bioflok Pro (Fasa A: boleh install + skrin luar talian)
// Fasa B akan tambah notifikasi (push) di sini.
const VERSI_CACHE = 'bioflok-app-v1';
const FAIL_ASAS = ['./', './index.html', './config.js', './manifest.webmanifest',
                   './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI_CACHE).then(c => c.addAll(FAIL_ASAS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== VERSI_CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

// Fail app sendiri: cuba internet dahulu (supaya sentiasa terkini), guna simpanan jika luar talian.
// Sistem Apps Script (laman lain) TIDAK diusik — data sentiasa terus dari Google.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const salin = res.clone(); caches.open(VERSI_CACHE).then(c => c.put(e.request, salin)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
