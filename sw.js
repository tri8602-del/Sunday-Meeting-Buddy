const CACHE = 'smb-sunday-v9';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './w_E_202607.pdf',
  './sjjsm_E.pdf',
  './brutus.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './wt-pages/p-20.png',
  './wt-pages/p-21.png',
  './wt-pages/p-22.png',
  './wt-pages/p-23.png',
  './wt-pages/p-24.png',
  './wt-pages/p-25.png',
  './games/game-01-grow.html',
  './games/game-02-baskets.html',
  './games/game-03-paradise.html',
  './games/game-04-heart.html',
  './games/game-05-scene.html',
  './games/game-06-cockpit.html',
  './games/game-07-crossword.html',
  './games/game-08-madlibs.html',
  './games/game-09-lenses.html',
  './games/game-11-gifts.html',
  './games/game-12-maze.html',
  './games/game-14-diff.html',
  './games/game-15-puzzle.html',
  './games/game-17-search.html',
  './games/game-18-chests.html',
  './games/game-19-review.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(res => {
        if (res && res.ok && res.type !== 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => cached || caches.match('./index.html'));
      return cached || fetched;
    })
  );
});
