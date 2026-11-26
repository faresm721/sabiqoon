// Minimal service worker: offline shell + hook for Web Push (needs a server to send pushes).
const CACHE = 'sabiqoon-v4';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return; // never cache API/CDN calls
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return res;
  }).catch(() => caches.match(e.request)));
});
// Web Push: fires even when the site is closed
const ICON = 'data:image/png;base64,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';
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { try { d = { body: e.data.text() }; } catch (__) {} }
  e.waitUntil(self.registration.showNotification(d.title || 'سابقون', {
    body: d.body || 'عندك تحدي جديد', icon: ICON, badge: ICON, dir: 'rtl', lang: 'ar', tag: d.tag || ('sbq-' + Date.now()), renotify: true,
    vibrate: [200, 100, 200], requireInteraction: false, data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => { for (const c of cs) { if ('focus' in c) return c.focus(); } return clients.openWindow((e.notification.data && e.notification.data.url) || './'); }));
});
self.addEventListener('pushsubscriptionchange', e => { e.waitUntil(self.clients.matchAll().then(cs => cs.forEach(c => c.postMessage({ type: 'resubscribe' })))); });
