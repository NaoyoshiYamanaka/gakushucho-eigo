/* ============================================================
   学習帖 — 英語 / Service Worker
   ============================================================
   キャッシュ戦略:
   - app shell (HTML, manifest, icons): cache-first（オフライン優先）
   - Google Fonts CSS & font files: stale-while-revalidate
   - その他: ネットワーク優先

   キャッシュ名は CACHE_VERSION で管理。アプリを更新したら数字を上げる。
   ============================================================ */

const CACHE_VERSION = 'v2-2026-05-18-midterm';
const CACHE_NAME = `gakushucho-eigo-${CACHE_VERSION}`;
const FONTS_CACHE = `gakushucho-eigo-fonts-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './英語.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
];

/* --- install: pre-cache app shell --- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL).catch((e) => {
        // best-effort: don't fail install if one resource missing
        console.warn('[SW] addAll partial fail', e);
      }))
      .then(() => self.skipWaiting())
  );
});

/* --- activate: remove old caches --- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((k) => k !== CACHE_NAME && k !== FONTS_CACHE)
        .map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* --- fetch: routing by request type --- */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Google Fonts -> stale-while-revalidate in FONTS_CACHE
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req, FONTS_CACHE));
    return;
  }

  // 2. Same-origin (our app) -> cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req, CACHE_NAME));
    return;
  }

  // 3. Other origins -> network only (no caching)
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    // cache successful responses
    if (fresh && fresh.status === 200 && fresh.type !== 'opaque') {
      const cache = await caches.open(cacheName);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (err) {
    // last resort: return the cached index page
    const fallback = await caches.match('./英語.html');
    if (fallback) return fallback;
    throw err;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => null);
  return cached || (await network) || Response.error();
}
