/* LifeOS service worker — offline shell + web push */

const CACHE = 'lifeos-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Never cache GitHub API calls — always hit the network, fail cleanly when offline.
   The app shell (index.html, or any navigation) is network-first: this app changes
   often, and a stale cached copy served ahead of a fresh one means every deploy
   needs a manual force-reload to actually see. Fall back to cache only when the
   network truly fails. Everything else (icons, manifest) stays cache-first,
   refreshed in the background — those rarely change and benefit from being instant. */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname === 'api.github.com' || e.request.method !== 'GET') return;

  const isShell = e.request.mode === 'navigate' || url.pathname.endsWith('/index.html');
  if (isShell) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res && res.status === 200 && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});

self.addEventListener('push', e => {
  let d = { title: 'LifeOS', body: 'Time to log something.', url: './index.html' };
  try { if (e.data) d = Object.assign(d, e.data.json()); } catch (err) {
    if (e.data) d.body = e.data.text();
  }
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: d.tag || 'lifeos',
    data: { url: d.url || './index.html' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || './index.html';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      return self.clients.openWindow(target);
    })
  );
});
